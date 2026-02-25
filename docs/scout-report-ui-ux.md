# UI/UX Design Scout Report - web-mockup

## Overview

Modern mobile-first construction project management app built with React + Tailwind CSS.

---

## 1. DESIGN SYSTEM FOUNDATION

### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary Action | Orange/Coral | `#f06b3e` |
| Background | Warm Cream | `#faf9f6` |
| Text Primary | Dark Slate | `text-slate-800` |
| Borders | Light Gray | `border-slate-100` |

### Status Colors (Semantic)

| Status | Hex | Usage |
|--------|-----|-------|
| Submitted/Open | `#2C7ABB` | Blue - Initial states |
| In Progress/Done | `#FFBF00` | Gold - Active work |
| Approved/Closed | `#238823` | Green - Success |
| Rejected/Overdue | `#D2222D` | Red - Errors |
| Closed (Submittal) | `#229385` | Teal |
| Cancelled/Inactive | `#ADB7BE` | Gray |

### Typography

- **Font**: Plus Jakarta Sans (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Scales**: text-xs → text-3xl
- **Labels**: `uppercase tracking-wider` pattern

### Spacing

- Padding: p-4, p-5, p-6 (16px, 20px, 24px)
- Gap: gap-2, gap-3, gap-6
- Border radius: `rounded-[2rem]` (32px) cards, `rounded-2xl` (16px) smaller

---

## 2. COMPONENT INVENTORY

### Navigation
- Header (workspace selector, search, notifications)
- BottomNav (5-tab with animated show/hide on scroll)
- Sticky tab bars with backdrop blur

### Data Display
- StatCard (metrics with trends)
- Dashboard (grid layouts)
- FeedsView (feed cards with photo grids)
- FeedDetail (full-screen detail view)

### Forms & Inputs
- NewTask, NewIssue, NewRFS, NewSubmission
- AssigneeSelector, MasterDataSelector, DTagSelector
- Full-screen modal pattern

### Overlays
- ActionSheet (bottom-up modal)
- ActionDrawer
- ProjectDrawer, WorkspaceDrawer

### Special
- AIPanel (gradient card with insights)
- PhotoGrid (Instagram-style layouts)

---

## 3. DESIGN PATTERNS USED

### Mobile-First
- Bottom navigation primary
- Full-screen overlays for forms
- Safe area padding (`env(safe-area-inset-bottom)`)
- Touch targets 44px minimum

### Interactions
- `active:scale-95` button press feedback
- `backdrop-blur-md` modal backgrounds
- 300-500ms transition durations
- Scroll-based nav visibility

### Layout
- `max-w-md` container (mobile width)
- Flex/grid responsive layouts
- Card-based organization
- Horizontal scroll lists

---

## 4. STRENGTHS ✅

1. **Mobile-first excellence** - Proper safe areas, touch targets, bottom nav
2. **Semantic colors** - Status-aware color system with helper functions
3. **Smooth animations** - Scale, fade, blur transitions
4. **Glassmorphism accents** - Backdrop blur on overlays
5. **Consistent spacing** - Gap/padding hierarchy
6. **Component reuse** - Shared selector patterns

---

## 5. IMPROVEMENT OPPORTUNITIES

### Spacing & Layout
- [ ] Establish stricter spacing scale (8/12/16/24/32px)
- [ ] Add visual section dividers in dense forms
- [ ] More generous negative space in forms

### Typography
- [ ] Verify font loading consistency
- [ ] Larger heading sizes for hierarchy
- [ ] Consistent line-height scale

### Interactions
- [ ] Add skeleton loading screens
- [ ] Toast notifications for actions
- [ ] Form validation visual feedback
- [ ] Loading states beyond pulse animation

### Consistency
- [ ] Standardize button border-radius (full vs 2xl)
- [ ] Unify button variants (primary, secondary, ghost, destructive)
- [ ] Consistent priority pill backgrounds

### Accessibility
- [ ] Add visible focus states for keyboard nav
- [ ] Verify WCAG color contrast ratios
- [ ] aria-labels for icon-only buttons

### Future
- [ ] Dark mode implementation
- [ ] Avatar color generation system

---

## 6. KEY FILE LOCATIONS

### Core
- `App.tsx` - Main layout, routing
- `types.ts` - Data types, status configs
- `index.html` - Font/Tailwind CDN imports

### Components
- `components/Header.tsx`
- `components/BottomNav.tsx`
- `components/Dashboard.tsx`
- `components/FeedsView.tsx`
- `components/FeedDetail.tsx`
- `components/ActionSheet.tsx`
- `components/NewSubmission.tsx`

### Data
- `components/mockData.ts` - Sample data, master data options

---

## 7. DATA PATTERNS AFFECTING UI

### Status System
```typescript
getStatusConfig(type: FeedItemType, statusKey: string)
// Returns { label: string, color: string }
// Type-aware: Issue vs Submittal status configs
```

### Feed Type Badges
```typescript
TYPE_COLORS = {
  Submittal: 'bg-blue-50 text-blue-600 border-blue-100',
  Issue: 'bg-amber-50 text-amber-600 border-amber-100',
  RFS: 'bg-violet-50 text-violet-600 border-violet-100',
}
```

### Attachment Types
- pdf → Red accent
- image → Blue accent, preview grid
- doc → Amber accent

---

## Summary

Well-designed mobile-first app with strong foundations. Main opportunities: spacing consistency, button standardization, loading states, and accessibility improvements.
