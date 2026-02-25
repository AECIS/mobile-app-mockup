// Daily Report Types

export type DailyReportType = 'general' | 'material';
export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error';

export interface DailyReportSummary {
  id: string;
  date: string; // ISO date
  type: DailyReportType;
  stakeholder: string;
  stakeholderName: string;
  syncStatus: SyncStatus;
  lastSyncTime?: string;
  isEnabled: boolean;

  // Basic stats
  manPowerQty: number;
  incidentQty: number;
  equipmentQty: number;
  actualProgress: number;
  plannedProgress: number;

  // Attachment counts
  photoCount: number;
  documentCount: number;

  // Material-specific
  materialCount?: number;
  deliveryCount?: number;
}

export interface DailyActivity {
  id: string;
  reportId: string;
  date: string;
  type: DailyReportType;
  stakeholder: string;
  stakeholderName: string;
  syncStatus: SyncStatus;
  lastSyncTime?: string;

  // Man Power
  manPowerQuantity: number;
  manPowerRemark: string;

  // Incidents
  incidentQuantity: number;
  incidentImpact: 'none' | 'low' | 'medium' | 'high' | 'critical';
  incidentRemark: string;

  // Equipment
  equipmentQuantity: number;
  equipmentRemark: string;

  // Working Time
  workingTimeStart: string;
  workingTimeEnd: string;

  // Progress
  actualProgressPercentage: number;
  plannedProgressPercentage: number;

  // Material-specific fields
  remarks?: string;
  materials?: DailyMaterial[];

  // Attachments
  documents: DailyDocument[];
  photos: DailyPhoto[];
  locations: DailyLocation[];
}

export interface DailyMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  supplier?: string;
  deliveryDate?: string;
  status: 'pending' | 'delivered' | 'partial';
  locationId: string;
  locationName: string;
}

export interface DailyDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DailyPhoto {
  id: string;
  url: string;
  caption: string;
  locationId: string;
  locationName: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DailyLocation {
  id: string;
  name: string;
  path: string; // e.g., "Level 3 > Zone A"
  photoCount: number;
}
