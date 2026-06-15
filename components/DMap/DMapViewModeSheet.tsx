import React from 'react';
import { Check, X } from 'lucide-react';
import { DMapGroupBy, DMapSortBy, DMapSortOrder } from './types';

interface DMapViewModeSheetProps {
  groupBy: DMapGroupBy;
  sortBy: DMapSortBy;
  sortOrder: DMapSortOrder;
  onClose: () => void;
  onChange: (groupBy: DMapGroupBy, sortBy: DMapSortBy, sortOrder: DMapSortOrder) => void;
}

const DMapViewModeSheet: React.FC<DMapViewModeSheetProps> = ({
  groupBy,
  sortBy,
  sortOrder,
  onClose,
  onChange,
}) => {
  const [localGroupBy, setLocalGroupBy] = React.useState(groupBy);
  const [localSortBy, setLocalSortBy] = React.useState(sortBy);
  const [localSortOrder, setLocalSortOrder] = React.useState(sortOrder);

  const handleApply = () => {
    onChange(localGroupBy, localSortBy, localSortOrder);
  };

  const groupOptions: { value: DMapGroupBy; label: string }[] = [
    { value: 'discipline', label: 'Discipline' },
    { value: 'drawingSet', label: 'Drawing Set' },
    { value: 'drawingType', label: 'Drawing Type' },
  ];

  const sortOptions: { value: DMapSortBy; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'createdDate', label: 'Created Date' },
    { value: 'updatedDate', label: 'Updated Date' },
  ];

  const orderOptions: { value: DMapSortOrder; label: string }[] = [
    { value: 'ascending', label: 'Ascending' },
    { value: 'descending', label: 'Descending' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-end justify-center animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-[2rem] animate-in slide-in-from-bottom duration-300"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">View Settings</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 active:scale-95"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
          {/* Group By */}
          <div className="mb-6">
            <h4 className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 px-2 mb-2">
              Group By
            </h4>
            <div className="space-y-1">
              {groupOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setLocalGroupBy(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-[0.98] ${
                    localGroupBy === option.value
                      ? 'bg-blue-50 border-2 border-[#3b82f6]'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    localGroupBy === option.value ? 'text-[#3b82f6] font-bold' : 'text-slate-700'
                  }`}>
                    {option.label}
                  </span>
                  {localGroupBy === option.value && (
                    <Check size={18} className="text-[#3b82f6]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h4 className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 px-2 mb-2">
              Sort By
            </h4>
            <div className="space-y-1">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setLocalSortBy(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-[0.98] ${
                    localSortBy === option.value
                      ? 'bg-blue-50 border-2 border-[#3b82f6]'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    localSortBy === option.value ? 'text-[#3b82f6] font-bold' : 'text-slate-700'
                  }`}>
                    {option.label}
                  </span>
                  {localSortBy === option.value && (
                    <Check size={18} className="text-[#3b82f6]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Order */}
          <div className="mb-6">
            <h4 className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 px-2 mb-2">
              Order
            </h4>
            <div className="space-y-1">
              {orderOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setLocalSortOrder(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-[0.98] ${
                    localSortOrder === option.value
                      ? 'bg-blue-50 border-2 border-[#3b82f6]'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    localSortOrder === option.value ? 'text-[#3b82f6] font-bold' : 'text-slate-700'
                  }`}>
                    {option.label}
                  </span>
                  {localSortOrder === option.value && (
                    <Check size={18} className="text-[#3b82f6]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="px-4 pt-2">
          <button
            onClick={handleApply}
            className="w-full py-3.5 bg-[#3b82f6] text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DMapViewModeSheet;
