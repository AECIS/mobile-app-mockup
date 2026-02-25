import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Trash2, MapPin, Calendar, User, Edit3, Check, X,
  ZoomIn, ZoomOut, RotateCw, Download, Share2
} from 'lucide-react';
import { DailyPhoto } from './types';

interface PhotoDetailProps {
  photo: DailyPhoto;
  allPhotos: DailyPhoto[];
  onClose: () => void;
  onDelete?: (photoId: string) => void;
  onUpdateCaption?: (photoId: string, caption: string) => void;
}

const PhotoDetail: React.FC<PhotoDetailProps> = ({
  photo: initialPhoto,
  allPhotos,
  onClose,
  onDelete,
  onUpdateCaption,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() =>
    allPhotos.findIndex(p => p.id === initialPhoto.id)
  );
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [caption, setCaption] = useState(initialPhoto.caption);
  const [zoom, setZoom] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const currentPhoto = allPhotos[currentIndex] || initialPhoto;
  const hasNext = currentIndex < allPhotos.length - 1;
  const hasPrev = currentIndex > 0;

  // Update caption when photo changes
  useEffect(() => {
    setCaption(currentPhoto.caption);
    setIsEditingCaption(false);
    setZoom(1);
  }, [currentPhoto.id]);

  const goToNext = () => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (hasPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSaveCaption = () => {
    if (onUpdateCaption) {
      onUpdateCaption(currentPhoto.id, caption);
    }
    setIsEditingCaption(false);
  };

  const handleCancelEdit = () => {
    setCaption(currentPhoto.caption);
    setIsEditingCaption(false);
  };

  const toggleZoom = () => {
    setZoom(prev => prev === 1 ? 2 : 1);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Handle swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) {
        goToNext();
      } else if (diff < 0 && hasPrev) {
        goToPrev();
      }
    }
    setTouchStart(null);
  };

  return (
    <div className="fixed inset-0 bg-black z-[90] flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <div
        className={`flex-shrink-0 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={onClose}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm active:bg-white/20 transition-all"
          aria-label="Close"
        >
          <X size={22} className="text-white" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-white">
            {currentIndex + 1} of {allPhotos.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log('Share:', currentPhoto.id)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm active:bg-white/20 transition-all"
            aria-label="Share"
          >
            <Share2 size={18} className="text-white" />
          </button>
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Delete this photo?')) {
                  onDelete(currentPhoto.id);
                  onClose();
                }
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/80 backdrop-blur-sm active:bg-red-600 transition-all"
              aria-label="Delete"
            >
              <Trash2 size={18} className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Photo Viewer */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative"
        onClick={() => setShowControls(!showControls)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous button */}
        {hasPrev && showControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white active:bg-black/60 transition-all"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Image */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Next button */}
        {hasNext && showControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white active:bg-black/60 transition-all"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Zoom controls */}
        {showControls && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom(prev => Math.max(0.5, prev - 0.5));
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white active:bg-white/20 transition-all"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-xs font-bold text-white px-2">{Math.round(zoom * 100)}%</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom(prev => Math.min(3, prev + 0.5));
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white active:bg-white/20 transition-all"
            >
              <ZoomIn size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Photo Info Panel */}
      <div
        className={`flex-shrink-0 bg-gradient-to-t from-black to-black/80 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {/* Caption */}
        <div className="px-4 py-3 border-b border-white/10">
          {isEditingCaption ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="flex-1 bg-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3b82f6]/50 placeholder:text-white/40"
                placeholder="Enter caption..."
                autoFocus
              />
              <button
                onClick={handleSaveCaption}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3b82f6] text-white active:scale-95 transition-all"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-95 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingCaption(true)}
              className="w-full flex items-center justify-between py-1 group"
            >
              <p className="text-sm text-white font-medium text-left flex-1">
                {currentPhoto.caption || 'Add a caption...'}
              </p>
              <Edit3 size={16} className="text-white/50 group-hover:text-white/80 ml-2 flex-shrink-0" />
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-3 text-white/70">
            <MapPin size={14} />
            <span className="text-xs">{currentPhoto.locationName}</span>
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <Calendar size={14} />
            <span className="text-xs">{currentPhoto.uploadedAt}</span>
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <User size={14} />
            <span className="text-xs">Uploaded by {currentPhoto.uploadedBy}</span>
          </div>
        </div>

        {/* Navigation dots (for small sets) */}
        {allPhotos.length <= 10 && allPhotos.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pb-2">
            {allPhotos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-[#3b82f6] w-4'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoDetail;
