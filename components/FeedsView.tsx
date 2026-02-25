
import React, { useState, useMemo } from 'react';
import { Layers, AlertTriangle, FileInput, FileText, Image as ImageIcon, ChevronRight, Filter, X, Clock, MessageSquare, Lock, EyeOff, GitBranch, Send, CircleDot, Settings2 } from 'lucide-react';
import { FeedItem, getStatusConfig, FeedAttachment } from '../types';
import FeedFilters, { FeedFilterState } from './FeedFilters';

// Mock current user ID (in real app, this comes from auth context)
const CURRENT_USER_ID = 'm1';

// Preset interface for quick filter tabs
interface QuickPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  showInQuickTabs: boolean; // Whether to show as quick tab on Feeds screen
  isPredefined: boolean;
  // Filter function - returns true if item matches preset
  filterFn: (item: FeedItem, currentUserId: string) => boolean;
}

// Predefined + Custom presets (in real app, custom presets would be persisted)
const DEFAULT_PRESETS: QuickPreset[] = [
  {
    id: 'mine',
    name: 'Mine',
    icon: null,
    description: 'Items created by you or assigned to you',
    showInQuickTabs: true,
    isPredefined: true,
    filterFn: (item, userId) => item.createdBy.id === userId || item.assignee.id === userId || (item.ccRecipients?.some(cc => cc.id === userId) ?? false),
  },
  {
    id: 'my-submittals',
    name: 'My Submittals',
    icon: <Layers size={12} />,
    description: 'Submittals created by me',
    showInQuickTabs: false, // Not shown by default
    isPredefined: false,
    filterFn: (item, userId) => item.type === 'Submittal' && item.createdBy.id === userId,
  },
  {
    id: 'open-issues',
    name: 'Open Issues',
    icon: <AlertTriangle size={12} />,
    description: 'All open issues',
    showInQuickTabs: false,
    isPredefined: false,
    filterFn: (item) => item.type === 'Issue' && ['Opened', 'ReOpened'].includes(item.status),
  },
];

interface FeedsViewProps {
  onSelectFeed: (item: FeedItem) => void;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  Submittal: <Layers size={12} />,
  Issue: <AlertTriangle size={12} />,
  RFS: <FileInput size={12} />,
};

const TYPE_COLORS: Record<string, string> = {
  Submittal: 'bg-slate-50 text-slate-600 border-slate-100',
  Issue: 'bg-slate-50 text-slate-600 border-slate-100',
  RFS: 'bg-slate-50 text-slate-600 border-slate-100',
};

const now = Date.now();

