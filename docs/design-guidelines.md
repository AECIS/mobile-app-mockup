# Design Guidelines - AECIS Web Mockup

## Overview

This document outlines the design system and UI/UX guidelines for the AECIS construction project management mobile web app.

---

## 1. Color System

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#f06b3e` | Main CTA, active states, brand accent |
| Primary Hover | `#e05a2d` | Button hover states |
| Primary Light | `rgba(240, 107, 62, 0.1)` | Light backgrounds |

### Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#faf9f6` | Page background (warm cream) |
| Surface | `#ffffff` | Cards, modals |
| Surface Hover | `#f8fafc` | Interactive card hover |

### Semantic Status Colors

| Status | Hex | Usage |
|--------|-----|-------|
| Success | `#238823` | Approved, closed, completed |
| Warning | `#FFBF00` | In progress, pending |
| Error | `#D2222D` | Rejected, overdue, errors |
| Info | `#2C7ABB` | Submitted, open, informational |

### Neutral Colors

| Name | Tailwind | Usage |
|------|----------|-------|
| Text Primary | `slate-800` | Headings, important text |
| Text Secondary | `slate-500` | Body text |
| Text Muted | `slate-400` | Labels, hints |
| Border | `slate-200` | Card borders |
| Border Light | `slate-100` | Subtle dividers |

---

## 2. Typography

### Font Family

```css
font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Weights

- Regular (400): Body text
- Medium (500): Secondary text
- Semibold (600): Buttons, labels
- Bold (700): Headings, emphasis
- Extrabold (800): Numbers, stats

### Text Sizes

| Size | Tailwind | Usage |
|------|----------|-------|
| 3xl | `text-3xl` | Large stat numbers |
| xl | `text-xl` | Page titles |
| lg | `text-lg` | Section headers |
| base | `text-base` | Body text |
| sm | `text-sm` | Secondary text |
| xs | `text-xs` | Labels, metadata |
| [10px] | `text-[10px]` | Badges, chips |
| [9px] | `text-[9px]` | Status badges |

### Label Styles

```css
/* Standard label */
text-[11px] font-black uppercase tracking-tight text-slate-500

/* Badge label */
text-[9px] font-black uppercase tracking-wider
```

---

## 3. Spacing System

Based on 8px grid:

| Token | Value | Tailwind |
|-------|-------|----------|
| xs | 4px | `p-1`, `gap-1` |
| sm | 8px | `p-2`, `gap-2` |
| md | 12px | `p-3`, `gap-3` |
| lg | 16px | `p-4`, `gap-4` |
| xl | 24px | `p-6`, `gap-6` |
| 2xl | 32px | `p-8` |

---

## 4. Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| sm | 8px | `rounded-lg` | Small buttons, chips |
| md | 12px | `rounded-xl` | Inputs, small cards |
| lg | 16px | `rounded-2xl` | Cards, modals |
| xl | 24px | `rounded-3xl` | Large containers |
| 2xl | 32px | `rounded-[2rem]` | Main cards |
| full | 9999px | `rounded-full` | Avatars, pills |

---

## 5. Shadows

```css
/* Card shadow */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)

/* Elevated shadow */
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)

/* Modal shadow */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)

/* CTA glow */
shadow-[0_10px_30px_-5px_rgba(240,107,62,0.5)]
```

---

## 6. Component Patterns

### Buttons

```tsx
// Primary Button
className="bg-[#f06b3e] text-white hover:bg-[#e05a2d] active:scale-[0.98]"

// Secondary Button
className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.98]"

// Ghost Button
className="bg-transparent text-slate-600 hover:bg-slate-100 active:scale-[0.98]"

// Sizes
sm: "text-xs px-3 py-1.5 rounded-lg min-h-[32px]"
md: "text-sm px-4 py-2.5 rounded-xl min-h-[44px]"
lg: "text-base px-6 py-3 rounded-2xl min-h-[52px]"
```

### Cards

```tsx
// Base Card
className="bg-white rounded-[2rem] border border-slate-100 shadow-sm"

