// Design Tokens - Centralized design system constants
// Based on 8px grid system for consistent spacing

export const SPACING = {
  xs: '4px',   // 0.5 unit
  sm: '8px',   // 1 unit
  md: '12px',  // 1.5 units
  lg: '16px',  // 2 units
  xl: '24px',  // 3 units
  '2xl': '32px', // 4 units
  '3xl': '48px', // 6 units
} as const;

export const COLORS = {
  // Primary
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primaryLight: 'rgba(240, 107, 62, 0.1)',

  // Background
  background: '#faf9f6',
  surface: '#ffffff',
  surfaceHover: '#f8fafc',

  // Status - Semantic
  success: '#238823',
  warning: '#FFBF00',
  error: '#D2222D',
  info: '#2C7ABB',

  // Neutral
  textPrimary: '#3b82f6',   // slate-800
  textSecondary: '#64748b', // slate-500
  textMuted: '#94a3b8',     // slate-400
  textDisabled: '#cbd5e1',  // slate-300

  border: '#e2e8f0',        // slate-200
  borderLight: '#f1f5f9',   // slate-100

  // Type badges
  submittal: { bg: '#eff6ff', text: '#2563eb', border: '#dbeafe' },
  issue: { bg: '#fffbeb', text: '#d97706', border: '#fef3c7' },
  rfs: { bg: '#f5f3ff', text: '#7c3aed', border: '#ede9fe' },
} as const;

export const RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: '0 10px 30px -5px rgba(240, 107, 62, 0.4)',
} as const;

export const TRANSITIONS = {
  fast: '150ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-out',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// Focus ring styles for accessibility
export const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2';

// Button variants
export const BUTTON_VARIANTS = {
  primary: 'bg-[#3b82f6] text-white hover:bg-[#2563eb] active:scale-[0.98]',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.98]',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:scale-[0.98]',
  destructive: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
  outline: 'bg-transparent text-[#3b82f6] border-2 border-[#3b82f6] hover:bg-blue-50 active:scale-[0.98]',
} as const;

// Input styles
export const INPUT_BASE = 'w-full bg-[#fafafa] border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]';

// Card styles
export const CARD_BASE = 'bg-white rounded-[2rem] border border-slate-100 shadow-sm';
export const CARD_INTERACTIVE = `${CARD_BASE} transition-all active:scale-[0.98] hover:shadow-md cursor-pointer`;
