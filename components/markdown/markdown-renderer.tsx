import React from 'react';
import { isSafeHref } from './markdown-format';

// Safe markdown subset renderer -> React nodes.
// No dangerouslySetInnerHTML; React escapes text. Only http/https/mailto links.
// Supported: **bold**, _italic_, ~~strike~~, `code`, [text](url), - bullets, 1. ordered.

interface InlineRule {
  re: RegExp;
  render: (m: RegExpExecArray, key: string) => React.ReactNode;
}

// Precedence matters: code first (literal), then bold, strike, italic, link.
const INLINE_RULES: InlineRule[] = [
  {
    re: /`([^`]+)`/,
    render: (m, key) => (
      <code key={key} className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[0.92em] font-mono">
        {m[1]}
      </code>
    ),
  },
  { re: /\*\*([^*]+)\*\*/, render: (m, key) => <strong key={key}>{renderInline(m[1], key)}</strong> },
  { re: /~~([^~]+)~~/, render: (m, key) => <s key={key}>{renderInline(m[1], key)}</s> },
  { re: /_([^_]+)_/, render: (m, key) => <em key={key}>{renderInline(m[1], key)}</em> },
  {
    re: /\[([^\]]+)\]\(([^)\s]+)\)/,
    render: (m, key) =>
      isSafeHref(m[2]) ? (
        <a key={key} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] underline">
          {renderInline(m[1], key)}
        </a>
      ) : (
        m[0] // unsafe scheme -> render literally
      ),
  },
];

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let rest = text;
  let i = 0;

  while (rest.length > 0) {
    let best: { index: number; match: RegExpExecArray; rule: InlineRule } | null = null;
    for (const rule of INLINE_RULES) {
      const match = rule.re.exec(rest);
      if (match && (best === null || match.index < best.index)) {
        best = { index: match.index, match, rule };
      }
    }
    if (!best) {
      nodes.push(rest);
      break;
    }
    if (best.index > 0) nodes.push(rest.slice(0, best.index));
    nodes.push(best.rule.render(best.match, `${keyPrefix}-${i}`));
    rest = rest.slice(best.index + best.match[0].length);
    i++;
  }
  return nodes;
}

type Block =
  | { type: 'p'; lines: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ type: 'p', lines: para });
    para = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^- /.test(line)) {
      flush();
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].replace(/^- /, ''));
      blocks.push({ type: 'ul', items });
    } else if (/^\d+\.\s/.test(line)) {
      flush();
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s/, ''));
      blocks.push({ type: 'ol', items });
    } else if (line.trim() === '') {
      flush();
      i++;
    } else {
      para.push(line);
      i++;
    }
  }
  flush();
  return blocks;
}

export const MarkdownRenderer: React.FC<{ source: string; className?: string }> = ({ source, className }) => {
  const blocks = parseBlocks(source || '');
  return (
    <div className={className}>
      {blocks.map((b, bi) => {
        if (b.type === 'ul') {
          return (
            <ul key={bi} className="list-disc pl-5 space-y-0.5">
              {b.items.map((it, ii) => <li key={ii}>{renderInline(it, `${bi}-${ii}`)}</li>)}
            </ul>
          );
        }
        if (b.type === 'ol') {
          return (
            <ol key={bi} className="list-decimal pl-5 space-y-0.5">
              {b.items.map((it, ii) => <li key={ii}>{renderInline(it, `${bi}-${ii}`)}</li>)}
            </ol>
          );
        }
        return (
          <p key={bi}>
            {b.lines.flatMap((ln, li) =>
              li === 0
                ? renderInline(ln, `${bi}-${li}`)
                : [<br key={`br-${li}`} />, ...renderInline(ln, `${bi}-${li}`)],
            )}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