// Interactive Card
className="bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
```

### Inputs

```tsx
className="w-full bg-[#fafafa] border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f06b3e]/20 focus:border-[#f06b3e]"
```

### Badges

```tsx
// Type badges
Submittal: "bg-blue-50 text-blue-600 border-blue-100"
Issue: "bg-amber-50 text-amber-600 border-amber-100"
RFS: "bg-violet-50 text-violet-600 border-violet-100"

// Status badge (dynamic color)
<span style={{ backgroundColor: statusColor }} className="text-[9px] font-black px-2.5 py-1 rounded-full text-white uppercase">
```

---

## 7. Accessibility

### Focus States

```css
/* Visible focus ring for keyboard navigation */
focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f06b3e] focus-visible:ring-offset-2
```

### ARIA Attributes

- Use `aria-label` for icon-only buttons
- Use `role="tab"` and `aria-selected` for tab interfaces
- Use `aria-live="polite"` for dynamic content
- Use `aria-busy` for loading states

### Touch Targets

- Minimum 44px height for touch targets
- Use `min-h-[44px]` on interactive elements

---

## 8. Animation & Transitions

### Standard Transitions

```css
transition-all duration-200 ease-out
```

### Interactive States

```css
/* Button press */
active:scale-[0.98]

/* Button press (floating) */
active:scale-90

/* Card hover */
hover:shadow-md hover:border-slate-200
```

### Loading Animations

```css
/* Pulse */
animate-pulse

/* Shimmer */
animate-shimmer

/* Spin */
animate-spin
```

### List Stagger

```css
/* Parent */
className="animate-stagger"

/* Children get automatic delay */
```

---

## 9. Layout Patterns

### Mobile Container

```tsx
<div className="relative min-h-screen max-w-md mx-auto bg-[#faf9f6]">
```

### Safe Area Handling

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

### Sticky Header

```tsx
className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100"
```

### Bottom Navigation

```tsx
className="fixed bottom-0 left-0 right-0 z-40"
style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
```

---

## 10. UI Components Library

### Available Components

Located in `/components/ui/`:

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, ghost, destructive variants |
| `Input` | Text input with label, error, success states |
| `Textarea` | Multiline input with character count |
| `Badge` | Status, type, and count badges |
| `StatusBadge` | Dynamic color status indicator |
| `Skeleton` | Loading placeholder |
| `SkeletonCard` | Card loading state |
| `SkeletonFeedItem` | Feed item loading state |
| `EmptyState` | Empty, search, error states |
| `Toast` | Success, error, warning, info notifications |

### Usage

```tsx
import { Button, Input, Badge, Skeleton, EmptyState, useToast } from './components/ui';

// Button
<Button variant="primary" size="md" loading={isLoading}>
  Submit
</Button>

// Input with validation
<Input
  label="Title"
  error={errors.title}
  placeholder="Enter title..."
  required
/>

// Badge
<Badge variant="submittal" icon={<Layers size={12} />}>
  SUB
</Badge>

// Toast
const { showToast } = useToast();
showToast({ type: 'success', title: 'Saved!', message: 'Changes saved.' });
```

---

## 11. Design Tokens

Import from `/components/ui/design-tokens.ts`:

```tsx
import { COLORS, SPACING, RADIUS, SHADOWS, TRANSITIONS, FOCUS_RING } from './components/ui';
```

---

## Changelog

### v1.1.0 (Current)

- Added centralized design tokens
- Created reusable UI component library
- Improved accessibility with focus states
- Added skeleton loading components
- Added toast notification system
- Enhanced button variants and sizes
- Added stagger animations for lists
- Improved empty state patterns
- Better safe area handling
- Enhanced touch targets (44px minimum)

### v1.0.0

- Initial design system
- Basic color palette
- Typography scale
- Component patterns
