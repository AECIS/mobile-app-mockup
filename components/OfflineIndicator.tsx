import React, { useState } from 'react';
import { WifiOff, Wifi, CloudOff, RefreshCw, Check, AlertCircle, X, HardDrive } from 'lucide-react';
import { useOffline } from '../context';

interface OfflineIndicatorProps {
  compact?: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ compact = true }) => {
  const { isOffline, syncStatus, networkAvailable, triggerSync, storage, toggleOfflineMode } = useOffline();
  const [showPanel, setShowPanel] = useState(false);

  const isStorageCritical = storage.percentage >= storage.criticalThreshold;
  const isStorageWarning = storage.percentage >= storage.warningThreshold;

  // Determine if there are issues to highlight
  const hasIssues = isOffline || syncStatus.pendingUploads > 0 || syncStatus.isSyncing || isStorageCritical;

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Compact Indicator Button - Always visible, icon only on mobile */}
      <button
        onClick={() => setShowPanel(true)}
        className={`
          relative w-9 h-9 rounded-full flex items-center justify-center
          transition-all duration-200 active:scale-95 cursor-pointer flex-shrink-0
          ${isStorageCritical
            ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
            : isOffline
              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              : syncStatus.isSyncing
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                : syncStatus.pendingUploads > 0
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm'
          }
        `}
        aria-label={isStorageCritical ? 'Storage full' : isOffline ? 'Offline mode active' : 'Network status'}
      >
        {isStorageCritical ? (
          <HardDrive size={18} className="flex-shrink-0" />
        ) : isOffline ? (
          <WifiOff size={18} className="flex-shrink-0" />
        ) : syncStatus.isSyncing ? (
          <RefreshCw size={18} className="animate-spin flex-shrink-0" />
        ) : syncStatus.pendingUploads > 0 ? (
          <CloudOff size={18} className="flex-shrink-0" />
        ) : (
          <Wifi size={18} className="flex-shrink-0" />
        )}

        {/* Badge for pending count or storage percentage */}
        {(syncStatus.pendingUploads > 0 || isStorageCritical) && (
          <span className={`absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 ${
            isStorageCritical ? 'bg-red-500' : 'bg-amber-500'
          }`}>
            {isStorageCritical ? storage.percentage : (syncStatus.pendingUploads > 9 ? '9+' : syncStatus.pendingUploads)}
          </span>
        )}
      </button>

      {/* Detail Panel Overlay */}
      {showPanel && (
        <>
          <div
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px] z-[100]"
            onClick={() => setShowPanel(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[100] animate-in slide-in-from-bottom duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-t-[2rem] p-6 pb-10 shadow-2xl transition-colors">
              {/* Handle */}
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-600 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Network & Sync</h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors cursor-pointer"
                >
                  <X size={18} className="text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Offline Mode Toggle */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isOffline
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-emerald-100 dark:bg-emerald-900/30'
                    }`}>
                      {isOffline ? (
                        <WifiOff size={20} className="text-amber-600 dark:text-amber-400" />
                      ) : (
                        <Wifi size={20} className="text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                        Offline Mode
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isOffline ? 'Working without internet' : 'Connected to server'}
                      </p>
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={toggleOfflineMode}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                      isOffline
                        ? 'bg-amber-500'
                        : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                    aria-label={isOffline ? 'Turn off offline mode' : 'Turn on offline mode'}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      isOffline ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Sync Status */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-4">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  Sync Status
                </div>

                <div className="space-y-3">
                  {/* Pending Uploads */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <CloudOff size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">
                        Pending uploads
                      </span>
                    </div>
                    <span className={`
                      text-[13px] font-bold
                      ${syncStatus.pendingUploads > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                      }
                    `}>
                      {syncStatus.pendingUploads}
                    </span>
                  </div>

                  {/* Last Sync */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                        <RefreshCw size={16} className="text-slate-600 dark:text-slate-300" />
                      </div>
                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">
                        Last synced
                      </span>
                    </div>
                    <span className="text-[13px] text-slate-500 dark:text-slate-400">
                      {formatLastSync(syncStatus.lastSyncTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {/* Sync Now Button */}
                {!isOffline && networkAvailable && syncStatus.pendingUploads > 0 && (
                  <button
                    onClick={triggerSync}
                    disabled={syncStatus.isSyncing}
                    className={`
                      w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[14px]
                      transition-all active:scale-[0.98] cursor-pointer
                      ${syncStatus.isSyncing
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        : 'bg-[#3b82f6] text-white hover:bg-[#e05530]'
                      }
                    `}
                  >
                    {syncStatus.isSyncing ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={20} />
                        <span>Sync Now</span>
                      </>
                    )}
                  </button>
                )}

                {/* Success State */}
                {!isOffline && syncStatus.pendingUploads === 0 && !syncStatus.isSyncing && (
                  <div className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-[14px]">
                    <Check size={20} />
                    <span>All changes synced</span>
                  </div>
                )}

                {/* Offline Warning */}
                {isOffline && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[13px] font-bold text-amber-800 dark:text-amber-200">
                          Working Offline
                        </p>
                        <p className="text-[12px] text-amber-700 dark:text-amber-300 mt-1">
                          Your changes will be saved locally and synced when you go back online.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OfflineIndicator;
