import { ToolTab, GroupReportType, ArchiveReport, OnlineReportType, ReportSection } from './types';

export const toolTabs: ToolTab[] = [
  { id: 'submittal', name: 'Submittal' },
  { id: 'drawing', name: 'Drawing' },
  { id: 'issue', name: 'Issue' },
  { id: 'dmap', name: 'DMap' },
  { id: 'dailyReport', name: 'Daily Report', excludeFromOnline: true },
  { id: 'milestone', name: 'Milestone' },
  { id: 'cov', name: 'COV' },
  { id: 'eot', name: 'EOT' },
  { id: 'risk', name: 'Risk' },
  { id: 'cost', name: 'Cost' },
  { id: 'dform', name: 'DForm' },
  { id: 'systemReport', name: 'AECIS Report' },
  { id: 'checkinout', name: 'Check-in/out' },
];

export const mockGroupTypes: GroupReportType[] = [
  { id: 1, name: 'All Reports' },
  { id: 2, name: 'Weekly Summary' },
  { id: 3, name: 'Monthly Summary' },
  { id: 4, name: 'Status Report' },
];

export const mockArchiveReports: ArchiveReport[] = [
  // Submittal reports
  {
    id: 1,
    projectId: 1,
    toolType: 'submittal',
    reportTypeId: 101,
    reportFileUrl: 'https://example.com/report1.pdf',
    reportFileName: 'Submittal Status Report - Week 05',
    reportTypeName: 'Weekly Status',
    reportDate: '2026-02-08',
    groupReportTypeId: 2,
    groupReportTypeName: 'Weekly Summary',
    isDownloaded: true,
  },
  {
    id: 2,
    projectId: 1,
    toolType: 'submittal',
    reportTypeId: 102,
    reportFileUrl: 'https://example.com/report2.pdf',
    reportFileName: 'Submittal Log - February 2026',
    reportTypeName: 'Monthly Log',
    reportDate: '2026-02-08',
    groupReportTypeId: 3,
    groupReportTypeName: 'Monthly Summary',
    isDownloaded: false,
  },
  {
    id: 3,
    projectId: 1,
    toolType: 'submittal',
    reportTypeId: 101,
    reportFileUrl: 'https://example.com/report3.pdf',
    reportFileName: 'Submittal Status Report - Week 04',
    reportTypeName: 'Weekly Status',
    reportDate: '2026-02-01',
    groupReportTypeId: 2,
    groupReportTypeName: 'Weekly Summary',
    isDownloaded: true,
  },
  {
    id: 4,
    projectId: 1,
    toolType: 'submittal',
    reportTypeId: 103,
    reportFileUrl: 'https://example.com/report4.pdf',
    reportFileName: 'Submittal Overview - January 2026',
    reportTypeName: 'Overview',
    reportDate: '2026-01-31',
    groupReportTypeId: 3,
    groupReportTypeName: 'Monthly Summary',
    isDownloaded: false,
  },
  // Issue reports
  {
    id: 5,
    projectId: 1,
    toolType: 'issue',
    reportTypeId: 201,
    reportFileUrl: 'https://example.com/report5.pdf',
    reportFileName: 'Issue Tracking Report - Week 05',
    reportTypeName: 'Weekly Tracking',
    reportDate: '2026-02-08',
    groupReportTypeId: 2,
    groupReportTypeName: 'Weekly Summary',
    isDownloaded: false,
  },
  {
    id: 6,
    projectId: 1,
    toolType: 'issue',
    reportTypeId: 202,
    reportFileUrl: 'https://example.com/report6.pdf',
    reportFileName: 'Open Issues Summary',
    reportTypeName: 'Status Summary',
    reportDate: '2026-02-07',
    groupReportTypeId: 4,
    groupReportTypeName: 'Status Report',
    isDownloaded: true,
  },
  // Drawing reports
  {
    id: 7,
    projectId: 1,
    toolType: 'drawing',
    reportTypeId: 301,
    reportFileUrl: 'https://example.com/report7.pdf',
    reportFileName: 'Drawing Register - February 2026',
    reportTypeName: 'Register',
    reportDate: '2026-02-08',
    groupReportTypeId: 3,
    groupReportTypeName: 'Monthly Summary',
    isDownloaded: false,
  },
  {
    id: 8,
    projectId: 1,
    toolType: 'drawing',
    reportTypeId: 302,
    reportFileUrl: 'https://example.com/report8.pdf',
    reportFileName: 'Drawing Revision Log',
    reportTypeName: 'Revision Log',
    reportDate: '2026-02-05',
    groupReportTypeId: 1,
    groupReportTypeName: 'All Reports',
    isDownloaded: true,
  },
];

