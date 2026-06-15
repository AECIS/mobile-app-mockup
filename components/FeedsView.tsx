
import React, { useState, useMemo } from 'react';
import { Layers, AlertTriangle, Filter } from 'lucide-react';
import { FeedItem } from '../types';
import FeedFilters, { FeedFilterState } from './FeedFilters';
import FeedCard from './feed-card';

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
  feedTypes?: FeedItem['type'][]; // Scope list to specific feed types (e.g. Issues vs Submittals)
}

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
        { id: 'att-9', name: 'pressure_test_01.jpg', type: 'image', size: '1.2 MB', url: 'https://picsum.photos/seed/ptest1/400/300' },
        { id: 'att-9b', name: 'pressure_test_02.jpg', type: 'image', size: '1.4 MB', url: 'https://picsum.photos/seed/ptest2/400/300' },
        { id: 'att-9c', name: 'repair_detail_01.jpg', type: 'image', size: '1.6 MB', url: 'https://picsum.photos/seed/ptest3/400/300' },
        { id: 'att-9d', name: 'repair_detail_02.jpg', type: 'image', size: '1.5 MB', url: 'https://picsum.photos/seed/ptest4/400/300' },
        { id: 'att-9e', name: 'repair_detail_03.jpg', type: 'image', size: '1.3 MB', url: 'https://picsum.photos/seed/ptest5/400/300' },
        { id: 'att-9f', name: 'site_after_repair.jpg', type: 'image', size: '1.7 MB', url: 'https://picsum.photos/seed/ptest6/400/300' },
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
      { kind: 'comment', data: { id: 'c8', userId: 'm3', userName: 'James Wilson', userStakeholder: 'AR', text: 'Will arrange a **structural assessment** ASAP — proceeding _today_.', timestamp: '15 min ago', timestampMs: now - 900000 } },
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

const FeedsView: React.FC<FeedsViewProps> = ({ onSelectFeed, feedTypes }) => {
  const [activePresetId, setActivePresetId] = useState<string | null>(null); // null = "All"
  const presets = DEFAULT_PRESETS;
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

  const totalAdvancedFilters = Object.values(advancedFilters).reduce<number>((sum, val) => sum + (Array.isArray(val) ? val.length : 0), 0);

  // Get presets that should show as quick tabs
  const visiblePresets = presets.filter(p => p.showInQuickTabs);

  const filteredItems = useMemo(() => {
    // Scope to requested feed types (e.g. Issues-only or Submittals-only)
    let items = feedTypes ? feedItems.filter(i => feedTypes.includes(i.type)) : feedItems;

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
  }, [activePresetId, presets, advancedFilters, feedTypes]);

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
      <div>
        {/* Quick filters + Filter button - single aligned row, sticky at top */}
        <div className="sticky top-0 z-30 bg-[#faf9f6] dark:bg-slate-900 -mx-3 px-3 py-2 mb-3 flex items-center gap-2 transition-colors">
          <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1" role="tablist" aria-label="Quick filters">
            {/* All tab - always visible */}
            <button
              onClick={() => setActivePresetId(null)}
              role="tab"
              aria-selected={activePresetId === null}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-tight
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
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-tight
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
          </div>

          {/* Filter button - aligned with quick filter pills */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap shrink-0 transition-colors active:scale-95 ${
              totalAdvancedFilters > 0
                ? 'bg-[#3b82f6] text-white'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
            }`}
          >
            <Filter size={14} />
            <span className="text-[11px] font-extrabold uppercase">
              {totalAdvancedFilters > 0 ? totalAdvancedFilters : 'Filter'}
            </span>
          </button>
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
            filteredItems.map((item) => (
              <FeedCard key={item.id} item={item} onSelect={onSelectFeed} />
            ))
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <FeedFilters
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={advancedFilters}
        onApply={setAdvancedFilters}
        feedTypes={feedTypes}
        options={FILTER_OPTIONS}
      />
    </>
  );
};

export default FeedsView;
