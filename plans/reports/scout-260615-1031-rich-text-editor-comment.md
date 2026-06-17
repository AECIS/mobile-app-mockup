# Scout: Rich Text Editor for Comment

Task: add rich-text editing to comments. Stack: React 19.2 + Vite 6 + Tailwind (CDN, no config) + lucide-react. TS 5.8.

## Verdict
Zero rich-text infra exists. Comments = plain `<input>`/`<textarea>` → `text: string` → rendered in `<p>`. No editor lib, no markdown parser, no sanitizer. Build from scratch or add a lib.

## Comment composer (where user types)
- `components/FeedDetail.tsx` — main composer, bottom sticky bar.
  - State (~L54-58): `commentText/setCommentText`, `commentAttachments`, `replyTo`, `editingComment`, `editText`.
  - Submit `handleSendComment()` (~L77-95): builds `FeedComment` with `text: commentText.trim()`.
  - Input: bare `<input type=text>` (~L580-604), Enter = send. Placeholder "Write a comment...".
  - Edit mode: inline `<textarea>` (~L462) `bg-[#f0f2f5] rounded-2xl p-3 min-h-[60px]`; save `handleSaveEdit()` (~L100-109) sets `isEdited:true`.
  - Above input: reply indicator ("Replying to @name" + X), attachment chips (scrollable).
  - Below input: 4-col attachment grid (Photo/Files/Camera/Emoji) toggled by Plus. Icons: Paperclip, Smile, Send, ImageIcon, FolderOpen.
- `components/TaskDetail.tsx` (~L122-133) — secondary comment input stub: `<input>` in `bg-[#fafafa] rounded-full h-12`, Smile + Paperclip + Send.

## Data model
- `types.ts:163-174` `FeedComment { id,userId,userName,userStakeholder?,text,timestamp,timestampMs,attachments?,parentId?,isEdited? }`.
- `text` is plain string. No format/mentions field. Edit window = 1h (`EDIT_WINDOW_MS`).

## Rendering (editor output must match)
- `components/feed-stream-item.tsx:111-118` — renders comment as plain `<p>`: `{replyToName span}{text}`. Activity descriptions also plain `<p>`. No parsing.
- Shared by both feed card preview AND detail thread → any format change affects both. `clamp` prop truncates (line-clamp-2).

## Reusable assets
- `components/ui/Input.tsx` (176 lines) exports `Input` + `Textarea` (forwardRef, `showCount`, `maxLength`, label/error/hint). Base: `bg-[#fafafa] border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]`.
- `components/ui/design-tokens.ts` — colors (primary `#3b82f6`, hover `#2563eb`, bg `#faf9f6`, text slate-800/500/400), 8px spacing, radius, focus ring const.
- lucide-react: Bold/Italic/List/Link/Code icons available for toolbar.
- Mobile drawer/sheet patterns: `ActionSheet.tsx`, `ActionForm.tsx`.
- `styles/globals.css` — only `.truncate-2/.truncate-3`; no prose/typography classes.

## Other textarea sites (consistency ref)
FeedDetail:462, TaskDetail:123, NewIssue:188, NewSubmission:258, NewRFS:183, ActionForm:489, DailyReportDetail:122.

## Conventions
- kebab-case for new small components (`feed-card.tsx`, `overlay-header.tsx`); feature containers PascalCase.
- File size <200 lines (`.claude/rules/development-rules.md`). FeedDetail already 691 → extract, don't bloat.
- New component → `components/rich-text-editor.tsx` (+ likely `components/comment-input-bar.tsx` to keep FeedDetail lean). Not in `ui/` (not a primitive).

## Integration points
1. Replace composer `<input>` + edit `<textarea>` in FeedDetail with editor.
2. Extend `FeedComment` if storing rich format (add field or repurpose `text`).
3. Update `feed-stream-item.tsx` renderer to display rich format (needs safe render if HTML).
4. Reuse `FeedAttachment[]`, design tokens, attachment-picker UI.

## Unresolved questions
1. Storage format: Markdown (portable, needs parser+sanitize), HTML (needs DOMPurify), or JSON (Slate/Tiptap)? — affects model + renderer.
2. Library vs custom contentEditable? lib adds deps (none today); custom keeps bundle small but more work. (Note: 656KB bundle already large.)
3. Feature set: bold/italic/lists/links/code/quote? @mentions (real user list exists in mockData)? emoji?
4. Apply to activity descriptions (ActionForm) too, or comments only?
5. Backward-compat: migrate existing plain-text comments? (mock data only — likely N/A.)
6. Enter behavior: send vs newline (Shift+Enter)?
7. Both composers (FeedDetail + TaskDetail) or just FeedDetail?
