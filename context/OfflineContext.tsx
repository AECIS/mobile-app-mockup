import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type OfflineMode = 'online' | 'offline';

export interface SyncStatus {
  pendingUploads: number;
  pendingDownloads: number;
  lastSyncTime: Date | null;
  isSyncing: boolean;
}

export type FileDirection = 'upload' | 'download';
export type FileSyncStatus = 'pending' | 'synced' | 'failed' | 'downloading' | 'cached';

export interface OfflineFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document' | 'dwg' | 'data';
  size: number; // in bytes
  createdAt: Date;
  category: 'submission' | 'issue' | 'daily-report' | 'photo' | 'cache' | 'drawing' | 'specification' | 'model';
  syncStatus: FileSyncStatus;
  direction: FileDirection; // upload = created locally, download = fetched from server
  projectId?: string;
  description?: string;
}

export interface StorageInfo {
  used: number; // bytes
  total: number; // bytes
  percentage: number;
  warningThreshold: number; // percentage (e.g., 80)
  criticalThreshold: number; // percentage (e.g., 95)
  files: OfflineFile[];
  uploadSize: number;
  downloadSize: number;
}

interface OfflineContextType {
  mode: OfflineMode;
  isOffline: boolean;
  toggleOfflineMode: () => void;
  setOfflineMode: (mode: OfflineMode) => void;
  syncStatus: SyncStatus;
  networkAvailable: boolean;
  triggerSync: () => Promise<void>;
  storage: StorageInfo;
  deleteFile: (fileId: string) => void;
  deleteFilesByCategory: (category: OfflineFile['category']) => void;
  deleteFilesByDirection: (direction: FileDirection) => void;
  clearAllCache: () => void;
  clearSyncedFiles: () => void;
  clearDownloads: () => void;
  downloadForOffline: (fileId: string) => void;
  removeFromOffline: (fileId: string) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

const OFFLINE_MODE_KEY = 'aecis-offline-mode';
const STORAGE_TOTAL = 500 * 1024 * 1024; // 500 MB max storage

// Mock offline files for demo - including both uploads and downloads
const generateMockFiles = (): OfflineFile[] => {
  const now = new Date();
  return [
    // UPLOADS - Files created locally, pending sync
    { id: 'u1', name: 'Site_Photo_001.jpg', type: 'image', size: 3.2 * 1024 * 1024, createdAt: new Date(now.getTime() - 3600000), category: 'photo', syncStatus: 'pending', direction: 'upload' },
    { id: 'u2', name: 'Site_Photo_002.jpg', type: 'image', size: 2.8 * 1024 * 1024, createdAt: new Date(now.getTime() - 7200000), category: 'photo', syncStatus: 'pending', direction: 'upload' },
    { id: 'u3', name: 'Daily_Report_Feb08.pdf', type: 'pdf', size: 1.5 * 1024 * 1024, createdAt: new Date(now.getTime() - 86400000), category: 'daily-report', syncStatus: 'synced', direction: 'upload' },
    { id: 'u4', name: 'Submittal_Structural.pdf', type: 'pdf', size: 8.2 * 1024 * 1024, createdAt: new Date(now.getTime() - 172800000), category: 'submission', syncStatus: 'pending', direction: 'upload' },
    { id: 'u5', name: 'Issue_Crack_Photo.jpg', type: 'image', size: 4.1 * 1024 * 1024, createdAt: new Date(now.getTime() - 259200000), category: 'issue', syncStatus: 'failed', direction: 'upload' },
    { id: 'u6', name: 'Site_Photo_003.jpg', type: 'image', size: 3.5 * 1024 * 1024, createdAt: new Date(now.getTime() - 1800000), category: 'photo', syncStatus: 'pending', direction: 'upload' },
    { id: 'u7', name: 'MEP_Submittal.pdf', type: 'pdf', size: 12.0 * 1024 * 1024, createdAt: new Date(now.getTime() - 43200000), category: 'submission', syncStatus: 'pending', direction: 'upload' },

    // DOWNLOADS - Files fetched from server for offline viewing
    { id: 'd1', name: 'Floor_Plan_Level_01.dwg', type: 'dwg', size: 45.0 * 1024 * 1024, createdAt: new Date(now.getTime() - 604800000), category: 'drawing', syncStatus: 'cached', direction: 'download', description: 'Architectural floor plan' },
    { id: 'd2', name: 'Floor_Plan_Level_02.dwg', type: 'dwg', size: 42.0 * 1024 * 1024, createdAt: new Date(now.getTime() - 604800000), category: 'drawing', syncStatus: 'cached', direction: 'download', description: 'Architectural floor plan' },
    { id: 'd3', name: 'MEP_Layout_HVAC.dwg', type: 'dwg', size: 38.0 * 1024 * 1024, createdAt: new Date(now.getTime() - 518400000), category: 'drawing', syncStatus: 'cached', direction: 'download', description: 'Mechanical layout' },
    { id: 'd4', name: 'Structural_Details.dwg', type: 'dwg', size: 28.0 * 1024 * 1024, createdAt: new Date(now.getTime() - 432000000), category: 'drawing', syncStatus: 'cached', direction: 'download', description: 'Structural connection details' },
    { id: 'd5', name: 'Spec_Section_03300.pdf', type: 'pdf', size: 2.5 * 1024 * 1024, createdAt: new Date(now.getTime() - 1209600000), category: 'specification', syncStatus: 'cached', direction: 'download', description: 'Cast-in-place concrete' },
    { id: 'd6', name: 'Spec_Section_05120.pdf', type: 'pdf', size: 1.8 * 1024 * 1024, createdAt: new Date(now.getTime() - 1209600000), category: 'specification', syncStatus: 'cached', direction: 'download', description: 'Structural steel' },
    { id: 'd7', name: 'Spec_Section_23000.pdf', type: 'pdf', size: 3.2 * 1024 * 1024, createdAt: new Date(now.getTime() - 1209600000), category: 'specification', syncStatus: 'cached', direction: 'download', description: 'HVAC general provisions' },
    { id: 'd8', name: 'BIM_Model_Arch.ifc', type: 'data', size: 85.0 * 1024 * 1024, createdAt: new Date(now.getTime() - 86400000), category: 'model', syncStatus: 'cached', direction: 'download', description: 'Architectural BIM model' },
    { id: 'd9', name: 'Project_Master_Data', type: 'data', size: 15.0 * 1024 * 1024, createdAt: new Date(now.getTime() - 604800000), category: 'cache', syncStatus: 'cached', direction: 'download', description: 'Project metadata & settings' },
    { id: 'd10', name: 'User_Directory_Cache', type: 'data', size: 5.0 * 1024 * 1024, createdAt: new Date(now.getTime() - 604800000), category: 'cache', syncStatus: 'cached', direction: 'download', description: 'Team contacts & roles' },
  ];
};

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User's explicit offline mode preference
  const [mode, setModeState] = useState<OfflineMode>(() => {
    const saved = localStorage.getItem(OFFLINE_MODE_KEY) as OfflineMode | null;
    return saved || 'online';
  });

