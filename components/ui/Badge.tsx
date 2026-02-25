import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'submittal' | 'issue' | 'rfs';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-600 border-slate-200',
  primary: 'bg-blue-50 text-[#3b82f6] border-blue-100',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  warning: 'bg-amber-50 text-amber-600 border-amber-100',
  error: 'bg-red-50 text-red-600 border-red-100',
  info: 'bg-blue-50 text-blue-600 border-blue-100',
  submittal: 'bg-blue-50 text-blue-600 border-blue-100',
  issue: 'bg-amber-50 text-amber-600 border-amber-100',
  rfs: 'bg-violet-50 text-violet-600 border-violet-100',
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: 'text-[9px] px-1.5 py-0.5 gap-1',
  md: 'text-[10px] px-2 py-1 gap-1.5',
  lg: 'text-xs px-2.5 py-1.5 gap-2',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  removable = false,
  onRemove,
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-black uppercase tracking-tight
        border rounded-lg whitespace-nowrap
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${className}
      `}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {icon}
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 -mr-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          aria-label="Remove"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <path d="M6.5 1.5L1.5 6.5M1.5 1.5L6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  );
};

// Status Badge with dynamic color
interface StatusBadgeProps {
  color: string;
  children: React.ReactNode;
  size?: BadgeSize;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ color, children, size = 'md' }) => {
  return (
    <span
      className={`
        inline-flex items-center font-black uppercase tracking-wider
        rounded-full text-white whitespace-nowrap
        ${size === 'sm' ? 'text-[8px] px-2 py-0.5' : size === 'md' ? 'text-[9px] px-2.5 py-1' : 'text-[10px] px-3 py-1.5'}
      `}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
};

// Count Badge (for notifications, etc.)
interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: 'primary' | 'error';
  size?: 'sm' | 'md';
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  variant = 'primary',
  size = 'md',
}) => {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <span
      className={`
        inline-flex items-center justify-center font-black text-white rounded-full
        ${variant === 'primary' ? 'bg-[#3b82f6]' : 'bg-red-500'}
        ${size === 'sm' ? 'text-[8px] min-w-[16px] h-4 px-1' : 'text-[10px] min-w-[20px] h-5 px-1.5'}
      `}
    >
      {displayCount}
    </span>
  );
};

export default Badge;
