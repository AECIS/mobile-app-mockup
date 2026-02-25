import React, { useState, useCallback, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Trash2, MapPin, Camera, Image as ImageIcon,
  GripVertical, X, Check, Edit3, ChevronDown, ChevronUp, Search, LayoutGrid
} from 'lucide-react';
import { DTagNode } from '../../types';
import { dTagTree } from '../mockData';

// Types
export interface PhotoLocation {
  id: string;
  dTagId: string;
  dTagPath: string; // Full path like "Building A > Ground Floor > Lobby"
  dTagLabel: string;
  photos: LocationPhoto[];
}

export interface LocationPhoto {
  id: string;
  url: string;
  caption: string;
  uploadedAt: string;
}

interface PhotoLocationManagerProps {
  locations: PhotoLocation[];
  onLocationsChange: (locations: PhotoLocation[]) => void;
  onClose: () => void;
}

// Helper: Generate full path from DTag tree
const findDTagPath = (nodes: DTagNode[], id: string, path: string[] = []): string[] | null => {
  for (const node of nodes) {
    const currentPath = [...path, node.label];
    if (node.id === id) return currentPath;
    if (node.children) {
      const found = findDTagPath(node.children, id, currentPath);
      if (found) return found;
    }
  }
  return null;
};

const findDTagLabel = (nodes: DTagNode[], id: string): string | null => {
  for (const node of nodes) {
    if (node.id === id) return node.label;
    if (node.children) {
      const found = findDTagLabel(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

// ============================================
// DTag Picker Component (for adding locations)
// ============================================
interface DTagPickerProps {
  existingDTagIds: string[];
  onSelect: (dTagId: string, path: string, label: string) => void;
  onClose: () => void;
}

const DTagPicker: React.FC<DTagPickerProps> = ({ existingDTagIds, onSelect, onClose }) => {
  const [currentPath, setCurrentPath] = useState<DTagNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const currentNodes = currentPath.length === 0
    ? dTagTree
    : currentPath[currentPath.length - 1].children || [];

  const flattenTree = (nodes: DTagNode[], path: string[] = []): { node: DTagNode; path: string[] }[] => {
    const result: { node: DTagNode; path: string[] }[] = [];
    for (const node of nodes) {
      const currentNodePath = [...path, node.label];
      result.push({ node, path: currentNodePath });
      if (node.children) {
        result.push(...flattenTree(node.children, currentNodePath));
      }
    }
    return result;
  };

  const searchResults = searchQuery.trim()
    ? flattenTree(dTagTree).filter((item) =>
        item.node.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelect = (node: DTagNode) => {
    const fullPath = findDTagPath(dTagTree, node.id);
    if (fullPath) {
      onSelect(node.id, fullPath.join(' > '), node.label);
    }
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

  return (
    <div className="fixed inset-0 bg-[#fafafa] z-[85] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100 bg-white/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 rounded-xl active:scale-[0.98] active:bg-slate-100 transition-all -ml-1"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800">Add Photo Location</h1>
            <p className="text-[10px] text-slate-400">Select a location from DTag</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-md px-5 pt-3 pb-2 border-b border-slate-100">
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
            placeholder="Search locations..."
            className={`w-full pl-12 pr-12 py-3 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:outline-none ${
              searchQuery
                ? 'bg-indigo-50/50 border border-indigo-200/60 ring-2 ring-indigo-100/50'
                : 'bg-[#fafafa] border border-slate-100 focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]'
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

      {/* Breadcrumb Trail */}
      {!searchQuery && (
        <div className="flex-shrink-0 bg-white px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleBreadcrumbClick(-1)}
              className={`flex items-center gap-1.5 whitespace-nowrap min-h-[32px] px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-[0.98] flex-shrink-0 ${
                currentPath.length === 0
                  ? 'bg-[#3b82f6] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 active:bg-slate-100'
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
                      : 'bg-slate-50 text-slate-500 active:bg-slate-100'
                  }`}
                >
                  {node.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Node List / Search Results */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-4 py-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {searchQuery ? (
            // Search Results
            searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Search className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-400">No results found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map(({ node, path }) => {
                  const isAdded = existingDTagIds.includes(node.id);
                  return (
                    <button
                      key={node.id}
                      onClick={() => !isAdded && handleSelect(node)}
                      disabled={isAdded}
                      className={`w-full flex items-center gap-4 px-4 py-3 min-h-[52px] rounded-2xl active:scale-[0.98] transition-all text-left border ${
                        isAdded
                          ? 'bg-slate-50 border-slate-100 opacity-50'
                          : 'bg-white border-slate-100 hover:border-[#3b82f6]/30'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-[#3b82f6]" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 gap-1">
                        <span className="text-sm font-bold text-slate-700">{node.label}</span>
                        <div className="flex items-center gap-1 overflow-hidden">
                          {path.slice(0, -1).map((segment, sIdx) => (
                            <React.Fragment key={sIdx}>
                              {sIdx > 0 && <ChevronRight className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />}
                              <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                                {segment}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      {isAdded ? (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Added</span>
                      ) : (
                        <Plus size={18} className="text-[#3b82f6] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            // Hierarchical Navigation
            <div className="space-y-2">
              {currentNodes.map((node) => {
                const hasChildren = node.children && node.children.length > 0;
                const isAdded = existingDTagIds.includes(node.id);

                return (
                  <div
                    key={node.id}
                    className={`flex items-center gap-2 bg-white rounded-2xl border border-slate-100 ${
                      hasChildren ? 'border-l-2 border-l-indigo-200' : ''
                    }`}
                  >
                    {/* Select area */}
                    <button
                      onClick={() => !isAdded && handleSelect(node)}
                      disabled={isAdded}
                      className={`flex items-center gap-3 flex-1 min-w-0 px-4 py-3 min-h-[52px] text-left transition-all ${
                        isAdded ? 'opacity-50' : 'active:scale-[0.98]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-[#3b82f6]" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{node.label}</span>
                      {isAdded && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full ml-auto">Added</span>
                      )}
                    </button>

                    {/* Drill-in button */}
                    {hasChildren && (
                      <button
                        onClick={() => handleDrillInto(node)}
                        className="flex items-center gap-1.5 min-w-[56px] min-h-[44px] justify-center px-3 mr-1 bg-slate-50 rounded-xl active:bg-slate-100 active:scale-[0.98] transition-all flex-shrink-0"
                        aria-label={`View ${node.children?.length ?? 0} items`}
                      >
                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full tabular-nums">
                          {node.children?.length ?? 0}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Photo Add Action Sheet
// ============================================
interface PhotoAddSheetProps {
  onCapture: () => void;
  onPickLibrary: () => void;
  onClose: () => void;
}

const PhotoAddSheet: React.FC<PhotoAddSheetProps> = ({ onCapture, onPickLibrary, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-[90] flex items-end justify-center animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-[2rem] animate-in slide-in-from-bottom duration-300"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        <div className="px-4 pb-2">
          <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Add Photo</h3>

          <div className="space-y-2">
            {/* Camera option */}
            <button
              onClick={() => {
                onCapture();
                onClose();
              }}
              className="w-full flex items-center gap-4 px-5 py-4 bg-[#3b82f6]/5 rounded-2xl active:scale-[0.98] transition-all border border-[#3b82f6]/10"
            >
              <div className="w-12 h-12 rounded-xl bg-[#3b82f6] flex items-center justify-center">
                <Camera size={22} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Take Photo</p>
                <p className="text-[11px] text-slate-500">Use camera to capture</p>
              </div>
            </button>

            {/* Library option */}
            <button
              onClick={() => {
                onPickLibrary();
                onClose();
              }}
              className="w-full flex items-center gap-4 px-5 py-4 bg-slate-50 rounded-2xl active:scale-[0.98] transition-all border border-slate-100"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
                <ImageIcon size={22} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Choose from Library</p>
                <p className="text-[11px] text-slate-500">Select existing photos</p>
              </div>
            </button>
          </div>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 text-sm font-bold text-slate-500 active:text-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Photo Item Component (with caption editing)
// ============================================
interface PhotoItemProps {
  photo: LocationPhoto;
  onUpdateCaption: (caption: string) => void;
  onDelete: () => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onUpdateCaption, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(photo.caption);

  const handleSave = () => {
    onUpdateCaption(caption);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCaption(photo.caption);
    setIsEditing(false);
  };

  return (
    <div className="relative group">
      {/* Photo thumbnail */}
      <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-100">
        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-95 transition-all shadow-lg"
          aria-label="Delete photo"
        >
          <Trash2 size={14} />
        </button>

        {/* Caption overlay */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-end justify-between"
          >
            <p className="text-[10px] font-medium text-white truncate flex-1 text-left">
              {photo.caption || 'Add caption...'}
            </p>
            <Edit3 size={12} className="text-white/70 flex-shrink-0 ml-1" />
          </button>
        )}
      </div>

      {/* Caption edit mode */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/80 rounded-xl flex flex-col p-2 animate-in fade-in duration-150">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter caption..."
            autoFocus
            className="flex-1 bg-white/10 text-white text-xs p-2 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-white/30 placeholder:text-white/40"
          />
          <div className="flex gap-1.5 mt-2">
            <button
              onClick={handleCancel}
              className="flex-1 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-bold active:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-1.5 rounded-lg bg-[#3b82f6] text-white text-[10px] font-bold active:bg-[#2563eb] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// Location Card Component (expandable)
// ============================================
interface LocationCardProps {
  location: PhotoLocation;
  onUpdate: (location: PhotoLocation) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);

  const handleAddPhoto = (source: 'camera' | 'library') => {
    // In real app, this would open camera or photo picker
    // For mockup, we'll add a placeholder photo
    const newPhoto: LocationPhoto = {
      id: `photo-${Date.now()}`,
      url: `https://picsum.photos/seed/${Date.now()}/400/300`,
      caption: '',
      uploadedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    onUpdate({
      ...location,
      photos: [...location.photos, newPhoto],
    });
    console.log(`Add photo from ${source} to location: ${location.dTagLabel}`);
  };

  const handleUpdatePhoto = (photoId: string, caption: string) => {
    onUpdate({
      ...location,
      photos: location.photos.map((p) =>
        p.id === photoId ? { ...p, caption } : p
      ),
    });
  };

  const handleDeletePhoto = (photoId: string) => {
    onUpdate({
      ...location,
      photos: location.photos.filter((p) => p.id !== photoId),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Location Header */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-50">
        {/* Drag handle + reorder buttons */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
              isFirst ? 'text-slate-200' : 'text-slate-400 active:bg-slate-100 active:text-slate-600'
            }`}
            aria-label="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <GripVertical size={14} className="text-slate-300" />
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
              isLast ? 'text-slate-200' : 'text-slate-400 active:bg-slate-100 active:text-slate-600'
            }`}
            aria-label="Move down"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Location info */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center gap-3 min-w-0 py-1 active:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-[#3b82f6]" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-slate-700 truncate">{location.dTagLabel}</p>
            <p className="text-[10px] text-slate-400 truncate">{location.dTagPath}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              {location.photos.length} photo{location.photos.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? (
              <ChevronUp size={16} className="text-slate-400" />
            ) : (
              <ChevronDown size={16} className="text-slate-400" />
            )}
          </div>
        </button>

        {/* Delete location */}
        <button
          onClick={onDelete}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all flex-shrink-0"
          aria-label="Remove location"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Photos Grid (collapsible) */}
      {isExpanded && (
        <div className="p-3 bg-[#fafafa]">
          {location.photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {location.photos.map((photo) => (
                <PhotoItem
                  key={photo.id}
                  photo={photo}
                  onUpdateCaption={(caption) => handleUpdatePhoto(photo.id, caption)}
                  onDelete={() => handleDeletePhoto(photo.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 mb-3">
              <ImageIcon size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">No photos yet</p>
            </div>
          )}

          {/* Add photo button */}
          <button
            onClick={() => setShowPhotoSheet(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-[#3b82f6]/50 hover:text-[#3b82f6] active:scale-[0.98] transition-all"
          >
            <Camera size={16} />
            <span className="text-xs font-bold">Add Photos</span>
          </button>
        </div>
      )}

      {/* Photo Add Sheet */}
      {showPhotoSheet && (
        <PhotoAddSheet
          onCapture={() => handleAddPhoto('camera')}
          onPickLibrary={() => handleAddPhoto('library')}
          onClose={() => setShowPhotoSheet(false)}
        />
      )}
    </div>
  );
};

// ============================================
// Main Component: Photo Location Manager
// ============================================
const PhotoLocationManager: React.FC<PhotoLocationManagerProps> = ({
  locations,
  onLocationsChange,
  onClose,
}) => {
  const [showDTagPicker, setShowDTagPicker] = useState(false);

  const handleAddLocation = (dTagId: string, path: string, label: string) => {
    const newLocation: PhotoLocation = {
      id: `loc-${Date.now()}`,
      dTagId,
      dTagPath: path,
      dTagLabel: label,
      photos: [],
    };
    onLocationsChange([...locations, newLocation]);
    setShowDTagPicker(false);
  };

  const handleUpdateLocation = (index: number, location: PhotoLocation) => {
    const updated = [...locations];
    updated[index] = location;
    onLocationsChange(updated);
  };

  const handleDeleteLocation = (index: number) => {
    const updated = locations.filter((_, i) => i !== index);
    onLocationsChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...locations];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onLocationsChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === locations.length - 1) return;
    const updated = [...locations];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onLocationsChange(updated);
  };

  const totalPhotos = locations.reduce((sum, loc) => sum + loc.photos.length, 0);

  return (
    <div className="fixed inset-0 bg-[#faf9f6] z-[80] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-slate-100/60 bg-white/95 backdrop-blur-md"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={onClose}
          className="w-11 h-11 flex items-center justify-center rounded-full active:bg-slate-100 active:scale-[0.98] transition-all -ml-1"
          aria-label="Go back"
        >
          <ChevronLeft size={24} className="text-slate-800" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-black text-slate-800">Photo Locations</h1>
          <p className="text-[10px] font-bold text-slate-400">
            {locations.length} location{locations.length !== 1 ? 's' : ''} • {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowDTagPicker(true)}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3b82f6] text-white active:scale-[0.95] transition-all shadow-lg"
          aria-label="Add location"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* Location List */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-4 py-4 space-y-3" style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}>
          {locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mb-4">
                <MapPin size={32} className="text-slate-300" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-700 mb-1">No Locations Added</h3>
              <p className="text-[13px] text-slate-400 mb-4">Add photo locations from DTag</p>
              <button
                onClick={() => setShowDTagPicker(true)}
                className="flex items-center gap-2 px-5 py-3 bg-[#3b82f6] text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg"
              >
                <Plus size={18} />
                Add Location
              </button>
            </div>
          ) : (
            locations.map((location, index) => (
              <LocationCard
                key={location.id}
                location={location}
                onUpdate={(updated) => handleUpdateLocation(index, updated)}
                onDelete={() => handleDeleteLocation(index)}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                isFirst={index === 0}
                isLast={index === locations.length - 1}
              />
            ))
          )}
        </div>
      </div>

      {/* DTag Picker Modal */}
      {showDTagPicker && (
        <DTagPicker
          existingDTagIds={locations.map((l) => l.dTagId)}
          onSelect={handleAddLocation}
          onClose={() => setShowDTagPicker(false)}
        />
      )}
    </div>
  );
};

export default PhotoLocationManager;
