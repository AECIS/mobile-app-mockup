import React, { useState, useMemo } from 'react';
import { Plus, ChevronRight, CheckCircle, Clock, AlertCircle, Loader2, Users, HardHat, Wrench, Camera, FileText, ChevronDown, Settings } from 'lucide-react';
import { DailyReportSummary, DailyReportType, SyncStatus } from './types';
import OverlayHeader from '../overlay-header';
import { mockDailyReports, stakeholderOptions } from './mockData';
import DailyReportManager from './DailyReportManager';

interface DailyReportListProps {
  onClose: () => void;
  onSelectReport: (report: DailyReportSummary) => void;
}

// Sync status badge component
const SyncBadge: React.FC<{ status: SyncStatus; lastSync?: string }> = ({ status, lastSync }) => {
  const config: Record<SyncStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    synced: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle size={10} />, label: 'Synced' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: <Clock size={10} />, label: 'Pending' },
    syncing: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <Loader2 size={10} className="animate-spin" />, label: 'Syncing' },
    error: { bg: 'bg-red-50', text: 'text-red-600', icon: <AlertCircle size={10} />, label: 'Error' },
  };

  const { bg, text, icon, label } = config[status];

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${bg} ${text}`}>
      {icon}
      <span className="text-[9px] font-bold uppercase">{label}</span>
    </div>
  );
};

// Progress bar component
const ProgressBar: React.FC<{ actual: number; planned: number }> = ({ actual, planned }) => {
  const delta = actual - planned;
  const deltaColor = delta >= 0 ? 'text-emerald-600' : 'text-red-500';

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#3b82f6] h-full rounded-full transition-all"
            style={{ width: `${Math.min(actual, 100)}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-700 w-10 text-right">{actual}%</span>
      </div>
      {delta !== 0 && (
        <div className="text-right">
          <span className={`text-[9px] font-bold ${deltaColor}`}>
            {delta > 0 ? '+' : ''}{delta}% vs plan
          </span>
        </div>
      )}
    </div>
  );
};

// Date block component
const DateBlock: React.FC<{ date: string }> = ({ date }) => {
  const d = new Date(date);
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="bg-[#3b82f6] text-white rounded-xl p-1.5 w-12 text-center flex-shrink-0">
      <div className="text-[10px] font-bold uppercase">{month}</div>
      <div className="text-2xl font-black leading-tight">{day}</div>
      <div className="text-[9px] font-medium opacity-80">{weekday}</div>
    </div>
  );
};

