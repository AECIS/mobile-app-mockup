# Phase 1: Create FlatDTagSelector Component

## Objective

Create a flat list selector for DTags that matches the MasterDataSelector pattern, replacing the hierarchical tree navigation.

## File to Create

**Path**: `/Users/khoai.nguyen/Desktop/Repositories/AECIS_Flutter/web-mockup/components/FlatDTagSelector.tsx`

## Component Interface

```typescript
interface FlatDTagSelectorProps {
  tree: DTagNode[];           // Source tree data (will be flattened internally)
  selected: string[];         // Array of selected DTag IDs
  onSelectionChange: (ids: string[]) => void;
  onClose: () => void;
}
```

## Implementation Details

### 1. Flatten Tree Structure

Convert hierarchical tree to flat list with path labels:

```typescript
interface FlattenedDTag {
  id: string;
  label: string;
  pathLabel: string;  // e.g., "Building A > Ground Floor > Lobby"
}

const flattenTree = (nodes: DTagNode[], path: string[] = []): FlattenedDTag[] => {
  const result: FlattenedDTag[] = [];
  for (const node of nodes) {
    const currentPath = [...path, node.label];
    result.push({
      id: node.id,
      label: node.label,
      pathLabel: currentPath.join(' > '),
    });
    if (node.children) {
      result.push(...flattenTree(node.children, currentPath));
    }
  }
  return result;
};
```

### 2. UI Structure (Copy MasterDataSelector Pattern)

```
+------------------------------------------+
| [<] Select DTags              [3 badge]  |  <- Header with count
+------------------------------------------+
| [Search icon] Search tags... [X]         |  <- Search bar
+------------------------------------------+
| Selected: [3 items]                      |  <- Selected count indicator
+------------------------------------------+
| +--------------------------------------+ |
| | [ ] Building A                       | |  <- Flat list with checkboxes
| |     Building A                       | |     (path shown in muted text)
| +--------------------------------------+ |
| | [x] Lobby                            | |
| |     Building A > Ground Floor > Lobby| |
| +--------------------------------------+ |
| | [ ] Zone B1-A                        | |
| |     Building A > Basement > Zone B1-A| |
| +--------------------------------------+ |
+------------------------------------------+
```

### 3. Key Behaviors

- **Search**: Filter by label OR path (case-insensitive)
- **Multi-select**: Toggle checkboxes, no auto-close
- **Escape key**: Close selector
- **Focus trap**: Keep keyboard focus within overlay
- **Body scroll lock**: Prevent background scrolling

### 4. Styling (Match MasterDataSelector)

```css
/* Container */
className="fixed inset-0 bg-[#fafafa] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200"

/* Header */
className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"

/* Search input */
className="w-full pl-14 pr-12 py-3 rounded-2xl bg-[#fafafa] dark:bg-slate-800 border border-slate-200 dark:border-slate-600"

/* List item */
className="w-full flex items-center gap-4 px-5 py-3.5 min-h-[52px] active:scale-[0.98] transition-all"

/* Checkbox selected */
className="w-7 h-7 rounded-xl bg-[#f06b3e] border-[#f06b3e] ring-2 ring-orange-100"

/* Path label */
className="text-[11px] text-slate-400 dark:text-slate-500 truncate"
```

## Imports Required

```typescript
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Search, X, Check } from 'lucide-react';
import { DTagNode } from '../types';
```

## Accessibility

- `role="dialog"` and `aria-modal="true"` on container
- `role="checkbox"` and `aria-checked` on list items
- `aria-label` on close and clear buttons
- Focus trap implementation (Tab key cycling)
- Escape key to close

## Test Scenarios

1. Open selector, verify flat list displays all DTags
2. Search by label - filters correctly
3. Search by path segment - filters correctly
4. Select multiple items - count badge updates
5. Deselect item - updates correctly
6. Clear search - restores full list
7. Escape key closes selector
8. Tab key cycles within overlay
9. Dark mode renders correctly
10. Long paths truncate with ellipsis