const feedItems: FeedItem[] = [
  {
    id: 'f1',
    refNo: '0001',
    type: 'Submittal',
    title: 'Electrical Panel Shop Drawings for Phase 2 Main Distribution and Emergency Backup Systems',
    description: 'Shop drawings for the main electrical distribution panels including emergency backup systems for Building A, Floors 1-10. These drawings include single-line diagrams, panel schedules, and installation details.',
    project: 'Nova Research Lab',
    status: 'Submitted',
    assignee: { id: 'u2', name: 'James Wilson', stakeholder: 'AR' },
    discipline: 'Electrical',
    submissionType: 'Shop Drawing',
    dueDate: 'Feb 15, 2026',
    tags: ['Electrical', 'Phase-2'],
    attachments: [
      { id: 'a1', name: 'DWG_EL_P1.pdf', type: 'pdf', size: '4.2 MB' },
      { id: 'a2', name: 'Site_Photo_01.jpg', type: 'image', size: '1.1 MB', url: 'https://picsum.photos/seed/elec1/400/300' },
    ],
    createdAt: '2 hours ago',
    createdBy: { id: 'm1', name: 'Saski Amora', stakeholder: 'MC' },
    visibility: 'private',
    revision: 1,
    ccRecipients: [
      { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
      { id: 'm5', name: 'David Chen', stakeholder: 'EE' },
      { id: 'u6', name: 'Michael Torres', stakeholder: 'SE' },
    ],
    stream: [
      { kind: 'activity', data: { id: 'act-1', userId: 'm1', userName: 'Saski Amora', userStakeholder: 'MC', action: 'submit', statusKey: 'Submitted', timestamp: '2 hours ago', description: 'Submitted shop drawings for electrical layout Phase 2. Please review cable tray routing and clearances.', attachments: [
        { id: 'att-1', name: 'DWG_EL_P2_REV1.pdf', type: 'pdf', size: '4.2 MB' },
        { id: 'att-2', name: 'Cable_Tray_Photo.jpg', type: 'image', size: '1.8 MB', url: 'https://picsum.photos/seed/cable1/400/300' },
      ] } },
      { kind: 'comment', data: { id: 'c1', userId: 'm3', userName: 'James Wilson', userStakeholder: 'AR', text: 'Please verify the working space requirements. I noticed some conflicts with the architectural ceiling layout.', timestamp: '1 hour ago', timestampMs: now - 3600000, attachments: [
        { id: 'att-3', name: 'Ceiling_Layout_Conflict.jpg', type: 'image', size: '2.1 MB', url: 'https://picsum.photos/seed/ceiling1/400/300' },
      ] } },
      { kind: 'comment', data: { id: 'c2', userId: 'm4', userName: 'Elena Rodriguez', userStakeholder: 'ME', text: 'The HVAC routing conflicts with the cable tray. See attached clash report and photo from site.', timestamp: '45 min ago', timestampMs: now - 2700000, attachments: [
        { id: 'att-4', name: 'Clash_Report_MEP.pdf', type: 'pdf', size: '1.5 MB' },
        { id: 'att-5', name: 'Site_Clash_Photo.jpg', type: 'image', size: '2.3 MB', url: 'https://picsum.photos/seed/clash1/400/300' },
      ] } },
    ],
  },
  {
    id: 'f2',
    refNo: '0002',
    type: 'Issue',
    title: 'Plumbing Leak Detected in Room 302 Ceiling Void - Immediate Action Required',
    description: 'Water leak observed dripping from ceiling void in Room 302.',
    project: 'Kala Corporate HQ',
    status: 'Closed',
    assignee: { id: 'm2', name: 'Kenneth Alanda', stakeholder: 'MC' },
    discipline: 'Plumbing',
    submissionType: 'Defect Report',
    dueDate: 'Feb 5, 2026',
    tags: ['Plumbing', 'Defect', 'Urgent'],
    attachments: [
      { id: 'a3', name: 'leak_photo_1.jpg', type: 'image', size: '2.3 MB', url: 'https://picsum.photos/seed/leak1/400/300' },
      { id: 'a4', name: 'leak_photo_2.jpg', type: 'image', size: '1.8 MB', url: 'https://picsum.photos/seed/leak2/400/300' },
      { id: 'a5', name: 'leak_wide.jpg', type: 'image', size: '2.1 MB', url: 'https://picsum.photos/seed/leak3/400/300' },
    ],
    createdAt: '5 hours ago',
    createdBy: { id: 'm2', name: 'Kenneth Alanda', stakeholder: 'MC' },
    revision: 1,
    ccRecipients: [
      { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
    ],
    stream: [
      { kind: 'activity', data: { id: 'act-2', userId: 'm2', userName: 'Kenneth Alanda', userStakeholder: 'MC', action: 'open', statusKey: 'Opened', timestamp: '5 hours ago', description: 'Reported plumbing leak detected during morning site inspection. Water dripping from ceiling void in Room 302.', attachments: [
        { id: 'att-6', name: 'leak_evidence_1.jpg', type: 'image', size: '2.3 MB', url: 'https://picsum.photos/seed/leak1/400/300' },
        { id: 'att-7', name: 'leak_evidence_2.jpg', type: 'image', size: '1.8 MB', url: 'https://picsum.photos/seed/leak2/400/300' },
      ] } },
      { kind: 'comment', data: { id: 'c3', userId: 'm4', userName: 'Elena Rodriguez', userStakeholder: 'ME', text: 'Investigated the source. The leak is from a faulty joint in the chilled water pipe. Repair team dispatched.', timestamp: '3 hours ago', timestampMs: now - 10800000 } },
      { kind: 'activity', data: { id: 'act-3', userId: 'm2', userName: 'Kenneth Alanda', userStakeholder: 'MC', action: 'close', statusKey: 'Closed', timestamp: '1 hour ago', description: 'Issue resolved. Pipe joint repaired and pressure tested. No further leaks detected.', attachments: [
        { id: 'att-8', name: 'Repair_Completion_Report.pdf', type: 'pdf', size: '890 KB' },
        { id: 'att-9', name: 'pressure_test_result.jpg', type: 'image', size: '1.2 MB', url: 'https://picsum.photos/seed/ptest1/400/300' },
      ] } },
    ],
  },
  {
    id: 'f3',
    refNo: '0003',
    type: 'Submittal',
    title: 'Exterior Glazing Samples - Reflected Sun-Lite Tint Finish for Main Entrance Facade',
    description: 'Material approval submission for exterior glazing with reflective coating for solar heat gain control.',
    project: 'Kala Corporate HQ',
    status: 'Approved_B',
    assignee: { id: 'm3', name: 'James Wilson', stakeholder: 'AR' },
    discipline: 'Architectural',
    submissionType: 'Material Approval',
    dueDate: 'Feb 20, 2026',
    tags: ['Facade', 'Architectural'],
    attachments: [
      { id: 'a6', name: 'Glazing_Spec_v3.pdf', type: 'pdf', size: '8.5 MB' },
      { id: 'a7', name: 'Color_Samples.jpg', type: 'image', size: '3.2 MB', url: 'https://picsum.photos/seed/glaze1/400/300' },
    ],
    createdAt: 'Yesterday',
    createdBy: { id: 'm1', name: 'Saski Amora', stakeholder: 'MC' },
    visibility: 'restricted',
    revision: 3,
    ccRecipients: [
      { id: 'm2', name: 'Kenneth Alanda', stakeholder: 'MC' },
      { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
      { id: 'm5', name: 'David Chen', stakeholder: 'EE' },
      { id: 'u6', name: 'Michael Torres', stakeholder: 'SE' },
      { id: 'u7', name: 'Sarah Park', stakeholder: 'QS' },
    ],
    stream: [
      { kind: 'activity', data: { id: 'act-4', userId: 'm3', userName: 'James Wilson', userStakeholder: 'AR', action: 'submit', statusKey: 'Submitted', timestamp: 'Yesterday 9:00 AM' } },
      { kind: 'activity', data: { id: 'act-5', userId: 'm1', userName: 'Saski Amora', userStakeholder: 'MC', action: 'approve_b', statusKey: 'Approved_B', timestamp: 'Yesterday 5:00 PM' } },
    ],
  },
  {
    id: 'f4',
    refNo: '0004',
    type: 'RFS',
    title: 'Request: Updated HVAC Ductwork Layout for Building B Tower Levels',
    description: 'Requesting updated ductwork layout drawings for coordination with structural beams.',
    project: 'Kala Corporate HQ',
    status: 'InProgress',
    assignee: { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
    discipline: 'Mechanical',
    submissionType: 'Method Statement',
    dueDate: 'Feb 12, 2026',
    tags: ['HVAC', 'Coordination'],
    attachments: [
      { id: 'a8', name: 'Ductwork_Layout_Current.pdf', type: 'pdf', size: '5.1 MB' },
    ],
    createdAt: '3 hours ago',
    createdBy: { id: 'm1', name: 'Saski Amora', stakeholder: 'MC' },
    revision: 2,
    ccRecipients: [
      { id: 'm3', name: 'James Wilson', stakeholder: 'AR' },
    ],
    stream: [
      { kind: 'activity', data: { id: 'act-6', userId: 'm1', userName: 'Saski Amora', userStakeholder: 'MC', action: 'submit', statusKey: 'Submitted', timestamp: '3 hours ago' } },
      { kind: 'comment', data: { id: 'c6', userId: 'm4', userName: 'Elena Rodriguez', userStakeholder: 'ME', text: 'Working on the revised layout.', timestamp: '2 hours ago', timestampMs: now - 7200000 } },
    ],
  },
  {
    id: 'f5',
    refNo: '0005',
    type: 'Submittal',
    title: 'Fire Alarm System Riser Diagram - Building A Complete',
    description: 'Complete fire alarm riser diagram for Building A including device locations and wiring schedules.',
    project: 'Nova Research Lab',
    status: 'Rejected',
    assignee: { id: 'm3', name: 'James Wilson', stakeholder: 'AR' },
    discipline: 'Electrical',
    submissionType: 'Shop Drawing',
    dueDate: 'Feb 8, 2026',
    tags: ['Fire-Protection', 'Electrical'],
    attachments: [
      { id: 'a9', name: 'Fire_Alarm_Riser.pdf', type: 'pdf', size: '6.7 MB' },
      { id: 'a10', name: 'Device_Schedule.pdf', type: 'pdf', size: '1.4 MB' },
    ],
    createdAt: '6 hours ago',
    createdBy: { id: 'm5', name: 'David Chen', stakeholder: 'EE' },
    visibility: 'both',
    revision: 2,
    ccRecipients: [
      { id: 'm1', name: 'Saski Amora', stakeholder: 'MC' },
      { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
    ],
    stream: [
      { kind: 'activity', data: { id: 'act-8', userId: 'm5', userName: 'David Chen', userStakeholder: 'EE', action: 'submit', statusKey: 'Submitted', timestamp: '6 hours ago' } },
      { kind: 'activity', data: { id: 'act-9', userId: 'm3', userName: 'James Wilson', userStakeholder: 'AR', action: 'reject_c', statusKey: 'Rejected', timestamp: '3 hours ago' } },
    ],
  },
  {
    id: 'f6',
    refNo: '0006',
    type: 'Issue',
    title: 'Concrete Crack Found on Level 5 Slab Near Expansion Joint',
    description: 'Visible crack approximately 3m long discovered during walkthrough near expansion joint.',
    project: 'Nova Research Lab',
    status: 'Opened',
    assignee: { id: 'u6', name: 'Michael Torres', stakeholder: 'SE' },
    discipline: 'Structural',
    submissionType: 'Defect Report',
    dueDate: 'Feb 10, 2026',
    tags: ['Structural', 'Defect'],
    attachments: [
      { id: 'a11', name: 'crack_photo_1.jpg', type: 'image', size: '3.1 MB', url: 'https://picsum.photos/seed/crack1/400/300' },
      { id: 'a12', name: 'crack_photo_2.jpg', type: 'image', size: '2.8 MB', url: 'https://picsum.photos/seed/crack2/400/300' },
      { id: 'a13', name: 'crack_detail.jpg', type: 'image', size: '2.5 MB', url: 'https://picsum.photos/seed/crack3/400/300' },
      { id: 'a14', name: 'crack_wide.jpg', type: 'image', size: '2.9 MB', url: 'https://picsum.photos/seed/crack4/400/300' },
      { id: 'a15', name: 'location_marked.pdf', type: 'pdf', size: '1.5 MB' },
    ],
    createdAt: '30 min ago',
    createdBy: { id: 'm5', name: 'David Chen', stakeholder: 'MC' },
    revision: 1,
    stream: [
      { kind: 'activity', data: { id: 'act-10', userId: 'm5', userName: 'David Chen', userStakeholder: 'MC', action: 'open', statusKey: 'Opened', timestamp: '30 min ago' } },
      { kind: 'comment', data: { id: 'c8', userId: 'm3', userName: 'James Wilson', userStakeholder: 'AR', text: 'Will arrange structural assessment.', timestamp: '15 min ago', timestampMs: now - 900000 } },
    ],
  },
  {
    id: 'f7',
    refNo: '0007',
    type: 'Issue',
    title: 'Missing Fire Dampers on Level 3 Mechanical Shaft',
    description: 'Fire dampers required at shaft penetrations were not installed as per fire safety requirements.',
    project: 'Kala Corporate HQ',
    status: 'Done',
    assignee: { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
    discipline: 'Mechanical',
    submissionType: 'Compliance Issue',
    dueDate: 'Feb 7, 2026',
    tags: ['Fire-Safety', 'MEP', 'Compliance'],
    attachments: [
      { id: 'a16', name: 'damper_locations.pdf', type: 'pdf', size: '890 KB' },
    ],
    createdAt: '1 day ago',
    createdBy: { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
    revision: 1,
    ccRecipients: [
      { id: 'm2', name: 'Kenneth Alanda', stakeholder: 'MC' },
      { id: 'm3', name: 'James Wilson', stakeholder: 'AR' },
    ],
    stream: [
      { kind: 'activity', data: { id: 'act-11', userId: 'm4', userName: 'Elena Rodriguez', userStakeholder: 'ME', action: 'open', statusKey: 'Opened', timestamp: '1 day ago' } },
      { kind: 'activity', data: { id: 'act-12', userId: 'm4', userName: 'Elena Rodriguez', userStakeholder: 'ME', action: 'complete', statusKey: 'Done', timestamp: '4 hours ago' } },
    ],
  },
];

// Extract unique values for filters
const FILTER_OPTIONS = {
  types: ['Submittal', 'Issue', 'RFS'],
  disciplines: [...new Set(feedItems.map(i => i.discipline).filter(Boolean))] as string[],
  packages: ['Structural Works', 'MEP Services', 'Architectural Finishes', 'Facade & Curtain Wall'],
  creators: [...new Map(feedItems.map(i => [i.createdBy.id, i.createdBy])).values()],
  assignees: [...new Map(feedItems.map(i => [i.assignee.id, i.assignee])).values()],
  statuses: [...new Set(feedItems.map(i => i.status))],
};


// File type configuration with colors and icons
const FILE_TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pdf: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'PDF' },
  doc: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'DOC' },
  docx: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'DOCX' },
  xls: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'XLS' },
  xlsx: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'XLSX' },
  dwg: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'DWG' },
  image: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'IMG' },
};

