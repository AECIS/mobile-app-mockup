import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, Search, Calendar, ChevronDown, Download, CheckCircle,
  FileText, RefreshCw, X, Loader2
} from 'lucide-react';
import {
  ReportMode, ToolType, ToolTab, GroupReportType,
  ArchiveReport, OnlineReportType, ReportSection
} from './types';
import {
  toolTabs, mockArchiveReports, mockOnlineReportTypes,
  groupReportsByDate, getGroupTypesFromReports
} from './mockData';

interface AnalyticsReportListProps {
  onClose: () => void;
}

// Mode Toggle - Segmented control style
const ModeToggle: React.FC<{
  mode: ReportMode;
  onToggle: (mode: ReportMode) => void;
}> = ({ mode, onToggle }) => (
  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 transition-colors">
    <button
      onClick={() => onToggle('archive')}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
        mode === 'archive'
          ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm'
          : 'text-slate-500 dark:text-slate-400'
      }`}
    >
      Archive
    </button>
    <button
      onClick={() => onToggle('online')}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
        mode === 'online'
          ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm'
          : 'text-slate-500 dark:text-slate-400'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${mode === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      Live
    </button>
  </div>
);

// Tool Tabs
const ToolTabBar: React.FC<{
  tabs: ToolTab[];
  activeTab: ToolType;
  onTabChange: (tab: ToolType) => void;
}> = ({ tabs, activeTab, onTabChange }) => (
  <div className="overflow-x-auto no-scrollbar">
    <div className="flex gap-1 px-4 py-2 min-w-max">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === tab.id
              ? 'bg-[#3b82f6] text-white'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700'
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  </div>
);

// Date Range Picker Button
const DateRangeButton: React.FC<{
  startDate: string | null;
  endDate: string | null;
  onClick: () => void;
}> = ({ startDate, endDate, onClick }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 active:bg-slate-50 dark:active:bg-slate-600 transition-all cursor-pointer w-full"
    >
      <Calendar size={18} className="text-[#3b82f6]" />
      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200 flex-1 text-left">
        {startDate && endDate
          ? `${formatDate(startDate)} - ${formatDate(endDate)}`
          : 'Latest Archived Date'}
      </span>
      <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
    </button>
  );
};

// Group Filter Dropdown
const GroupFilterDropdown: React.FC<{
  groups: GroupReportType[];
  selectedGroup: GroupReportType | null;
  onSelect: (group: GroupReportType) => void;
}> = ({ groups, selectedGroup, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (groups.length <= 1) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700 transition-all cursor-pointer"
      >
        <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200">
          {selectedGroup?.name || 'All Groups'}
        </span>
        <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg z-50 min-w-[180px] overflow-hidden">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  onSelect(group);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-[12px] font-medium transition-colors cursor-pointer ${
                  selectedGroup?.id === group.id
                    ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Archive Report Cell - Enhanced card design
const ArchiveReportCell: React.FC<{
  report: ArchiveReport;
  onClick: () => void;
}> = ({ report, onClick }) => {
  // Determine file type color
  const getTypeColor = (typeName: string) => {
    if (typeName.toLowerCase().includes('status')) return { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-500 dark:text-blue-400', badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' };
    if (typeName.toLowerCase().includes('log')) return { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-500 dark:text-purple-400', badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' };
    if (typeName.toLowerCase().includes('summary')) return { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-500 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' };
    return { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-500 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' };
  };

  const colors = getTypeColor(report.reportTypeName);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer active:scale-[0.98] text-left"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <FileText size={22} className={colors.text} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
              {report.reportFileName}
            </h4>
            {report.isDownloaded ? (
              <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <Download size={18} className="text-slate-300 flex-shrink-0 mt-0.5" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
              {report.reportTypeName}
            </span>
            <span className="text-[10px] text-slate-400">
              {report.groupReportTypeName}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

// Online Report Cell - Enhanced with live indicator
const OnlineReportCell: React.FC<{
  reportType: OnlineReportType;
  onClick: () => void;
}> = ({ reportType, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer active:scale-[0.98] text-left group"
  >
    <div className="flex items-center gap-3">
      {/* Icon with live pulse */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
          <FileText size={22} className="text-blue-500 dark:text-blue-400" />
        </div>
        {/* Live indicator dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800">
          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
          {reportType.reportTypeName}
        </h4>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          Generate live report
        </p>
      </div>

      {/* Arrow */}
      <ChevronDown size={18} className="text-slate-300 dark:text-slate-500 -rotate-90 group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);

// Section Header (for Archive mode)
const SectionHeader: React.FC<{ date: string; count: number }> = ({ date, count }) => {
  const formatted = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <span className="text-[12px] font-bold text-slate-600 dark:text-slate-300">
        {formatted}
      </span>
      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
        {count} {count === 1 ? 'report' : 'reports'}
      </span>
    </div>
  );
};

// Empty State - Enhanced with illustration
const EmptyState: React.FC<{ isSearch: boolean; mode: ReportMode }> = ({ isSearch, mode }) => (
  <div className="flex flex-col items-center justify-center py-12 px-8">
    {/* Illustration */}
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
        <FileText size={36} className="text-slate-300" />
      </div>
      {isSearch ? (
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <Search size={16} className="text-amber-500" />
        </div>
      ) : (
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
          <FileText size={14} className="text-slate-400" />
        </div>
      )}
    </div>

    <h3 className="text-[16px] font-bold text-slate-700 mb-2 text-center">
      {isSearch ? 'No Results Found' : 'No Reports Available'}
    </h3>
    <p className="text-[13px] text-slate-400 text-center leading-relaxed max-w-[260px]">
      {isSearch
        ? 'Try adjusting your search terms or change the filter options'
        : mode === 'archive'
          ? 'Archive reports will appear here once they are generated'
          : 'Select a report type to generate a live report'}
    </p>
  </div>
);

// Skeleton Loading
const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 animate-pulse transition-colors">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded w-1/2" />
      </div>
    </div>
  </div>
);

// Main Component
const AnalyticsReportList: React.FC<AnalyticsReportListProps> = ({ onClose }) => {
  const [mode, setMode] = useState<ReportMode>('archive');
  const [activeTab, setActiveTab] = useState<ToolType>('submittal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupReportType | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
    start: '2026-01-25',
    end: '2026-02-08',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter tabs based on mode
  const visibleTabs = useMemo(() => {
    if (mode === 'online') {
      return toolTabs.filter(t => !t.excludeFromOnline);
    }
    return toolTabs;
  }, [mode]);

  // Filter archive reports
  const filteredArchiveReports = useMemo(() => {
    let reports = mockArchiveReports.filter(r => r.toolType === activeTab);

    if (selectedGroup) {
      reports = reports.filter(r => r.groupReportTypeId === selectedGroup.id);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      reports = reports.filter(r =>
        r.reportFileName.toLowerCase().includes(query)
      );
    }

    return groupReportsByDate(reports);
  }, [activeTab, selectedGroup, searchQuery]);

  // Filter online report types
  const filteredOnlineReportTypes = useMemo(() => {
    let types = mockOnlineReportTypes.filter(r => r.toolType === activeTab);

    if (selectedGroup) {
      types = types.filter(r => r.groupReportTypeId === selectedGroup.id);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      types = types.filter(r =>
        r.reportTypeName.toLowerCase().includes(query)
      );
    }

    return types;
  }, [activeTab, selectedGroup, searchQuery]);

  // Get group types for current tab
  const groupTypes = useMemo(() => {
    const reports = mode === 'archive'
      ? mockArchiveReports.filter(r => r.toolType === activeTab)
      : mockOnlineReportTypes.filter(r => r.toolType === activeTab);
    return getGroupTypesFromReports(reports);
  }, [mode, activeTab]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleReportClick = (report: ArchiveReport | OnlineReportType) => {
    console.log('Open report:', report);
  };

  const isSearchActive = searchQuery.trim().length > 0;
  const isEmpty = mode === 'archive'
    ? filteredArchiveReports.length === 0
    : filteredOnlineReportTypes.length === 0;

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[60] flex flex-col animate-in slide-in-from-right duration-300 transition-colors">
      {/* Header */}
      <div
        className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 py-3 flex items-center justify-between transition-colors"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700 transition-colors cursor-pointer"
        >
          <ChevronLeft size={24} className="text-slate-700 dark:text-slate-300" />
        </button>

        <h1 className="text-[17px] font-bold text-slate-800 dark:text-slate-100">Reports</h1>

        <ModeToggle mode={mode} onToggle={(newMode) => {
          if (newMode !== mode) {
            setMode(newMode);
            // If current tab doesn't exist in new mode, reset to first tab
            if (newMode === 'online') {
              const currentTab = toolTabs.find(t => t.id === activeTab);
              if (currentTab?.excludeFromOnline) {
                setActiveTab('submittal');
              }
            }
            setSelectedGroup(null);
          }
        }} />
      </div>

      {/* Date Range (Archive mode only) */}
      {mode === 'archive' && (
        <div className="px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 transition-colors">
          <DateRangeButton
            startDate={dateRange.start}
            endDate={dateRange.end}
            onClick={() => console.log('Open date picker')}
          />
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 transition-colors">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-[13px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#3b82f6]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tool Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 transition-colors">
        <ToolTabBar
          tabs={visibleTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Group Filter & Refresh */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#faf9f6] dark:bg-slate-900 transition-colors">
        <GroupFilterDropdown
          groups={groupTypes}
          selectedGroup={selectedGroup}
          onSelect={setSelectedGroup}
        />
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={16} className="text-slate-500 animate-spin" />
          ) : (
            <RefreshCw size={16} className="text-slate-500" />
          )}
        </button>
      </div>

      {/* Report List */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {isLoading ? (
          // Skeleton loading state
          <div className="flex flex-col gap-3 mt-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : isEmpty ? (
          <EmptyState isSearch={isSearchActive} mode={mode} />
        ) : mode === 'archive' ? (
          // Archive Report List (grouped by date) - Card style
          <div className="flex flex-col gap-2">
            {filteredArchiveReports.map((section) => (
              <div key={section.date}>
                <SectionHeader date={section.date} count={section.reports.length} />
                <div className="flex flex-col gap-3">
                  {section.reports.map((report) => (
                    <ArchiveReportCell
                      key={report.id}
                      report={report}
                      onClick={() => handleReportClick(report)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Online Report List (flat) - Card style
          <div className="flex flex-col gap-3 mt-2">
            {filteredOnlineReportTypes.map((reportType) => (
              <OnlineReportCell
                key={reportType.id}
                reportType={reportType}
                onClick={() => handleReportClick(reportType)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsReportList;
