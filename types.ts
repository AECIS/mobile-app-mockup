
import React from 'react';

export enum BottomTab {
  TOOLS = 'Tools',
  OFFLINE = 'Offline Data',
  CAMERA = 'Camera',
  NOTIFICATIONS = 'Notifications',
  MORE = 'More'
}

export type Priority = 'High' | 'Medium' | 'Low';

export interface Project {
  id: string;
  name: string;
  initials: string;
  state: 'active' | 'completed';
  address: string;
  icon?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  abbreviation: string;
}

export interface ProjectUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  stakeholderId: string;
  avatar?: string;
}

export type SubmittalStatus = 'Submitted' | 'Resubmitted' | 'In-Progress' | 'Approved (A)' | 'Approved (B)' | 'Rejected (C)' | 'For Info (D)';

export interface Submittal {
  id: string;
  title: string;
  description: string;
  status: SubmittalStatus;
  package?: string;
  discipline?: string;
  dTag?: string[];
  type: string;
  assigneeId: string;
  dueDate: string;
  ccRecipients: string[];
  feedbackRecipients: string[];
  attachments: string[];
  projectName?: string;
}

export type IssueStatus = 'Opened' | 'ReOpened' | 'Done' | 'Closed';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  package?: string;
  discipline?: string;
  dTag?: string[];
  type: string;
  assigneeId: string;
  dueDate: string;
  ccRecipients: string[];
  attachments: string[];
  projectName?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  date: string;
  time?: string;
  status: 'Backlog' | 'To Do' | 'In Progress' | 'Done';
  comments: number;
  attachments: number;
  assignees: string[];
}

export interface Attachment {
  name: string;
  type: 'pdf' | 'image' | 'doc';
  url?: string;
}

export interface DTagNode {
  id: string;
  label: string;
  children?: DTagNode[];
}

export interface MasterDataOption {
  id: string;
  label: string;
}

export interface Reminder {
  id: string;
  title: string;
  category: string;
  date: string;
  status: string;
  assignees: string[];
  attachments?: Attachment[];
}

// Submittal status enum with colors from backend
export const SUBMITTAL_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'Submitted': { label: 'Submitted', color: '#2C7ABB' },
  'InProgress': { label: 'In Progress', color: '#FFBF00' },
  'ReSubmitted': { label: 'Resubmitted', color: '#2C7ABB' },
  'Approved_A': { label: 'Approved (A)', color: '#238823' },
  'Rejected': { label: 'Rejected (C)', color: '#D2222D' },
  'Draft': { label: 'Draft', color: '#2C7ABB' },
  'Closed': { label: 'Closed', color: '#229385' },
  'Cancelled': { label: 'Cancelled', color: '#ADB7BE' },
  'Approved_B': { label: 'Approved (B)', color: '#238823' },
  'Published_A': { label: 'Published (A)', color: '#238823' },
  'Published_B': { label: 'Published (B)', color: '#238823' },
  'ForInfo': { label: 'For Info (D)', color: '#238823' },
  'Published_C': { label: 'Published (C) - Reject', color: '#D2222D' },
  'Superseded': { label: 'Superseded', color: '#ADB7BE' },
  'Obsoleted': { label: 'Obsoleted', color: '#ADB7BE' },
};

// Issue status enum with colors from backend
export const ISSUE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'Overdue': { label: 'Overdue', color: '#D2222D' },
  'Opened': { label: 'Opened', color: '#2C7ABB' },
  'ReOpened': { label: 'Re-Opened', color: '#2C7ABB' },
  'Done': { label: 'Done', color: '#FFBF00' },
  'Cancelled': { label: 'Cancelled', color: '#ADB7BE' },
  'Closed': { label: 'Closed', color: '#238823' },
};

export type FeedItemType = 'Submittal' | 'Issue' | 'RFS';

// Helper to get status config based on feed type
export const getStatusConfig = (type: FeedItemType, statusKey: string): { label: string; color: string } => {
  if (type === 'Issue') {
    return ISSUE_STATUS_CONFIG[statusKey] ?? { label: statusKey, color: '#ADB7BE' };
  }
  // Submittal and RFS use the same status config
  return SUBMITTAL_STATUS_CONFIG[statusKey] ?? { label: statusKey, color: '#ADB7BE' };
};

export interface FeedAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  size?: string;
  url?: string;
}

