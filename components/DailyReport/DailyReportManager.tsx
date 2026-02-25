import React, { useState } from 'react';
import {
  ChevronLeft, ToggleLeft, ToggleRight, Users, FileText, AlertCircle, Check
} from 'lucide-react';
import { DailyReportType } from './types';
import { stakeholderOptions } from './mockData';

// Stakeholder report configuration
interface StakeholderReportConfig {
  stakeholderId: string;
  stakeholderName: string;
  abbreviation: string;
  reportType: DailyReportType; // Each stakeholder has ONE type
  isEnabled: boolean;
}

interface DailyReportManagerProps {
  onClose: () => void;
}

// Toggle switch component
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-12 h-7 rounded-full transition-all active:scale-[0.95]"
      style={{ backgroundColor: enabled ? '#10b981' : '#e2e8f0' }}
      aria-pressed={enabled}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
          enabled ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
};

// Type badge
const TypeBadge: React.FC<{ type: DailyReportType }> = ({ type }) => {
  const config: Record<DailyReportType, { bg: string; text: string; label: string }> = {
    general: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'General' },
    material: { bg: 'bg-violet-50', text: 'text-violet-600', label: 'Material' },
  };

  const { bg, text, label } = config[type];

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${bg} ${text}`}>
      {label}
    </span>
  );
};

// Stakeholder config card
const StakeholderCard: React.FC<{
  config: StakeholderReportConfig;
  onToggle: (enabled: boolean) => void;
}> = ({ config, onToggle }) => {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      config.isEnabled ? 'border-emerald-200' : 'border-slate-100'
    }`}>
      <div className="flex items-center gap-3 px-4 py-4">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
          config.isEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          {config.abbreviation}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-bold text-slate-700 truncate">{config.stakeholderName}</p>
            <TypeBadge type={config.reportType} />
          </div>
          <p className={`text-[11px] font-medium ${config.isEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
            {config.isEnabled ? 'Report enabled' : 'Report disabled'}
          </p>
        </div>

        {/* Toggle */}
        <ToggleSwitch enabled={config.isEnabled} onChange={onToggle} />
      </div>
    </div>
  );
};

const DailyReportManager: React.FC<DailyReportManagerProps> = ({ onClose }) => {
  // Initialize stakeholder configs - each has ONE report type
  const [configs, setConfigs] = useState<StakeholderReportConfig[]>(() => [
    { stakeholderId: 'MC', stakeholderName: 'Main Contractor', abbreviation: 'MC', reportType: 'general', isEnabled: true },
    { stakeholderId: 'AR', stakeholderName: 'Architect', abbreviation: 'AR', reportType: 'material', isEnabled: true },
    { stakeholderId: 'ME', stakeholderName: 'Mechanical Engineer', abbreviation: 'ME', reportType: 'general', isEnabled: true },
    { stakeholderId: 'EE', stakeholderName: 'Electrical Engineer', abbreviation: 'EE', reportType: 'material', isEnabled: false },
    { stakeholderId: 'SE', stakeholderName: 'Structural Engineer', abbreviation: 'SE', reportType: 'general', isEnabled: false },
  ]);

  const handleToggle = (stakeholderId: string, enabled: boolean) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.stakeholderId === stakeholderId ? { ...c, isEnabled: enabled } : c
      )
    );
  };

  const handleEnableAll = () => {
    setConfigs((prev) => prev.map((c) => ({ ...c, isEnabled: true })));
  };

  const handleDisableAll = () => {
    setConfigs((prev) => prev.map((c) => ({ ...c, isEnabled: false })));
  };

  const enabledCount = configs.filter((c) => c.isEnabled).length;
  const generalCount = configs.filter((c) => c.reportType === 'general' && c.isEnabled).length;
  const materialCount = configs.filter((c) => c.reportType === 'material' && c.isEnabled).length;
  const totalCount = configs.length;

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
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Report Settings</h1>
          <p className="text-[10px] font-bold text-slate-400">Turn on/off daily reports</p>
        </div>
        <div className="w-11" />
      </div>

      {/* Summary Stats */}
      <div className="flex-shrink-0 px-4 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Check size={16} />
              <span className="text-sm font-bold">{enabledCount} Active</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-400">{totalCount - enabledCount} Disabled</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEnableAll}
              className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              Enable All
            </button>
            <button
              onClick={handleDisableAll}
              className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              Disable All
            </button>
          </div>
        </div>

        {/* Type breakdown */}
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
            <FileText size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-blue-600">General: {generalCount}</span>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-violet-50 rounded-xl px-3 py-2">
            <FileText size={14} className="text-violet-500" />
            <span className="text-xs font-bold text-violet-600">Material: {materialCount}</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex-shrink-0 px-4 py-3">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-relaxed">
            Toggle to enable or disable daily reports for each stakeholder. Disabled reports won't appear in the list.
          </p>
        </div>
      </div>

      {/* Stakeholder List */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-4 py-2 space-y-3" style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}>
          <div className="flex items-center gap-2 px-1 mb-2">
            <Users size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">
              Stakeholders ({configs.length})
            </span>
          </div>

          {configs.map((config) => (
            <StakeholderCard
              key={config.stakeholderId}
              config={config}
              onToggle={(enabled) => handleToggle(config.stakeholderId, enabled)}
            />
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div
        className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-100"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#3b82f6] text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default DailyReportManager;