export const mockOnlineReportTypes: OnlineReportType[] = [
  // Submittal
  {
    id: 'sub-001',
    projectId: 1,
    toolType: 'submittal',
    reportTypeId: 'SUB_STATUS',
    reportTypeName: 'Submittal Status Report',
    groupReportTypeId: 1,
    groupReportTypeName: 'All Reports',
  },
  {
    id: 'sub-002',
    projectId: 1,
    toolType: 'submittal',
    reportTypeId: 'SUB_LOG',
    reportTypeName: 'Submittal Log Report',
    groupReportTypeId: 1,
    groupReportTypeName: 'All Reports',
  },
  {
    id: 'sub-003',
    projectId: 1,
    toolType: 'submittal',
    reportTypeId: 'SUB_OVERDUE',
    reportTypeName: 'Overdue Submittal Report',
    groupReportTypeId: 4,
    groupReportTypeName: 'Status Report',
  },
  // Issue
  {
    id: 'iss-001',
    projectId: 1,
    toolType: 'issue',
    reportTypeId: 'ISS_STATUS',
    reportTypeName: 'Issue Status Report',
    groupReportTypeId: 1,
    groupReportTypeName: 'All Reports',
  },
  {
    id: 'iss-002',
    projectId: 1,
    toolType: 'issue',
    reportTypeId: 'ISS_OPEN',
    reportTypeName: 'Open Issues Report',
    groupReportTypeId: 4,
    groupReportTypeName: 'Status Report',
  },
  {
    id: 'iss-003',
    projectId: 1,
    toolType: 'issue',
    reportTypeId: 'ISS_CLOSED',
    reportTypeName: 'Closed Issues Report',
    groupReportTypeId: 4,
    groupReportTypeName: 'Status Report',
  },
  // Drawing
  {
    id: 'dwg-001',
    projectId: 1,
    toolType: 'drawing',
    reportTypeId: 'DWG_REGISTER',
    reportTypeName: 'Drawing Register',
    groupReportTypeId: 1,
    groupReportTypeName: 'All Reports',
  },
  {
    id: 'dwg-002',
    projectId: 1,
    toolType: 'drawing',
    reportTypeId: 'DWG_REVISION',
    reportTypeName: 'Drawing Revision History',
    groupReportTypeId: 1,
    groupReportTypeName: 'All Reports',
  },
];

// Helper function to group archive reports by date
export function groupReportsByDate(reports: ArchiveReport[]): ReportSection[] {
  const grouped = reports.reduce((acc, report) => {
    const date = report.reportDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(report);
    return acc;
  }, {} as Record<string, ArchiveReport[]>);

  return Object.entries(grouped)
    .map(([date, reports]) => ({ date, reports }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Helper function to get unique group types from reports
export function getGroupTypesFromReports(reports: (ArchiveReport | OnlineReportType)[]): GroupReportType[] {
  const groupMap = new Map<number, string>();
  reports.forEach(r => {
    if (!groupMap.has(r.groupReportTypeId)) {
      groupMap.set(r.groupReportTypeId, r.groupReportTypeName);
    }
  });
  return Array.from(groupMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
