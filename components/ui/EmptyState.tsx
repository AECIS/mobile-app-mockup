import React from 'react';
import { FileQuestion, Search, Filter, Inbox, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from './Button';

type EmptyStateType = 'empty' | 'search' | 'filter' | 'error' | 'offline';

interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const DEFAULT_ICONS: Record<EmptyStateType, React.ReactNode> = {
  empty: <Inbox size={32} />,
  search: <Search size={32} />,
  filter: <Filter size={32} />,
  error: <AlertCircle size={32} />,
  offline: <WifiOff size={32} />,
};

const ICON_COLORS: Record<EmptyStateType, string> = {
  empty: 'bg-slate-100 text-slate-400',
  search: 'bg-blue-50 text-blue-400',
  filter: 'bg-amber-50 text-amber-400',
  error: 'bg-red-50 text-red-400',
  offline: 'bg-slate-100 text-slate-400',
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty',
  icon,
  title,
  description,
  action,
  secondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-5 ${ICON_COLORS[type]}`}>
        {icon || DEFAULT_ICONS[type]}
      </div>
      <h3 className="text-[15px] font-bold text-slate-700 mb-1.5">{title}</h3>
      {description && (
        <p className="text-[13px] text-slate-400 max-w-[240px] leading-relaxed">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          {action && (
            <Button variant="primary" size="md" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" size="md" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Pre-built empty states
export const NoResults: React.FC<{ onClear?: () => void }> = ({ onClear }) => (
  <EmptyState
    type="search"
    title="No results found"
    description="Try adjusting your search or filter criteria"
    action={onClear ? { label: 'Clear filters', onClick: onClear } : undefined}
  />
);

export const NoItems: React.FC<{ itemName?: string; onAdd?: () => void }> = ({ itemName = 'items', onAdd }) => (
  <EmptyState
    type="empty"
    title={`No ${itemName} yet`}
    description={`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} you create will appear here`}
    action={onAdd ? { label: `Add ${itemName.slice(0, -1)}`, onClick: onAdd } : undefined}
  />
);

export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <EmptyState
    type="error"
    title="Something went wrong"
    description="We couldn't load the data. Please try again."
    action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
  />
);

export const Offline: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <EmptyState
    type="offline"
    title="You're offline"
    description="Check your internet connection and try again"
    action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
  />
);

export default EmptyState;
