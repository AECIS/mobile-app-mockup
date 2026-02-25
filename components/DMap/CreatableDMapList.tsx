import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, Check, FileText } from 'lucide-react';
import { CreatableDrawing } from './types';
import { mockCreatableDrawings } from './mockData';

interface CreatableDMapListProps {
  onClose: () => void;
  onSelectDrawing: (drawing: CreatableDrawing) => void;
}

// Drawing card component
const DrawingCard: React.FC<{
  drawing: CreatableDrawing;
  onClick: () => void;
}> = ({ drawing, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all active:scale-[0.98] text-left hover:shadow-md hover:border-slate-200"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FileText size={20} className="text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {drawing.drawingNo}
            </span>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${drawing.statusColor}15`,
                color: drawing.statusColor,
              }}
            >
              {drawing.status}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-700 truncate">{drawing.name}</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {drawing.disciplineName} • {drawing.drawingSetName}
          </p>
        </div>
      </div>
    </button>
  );
};

const CreatableDMapList: React.FC<CreatableDMapListProps> = ({ onClose, onSelectDrawing }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter drawings
  const filteredDrawings = useMemo(() => {
    if (!searchQuery) return mockCreatableDrawings;

    const query = searchQuery.toLowerCase();
    return mockCreatableDrawings.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.drawingNo.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 bg-[#faf9f6] z-[65] flex flex-col animate-in slide-in-from-right duration-300">
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
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Select Drawing</h1>
          <p className="text-[10px] font-bold text-slate-400">Choose a drawing to create DMap</p>
        </div>
        <div className="w-11" />
      </div>

      {/* Search Bar */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-slate-100/50">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex-shrink-0 px-4 py-3">
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <FileText size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Only approved and published drawings that are not yet converted to DMaps are shown below.
          </p>
        </div>
      </div>

      {/* Drawing List */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div
          className="px-4 py-2 space-y-3"
          style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}
        >
          {/* Count */}
          <div className="flex items-center gap-2 px-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">
              Available Drawings ({filteredDrawings.length})
            </span>
          </div>

          {/* Drawings */}
          {filteredDrawings.length > 0 ? (
            filteredDrawings.map(drawing => (
              <DrawingCard
                key={drawing.id}
                drawing={drawing}
                onClick={() => onSelectDrawing(drawing)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mb-4">
                <FileText size={32} className="text-slate-300" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-700 mb-1">No drawings found</h3>
              <p className="text-[13px] text-slate-400">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatableDMapList;
