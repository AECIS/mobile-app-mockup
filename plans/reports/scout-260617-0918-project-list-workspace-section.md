# Scout Report: Project List → Workspace Sections

**Task:** Project list must show workspace sections — a user can join many workspaces, each workspace has many projects. Group the project list by workspace.

**Date:** 2026-06-17 | **Branch:** feat/feed-card-redesign

## Stack (important: this is a WEB mockup, not React Native)
- React 19.2 + Vite 6, TypeScript ~5.8
- Tailwind CSS (className utilities only; no CSS modules/styled-components)
- lucide-react icons; `@/` import alias
- NO router (tab-based single page), NO state lib (React Context + `useState`)
- Files kept <200 lines; kebab-case + PascalCase mix in `/components`

## Key Files

### 1. `components/ProjectDrawer.tsx` (295 lines) — PRIMARY TARGET
The actual "project list" UI (modal/drawer project picker).
- Lines 69-93: memoized "Recent" (last 3) section
- Lines 207-226: filter chips (All / Active / Completed) + search (lines 80-84)
- Lines 102-153: `renderProjectCard()` helper; status badge Active/Done lines 140-149
- Lines 255-286: section rendering — currently 2 sections: **Recent** + **All Projects**
- **Change here:** replace/add workspace grouping → one section header per workspace, projects under each.

### 2. `types.ts` — needs Workspace type
- Lines 14-21: `Project { id, name, initials, state: 'active'|'completed', address, icon? }`
- **No `Workspace` type exists.** Add `Workspace`, and `workspaceId` on `Project`.

### 3. `App.tsx` — mock data + state
- Lines 142-227: 12 flat projects (no workspace link)
- Line 229 / 80-102: `activeProject` state via `useState<Project>(projects[0])`; `isProjectDrawerOpen` state
- Lines 441-448: `<ProjectDrawer>` usage (passes projects + activeProject)
- **Change here:** restructure mock data into workspaces; pass grouped data.

### 4. `components/WorkspaceDrawer.tsx` (3.1 KB) — existing, workaround
- Workspace switcher bottom sheet; flat list (lines 42-64)
- Comment line 3: uses `Project` type because `Workspace` not exported. Fix once type added.

### 5. `components/Header.tsx`
- Line 6: `activeWorkspace: Project`; line 26: workspace selector button.

### 6. `context/index.ts`
- Only ThemeContext + OfflineContext. No workspace/project context (state is local in App.tsx).

## Reusable Section Pattern (from ProjectDrawer.tsx:257-284)
Div-based sections (no SectionList). Reuse for workspace headers:
- Section header: `text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-1`
- Section list container: `flex flex-col gap-2`; `mb-4` between sections
- Card active state accent color: `#3b82f6`
- Animations available in `styles/globals.css`: `.animate-stagger`, `.animate-fade-in`, `.thin-scrollbar`

## Suggested Data Shape
```ts
interface Workspace { id: string; name: string; initials: string; icon?: string }
interface Project { /* existing */ workspaceId: string }
```

## Recommended Change Path (minimal, KISS)
1. `types.ts`: add `Workspace`, add `workspaceId` to `Project`.
2. `App.tsx`: define 2-3 workspaces, tag the 12 projects with `workspaceId`.
3. `ProjectDrawer.tsx`: group filtered/searched projects by workspace → render a section header per workspace (keep "Recent" on top, optional). Reuse existing header + card styling.
4. (optional) `WorkspaceDrawer.tsx`: switch to real `Workspace` type.

## Notes / Gotchas
- `components/ProjectsList.tsx` is misnamed — it's a kanban TASK board, NOT the project list. Do not touch for this task.
- No API layer for projects (only `geminiService.ts`); data is in-memory mock in App.tsx.
- No persistence layer for selection (in-memory only).

## Unresolved Questions
1. Keep "Recent" section above workspace groups, or pure workspace grouping only?
2. Should workspace sections be collapsible, or always expanded?
3. How many mock workspaces to seed (2-3 suggested) and how to split the existing 12 projects?
4. Should search/filter span all workspaces or scope to active workspace?
5. Final naming — "Workspace" vs "Team"/"Organization"?
