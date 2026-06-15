import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, Check, Trash2, Move, X, MapPin, Camera, Grid3X3, List,
  ChevronDown, ChevronUp, Image as ImageIcon
} from 'lucide-react';
import { DailyPhoto, DailyLocation } from './types';
import { mockPhotos, mockLocations } from './mockData';

interface PhotoGalleryProps {
  onClose: () => void;
  onSelectPhoto: (photo: DailyPhoto, allPhotos: DailyPhoto[]) => void;
}

type ViewMode = 'grid' | 'list';

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onClose, onSelectPhoto }) => {
  const [photos] = useState<DailyPhoto[]>(mockPhotos);
  const [locations] = useState<DailyLocation[]>(mockLocations);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(
    new Set(locations.map(l => l.id))
  );

  // Group photos by location
  const photosByLocation = useMemo(() => {
    const grouped: Record<string, DailyPhoto[]> = {};
    locations.forEach(loc => {
      grouped[loc.id] = photos.filter(p => p.locationId === loc.id);
    });
    return grouped;
  }, [photos, locations]);

  const totalPhotos = photos.length;
  const selectedCount = selectedIds.size;

  const toggleLocation = (locationId: string) => {
    setExpandedLocations(prev => {
      const next = new Set(prev);
      if (next.has(locationId)) {
        next.delete(locationId);
      } else {
        next.add(locationId);
      }
      return next;
    });
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  };

  const selectAllInLocation = (locationId: string) => {
    const locationPhotos = photosByLocation[locationId] || [];
    setSelectedIds(prev => {
      const next = new Set(prev);
      locationPhotos.forEach(p => next.add(p.id));
      return next;
    });
  };

  const deselectAllInLocation = (locationId: string) => {
    const locationPhotos = photosByLocation[locationId] || [];
    setSelectedIds(prev => {
      const next = new Set(prev);
      locationPhotos.forEach(p => next.delete(p.id));
      return next;
    });
  };

  const isLocationFullySelected = (locationId: string) => {
    const locationPhotos = photosByLocation[locationId] || [];
    if (locationPhotos.length === 0) return false;
    return locationPhotos.every(p => selectedIds.has(p.id));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handlePhotoClick = (photo: DailyPhoto) => {
    if (isSelectMode) {
      togglePhotoSelection(photo.id);
    } else {
      onSelectPhoto(photo, photos);
    }
  };

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
          <h1 className="text-base font-extrabold text-slate-800">Location Photos</h1>
          <p className="text-[10px] font-bold text-slate-400">
            {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''} • {locations.length} location{locations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-[0.95] transition-all"
            aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <List size={18} /> : <Grid3X3 size={18} />}
          </button>
          {/* Select mode toggle */}
          <button
            onClick={() => {
              if (isSelectMode) {
                clearSelection();
              } else {
                setIsSelectMode(true);
              }
            }}
            className={`px-3 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              isSelectMode
                ? 'bg-[#3b82f6] text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isSelectMode ? 'Cancel' : 'Select'}
          </button>
        </div>
      </div>

      {/* Photo List by Location */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-4 py-4" style={{ paddingBottom: isSelectMode ? '100px' : 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}>
          {locations.map(location => {
            const locationPhotos = photosByLocation[location.id] || [];
            const isExpanded = expandedLocations.has(location.id);
            const isFullySelected = isLocationFullySelected(location.id);
            const hasPhotos = locationPhotos.length > 0;

            return (
              <div key={location.id} className="mb-4">
                {/* Location Header */}
                <button
                  onClick={() => toggleLocation(location.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
                      <MapPin size={18} className="text-[#3b82f6]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-700">{location.path}</p>
                      <p className="text-[10px] text-slate-400">{locationPhotos.length} photo{locationPhotos.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelectMode && hasPhotos && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFullySelected) {
                            deselectAllInLocation(location.id);
                          } else {
                            selectAllInLocation(location.id);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          isFullySelected
                            ? 'bg-[#3b82f6] text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isFullySelected ? 'Deselect' : 'Select All'}
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Photo Grid/List */}
                {isExpanded && hasPhotos && (
                  <div className={`mt-2 ${viewMode === 'grid' ? 'grid grid-cols-3 gap-2' : 'space-y-2'}`}>
                    {locationPhotos.map(photo => {
                      const isSelected = selectedIds.has(photo.id);

                      if (viewMode === 'grid') {
                        return (
                          <button
                            key={photo.id}
                            onClick={() => handlePhotoClick(photo)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all active:scale-[0.95] ${
                              isSelected ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/30' : 'border-transparent'
                            }`}
                          >
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="w-full h-full object-cover"
                            />
                            {/* Selection indicator */}
                            {isSelectMode && (
                              <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#3b82f6] text-white'
                                  : 'bg-black/30 backdrop-blur-sm border-2 border-white'
                              }`}>
                                {isSelected && <Check size={14} strokeWidth={3} />}
                              </div>
                            )}
                            {/* Caption overlay */}
                            {!isSelectMode && (
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-[9px] font-bold text-white truncate">{photo.caption}</p>
                              </div>
                            )}
                          </button>
                        );
                      } else {
                        // List view
                        return (
                          <button
                            key={photo.id}
                            onClick={() => handlePhotoClick(photo)}
                            className={`w-full flex items-center gap-3 p-3 bg-white rounded-xl border transition-all active:scale-[0.98] ${
                              isSelected ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/30' : 'border-slate-100'
                            }`}
                          >
                            {/* Selection checkbox */}
                            {isSelectMode && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? 'bg-[#3b82f6] text-white'
                                  : 'bg-slate-100 border-2 border-slate-200'
                              }`}>
                                {isSelected && <Check size={14} strokeWidth={3} />}
                              </div>
                            )}
                            {/* Thumbnail */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={photo.url}
                                alt={photo.caption}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Info */}
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-bold text-slate-700 truncate">{photo.caption}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {photo.uploadedAt} • by {photo.uploadedBy}
                              </p>
                            </div>
                          </button>
                        );
                      }
                    })}
                  </div>
                )}

                {/* Empty state */}
                {isExpanded && !hasPhotos && (
                  <div className="mt-2 py-8 bg-white rounded-xl border border-dashed border-slate-200 text-center">
                    <ImageIcon size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs text-slate-400">No photos for this location</p>
                    <button className="mt-3 px-4 py-2 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg text-xs font-bold active:scale-95 transition-all">
                      <Camera size={14} className="inline mr-1.5" />
                      Add Photos
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selection Action Bar */}
      {isSelectMode && selectedCount > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-lg animate-in slide-in-from-bottom duration-200"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">
              {selectedCount} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  console.log('Move photos:', Array.from(selectedIds));
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold active:scale-95 transition-all"
              >
                <Move size={16} />
                Move
              </button>
              <button
                onClick={() => {
                  console.log('Delete photos:', Array.from(selectedIds));
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold active:scale-95 transition-all"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
