# Rich Text Editor for Comments (Markdown + Custom Toolbar)

Overview/access point. Scout: `plans/reports/scout-260615-1031-rich-text-editor-comment.md`.

## Goal
Comments support rich text via **Markdown** stored in `FeedComment.text` (no model change). Custom **toolbar** wraps a plain `<textarea>` and injects markdown around the selection. A small **safe renderer** displays markdown as React nodes (no HTML injection).

## Decisions (locked)
- Storage: Markdown string (reuse `text` field).
- Editor: custom — textarea + selection transforms (no editor lib, keeps bundle lean).
- Render: tiny in-house parser → React nodes; React auto-escapes; links sanitized (http/https/mailto only).
- Feature set: **bold, italic, strikethrough, inline code, link, bullet list, numbered list**. (No images/headings/tables — YAGNI.)
- Scope: FeedDetail composer + edit mode + comment rendering. TaskDetail composer optional (Phase 3b).
- Activity descriptions stay plain (comments only).
- Enter = newline; send via button / Cmd-Ctrl+Enter (was Enter=send).

## Module layout (new `components/markdown/`)
- `markdown-format.ts` — selection-transform helpers (apply bold/italic/etc to textarea value).
- `markdown-renderer.tsx` — markdown subset → React nodes (safe).
- `markdown-toolbar.tsx` — toolbar buttons operating on a textarea ref.
- `rich-text-editor.tsx` — auto-grow `<textarea>` + toolbar; controlled value/onChange.
- `index.ts` — exports.
Each file < 200 lines.

## Phases
| # | File | Focus | Status |
|---|------|-------|--------|
| 1 | phase-01-markdown-core.md | format helpers + safe renderer | ✅ done |
| 2 | phase-02-editor-ui.md | toolbar + rich-text-editor | ✅ done |
| 3 | phase-03-integration.md | FeedDetail + feed-stream-item + TaskDetail (3b) | ✅ done |
| 4 | phase-04-verify.md | vitest (16 tests), build, tsc | ✅ done |

## Dependencies
- Phase 1 → 2 → 3 → 4 (sequential; 3 depends on 1+2).
- No new runtime deps. Optional dev dep: `vitest` for Phase 4 unit tests (else manual + tsc + build).

## Key risks
- XSS via links → sanitize href scheme. React escapes text by default (no `dangerouslySetInnerHTML`).
- Mobile selection/caret quirks in textarea transforms → keep transforms pure on value+selection.
- Renderer shared by feed card preview + detail; `clamp` (line-clamp-2) must still work.
