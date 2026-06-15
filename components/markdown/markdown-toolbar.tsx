import React from 'react';
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon, List, ListOrdered } from 'lucide-react';
import { applyMarkdown, MarkdownAction } from './markdown-format';

// Formatting toolbar that operates on a controlled textarea via its ref.
interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

const BUTTONS: { action: MarkdownAction; Icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { action: 'bold', Icon: Bold, label: 'Bold' },
  { action: 'italic', Icon: Italic, label: 'Italic' },
  { action: 'strike', Icon: Strikethrough, label: 'Strikethrough' },
  { action: 'code', Icon: Code, label: 'Inline code' },
  { action: 'link', Icon: LinkIcon, label: 'Link' },
  { action: 'bullet', Icon: List, label: 'Bullet list' },
  { action: 'ordered', Icon: ListOrdered, label: 'Numbered list' },
];

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ textareaRef, value, onChange }) => {
  const run = (action: MarkdownAction) => {
    const ta = textareaRef.current;
    if (!ta) return;

    let opts: { url?: string } | undefined;
    if (action === 'link') {
      const url = window.prompt('Link URL', 'https://');
      if (url === null) return; // cancelled
      opts = { url };
    }

    const res = applyMarkdown(action, value, ta.selectionStart, ta.selectionEnd, opts);
    onChange(res.value);
    // Restore focus + selection after React re-renders.
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(res.start, res.end);
    });
  };

  return (
    <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
      {BUTTONS.map(({ action, Icon, label }) => (
        <button
          key={action}
          type="button"
          aria-label={label}
          title={label}
          onMouseDown={(e) => e.preventDefault()} // keep textarea selection/focus
          onClick={() => run(action)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-700 active:scale-95 transition-colors shrink-0 cursor-pointer"
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
};

export default MarkdownToolbar;
