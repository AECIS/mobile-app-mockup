// Analytics Report Types - Global Report Module

export type ReportMode = 'archive' | 'online';

export type ToolType =
  | 'submittal'
  | 'drawing'
  | 'issue'
  | 'dmap'
  | 'dailyReport'
  | 'milestone'
  | 'cov'
  | 'eot'
  | 'risk'
  | 'cost'
  | 'dform'
  | 'systemReport'
  | 'checkinout';

export interface ToolTab {
  id: ToolType;
  name: string;
  excludeFromOnline?: boolean; // Daily Report is excluded from Online mode
}

export interface GroupReportType {
  id: number;
  name: string;
}

export interface ArchiveReport {
  id: number;
  projectId: number;
  toolType: ToolType;
  reportTypeId: number;
  reportFileUrl: string;
  reportFileName: string;
  reportTypeName: string;
  reportDate: string; // ISO date string
  groupReportTypeId: number;
  groupReportTypeName: string;
  isDownloaded: boolean;
}

export interface OnlineReportType {
  id: string;
  projectId: number;
  toolType: ToolType;
  reportTypeId: string;
  reportTypeName: string;
  groupReportTypeId: number;
  groupReportTypeName: string;
}

export interface ReportSection {
  date: string;
  reports: ArchiveReport[];
}
