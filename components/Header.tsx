import React from 'react';
import { Project } from '../types';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  activeWorkspace: Project;
  onWorkspaceClick: () => void;
  onNotificationsClick: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  activeWorkspace,
  onWorkspaceClick,
  onNotificationsClick,
  notificationCount = 3,
}) => {
  return (
    <header
      className="flex items-center justify-between px-4 py-3"
      style={{ paddingTop: 'max(0.75rem, calc(env(safe-area-inset-top) + 0.5rem))' }}
    >
      {/* Project Selector */}
      <button
        onClick={onWorkspaceClick}
        aria-label={`Current project: ${activeWorkspace.name}. Tap to switch projects.`}
        aria-haspopup="dialog"
        className="
          flex items-center gap-3 bg-white dark:bg-slate-800 pr-4 pl-1.5 py-1.5 rounded-full
          border border-slate-100 dark:border-slate-700 shadow-sm
          transition-all duration-200
          hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600
          active:scale-95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2
        "
      >
        <div className="w-8 h-8 rounded-full bg-[#95ac71] flex items-center justify-center text-white font-bold text-xs shadow-sm">
          {activeWorkspace.initials}
        </div>
        <span className="font-semibold text-slate-700 dark:text-slate-200 max-w-[140px] truncate">{activeWorkspace.name}</span>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2" role="group" aria-label="Header actions">
        {/* Search Button */}
        <button
          aria-label="Search"
          className="
            w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center
            border border-slate-100 dark:border-slate-700 shadow-sm
            transition-all duration-200
            hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600
            active:scale-90
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2
          "
        >
          <Search size={20} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* Notifications Button */}
        <button
          onClick={onNotificationsClick}
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
          aria-haspopup="dialog"
          className="
            w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center
            border border-slate-100 dark:border-slate-700 shadow-sm relative
            transition-all duration-200
            hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600
            active:scale-90
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2
          "
        >
          <Bell size={20} className="text-slate-600 dark:text-slate-300" />
          {notificationCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#3b82f6] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm"
              aria-hidden="true"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
