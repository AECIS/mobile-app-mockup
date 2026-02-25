import { MapLayout, MapLayoutAnnotation, DMapSection, LinkableIssue, CreatableDrawing } from './types';

// Mock Map Layouts
export const mockMapLayouts: MapLayout[] = [
  {
    mapID: 1,
    projectID: 1,
    mapName: 'Ground Floor Plan - Zone A',
    drawingID: 101,
    mapThumbnailUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
    pdfWidth: 1920,
    pdfHeight: 1080,
    rotation: 0,
    downloadOfflineState: 'success',
    downloadMapImageState: 'success',
    disciplineID: 1,
    disciplineName: 'Architecture',
    drawingSetID: 1,
    drawingSetName: 'Architectural Drawings',
    drawingTypeName: 'Floor Plan',
    visibility: true,
    pinCount: 8,
    syncStatus: 0,
    createdDate: '2025-01-15',
    updatedDate: '2025-02-01',
  },
  {
    mapID: 2,
    projectID: 1,
    mapName: 'First Floor Plan - Zone A',
    drawingID: 102,
    mapThumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    pdfWidth: 1920,
    pdfHeight: 1080,
    rotation: 0,
    downloadOfflineState: 'none',
    downloadMapImageState: 'success',
    disciplineID: 1,
    disciplineName: 'Architecture',
    drawingSetID: 1,
    drawingSetName: 'Architectural Drawings',
    drawingTypeName: 'Floor Plan',
    visibility: true,
    pinCount: 5,
    syncStatus: 0,
    createdDate: '2025-01-16',
    updatedDate: '2025-02-02',
  },
  {
    mapID: 3,
    projectID: 1,
    mapName: 'MEP Layout - Ground Floor',
    drawingID: 201,
    mapThumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    pdfWidth: 1920,
    pdfHeight: 1080,
    rotation: 0,
    downloadOfflineState: 'none',
    downloadMapImageState: 'inProgress',
    disciplineID: 2,
    disciplineName: 'MEP',
    drawingSetID: 2,
    drawingSetName: 'MEP Drawings',
    drawingTypeName: 'MEP Layout',
    visibility: true,
    pinCount: 12,
    syncStatus: 0,
    createdDate: '2025-01-20',
    updatedDate: '2025-02-03',
  },
  {
    mapID: 4,
    projectID: 1,
    mapName: 'Structural Plan - Foundation',
    drawingID: 301,
    mapThumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    pdfWidth: 1920,
    pdfHeight: 1080,
    rotation: 0,
    downloadOfflineState: 'failed',
    downloadMapImageState: 'success',
    disciplineID: 3,
    disciplineName: 'Structural',
    drawingSetID: 3,
    drawingSetName: 'Structural Drawings',
    drawingTypeName: 'Foundation Plan',
    visibility: true,
    pinCount: 3,
    syncStatus: 0,
    createdDate: '2025-01-22',
    updatedDate: '2025-01-30',
  },
  {
    mapID: 5,
    projectID: 1,
    mapName: 'Electrical Single Line Diagram',
    drawingID: 401,
    mapThumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    pdfWidth: 1920,
    pdfHeight: 1080,
    rotation: 0,
    downloadOfflineState: 'none',
    downloadMapImageState: 'none',
    disciplineID: 4,
    disciplineName: 'Electrical',
    drawingSetID: 4,
    drawingSetName: 'Electrical Drawings',
    drawingTypeName: 'Diagram',
    visibility: true,
    pinCount: 0,
    syncStatus: 0,
    createdDate: '2025-01-25',
    updatedDate: '2025-02-05',
  },
];

