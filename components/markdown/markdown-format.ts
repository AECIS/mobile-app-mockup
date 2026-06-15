// Markdown selection transforms - pure, framework-agnostic.
// Given a textarea value + selection range, return the new value + selection
// after applying a markdown action (toggle-aware).

export type MarkdownAction = 'bold' | 'italic' | 'strike' | 'code' | 'link' | 'bullet' | 'ordered';

export interface SelectionResult {
  value: string;
  start: number;
  end: number;
}

const INLINE_MARKER: Record<'bold' | 'italic' | 'strike' | 'code', string> = {
  bold: '**',
  italic: '_',
  strike: '~~',
  code: '`',
};

// Wrap (or unwrap, if already wrapped) the selection with an inline marker.
function toggleInline(marker: string, value: string, start: number, end: number): SelectionResult {
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);
  const m = marker.length;

  // Already wrapped inside the selection -> unwrap.
  if (selected.length >= m * 2 && selected.startsWith(marker) && selected.endsWith(marker)) {
    const inner = selected.slice(m, selected.length - m);
    return { value: before + inner + after, start, end: start + inner.length };
  }
  // Already wrapped just outside the selection -> unwrap.
  if (before.endsWith(marker) && after.startsWith(marker)) {
    const value2 = before.slice(0, before.length - m) + selected + after.slice(m);
    const ns = start - m;
    return { value: value2, start: ns, end: ns + selected.length };
  }
  // Wrap.
  const wrapped = before + marker + selected + marker + after;
  if (start === end) {
    const caret = start + m; // empty selection -> caret between markers
    return { value: wrapped, start: caret, end: caret };
  }
  return { value: wrapped, start: start + m, end: end + m };
}

// Insert a markdown link around the selection (or "text" placeholder).
function applyLink(value: string, start: number, end: number, url: string): SelectionResult {
  const before = value.slice(0, start);
  const label = value.slice(start, end) || 'text';
  const after = value.slice(end);
  const href = url.trim() || 'https://';
  const md = `[${label}](${href})`;
  const labelStart = start + 1; // select the label text for quick re-typing
  return { value: before + md + after, start: labelStart, end: labelStart + label.length };
}

// Toggle a line prefix (bullet / ordered) across every line in the selection.
function prefixLines(kind: 'bullet' | 'ordered', value: string, start: number, end: number): SelectionResult {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = value.indexOf('\n', end);
  if (lineEnd === -1) lineEnd = value.length;

  const block = value.slice(lineStart, lineEnd);
  const lines = block.split('\n');
  const re = kind === 'bullet' ? /^- / : /^\d+\.\s/;
  const allPrefixed = lines.every((l) => l.trim() === '' || re.test(l));

  const newLines = allPrefixed
    ? lines.map((l) => l.replace(re, ''))
    : lines.map((l, i) => (kind === 'bullet' ? `- ${l}` : `${i + 1}. ${l}`));

  const newBlock = newLines.join('\n');
  return {
    value: value.slice(0, lineStart) + newBlock + value.slice(lineEnd),
    start: lineStart,
    end: lineStart + newBlock.length,
  };
}

export function applyMarkdown(
  action: MarkdownAction,
  value: string,
  start: number,
  end: number,
  opts?: { url?: string },
): SelectionResult {
  switch (action) {
    case 'bold':
    case 'italic':
    case 'strike':
    case 'code':
      return toggleInline(INLINE_MARKER[action], value, start, end);
    case 'link':
      return applyLink(value, start, end, opts?.url ?? '');
    case 'bullet':
      return prefixLines('bullet', value, start, end);
    case 'ordered':
      return prefixLines('ordered', value, start, end);
  }
}

// Only allow safe link schemes (blocks javascript:, data:, etc.).
export function isSafeHref(url: string): boolean {
  return /^(https?:|mailto:)/i.test(url.trim());
}
