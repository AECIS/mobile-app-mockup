import React, { useRef, useEffect } from 'react';
import MarkdownToolbar from './markdown-toolbar';

// Controlled markdown editor: formatting toolbar + auto-growing textarea.
// Stores raw markdown. Enter = newline; Cmd/Ctrl+Enter = submit.
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
  maxHeight?: number; // px before scrolling (default 140)
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write a comment…',
  onSubmit,
  autoFocus,
  maxHeight = 140,
  className = '',
}) => {
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow to content height, capped at maxHeight.
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
  }, [value, maxHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div
      className={`bg-[#fafafa] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3b82f6]/20 focus-within:border-[#3b82f6] transition-colors ${className}`}
    >
      <div className="px-1.5 pt-1 border-b border-slate-100 dark:border-slate-700/60">
        <MarkdownToolbar textareaRef={taRef} value={value} onChange={onChange} />
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={1}
        className="w-full resize-none bg-transparent outline-none px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed"
      />
    </div>
  );
};

export default RichTextEditor;
