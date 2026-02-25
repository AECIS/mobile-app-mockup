import { DailyReportSummary, DailyActivity, DailyMaterial, DailyDocument, DailyPhoto, DailyLocation } from './types';

// Mock daily report list
export const mockDailyReports: DailyReportSummary[] = [
  {
    id: 'dr1',
    date: '2026-02-07',
    type: 'general',
    stakeholder: 'MC',
    stakeholderName: 'Main Contractor',
    syncStatus: 'synced',
    lastSyncTime: '5 min ago',
    isEnabled: true,
    manPowerQty: 15,
    incidentQty: 0,
    equipmentQty: 5,
    actualProgress: 80,
    plannedProgress: 85,
    photoCount: 12,
    documentCount: 3,
  },
  {
    id: 'dr2',
    date: '2026-02-06',
    type: 'material',
    stakeholder: 'AR',
    stakeholderName: 'Architect',
    syncStatus: 'pending',
    isEnabled: true,
    manPowerQty: 8,
    incidentQty: 1,
    equipmentQty: 3,
    actualProgress: 60,
    plannedProgress: 70,
    photoCount: 8,
    documentCount: 1,
    materialCount: 6,
    deliveryCount: 4,
  },
  {
    id: 'dr3',
    date: '2026-02-05',
    type: 'general',
    stakeholder: 'ME',
    stakeholderName: 'Mechanical Engineer',
    syncStatus: 'synced',
    lastSyncTime: '1 hour ago',
    isEnabled: true,
    manPowerQty: 12,
    incidentQty: 0,
    equipmentQty: 4,
    actualProgress: 75,
    plannedProgress: 75,
    photoCount: 6,
    documentCount: 2,
  },
  {
    id: 'dr4',
    date: '2026-02-04',
    type: 'material',
    stakeholder: 'EE',
    stakeholderName: 'Electrical Engineer',
    syncStatus: 'error',
    isEnabled: false,
    manPowerQty: 10,
    incidentQty: 2,
    equipmentQty: 2,
    actualProgress: 45,
    plannedProgress: 60,
    photoCount: 4,
    documentCount: 1,
    materialCount: 4,
    deliveryCount: 1,
  },
  {
    id: 'dr5',
    date: '2026-02-03',
    type: 'general',
    stakeholder: 'MC',
    stakeholderName: 'Main Contractor',
    syncStatus: 'synced',
    lastSyncTime: '2 days ago',
    isEnabled: true,
    manPowerQty: 18,
    incidentQty: 0,
    equipmentQty: 6,
    actualProgress: 70,
    plannedProgress: 68,
    photoCount: 15,
    documentCount: 4,
  },
];

// Mock locations
export const mockLocations: DailyLocation[] = [
  { id: 'loc1', name: 'Zone A', path: 'Level 3 > Zone A', photoCount: 4 },
  { id: 'loc2', name: 'Zone B', path: 'Level 3 > Zone B', photoCount: 2 },
  { id: 'loc3', name: 'Zone A', path: 'Level 4 > Zone A', photoCount: 3 },
  { id: 'loc4', name: 'Zone B', path: 'Level 4 > Zone B', photoCount: 3 },
];

// Mock photos
export const mockPhotos: DailyPhoto[] = [
  { id: 'p1', url: 'https://picsum.photos/seed/dr1/400/300', caption: 'Concrete pouring in progress', locationId: 'loc1', locationName: 'Level 3 > Zone A', uploadedAt: '10:30 AM', uploadedBy: 'Saski Amora' },
  { id: 'p2', url: 'https://picsum.photos/seed/dr2/400/300', caption: 'Rebar installation complete', locationId: 'loc1', locationName: 'Level 3 > Zone A', uploadedAt: '11:15 AM', uploadedBy: 'Saski Amora' },
  { id: 'p3', url: 'https://picsum.photos/seed/dr3/400/300', caption: 'Formwork preparation', locationId: 'loc1', locationName: 'Level 3 > Zone A', uploadedAt: '2:00 PM', uploadedBy: 'Kenneth Alanda' },
  { id: 'p4', url: 'https://picsum.photos/seed/dr4/400/300', caption: 'MEP coordination check', locationId: 'loc1', locationName: 'Level 3 > Zone A', uploadedAt: '3:30 PM', uploadedBy: 'Elena Rodriguez' },
  { id: 'p5', url: 'https://picsum.photos/seed/dr5/400/300', caption: 'Electrical conduit routing', locationId: 'loc3', locationName: 'Level 4 > Zone A', uploadedAt: '9:00 AM', uploadedBy: 'David Chen' },
  { id: 'p6', url: 'https://picsum.photos/seed/dr6/400/300', caption: 'HVAC duct installation', locationId: 'loc3', locationName: 'Level 4 > Zone A', uploadedAt: '10:45 AM', uploadedBy: 'Elena Rodriguez' },
  { id: 'p7', url: 'https://picsum.photos/seed/dr7/400/300', caption: 'Fire sprinkler main', locationId: 'loc3', locationName: 'Level 4 > Zone A', uploadedAt: '1:30 PM', uploadedBy: 'Michael Torres' },
  { id: 'p8', url: 'https://picsum.photos/seed/dr8/400/300', caption: 'Structural beam connection', locationId: 'loc4', locationName: 'Level 4 > Zone B', uploadedAt: '4:00 PM', uploadedBy: 'James Wilson' },
];

