
import React, { useState } from 'react';
import {
  ChevronLeft, MoreVertical, FileText, Calendar, Download,
  Layers, AlertTriangle, MessageSquare, CheckCircle, Clock,
  Bell, BellOff, Check, Trash2, X, AtSign, Send
} from 'lucide-react';

interface NotificationsProps {
  onClose: () => void;
}

type NotificationType = 'submittal' | 'issue' | 'comment' | 'mention' | 'due' | 'approval' | 'file';
type NotificationFilter = 'all' | 'mentioned' | 'unread';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  timestampLabel: string;
  isRead: boolean;
  user?: {
    name: string;
    avatar: string;
    stakeholder?: string;
  };
  refNo?: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'mention',
    title: 'Mentioned in Comment',
    message: 'James Wilson mentioned you in a comment on Submittal #0001',
    timestamp: '2026-02-08T10:30:00',
    timestampLabel: '30 min ago',
    isRead: false,
    user: { name: 'James Wilson', avatar: 'u2', stakeholder: 'AR' },
    refNo: '0001',
  },
  {
    id: 'n2',
    type: 'approval',
    title: 'Submittal Approved',
    message: 'Your submittal "Exterior Glazing Samples" has been approved with comments',
    timestamp: '2026-02-08T09:00:00',
    timestampLabel: '2h ago',
    isRead: false,
    refNo: '0003',
  },
  {
    id: 'n3',
    type: 'issue',
    title: 'New Issue Assigned',
    message: 'You have been assigned to Issue #0006 - Concrete Crack on Level 5',
    timestamp: '2026-02-08T08:00:00',
    timestampLabel: '3h ago',
    isRead: false,
    user: { name: 'David Chen', avatar: 'm5', stakeholder: 'MC' },
    refNo: '0006',
  },
  {
    id: 'n4',
    type: 'due',
    title: 'Due Date Reminder',
    message: 'Submittal #0001 is due tomorrow at 5:00 PM',
    timestamp: '2026-02-08T07:00:00',
    timestampLabel: '4h ago',
    isRead: true,
    refNo: '0001',
  },
  {
    id: 'n5',
    type: 'comment',
    title: 'New Comment',
    message: 'Elena Rodriguez commented on RFS #0004',
    timestamp: '2026-02-07T16:00:00',
    timestampLabel: 'Yesterday',
    isRead: true,
    user: { name: 'Elena Rodriguez', avatar: 'm4', stakeholder: 'ME' },
    refNo: '0004',
  },
  {
    id: 'n6',
    type: 'file',
    title: 'File Uploaded',
    message: 'Kenneth Alanda uploaded a file to Issue #0002',
    timestamp: '2026-02-07T14:00:00',
    timestampLabel: 'Yesterday',
    isRead: true,
    user: { name: 'Kenneth Alanda', avatar: 'u3', stakeholder: 'MC' },
    refNo: '0002',
    attachment: { name: 'Repair_Report.pdf', size: '2.4 MB', type: 'pdf' },
  },
  {
    id: 'n7',
    type: 'submittal',
    title: 'Submittal Resubmitted',
    message: 'David Chen resubmitted Submittal #0005 for review',
    timestamp: '2026-02-06T11:00:00',
    timestampLabel: '2 days ago',
    isRead: true,
    user: { name: 'David Chen', avatar: 'm5', stakeholder: 'EE' },
    refNo: '0005',
  },
];

