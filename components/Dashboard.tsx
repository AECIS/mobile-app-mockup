
import React from 'react';
import StatCard from './StatCard';
import AIPanel from './AIPanel';
import { Layers, AlertTriangle, CheckCircle2, AlertCircle, Clock, ChevronRight, FileText, Image as ImageIcon, FileInput, MessageSquare, GitBranch, Lock, Users, Send, Flame } from 'lucide-react';
import { Reminder, FeedUser, getStatusConfig, FeedAttachment, StakeholderType } from '../types';

// Urgency levels for timeline
type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

const URGENCY_CONFIG: Record<UrgencyLevel, { color: string; bgColor: string; borderColor: string; label: string; icon: React.ReactNode }> = {
  critical: { color: '#D2222D', bgColor: 'bg-red-50', borderColor: 'border-l-red-500', label: 'Overdue', icon: <Flame size={10} /> },
  high: { color: '#3b82f6', bgColor: 'bg-blue-50', borderColor: 'border-l-blue-500', label: 'Action Required', icon: <AlertCircle size={10} /> },
  medium: { color: '#FFBF00', bgColor: 'bg-amber-50', borderColor: 'border-l-amber-400', label: 'In Review', icon: <Clock size={10} /> },
  low: { color: '#2C7ABB', bgColor: 'bg-blue-50', borderColor: 'border-l-blue-400', label: 'Pending', icon: <Clock size={10} /> },
};

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bgColor: string; borderColor: string }> = {
  Submittal: { icon: <Layers size={12} />, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-100' },
  Issue: { icon: <AlertTriangle size={12} />, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-100' },
  RFS: { icon: <FileInput size={12} />, color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-100' },
};

const Dashboard: React.FC = () => {
  interface CriticalItem extends Reminder {
    refNo: string;
    project?: string;
    description?: string;
    urgency: UrgencyLevel;
    createdBy: FeedUser;
    assignedTo: FeedUser;
    itemStatus: string; // Status key for getStatusConfig
    revision?: number;
    updateCount?: number;
    visibility?: 'public' | 'private' | 'restricted' | 'both';
    ccRecipients?: FeedUser[];
    lastActivity?: { userId: string; userName: string; userStakeholder: StakeholderType; text: string; timestamp: string; isComment: boolean };
  }

  const criticalItems: CriticalItem[] = [
    {
      id: '2',
      refNo: '0002',
      title: 'Safety Violation: Level 4 Perimeter Guardrail Missing in Sector B-12',
      description: 'Safety inspection revealed missing guardrails on perimeter of Level 4.',
      category: 'Issue',
      date: 'Today',
      status: 'Overdue',
      itemStatus: 'Opened',
      urgency: 'critical',
      project: 'Kala Corporate HQ',
      assignees: ['https://picsum.photos/seed/u3/40'],
      createdBy: { id: 'u3', name: 'Kenneth Alanda', stakeholder: 'MC' },
      assignedTo: { id: 'u6', name: 'Michael Torres', stakeholder: 'SE' },
      revision: 1,
      updateCount: 3,
      visibility: 'private',
      ccRecipients: [
        { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
        { id: 'm5', name: 'David Chen', stakeholder: 'EE' },
      ],
      lastActivity: { userId: 'u6', userName: 'Michael Torres', userStakeholder: 'SE', text: 'Reviewing safety requirements for guardrail specifications.', timestamp: '30 min ago', isComment: true },
      attachments: [
        { name: 'SITE_PHOTO_S4.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=200' }
      ]
    },
    {
      id: '1',
      refNo: '0001',
      title: 'Structural Approval for Level 4 Cantilevered Slab and Tension Cables',
      description: 'Structural drawings require approval for cantilevered slab design.',
      category: 'Submittal',
      date: '11 Sept 2025',
      status: 'Action Required',
      itemStatus: 'Submitted',
      urgency: 'high',
      project: 'Nova Research Lab',
      assignees: ['https://picsum.photos/seed/u1/40', 'https://picsum.photos/seed/u2/40'],
      createdBy: { id: 'u1', name: 'Saski Amora', stakeholder: 'MC' },
      assignedTo: { id: 'u2', name: 'James Wilson', stakeholder: 'AR' },
      revision: 2,
      updateCount: 5,
      visibility: 'restricted',
      ccRecipients: [
        { id: 'm4', name: 'Elena Rodriguez', stakeholder: 'ME' },
        { id: 'm5', name: 'David Chen', stakeholder: 'EE' },
        { id: 'u6', name: 'Michael Torres', stakeholder: 'SE' },
        { id: 'u7', name: 'Sarah Park', stakeholder: 'QS' },
      ],
      lastActivity: { userId: 'u2', userName: 'James Wilson', userStakeholder: 'AR', text: 'Please verify the cable tension calculations.', timestamp: '2 hours ago', isComment: true },
      attachments: [
        { name: 'SLAB_DET_V2_FINAL_REV.pdf', type: 'pdf' },
        { name: 'CABLE_TENSION_CALCS.pdf', type: 'pdf' },
        { name: 'PHOTO_A.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400&h=240' }
      ]
    },
    {
      id: '3',
      refNo: '0003',
      title: 'MEP Coordination: HVAC Duct Interference with Fire Sprinkler Main',
      description: 'HVAC duct routing conflicts with fire sprinkler main on Level 3.',
      category: 'Issue',
      date: 'Yesterday',
      status: 'In Review',
      itemStatus: 'Opened',
      urgency: 'medium',
      project: 'Kala Corporate HQ',
      assignees: ['https://picsum.photos/seed/u4/40', 'https://picsum.photos/seed/u5/40'],
      createdBy: { id: 'u4', name: 'Elena Rodriguez', stakeholder: 'ME' },
      assignedTo: { id: 'u2', name: 'James Wilson', stakeholder: 'AR' },
      revision: 1,
      updateCount: 2,
      ccRecipients: [
        { id: 'm2', name: 'Kenneth Alanda', stakeholder: 'MC' },
      ],
      lastActivity: { userId: 'u4', userName: 'Elena Rodriguez', userStakeholder: 'ME', text: 'Coordinating with fire protection team.', timestamp: '4 hours ago', isComment: true },
      attachments: [
        { name: 'MEP_CLASH_REPORT.pdf', type: 'pdf' }
      ]
    }
  ];

  const visibleItems = criticalItems.slice(0, 4);

  return (
    <div className="flex flex-col gap-4 py-2 pb-24">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Submittals"
          value={128}
          trend="~ 2.1%"
          subtext="+12 this week"
          icon={<Layers size={16} />}
        />
        <StatCard
          label="Open Issues"
          value={14}
          trend="~ 0.5%"
          subtext="+3 since yesterday"
          icon={<AlertTriangle size={16} />}
        />
        <StatCard
          label="Approved (A/B)"
          value={84}
          trend="~ 5.2%"
          subtext="+8 reviews done"
          icon={<CheckCircle2 size={16} />}
        />
        <StatCard
          label="Overdue items"
          value={3}
          trend="~ 1.1%"
          subtext="Requires attention"
          icon={<AlertCircle size={16} />}
        />
      </div>

      <AIPanel />

      {/* Critical Alerts - Timeline Pattern */}
      <section className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle size={18} className="text-red-500 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Critical Alerts</h2>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Requires immediate attention</p>
            </div>
          </div>
          <span className="bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full animate-pulse">
            {criticalItems.length}
          </span>
        </div>

        {/* Critical Items List - Matching Feed Card Structure */}
        <div className="space-y-3">
          {visibleItems.map((item) => {
            const imageCount = item.attachments?.filter(a => a.type === 'image').length || 0;
            const fileCount = (item.attachments?.length || 0) - imageCount;
            const statusConfig = getStatusConfig(item.category === 'Issue' ? 'Issue' : 'Submittal', item.itemStatus);
            const urgencyConfig = URGENCY_CONFIG[item.urgency];

            return (
              <button
                key={item.id}
                className="w-full bg-white dark:bg-slate-800/50 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-all active:scale-[0.98] text-left hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 cursor-pointer"
              >
                {/* PART 1: Header Row - Status + Urgency + Visibility + Time */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    {/* Status Badge */}
                    <span
                      className="inline-flex text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={{
                        color: statusConfig.color,
                        backgroundColor: `${statusConfig.color}20`
                      }}
                    >
                      {statusConfig.label}
                    </span>
                    {/* Urgency Badge */}
                    <span
                      className="inline-flex items-center gap-0.5 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                      style={{
                        color: urgencyConfig.color,
                        backgroundColor: `${urgencyConfig.color}15`,
                        border: `1px solid ${urgencyConfig.color}30`
                      }}
                    >
                      {urgencyConfig.icon}
                      {urgencyConfig.label}
                    </span>
                    {/* Private indicator */}
                    {(item.visibility === 'private' || item.visibility === 'both') && (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                        <Lock size={8} />
                      </span>
                    )}
                    {/* Restricted indicator */}
                    {(item.visibility === 'restricted' || item.visibility === 'both') && (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        <Users size={8} />
                      </span>
                    )}
                  </div>
                  {/* Updated Time */}
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock size={9} />
                    {item.date}
                  </span>
                </div>

                {/* PART 2: Title - prominent */}
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[14px] leading-snug mb-2 line-clamp-2">
                  <span className="text-[#3b82f6]">#{item.refNo}</span>
                  <span className="text-slate-200 dark:text-slate-600 mx-1">·</span>
                  {item.title}
                </h3>

                {/* PART 3: Compact user flow - inline, no boxes */}
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mb-3">
                  <img
                    src={`https://picsum.photos/seed/${item.createdBy.id}/100`}
                    className="w-4 h-4 rounded-full"
                    alt=""
                  />
                  <span className="font-medium">{item.createdBy.name.split(' ')[0]}</span>
                  <span className="text-slate-300 dark:text-slate-600">→</span>
                  <img
                    src={`https://picsum.photos/seed/${item.assignedTo.id}/100`}
                    className="w-4 h-4 rounded-full"
                    alt=""
                  />
                  <span className="font-medium">{item.assignedTo.name.split(' ')[0]}</span>

                  {/* Inline stats - no box */}
                  <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                  <MessageSquare size={10} />
                  <span>{item.updateCount || 0}</span>

                  {/* CC count inline */}
                  {item.ccRecipients && item.ccRecipients.length > 0 && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                      <Send size={10} />
                      <span>{item.ccRecipients.length}</span>
                    </>
                  )}

                  {/* Revision inline */}
                  {item.revision && item.revision > 1 && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                      <span className="text-violet-500 dark:text-violet-400 flex items-center gap-0.5">
                        <GitBranch size={9} />
                        R{item.revision}
                      </span>
                    </>
                  )}
                </div>

                {/* PART 4: Last Activity - simple quote style, no box */}
                {item.lastActivity && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed border-l-2 border-slate-200 dark:border-slate-600 pl-2.5">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.lastActivity.userName.split(' ')[0]}:</span>{' '}
                    {item.lastActivity.text}
                  </p>
                )}

                {/* Footer: Inline stats, no border-top */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-3">
                    {fileCount > 0 && (
                      <span className="flex items-center gap-1">
                        <FileText size={10} className="text-red-400" />
                        {fileCount}
                      </span>
                    )}
                    {imageCount > 0 && (
                      <span className="flex items-center gap-1">
                        <ImageIcon size={10} className="text-cyan-400" />
                        {imageCount}
                      </span>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                </div>
              </button>
            );
          })}
        </div>

        {/* View All */}
        {criticalItems.length > 4 && (
          <button className="w-full mt-2 py-2.5 text-slate-400 dark:text-slate-500 text-[11px] font-bold border-t border-slate-50 dark:border-slate-700 hover:text-[#3b82f6] transition-colors flex items-center justify-center gap-1">
            View all {criticalItems.length} alerts
            <ChevronRight size={12} />
          </button>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
