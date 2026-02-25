
import React from 'react';
import { Task, Priority } from '../types';
import { Plus, MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react';

interface ProjectsListProps {
  onTaskSelect: (task: Task) => void;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Audit Existing Components',
    description: 'Review all current design components and document inconsistencies across platforms.',
    category: 'UI Audit',
    priority: 'High',
    date: 'Friday, 8 Sept 2025',
    status: 'Backlog',
    comments: 10,
    attachments: 6,
    assignees: ['https://picsum.photos/seed/a1/40', 'https://picsum.photos/seed/a2/40']
  },
  {
    id: '2',
    title: 'Design Principles Draft',
    description: 'Outline key principles for consistency, spacing, and brand expression.',
    category: 'UX Research',
    priority: 'Low',
    date: 'Friday, 8 Sept 2025',
    status: 'Backlog',
    comments: 10,
    attachments: 6,
    assignees: ['https://picsum.photos/seed/a3/40', 'https://picsum.photos/seed/a4/40']
  },
  {
    id: '3',
    title: 'Typography Exploration',
    description: 'Experiment with font pairings to establish a balanced hierarchy.',
    category: 'UI Design',
    priority: 'Medium',
    date: 'Friday, 8 Sept 2025',
    status: 'Backlog',
    comments: 10,
    attachments: 6,
    assignees: ['https://picsum.photos/seed/a5/40', 'https://picsum.photos/seed/a6/40']
  }
];

const PriorityPill = ({ priority }: { priority: Priority }) => {
  const colors = {
    High: 'bg-[#fff1f0] text-[#f43f5e]',
    Medium: 'bg-[#f0f3ff] text-[#3b82f6]',
    Low: 'bg-[#f7fcf2] text-[#65a30d]'
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const ProjectsList: React.FC<ProjectsListProps> = ({ onTaskSelect }) => {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 min-h-[600px]">
      <div className="min-w-[320px] max-w-[320px] flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-100" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Backlog</h2>
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
            <Plus size={18} />
            <MoreHorizontal size={18} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {mockTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskSelect(task)}
              className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <div className="flex justify-between items-center mb-4">
                <PriorityPill priority={task.priority} />
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{task.date}</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2">{task.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
                {task.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {task.assignees.map((avatar, idx) => (
                    <img key={idx} src={avatar} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800" alt="Team" />
                  ))}
                </div>
                <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    <span className="text-[10px] font-bold">{task.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Paperclip size={14} />
                    <span className="text-[10px] font-bold">{task.attachments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for Next Column */}
      <div className="min-w-[100px] opacity-30">
        <div className="flex items-center gap-2 mb-4">
           <div className="w-2 h-2 rounded-full bg-[#8ca35b]" />
           <h2 className="font-bold">To Do</h2>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
