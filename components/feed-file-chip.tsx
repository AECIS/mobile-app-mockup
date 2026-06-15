import React from 'react';
import { FileText } from 'lucide-react';
import { FeedAttachment } from '../types';

// ---------------------------------------------------------------------------
// Shared file attachment chip(s) for non-image attachments - used by the feed
// card preview AND the detail thread so file chips look identical everywhere.
// ---------------------------------------------------------------------------
const FileChip: React.FC<{ file: FeedAttachment }> = ({ file }) => (
  <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 rounded-lg px-2.5 py-1.5 max-w-full">
    <FileText size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">{file.name}</span>
    {file.size && <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{file.size}</span>}
  </div>
);

// Flex-wrap list of file chips
export const FileChipList: React.FC<{ files: FeedAttachment[] }> = ({ files }) => {
  if (files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {files.map((f) => (
        <FileChip key={f.id} file={f} />
      ))}
    </div>
  );
};

export default FileChip;
