import React from 'react';
import { Project } from '../types';
import { Search, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { getAvatarColor } from './project-drawer-utils';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onSelect: (project: Project) => void;
}

// A single selectable project row (avatar + name/address + state badge).
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isActive, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(project)}
    className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer group ${
      isActive
        ? 'bg-[#3b82f6]/5 dark:bg-[#3b82f6]/10 border-[#3b82f6]/30 shadow-sm'
        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70 hover:border-slate-200 dark:hover:border-slate-600'
    }`}
  >
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 ${
      isActive ? 'bg-[#3b82f6]' : getAvatarColor(project.id)
    }`}>
      {project.initials}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-sm truncate ${
          isActive ? 'text-[#3b82f6]' : 'text-slate-800 dark:text-slate-100'
        }`}>
          {project.name}
        </span>
        {isActive && <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />}
      </div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <MapPin size={10} className="text-slate-400 dark:text-slate-500 shrink-0" />
        <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{project.address}</span>
      </div>
    </div>
    <div className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      project.state === 'active'
        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
    }`}>
      {project.state === 'active' ? (
        <span className="flex items-center gap-0.5"><Clock size={8} /> Active</span>
      ) : (
        <span className="flex items-center gap-0.5"><CheckCircle2 size={8} /> Done</span>
      )}
    </div>
  </button>
);

// Section heading used between project groups.
export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-1">{children}</p>
);

// Shared empty state for the search/detail views.
export const EmptyState: React.FC<{ onClear: () => void; canClear: boolean }> = ({ onClear, canClear }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
      <Search size={24} className="text-slate-300 dark:text-slate-500" />
    </div>
    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No projects found</p>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try a different search or filter</p>
    {canClear && (
      <button
        onClick={onClear}
        className="mt-3 px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
      >
        Clear filters
      </button>
    )}
  </div>
);
