// DMap Types - Digital Map Layout Module

export type DMapGroupBy = 'discipline' | 'drawingSet' | 'drawingType';
export type DMapSortBy = 'name' | 'createdDate' | 'updatedDate';
export type DMapSortOrder = 'ascending' | 'descending';
export type DMapListFilter = 'downloadedMaps' | 'creatingMaps';
export type DMapViewMode = 'byNo' | 'byLabel';
export type DownloadState = 'none' | 'inProgress' | 'failed' | 'success';

export interface DMapListViewMode {
  groupBy: DMapGroupBy;
  sortBy: DMapSortBy;
  order: DMapSortOrder;
}

export interface MapLayout {
  mapID: number;
  projectID: number;
  mapName: string;
  drawingID?: number;
  mapThumbnailUrl?: string;
  pdfWidth?: number;
  pdfHeight?: number;
  rotation?: number;
  downloadOfflineState: DownloadState;
  downloadMapImageState: DownloadState;
  downloadProgress?: number; // 0-100 percentage
  disciplineID?: number;
  disciplineName?: string;
  drawingSetID?: number;
  drawingSetName?: string;
  drawingTypeName?: string;
  visibility?: boolean;
  pinCount: number;
  imageStatus?: number;
  syncStatus: number;
  createdDate: string;
  updatedDate: string;
  isDeleted?: boolean;
}

export interface MapLayoutAnnotation {
  annotationID: number;
  mapID: number;
  projectID: number;
  objectID?: number; // Linked issue ID
  objectTypeID?: number;
  coordinateX: number;
  coordinateY: number;
  statusID?: number;
  statusName?: string;
  statusColor?: string;
  typeID?: number;
  objectNo?: string;
  objectName?: string;
  objectPhotoUrl?: string; // Original issue photo
  dMapLabel?: string;
  objectModifyDate?: string;
  dueDate?: string;
  syncStatus: number;
  isDeleted?: boolean;
  isDraft?: boolean;
}

export interface DMapSection {
  title: string;
  maps: MapLayout[];
}

export interface LinkableIssue {
  id: number;
  issueNo: string;
  title: string;
  status: string;
  statusColor: string;
  type?: string;
  disciplineName?: string;
  createdDate: string;
}

export interface CreatableDrawing {
  id: number;
  drawingNo: string;
  name: string;
  status: string;
  statusColor: string;
  disciplineName?: string;
  drawingSetName?: string;
}
