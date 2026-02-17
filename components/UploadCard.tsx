'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export default function UploadCard({
  onFileSelect,
  selectedFile,
  onClear,
  disabled,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((file: File) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      setError('Only PDF and DOCX files are allowed.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB.');
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && validate(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validate]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validate(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validate]
  );

  return (
    <motion.div
      layout
      className="glass rounded-2xl p-6 border border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragging ? 'border-cyan-400/60 bg-cyan-500/5' : 'border-slate-600/50 hover:border-slate-500'}
          ${disabled ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 w-full max-w-xs justify-center">
              <FileText className="w-8 h-8 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-200 truncate text-sm font-medium">
                {selectedFile.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear();
                }}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">PDF or DOCX, max 5MB</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-medium mb-1">
              Drag & drop your resume here
            </p>
            <p className="text-slate-500 text-sm">or click to browse</p>
            <p className="text-xs text-slate-600 mt-2">PDF or DOCX, max 5MB</p>
          </>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
