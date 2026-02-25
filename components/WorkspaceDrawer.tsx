
import React from 'react';
// Changed Workspace to Project as Workspace is not exported from types.ts
import { Project } from '../types';
import { X, Pencil, Plus } from 'lucide-react';

interface WorkspaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Changed type to Project
  workspaces: Project[];
  activeId: string;
  // Changed type to Project
  onSelect: (project: Project) => void;
}

const WorkspaceDrawer: React.FC<WorkspaceDrawerProps> = ({ isOpen, onClose, workspaces, activeId, onSelect }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white dark:bg-slate-800 rounded-t-[2.5rem] p-6 pb-10 shadow-2xl">
          {/* Handle */}
          <div className="w-12 h-1 bg-slate-100 dark:bg-slate-700 rounded-full mx-auto mb-6" />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Workspace</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full">
              <X size={24} className="text-slate-400 dark:text-slate-500" />
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {workspaces.map((w) => (
              <div
                key={w.id}
                onClick={() => onSelect(w)}
                className={`flex items-center justify-between p-4 rounded-3xl border transition-all cursor-pointer ${
                  activeId === w.id
                    ? 'bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600'
                    : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    w.id === '1' ? 'bg-[#95ac71]' : 'bg-[#fecaca]'
                  } ${w.id === '2' ? 'text-blue-500' : ''}`}>
                    {w.initials}
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{w.name}</span>
                </div>
                <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                  <Pencil size={18} />
                </button>
              </div>
            ))}
          </div>

          <button className="w-full bg-[#3b82f6] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95">
            <Plus size={20} />
            New Workspace
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkspaceDrawer;
