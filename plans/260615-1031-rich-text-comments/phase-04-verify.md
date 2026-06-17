# Phase 04 — Verify (tests, a11y, build)

## Priority: MEDIUM · Status: pending (depends on 01-03)

## Requirements
- `markdown-format` + `markdown-renderer` correctness (esp. toggle/unwrap, href sanitization, no-HTML-injection).
- Build green (`npx vite build`), `tsc --noEmit` no NEW errors (baseline: DMapDetail:193, ui/index.ts dupes pre-exist).
- a11y/mobile pass.

## Testing approach
Repo has NO test runner (scripts: dev/build/preview only). Two options:
- **A (recommended, light):** add dev dep `vitest` + `npm test`; unit-test the two pure modules (`markdown-format`, renderer via `@testing-library/react` or pure node for format). Fast, high value on pure logic.
- **B (no new deps):** skip automated tests; rely on `tsc` + `vite build` + manual matrix below.
Pick A if automated coverage wanted; else B. (YAGNI: B acceptable for mockup.)

## Manual matrix
- [ ] bold/italic/strike/code/link/bullet/ordered each insert + toggle correctly
- [ ] empty-selection insert places caret right
- [ ] link prompt: valid url → anchor; `javascript:` → plain text
- [ ] Enter = newline; Cmd/Ctrl+Enter sends; Send button sends
- [ ] rendered comment: card preview clamps 2 lines; detail full
- [ ] reply prefix blue intact; edited badge intact
- [ ] light + dark mode; 375px width; touch targets ≥36px
- [ ] `<script>`/`<img onerror>` typed → shown literally (escaped)

## Todo
- [ ] (A) add vitest + tests for markdown-format & renderer, OR (B) manual matrix done
- [ ] tsc --noEmit: no new errors
- [ ] vite build green
- [ ] run dev, verify on :3002

## Success criteria
- All matrix items pass; build green; no new type errors.

## Risks
- Adding vitest touches package.json/config — keep minimal; don't disturb vite app build.
