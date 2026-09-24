import { useState, useCallback, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { generateId } from '../utils/helpers';

export default function DropZone({ onFilesAdded }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = (fileList) => {
    try {
      const newFiles = Array.from(fileList).map((file) => ({
        id: generateId(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'Ready',
        targetFormat: '',
      }));
      onFilesAdded(newFiles);
    } catch (error) {
      console.error("Error processing dropped files. Memory or permission issue:", error);
      alert("An error occurred while reading the files. Please try again.");
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [onFilesAdded]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = null; 
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full max-w-3xl mx-auto mt-8 p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-4 group
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-900/50'
        }`}
    >
      <input
        type="file"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInput}
      />
      <div className={`p-4 rounded-full transition-colors duration-200 ${isDragging ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-300'}`}>
        <UploadCloud size={32} />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-zinc-200 mb-1">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-zinc-500">
          All processing happens securely in your browser. No data leaves this device.
        </p>
      </div>
    </div>
  );
}