  // Actual network connectivity status
  const [networkAvailable, setNetworkAvailable] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Sync status for pending changes
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    pendingUploads: 0,
    pendingDownloads: 0,
    lastSyncTime: null,
    isSyncing: false,
  });

  // Storage management
  const [files, setFiles] = useState<OfflineFile[]>(generateMockFiles);

  const isOffline = mode === 'offline';

  // Calculate storage info
  const storage: StorageInfo = React.useMemo(() => {
    const used = files.reduce((acc, file) => acc + file.size, 0);
    const uploadSize = files.filter(f => f.direction === 'upload').reduce((acc, file) => acc + file.size, 0);
    const downloadSize = files.filter(f => f.direction === 'download').reduce((acc, file) => acc + file.size, 0);
    const percentage = Math.round((used / STORAGE_TOTAL) * 100);
    return {
      used,
      total: STORAGE_TOTAL,
      percentage,
      warningThreshold: 80,
      criticalThreshold: 95,
      files,
      uploadSize,
      downloadSize,
    };
  }, [files]);

  // Persist offline mode preference
  useEffect(() => {
    localStorage.setItem(OFFLINE_MODE_KEY, mode);
  }, [mode]);

  // Listen to actual network connectivity changes
  useEffect(() => {
    const handleOnline = () => setNetworkAvailable(true);
    const handleOffline = () => setNetworkAvailable(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update pending uploads count based on files
  useEffect(() => {
    const pendingUploadCount = files.filter(f => f.direction === 'upload' && f.syncStatus === 'pending').length;
    const pendingDownloadCount = files.filter(f => f.syncStatus === 'downloading').length;
    setSyncStatus(prev => ({
      ...prev,
      pendingUploads: pendingUploadCount,
      pendingDownloads: pendingDownloadCount,
    }));
  }, [files]);

  const toggleOfflineMode = useCallback(() => {
    setModeState(prev => prev === 'online' ? 'offline' : 'online');
  }, []);

  const setOfflineMode = useCallback((newMode: OfflineMode) => {
    setModeState(newMode);
  }, []);

  const triggerSync = useCallback(async () => {
    if (isOffline || !networkAvailable) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mark pending uploads as synced
    setFiles(prev => prev.map(f =>
      f.direction === 'upload' && f.syncStatus === 'pending' ? { ...f, syncStatus: 'synced' } : f
    ));

    setSyncStatus(prev => ({
      ...prev,
      pendingUploads: 0,
      pendingDownloads: 0,
      lastSyncTime: new Date(),
      isSyncing: false,
    }));
  }, [isOffline, networkAvailable]);

  const deleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const deleteFilesByCategory = useCallback((category: OfflineFile['category']) => {
    setFiles(prev => prev.filter(f => f.category !== category));
  }, []);

  const deleteFilesByDirection = useCallback((direction: FileDirection) => {
    setFiles(prev => prev.filter(f => f.direction !== direction));
  }, []);

  const clearAllCache = useCallback(() => {
    setFiles(prev => prev.filter(f => f.category !== 'cache'));
  }, []);

  const clearSyncedFiles = useCallback(() => {
    // Only clear synced uploads (downloads stay until manually removed)
    setFiles(prev => prev.filter(f => !(f.direction === 'upload' && f.syncStatus === 'synced')));
  }, []);

  const clearDownloads = useCallback(() => {
    setFiles(prev => prev.filter(f => f.direction !== 'download'));
  }, []);

  const downloadForOffline = useCallback((fileId: string) => {
    setFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, syncStatus: 'downloading' } : f
    ));
    // Simulate download completion after delay
    setTimeout(() => {
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, syncStatus: 'cached' } : f
      ));
    }, 2000);
  }, []);

  const removeFromOffline = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  return (
    <OfflineContext.Provider value={{
      mode,
      isOffline,
      toggleOfflineMode,
      setOfflineMode,
      syncStatus,
      networkAvailable,
      triggerSync,
      storage,
      deleteFile,
      deleteFilesByCategory,
      deleteFilesByDirection,
      clearAllCache,
      clearSyncedFiles,
      clearDownloads,
      downloadForOffline,
      removeFromOffline,
    }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export default OfflineContext;
