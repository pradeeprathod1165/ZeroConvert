import { useState, useRef, useEffect } from 'react';
import { File, CheckCircle2, Clock, XCircle, X, Download, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { formatBytes } from '../utils/helpers';

const StatusBadge = ({ status }) => {
  const styles = {
    Ready: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    Processing: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 animate-pulse',
    Completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Error: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };

  const icons = {
    Ready: <Clock size={12} className="mr-1.5 shrink-0" />,
    Processing: <Clock size={12} className="mr-1.5 shrink-0" />,
    Completed: <CheckCircle2 size={12} className="mr-1.5 shrink-0" />,
    Error: <XCircle size={12} className="mr-1.5 shrink-0" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

// Custom React Dropdown that stays strictly anchored inside mobile viewports
const FormatDropdown = ({ value, options, disabled, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-xs sm:text-sm text-zinc-200 rounded-lg px-3 py-1.5 min-w-[105px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer transition-colors"
      >
        <span className={value ? 'text-zinc-100 font-medium' : 'text-zinc-400'}>
          {value || 'Format'}
        </span>
        <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute right-0 mt-1.5 w-40 max-h-56 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-1 z-50 divide-y divide-zinc-800/50">
          {options.map((fmt) => {
            const isSelected = value === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => {
                  onChange(fmt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold' 
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <span>{fmt}</span>
                {isSelected && <Check size={14} className="text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Smart utility to filter formats based on input type
const getAvailableFormats = (fileType, fileName) => {
  const type = (fileType || '').toLowerCase();
  const ext = fileName.split('.').pop().toLowerCase();
  
  if (type.startsWith('image/') || ['heic', 'svg'].includes(ext)) {
    return ['JPG', 'PNG', 'WEBP', 'AVIF', 'PDF'];
  }
  if (type.startsWith('video/') || ['mp4', 'mov', 'webm', 'mkv', 'avi'].includes(ext)) {
    return ['MP4', 'MP4 (Compress)', 'WEBM', 'AVI', 'MP3', 'GIF'];
  }
  if (type.startsWith('audio/') || ['mp3', 'wav', 'aac', 'ogg'].includes(ext)) {
    return ['MP3'];
  }
  if (type === 'application/pdf' || ext === 'pdf') {
    return ['PNG']; 
  }
  if (ext === 'csv' || ext === 'json' || ext === 'xlsx' || type.includes('spreadsheet') || type.includes('excel')) {
    return ['CSV', 'JSON', 'XLSX'].filter(f => f.toLowerCase() !== ext);
  }
  
  return [];
};

export default function FileQueue({ files, onUpdateFormat, onRemoveFile }) {
  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 sm:mt-8 flex flex-col gap-3">
      {files.map((file) => {
        const availableFormats = getAvailableFormats(file.type, file.name);

        return (
          <div 
            key={file.id} 
            // Note: overflow-visible is required so the custom dropdown menu can extend cleanly over cards below it
            className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm hover:border-zinc-700 transition-colors overflow-visible"
          >
            {/* Responsive Flex Container: Stacks on mobile, single row on tablet/desktop */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-3 relative">
              
              {/* Top Row on Mobile: File Icon, Full Filename, and Mobile Remove Button */}
              <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400 shrink-0">
                    <File size={18} />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-zinc-200 truncate" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-xs text-zinc-500">{formatBytes(file.size)}</span>
                  </div>
                </div>

                {/* Mobile-only top-right action button to save horizontal space below */}
                <div className="sm:hidden shrink-0">
                  {file.status === 'Completed' && file.outputUrl ? (
                    <a
                      href={file.outputUrl}
                      download={`converted_${file.name.split('.')[0]}.${file.outputExtension}`}
                      className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg inline-flex transition-colors"
                      title="Download File"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <button
                      onClick={() => onRemoveFile(file.id)}
                      disabled={file.status === 'Processing'}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 disabled:opacity-50"
                      aria-label="Remove file"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row on Mobile / Right Side on Desktop: Status Badge + Custom Format Selector */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-zinc-800/60 sm:border-0 shrink-0">
                <StatusBadge status={file.status} />
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">to</span>
                  <FormatDropdown
                    value={file.targetFormat}
                    options={availableFormats}
                    disabled={file.status === 'Processing' || file.status === 'Completed' || availableFormats.length === 0}
                    onChange={(newFormat) => onUpdateFormat(file.id, newFormat)}
                  />
                </div>

                {/* Desktop Action Button */}
                <div className="hidden sm:flex items-center">
                  {file.status === 'Completed' && file.outputUrl ? (
                    <a
                      href={file.outputUrl}
                      download={`converted_${file.name.split('.')[0]}.${file.outputExtension}`}
                      className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-md transition-colors"
                      title="Download File"
                    >
                      <Download size={18} />
                    </a>
                  ) : (
                    <button
                      onClick={() => onRemoveFile(file.id)}
                      disabled={file.status === 'Processing'}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 disabled:opacity-50 cursor-pointer"
                      aria-label="Remove file"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {(file.status === 'Processing' || file.error) && (
              <div className="w-full bg-zinc-950/50 px-4 py-2 border-t border-zinc-800/50 flex flex-col gap-2 rounded-b-xl">
                {file.status === 'Processing' && (
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300 ease-out" 
                      style={{ width: `${file.progress || 0}%` }}
                    />
                  </div>
                )}
                {file.error && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400">
                    <AlertCircle size={14} className="shrink-0" />
                    <span className="break-words">{file.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}