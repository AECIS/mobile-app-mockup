import React, { useState } from 'react';
import {
  ChevronLeft, HardDrive, Trash2, Image, FileText, Database,
  AlertTriangle, Check, X, ChevronRight, RefreshCw, AlertCircle,
  Camera, FileCheck, ClipboardList, FolderOpen, Upload, Download,
  FileBox, Layers, BookOpen, Box
} from 'lucide-react';
import { useOffline, OfflineFile, FileDirection } from '../context';

interface StorageManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
};

const getCategoryIcon = (category: OfflineFile['category']) => {
  switch (category) {
    case 'photo': return <Camera size={16} />;
    case 'submission': return <FileCheck size={16} />;
    case 'issue': return <AlertTriangle size={16} />;
    case 'daily-report': return <ClipboardList size={16} />;
    case 'cache': return <Database size={16} />;
    case 'drawing': return <Layers size={16} />;
    case 'specification': return <BookOpen size={16} />;
    case 'model': return <Box size={16} />;
    default: return <FileText size={16} />;
  }
};

const getCategoryLabel = (category: OfflineFile['category']): string => {
  switch (category) {
    case 'photo': return 'Photos';
    case 'submission': return 'Submissions';
    case 'issue': return 'Issues';
    case 'daily-report': return 'Daily Reports';
    case 'cache': return 'Cached Data';
    case 'drawing': return 'Drawings';
    case 'specification': return 'Specifications';
    case 'model': return 'BIM Models';
    default: return 'Files';
  }
};