export interface FeedComment {
  id: string;
  userId: string;
  userName: string;
  userStakeholder?: string; // e.g. 'MC', 'AR', 'SE'
  text: string;
  timestamp: string;
  timestampMs: number; // for edit/delete window
  attachments?: FeedAttachment[];
  parentId?: string; // for replies
  isEdited?: boolean;
}

// Submittal actions
export type SubmittalAction =
  | 'submit' | 'resubmit' | 'cancel' | 'obsolete' | 'supersede'
  | 'approve_a' | 'approve_b' | 'reject_c' | 'issue_to' | 'for_info';

// Issue actions
export type IssueAction = 'open' | 'reopen' | 'close' | 'complete' | 'cancel';

// Combined activity action type
export type ActivityAction = SubmittalAction | IssueAction;

export interface FeedActivity {
  id: string;
  userId: string;
  userName: string;
  userStakeholder?: string; // e.g. 'MC', 'AR', 'SE'
  action: ActivityAction;
  statusKey: string; // key into SUBMITTAL_STATUS_CONFIG
  timestamp: string;
  description?: string;
  attachments?: FeedAttachment[]; // Photos/documents attached to this action
}

export type StreamItem =
  | { kind: 'comment'; data: FeedComment }
  | { kind: 'activity'; data: FeedActivity };

// Stakeholder abbreviations used in construction projects
export type StakeholderType = 'MC' | 'AR' | 'SE' | 'ME' | 'EE' | 'PM' | 'QS' | 'CL';

export const STAKEHOLDER_LABELS: Record<StakeholderType, string> = {
  MC: 'Main Contractor',
  AR: 'Architect',
  SE: 'Structural Engineer',
  ME: 'Mechanical Engineer',
  EE: 'Electrical Engineer',
  PM: 'Project Manager',
  QS: 'Quantity Surveyor',
  CL: 'Client',
};

// Action verbs for story format based on status
export const STATUS_ACTION_VERBS: Record<string, { verb: string; preposition: string }> = {
  // Submittal statuses
  Submitted: { verb: 'submitted', preposition: 'to' },
  InProgress: { verb: 'is reviewing', preposition: 'from' },
  ReSubmitted: { verb: 'resubmitted', preposition: 'to' },
  Approved_A: { verb: 'approved', preposition: 'from' },
  Approved_B: { verb: 'approved with comments', preposition: 'from' },
  Rejected: { verb: 'rejected', preposition: 'from' },
  ForInfo: { verb: 'shared', preposition: 'to' },
  Cancelled: { verb: 'cancelled', preposition: '' },
  // Issue statuses
  Opened: { verb: 'opened issue', preposition: 'for' },
  ReOpened: { verb: 'reopened issue', preposition: 'for' },
  Done: { verb: 'completed issue', preposition: 'for' },
  Closed: { verb: 'closed issue', preposition: 'for' },
};

// Helper to get the action story based on type and status
export const getActionStory = (
  type: FeedItemType,
  status: string,
  createdBy: FeedUser,
  assignee: FeedUser
): { actor: FeedUser; verb: string; target: FeedUser | null; preposition: string } => {
  const actionConfig = STATUS_ACTION_VERBS[status] || { verb: status.toLowerCase(), preposition: 'to' };

  // For approval/rejection, the assignee is the actor (reviewer)
  if (['Approved_A', 'Approved_B', 'Rejected', 'InProgress'].includes(status)) {
    return {
      actor: assignee,
      verb: actionConfig.verb,
      target: createdBy,
      preposition: actionConfig.preposition,
    };
  }

  // For submit/resubmit, the creator is the actor
  return {
    actor: createdBy,
    verb: actionConfig.verb,
    target: actionConfig.preposition ? assignee : null,
    preposition: actionConfig.preposition,
  };
};

export interface FeedUser {
  id: string;
  name: string;
  stakeholder: StakeholderType;
}

export type VisibilityType = 'public' | 'private' | 'restricted' | 'both';

export interface FeedItem {
  id: string;
  refNo: string; // Reference number e.g. "0001"
  type: FeedItemType;
  title: string;
  description: string;
  project: string;
  status: string; // key into SUBMITTAL_STATUS_CONFIG
  assignee: FeedUser;
  discipline?: string;
  submissionType?: string;
  dueDate?: string;
  tags: string[];
  attachments: FeedAttachment[];
  stream: StreamItem[];
  createdAt: string;
  createdBy: FeedUser;
  visibility?: VisibilityType; // public (default), private, restricted, both
  ccRecipients?: FeedUser[]; // Distribution list / CC recipients
  revision?: number; // Version/revision count (Rev. 1, Rev. 2, etc.)
}
