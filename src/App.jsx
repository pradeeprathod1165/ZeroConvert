import { useState } from 'react';
import Navbar from './components/Navbar';
import DropZone from './components/DropZone';
import FileQueue from './components/FileQueue';
import { Loader2, Download, Zap, Lock } from 'lucide-react';
import { processImage } from './utils/imageEngine';
import { imagesToPdf, pdfToImages } from './utils/pdfEngine';
import { initFFmpeg, processAudioVideo } from './utils/ffmpegEngine';
import { generateZip } from './utils/zipExport';
import { processDataFile } from './utils/dataEngine';

function App() {
  const [files, setFiles] = useState([]);
  const [isProcessingGlobal, setIsProcessingGlobal] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [engineState, setEngineState] = useState({ isInitializing: false, message: '' });

  const handleFilesAdded = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUpdateFormat = (fileId, newFormat) => {
    setFiles((prev) => 
      prev.map((f) => f.id === fileId ? { ...f, targetFormat: newFormat, error: null } : f)
    );
  };

  const handleRemoveFile = (fileId) => {
    setFiles((prev) => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.outputUrl) URL.revokeObjectURL(fileToRemove.outputUrl);
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const updateFileState = (id, updates) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleStartConversion = async () => {
    setIsProcessingGlobal(true);
    const filesToProcess = files.filter(f => f.status === 'Ready' && f.targetFormat);

    // 1. Pre-flight check for FFmpeg dependencies
    const needsVideoEngine = filesToProcess.some(f => ['MP3', 'MP4', 'GIF'].includes(f.targetFormat));
    if (needsVideoEngine) {
      setEngineState({ isInitializing: true, message: 'Initializing Media Engine (Downloading WASM Core)...' });
      try {
        await initFFmpeg();
      } catch (error) {
        alert(error.message);
        setIsProcessingGlobal(false);
        setEngineState({ isInitializing: false, message: '' });
        return;
      }
      setEngineState({ isInitializing: false, message: '' });
    }

    // 2. Separate files into batch-PDF groups vs standard processing
    const imageToPdfFiles = filesToProcess.filter(f => f.file.type.startsWith('image/') && f.targetFormat === 'PDF');
    const standardFiles = filesToProcess.filter(f => !imageToPdfFiles.includes(f));

    // 3. Process Batch Images to PDF
    if (imageToPdfFiles.length > 0) {
      // Set all to processing
      imageToPdfFiles.forEach(f => updateFileState(f.id, { status: 'Processing', progress: 0, error: null }));
      
      try {
        const rawFiles = imageToPdfFiles.map(f => f.file);
        const result = await imagesToPdf(rawFiles, (progressValue) => {
          // Sync progress across all files in the batch
          imageToPdfFiles.forEach(f => updateFileState(f.id, { progress: progressValue }));
        });

        // Apply the same output URL to all items so clicking download on any gives the bundled PDF
        imageToPdfFiles.forEach(f => {
          updateFileState(f.id, { 
            status: 'Completed', 
            progress: 100, 
            outputUrl: result.url,
            outputExtension: result.extension,
            name: `Merged_Images.${result.extension}` // Visually indicate it merged
          });
        });
      } catch (error) {
        imageToPdfFiles.forEach(f => {
          updateFileState(f.id, { status: 'Error', error: error.message || 'PDF Merge failed.' });
        });
      }
    }

    // 4. Process Standard Files (1-to-1)
    for (const fileObj of standardFiles) {
      updateFileState(fileObj.id, { status: 'Processing', progress: 0, error: null });

      try {
        let result;
        const progressCallback = (progressValue) => updateFileState(fileObj.id, { progress: progressValue });

       if (fileObj.file.type === 'application/pdf') {
          result = await pdfToImages(fileObj.file, progressCallback);
        } else if (['MP3', 'MP4', 'MP4 (Compress)', 'WEBM', 'AVI', 'GIF'].includes(fileObj.targetFormat)) {
          result = await processAudioVideo(fileObj.file, fileObj.targetFormat, progressCallback);
        } else if (['JPG', 'PNG', 'WEBP', 'AVIF'].includes(fileObj.targetFormat)) {
          result = await processImage(fileObj.file, fileObj.targetFormat, progressCallback);
        } else if (['CSV', 'JSON', 'XLSX'].includes(fileObj.targetFormat)) {
          // Route to our new Data Engine
          result = await processDataFile(fileObj.file, fileObj.targetFormat, progressCallback);
        } else {
          throw new Error(`Format combination not supported.`);
        }
        updateFileState(fileObj.id, { 
          status: 'Completed', 
          progress: 100, 
          outputUrl: result.url,
          outputExtension: result.extension
        });

      } catch (error) {
        updateFileState(fileObj.id, { 
          status: 'Error', 
          error: error.message || 'Conversion failed.'
        });
      }
    }

    setIsProcessingGlobal(false);
  };

  const handleDownloadZip = async () => {
    const completedFiles = files.filter(f => f.status === 'Completed' && f.outputUrl);
    if (completedFiles.length === 0) return;

    setIsZipping(true);
    setZipProgress(0);

    try {
      const zipUrl = await generateZip(completedFiles, (progress) => setZipProgress(progress));
      
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `zeroconvert_export_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(zipUrl), 2000);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsZipping(false);
    }
  };

  const canConvert = files.length > 0 && !isProcessingGlobal && files.some(f => f.status === 'Ready' && f.targetFormat);
  const completedFilesCount = files.filter(f => f.status === 'Completed').length;
  const canDownloadZip = completedFilesCount > 1;

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-zinc-950 text-zinc-50 font-sans">
      
      <Navbar />

      {engineState.isInitializing && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
          <p className="text-lg font-medium text-zinc-200">{engineState.message}</p>
          <p className="text-sm text-zinc-500 mt-2">This only happens once per session.</p>
        </div>
      )}

      {isZipping && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
          <p className="text-lg font-medium text-zinc-200">Compressing files...</p>
          <div className="w-64 h-2 bg-zinc-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${zipProgress}%` }} />
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-16 md:py-24 pb-24">
        
        <div className="w-full max-w-3xl text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-semibold text-zinc-100 tracking-tight mb-5">
            Private Batch Converter
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            A 100% client-side conversion tool. Your files never leave your device, ensuring complete privacy and maximum speed.
          </p>
        </div>

        <DropZone onFilesAdded={handleFilesAdded} />
        
        {files.length > 0 && (
          <div className="w-full max-w-3xl mx-auto mt-16 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-medium text-zinc-200">
              Active Queue
            </h2>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              {canDownloadZip && (
                <button
                  onClick={handleDownloadZip}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 text-sm font-medium rounded-lg transition-colors border border-emerald-500/20"
                >
                  <Download size={16} />
                  Download ZIP
                </button>
              )}
              
              <button
                onClick={handleStartConversion}
                disabled={!canConvert}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingGlobal ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                {isProcessingGlobal ? 'Processing...' : 'Convert All'}
              </button>
            </div>
          </div>
        )}

        <FileQueue 
          files={files} 
          onUpdateFormat={handleUpdateFormat}
          onRemoveFile={handleRemoveFile}
        />
      </main>

      <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start text-zinc-500 text-sm gap-1">
            <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
              <Lock size={14} />
              100% Private & Secure
            </div>
            <p>No files ever leave this device.</p>
          </div>
          
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-500 tracking-wide text-center w-full max-w-xs">
              Ad Space • <a href="#" className="text-indigo-400 hover:underline transition-colors">Support this free tool</a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;