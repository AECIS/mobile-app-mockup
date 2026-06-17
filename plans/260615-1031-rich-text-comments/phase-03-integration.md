# Phase 03 — Integration (FeedDetail + renderer)

Context: Phase 01 renderer, Phase 02 editor. Targets from scout.

## Priority: HIGH · Status: pending (depends on 01+02)

## Requirements
- Composer (FeedDetail bottom bar): replace bare `<input>` with `RichTextEditor` (compact). Wire `value=commentText`, `onChange=setCommentText`, `onSubmit=handleSendComment`. Keep attachment chips, reply indicator, Send button, attachment grid. Send button stays (Enter no longer submits).
- Edit mode (FeedDetail `bodyOverride`, ~L462): replace `<textarea>` with `RichTextEditor`; wire `editText`/`setEditText`; Save unchanged.
- Rendering: `feed-stream-item.tsx` comment branch (~L111-118) → `<MarkdownRenderer source={text} className="...existing classes..." />` keeping `replyToName` blue prefix and `clampClass`.
  - Verify `line-clamp-2` still truncates rendered block (apply clamp to a wrapping element).
- `handleSendComment`/`handleSaveEdit`: trim still ok (markdown is text). No type change.

## 3b (optional) — TaskDetail
- Replace TaskDetail comment `<input>` (~L122) with RichTextEditor for parity. Lower priority; mock-only screen.

## Files
Update:
- `components/FeedDetail.tsx` (composer input, edit textarea, imports)
- `components/feed-stream-item.tsx` (render markdown; import MarkdownRenderer)
- (3b) `components/TaskDetail.tsx`

## Steps
1. Import `RichTextEditor`, `MarkdownRenderer` from `./markdown`.
2. Swap composer input → RichTextEditor; ensure Send + Cmd/Ctrl+Enter both call handleSendComment; keep attachments/reply UI.
3. Swap edit `<textarea>` → RichTextEditor (bodyOverride).
4. feed-stream-item: render comment text via MarkdownRenderer; preserve reply prefix + clamp.
5. Confirm activity description stays plain.
6. (3b) TaskDetail swap.

## Todo
- [ ] FeedDetail composer → RichTextEditor
- [ ] FeedDetail edit mode → RichTextEditor
- [ ] feed-stream-item → MarkdownRenderer (reply prefix + clamp intact)
- [ ] remove now-unused input markup/imports
- [ ] (opt) TaskDetail composer
- [ ] tsc + build clean

## Success criteria
- Type `**bold** _italic_`, send → comment shows formatted bold+italic in detail thread AND feed card preview (clamped).
- Edit a comment with toolbar → saved markdown re-renders.
- Reply prefix still blue; long comment still clamps to 2 lines on card.
- Existing plain-text mock comments still render unchanged.

## Security
- Renderer-only display path; href sanitized (Phase 01).

## Next
Phase 04 verify (tests/build/manual/a11y).
