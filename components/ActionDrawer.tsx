
import React from 'react';
import { X, Link, Copy, Trash2 } from 'lucide-react';

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActionDrawer: React.FC<ActionDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[70]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[80] animate-in slide-in-from-bottom duration-300">
        <div className="bg-white dark:bg-slate-800 rounded-t-[2.5rem] p-6 pb-10 shadow-2xl">
          <div className="w-12 h-1 bg-slate-100 dark:bg-slate-700 rounded-full mx-auto mb-6" />

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">More Actions</h2>
            <button onClick={onClose} className="p-1"><X size={24} className="text-slate-400 dark:text-slate-500" /></button>
          </div>

          <div className="space-y-6">
            <button className="w-full flex items-center gap-4 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl p-2 -ml-2 transition-colors">
              <div className="w-10 h-10 flex items-center justify-center"><Link size={20} /></div>
              Copy Link
            </button>
            <button className="w-full flex items-center gap-4 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl p-2 -ml-2 transition-colors">
              <div className="w-10 h-10 flex items-center justify-center"><Copy size={20} /></div>
              Duplicate
            </button>
            <button className="w-full flex items-center gap-4 text-[#f43f5e] font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl p-2 -ml-2 transition-colors">
              <div className="w-10 h-10 flex items-center justify-center"><Trash2 size={20} /></div>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionDrawer;