const getCategoryColor = (category: OfflineFile['category']) => {
  switch (category) {
    case 'photo': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' };
    case 'submission': return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' };
    case 'issue': return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' };
    case 'daily-report': return { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400' };
    case 'cache': return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400' };
    case 'drawing': return { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' };
    case 'specification': return { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' };
    case 'model': return { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' };
    default: return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400' };
  }
};

const getStatusColor = (status: OfflineFile['syncStatus']) => {
  switch (status) {
    case 'pending': return 'bg-amber-500';
    case 'synced': return 'bg-emerald-500';
    case 'failed': return 'bg-red-500';
    case 'downloading': return 'bg-blue-500';
    case 'cached': return 'bg-emerald-500';
    default: return 'bg-slate-400';
  }
};

const getStatusLabel = (status: OfflineFile['syncStatus']) => {
  switch (status) {
    case 'pending': return 'Pending sync';
    case 'synced': return 'Synced';
    case 'failed': return 'Sync failed';
    case 'downloading': return 'Downloading...';
    case 'cached': return 'Available offline';
    default: return '';
  }
};

interface CategorySummary {
  category: OfflineFile['category'];
  label: string;
  count: number;
  size: number;
  pendingCount: number;
}

type ViewTab = 'overview' | 'uploads' | 'downloads';

const StorageManager: React.FC<StorageManagerProps> = ({ isOpen, onClose }) => {
  const {
    storage, deleteFile, deleteFilesByCategory, clearAllCache, clearSyncedFiles,
    clearDownloads, triggerSync, syncStatus, isOffline, networkAvailable, deleteFilesByDirection
  } = useOffline();

  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [selectedCategory, setSelectedCategory] = useState<OfflineFile['category'] | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'file' | 'category' | 'cache' | 'synced' | 'all-downloads' | 'all-uploads';
    id?: string;
    category?: OfflineFile['category'];
  } | null>(null);

  if (!isOpen) return null;

  const { used, total, percentage, warningThreshold, criticalThreshold, files, uploadSize, downloadSize } = storage;

  const isWarning = percentage >= warningThreshold && percentage < criticalThreshold;
  const isCritical = percentage >= criticalThreshold;

  // Filter files by direction
  const uploadFiles = files.filter(f => f.direction === 'upload');
  const downloadFiles = files.filter(f => f.direction === 'download');

  // Group files by category for current view
  const getCategories = (direction: FileDirection): CategorySummary[] => {
    const dirFiles = direction === 'upload' ? uploadFiles : downloadFiles;
    const categoryMap = new Map<OfflineFile['category'], CategorySummary>();

    dirFiles.forEach(file => {
      if (!categoryMap.has(file.category)) {
        categoryMap.set(file.category, {
          category: file.category,
          label: getCategoryLabel(file.category),
          count: 0,
          size: 0,
          pendingCount: 0,
        });
      }
      const summary = categoryMap.get(file.category)!;
      summary.count++;
      summary.size += file.size;
      if (file.syncStatus === 'pending' || file.syncStatus === 'downloading') {
        summary.pendingCount++;
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.size - a.size);
  };

  const uploadCategories = getCategories('upload');
  const downloadCategories = getCategories('download');

  const filteredFiles = selectedCategory
    ? files.filter(f => f.category === selectedCategory && f.direction === (activeTab === 'uploads' ? 'upload' : 'download'))
    : [];

  const handleDeleteFile = (fileId: string) => {
    setShowDeleteConfirm({ type: 'file', id: fileId });
  };

  const handleDeleteCategory = (category: OfflineFile['category']) => {
    setShowDeleteConfirm({ type: 'category', category });
  };

  const confirmDelete = () => {
    if (!showDeleteConfirm) return;

    if (showDeleteConfirm.type === 'file' && showDeleteConfirm.id) {
      deleteFile(showDeleteConfirm.id);
    } else if (showDeleteConfirm.type === 'category' && showDeleteConfirm.category) {
      deleteFilesByCategory(showDeleteConfirm.category);
      setSelectedCategory(null);
    } else if (showDeleteConfirm.type === 'cache') {
      clearAllCache();
    } else if (showDeleteConfirm.type === 'synced') {
      clearSyncedFiles();
    } else if (showDeleteConfirm.type === 'all-downloads') {
      clearDownloads();
    } else if (showDeleteConfirm.type === 'all-uploads') {
      deleteFilesByDirection('upload');
    }

    setShowDeleteConfirm(null);
  };

  const getProgressBarColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isWarning) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const renderOverview = () => (
    <>
      {/* Storage Usage Card */}
      <div className={`
        p-5 rounded-2xl mb-6 border transition-colors
        ${isCritical
          ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'
          : isWarning
            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30'
            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
        }
      `}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isCritical
              ? 'bg-red-100 dark:bg-red-900/30'
              : isWarning
                ? 'bg-amber-100 dark:bg-amber-900/30'
                : 'bg-slate-100 dark:bg-slate-700'
            }
          `}>
            <HardDrive size={24} className={
              isCritical
                ? 'text-red-600 dark:text-red-400'
                : isWarning
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 dark:text-slate-300'
            } />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{percentage}%</span>
              <span className="text-[12px] text-slate-500 dark:text-slate-400">
                {formatBytes(used)} / {formatBytes(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden mb-3 flex">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${Math.round((downloadSize / total) * 100)}%` }}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${Math.round((uploadSize / total) * 100)}%` }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-500 dark:text-slate-400">Downloads ({formatBytes(downloadSize)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-500 dark:text-slate-400">Uploads ({formatBytes(uploadSize)})</span>
            </div>
          </div>
        </div>

        {/* Warning/Critical Message */}
        {(isWarning || isCritical) && (
          <div className={`
            flex items-start gap-2 p-3 rounded-xl mt-4
            ${isCritical
              ? 'bg-red-100 dark:bg-red-900/40'
              : 'bg-amber-100 dark:bg-amber-900/40'
            }
          `}>
            <AlertCircle size={16} className={
              isCritical
                ? 'text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5'
                : 'text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5'
            } />
            <div>
              <p className={`text-[12px] font-bold ${
                isCritical
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-amber-800 dark:text-amber-200'
              }`}>
                {isCritical ? 'Storage Almost Full!' : 'Storage Running Low'}
              </p>
              <p className={`text-[11px] mt-0.5 ${
                isCritical
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-amber-700 dark:text-amber-300'
              }`}>
                {isCritical
                  ? 'Remove downloads or sync uploads to free space'
                  : 'Consider removing unused downloads'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => !isOffline && networkAvailable && triggerSync()}
          disabled={isOffline || !networkAvailable || syncStatus.isSyncing}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-[13px]
            transition-all cursor-pointer active:scale-[0.98]
            ${isOffline || !networkAvailable
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
              : 'bg-[#3b82f6] text-white'
            }
          `}
        >
          <RefreshCw size={18} className={syncStatus.isSyncing ? 'animate-spin' : ''} />
          <span>{syncStatus.isSyncing ? 'Syncing...' : 'Sync Uploads'}</span>
        </button>

        <button
          onClick={() => setShowDeleteConfirm({ type: 'synced' })}
          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[13px] transition-all cursor-pointer active:scale-[0.98]"
        >
          <Trash2 size={18} />
          <span>Clear Synced</span>
        </button>
      </div>

      {/* Storage Sections */}
      <div className="space-y-4">
        {/* Downloads Section */}
        <button
          onClick={() => setActiveTab('downloads')}
          className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 active:bg-slate-50 dark:active:bg-slate-700 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Download size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100">Downloaded Files</span>
              <span className="text-[13px] font-bold text-blue-600 dark:text-blue-400">{formatBytes(downloadSize)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${Math.round((downloadSize / total) * 100)}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{downloadFiles.length} files</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300 dark:text-slate-500" />
        </button>

        {/* Uploads Section */}
        <button
          onClick={() => setActiveTab('uploads')}
          className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 active:bg-slate-50 dark:active:bg-slate-700 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Upload size={22} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100">Pending Uploads</span>
              <span className="text-[13px] font-bold text-amber-600 dark:text-amber-400">{formatBytes(uploadSize)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${Math.round((uploadSize / total) * 100)}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{uploadFiles.length} files</span>
              {syncStatus.pendingUploads > 0 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                  {syncStatus.pendingUploads} pending
                </span>
              )}
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300 dark:text-slate-500" />
        </button>
      </div>
    </>
  );

  const renderCategoryList = (direction: FileDirection) => {
    const categories = direction === 'upload' ? uploadCategories : downloadCategories;
    const dirFiles = direction === 'upload' ? uploadFiles : downloadFiles;
    const totalSize = direction === 'upload' ? uploadSize : downloadSize;

    return (
      <>
        {/* Summary Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {direction === 'upload' ? (
              <Upload size={18} className="text-amber-600 dark:text-amber-400" />
            ) : (
              <Download size={18} className="text-blue-600 dark:text-blue-400" />
            )}
            <span className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
              {dirFiles.length} files · {formatBytes(totalSize)}
            </span>
          </div>
          {dirFiles.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm({ type: direction === 'upload' ? 'all-uploads' : 'all-downloads' })}
              className="text-[12px] font-bold text-red-500 dark:text-red-400 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </div>

        {/* Category Cards */}
        <div className="space-y-2">
          {categories.map(summary => {
            const colors = getCategoryColor(summary.category);
            const categoryPercentage = Math.round((summary.size / total) * 100);

            return (
              <button
                key={summary.category}
                onClick={() => setSelectedCategory(summary.category)}
                className="w-full flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700 transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                  <span className={colors.text}>{getCategoryIcon(summary.category)}</span>
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                      {summary.label}
                    </span>
                    <span className="text-[12px] text-slate-500 dark:text-slate-400">
                      {formatBytes(summary.size)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${direction === 'upload' ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(categoryPercentage * 3, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 w-6 text-right">
                      {summary.count}
                    </span>
                    {summary.pendingCount > 0 && direction === 'upload' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                        {summary.pendingCount} pending
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
              </button>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen size={48} className="text-slate-200 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-slate-400 dark:text-slate-500">
              {direction === 'upload' ? 'No pending uploads' : 'No downloaded files'}
            </p>
            <p className="text-[12px] text-slate-300 dark:text-slate-600 mt-1">
              {direction === 'upload'
                ? 'Files you create offline will appear here'
                : 'Download files for offline access'
              }
            </p>
          </div>
        )}
      </>
    );
  };

  const renderFileList = () => {
    const direction = activeTab === 'uploads' ? 'upload' : 'download';

    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] text-slate-500 dark:text-slate-400">
            {filteredFiles.length} files · {formatBytes(filteredFiles.reduce((a, f) => a + f.size, 0))}
          </span>
          {filteredFiles.length > 0 && (
            <button
              onClick={() => selectedCategory && handleDeleteCategory(selectedCategory)}
              className="text-[12px] font-bold text-red-500 dark:text-red-400 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={14} />
              Delete All
            </button>
          )}
        </div>

        <div className="space-y-2">
          {filteredFiles.map(file => {
            const colors = getCategoryColor(file.category);

            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700"
              >
                {/* File Type Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                  <span className={colors.text}>
                    {file.type === 'image' ? <Image size={18} /> :
                     file.type === 'dwg' ? <Layers size={18} /> :
                     file.type === 'pdf' ? <FileText size={18} /> :
                     <Database size={18} />}
                  </span>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate">
                      {file.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(file.syncStatus)}`} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {formatBytes(file.size)}
                    </span>
                    <span className="text-[11px] text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {formatDate(file.createdAt)}
                    </span>
                    {(file.syncStatus === 'pending' || file.syncStatus === 'failed' || file.syncStatus === 'downloading') && (
                      <>
                        <span className="text-[11px] text-slate-300 dark:text-slate-600">·</span>
                        <span className={`text-[10px] font-medium ${
                          file.syncStatus === 'pending' ? 'text-amber-600 dark:text-amber-400' :
                          file.syncStatus === 'downloading' ? 'text-blue-600 dark:text-blue-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {getStatusLabel(file.syncStatus)}
                        </span>
                      </>
                    )}
                  </div>
                  {file.description && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                      {file.description}
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center active:bg-red-100 dark:active:bg-red-900/30 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} className="text-slate-400 dark:text-slate-500" />
                </button>
              </div>
            );
          })}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen size={48} className="text-slate-200 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-slate-400 dark:text-slate-500">No files in this category</p>
          </div>
        )}
      </>
    );
  };

  const getHeaderTitle = () => {
    if (selectedCategory) {
      return getCategoryLabel(selectedCategory);
    }
    switch (activeTab) {
      case 'uploads': return 'Pending Uploads';
      case 'downloads': return 'Downloaded Files';
      default: return 'Storage';
    }
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (activeTab !== 'overview') {
      setActiveTab('overview');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[80] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            className="w-11 h-11 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700 active:scale-[0.98] transition-all -ml-1 cursor-pointer"
          >
            <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
              {getHeaderTitle()}
            </h1>
          </div>
          <div className="w-11" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'uploads' && !selectedCategory && renderCategoryList('upload')}
        {activeTab === 'downloads' && !selectedCategory && renderCategoryList('download')}
        {selectedCategory && renderFileList()}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[90]"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[90] animate-in slide-in-from-bottom duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-t-[2rem] p-6 pb-10 shadow-2xl">
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-600 rounded-full mx-auto mb-6" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {showDeleteConfirm.type === 'file' ? 'Delete File?' :
                     showDeleteConfirm.type === 'category' ? 'Delete All Files?' :
                     showDeleteConfirm.type === 'cache' ? 'Clear Cache?' :
                     showDeleteConfirm.type === 'all-downloads' ? 'Clear All Downloads?' :
                     showDeleteConfirm.type === 'all-uploads' ? 'Clear All Uploads?' :
                     'Clear Synced Files?'}
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">
                    {showDeleteConfirm.type === 'file'
                      ? 'This file will be removed from offline storage.'
                      : showDeleteConfirm.type === 'category'
                        ? `All ${getCategoryLabel(showDeleteConfirm.category!).toLowerCase()} will be deleted.`
                        : showDeleteConfirm.type === 'cache'
                          ? 'Cached data will be cleared. You may need to re-download.'
                          : showDeleteConfirm.type === 'all-downloads'
                            ? 'All downloaded files will be removed. You can re-download later.'
                            : showDeleteConfirm.type === 'all-uploads'
                              ? 'All pending uploads will be deleted permanently.'
                              : 'Files that have been synced will be removed locally.'
                    }
                  </p>
                </div>
              </div>

              {/* Warning for pending files */}
              {(showDeleteConfirm.type === 'category' || showDeleteConfirm.type === 'file' || showDeleteConfirm.type === 'all-uploads') && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-amber-700 dark:text-amber-300">
                      Pending files that haven't synced will be lost permanently.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[14px] transition-all active:scale-[0.98] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold text-[14px] transition-all active:scale-[0.98] cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StorageManager;
