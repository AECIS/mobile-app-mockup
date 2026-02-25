import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Search, X, Check } from 'lucide-react';
import { MasterDataOption } from '../types';

interface MasterDataSelectorProps {
  title: string;
  options: MasterDataOption[];
  selected: string[];
  onSelectionChange: (ids: string[]) => void;
  onClose: () => void;
  singleSelect?: boolean;
}

export const MasterDataSelector: React.FC<MasterDataSelectorProps> = ({
  title,
  options,
  selected,
  onSelectionChange,
  onClose,
  singleSelect = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus search and prevent body scroll
  useEffect(() => {
    const timer = setTimeout(() => searchRef.current?.focus(), 300);

    // Prevent body scroll
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Focus trap - keep focus within the selector
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab' && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [onClose]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string) => {
    if (singleSelect) {
      onSelectionChange(selected.includes(id) ? [] : [id]);
      if (!selected.includes(id)) {
        setTimeout(() => onClose(), 150);
      }
      return;
    }
    const newSelected = selected.includes(id)
      ? selected.filter((selectedId) => selectedId !== id)
      : [...selected, id];
    onSelectionChange(newSelected);
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 bg-[#fafafa] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200"
    >
      {/* Sticky Header - Frosted Glass */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 transition-all -ml-1"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-200" />
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h1>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 pt-3 pb-3 border-b border-slate-100 dark:border-slate-700">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full pl-14 pr-12 py-3 rounded-2xl bg-[#fafafa] dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Selected Count / Label */}
        <div className="mt-2.5 px-1 flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">
            Selected
          </span>
          {selected.length > 0 ? (
            singleSelect ? (
              <span className="bg-[#3b82f6] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full truncate max-w-[200px]">
                {options.find(o => o.id === selected[0])?.label ?? '1'}
              </span>
            ) : (
              <span className="bg-[#3b82f6] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {selected.length}
              </span>
            )
          ) : (
            <span className="text-[10px] text-slate-300 dark:text-slate-600 font-medium">
              None selected
            </span>
          )}
        </div>
      </div>

      {/* Scrollable Options List */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div
          className="px-4 py-3"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {filteredOptions.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-[2rem] flex items-center justify-center">
                <Search className="w-7 h-7 text-slate-300 dark:text-slate-500" />
              </div>
              <p className="text-[15px] font-bold text-slate-400 dark:text-slate-500">
                No results found
              </p>
              <p className="text-[12px] text-slate-300 dark:text-slate-600 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {filteredOptions.map((option, index) => {
                const isSelected = selected.includes(option.id);
                const isLast = index === filteredOptions.length - 1;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleToggle(option.id)}
                    role={singleSelect ? 'radio' : 'checkbox'}
                    aria-checked={isSelected}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${option.label}`}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 min-h-[52px] active:scale-[0.98] transition-all text-left ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-blue-900/20'
                        : 'active:bg-slate-50'
                    } ${!isLast ? 'border-b border-slate-50 dark:border-slate-700' : ''}`}
                  >
                    {/* Custom Checkbox / Radio */}
                    <div
                      className={`w-7 h-7 ${singleSelect ? 'rounded-full' : 'rounded-xl'} flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#3b82f6] border-[#3b82f6] ring-2 ring-blue-100 shadow-sm'
                          : 'bg-white border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        singleSelect
                          ? <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          : <Check className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-[15px] text-slate-800 dark:text-slate-200 ${
                        isSelected ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