// Mock documents
export const mockDocuments: DailyDocument[] = [
  { id: 'd1', name: 'Safety_Checklist_Feb7.pdf', type: 'pdf', size: '1.2 MB', uploadedAt: '8:00 AM', uploadedBy: 'Saski Amora' },
  { id: 'd2', name: 'Progress_Report_Week6.xlsx', type: 'xlsx', size: '890 KB', uploadedAt: '5:00 PM', uploadedBy: 'Kenneth Alanda' },
  { id: 'd3', name: 'Material_Delivery_Note.pdf', type: 'pdf', size: '456 KB', uploadedAt: '11:30 AM', uploadedBy: 'Elena Rodriguez' },
];

// Mock materials (for Material reports)
export const mockMaterials: DailyMaterial[] = [
  { id: 'm1', name: 'Rebar 16mm', quantity: 500, unit: 'kg', supplier: 'Steel Corp', deliveryDate: '2026-02-06', status: 'delivered', locationId: 'loc3', locationName: 'Level 4 > Zone A' },
  { id: 'm2', name: 'Concrete C30', quantity: 20, unit: 'm³', supplier: 'Ready Mix Co', deliveryDate: '2026-02-06', status: 'delivered', locationId: 'loc2', locationName: 'Level 3 > Zone B' },
  { id: 'm3', name: 'Electrical Cables', quantity: 200, unit: 'm', supplier: 'Cable Plus', status: 'pending', locationId: 'loc4', locationName: 'Level 4 > Zone B' },
  { id: 'm4', name: 'HVAC Ducts', quantity: 50, unit: 'pcs', supplier: 'Air Systems', deliveryDate: '2026-02-06', status: 'partial', locationId: 'loc1', locationName: 'Level 3 > Zone A' },
  { id: 'm5', name: 'Fire Sprinkler Heads', quantity: 100, unit: 'pcs', supplier: 'Fire Safety Ltd', status: 'pending', locationId: 'loc3', locationName: 'Level 4 > Zone A' },
  { id: 'm6', name: 'Ceiling Tiles', quantity: 300, unit: 'pcs', supplier: 'Interior Finish', deliveryDate: '2026-02-05', status: 'delivered', locationId: 'loc3', locationName: 'Level 4 > Zone A' },
];

// Mock daily activity detail (General)
export const mockDailyActivity: DailyActivity = {
  id: 'da1',
  reportId: 'dr1',
  date: '2026-02-07',
  type: 'general',
  stakeholder: 'MC',
  stakeholderName: 'Main Contractor',
  syncStatus: 'synced',
  lastSyncTime: '5 min ago',

  manPowerQuantity: 15,
  manPowerRemark: 'Site workers on Level 4 concrete pouring. Additional crew for formwork preparation.',

  incidentQuantity: 0,
  incidentImpact: 'none',
  incidentRemark: 'No incidents reported. All safety protocols followed.',

  equipmentQuantity: 5,
  equipmentRemark: 'Excavator (1), Concrete mixer (2), Crane (1), Forklift (1)',

  workingTimeStart: '08:00',
  workingTimeEnd: '18:00',

  actualProgressPercentage: 80,
  plannedProgressPercentage: 85,

  documents: mockDocuments,
  photos: mockPhotos,
  locations: mockLocations,
};

// Mock Material daily activity
export const mockMaterialDailyActivity: DailyActivity = {
  id: 'da2',
  reportId: 'dr2',
  date: '2026-02-06',
  type: 'material',
  stakeholder: 'AR',
  stakeholderName: 'Architect',
  syncStatus: 'pending',

  manPowerQuantity: 8,
  manPowerRemark: 'Inspection team and material receiving crew on site.',

  incidentQuantity: 1,
  incidentImpact: 'low',
  incidentRemark: 'Minor delay due to material delivery. Resolved by 11 AM.',

  equipmentQuantity: 3,
  equipmentRemark: 'Forklift (1), Pallet jack (2)',

  workingTimeStart: '09:00',
  workingTimeEnd: '17:00',

  actualProgressPercentage: 60,
  plannedProgressPercentage: 70,

  remarks: 'Material deliveries tracked. All items inspected and stored properly.',
  materials: mockMaterials,

  documents: [mockDocuments[0]],
  photos: mockPhotos.slice(0, 8),
  locations: mockLocations,
};

// Stakeholder options for filter
export const stakeholderOptions = [
  { id: 'all', label: 'All Stakeholders' },
  { id: 'MC', label: 'Main Contractor (MC)' },
  { id: 'AR', label: 'Architect (AR)' },
  { id: 'ME', label: 'Mechanical Engineer (ME)' },
  { id: 'EE', label: 'Electrical Engineer (EE)' },
  { id: 'SE', label: 'Structural Engineer (SE)' },
];
