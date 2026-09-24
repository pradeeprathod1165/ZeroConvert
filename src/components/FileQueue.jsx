import { File, CheckCircle2, Clock, XCircle, X, Download, AlertCircle } from 'lucide-react';
import { formatBytes } from '../utils/helpers';

const StatusBadge = ({ status }) => {
  const styles = {
    Ready: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    Processing: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 animate-pulse',
    Completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Error: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };

  const icons = {
    Ready: <Clock size={12} className="mr-1.5" />,
    Processing: <Clock size={12} className="mr-1.5" />,
    Completed: <CheckCircle2 size={12} className="mr-1.5" />,
    Error: <XCircle size={12} className="mr-1.5" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

// Smart utility to filter formats based on input type
const getAvailableFormats = (fileType, fileName) => {
  const type = fileType.toLowerCase();
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
  // New Data / Spreadsheet formats
  if (ext === 'csv' || ext === 'json' || ext === 'xlsx' || type.includes('spreadsheet') || type.includes('excel')) {
    // Filter out the current extension so they don't convert CSV to CSV
    return ['CSV', 'JSON', 'XLSX'].filter(f => f.toLowerCase() !== ext);
  }
  
  return []; 
};

export default function FileQueue({ files, onUpdateFormat, onRemoveFile }) {
  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 flex flex-col gap-3">
      {files.map((file) => {
        const availableFormats = getAvailableFormats(file.type, file.name);

        return (
          <div 
            key={file.id} 
            className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg shadow-sm hover:border-zinc-700 transition-colors overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 relative z-10">
              <div className="flex items-center gap-4 overflow-hidden flex-1">
                <div className="p-2 bg-zinc-800 rounded-md text-zinc-400">
                  <File size={20} />
                </div>
                <div className="flex flex-col truncate pr-4">
                  <span className="text-sm font-medium text-zinc-200 truncate">{file.name}</span>
                  <span className="text-xs text-zinc-500">{formatBytes(file.size)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 shrink-0">
                <StatusBadge status={file.status} />
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 hidden md:inline">to</span>
                  <select
                    value={file.targetFormat}
                    onChange={(e) => onUpdateFormat(file.id, e.target.value)}
                    disabled={file.status === 'Processing' || file.status === 'Completed' || availableFormats.length === 0}
                    className="bg-zinc-950 border border-zinc-700 text-sm text-zinc-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 min-w-[80px]"
                  >
                    <option value="" disabled>Format</option>
                    {availableFormats.map(fmt => (
                      <option key={fmt} value={fmt}>{fmt}</option>
                    ))}
                  </select>
                </div>

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
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 disabled:opacity-50"
                    aria-label="Remove file"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            
            {(file.status === 'Processing' || file.error) && (
              <div className="w-full bg-zinc-950/50 px-4 py-2 border-t border-zinc-800/50 flex flex-col gap-2">
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
                    <AlertCircle size={14} />
                    <span>{file.error}</span>
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