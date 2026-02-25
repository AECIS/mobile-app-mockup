
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Project } from '../types';
import { X, Search, MapPin, CheckCircle2, Clock } from 'lucide-react';

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeId: string;
  onSelect: (project: Project) => void;
}

type FilterType = 'all' | 'active' | 'completed';

// Avatar color palette — deterministic by project id
const AVATAR_COLORS = [
  'bg-[#95ac71]', 'bg-[#5b8fb9]', 'bg-[#e07b54]', 'bg-[#8b6fb0]',
  'bg-[#c0855a]', 'bg-[#6b9e8a]', 'bg-[#d4756b]', 'bg-[#7a8eb5]',
  'bg-[#a4875b]', 'bg-[#6baeae]', 'bg-[#b87dad]', 'bg-[#8aab5e]',
];

const getAvatarColor = (id: string) => {
  const idx = parseInt(id, 10) || id.charCodeAt(0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
};

// Persist recent project ids in localStorage
const RECENT_KEY = 'aecis_recent_projects';
const MAX_RECENT = 3;

const getRecentIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
};

const pushRecentId = (id: string) => {
  const prev = getRecentIds().filter((i) => i !== id);
  const next = [id, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ isOpen, onClose, projects, activeId, onSelect }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilter('all');
      setIsAnimating(true);
      const t = setTimeout(() => setIsAnimating(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Counts
  const activeCount = projects.filter((p) => p.state === 'active').length;
  const completedCount = projects.filter((p) => p.state === 'completed').length;

  // Recent projects
  const recentIds = getRecentIds();
  const recentProjects = useMemo(
    () => recentIds.map((id) => projects.find((p) => p.id === id)).filter(Boolean) as Project[],
    [recentIds, projects]
  );

  // Filtered + searched
  const filtered = useMemo(() => {
    let list = projects;
    if (filter === 'active') list = list.filter((p) => p.state === 'active');
    if (filter === 'completed') list = list.filter((p) => p.state === 'completed');
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.initials.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [projects, filter, search]);

  // Show recent section only when no search and filter is "all"
  const showRecent = !search.trim() && filter === 'all' && recentProjects.length > 0;

  // All-projects list (excluding recent when shown)
  const allProjects = showRecent ? filtered.filter((p) => !recentIds.includes(p.id)) : filtered;

  const handleSelect = (p: Project) => {
    pushRecentId(p.id);
    onSelect(p);
  };

  if (!isOpen) return null;

  const renderProjectCard = (p: Project, isRecent = false) => {
    const isActive = activeId === p.id;
    return (
      <div
        key={`${isRecent ? 'recent-' : ''}${p.id}`}
        onClick={() => handleSelect(p)}
        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer group ${
          isActive
            ? 'bg-[#3b82f6]/5 dark:bg-[#3b82f6]/10 border-[#3b82f6]/30 shadow-sm'
            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70 hover:border-slate-200 dark:hover:border-slate-600'
        }`}
      >
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 ${
          isActive ? 'bg-[#3b82f6]' : getAvatarColor(p.id)
        }`}>
          {p.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm truncate ${
              isActive ? 'text-[#3b82f6]' : 'text-slate-800 dark:text-slate-100'
            }`}>
              {p.name}
            </span>
            {isActive && (
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin size={10} className="text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{p.address}</span>
          </div>
        </div>

        {/* Status badge */}
        <div className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          p.state === 'active'
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
        }`}>
          {p.state === 'active' ? (
            <span className="flex items-center gap-0.5"><Clock size={8} /> Active</span>
          ) : (
            <span className="flex items-center gap-0.5"><CheckCircle2 size={8} /> Done</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[3px] z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-0 max-w-md mx-auto z-50 transition-all duration-300 ease-out ${
        isAnimating ? 'translate-y-full' : 'translate-y-0'
      }`}>
        <div className="bg-white dark:bg-slate-800 shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-2 pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Switch Project</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {projects.length} project{projects.length !== 1 ? 's' : ''} &middot; {activeCount} active
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X size={20} className="text-slate-400 dark:text-slate-500" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pb-2">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or address..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/40"
              />
              {search && (
                <button
                  onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                >
                  <X size={14} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filter chips */}
          <div className="px-4 pb-2 flex gap-2">
            {([
              { key: 'all' as FilterType, label: 'All', count: projects.length },
              { key: 'active' as FilterType, label: 'Active', count: activeCount },
              { key: 'completed' as FilterType, label: 'Completed', count: completedCount },
            ]).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  filter === key
                    ? 'bg-[#3b82f6] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Scrollable list */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                  <Search size={24} className="text-slate-300 dark:text-slate-500" />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No projects found</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Try a different search or filter
                </p>
                {(search || filter !== 'all') && (
                  <button
                    onClick={() => { setSearch(''); setFilter('all'); }}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {filtered.length > 0 && (
              <>
                {/* Recent section */}
                {showRecent && (
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-1">
                      Recent
                    </p>
                    <div className="flex flex-col gap-2">
                      {recentProjects.map((p) => renderProjectCard(p, true))}
                    </div>
                  </div>
                )}

                {/* All projects section */}
                <div>
                  {showRecent && allProjects.length > 0 && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-1">
                      All Projects
                    </p>
                  )}
                  {!showRecent && search.trim() && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-1">
                      {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  <div className="flex flex-col gap-2">
                    {(showRecent ? allProjects : filtered).map((p) => renderProjectCard(p))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ProjectDrawer;
