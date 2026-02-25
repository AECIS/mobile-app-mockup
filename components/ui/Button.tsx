import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:bg-blue-300',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:bg-slate-100',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 disabled:text-slate-300',
  destructive: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
  outline: 'bg-transparent text-[#3b82f6] border-2 border-[#3b82f6] hover:bg-blue-50 disabled:border-blue-200 disabled:text-blue-300',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg min-h-[32px]',
  md: 'text-sm px-4 py-2.5 rounded-xl min-h-[44px]',
  lg: 'text-base px-6 py-3 rounded-2xl min-h-[52px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 font-bold
        transition-all duration-200 ease-out
        active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="animate-spin" />
      ) : (
        icon && iconPosition === 'left' && icon
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;
