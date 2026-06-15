
import React, { useState } from 'react';
import { Task } from '../types';
// Added MessageSquare to the imports from lucide-react
import { MoreVertical, FileText, Calendar, Clock, Users, Paperclip, Send, Smile, MessageSquare } from 'lucide-react';
import ActionDrawer from './ActionDrawer';
import OverlayHeader from './overlay-header';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col animate-in slide-in-from-bottom duration-300">
      <OverlayHeader
        title="Task detail"
        onBack={onClose}
        right={
          <button
            onClick={() => setIsActionsOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500"
          >
            <MoreVertical size={24} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <span className="inline-block bg-[#f7fcf2] dark:bg-green-950 text-[#65a34a] dark:text-green-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
          • To Do
        </span>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-8">
          Final UI Review with Lead Designer
        </h2>

        <div className="space-y-6 mb-10">
          <div className="flex items-center">
            <div className="w-28 text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2">
              <FileText size={16} /> Category
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-300">UX Research</div>
          </div>
          <div className="flex items-center">
            <div className="w-28 text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2">
              <div className="rotate-45"><Calendar size={16} /></div> Priority
            </div>
            <div className="bg-[#fff1f0] dark:bg-red-950 text-[#f43f5e] dark:text-red-400 text-[10px] font-bold px-3 py-1 rounded-full">High</div>
          </div>
          <div className="flex items-center">
            <div className="w-28 text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2">
              <Calendar size={16} /> Due Dates
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-300">Friday, 12 September 2025</div>
          </div>
          <div className="flex items-center">
            <div className="w-28 text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2">
              <Clock size={16} /> Time
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-300">09:00 - 11:30 AM</div>
          </div>
          <div className="flex items-center">
            <div className="w-28 text-slate-400 dark:text-slate-500 font-medium flex items-center gap-2">
              <Users size={16} /> Assign to
            </div>
            <div className="flex -space-x-2">
              <img src="https://picsum.photos/seed/u1/40" className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800" />
              <img src="https://picsum.photos/seed/u2/40" className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Description</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Conduct final design review before handoff to development team to ensure all visual details, interactions, and component.
          </p>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Paperclip size={18} /> Attachments
            </h3>
            <button className="text-[#3b82f6] dark:text-blue-400 text-xs font-bold">+Add Files</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#fafafa] dark:bg-slate-800 p-4 rounded-2xl border border-slate-50 dark:border-slate-700">
              <div className="bg-red-500 w-8 h-10 rounded-sm mb-3 flex items-center justify-center text-[8px] text-white font-black">PDF</div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 mb-0.5">User-Research</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">12.0 MB</p>
            </div>
            <div className="bg-[#fafafa] dark:bg-slate-800 p-4 rounded-2xl border border-slate-50 dark:border-slate-700">
              <div className="bg-blue-500 w-8 h-10 rounded-sm mb-3 flex items-center justify-center text-[8px] text-white font-black">DOC</div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 mb-0.5">Persona-Analysis</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">12.0 MB</p>
            </div>
          </div>
        </div>

        <div className="pb-32">
           <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
             <MessageSquare size={18} /> Comment
           </h3>
           <div className="flex gap-3 items-start">
             <img src="https://picsum.photos/seed/ken/40" className="w-8 h-8 rounded-full" />
             <div className="flex-1">
               <div className="flex justify-between mb-1">
                 <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Kenneth Alanda</span>
                 <span className="text-[10px] text-slate-400 dark:text-slate-500">10:00 AM</span>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">I have updated the latest research file. Please take a look!</p>
             </div>
           </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-700 flex items-center gap-3">
        <div className="flex-1 bg-[#fafafa] dark:bg-slate-800 rounded-full h-12 flex items-center px-4 gap-2 border border-slate-100 dark:border-slate-700">
          <input
            placeholder="Type your comment..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button className="text-slate-400 dark:text-slate-500"><Smile size={20} /></button>
          <button className="text-slate-400 dark:text-slate-500 rotate-45"><Paperclip size={20} /></button>
        </div>
        <button className="w-12 h-12 bg-[#3b82f6] dark:bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-[#2563eb] dark:hover:bg-blue-500 transition-colors">
          <Send size={20} />
        </button>
      </div>

      <ActionDrawer 
        isOpen={isActionsOpen} 
        onClose={() => setIsActionsOpen(false)} 
      />
    </div>
  );
};

export default TaskDetail;
