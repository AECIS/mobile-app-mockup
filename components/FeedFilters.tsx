import React, { useState } from 'react';
import { X, ChevronLeft, Search, Check, Filter, RotateCcw, Layers, AlertTriangle, FileInput, Compass, Package, Users, Calendar, Tag, ChevronRight, Bookmark, Plus, Trash2 } from 'lucide-react';
import { DTagSelector } from './DTagSelector';
import { dTagTree } from './mockData';

export interface FeedFilterState {
  types: string[];
  disciplines: string[];
  packages: string[];
  creators: string[];
  assignees: string[];
  statuses: string[];
  severities: string[];
  locations: string[];
  dateRange?: { from?: string; to?: string };
}

interface FeedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FeedFilterState;
  onApply: (filters: FeedFilterState) => void;
  options: {
    types: string[];
    disciplines: string[];
    packages: string[];
    creators: { id: string; name: string; stakeholder?: string }[];
    assignees: { id: string; name: string; stakeholder?: string }[];
    statuses: string[];
    severities?: string[];
    locations?: string[];
  };
}

type FilterCategory = 'types' | 'disciplines' | 'packages' | 'creators' | 'assignees' | 'statuses' | 'dtags';

// Category configuration with icons
const CATEGORY_CONFIG: Record<FilterCategory, { label: string; icon: React.ReactNode; color: string }> = {
  types: { label: 'Type', icon: <Layers size={16} />, color: 'bg-blue-50 text-blue-500' },
  disciplines: { label: 'Discipline', icon: <Compass size={16} />, color: 'bg-teal-50 text-teal-500' },
  packages: { label: 'Package', icon: <Package size={16} />, color: 'bg-violet-50 text-violet-500' },
  dtags: { label: 'DTag', icon: <Tag size={16} />, color: 'bg-amber-50 text-amber-500' },
  assignees: { label: 'Assignee', icon: <Users size={16} />, color: 'bg-emerald-50 text-emerald-500' },
  creators: { label: 'Created By', icon: <Users size={16} />, color: 'bg-sky-50 text-sky-500' },
  statuses: { label: 'Status', icon: <AlertTriangle size={16} />, color: 'bg-blue-50 text-blue-500' },
};

// Shared filter fields that apply to all types
const SHARED_FILTER_FIELDS: FilterCategory[] = ['types', 'disciplines', 'packages', 'dtags', 'assignees'];

// Status options by type
const STATUS_OPTIONS_BY_TYPE: Record<string, { key: string; label: string; color: string }[]> = {
  Submittal: [
    { key: 'Submitted', label: 'Submitted', color: '#2C7ABB' },
    { key: 'InProgress', label: 'In Progress', color: '#FFBF00' },
    { key: 'ReSubmitted', label: 'Resubmitted', color: '#2C7ABB' },
    { key: 'Approved_A', label: 'Approved (A)', color: '#238823' },
    { key: 'Approved_B', label: 'Approved (B)', color: '#238823' },
    { key: 'Rejected', label: 'Rejected (C)', color: '#D2222D' },
    { key: 'ForInfo', label: 'For Info (D)', color: '#238823' },
    { key: 'Cancelled', label: 'Cancelled', color: '#ADB7BE' },
  ],
  Issue: [
    { key: 'Opened', label: 'Opened', color: '#2C7ABB' },
    { key: 'ReOpened', label: 'Re-Opened', color: '#2C7ABB' },
    { key: 'Done', label: 'Done', color: '#FFBF00' },
    { key: 'Closed', label: 'Closed', color: '#238823' },
    { key: 'Cancelled', label: 'Cancelled', color: '#ADB7BE' },
  ],
  RFS: [
    { key: 'Submitted', label: 'Submitted', color: '#2C7ABB' },
    { key: 'InProgress', label: 'In Progress', color: '#FFBF00' },
    { key: 'Closed', label: 'Closed', color: '#238823' },
    { key: 'Cancelled', label: 'Cancelled', color: '#ADB7BE' },
  ],
};


// Type icons
const TYPE_ICONS: Record<string, React.ReactNode> = {
  Submittal: <Layers size={14} className="text-blue-500" />,
  Issue: <AlertTriangle size={14} className="text-amber-500" />,
  RFS: <FileInput size={14} className="text-violet-500" />,
};