// Report type badge
const TypeBadge: React.FC<{ type: DailyReportType }> = ({ type }) => {
  const config: Record<DailyReportType, { bg: string; text: string; label: string }> = {
    general: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'General' },
    material: { bg: 'bg-violet-50', text: 'text-violet-600', label: 'Material' },
  };

  const { bg, text, label } = config[type];

  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${bg} ${text}`}>
      {label}
    </span>
  );
};

// Report card component
const ReportCard: React.FC<{ report: DailyReportSummary; onClick: () => void }> = ({ report, onClick }) => {
  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <button
      onClick={onClick}
      className={`w-full bg-white p-4 rounded-xl border shadow-sm transition-all active:scale-[0.98] text-left hover:shadow-md ${
        report.isEnabled ? 'border-slate-100 hover:border-slate-200' : 'border-slate-200 opacity-60'
      }`}
    >
      <div className="flex gap-3">
        {/* Date Block */}
        <DateBlock date={report.date} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TypeBadge type={report.type} />
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {report.stakeholder}
              </span>
            </div>
            <SyncBadge status={report.syncStatus} lastSync={report.lastSyncTime} />
          </div>

          {/* Date text */}
          <p className="text-sm font-bold text-slate-700 mb-2">{formattedDate}</p>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
            <div className="flex items-center gap-1">
              <HardHat size={12} className="text-amber-500" />
              <span className="font-bold">{report.manPowerQty}</span>
            </div>
            {report.incidentQty > 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <AlertCircle size={12} />
                <span className="font-bold">{report.incidentQty}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Wrench size={12} className="text-slate-400" />
              <span className="font-bold">{report.equipmentQty}</span>
            </div>
            {report.type === 'material' && report.materialCount && (
              <div className="flex items-center gap-1 text-violet-500">
                <CheckCircle size={12} />
                <span className="font-bold">{report.deliveryCount}/{report.materialCount}</span>
              </div>
            )}
          </div>

          {/* Progress */}
          <ProgressBar actual={report.actualProgress} planned={report.plannedProgress} />

          {/* Footer - attachments */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/60">
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              {report.photoCount > 0 && (
                <div className="flex items-center gap-1">
                  <Camera size={11} className="text-cyan-500" />
                  <span className="font-bold text-slate-500">{report.photoCount}</span>
                </div>
              )}
              {report.documentCount > 0 && (
                <div className="flex items-center gap-1">
                  <FileText size={11} className="text-red-400" />
                  <span className="font-bold text-slate-500">{report.documentCount}</span>
                </div>
              )}
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </div>
        </div>
      </div>
    </button>
  );
};

const DailyReportList: React.FC<DailyReportListProps> = ({ onClose, onSelectReport }) => {
  const [activeType, setActiveType] = useState<'all' | DailyReportType>('all');
  const [showManager, setShowManager] = useState(false);

  const typeLabels: Record<'all' | DailyReportType, string> = {
    all: 'All',
    general: 'General',
    material: 'Material',
  };
  const [selectedStakeholder, setSelectedStakeholder] = useState('all');
  const [showStakeholderPicker, setShowStakeholderPicker] = useState(false);

  // Filter reports
  const filteredReports = useMemo(() => {
    return mockDailyReports.filter(report => {
      if (activeType !== 'all' && report.type !== activeType) return false;
      if (selectedStakeholder !== 'all' && report.stakeholder !== selectedStakeholder) return false;
      return true;
    });
  }, [activeType, selectedStakeholder]);

  const selectedStakeholderLabel = stakeholderOptions.find(s => s.id === selectedStakeholder)?.label || 'All';

  return (
    <div className="fixed inset-0 bg-[#faf9f6] z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <OverlayHeader
        title="Daily Reports"
        onBack={onClose}
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManager(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-[0.95] transition-all"
              aria-label="Report settings"
            >
              <Settings size={18} />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3b82f6] text-white active:scale-[0.95] transition-all shadow-lg"
              aria-label="Create new report"
            >
              <Plus size={22} />
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex-shrink-0 px-3 py-2 bg-[#faf9f6] border-b border-slate-100/50">
        <div className="flex items-center justify-between gap-3">
          {/* Type tabs */}
          <div className="flex gap-2">
            {(['all', 'general', 'material'] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-tight transition-all active:scale-95 ${
                  activeType === type
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-white text-slate-400 border border-slate-100'
                }`}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>

          {/* Stakeholder picker */}
          <button
            onClick={() => setShowStakeholderPicker(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-slate-100 text-slate-600 active:scale-95 transition-all"
          >
            <Users size={14} />
            <span className="text-[11px] font-bold truncate max-w-[80px]">
              {selectedStakeholder === 'all' ? 'All' : selectedStakeholder}
            </span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Report List */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-4 py-4 space-y-3" style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}>
          {/* Summary */}
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">
              {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
            </span>
            {selectedStakeholder !== 'all' && (
              <button
                onClick={() => setSelectedStakeholder('all')}
                className="text-[10px] font-bold text-[#3b82f6] active:opacity-70"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Reports */}
          {filteredReports.length > 0 ? (
            filteredReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => onSelectReport(report)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mb-4">
                <FileText size={32} className="text-slate-300" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-700 mb-1">No reports found</h3>
              <p className="text-[13px] text-slate-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Stakeholder Picker Modal */}
      {showStakeholderPicker && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-end justify-center animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-t-[2rem] animate-in slide-in-from-bottom duration-300"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Filter by Stakeholder</h3>
              <button
                onClick={() => setShowStakeholderPicker(false)}
                className="text-sm font-bold text-[#3b82f6] active:opacity-70"
              >
                Done
              </button>
            </div>

            {/* Options */}
            <div className="px-4 py-3 max-h-[50vh] overflow-y-auto">
              {stakeholderOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedStakeholder(option.id);
                    setShowStakeholderPicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-1 transition-all active:scale-[0.98] ${
                    selectedStakeholder === option.id
                      ? 'bg-blue-50 border-2 border-[#3b82f6]'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${selectedStakeholder === option.id ? 'text-[#3b82f6] font-bold' : 'text-slate-700'}`}>
                    {option.label}
                  </span>
                  {selectedStakeholder === option.id && (
                    <CheckCircle size={18} className="text-[#3b82f6]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Daily Report Manager Modal */}
      {showManager && (
        <DailyReportManager onClose={() => setShowManager(false)} />
      )}
    </div>
  );
};

export default DailyReportList;