// Mock Annotations for Map ID 1
export const mockAnnotationsMap1: MapLayoutAnnotation[] = [
  {
    annotationID: 1,
    mapID: 1,
    projectID: 1,
    objectID: 101,
    objectTypeID: 1,
    coordinateX: 0.25,
    coordinateY: 0.35,
    statusID: 1,
    statusName: 'Opened',
    statusColor: '#2C7ABB',
    objectNo: '6031',
    objectName: 'Cửa Sắt | Sàn',
    objectPhotoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    dMapLabel: 'CTN',
    dueDate: '2025-10-28',
    syncStatus: 0,
  },
  {
    annotationID: 2,
    mapID: 1,
    projectID: 1,
    objectID: 102,
    objectTypeID: 1,
    coordinateX: 0.45,
    coordinateY: 0.55,
    statusID: 2,
    statusName: 'In Progress',
    statusColor: '#FFBF00',
    objectNo: '6032',
    objectName: 'Floor tile damage',
    objectPhotoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    dMapLabel: 'FLR',
    dueDate: '2025-11-15',
    syncStatus: 0,
  },
  {
    annotationID: 3,
    mapID: 1,
    projectID: 1,
    objectID: 103,
    objectTypeID: 1,
    coordinateX: 0.65,
    coordinateY: 0.25,
    statusID: 3,
    statusName: 'Closed',
    statusColor: '#238823',
    objectNo: '6033',
    objectName: 'Paint defect on ceiling',
    objectPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    dMapLabel: 'PNT',
    dueDate: '2025-09-20',
    syncStatus: 0,
  },
  {
    annotationID: 4,
    mapID: 1,
    projectID: 1,
    objectID: 104,
    objectTypeID: 1,
    coordinateX: 0.80,
    coordinateY: 0.70,
    statusID: 1,
    statusName: 'Opened',
    statusColor: '#2C7ABB',
    objectNo: '6034',
    objectName: 'Door alignment issue',
    objectPhotoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    dMapLabel: 'DOR',
    dueDate: '2025-12-01',
    syncStatus: 0,
  },
  {
    annotationID: 5,
    mapID: 1,
    projectID: 1,
    objectID: 105,
    objectTypeID: 1,
    coordinateX: 0.35,
    coordinateY: 0.75,
    statusID: 4,
    statusName: 'Overdue',
    statusColor: '#D2222D',
    objectNo: '6035',
    objectName: 'Water leak near window',
    objectPhotoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
    dMapLabel: 'WTR',
    dueDate: '2025-08-15',
    syncStatus: 0,
  },
  {
    annotationID: 6,
    mapID: 1,
    projectID: 1,
    coordinateX: 0.55,
    coordinateY: 0.40,
    statusID: 0,
    statusName: 'Draft',
    statusColor: '#ADB7BE',
    dMapLabel: 'F06',
    syncStatus: 1,
    isDraft: true,
  },
];

// Mock linkable issues
export const mockLinkableIssues: LinkableIssue[] = [
  {
    id: 201,
    issueNo: '006',
    title: 'Missing fire extinguisher bracket',
    status: 'Opened',
    statusColor: '#2C7ABB',
    type: 'Safety',
    disciplineName: 'Fire Safety',
    createdDate: '2025-02-01',
  },
  {
    id: 202,
    issueNo: '007',
    title: 'Electrical outlet misalignment',
    status: 'Opened',
    statusColor: '#2C7ABB',
    type: 'Defect',
    disciplineName: 'Electrical',
    createdDate: '2025-02-02',
  },
  {
    id: 203,
    issueNo: '008',
    title: 'HVAC duct not sealed properly',
    status: 'In Progress',
    statusColor: '#FFBF00',
    type: 'Defect',
    disciplineName: 'MEP',
    createdDate: '2025-02-03',
  },
  {
    id: 204,
    issueNo: '009',
    title: 'Structural column deviation',
    status: 'Opened',
    statusColor: '#2C7ABB',
    type: 'NCR',
    disciplineName: 'Structural',
    createdDate: '2025-02-04',
  },
];

// Mock creatable drawings
export const mockCreatableDrawings: CreatableDrawing[] = [
  {
    id: 501,
    drawingNo: 'AR-201',
    name: 'Second Floor Plan - Zone A',
    status: 'Approved (A)',
    statusColor: '#238823',
    disciplineName: 'Architecture',
    drawingSetName: 'Architectural Drawings',
  },
  {
    id: 502,
    drawingNo: 'AR-202',
    name: 'Second Floor Plan - Zone B',
    status: 'Approved (A)',
    statusColor: '#238823',
    disciplineName: 'Architecture',
    drawingSetName: 'Architectural Drawings',
  },
  {
    id: 503,
    drawingNo: 'ME-101',
    name: 'Mechanical Room Layout',
    status: 'Published (A)',
    statusColor: '#238823',
    disciplineName: 'MEP',
    drawingSetName: 'MEP Drawings',
  },
  {
    id: 504,
    drawingNo: 'ST-102',
    name: 'Roof Framing Plan',
    status: 'Approved (B)',
    statusColor: '#238823',
    disciplineName: 'Structural',
    drawingSetName: 'Structural Drawings',
  },
];

// Group maps by discipline
export const groupMapsByDiscipline = (maps: MapLayout[]): DMapSection[] => {
  const grouped: Record<string, MapLayout[]> = {};

  maps.forEach(map => {
    const key = map.disciplineName || 'Uncategorized';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(map);
  });

  return Object.entries(grouped).map(([title, maps]) => ({ title, maps }));
};

// Group maps by drawing set
export const groupMapsByDrawingSet = (maps: MapLayout[]): DMapSection[] => {
  const grouped: Record<string, MapLayout[]> = {};

  maps.forEach(map => {
    const key = map.drawingSetName || 'Uncategorized';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(map);
  });

  return Object.entries(grouped).map(([title, maps]) => ({ title, maps }));
};

// Group maps by drawing type
export const groupMapsByDrawingType = (maps: MapLayout[]): DMapSection[] => {
  const grouped: Record<string, MapLayout[]> = {};

  maps.forEach(map => {
    const key = map.drawingTypeName || 'Uncategorized';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(map);
  });

  return Object.entries(grouped).map(([title, maps]) => ({ title, maps }));
};
