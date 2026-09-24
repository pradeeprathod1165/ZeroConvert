import { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { generateId } from '../utils/helpers';

export default function DropZone({ onFilesAdded }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processDroppedFiles = (fileList) => {
    const validFiles = Array.from(fileList).map((file) => ({
      id: generateId(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type || '',
      status: 'Ready',
      targetFormat: '',
      progress: 0,
      outputUrl: null,
      outputExtension: null,
      error: null
    }));

    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processDroppedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processDroppedFiles(e.target.files);
      e.target.value = null;
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full max-w-3xl mx-auto p-7 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-3 sm:gap-4 group ${
        isDragging
          ? 'border-indigo-500 bg-indigo-500/10'
          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50'
      }`}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="p-3.5 sm:p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
        <UploadCloud size={28} strokeWidth={1.5} />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm sm:text-base font-medium text-zinc-200">
          Drop files here or click to browse
        </p>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-xs sm:max-w-none mx-auto">
          All processing happens securely in your browser. No data leaves this device.
        </p>
      </div>
    </div>
  );
}