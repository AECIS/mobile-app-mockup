import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ChevronLeft, MoreVertical, Filter, Download, Eye,
  Plus, Link2, Loader2, MapPin,
  Layers, RotateCcw, X,
  ChevronRight, Image as ImageIcon, ChevronUp, ChevronDown,
  Calendar, User
} from 'lucide-react';
import { MapLayout, MapLayoutAnnotation, DMapViewMode } from './types';
import { mockAnnotationsMap1 } from './mockData';
import LinkableAnnotationList from './LinkableAnnotationList';

interface DMapDetailProps {
  map: MapLayout;
  onClose: () => void;
}

// Enhanced Annotation Pin with better touch targets and visual hierarchy
const AnnotationPin: React.FC<{
  annotation: MapLayoutAnnotation;
  viewMode: DMapViewMode;
  isSelected: boolean;
  scale: number;
  onClick: () => void;
}> = ({ annotation, viewMode, isSelected, scale, onClick }) => {
  const label = viewMode === 'byNo' ? annotation.objectNo : annotation.dMapLabel;
  const bgColor = isSelected ? '#3b82f6' : (annotation.statusColor || '#ADB7BE');
  const hasError = annotation.syncStatus !== 0 && !annotation.isDraft;
  const isDraft = annotation.isDraft;

  // Scale-aware sizing for better visibility at different zoom levels
  const pinScale = Math.max(0.7, 1 / scale);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-150 cursor-pointer ${
        isSelected ? 'z-20' : 'z-10'
      }`}
      style={{
        left: `${annotation.coordinateX * 100}%`,
        top: `${annotation.coordinateY * 100}%`,
        transform: `translate(-50%, -100%) scale(${pinScale})`,
      }}
    >
      {/* Touch target - larger invisible area for mobile */}
      <div className="absolute -inset-2" />

      {/* Selection ring */}
      {isSelected && (
        <div
          className="absolute -inset-1 rounded-xl animate-pulse"
          style={{ backgroundColor: `${bgColor}30` }}
        />
      )}

      {/* Pin body */}
      <div
        className={`relative px-2.5 py-1.5 rounded-xl shadow-lg min-w-[36px] text-center transition-all ${
          hasError ? 'ring-2 ring-red-500 ring-offset-1' : ''
        } ${isSelected ? 'shadow-xl scale-110' : 'hover:scale-105'}`}
        style={{ backgroundColor: bgColor }}
      >
        {isDraft ? (
          <Loader2 size={14} className="text-white animate-spin mx-auto" />
        ) : (
          <span className="text-[11px] font-black text-white drop-shadow-sm">
            {label || '?'}
          </span>
        )}

        {/* Status indicator dot */}
        {!isDraft && (
          <div
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white"
            style={{ backgroundColor: annotation.statusColor || bgColor }}
          />
        )}

        {/* Arrow pointer with shadow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 drop-shadow-sm"
          style={{
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: `10px solid ${bgColor}`,
          }}
        />
      </div>
    </button>
  );
};

// Zoom indicator (shown briefly during pinch zoom)
const ZoomIndicator: React.FC<{
  scale: number;
  visible: boolean;
}> = ({ scale, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-in fade-in duration-150">
      <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full">
        <span className="text-sm font-bold">{Math.round(scale * 100)}%</span>
      </div>
    </div>
  );
};

// Reset button (minimal, only shows when zoomed/panned)
const ResetButton: React.FC<{
  scale: number;
  onReset: () => void;
}> = ({ scale, onReset }) => {
  if (scale === 1) return null;

  return (
    <button
      onClick={onReset}
      className="absolute right-4 top-20 z-30 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-all cursor-pointer border border-slate-100"
      aria-label="Reset view"
    >
      <RotateCcw size={18} />
    </button>
  );
};

// Pin Legend & Quick Stats (Collapsible)
const MapLegend: React.FC<{
  annotations: MapLayoutAnnotation[];
  viewMode: DMapViewMode;
  onToggleViewMode: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ annotations, viewMode, onToggleViewMode, isCollapsed, onToggleCollapse }) => {
  // Group annotations by status
  const statusGroups = annotations.reduce((acc, a) => {
    const status = a.statusName || 'Unknown';
    if (!acc[status]) acc[status] = { count: 0, color: a.statusColor || '#ADB7BE' };
    acc[status].count++;
    return acc;
  }, {} as Record<string, { count: number; color: string }>);

  // Collapsed state - just show a small pill
  if (isCollapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="absolute left-4 bottom-4 z-20 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
      >
        <MapPin size={14} className="text-slate-500" />
        <span className="text-[11px] font-bold text-slate-700">
          {annotations.length}
        </span>
        <ChevronUp size={14} className="text-slate-400" />
      </button>
    );
  }

  return (
    <div className="absolute left-4 bottom-4 right-4 z-20">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 p-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-500" />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
              {annotations.length} Pins
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleViewMode}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 active:scale-95 transition-all cursor-pointer"
            >
              {viewMode === 'byNo' ? <Eye size={12} /> : <Layers size={12} />}
              {viewMode === 'byNo' ? 'No.' : 'Label'}
            </button>
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center w-7 h-7 bg-slate-100 rounded-lg text-slate-500 active:scale-95 transition-all cursor-pointer"
              aria-label="Collapse legend"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusGroups).map(([status, { count, color }]) => (
            <div
              key={status}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[9px] font-bold" style={{ color }}>
                {count}
              </span>
              <span className="text-[9px] font-medium text-slate-500">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Quick Annotation Preview Card (shown when pin is selected)
const AnnotationPreviewCard: React.FC<{
  annotation: MapLayoutAnnotation;
  onViewDetails: () => void;
  onClose: () => void;
}> = ({ annotation, onViewDetails, onClose }) => {
  return (
    <div className="absolute left-4 right-4 bottom-24 z-30 animate-in slide-in-from-bottom duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Photo */}
        <div className="relative aspect-[16/10] bg-slate-100">
          {annotation.objectPhotoUrl ? (
            <img
              src={annotation.objectPhotoUrl}
              alt={annotation.objectName || 'Issue photo'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={32} className="text-slate-300" />
            </div>
          )}

          {/* Close button overlay */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <X size={16} className="text-white" />
          </button>

          {/* Timestamp overlay */}
          <div className="absolute bottom-2 right-2">
            <span className="text-[9px] font-medium text-white/80 bg-black/40 px-2 py-1 rounded">
              {annotation.dMapLabel} | {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Status & Type badges */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full border"
              style={{
                color: annotation.statusColor || '#238823',
                borderColor: annotation.statusColor || '#238823',
              }}
            >
              {annotation.statusName}
            </span>
            {annotation.dMapLabel && (
              <span className="text-[11px] font-medium px-3 py-1 rounded-full border border-slate-300 text-slate-600">
                {annotation.dMapLabel}
              </span>
            )}
          </div>

          {/* Issue number & title */}
          <h3 className="text-[15px] font-bold text-slate-800 mb-3">
            #{annotation.objectNo} - {annotation.objectName || 'Untitled'}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-2 text-[12px] text-slate-500 mb-1.5">
            <Calendar size={14} className="text-slate-400" />
            <span>{annotation.dueDate ? new Date(annotation.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <User size={14} className="text-slate-400" />
            <span>Assignee Name (AECIS)</span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="border-t border-slate-100">
          <button
            onClick={onViewDetails}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 active:bg-slate-50 transition-all cursor-pointer"
          >
            <span className="text-sm font-bold text-[#3b82f6]">View Details</span>
            <ChevronRight size={18} className="text-[#3b82f6]" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Create annotation sheet
const CreateAnnotationSheet: React.FC<{
  position: { x: number; y: number };
  onClose: () => void;
  onCreateNew: () => void;
  onLinkExisting: () => void;
}> = ({ position, onClose, onCreateNew, onLinkExisting }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-end justify-center animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-[2rem] animate-in slide-in-from-bottom duration-300"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-3 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-3">
            <MapPin size={14} className="text-slate-500" />
            <span className="text-[11px] font-bold text-slate-600">
              Position: {Math.round(position.x * 100)}%, {Math.round(position.y * 100)}%
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Add Annotation</h3>
          <p className="text-[12px] text-slate-400 font-medium mt-1">
            Create a new issue or link an existing one
          </p>
        </div>

        {/* Actions */}
        <div className="px-4 py-4 space-y-3">
          <button
            onClick={onCreateNew}
            className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] shadow-lg active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Plus size={28} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <span className="text-[15px] font-bold text-white block">Create New Issue</span>
              <span className="text-[11px] text-white/80 font-medium">
                Report a defect or observation at this location
              </span>
            </div>
            <ChevronRight size={20} className="text-white/60 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onLinkExisting}
            className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl bg-white border-2 border-slate-200 active:scale-[0.98] transition-all cursor-pointer group hover:border-blue-300 hover:bg-blue-50/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Link2 size={24} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left flex-1">
              <span className="text-[15px] font-bold text-slate-800 block">Link Existing Issue</span>
              <span className="text-[11px] text-slate-400 font-medium">
                Connect an issue that's already in the system
              </span>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Cancel */}
        <div className="px-4 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const DMapDetail: React.FC<DMapDetailProps> = ({ map, onClose }) => {
  const [viewMode, setViewMode] = useState<DMapViewMode>('byNo');
  const [annotations] = useState<MapLayoutAnnotation[]>(mockAnnotationsMap1);
  const [selectedAnnotation, setSelectedAnnotation] = useState<MapLayoutAnnotation | null>(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [createPosition, setCreatePosition] = useState({ x: 0, y: 0 });
  const [showLinkableList, setShowLinkableList] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  // Map zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Pinch-to-zoom state
  const initialPinchDistance = useRef<number | null>(null);
  const initialScale = useRef(1);
  const zoomIndicatorTimeout = useRef<NodeJS.Timeout | null>(null);

  // Get distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start for pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      initialPinchDistance.current = getTouchDistance(e.touches);
      initialScale.current = scale;
    }
  }, [scale]);

  // Handle touch move for pinch-to-zoom
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance.current !== null) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      if (currentDistance !== null) {
        const scaleFactor = currentDistance / initialPinchDistance.current;
        const newScale = Math.min(Math.max(initialScale.current * scaleFactor, 0.5), 3);
        setScale(newScale);

        // Show zoom indicator
        setShowZoomIndicator(true);
        if (zoomIndicatorTimeout.current) {
          clearTimeout(zoomIndicatorTimeout.current);
        }
        zoomIndicatorTimeout.current = setTimeout(() => {
          setShowZoomIndicator(false);
        }, 800);
      }
    }
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    initialPinchDistance.current = null;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (zoomIndicatorTimeout.current) {
        clearTimeout(zoomIndicatorTimeout.current);
      }
    };
  }, []);

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Check if clicked on an annotation
    const clickedAnnotation = annotations.find(a => {
      const dx = Math.abs(a.coordinateX - x);
      const dy = Math.abs(a.coordinateY - y);
      return dx < 0.05 && dy < 0.08;
    });

    if (clickedAnnotation) {
      setSelectedAnnotation(clickedAnnotation);
      setShowPreview(true);
    } else {
      setSelectedAnnotation(null);
      setShowPreview(false);
      setCreatePosition({ x, y });
      setShowCreateSheet(true);
    }
  }, [annotations, isDragging]);

  const handleAnnotationClick = (annotation: MapLayoutAnnotation) => {
    setSelectedAnnotation(annotation);
    setShowPreview(true);
  };

  const handleViewDetails = () => {
    console.log('View issue details:', selectedAnnotation?.objectID);
    setShowPreview(false);
    setSelectedAnnotation(null);
    // Would navigate to issue detail screen
  };

  const handleCreateNew = () => {
    console.log('Create new issue at:', createPosition);
    setShowCreateSheet(false);
  };

  const handleLinkExisting = () => {
    setShowCreateSheet(false);
    setShowLinkableList(true);
  };

  const handleLinkIssue = (issue: any) => {
    console.log('Link issue:', issue, 'at position:', createPosition);
    setShowLinkableList(false);
  };


  return (
    <div className="fixed inset-0 bg-slate-900 z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header - Floating glass style */}
      <div
        className="absolute top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg active:scale-[0.98] transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft size={24} className="text-slate-800" />
        </button>

        {/* Center info - Expandable on tap */}
        <div className="flex-1 mx-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-2">
            <h1 className="text-[13px] font-bold text-slate-800 text-center line-clamp-2 leading-tight">{map.mapName}</h1>
            <p className="text-[9px] text-slate-400 font-medium text-center mt-0.5">
              {map.disciplineName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg active:scale-[0.98] transition-all cursor-pointer"
        >
          <MoreVertical size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Download progress - Compact floating pill */}
      {map.downloadMapImageState === 'inProgress' && (() => {
        const progress = map.downloadProgress ?? 0;
        const circumference = 2 * Math.PI * 8; // r=8
        const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

        return (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-black/70 backdrop-blur-sm rounded-full shadow-lg pl-2 pr-3 py-1.5 flex items-center gap-2">
              {/* Circular progress indicator */}
              <div className="relative w-5 h-5">
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                  {/* Background circle */}
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-white">{progress}%</span>
            </div>
          </div>
        );
      })()}

      {/* Map View - Full screen with pinch-to-zoom */}
      <div
        ref={mapRef}
        className="flex-1 overflow-hidden relative bg-slate-800 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 cursor-crosshair transition-transform duration-100"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center center',
          }}
          onClick={handleMapClick}
        >
          {/* Map background */}
          {map.mapThumbnailUrl ? (
            <img
              src={map.mapThumbnailUrl}
              alt={map.mapName}
              className="w-full h-full object-contain"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-700">
              <div className="text-center">
                <MapPin size={64} className="text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-sm font-medium">Map not available</p>
              </div>
            </div>
          )}

          {/* Annotations */}
          {annotations.map(annotation => (
            <AnnotationPin
              key={annotation.annotationID}
              annotation={annotation}
              viewMode={viewMode}
              isSelected={selectedAnnotation?.annotationID === annotation.annotationID}
              scale={scale}
              onClick={() => handleAnnotationClick(annotation)}
            />
          ))}
        </div>

        {/* Zoom Indicator (shown during pinch) */}
        <ZoomIndicator scale={scale} visible={showZoomIndicator} />

        {/* Reset button (only when zoomed) */}
        <ResetButton scale={scale} onReset={handleReset} />

        {/* Legend & Stats (Collapsible) */}
        <MapLegend
          annotations={annotations}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode(viewMode === 'byNo' ? 'byLabel' : 'byNo')}
          isCollapsed={isLegendCollapsed}
          onToggleCollapse={() => setIsLegendCollapsed(!isLegendCollapsed)}
        />

        {/* Annotation Preview Card */}
        {showPreview && selectedAnnotation && (
          <AnnotationPreviewCard
            annotation={selectedAnnotation}
            onViewDetails={handleViewDetails}
            onClose={() => {
              setShowPreview(false);
              setSelectedAnnotation(null);
            }}
          />
        )}
      </div>

      {/* Menu dropdown */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-[65]" onClick={() => setShowMenu(false)} />
          <div className="absolute top-20 right-4 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[66] w-52">
            <button className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-slate-50 cursor-pointer">
              <Download size={18} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Download for Offline</span>
            </button>
            <div className="h-px bg-slate-100" />
            <button className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-slate-50 cursor-pointer">
              <Filter size={18} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filter Annotations</span>
            </button>
          </div>
        </>
      )}

      {/* Create annotation sheet */}
      {showCreateSheet && (
        <CreateAnnotationSheet
          position={createPosition}
          onClose={() => setShowCreateSheet(false)}
          onCreateNew={handleCreateNew}
          onLinkExisting={handleLinkExisting}
        />
      )}

      {/* Linkable annotation list */}
      {showLinkableList && (
        <LinkableAnnotationList
          mapID={map.mapID}
          onClose={() => setShowLinkableList(false)}
          onSelectIssue={handleLinkIssue}
        />
      )}
    </div>
  );
};

export default DMapDetail;