// Notification type configurations
const NOTIFICATION_CONFIG: Record<NotificationType, { icon: React.ReactNode; bg: string; iconColor: string }> = {
  submittal: { icon: <Layers size={18} />, bg: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-500 dark:text-blue-400' },
  issue: { icon: <AlertTriangle size={18} />, bg: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-500 dark:text-amber-400' },
  comment: { icon: <MessageSquare size={18} />, bg: 'bg-violet-50 dark:bg-violet-900/30', iconColor: 'text-violet-500 dark:text-violet-400' },
  mention: { icon: <AtSign size={18} />, bg: 'bg-pink-50 dark:bg-pink-900/30', iconColor: 'text-pink-500 dark:text-pink-400' },
  due: { icon: <Clock size={18} />, bg: 'bg-red-50 dark:bg-red-900/30', iconColor: 'text-red-500 dark:text-red-400' },
  approval: { icon: <CheckCircle size={18} />, bg: 'bg-emerald-50 dark:bg-emerald-900/30', iconColor: 'text-emerald-500 dark:text-emerald-400' },
  file: { icon: <FileText size={18} />, bg: 'bg-slate-100 dark:bg-slate-700', iconColor: 'text-slate-500 dark:text-slate-400' },
};

// Filter tabs component
const FilterTabs: React.FC<{
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  unreadCount: number;
}> = ({ activeFilter, onFilterChange, unreadCount }) => {
  const filters: { id: NotificationFilter; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All' },
    { id: 'mentioned', label: 'Mine' },
    { id: 'unread', label: `Unread (${unreadCount})` },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-tight whitespace-nowrap transition-all active:scale-95 ${
            activeFilter === filter.id
              ? 'bg-[#3b82f6] text-white'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
          }`}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// Section header
const SectionHeader: React.FC<{ title: string; count: number }> = ({ title, count }) => (
  <div className="flex items-center justify-between py-2 px-1">
    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
      {title}
    </span>
    <span className="text-[10px] font-medium text-slate-300 dark:text-slate-600">
      {count} {count === 1 ? 'notification' : 'notifications'}
    </span>
  </div>
);

// Notification card component
const NotificationCard: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClick: (notification: Notification) => void;
}> = ({ notification, onMarkAsRead, onClick }) => {
  const config = NOTIFICATION_CONFIG[notification.type];

  return (
    <button
      onClick={() => {
        if (!notification.isRead) onMarkAsRead(notification.id);
        onClick(notification);
      }}
      className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${
        notification.isRead
          ? 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'
      }`}
    >
      <div className="flex gap-3">
        {/* Icon or Avatar */}
        <div className="relative flex-shrink-0">
          {notification.user ? (
            <img
              src={`https://picsum.photos/seed/${notification.user.avatar}/100`}
              alt=""
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
              <span className={config.iconColor}>{config.icon}</span>
            </div>
          )}
          {/* Unread indicator */}
          {!notification.isRead && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#3b82f6] rounded-full border-2 border-white dark:border-slate-800" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Title with ref number */}
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className={`text-[13px] font-bold truncate ${
                  notification.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-slate-100'
                }`}>
                  {notification.title}
                </h3>
                {notification.refNo && (
                  <span className="text-[10px] font-bold text-[#3b82f6] bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded flex-shrink-0">
                    #{notification.refNo}
                  </span>
                )}
              </div>

              {/* Message */}
              <p className={`text-[12px] leading-relaxed line-clamp-2 ${
                notification.isRead ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {notification.message}
              </p>

              {/* User info (if applicable) */}
              {notification.user && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {notification.user.name}
                  </span>
                  {notification.user.stakeholder && (
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      {notification.user.stakeholder}
                    </span>
                  )}
                </div>
              )}

              {/* Attachment preview */}
              {notification.attachment && (
                <div className="flex items-center gap-2 mt-2 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-[8px] font-black text-red-500 dark:text-red-400">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                      {notification.attachment.name}
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500">
                      {notification.attachment.size}
                    </p>
                  </div>
                  <Download size={14} className="text-slate-400 dark:text-slate-500" />
                </div>
              )}
            </div>

            {/* Timestamp */}
            <span className="text-[9px] font-medium text-slate-300 dark:text-slate-600 whitespace-nowrap flex-shrink-0">
              {notification.timestampLabel}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

// Empty state
const EmptyState: React.FC<{ filter: NotificationFilter }> = ({ filter }) => (
  <div className="flex flex-col items-center justify-center py-12 px-8">
    <div className="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
      <BellOff size={32} className="text-slate-300 dark:text-slate-600" />
    </div>
    <h3 className="text-[15px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 text-center">
      {filter === 'unread' ? 'All caught up!' : 'No notifications'}
    </h3>
    <p className="text-[13px] text-slate-400 dark:text-slate-500 text-center max-w-[240px] leading-relaxed">
      {filter === 'unread'
        ? "You've read all your notifications"
        : filter === 'mentioned'
          ? "No notifications for you yet"
          : "When you receive notifications, they'll appear here"}
    </p>
  </div>
);

// Actions menu
const ActionsMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}> = ({ isOpen, onClose, onMarkAllRead, onClearAll }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg z-50 min-w-[180px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        <button
          onClick={() => {
            onMarkAllRead();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Check size={16} className="text-emerald-500" />
          Mark all as read
        </button>
        <button
          onClick={() => {
            onClearAll();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 size={16} />
          Clear all notifications
        </button>
      </div>
    </>
  );
};

// Group notifications by date
const groupNotificationsByDate = (notifications: Notification[]) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups: { title: string; notifications: Notification[] }[] = [];

  const todayNotifs = notifications.filter(n => new Date(n.timestamp).toDateString() === today);
  const yesterdayNotifs = notifications.filter(n => new Date(n.timestamp).toDateString() === yesterday);
  const earlierNotifs = notifications.filter(n => {
    const date = new Date(n.timestamp).toDateString();
    return date !== today && date !== yesterday;
  });

  if (todayNotifs.length > 0) groups.push({ title: 'Today', notifications: todayNotifs });
  if (yesterdayNotifs.length > 0) groups.push({ title: 'Yesterday', notifications: yesterdayNotifs });
  if (earlierNotifs.length > 0) groups.push({ title: 'Earlier', notifications: earlierNotifs });

  return groups;
};

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'mentioned') return n.type === 'mention';
    if (activeFilter === 'unread') return !n.isRead;
    return true;
  });

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log('Open notification:', notification);
  };

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[60] flex flex-col transition-colors animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header
        className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 py-2 flex items-center justify-between transition-colors"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center active:bg-slate-100 dark:active:bg-slate-600 transition-colors"
        >
          <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>

        <div className="flex items-center gap-2">
          <Bell size={18} className="text-[#3b82f6]" />
          <h1 className="text-[17px] font-bold text-slate-800 dark:text-slate-100">Notifications</h1>
          {unreadCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 bg-[#3b82f6] text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="w-9 h-9 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center active:bg-slate-100 dark:active:bg-slate-600 transition-colors"
          >
            <MoreVertical size={18} className="text-slate-600 dark:text-slate-300" />
          </button>
          <ActionsMenu
            isOpen={showActionsMenu}
            onClose={() => setShowActionsMenu(false)}
            onMarkAllRead={handleMarkAllRead}
            onClearAll={handleClearAll}
          />
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-3 py-2 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 transition-colors">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          unreadCount={unreadCount}
        />
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-3 pb-6">
        {filteredNotifications.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <div className="flex flex-col gap-1">
            {groupedNotifications.map((group) => (
              <div key={group.title}>
                <SectionHeader title={group.title} count={group.notifications.length} />
                <div className="flex flex-col gap-2">
                  {group.notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
