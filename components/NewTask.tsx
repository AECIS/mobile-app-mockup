
import React from 'react';
import { X, ChevronDown, FileText, Calendar, Clock, Users, Paperclip, Folder } from 'lucide-react';

interface NewTaskProps {
  onClose: () => void;
}

const NewTask: React.FC<NewTaskProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] overflow-y-auto animate-in slide-in-from-bottom duration-300 pb-32">
      <header className="flex items-center justify-between px-4 py-6">
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">New Task</h1>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500">
          <X size={24} />
        </button>
      </header>

      <div className="px-6">
        <button className="flex items-center gap-2 bg-[#fafafa] dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 mb-6 text-slate-500 dark:text-slate-400 font-medium text-xs">
          Select Group <ChevronDown size={14} />
        </button>

        <input 
          placeholder="Enter task title..." 
          className="text-2xl font-bold text-slate-800 dark:text-slate-100 outline-none w-full mb-10 placeholder:text-slate-300 dark:placeholder:text-slate-500 bg-transparent"
        />

        <div className="space-y-8 mb-10">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2 text-sm">
              <FileText size={18} /> Category
            </div>
            <button className="text-slate-300 dark:text-slate-600 text-sm font-bold">Add Category</button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2 text-sm">
              <div className="rotate-45"><Calendar size={18} /></div> Priority
            </div>
            <button className="bg-[#fafafa] dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-bold px-4 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
              Select Priority
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2 text-sm">
              <Calendar size={18} /> Due Dates
            </div>
            <button className="text-slate-300 dark:text-slate-600 text-sm font-bold">Select Dates</button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2 text-sm">
              <Clock size={18} /> Time
            </div>
            <button className="text-slate-300 dark:text-slate-600 text-sm font-bold">Select Time</button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2 text-sm">
              <Users size={18} /> Assign to
            </div>
            <button className="w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-300 dark:text-slate-600">
              <span className="text-xl font-light">+</span>
            </button>
          </div>
        </div>

        <div className="mb-10 border-t border-slate-50 dark:border-slate-800 pt-8">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-base">Description</h3>
          <textarea 
            placeholder="Write a short description..." 
            className="w-full text-sm text-slate-500 dark:text-slate-400 outline-none min-h-[100px] bg-transparent resize-none placeholder:text-slate-300 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="mb-10">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Paperclip size={18} /> Attachments
          </h3>
          <div className="border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-2 bg-[#fafafa] dark:bg-slate-800">
             <Folder size={28} className="text-slate-200 dark:text-slate-600" />
             <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Add Attachment</p>
          </div>
        </div>

        <button className="w-full bg-[#3b82f6] text-white font-bold py-4 rounded-2xl transition-transform active:scale-95">
          Save
        </button>
      </div>
    </div>
  );
};

export default NewTask;
