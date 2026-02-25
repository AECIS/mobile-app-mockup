import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface DMapFilterSheetProps {
  activeFilters: Set<string>;
  onClose: () => void;
  onChange: (filters: Set<string>) => void;
}

const DMapFilterSheet: React.FC<DMapFilterSheetProps> = ({
  activeFilters,
  onClose,
  onChange,
}) => {
  const [localFilters, setLocalFilters] = useState(new Set(activeFilters));

  const filterOptions = [
    { value: 'downloadedMaps', label: 'Downloaded Maps', description: 'Show only maps available offline' },
    { value: 'creatingMaps', label: 'Creating Maps', description: 'Show maps pending sync' },
  ];

  const toggleFilter = (value: string) => {
    const newFilters = new Set(localFilters);
    if (newFilters.has(value)) {
      newFilters.delete(value);
    } else {
      newFilters.add(value);
    }
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleClear = () => {
    setLocalFilters(new Set());
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-end justify-center animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-[2rem] animate-in slide-in-from-bottom duration-300"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Filter Maps</h3>
          <div className="flex items-center gap-2">
            {localFilters.size > 0 && (
              <button
                onClick={handleClear}
                className="text-sm font-bold text-slate-500 active:opacity-70"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 active:scale-95"
            >
              <X size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <div className="space-y-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleFilter(option.value)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all active:scale-[0.98] ${
                  localFilters.has(option.value)
                    ? 'bg-blue-50 border-2 border-[#3b82f6]'
                    : 'bg-slate-50 border-2 border-transparent'
                }`}
              >
                <div className="text-left">
                  <span className={`text-sm font-bold block ${
                    localFilters.has(option.value) ? 'text-[#3b82f6]' : 'text-slate-700'
                  }`}>
                    {option.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {option.description}
                  </span>
                </div>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  localFilters.has(option.value) ? 'bg-[#3b82f6]' : 'bg-slate-200'
                }`}>
                  {localFilters.has(option.value) && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <div className="px-4 pt-2">
          <button
            onClick={handleApply}
            className="w-full py-3.5 bg-[#3b82f6] text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default DMapFilterSheet;
