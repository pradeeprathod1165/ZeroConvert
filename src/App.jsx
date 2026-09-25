import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DropZone from './components/DropZone';
import FileQueue, { FormatDropdown, getAvailableFormats } from './components/FileQueue';
import { 
  HowItWorksSection, 
  PrivacyGuaranteeSection, 
  FaqSection, 
  PopularConvertersSection, 
  SEO_LANDING_PAGES 
} from './components/SeoSections';
import { AboutPage, ContactPage, TermsPage, AdSensePrivacyDisclosure } from './components/LegalPages';
import { Loader2, Download, Zap, Lock, ArrowLeft, Trash2 } from 'lucide-react';
import { processImage } from './utils/imageEngine';
import { imagesToPdf, pdfToImages } from './utils/pdfEngine';
import { initFFmpeg, processAudioVideo } from './utils/ffmpegEngine';
import { processDataFile } from './utils/dataEngine';
import { generateZip } from './utils/zipExport';

// Updates the browser tab title ONLY for the currently active URL route
function SeoTitleUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (SEO_LANDING_PAGES[pathname]) {
      document.title = SEO_LANDING_PAGES[pathname].title;
    }
  }, [pathname]);
  return null;
}

function App() {
  const [files, setFiles] = useState([]);
  const [globalFormat, setGlobalFormat] = useState('');
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

  // 1. Updates all compatible 'Ready' files when you pick a format in the Master Selector
  const handleUpdateAllFormats = (newFormat) => {
    setGlobalFormat(newFormat);
    setFiles((prev) =>
      prev.map((f) => {
        if (f.status !== 'Ready') return f;
        const supported = getAvailableFormats(f.type, f.name);
        if (supported.includes(newFormat)) {
          return { ...f, targetFormat: newFormat, error: null };
        }
        return f;
      })
    );
  };

  // 2. Wipes the active queue and frees browser RAM
  const handleClearQueue = () => {
    files.forEach((f) => {
      if (f.outputUrl) URL.revokeObjectURL(f.outputUrl);
    });
    setFiles([]);
    setGlobalFormat('');
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
    const needsVideoEngine = filesToProcess.some(f => 
      ['MP3', 'MP4', 'MP4 (Compress)', 'WEBM', 'AVI', 'GIF'].includes(f.targetFormat)
    );
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
      imageToPdfFiles.forEach(f => updateFileState(f.id, { status: 'Processing', progress: 0, error: null }));
      
      try {
        const rawFiles = imageToPdfFiles.map(f => f.file);
        const result = await imagesToPdf(rawFiles, (progressValue) => {
          imageToPdfFiles.forEach(f => updateFileState(f.id, { progress: progressValue }));
        });

        imageToPdfFiles.forEach(f => {
          updateFileState(f.id, { 
            status: 'Completed', 
            progress: 100, 
            outputUrl: result.url,
            outputExtension: result.extension,
            name: `Merged_Images.${result.extension}`
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

  const masterFormatOptions = Array.from(
    new Set(
      files
        .filter((f) => f.status === 'Ready')
        .flatMap((f) => getAvailableFormats(f.type, f.name))
    )
  );

  // Dynamically renders the Converter + SEO Sections with keyword-targeted H1 and Title
  const renderConverterPage = (pathKey = '/') => {
    const seoData = SEO_LANDING_PAGES[pathKey] || SEO_LANDING_PAGES['/'];

    return (
      <>
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-16 md:py-24">
          <div className="w-full max-w-3xl text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-semibold text-zinc-100 tracking-tight mb-5">
              {seoData.h1}
            </h1>
            <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {seoData.subtitle}
            </p>
          </div>

          <DropZone onFilesAdded={handleFilesAdded} />
          
          {files.length > 0 && (
            <div className="w-full max-w-3xl mx-auto mt-12 sm:mt-16 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              
              {/* Left Side: Active Queue Counter + Master Format Dropdown */}
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-medium text-zinc-200">
                    Active Queue
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {files.length}
                  </span>
                </div>

                {masterFormatOptions.length > 0 && (
                  <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl">
                    <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">
                      Convert all to:
                    </span>
                    <FormatDropdown
                      value={globalFormat}
                      options={masterFormatOptions}
                      disabled={isProcessingGlobal}
                      onChange={handleUpdateAllFormats}
                      placeholder="Select..."
                    />
                  </div>
                )}
              </div>

              {/* Right Side: Clear Queue, Download ZIP, and Convert All Buttons */}
              <div className="flex items-center gap-2.5 w-full lg:w-auto">
                <button
                  onClick={handleClearQueue}
                  disabled={isProcessingGlobal}
                  className="p-2 text-zinc-400 hover:text-rose-400 bg-zinc-900 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/20 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  title="Clear Queue"
                >
                  <Trash2 size={16} />
                </button>

                {canDownloadZip && (
                  <button
                    onClick={handleDownloadZip}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 text-sm font-medium rounded-lg transition-colors border border-emerald-500/20 cursor-pointer"
                  >
                    <Download size={16} />
                    Download ZIP
                  </button>
                )}

                <button
                  onClick={handleStartConversion}
                  disabled={!canConvert}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        </div>

        <HowItWorksSection />
        <PrivacyGuaranteeSection />
        <FaqSection />
        <PopularConvertersSection />
      </>
    );
  };

  return (
    <BrowserRouter>
    <SeoTitleUpdater />
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

        <main className="flex-1 w-full">
          <Routes>
            {/* Automatically generates Home ("/") + all 8 High-Volume Keyword Landing Pages */}
            {Object.keys(SEO_LANDING_PAGES).map((routePath) => (
              <Route
                key={routePath}
                path={routePath}
                element={renderConverterPage(routePath)}
              />
            ))}

            {/* Dedicated Multi-Page SEO Route: /how-it-works */}
            <Route path="/how-it-works" element={
              <div className="pt-8">
                <div className="max-w-5xl mx-auto px-6">
                  <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                    <ArrowLeft size={16} /> Back to File Converter
                  </Link>
                </div>
                <HowItWorksSection isStandalonePage={true} />
                <PopularConvertersSection />
              </div>
            } />

            {/* Dedicated Multi-Page SEO Route: /privacy (Includes AdSense Cookie Disclosure) */}
            <Route path="/privacy" element={
              <div className="pt-8">
                <div className="max-w-5xl mx-auto px-6">
                  <Link to="/" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                    <ArrowLeft size={16} /> Back to File Converter
                  </Link>
                </div>
                <PrivacyGuaranteeSection isStandalonePage={true} />
                <AdSensePrivacyDisclosure />
              </div>
            } />

            {/* Dedicated Multi-Page SEO Route: /faq */}
            <Route path="/faq" element={
              <div className="pt-8">
                <div className="max-w-4xl mx-auto px-6">
                  <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                    <ArrowLeft size={16} /> Back to File Converter
                  </Link>
                </div>
                <FaqSection isStandalonePage={true} />
                <PopularConvertersSection />
              </div>
            } />

            {/* Mandatory AdSense Authenticity Route: /about */}
            <Route path="/about" element={
              <div className="pt-8">
                <div className="max-w-4xl mx-auto px-6">
                  <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                    <ArrowLeft size={16} /> Back to File Converter
                  </Link>
                </div>
                <AboutPage />
              </div>
            } />

            {/* Mandatory AdSense Authenticity Route: /contact */}
            <Route path="/contact" element={
              <div className="pt-8">
                <div className="max-w-4xl mx-auto px-6">
                  <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                    <ArrowLeft size={16} /> Back to File Converter
                  </Link>
                </div>
                <ContactPage />
              </div>
            } />

            {/* Mandatory Legal Route: /terms */}
            <Route path="/terms" element={
              <div className="pt-8">
                <div className="max-w-4xl mx-auto px-6">
                  <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                    <ArrowLeft size={16} /> Back to File Converter
                  </Link>
                </div>
                <TermsPage />
              </div>
            } />
          </Routes>
        </main>

        <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-8 px-6 mt-auto">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <Link to="/privacy" className="flex flex-col items-center md:items-start text-zinc-500 text-sm gap-1 hover:text-zinc-300 transition-colors">
              <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                <Lock size={14} className="text-emerald-400" />
                100% Private & Secure
              </div>
              <p>No files ever leave this device.</p>
            </Link>
            
            {/* Google AdSense Policy-Compliant Ad Slot (No "Support this tool" click-incentive text) */}
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-zinc-900/60 border border-zinc-800/80 rounded-lg text-[11px] text-zinc-500 tracking-wider uppercase text-center w-full max-w-xs">
                Advertisement
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2 text-sm text-zinc-500">
              <Link to="/how-it-works" className="hover:text-zinc-300 transition-colors">How it Works</Link>
              <Link to="/faq" className="hover:text-zinc-300 transition-colors">FAQ</Link>
              <Link to="/about" className="hover:text-zinc-300 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link>
              <Link to="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;