import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Project, Workspace, ProjectGroup } from '../types';
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAvatarColor, getRecentIds, pushRecentId } from './project-drawer-utils';
import { ProjectCard, SectionLabel, EmptyState } from './project-drawer-cards';

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  workspaces: Workspace[];
  projectGroups: ProjectGroup[];
  activeId: string;
  onSelect: (project: Project) => void;
}

type FilterType = 'all' | 'active' | 'completed';

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ isOpen, onClose, projects, workspaces, projectGroups, activeId, onSelect }) => {
  // When the user belongs to a single workspace, the workspace-picker step is
  // redundant — drill straight into that workspace.
  const singleWorkspace = workspaces.length === 1;

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedWsId, setSelectedWsId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset state when drawer opens.
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilter('all');
      setSelectedWsId(singleWorkspace ? workspaces[0].id : null);
      setIsAnimating(true);
      const t = setTimeout(() => setIsAnimating(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen, singleWorkspace, workspaces]);

  const searching = search.trim().length > 0;
  const selectedWs = workspaces.find((w) => w.id === selectedWsId) || null;
  // Search always overrides drill-down with flat, cross-workspace results.
  const view: 'list' | 'detail' | 'search' = searching ? 'search' : selectedWs ? 'detail' : 'list';

  // Projects in scope for the current view (before filter/search applied).
  const scopeProjects = useMemo(
    () => (view === 'detail' && selectedWs ? projects.filter((p) => p.workspaceId === selectedWs.id) : projects),
    [view, selectedWs, projects]
  );

  const activeCount = scopeProjects.filter((p) => p.state === 'active').length;
  const completedCount = scopeProjects.filter((p) => p.state === 'completed').length;

  // Filtered + searched cards for the detail/search views.
  const displayList = useMemo(() => {
    let list = scopeProjects;
    if (filter === 'active') list = list.filter((p) => p.state === 'active');
    if (filter === 'completed') list = list.filter((p) => p.state === 'completed');
    if (searching) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.initials.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [scopeProjects, filter, search, searching]);

  // Group the detail-view list into (ungrouped projects + project groups).
  // Projects whose groupId doesn't match a known group fall back to ungrouped
  // so they're never silently dropped.
  const detailTree = useMemo(() => {
    if (!selectedWs) return { ungrouped: [] as Project[], groups: [] as { group: ProjectGroup; items: Project[] }[] };
    const knownGroupIds = new Set(projectGroups.map((g) => g.id));
    const ungrouped = displayList.filter((p) => !p.groupId || !knownGroupIds.has(p.groupId));
    const groups = projectGroups
      .filter((g) => g.workspaceId === selectedWs.id)
      .map((g) => ({ group: g, items: displayList.filter((p) => p.groupId === g.id) }))
      .filter((g) => g.items.length > 0);
    return { ungrouped, groups };
  }, [selectedWs, displayList, projectGroups]);

  // Workspace rows for the list view, with per-workspace project counts.
  const workspaceRows = useMemo(
    () => workspaces.map((ws) => ({ ws, count: projects.filter((p) => p.workspaceId === ws.id).length })),
    [workspaces, projects]
  );

  // Recent projects (list view only). Re-read from localStorage when the drawer
  // opens — avoids a read on every render and refreshes after the last session.
  const recentProjects = useMemo(
    () => getRecentIds().map((id) => projects.find((p) => p.id === id)).filter(Boolean) as Project[],
    [projects, isOpen]
  );

  const handleSelect = (p: Project) => {
    pushRecentId(p.id);
    onSelect(p);
  };

  const enterWorkspace = (id: string) => {
    setSelectedWsId(id);
    setFilter('all');
    listRef.current?.scrollTo(0, 0);
  };

  const goBack = () => {
    setSelectedWsId(null);
    setSearch('');
    setFilter('all');
  };

  if (!isOpen) return null;

  const renderCard = (p: Project, keyPrefix = '') => (
    <ProjectCard key={`${keyPrefix}${p.id}`} project={p} isActive={activeId === p.id} onSelect={handleSelect} />
  );

  // Back button shown only when drilled into a workspace from a multi-workspace list.
  const showBack = view === 'detail' && !singleWorkspace;
  const headerTitle = view === 'detail' && selectedWs ? selectedWs.name : 'Switch Project';
  const headerSubtitle =
    view === 'list'
      ? `${workspaces.length} workspace${workspaces.length !== 1 ? 's' : ''}`
      : view === 'search'
        ? `${displayList.length} result${displayList.length !== 1 ? 's' : ''}`
        : `${scopeProjects.length} project${scopeProjects.length !== 1 ? 's' : ''} · ${activeCount} active`;

  const filterChips: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: scopeProjects.length },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'completed', label: 'Completed', count: completedCount },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[3px] z-50 transition-opacity duration-300" onClick={onClose} />

      <div className={`fixed inset-0 max-w-md mx-auto z-50 transition-all duration-300 ease-out ${
        isAnimating ? 'translate-y-full' : 'translate-y-0'
      }`}>
        <div className="bg-white dark:bg-slate-800 shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 pt-2 pb-2">
            {showBack && (
              <button aria-label="Back to workspaces" onClick={goBack} className="p-1.5 -ml-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                <ChevronLeft size={22} className="text-slate-500 dark:text-slate-400" />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{headerTitle}</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{headerSubtitle}</p>
            </div>
            <button aria-label="Close" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
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
                placeholder="Search projects by name or address..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/40"
              />
              {search && (
                <button
                  aria-label="Clear search"
                  onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                >
                  <X size={14} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filter chips — hidden on the workspace list */}
          {view !== 'list' && (
            <div className="px-4 pb-2 flex gap-2">
              {filterChips.map(({ key, label, count }) => (
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
          )}

          {/* Scrollable body */}
          <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3" style={{ scrollbarWidth: 'none' }}>
            {/* LIST VIEW — pick a workspace */}
            {view === 'list' && (
              <>
                {recentProjects.length > 0 && (
                  <div className="mb-4">
                    <SectionLabel>Recent</SectionLabel>
                    <div className="flex flex-col gap-2">
                      {recentProjects.map((p) => renderCard(p, 'recent-'))}
                    </div>
                  </div>
                )}
                <SectionLabel>Workspaces</SectionLabel>
                <div className="flex flex-col gap-2">
                  {workspaceRows.map(({ ws, count }) => (
                    <button
                      key={ws.id}
                      onClick={() => enterWorkspace(ws.id)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer text-left"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 ${getAvatarColor(ws.id)}`}>
                        {ws.initials}
                      </div>
                      <span className="flex-1 min-w-0 font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{ws.name}</span>
                      <span className="shrink-0 text-[11px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">{count}</span>
                      <ChevronRight size={16} className="shrink-0 text-slate-300 dark:text-slate-600" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* SEARCH VIEW — flat cross-workspace results */}
            {view === 'search' && (
              displayList.length > 0 ? (
                <>
                  <SectionLabel>{`${displayList.length} result${displayList.length !== 1 ? 's' : ''}`}</SectionLabel>
                  <div className="flex flex-col gap-2">{displayList.map((p) => renderCard(p))}</div>
                </>
              ) : (
                <EmptyState onClear={() => { setSearch(''); setFilter('all'); }} canClear />
              )
            )}

            {/* DETAIL VIEW — one workspace: ungrouped projects + groups */}
            {view === 'detail' && (
              displayList.length > 0 ? (
                <>
                  {detailTree.ungrouped.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                      {detailTree.ungrouped.map((p) => renderCard(p))}
                    </div>
                  )}
                  {detailTree.groups.map(({ group, items }) => (
                    <div key={group.id} className="mb-4 last:mb-0">
                      <SectionLabel>{group.name}</SectionLabel>
                      <div className="flex flex-col gap-2">{items.map((p) => renderCard(p))}</div>
                    </div>
                  ))}
                </>
              ) : (
                <EmptyState onClear={() => setFilter('all')} canClear={filter !== 'all'} />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDrawer;
