import React from 'react';
import { ChevronLeft } from 'lucide-react';

// ---------------------------------------------------------------------------
// Canonical full-screen overlay header - back button (left), centered title,
// optional right action. Shared across overlay screens for consistent UI.
// ---------------------------------------------------------------------------
interface OverlayHeaderProps {
  title?: string;            // centered title (default)
  center?: React.ReactNode;  // custom centered content (e.g. status badges) - overrides title
  onBack: () => void;
  right?: React.ReactNode;   // optional right-side action(s)
}

const OverlayHeader: React.FC<OverlayHeaderProps> = ({ title, center, onBack, right }) => (
  <div
    className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
    style={{ paddingTop: 'env(safe-area-inset-top)' }}
  >
    <div className="relative flex items-center px-4 py-3 min-h-[40px]">
      <button
        onClick={onBack}
        className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700 active:scale-[0.98] transition-all -ml-1 z-10"
        aria-label="Back"
      >
        <ChevronLeft size={24} className="text-slate-800 dark:text-slate-200" />
      </button>
      {center ? (
        <div className="absolute inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none px-14">
          {center}
        </div>
      ) : (
        <h1 className="absolute inset-x-0 text-center text-lg font-bold text-slate-800 dark:text-slate-100 pointer-events-none">
          {title}
        </h1>
      )}
      <div className="ml-auto z-10">{right}</div>
    </div>
  </div>
);

export default OverlayHeader;
