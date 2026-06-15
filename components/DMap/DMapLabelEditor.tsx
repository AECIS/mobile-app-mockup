import React, { useState } from 'react';
import { ChevronLeft, Info } from 'lucide-react';

interface DMapLabelEditorProps {
  currentLabel: string;
  onClose: () => void;
  onSave: (label: string) => void;
}

const DMapLabelEditor: React.FC<DMapLabelEditorProps> = ({
  currentLabel,
  onClose,
  onSave,
}) => {
  const [label, setLabel] = useState(currentLabel);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric, max 3 characters
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3);
    setLabel(value);
  };

  const handleSave = () => {
    onSave(label);
  };

  return (
    <div className="fixed inset-0 bg-[#faf9f6] z-[80] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-slate-100/60 bg-white/95 backdrop-blur-md"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={onClose}
          className="w-11 h-11 flex items-center justify-center rounded-full active:bg-slate-100 active:scale-[0.98] transition-all -ml-1"
          aria-label="Go back"
        >
          <ChevronLeft size={24} className="text-slate-800" />
        </button>
        <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Edit Label</h1>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#3b82f6] text-white rounded-xl font-bold text-sm active:scale-[0.95] transition-all"
        >
          Save
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {/* Label Input */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
          <label className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 block mb-3">
            Annotation Label
          </label>
          <input
            type="text"
            value={label}
            onChange={handleChange}
            placeholder="A01"
            maxLength={3}
            className="w-full text-center text-4xl font-extrabold text-slate-800 bg-slate-50 rounded-xl py-6 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 uppercase"
            autoFocus
          />
          <p className="text-center text-[11px] text-slate-400 font-medium mt-3">
            {label.length}/3 characters
          </p>
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
              Labels can be up to 3 alphanumeric characters. They are displayed on the map when viewing by label mode.
            </p>
            <p className="text-[11px] text-amber-600 leading-relaxed font-bold mt-2">
              Examples: A01, B12, C03
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6">
          <label className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 block mb-3 px-2">
            Preview
          </label>
          <div className="bg-slate-100 rounded-2xl p-8 flex items-center justify-center">
            <div className="relative">
              {/* Pin preview */}
              <div className="px-4 py-2 rounded-lg bg-blue-500 shadow-lg">
                <span className="text-lg font-extrabold text-white">
                  {label || '???'}
                </span>
              </div>
              {/* Arrow */}
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '10px solid #3b82f6',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMapLabelEditor;