const getFileTypeConfig = (filename: string, type: string) => {
  if (type === 'image') return FILE_TYPE_CONFIG.image;
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return FILE_TYPE_CONFIG[ext] || FILE_TYPE_CONFIG.pdf;
};

// Enhanced Photo Grid Component with responsive aspect-ratio
// Layouts: 1 photo (hero), 2 photos (side-by-side), 3 photos (1 large + 2 stacked), 4+ photos (2x2 grid)
const PhotoGrid: React.FC<{ photos: FeedAttachment[]; maxShow?: number }> = ({ photos, maxShow = 4 }) => {
  if (photos.length === 0) return null;

  const displayPhotos = photos.slice(0, maxShow);
  const remaining = photos.length - maxShow;

  // Single photo - full width hero with 16:9 aspect ratio
  if (displayPhotos.length === 1) {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer">
        <div className="relative aspect-[16/9]">
          <img
            src={displayPhotos[0].url || `https://picsum.photos/seed/${displayPhotos[0].id}/400/225`}
            alt={displayPhotos[0].name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Bottom info bar */}
          <div className="absolute bottom-0 inset-x-0 p-3 flex items-end justify-between">
            <p className="text-[10px] font-bold text-white/90 truncate max-w-[70%]">{displayPhotos[0].name}</p>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
              <ImageIcon size={10} className="text-white" />
              <span className="text-[9px] font-black text-white">1</span>
            </div>
          </div>
          {/* Tap to view indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-[10px] font-bold text-white">Tap to view</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2 photos - side by side with 4:3 aspect each (balanced layout)
  if (displayPhotos.length === 2) {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group cursor-pointer">
        <div className="grid grid-cols-2 gap-0.5">
          {displayPhotos.map((photo) => (
            <div key={photo.id} className="relative aspect-[4/3] overflow-hidden">
              <img
                src={photo.url || `https://picsum.photos/seed/${photo.id}/200/150`}
                alt={photo.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
        {/* Photo count badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
          <ImageIcon size={10} className="text-white" />
          <span className="text-[9px] font-black text-white">2</span>
        </div>
      </div>
    );
  }

  // 3 photos - 1 large left + 2 stacked right (Instagram-style)
  if (displayPhotos.length === 3) {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group cursor-pointer">
        <div className="grid grid-cols-2 gap-0.5" style={{ aspectRatio: '16/9' }}>
          {/* Large photo on left - takes full height */}
          <div className="relative overflow-hidden row-span-2">
            <img
              src={displayPhotos[0].url || `https://picsum.photos/seed/${displayPhotos[0].id}/200/225`}
              alt={displayPhotos[0].name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 pointer-events-none" />
          </div>
          {/* 2 stacked photos on right */}
          <div className="grid grid-rows-2 gap-0.5">
            {displayPhotos.slice(1).map((photo) => (
              <div key={photo.id} className="relative overflow-hidden">
                <img
                  src={photo.url || `https://picsum.photos/seed/${photo.id}/200/112`}
                  alt={photo.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Photo count badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
          <ImageIcon size={10} className="text-white" />
          <span className="text-[9px] font-black text-white">3</span>
        </div>
      </div>
    );
  }

  // 4 photos - 2x2 balanced grid (clean, symmetric)
  if (displayPhotos.length === 4 && remaining === 0) {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group cursor-pointer">
        <div className="grid grid-cols-2 gap-0.5">
          {displayPhotos.map((photo) => (
            <div key={photo.id} className="relative aspect-[4/3] overflow-hidden">
              <img
                src={photo.url || `https://picsum.photos/seed/${photo.id}/200/150`}
                alt={photo.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
        {/* Photo count badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
          <ImageIcon size={10} className="text-white" />
          <span className="text-[9px] font-black text-white">4</span>
        </div>
      </div>
    );
  }

  // 5+ photos - 2x2 grid with +N overlay on last photo
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group cursor-pointer">
      <div className="grid grid-cols-2 gap-0.5">
        {displayPhotos.slice(0, 4).map((photo, idx) => (
          <div key={photo.id} className="relative aspect-[4/3] overflow-hidden">
            <img
              src={photo.url || `https://picsum.photos/seed/${photo.id}/200/150`}
              alt={photo.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            {/* Show +N overlay on last visible photo if more remain */}
            {idx === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                <div className="text-center">
                  <span className="text-white text-xl font-black">+{remaining}</span>
                  <p className="text-white/80 text-[9px] font-medium mt-0.5">more</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Photo count badge */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
        <ImageIcon size={10} className="text-white" />
        <span className="text-[9px] font-black text-white">{photos.length}</span>
      </div>
      {/* View all hint on hover */}
      <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-sm">
          <span className="text-[9px] font-bold text-slate-600">View all {photos.length}</span>
          <ChevronRight size={10} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
};

// File Badge Component for non-image attachments
const FileBadges: React.FC<{ files: FeedAttachment[] }> = ({ files }) => {
  if (files.length === 0) return null;

  // Group files by type
  const filesByType = files.reduce((acc, file) => {
    const config = getFileTypeConfig(file.name, file.type);
    const key = config.label;
    if (!acc[key]) acc[key] = { config, count: 0 };
    acc[key].count++;
    return acc;
  }, {} as Record<string, { config: typeof FILE_TYPE_CONFIG.pdf; count: number }>);

  return (
    <div className="flex gap-1.5 flex-wrap">
      {Object.entries(filesByType).map(([type, { config, count }]) => (
        <div
          key={type}
          className={`flex items-center gap-1.5 ${config.bg} ${config.text} px-2 py-1 rounded-lg border border-opacity-50`}
          style={{ borderColor: 'currentColor' }}
        >
          <FileText size={11} />
          <span className="text-[10px] font-black">{count}</span>
          <span className="text-[9px] font-bold opacity-70">{type}</span>
        </div>
      ))}
    </div>
  );
};

const FeedsView: React.FC<FeedsViewProps> = ({ onSelectFeed }) => {
  const [activePresetId, setActivePresetId] = useState<string | null>(null); // null = "All"
  const [presets, setPresets] = useState<QuickPreset[]>(DEFAULT_PRESETS);
  const [showPresetConfig, setShowPresetConfig] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FeedFilterState>({
    types: [],
    disciplines: [],
    packages: [],
    creators: [],
    assignees: [],
    statuses: [],
    severities: [],
    locations: [],
  });

  const totalAdvancedFilters = Object.values(advancedFilters).reduce((sum, arr) => sum + arr.length, 0);

  // Get presets that should show as quick tabs
  const visiblePresets = presets.filter(p => p.showInQuickTabs);

  // Toggle preset visibility in quick tabs
  const togglePresetVisibility = (presetId: string) => {
    setPresets(prev => prev.map(p =>
      p.id === presetId ? { ...p, showInQuickTabs: !p.showInQuickTabs } : p
    ));
  };

  const filteredItems = useMemo(() => {
    let items = feedItems;

    // Apply active preset filter
    if (activePresetId) {
      const activePreset = presets.find(p => p.id === activePresetId);
      if (activePreset) {
        items = items.filter(item => activePreset.filterFn(item, CURRENT_USER_ID));
      }
    }

    // Advanced filters
    if (advancedFilters.types.length > 0) {
      items = items.filter(item => advancedFilters.types.includes(item.type));
    }
    if (advancedFilters.disciplines.length > 0) {
      items = items.filter(item => item.discipline && advancedFilters.disciplines.includes(item.discipline));
    }
    if (advancedFilters.creators.length > 0) {
      items = items.filter(item => advancedFilters.creators.includes(item.createdBy.id));
    }
    if (advancedFilters.assignees.length > 0) {
      items = items.filter(item => advancedFilters.assignees.includes(item.assignee.id));
    }
    if (advancedFilters.statuses.length > 0) {
      items = items.filter(item => advancedFilters.statuses.includes(item.status));
    }

    return items;
  }, [activePresetId, presets, advancedFilters]);

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      types: [],
      disciplines: [],
      packages: [],
      creators: [],
      assignees: [],
      statuses: [],
      severities: [],
      locations: [],
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 pb-24">
        {/* Header - Item count + Filter */}
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </p>
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all active:scale-95 ${
              totalAdvancedFilters > 0
                ? 'bg-[#3b82f6] text-white'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
            }`}
          >
            <Filter size={14} />
            <span className="text-[11px] font-black uppercase">
              {totalAdvancedFilters > 0 ? totalAdvancedFilters : 'Filter'}
            </span>
          </button>
        </div>

        {/* Quick Filter Tabs - Sticky below project bar */}
        <div
          className="sticky z-30 bg-[#faf9f6] dark:bg-slate-900 -mx-4 px-4 py-2 transition-colors"
          style={{ top: '46px', transform: 'translateZ(0)', willChange: 'transform' }}
        >
          <div className="flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Quick filters">
            {/* All tab - always visible */}
            <button
              onClick={() => setActivePresetId(null)}
              role="tab"
              aria-selected={activePresetId === null}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-tight
                whitespace-nowrap active:scale-95 transition-colors
                ${activePresetId === null
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
                }
              `}
            >
              All
            </button>

            {/* Dynamic preset tabs */}
            {visiblePresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => setActivePresetId(activePresetId === preset.id ? null : preset.id)}
                role="tab"
                aria-selected={activePresetId === preset.id}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-tight
                  whitespace-nowrap active:scale-95 transition-colors
                  ${activePresetId === preset.id
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
                  }
                `}
              >
                {preset.icon}
                {preset.name}
              </button>
            ))}

            {/* Config button to manage presets */}
            <button
              onClick={() => setShowPresetConfig(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 active:scale-95 flex-shrink-0 transition-colors"
              aria-label="Configure quick filter tabs"
            >
              <Settings2 size={14} />
            </button>
          </div>
        </div>

        {/* Feed List */}
        <div className="flex flex-col gap-4 animate-stagger">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 rounded-[2rem] flex items-center justify-center mb-3 bg-slate-100 text-slate-400">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-700 mb-1.5">No items match your filters</h3>
              <p className="text-[13px] text-slate-400 max-w-[240px] leading-relaxed">
                Try adjusting your search or filter criteria
              </p>
              {totalAdvancedFilters > 0 && (
                <button
                  onClick={clearAdvancedFilters}
                  className="mt-5 inline-flex items-center justify-center gap-2 font-bold px-4 py-2.5 rounded-xl text-sm bg-[#3b82f6] text-white hover:bg-[#2563eb] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item) => {
              // Get last activity from stream
              const lastActivity = item.stream[item.stream.length - 1];
              const lastActivityData = lastActivity?.data;

              // Get attachments from LAST activity (not original submission)
              const lastActivityAttachments = lastActivityData?.attachments || [];
              const lastPhotos = lastActivityAttachments.filter((a: FeedAttachment) => a.type === 'image');

              // Total counts (all attachments across all activities)
              const allPhotos = item.attachments.filter(a => a.type === 'image');
              const allFiles = item.attachments.filter(a => a.type !== 'image');

              const commentCount = item.stream.filter(s => s.kind === 'comment').length;
              const activityCount = item.stream.filter(s => s.kind === 'activity').length;
              const statusConfig = getStatusConfig(item.type, item.status);

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectFeed(item)}
                  aria-label={`${item.type}: ${item.title}`}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-200 active:scale-[0.98] hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 cursor-pointer"
                >
                  {/* Row 1: Status + Visibility + Time - inline, no box */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={{ color: statusConfig.color, backgroundColor: `${statusConfig.color}15` }}
                    >
                      {statusConfig.label}
                    </span>
                    {(item.visibility === 'private' || item.visibility === 'both') && (
                      <Lock size={10} className="text-slate-400 dark:text-slate-500" />
                    )}
                    {(item.visibility === 'restricted' || item.visibility === 'both') && (
                      <EyeOff size={10} className="text-slate-400 dark:text-slate-500" />
                    )}
                    {item.revision && item.revision > 1 && (
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                        <GitBranch size={9} />
                        R{item.revision}
                      </span>
                    )}
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 ml-auto flex items-center gap-1">
                      <Clock size={9} />
                      {item.createdAt}
                    </span>
                  </div>

                  {/* Row 2: Title - prominent */}
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[14px] leading-snug mb-1.5 line-clamp-2">
                    <span className="font-black text-slate-500">#{item.refNo}</span>
                    <span className="text-slate-200 dark:text-slate-600 mx-1">·</span>
                    {item.title}
                  </h3>

                  {/* Row 3: Compact user flow - no background boxes */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                    <img
                      src={`https://picsum.photos/seed/${item.createdBy.id}/100`}
                      className="w-4 h-4 rounded-full"
                      alt=""
                    />
                    <span className="font-medium">{item.createdBy.name.split(' ')[0]}</span>
                    <span className="text-slate-300 dark:text-slate-600">→</span>
                    <img
                      src={`https://picsum.photos/seed/${item.assignee.id}/100`}
                      className="w-4 h-4 rounded-full"
                      alt=""
                    />
                    <span className="font-medium">{item.assignee.name.split(' ')[0]}</span>

                    {/* Inline stats - no box */}
                    <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                    <MessageSquare size={10} />
                    <span>{activityCount + commentCount}</span>

                    {/* CC count inline */}
                    {item.ccRecipients && item.ccRecipients.length > 0 && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                        <Send size={10} />
                        <span>{item.ccRecipients.length}</span>
                      </>
                    )}
                  </div>

                  {/* Row 4: Latest activity text - simple, no box */}
                  {lastActivityData && (lastActivity.kind === 'comment' ? lastActivityData.text : lastActivityData.description) && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed border-l-2 border-slate-200 dark:border-slate-600 pl-2.5">
                      <span className="font-medium text-slate-600 dark:text-slate-300">{lastActivityData.userName.split(' ')[0]}:</span>{' '}
                      {lastActivity.kind === 'comment' ? lastActivityData.text : lastActivityData.description}
                    </p>
                  )}

                  {/* Row 5: Photos - clean grid, minimal chrome */}
                  {lastPhotos.length > 0 && (
                    <div className="mb-2">
                      <PhotoGrid photos={lastPhotos} maxShow={4} />
                    </div>
                  )}

                  {/* Row 6: Footer - inline stats, no border-top box */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-3">
                      {allFiles.length > 0 && (
                        <span className="flex items-center gap-1">
                          <FileText size={10} className="text-slate-400" />
                          {allFiles.length}
                        </span>
                      )}
                      {allPhotos.length > 0 && (
                        <span className="flex items-center gap-1">
                          <ImageIcon size={10} className="text-slate-400" />
                          {allPhotos.length}
                        </span>
                      )}
                    </div>
                    <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <FeedFilters
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={advancedFilters}
        onApply={setAdvancedFilters}
        options={FILTER_OPTIONS}
      />

      {/* Preset Configuration Modal */}
      {showPresetConfig && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-end justify-center animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-t-[2rem] animate-in slide-in-from-bottom duration-300 transition-colors"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Settings2 size={18} className="text-slate-600 dark:text-slate-300" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Quick Tabs</h3>
              </div>
              <button
                onClick={() => setShowPresetConfig(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors"
              >
                <X size={16} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
              <p className="text-[11px] text-slate-400 mb-4">
                Choose which presets to show as quick filter tabs on the Feeds screen.
              </p>

              <div className="space-y-2">
                {presets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => togglePresetVisibility(preset.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-[0.98] cursor-pointer ${
                      preset.showInQuickTabs
                        ? 'bg-blue-50 border-2 border-[#3b82f6]'
                        : 'bg-white border border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Toggle indicator */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                        preset.showInQuickTabs
                          ? 'bg-[#3b82f6] border-[#3b82f6]'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {preset.showInQuickTabs && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Preset icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        preset.showInQuickTabs ? 'bg-[#3b82f6] text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {preset.icon}
                    </div>

                    {/* Preset info */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-[13px] font-bold ${preset.showInQuickTabs ? 'text-[#3b82f6]' : 'text-slate-700'}`}>
                          {preset.name}
                        </p>
                        {preset.isPredefined && (
                          <span className="text-[8px] font-black uppercase tracking-tight text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                            System
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{preset.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Info text */}
              <p className="text-[10px] text-slate-300 mt-4 text-center">
                Tap a preset to show/hide it from quick tabs
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedsView;
