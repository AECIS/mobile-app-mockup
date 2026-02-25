import React from 'react';
import { BottomTab } from '../types';
import { Briefcase, Plus } from 'lucide-react';

interface BottomNavProps {
  currentTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  isVisible: boolean;
  badges?: Partial<Record<BottomTab, number>>;
}

interface NavItemProps {
  tab: BottomTab;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ tab, icon, activeIcon, label, isActive, badge, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
    role="tab"
    aria-selected={isActive}
    className={`
      flex flex-col items-center justify-center flex-1 py-2 min-h-[52px] min-w-[52px]
      transition-all duration-200 rounded-2xl relative
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-inset
      active:scale-95
      ${isActive ? 'text-[#3b82f6]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400'}
    `}
  >
    <div className="relative">
      {isActive && activeIcon ? activeIcon : icon}
      {badge && badge > 0 && (
        <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
    <span className={`text-[9px] font-bold mt-1 uppercase tracking-tight transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>
      {label}
    </span>
    {/* Active indicator dot */}
    {isActive && (
      <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#3b82f6]" />
    )}
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange, isVisible, badges = {} }) => {
  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      className={`
        fixed bottom-0 left-0 right-0 z-40
        transition-all duration-500 ease-out transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-3 mb-3">
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl px-1.5 py-1 flex items-center justify-between shadow-2xl border border-slate-100/80 dark:border-slate-700/80 transition-colors">
          <NavItem
            tab={BottomTab.TOOLS}
            icon={<Briefcase size={22} strokeWidth={2} />}
            activeIcon={<Briefcase size={22} strokeWidth={2.5} fill="currentColor" fillOpacity={0.15} />}
            label="Tools"
            isActive={currentTab === BottomTab.TOOLS}
            onClick={() => onTabChange(BottomTab.TOOLS)}
          />

          {/* Floating Action Button */}
          <div className="relative -top-4 mx-1">
            <button
              onClick={() => onTabChange(BottomTab.ADD)}
              aria-label="Create new item"
              className={`
                w-12 h-12 bg-[#3b82f6] rounded-xl
                flex items-center justify-center text-white
                shadow-[0_8px_24px_-4px_rgba(240,107,62,0.5)]
                transition-all duration-200
                hover:bg-[#2563eb] hover:shadow-[0_12px_28px_-4px_rgba(240,107,62,0.6)]
                active:scale-90 active:shadow-[0_4px_12px_-2px_rgba(240,107,62,0.4)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3b82f6]
              `}
            >
              <Plus size={28} strokeWidth={2.5} />
            </button>
          </div>

          <NavItem
            tab={BottomTab.PROFILE}
            icon={
              <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-600 overflow-hidden transition-all">
                <img src="https://picsum.photos/seed/profile/100" className="w-full h-full object-cover" alt="" />
              </div>
            }
            activeIcon={
              <div className="w-6 h-6 rounded-full border-2 border-[#3b82f6] overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900/30 transition-all">
                <img src="https://picsum.photos/seed/profile/100" className="w-full h-full object-cover" alt="" />
              </div>
            }
            label="Profile"
            isActive={currentTab === BottomTab.PROFILE}
            onClick={() => onTabChange(BottomTab.PROFILE)}
          />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
