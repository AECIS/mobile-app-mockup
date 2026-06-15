
import React from 'react';
import { AlertTriangle, Layers, Clipboard, Map, BarChart3, Users, HardDrive, ChevronRight } from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  count?: number;
}

interface ToolsViewProps {
  onOpenIssues?: () => void;
  onOpenSubmittals?: () => void;
  onOpenDailyReport?: () => void;
  onOpenDMap?: () => void;
  onOpenAnalyticsReport?: () => void;
  onOpenDirectory?: () => void;
  onOpenStorage?: () => void;
}

const coreTools: ToolItem[] = [
  {
    id: 'issues',
    name: 'Issues',
    desc: 'Defects & site issues',
    icon: <AlertTriangle size={22} />,
    iconBg: 'bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400',
    count: 58,
  },
  {
    id: 'submittals',
    name: 'Submittals',
    desc: 'Submittals & RFS',
    icon: <Layers size={22} />,
    iconBg: 'bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400',
    count: 84,
  },
  {
    id: 'daily-reports',
    name: 'Daily Reports',
    desc: 'Site progress & daily logs',
    icon: <Clipboard size={22} />,
    iconBg: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400',
    count: 24,
  },
  {
    id: 'dmaps',
    name: 'DMaps',
    desc: 'Defects & site observations',
    icon: <Map size={22} />,
    iconBg: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400',
    count: 12,
  },
];

const moreTools: ToolItem[] = [
  {
    id: 'analytics',
    name: 'Analytics',
    desc: 'Project health & metrics',
    icon: <BarChart3 size={22} />,
    iconBg: 'bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400',
    count: 8,
  },
  {
    id: 'directory',
    name: 'Directory',
    desc: 'Project team & contacts',
    icon: <Users size={22} />,
    iconBg: 'bg-violet-50 text-violet-500 dark:bg-violet-900/30 dark:text-violet-400',
    count: 36,
  },
  {
    id: 'storage',
    name: 'Storage',
    desc: 'Offline files & documents',
    icon: <HardDrive size={22} />,
    iconBg: 'bg-cyan-50 text-cyan-500 dark:bg-cyan-900/30 dark:text-cyan-400',
    count: 48,
  },
];

const ToolRow: React.FC<{ tool: ToolItem; onClick?: () => void }> = ({ tool, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-4 py-3 text-left active:bg-slate-50 dark:active:bg-slate-700/50 transition-colors"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tool.iconBg}`}>
      {tool.icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[15px]">{tool.name}</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{tool.desc}</p>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {tool.count != null && (
        <span className="text-[10px] font-extrabold text-slate-300 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md">
          {tool.count}
        </span>
      )}
      <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
    </div>
  </button>
);

const ToolsView: React.FC<ToolsViewProps> = ({
  onOpenIssues,
  onOpenSubmittals,
  onOpenDailyReport,
  onOpenDMap,
  onOpenAnalyticsReport,
  onOpenDirectory,
  onOpenStorage,
}) => {
  const callbackMap: Record<string, (() => void) | undefined> = {
    'issues': onOpenIssues,
    'submittals': onOpenSubmittals,
    'daily-reports': onOpenDailyReport,
    'dmaps': onOpenDMap,
    'analytics': onOpenAnalyticsReport,
    'directory': onOpenDirectory,
    'storage': onOpenStorage,
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Core Tools */}
      <div>
        <h2 className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
          Core Tools
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
          {coreTools.map((tool) => (
            <ToolRow key={tool.id} tool={tool} onClick={callbackMap[tool.id]} />
          ))}
        </div>
      </div>

      {/* More */}
      <div>
        <h2 className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
          More
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
          {moreTools.map((tool) => (
            <ToolRow key={tool.id} tool={tool} onClick={callbackMap[tool.id]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsView;
