import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, Plus, ChevronRight, ChevronDown, Download, CheckCircle,
  Clock, AlertCircle, Loader2, Search, Filter, Settings, MapPin, RefreshCw
} from 'lucide-react';
import { MapLayout, DMapSection, DMapGroupBy, DMapSortBy, DMapSortOrder, DownloadState } from './types';
import {
  mockMapLayouts, groupMapsByDiscipline, groupMapsByDrawingSet, groupMapsByDrawingType
} from './mockData';
import DMapViewModeSheet from './DMapViewModeSheet';
import DMapFilterSheet from './DMapFilterSheet';
import CreatableDMapList from './CreatableDMapList';

interface DMapListProps {
  onClose: () => void;
  onSelectMap: (map: MapLayout) => void;
}

// Download state indicator
const DownloadIndicator: React.FC<{ state: DownloadState; progress?: number }> = ({ state, progress }) => {
  if (state === 'none') return null;

  const config: Record<DownloadState, { bg: string; text: string; icon: React.ReactNode }> = {
    none: { bg: '', text: '', icon: null },
    inProgress: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <Loader2 size={10} className="animate-spin" /> },
    failed: { bg: 'bg-red-50', text: 'text-red-600', icon: <AlertCircle size={10} /> },
    success: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle size={10} /> },
  };

  const { bg, text, icon } = config[state];

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${bg} ${text}`}>
      {icon}
      {state === 'inProgress' && progress !== undefined && (
        <span className="text-[9px] font-bold">{Math.round(progress)}%</span>
      )}
    </div>
  );
};

// Map card component
const MapCard: React.FC<{
  map: MapLayout;
  onClick: () => void;
  onDownload: () => void;
}> = ({ map, onClick, onDownload }) => {
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload();
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all active:scale-[0.98] text-left hover:shadow-md hover:border-slate-200"
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-slate-100">
        {map.mapThumbnailUrl ? (
          <img
            src={map.mapThumbnailUrl}
            alt={map.mapName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin size={32} className="text-slate-300" />
          </div>
        )}

        {/* Download overlay */}
        {map.downloadMapImageState === 'inProgress' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl px-4 py-2 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-500" />
              <span className="text-sm font-bold text-slate-700">Downloading...</span>
            </div>
          </div>
        )}

        {/* Pin count badge */}
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg flex items-center gap-1">
          <MapPin size={10} />
          <span className="text-[10px] font-bold">{map.pinCount}</span>
        </div>

        {/* Offline indicator */}
        {map.downloadOfflineState === 'success' && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-lg flex items-center gap-1">
            <CheckCircle size={10} />
            <span className="text-[10px] font-bold">Offline</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-700 truncate">{map.mapName}</h3>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              {map.disciplineName} • {map.drawingTypeName}
            </p>
          </div>
          <DownloadIndicator state={map.downloadMapImageState} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400 font-medium">
            Updated {new Date(map.updatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>

          {map.downloadMapImageState !== 'success' && map.downloadMapImageState !== 'inProgress' && (
            <button
              onClick={handleDownloadClick}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg active:scale-95 transition-all"
            >
              <Download size={12} />
              <span className="text-[10px] font-bold">Download</span>
            </button>
          )}

          {map.downloadMapImageState === 'failed' && (
            <button
              onClick={handleDownloadClick}
              className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg active:scale-95 transition-all"
            >
              <RefreshCw size={12} />
              <span className="text-[10px] font-bold">Retry</span>
            </button>
          )}
        </div>
      </div>
    </button>
  );
};

// Section component
const MapSection: React.FC<{
  section: DMapSection;
  onSelectMap: (map: MapLayout) => void;
  onDownloadMap: (map: MapLayout) => void;
}> = ({ section, onSelectMap, onDownloadMap }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-1 py-2"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
          />
          <span className="text-[11px] font-black uppercase tracking-tight text-slate-500">
            {section.title}
          </span>
          <span className="text-[10px] font-bold text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded">
            {section.maps.length}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-2 gap-2.5 mt-2">
          {section.maps.map(map => (
            <MapCard
              key={map.mapID}
              map={map}
              onClick={() => onSelectMap(map)}
              onDownload={() => onDownloadMap(map)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DMapList: React.FC<DMapListProps> = ({ onClose, onSelectMap }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<DMapGroupBy>('discipline');
  const [sortBy, setSortBy] = useState<DMapSortBy>('name');
  const [sortOrder, setSortOrder] = useState<DMapSortOrder>('ascending');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [showViewMode, setShowViewMode] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showCreateable, setShowCreatable] = useState(false);

  // Filter and sort maps
  const filteredMaps = useMemo(() => {
    let maps = [...mockMapLayouts];

    // Search filter
    if (searchQuery) {
      maps = maps.filter(m =>
        m.mapName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filters
    if (activeFilters.has('downloadedMaps')) {
      maps = maps.filter(m => m.downloadMapImageState === 'success');
    }
    if (activeFilters.has('creatingMaps')) {
      maps = maps.filter(m => m.syncStatus !== 0);
    }

    // Sort
    maps.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.mapName.localeCompare(b.mapName);
          break;
        case 'createdDate':
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
          break;
        case 'updatedDate':
          comparison = new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime();
          break;
      }
      return sortOrder === 'ascending' ? comparison : -comparison;
    });

    return maps;
  }, [searchQuery, activeFilters, sortBy, sortOrder]);

  // Group maps
  const sections = useMemo(() => {
    switch (groupBy) {
      case 'discipline':
        return groupMapsByDiscipline(filteredMaps);
      case 'drawingSet':
        return groupMapsByDrawingSet(filteredMaps);
      case 'drawingType':
        return groupMapsByDrawingType(filteredMaps);
      default:
        return groupMapsByDiscipline(filteredMaps);
    }
  }, [filteredMaps, groupBy]);

  const handleDownloadMap = (map: MapLayout) => {
    console.log('Downloading map:', map.mapName);
    // Mock download - in real app, this would trigger download
  };

  const handleViewModeChange = (newGroupBy: DMapGroupBy, newSortBy: DMapSortBy, newOrder: DMapSortOrder) => {
    setGroupBy(newGroupBy);
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setShowViewMode(false);
  };

  const handleFilterChange = (filters: Set<string>) => {
    setActiveFilters(filters);
    setShowFilter(false);
  };

  return (
    <div className="fixed inset-0 bg-[#faf9f6] z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-slate-100/60 bg-white/95 backdrop-blur-md"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 active:scale-[0.98] transition-all -ml-1"
          aria-label="Go back"
        >
          <ChevronLeft size={24} className="text-slate-800" />
        </button>
        <h1 className="text-lg font-black text-slate-800 tracking-tight">DMaps</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowViewMode(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-[0.95] transition-all"
            aria-label="View settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => setShowCreatable(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3b82f6] text-white active:scale-[0.95] transition-all shadow-lg"
            aria-label="Create new DMap"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex-shrink-0 px-3 py-2 bg-white border-b border-slate-100/50">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilter(true)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${
              activeFilters.size > 0
                ? 'bg-[#3b82f6] text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Filter size={18} />
            {activeFilters.size > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#3b82f6] text-[9px] font-black rounded-full flex items-center justify-center">
                {activeFilters.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Map List */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div
          className="px-4 py-4"
          style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}
        >
          {/* Summary */}
          <div className="flex items-center justify-between px-1 mb-4">
            <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">
              {filteredMaps.length} map{filteredMaps.length !== 1 ? 's' : ''}
            </span>
            {activeFilters.size > 0 && (
              <button
                onClick={() => setActiveFilters(new Set())}
                className="text-[10px] font-bold text-[#3b82f6] active:opacity-70"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Sections */}
          {sections.length > 0 ? (
            sections.map(section => (
              <MapSection
                key={section.title}
                section={section}
                onSelectMap={onSelectMap}
                onDownloadMap={handleDownloadMap}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mb-4">
                <MapPin size={32} className="text-slate-300" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-700 mb-1">No maps found</h3>
              <p className="text-[13px] text-slate-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Sheet */}
      {showViewMode && (
        <DMapViewModeSheet
          groupBy={groupBy}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onClose={() => setShowViewMode(false)}
          onChange={handleViewModeChange}
        />
      )}

      {/* Filter Sheet */}
      {showFilter && (
        <DMapFilterSheet
          activeFilters={activeFilters}
          onClose={() => setShowFilter(false)}
          onChange={handleFilterChange}
        />
      )}

      {/* Creatable DMap List */}
      {showCreateable && (
        <CreatableDMapList
          onClose={() => setShowCreatable(false)}
          onSelectDrawing={(drawing) => {
            console.log('Create DMap from drawing:', drawing);
            setShowCreatable(false);
          }}
        />
      )}
    </div>
  );
};

export default DMapList;
