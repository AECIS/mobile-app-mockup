import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  trend: string;
  subtext: string;
  icon: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  trendDirection?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  subtext,
  icon,
  loading = false,
  onClick,
  trendDirection = 'up',
}) => {
  const isInteractive = !!onClick;

  // Skeleton loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 dark:bg-slate-700 rounded-md animate-pulse" />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="h-9 w-16 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="h-5 w-14 bg-slate-100 dark:bg-slate-700 rounded-full animate-pulse" />
        </div>
        <div className="h-3 w-28 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    );
  }

  const trendColors = {
    up: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    down: 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400',
    neutral: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
  };

  const CardWrapper = isInteractive ? 'button' : 'div';

  return (
    <CardWrapper
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm
        flex flex-col gap-3 text-left w-full
        transition-all duration-200
        ${isInteractive ? `
          cursor-pointer
          hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600
          active:scale-[0.98]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2
        ` : ''}
      `}
      {...(isInteractive ? { type: 'button', 'aria-label': `${label}: ${value}` } : {})}
    >
      <div className="flex items-center justify-between">
        <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wide">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-500">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">{value.toLocaleString()}</span>
        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${trendColors[trendDirection]}`}>
          {trendDirection === 'up' && <TrendingUp size={10} />}
          {trendDirection === 'down' && <TrendingDown size={10} />}
          {trend}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
        <span className="text-slate-600 dark:text-slate-300 font-bold">{subtext.split(' ')[0]}</span>
        {subtext.substring(subtext.indexOf(' '))}
      </div>
    </CardWrapper>
  );
};

export default StatCard;
