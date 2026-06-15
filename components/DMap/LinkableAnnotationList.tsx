import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, AlertCircle } from 'lucide-react';
import { LinkableIssue } from './types';
import { mockLinkableIssues } from './mockData';

interface LinkableAnnotationListProps {
  mapID: number;
  onClose: () => void;
  onSelectIssue: (issue: LinkableIssue) => void;
}

// Issue card component
const IssueCard: React.FC<{
  issue: LinkableIssue;
  onClick: () => void;
}> = ({ issue, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all active:scale-[0.98] text-left hover:shadow-md hover:border-slate-200"
    >
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: issue.statusColor }}
        >
          <span className="text-xs font-extrabold text-white">{issue.issueNo}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${issue.statusColor}15`,
                color: issue.statusColor,
              }}
            >
              {issue.status}
            </span>
            {issue.type && (
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {issue.type}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-700 line-clamp-2">{issue.title}</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            {issue.disciplineName} • {new Date(issue.createdDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </button>
  );
};

const LinkableAnnotationList: React.FC<LinkableAnnotationListProps> = ({
  mapID,
  onClose,
  onSelectIssue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter issues
  const filteredIssues = useMemo(() => {
    if (!searchQuery) return mockLinkableIssues;

    const query = searchQuery.toLowerCase();
    return mockLinkableIssues.filter(issue =>
      issue.title.toLowerCase().includes(query) ||
      issue.issueNo.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 bg-[#faf9f6] z-[75] flex flex-col animate-in slide-in-from-right duration-300">
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
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Link Issue</h1>
          <p className="text-[10px] font-bold text-slate-400">Select an issue to link</p>
        </div>
        <div className="w-11" />
      </div>

      {/* Search Bar */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-slate-100/50">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex-shrink-0 px-4 py-3">
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Only issues that are not already linked to this map are shown. Tap an issue to link it to the selected position.
          </p>
        </div>
      </div>

      {/* Issue List */}
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
            <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400">
              Available Issues ({filteredIssues.length})
            </span>
          </div>

          {/* Issues */}
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => onSelectIssue(issue)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-slate-300" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-700 mb-1">No issues found</h3>
              <p className="text-[13px] text-slate-400">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkableAnnotationList;
