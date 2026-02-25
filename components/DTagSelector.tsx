import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Check, LayoutGrid, Plus } from 'lucide-react';
import { DTagNode } from '../types';

interface DTagSelectorProps {
  tree: DTagNode[];
  selected: string[];
  onSelectionChange: (ids: string[]) => void;
  onClose: () => void;
  allowCreate?: boolean;
  onCreateTag?: (label: string, parentPath: DTagNode[]) => string; // Returns new tag ID
}

interface FlattenedNode {
  node: DTagNode;
  path: string[];
}

export const DTagSelector: React.FC<DTagSelectorProps> = ({
  tree,
  selected,
  onSelectionChange,
  onClose,
  allowCreate = false,
  onCreateTag,
}) => {
  const [currentPath, setCurrentPath] = useState<DTagNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [localTree, setLocalTree] = useState<DTagNode[]>(tree);
  const [createdTags, setCreatedTags] = useState<Map<string, string>>(new Map()); // id -> label for newly created tags
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagLabel, setNewTagLabel] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync local tree with prop
  useEffect(() => {
    setLocalTree(tree);
  }, [tree]);

  // Auto-focus search and prevent body scroll
  useEffect(() => {
    const timer = setTimeout(() => searchRef.current?.focus(), 300);

    // Prevent body scroll
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Focus trap - keep focus within the selector
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab' && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [onClose]);

  const currentNodes = useMemo(() => {
    if (currentPath.length === 0) return localTree;
    return currentPath[currentPath.length - 1].children || [];
  }, [currentPath, localTree]);

  const flattenTree = (nodes: DTagNode[], path: string[] = []): FlattenedNode[] => {
    const result: FlattenedNode[] = [];
    for (const node of nodes) {
      const currentNodePath = [...path, node.label];
      result.push({ node, path: currentNodePath });
      if (node.children) {
        result.push(...flattenTree(node.children, currentNodePath));
      }
    }
    return result;
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const flattened = flattenTree(localTree);
    return flattened.filter((item) =>
      item.node.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, localTree]);

  const findNodeLabel = (nodes: DTagNode[], id: string): string | null => {
    // First check created tags
    if (createdTags.has(id)) {
      return createdTags.get(id) || null;
    }
    for (const node of nodes) {
      if (node.id === id) return node.label;
      if (node.children) {
        const found = findNodeLabel(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getSelectedLabels = () => {
    return selected
      .map((id) => findNodeLabel(localTree, id) || createdTags.get(id))
      .filter((label): label is string => label !== null);
  };

  // Open create modal
  const openCreateModal = () => {
    setNewTagName('');
    setNewTagLabel(searchQuery.trim()); // Pre-fill label from search if available
    setShowCreateModal(true);
  };

  // Create new tag handler
  const handleCreateTag = () => {
    if (!newTagName.trim() || !newTagLabel.trim()) return;

    const newId = `dt-${newTagName.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newNode: DTagNode = { id: newId, label: newTagLabel.trim() };

    // Track the created tag
    setCreatedTags(prev => new Map(prev).set(newId, newTagLabel.trim()));

    // Add to local tree at current path level
    if (currentPath.length === 0) {
      setLocalTree(prev => [...prev, newNode]);
    } else {
      // Deep clone and add to the correct parent
      const updateTree = (nodes: DTagNode[], pathIndex: number): DTagNode[] => {
        return nodes.map(node => {
          if (node.id === currentPath[pathIndex].id) {
            if (pathIndex === currentPath.length - 1) {
              // This is the target parent
              return {
                ...node,
                children: [...(node.children || []), newNode]
              };
            } else {
              // Keep drilling down
              return {
                ...node,
                children: updateTree(node.children || [], pathIndex + 1)
              };
            }
          }
          return node;
        });
      };
      setLocalTree(prev => updateTree(prev, 0));
    }

    // Call external handler if provided
    if (onCreateTag) {
      onCreateTag(newTagLabel.trim(), currentPath);
    }

    // Auto-select the new tag, close modal and clear search
    onSelectionChange([...selected, newId]);
    setShowCreateModal(false);
    setSearchQuery('');
    setNewTagName('');
    setNewTagLabel('');
  };

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onSelectionChange(newSelected);
  };

  const handleDrillInto = (node: DTagNode) => {
    setCurrentPath([...currentPath, node]);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  const handleRemoveSelection = (id: string) => {
    onSelectionChange(selected.filter((s) => s !== id));
  };

  // Checkbox component to avoid duplication
  const Checkbox = ({ checked }: { checked: boolean }) => (
    <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all flex-shrink-0 ${
        checked
          ? 'bg-[#3b82f6] border-[#3b82f6] ring-2 ring-blue-100 shadow-sm'
          : 'bg-white border-slate-200 dark:border-slate-600'
      }`}
    >
      {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
    </div>
  );

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Select DTags"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 bg-[#fafafa] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200"
    >
      {/* Frosted Glass Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-sm"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-2">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 transition-all flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">DTags</h1>
            {selected.length > 0 && (
              <span className="bg-[#3b82f6] text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                {selected.length}
              </span>
            )}
          </div>
          {/* Create New Button in Header - Always Visible */}
          {allowCreate && (
            <button
              onClick={openCreateModal}
              className="w-10 h-10 flex items-center justify-center bg-[#3b82f6] text-white rounded-xl active:scale-[0.98] transition-all shadow-sm flex-shrink-0"
              aria-label="Create new DTag"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-700">
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
              searchQuery ? 'text-indigo-400' : 'text-slate-400'
            }`}
          />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className={`w-full pl-12 pr-12 py-3 rounded-2xl shadow-sm text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none ${
              searchQuery
                ? 'bg-indigo-50/50 border border-indigo-200/60 ring-2 ring-indigo-100/50'
                : 'bg-[#fafafa] dark:bg-slate-800 border border-slate-100 dark:border-slate-600 focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Chips Row */}
      {selected.length > 0 && (
        <div className="flex-shrink-0 bg-white dark:bg-slate-800 px-5 py-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5 items-center">
            {getSelectedLabels().map((label, idx) => {
              const id = selected[idx];
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/20 border border-blue-100/50 shadow-sm text-[#3b82f6] text-xs font-semibold pl-3 pr-1 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                >
                  <span>{label}</span>
                  <div className="p-0.5">
                    <button
                      onClick={() => handleRemoveSelection(id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100/60 active:bg-blue-200 transition-colors"
                      aria-label={`Remove ${label}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
            {selected.length >= 2 && (
              <button
                onClick={() => onSelectionChange([])}
                className="text-[10px] font-black uppercase tracking-tight text-slate-400 whitespace-nowrap px-2 min-h-[32px] flex items-center active:text-[#3b82f6] transition-colors flex-shrink-0"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Breadcrumb Trail */}
      {!searchQuery && (
        <div className="flex-shrink-0 bg-white dark:bg-slate-800 px-5 py-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleBreadcrumbClick(-1)}
              className={`flex items-center gap-1.5 whitespace-nowrap min-h-[32px] px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-[0.98] flex-shrink-0 ${
                currentPath.length === 0
                  ? 'bg-[#3b82f6] text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 active:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All</span>
            </button>
            {currentPath.map((node, idx) => (
              <React.Fragment key={node.id}>
                <ChevronRight className="w-3 h-3 text-slate-200 flex-shrink-0" />
                <button
                  onClick={() => handleBreadcrumbClick(idx)}
                  className={`text-xs whitespace-nowrap min-h-[32px] px-3 py-1.5 rounded-full font-semibold transition-all active:scale-[0.98] flex-shrink-0 ${
                    idx === currentPath.length - 1
                      ? 'bg-[#3b82f6] text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 active:bg-slate-100'
                  }`}
                >
                  {node.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Node List / Search Results */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-4 py-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {searchQuery ? (
            // Search Results
            searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Search className="w-6 h-6 text-slate-300 dark:text-slate-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No results found</p>
                  <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Try a different search term</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map(({ node, path }) => {
                  const isSelected = selected.includes(node.id);
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleToggle(node.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${node.label}`}
                      className={`w-full flex items-center gap-4 px-4 py-3 min-h-[52px] rounded-2xl active:scale-[0.98] transition-all text-left border ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-50 to-sky-50/50 dark:from-blue-900/30 dark:to-sky-900/20 border-blue-100/50 shadow-sm'
                          : 'bg-[#fafafa] dark:bg-slate-800 border-slate-100/50 dark:border-slate-700'
                      }`}
                    >
                      <Checkbox checked={isSelected} />
                      <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                        <span className={`text-sm font-semibold ${isSelected ? 'text-[#3b82f6]' : 'text-slate-700 dark:text-slate-200'}`}>
                          {node.label}
                        </span>
                        <div className="flex items-center gap-1 overflow-hidden">
                          {path.map((segment, sIdx) => (
                            <React.Fragment key={sIdx}>
                              {sIdx > 0 && (
                                <ChevronRight className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />
                              )}
                              <span className="text-[10px] font-medium text-slate-400 bg-slate-100/80 dark:bg-slate-700 px-1.5 py-0.5 rounded-md whitespace-nowrap flex-shrink-0">
                                {segment}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            // Hierarchical Navigation
            currentNodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-slate-300 dark:text-slate-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">This category is empty</p>
                  <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">No items available here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {currentNodes.map((node) => {
                  const isSelected = selected.includes(node.id);
                  const hasChildren = node.children && node.children.length > 0;
                  return (
                    <div
                      key={node.id}
                      className={`flex items-center gap-2 bg-[#fafafa] dark:bg-slate-800 rounded-2xl border border-slate-100/50 dark:border-slate-700 active:scale-[0.98] transition-all ${
                        hasChildren ? 'border-l-2 border-l-indigo-200' : ''
                      }`}
                    >
                      {/* Checkbox + Label area - toggles selection */}
                      <button
                        onClick={() => handleToggle(node.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={`${isSelected ? 'Deselect' : 'Select'} ${node.label}`}
                        className="flex items-center gap-4 flex-1 min-w-0 px-4 py-3 min-h-[52px] text-left"
                      >
                        <Checkbox checked={isSelected} />
                        <span className={`text-sm font-semibold ${isSelected ? 'text-[#3b82f6]' : 'text-slate-700 dark:text-slate-200'}`}>
                          {node.label}
                        </span>
                      </button>

                      {/* Drill-in button - separate touch target */}
                      {hasChildren && (
                        <button
                          onClick={() => handleDrillInto(node)}
                          className="flex items-center gap-1.5 min-w-[56px] min-h-[44px] justify-center px-3 mr-1 bg-slate-50 dark:bg-slate-700 rounded-xl active:bg-slate-100 active:scale-[0.98] transition-all flex-shrink-0"
                          aria-label={`View ${node.children?.length ?? 0} items in ${node.label}`}
                        >
                          <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full tabular-nums">
                            {node.children?.length ?? 0}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                      )}
                    </div>
                  );
                })}

              </div>
            )
          )}
        </div>
      </div>

      {/* Create New DTag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-end justify-center animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-t-[2rem] animate-in slide-in-from-bottom duration-300"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Create New DTag</h3>
              <button
                onClick={() => { setShowCreateModal(false); setNewTagName(''); setNewTagLabel(''); }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors"
              >
                <X size={16} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-5">
              {/* Location info */}
              {currentPath.length > 0 && (
                <div className="mb-4 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-1">Creating in</p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {currentPath.map(n => n.label).join(' › ')}
                  </p>
                </div>
              )}

              {/* Name field */}
              <div className="mb-4">
                <label className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-2 block">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g., zone-b1-north"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-[#fafafa] dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">Unique identifier (no spaces, lowercase)</p>
              </div>

              {/* Label field */}
              <div className="mb-5">
                <label className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-2 block">
                  Label <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newTagLabel}
                  onChange={(e) => setNewTagLabel(e.target.value)}
                  placeholder="e.g., Zone B1 North"
                  className="w-full px-4 py-3 rounded-xl bg-[#fafafa] dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">Display name shown in the UI</p>
              </div>

              <button
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || !newTagLabel.trim()}
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  newTagName.trim() && newTagLabel.trim()
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <Plus size={16} />
                Create DTag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
