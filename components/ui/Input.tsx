import React, { forwardRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const SIZE_STYLES = {
  sm: 'px-3 py-2 text-xs min-h-[36px]',
  md: 'px-4 py-3 text-sm min-h-[44px]',
  lg: 'px-5 py-4 text-base min-h-[52px]',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  hint,
  icon,
  size = 'md',
  fullWidth = true,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
    : success
    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20'
    : 'border-slate-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-[11px] font-black uppercase tracking-tight text-slate-500 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full bg-[#fafafa] border rounded-2xl
            text-slate-800 placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:bg-white
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
            ${SIZE_STYLES[size]}
            ${icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${stateStyles}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {(error || success) && (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${isPassword ? 'right-11' : ''}`}>
            {error && <AlertCircle size={18} className="text-red-500" />}
            {success && <CheckCircle2 size={18} className="text-emerald-500" />}
          </div>
        )}
      </div>
      {(error || success || hint) && (
        <p className={`mt-1.5 text-[11px] font-medium ${
          error ? 'text-red-500' : success ? 'text-emerald-500' : 'text-slate-400'
        }`}>
          {error || success || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  success,
  hint,
  showCount = false,
  maxLength,
  className = '',
  value,
  ...props
}, ref) => {
  const charCount = typeof value === 'string' ? value.length : 0;

  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
    : success
    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20'
    : 'border-slate-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-black uppercase tracking-tight text-slate-500 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={`
            w-full bg-[#fafafa] border rounded-2xl px-4 py-3
            text-sm text-slate-800 placeholder:text-slate-400
            transition-all duration-200 resize-none min-h-[100px]
            focus:outline-none focus:ring-2 focus:bg-white
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
            ${stateStyles}
            ${className}
          `}
          {...props}
        />
        {showCount && maxLength && (
          <div className="absolute bottom-2 right-3 text-[10px] font-bold text-slate-300">
            {charCount}/{maxLength}
          </div>
        )}
      </div>
      {(error || success || hint) && (
        <p className={`mt-1.5 text-[11px] font-medium ${
          error ? 'text-red-500' : success ? 'text-emerald-500' : 'text-slate-400'
        }`}>
          {error || success || hint}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
