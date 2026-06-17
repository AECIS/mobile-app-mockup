# Phase 02 — Editor UI (toolbar + rich-text-editor)

Context: Phase 01 `applyMarkdown`; design tokens `components/ui/design-tokens.ts`; lucide icons.

## Priority: HIGH · Status: pending (depends on Phase 01)

## Requirements
Functional:
- `MarkdownToolbar`: buttons Bold, Italic, Strikethrough, Code, Link, Bullet List, Numbered List. On click → call `applyMarkdown`, update value, restore focus + selection on the textarea.
  - Link: prompt for URL (simple `window.prompt` for mockup) → `applyLink`.
- `RichTextEditor`: controlled (`value`, `onChange`), auto-grow textarea (min ~36px, max ~140px then scroll), placeholder, toolbar above or inline. Exposes `onSubmit?` (Cmd/Ctrl+Enter). Forwardable ref optional.
- Keyboard: Enter = newline (do NOT submit); Cmd/Ctrl+Enter = submit (if `onSubmit`).
Non-functional: touch targets ≥36px; `cursor-pointer`; focus ring `#3b82f6`; match input styling (`bg-[#fafafa]/[#f0f2f5] rounded-2xl`); dark-mode classes; respect `prefers-reduced-motion` (no transform animations needed).

## Architecture
- `markdown-toolbar.tsx`: `({ textareaRef, value, onChange })`. Each button: `const r = applyMarkdown(action, value, ta.selectionStart, ta.selectionEnd); onChange(r.value); requestAnimationFrame(()=> ta.setSelectionRange(r.start,r.end); ta.focus())`.
- `rich-text-editor.tsx`: owns textarea ref, renders MarkdownToolbar + `<textarea>`; auto-grow via `onInput` setting height = scrollHeight (capped). Variants: `compact` (composer) vs default (edit mode) — toolbar density.

## Files
Create:
- `components/markdown/markdown-toolbar.tsx`
- `components/markdown/rich-text-editor.tsx`
Update:
- `components/markdown/index.ts` (export both)

## Steps
1. Build MarkdownToolbar with 7 icon buttons (lucide: Bold, Italic, Strikethrough, Code, Link, List, ListOrdered).
2. Selection-preserving apply (rAF refocus + setSelectionRange).
3. Build RichTextEditor: textarea + auto-grow + toolbar + key handling.
4. Style to match composer/edit-mode; aria-labels on buttons.

## Todo
- [ ] markdown-toolbar.tsx (7 actions, selection restore)
- [ ] link prompt → applyLink
- [ ] rich-text-editor.tsx auto-grow + controlled
- [ ] Enter=newline, Cmd/Ctrl+Enter=submit
- [ ] a11y (aria-label, focus ring, touch size)
- [ ] tsc + build clean

## Success criteria
- Select text, tap Bold → wrapped, selection retained, textarea refocused.
- Empty selection Bold → `****` caret centered.
- Textarea grows with content to cap then scrolls.
- No layout shift from toolbar; works light/dark.

## Risks
- Selection lost on button tap (button steals focus) → use `onMouseDown preventDefault` or rAF refocus.

## Next
Phase 03 mounts RichTextEditor in FeedDetail (composer + edit) and renders via MarkdownRenderer.
