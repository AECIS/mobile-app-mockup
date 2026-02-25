# Phase 2: Integrate FlatDTagSelector into NewSubmission

## Objective

Replace the hierarchical DTagSelector with the new FlatDTagSelector in NewSubmission.tsx.

## File to Modify

**Path**: `/Users/khoai.nguyen/Desktop/Repositories/AECIS_Flutter/web-mockup/components/NewSubmission.tsx`

## Changes Required

### 1. Update Import Statement

**Before:**
```typescript
import { DTagSelector } from './DTagSelector';
```

**After:**
```typescript
import { FlatDTagSelector } from './FlatDTagSelector';
```

### 2. Update Selector Overlay

**Before (line ~487-494):**
```tsx
{activeSelector === 'dtag' && (
  <DTagSelector
    tree={dTagTree}
    selected={selectedDTags}
    onSelectionChange={setSelectedDTags}
    onClose={() => setActiveSelector(null)}
  />
)}
```

**After:**
```tsx
{activeSelector === 'dtag' && (
  <FlatDTagSelector
    tree={dTagTree}
    selected={selectedDTags}
    onSelectionChange={setSelectedDTags}
    onClose={() => setActiveSelector(null)}
  />
)}
```

## No Other Changes Needed

The component interface is identical:
- `tree: DTagNode[]` - same input format
- `selected: string[]` - same state type
- `onSelectionChange: (ids: string[]) => void` - same callback signature
- `onClose: () => void` - same close handler

## Verification Steps

1. Open app and navigate to CreateActionMenu
2. Tap "Submission" to open NewSubmission modal
3. Expand "More Options" section
4. Tap "DTag" field
5. Verify flat list displays (no breadcrumbs/drill-down)
6. Search for "Lobby" - verify filtering works
7. Select multiple DTags - verify count badge shows
8. Close and reopen - verify selections persist
9. Repeat in dark mode

## Optional: Keep DTagSelector for Other Use Cases

The original hierarchical DTagSelector may be useful elsewhere. Do not delete it unless instructed. Both selectors can coexist:

- `FlatDTagSelector.tsx` - simple flat list for forms
- `DTagSelector.tsx` - hierarchical navigation for exploration

## Rollback Plan

If issues arise, revert the import change:
```typescript
import { DTagSelector } from './DTagSelector';
// and use <DTagSelector ... /> in overlay
```
