# Implementation Plan: New Submission Modal Refinements

## Executive Summary

The NewSubmission component is **already implemented** at `/components/NewSubmission.tsx`. This plan addresses a key deviation from requirements: DTag selector uses hierarchical tree navigation but should use a **flat list** pattern matching other selectors.

## Current State Analysis

### Already Implemented (No Changes Needed)
- Full-screen modal with frosted glass header
- Title input (required)
- Description textarea (required, with word count)
- Type selector (required) - uses MasterDataSelector
- Discipline selector (required) - uses MasterDataSelector
- Assignee selector (required) - uses AssigneeSelector with avatar picker
- Due Date native date picker
- Attachments section (photos grid + file list + add buttons)
- "More Options" collapsible section with Package and DTag
- Form validation (disabled Submit until required fields filled)
- Dark mode support
- Safe area handling
- Integration with CreateActionMenu and App.tsx

### Gap Identified
**DTag Selector Pattern**: Current `DTagSelector` uses hierarchical tree navigation (breadcrumbs, drill-down, nested children). User requirement specifies **flat list** selector like Package/Discipline/Type.

## Implementation Tasks

### Phase 1: Create FlatDTagSelector Component

**File**: `/components/FlatDTagSelector.tsx`

Convert hierarchical DTagSelector to flat list:
1. Flatten tree structure to single-level list
2. Reuse MasterDataSelector pattern (search + checkboxes)
3. Multi-select with count badge
4. No breadcrumbs/drill-down - just searchable flat list
5. Show full path in label for context (e.g., "Building A > Ground Floor > Lobby")

### Phase 2: Update NewSubmission.tsx

Replace DTagSelector import with FlatDTagSelector in the DTag selector overlay.

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `/components/FlatDTagSelector.tsx` | Create | New flat list selector for DTags |
| `/components/NewSubmission.tsx` | Modify | Import FlatDTagSelector instead of DTagSelector |

## Design Specifications

- Primary color: `#f06b3e`
- Background: `#faf9f6` (light), `slate-900` (dark)
- Border radius: `rounded-2xl` for cards, `rounded-full` for badges
- Touch targets: min 44px height
- Icons: Lucide React
- Animation: `animate-in slide-in-from-right duration-200`

## Dependencies

- Existing: MasterDataSelector pattern, mockData.ts (dTagTree)
- No new npm packages required

## Estimated Effort

- Phase 1: 1-2 hours
- Phase 2: 15 minutes
- Testing: 30 minutes
- **Total**: ~2.5 hours

## Risks

- None significant - straightforward pattern reuse

## Unresolved Questions

None - requirements are clear.
