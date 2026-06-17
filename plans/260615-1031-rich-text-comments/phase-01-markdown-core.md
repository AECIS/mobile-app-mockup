# Phase 01 — Markdown Core (format helpers + safe renderer)

Context: scout report; renderer used by `components/feed-stream-item.tsx`.

## Priority: HIGH · Status: pending
Pure logic layer. No UI. Foundation for editor + display.

## Requirements
Functional:
- Selection transforms that, given `(value, selStart, selEnd, action)`, return `{ value, selStart, selEnd }` with markdown applied. Actions: bold `**`, italic `_`, strike `~~`, code `` ` ``, link `[sel](url)`, bullet `- ` (per line), ordered `1. ` (per line).
  - Toggle behavior: if selection already wrapped, unwrap. If empty selection, insert markers + place caret between.
- Renderer: parse markdown subset → React nodes.
  - Block: split by `\n`; consecutive `- ` → `<ul>`, `1.`/`n.` → `<ol>`; blank line → paragraph break; other lines → paragraph with `<br/>` joins.
  - Inline tokenizer (order-safe): code `` `x` `` (no nested), bold `**x**`, strike `~~x~~`, italic `_x_`, link `[t](url)`.
  - Links: render `<a href target=_blank rel=noopener noreferrer>`; **sanitize href** — allow only `http:`, `https:`, `mailto:`; else render as plain text.
Non-functional: no external deps; no `dangerouslySetInnerHTML`; React text nodes auto-escape; no catastrophic regex (linear scan/simple regex).

## Architecture
- `markdown-format.ts`: pure functions, framework-agnostic.
  - `applyMarkdown(action, value, start, end): {value,start,end}`
  - helpers: `wrapInline(marker)`, `prefixLines(prefix)`, `applyLink`.
- `markdown-renderer.tsx`: `MarkdownRenderer({ source, className })` → JSX. Internal `renderInline(text): ReactNode[]`, `renderBlocks(src): ReactNode[]`. Stable keys by index.

## Files
Create:
- `components/markdown/markdown-format.ts`
- `components/markdown/markdown-renderer.tsx`
- `components/markdown/index.ts` (re-export)

## Steps
1. Define `MarkdownAction` union + `applyMarkdown` with toggle/unwrap + caret math.
2. Implement `prefixLines` (list actions) operating on full lines spanned by selection.
3. Implement inline tokenizer (precedence: code → bold → strike → italic → link).
4. Implement block grouping (ul/ol/paragraphs) + `MarkdownRenderer`.
5. `isSafeHref(url)` scheme allowlist.
6. Export from `index.ts`.

## Todo
- [ ] markdown-format.ts transforms (wrap/unwrap/prefix/link)
- [ ] markdown-renderer.tsx inline tokenizer
- [ ] block grouping (ul/ol/paragraph/br)
- [ ] href sanitization
- [ ] index.ts exports
- [ ] tsc clean

## Success criteria
- `applyMarkdown('bold','ab',0,2)` → `**ab**` caret around text; re-apply unwraps.
- Renderer: `**a** _b_ ~~c~~ `code` [x](https://y)` → correct nodes; `[x](javascript:alert)` → plain text (no anchor).
- No HTML injection: input `<img onerror=...>` renders as literal text.

## Security
- Only XSS surface = link href → allowlist schemes. No raw HTML path.

## Next
Phase 02 consumes `applyMarkdown` (toolbar) + provides editor; Phase 03 uses `MarkdownRenderer`.
