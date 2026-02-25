
import React from 'react';
import { X, FileCheck, AlertTriangle, FileInput } from 'lucide-react';

export type CreateAction = 'submission' | 'issue' | 'rfs';

interface CreateActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (action: CreateAction) => void;
}

const actions: { key: CreateAction; label: string; description: string; icon: React.ReactNode; color: string; bgColor: string }[] = [
  {
    key: 'submission',
    label: 'Submission',
    description: 'Submit documents for review and approval',
    icon: <FileCheck size={22} />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    key: 'issue',
    label: 'Issue',
    description: 'Report a construction defect or issue',
    icon: <AlertTriangle size={22} />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
  },
  {
    key: 'rfs',
    label: 'Request for Submission',
    description: 'Request a submittal from a stakeholder',
    icon: <FileInput size={22} />,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-900/30',
  },
];

const CreateActionMenu: React.FC<CreateActionMenuProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[70]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[80] animate-in slide-in-from-bottom duration-300">
        <div className="bg-white dark:bg-slate-800 rounded-t-[2.5rem] p-6 pb-10 shadow-2xl transition-colors">
          <div className="w-12 h-1 bg-slate-100 dark:bg-slate-700 rounded-full mx-auto mb-6" />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create New</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X size={24} className="text-slate-400 dark:text-slate-500" />
            </button>
          </div>

          <div className="space-y-3">
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={() => onSelect(action.key)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <div className={`w-12 h-12 rounded-xl ${action.bgColor} ${action.color} flex items-center justify-center flex-shrink-0`}>
                  {action.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-[15px]">{action.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateActionMenu;