// Preset types
interface FilterPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  filters: Partial<FeedFilterState>;
  isPredefined?: boolean;
  color?: string;
}

// Mock saved presets (in real app, this would be persisted)
const INITIAL_SAVED_PRESETS: FilterPreset[] = [
  {
    id: 'my-submittals',
    name: 'My Submittals',
    icon: <Layers size={14} />,
    description: 'Submittals created by me',
    filters: {
      types: ['Submittal'],
      creators: ['m1'],
    },
    color: '#2C7ABB',
  },
];

const TYPE_COLORS: Record<string, string> = {
  Submittal: 'bg-blue-50 text-blue-600 border-blue-200',
  Issue: 'bg-amber-50 text-amber-600 border-amber-200',
  RFS: 'bg-violet-50 text-violet-600 border-violet-200',
};

const FeedFilters: React.FC<FeedFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  options,
}) => {
  const [localFilters, setLocalFilters] = useState<FeedFilterState>(filters);
  const [activeCategory, setActiveCategory] = useState<FilterCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>(INITIAL_SAVED_PRESETS);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [selectedDtags, setSelectedDtags] = useState<string[]>([]);
  const [showDtagSelector, setShowDtagSelector] = useState(false);

  // Get selected types to determine which status sections to show
  const selectedTypes = localFilters.types;

  if (!isOpen) return null;

  const handleToggle = (category: FilterCategory | 'statuses', value: string) => {
    if (category === 'dtags') {
      // Toggle DTag selection
      setSelectedDtags(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    } else {
      setLocalFilters(prev => {
        const current = prev[category as keyof FeedFilterState] as string[];
        const updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        return { ...prev, [category]: updated };
      });
    }
  };

  const handleReset = () => {
    setLocalFilters({
      types: [],
      disciplines: [],
      packages: [],
      creators: [],
      assignees: [],
      statuses: [],
      severities: [],
      locations: [],
    });
    setSelectedDtags([]);
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  // Apply a preset
  const handleApplyPreset = (preset: FilterPreset) => {
    if (activePresetId === preset.id) {
      // Deselect preset - reset filters
      handleReset();
      setActivePresetId(null);
    } else {
      // Apply preset filters
      setLocalFilters(prev => ({
        ...prev,
        ...preset.filters,
      }));
      setActivePresetId(preset.id);
    }
  };

  // Save current filters as a new preset
  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      icon: <Bookmark size={14} />,
      description: `Custom preset with ${totalActive} filters`,
      filters: { ...localFilters },
      color: '#64748b',
    };

    setSavedPresets(prev => [...prev, newPreset]);
    setNewPresetName('');
    setShowSavePresetModal(false);
    setActivePresetId(newPreset.id);
  };

  // Delete a saved preset
  const handleDeletePreset = (presetId: string) => {
    setSavedPresets(prev => prev.filter(p => p.id !== presetId));
    if (activePresetId === presetId) {
      setActivePresetId(null);
    }
  };

  const totalActive = Object.values(localFilters).reduce((sum, val) => {
    if (Array.isArray(val)) return sum + val.length;
    return sum;
  }, 0) + selectedDtags.length;

  // Check if current filters match a preset
  const hasActiveFilters = totalActive > 0;

  // Category detail view
  if (activeCategory) {
    let items: { id: string; label: string; avatar?: boolean; stakeholder?: string }[] = [];

    if (activeCategory === 'creators' || activeCategory === 'assignees') {
      const people = activeCategory === 'creators' ? options.creators : options.assignees;
      items = people.map(p => ({ id: p.id, label: p.name, avatar: true, stakeholder: p.stakeholder }));
    } else if (activeCategory === 'types') {
      items = options.types.map(t => ({ id: t, label: t }));
    } else if (activeCategory === 'disciplines') {
      items = options.disciplines.map(d => ({ id: d, label: d }));
    } else if (activeCategory === 'packages') {
      items = options.packages.map(p => ({ id: p, label: p }));
    }

    const filtered = searchQuery
      ? items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : items;

    const selected = activeCategory === 'dtags'
      ? selectedDtags
      : (localFilters[activeCategory as keyof FeedFilterState] as string[]) || [];

    const config = CATEGORY_CONFIG[activeCategory];

    return (
      <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div
          className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="flex items-center px-4 py-3 gap-3">
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
              className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 dark:active:bg-slate-600 transition-all -ml-1 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-100" />
            </button>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
              {config.icon}
            </div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{config.label}</h1>
            {selected.length > 0 && (
              <span className="bg-[#3b82f6] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {selected.length}
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1.5 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${config.label.toLowerCase()}...`}
              className="w-full pl-14 pr-4 py-3 rounded-2xl bg-[#fafafa] dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {/* Options List */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          <div className="px-4 py-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            {filtered.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center">
                  <Search className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-[15px] font-bold text-slate-400 dark:text-slate-500">No results found</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {filtered.map((item, index) => {
                  const isSelected = selected.includes(item.id);
                  const isLast = index === filtered.length - 1;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggle(activeCategory, item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[52px] active:scale-[0.98] transition-all text-left ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'active:bg-slate-50 dark:active:bg-slate-700'
                      } ${!isLast ? 'border-b border-slate-50 dark:border-slate-700' : ''}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0 ${
                          isSelected
                            ? 'bg-[#3b82f6] border-[#3b82f6] shadow-sm'
                            : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      {item.avatar && (
                        <img
                          src={`https://picsum.photos/seed/${item.id}/100`}
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                          alt=""
                        />
                      )}
                      {activeCategory === 'types' && TYPE_ICONS[item.id] && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${TYPE_COLORS[item.id]?.split(' ')[0] || 'bg-slate-50 dark:bg-slate-700'}`}>
                          {TYPE_ICONS[item.id]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={`text-[14px] text-slate-800 dark:text-slate-100 ${isSelected ? 'font-bold' : 'font-medium'}`}>
                          {item.label}
                        </span>
                        {item.stakeholder && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2">({item.stakeholder})</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main filter view
  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 dark:active:bg-slate-600 transition-all -ml-1"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-600 dark:text-slate-300" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Filters</h1>
            {totalActive > 0 && (
              <span className="bg-[#3b82f6] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {totalActive}
              </span>
            )}
          </div>
          <button
            onClick={handleReset}
            className="w-11 h-11 flex items-center justify-center rounded-xl active:bg-slate-100 dark:active:bg-slate-700 transition-all"
            title="Reset all"
          >
            <RotateCcw size={18} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div className="px-4 py-4 space-y-4" style={{ paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 6rem))' }}>

          {/* Section: Shared Filters */}
          <section>
            <p className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-3 px-1">
              Filter by
            </p>
            <div className="space-y-2">
              {SHARED_FILTER_FIELDS.map(cat => {
                const config = CATEGORY_CONFIG[cat];
                const count = cat === 'dtags'
                  ? selectedDtags.length
                  : (localFilters[cat as keyof FeedFilterState] as string[])?.length || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => cat === 'dtags' ? setShowDtagSelector(true) : setActiveCategory(cat)}
                    className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{config.label}</p>
                        {count > 0 ? (
                          <p className="text-[11px] font-medium text-[#3b82f6] mt-0.5">{count} selected</p>
                        ) : (
                          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">Any</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {count > 0 && (
                        <span className="w-6 h-6 rounded-full bg-[#3b82f6] text-white text-[10px] font-black flex items-center justify-center">
                          {count}
                        </span>
                      )}
                      <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section: Date Range */}
          <section>
            <p className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-3 px-1">
              Update Date
            </p>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400">
                  <Calendar size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Date Range</p>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">All time</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
              </div>
            </div>
          </section>

          {/* Section: Type-Specific Statuses */}
          <section>
            <p className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-3 px-1">
              Status by Type
            </p>

            {/* Type selection info */}
            {selectedTypes.length > 0 ? (
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Showing statuses for:</span>
                {selectedTypes.map(type => (
                  <span key={type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${TYPE_COLORS[type]}`}>
                    {TYPE_ICONS[type]}
                    {type}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3 px-1">Select a type above to see specific statuses</p>
            )}

            <div className="space-y-3">
              {/* Show all type statuses when no type is selected, or only selected types */}
              {(selectedTypes.length === 0 ? ['Submittal', 'Issue'] : selectedTypes).map(type => {
                const statuses = STATUS_OPTIONS_BY_TYPE[type] || [];
                if (statuses.length === 0) return null;

                return (
                  <div key={type} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${TYPE_COLORS[type]?.split(' ')[0] || 'bg-slate-50 dark:bg-slate-700'}`}>
                        {TYPE_ICONS[type]}
                      </div>
                      <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{type} Statuses</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map(status => {
                        const isSelected = localFilters.statuses.includes(status.key);
                        return (
                          <button
                            key={status.key}
                            onClick={() => handleToggle('statuses', status.key)}
                            className={`
                              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold
                              transition-all active:scale-95 cursor-pointer
                              ${isSelected
                                ? 'shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                              }
                            `}
                            style={isSelected ? {
                              backgroundColor: `${status.color}20`,
                              color: status.color,
                            } : {
                              color: '#64748b'
                            }}
                          >
                            {isSelected && <Check size={12} />}
                            {status.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Saved Filter Presets */}
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500">
                Saved Filter Presets
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => setShowSavePresetModal(true)}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#3b82f6] active:opacity-70 transition-opacity"
                >
                  <Plus size={12} />
                  Save Current
                </button>
              )}
            </div>

            {savedPresets.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-center border border-dashed border-slate-200 dark:border-slate-700">
                <Bookmark size={24} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">No saved presets yet</p>
                <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">Apply filters and tap "Save Current"</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedPresets.map(preset => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-700/80 border-2 border-slate-400 dark:border-slate-500'
                          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => handleApplyPreset(preset)}
                        className="flex-1 flex items-center gap-3 min-w-0 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-slate-700 dark:bg-slate-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {preset.icon}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className={`text-[13px] font-bold ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-700 dark:text-slate-200'}`}>
                            {preset.name}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{preset.description}</p>
                        </div>
                        {isActive && (
                          <div className="w-6 h-6 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 active:scale-95 transition-all flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Apply Button */}
      <div
        className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-700 px-4 py-3"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleApply}
          className="w-full bg-[#3b82f6] text-white text-sm font-bold py-4 rounded-2xl active:scale-[0.98] active:bg-[#2563eb] transition-all"
        >
          Apply Filters {totalActive > 0 && `(${totalActive})`}
        </button>
      </div>

      {/* DTag Selector - Hierarchical (no create in filter) */}
      {showDtagSelector && (
        <DTagSelector
          tree={dTagTree}
          selected={selectedDtags}
          onSelectionChange={setSelectedDtags}
          onClose={() => setShowDtagSelector(false)}
        />
      )}

      {/* Save Preset Modal */}
      {showSavePresetModal && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-end justify-center animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-t-[2rem] animate-in slide-in-from-bottom duration-300"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Save Preset</h3>
              <button
                onClick={() => { setShowSavePresetModal(false); setNewPresetName(''); }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors"
              >
                <X size={16} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-4 py-4">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3">
                Save your current filter combination ({totalActive} filters) as a reusable preset.
              </p>

              <div className="mb-4">
                <label className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-2 block">
                  Preset Name
                </label>
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="e.g., My Critical Issues"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-[#fafafa] dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all"
                />
              </div>

              {/* Current filters preview */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 mb-4">
                <p className="text-[9px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-2">Filters included:</p>
                <div className="flex flex-wrap gap-1.5">
                  {localFilters.types.length > 0 && (
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                      {localFilters.types.length} types
                    </span>
                  )}
                  {localFilters.disciplines.length > 0 && (
                    <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-lg">
                      {localFilters.disciplines.length} disciplines
                    </span>
                  )}
                  {localFilters.assignees.length > 0 && (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                      {localFilters.assignees.length} assignees
                    </span>
                  )}
                  {localFilters.statuses.length > 0 && (
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                      {localFilters.statuses.length} statuses
                    </span>
                  )}
                  {localFilters.creators.length > 0 && (
                    <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-1 rounded-lg">
                      {localFilters.creators.length} creators
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleSavePreset}
                disabled={!newPresetName.trim()}
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${
                  newPresetName.trim()
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Bookmark size={16} />
                  Save Preset
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedFilters;
