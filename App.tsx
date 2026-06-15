
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Search, Bell, ChevronLeft } from 'lucide-react';
import { useTheme, useOffline } from './context';
import OfflineIndicator from './components/OfflineIndicator';
import Notifications from './components/Notifications';
import TaskDetail from './components/TaskDetail';
import NewSubmission from './components/NewSubmission';
import NewIssue from './components/NewIssue';
import NewRFS from './components/NewRFS';
import FeedDetail from './components/FeedDetail';
import BottomNav from './components/BottomNav';
import ProjectDrawer from './components/ProjectDrawer';
import DirectoryView from './components/DirectoryView';
import FeedsView from './components/FeedsView';
import ToolsView from './components/ToolsView';
import { DailyReportList, DailyReportDetail } from './components/DailyReport';
import { DailyReportSummary } from './components/DailyReport/types';
import { DMapList, DMapDetail } from './components/DMap';
import { MapLayout } from './components/DMap/types';
import { AnalyticsReportList } from './components/AnalyticsReport';
import ProfileView from './components/ProfileView';
import CreateActionMenu, { CreateAction } from './components/CreateActionMenu';
import StorageManager from './components/StorageManager';
import { BottomTab, Project, Task, FeedItem } from './types';

// Fixed Header — project selector + search + notifications (no sub-tabs)
const StickyHeader = memo(({
  activeProject,
  onProjectClick,
  onNotificationsClick,
}: {
  activeProject: Project;
  onProjectClick: () => void;
  onNotificationsClick: () => void;
}) => (
  <div
    className="fixed top-0 left-0 right-0 z-40 bg-[#faf9f6] dark:bg-slate-900 max-w-md mx-auto transition-colors"
    style={{ paddingTop: 'env(safe-area-inset-top)' }}
  >
    {/* Project Bar with Search & Notifications */}
    <header className="flex items-center justify-between px-3 pt-2 pb-1.5 gap-2">
      {/* Project Selector */}
      <button
        onClick={onProjectClick}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 pr-3 pl-1 py-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm active:bg-slate-50 dark:active:bg-slate-700 transition-colors min-w-0 flex-shrink"
      >
        <div className="w-6 h-6 rounded-full bg-[#95ac71] flex items-center justify-center text-white font-bold text-[10px] shadow-sm flex-shrink-0">
          {activeProject.initials}
        </div>
        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm truncate">{activeProject.name}</span>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Offline Mode Indicator */}
        <OfflineIndicator />

        {/* Search Button */}
        <button className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm active:bg-slate-50 dark:active:bg-slate-700 transition-colors flex-shrink-0">
          <Search size={18} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* Notifications Button */}
        <button
          onClick={onNotificationsClick}
          className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm relative active:bg-slate-50 dark:active:bg-slate-700 transition-colors flex-shrink-0"
        >
          <Bell size={18} className="text-slate-600 dark:text-slate-300" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 bg-[#3b82f6] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
            3
          </span>
        </button>
      </div>
    </header>
  </div>
));

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<BottomTab>(BottomTab.TOOLS);
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNewSubmissionOpen, setIsNewSubmissionOpen] = useState(false);
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);
  const [isNewRFSOpen, setIsNewRFSOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedFeed, setSelectedFeed] = useState<FeedItem | null>(null);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isDailyReportListOpen, setIsDailyReportListOpen] = useState(false);
  const [selectedDailyReport, setSelectedDailyReport] = useState<DailyReportSummary | null>(null);
  const [isDMapListOpen, setIsDMapListOpen] = useState(false);
  const [selectedDMap, setSelectedDMap] = useState<MapLayout | null>(null);
  const [isAnalyticsReportOpen, setIsAnalyticsReportOpen] = useState(false);

  // New overlay states for tools that need wrapper
  const [feedsScope, setFeedsScope] = useState<'Issues' | 'Submittals' | null>(null);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Calculate delta
        const diff = currentScrollY - lastScrollY.current;

        // Threshold to avoid jitter
        if (Math.abs(diff) > 10) {
          if (diff > 0) {
            // Scrolling Down (reading more content) -> HIDE bottom nav
            setIsBottomNavVisible(false);
          } else {
            // Scrolling Up (wanting to navigate) -> SHOW bottom nav
            setIsBottomNavVisible(true);
          }
          lastScrollY.current = currentScrollY;
        }

        // Always show when at the very top
        if (currentScrollY <= 10) {
          setIsBottomNavVisible(true);
        }

        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects: Project[] = [
    {
      id: '1',
      name: 'AECIS Corporate HQ',
      initials: 'AC',
      state: 'active',
      address: '123 Construction Way, San Francisco, CA'
    },
    {
      id: '2',
      name: 'Nova Research Lab',
      initials: 'NL',
      state: 'active',
      address: '456 Innovation Dr, Austin, TX'
    },
    {
      id: '3',
      name: 'Sunrise Plaza',
      initials: 'SP',
      state: 'active',
      address: '789 Sunset Blvd, Los Angeles, CA'
    },
    {
      id: '4',
      name: 'Marina Bay Tower',
      initials: 'MB',
      state: 'active',
      address: '10 Bayfront Ave, Singapore 018956'
    },
    {
      id: '5',
      name: 'Central Park Residences',
      initials: 'CP',
      state: 'completed',
      address: '250 Central Park West, New York, NY'
    },
    {
      id: '6',
      name: 'Green Valley Hospital',
      initials: 'GV',
      state: 'active',
      address: '500 Medical Center Dr, Denver, CO'
    },
    {
      id: '7',
      name: 'Pacific Heights Mall',
      initials: 'PH',
      state: 'completed',
      address: '2100 Pacific Ave, San Francisco, CA'
    },
    {
      id: '8',
      name: 'Riverside School Campus',
      initials: 'RS',
      state: 'active',
      address: '88 River Rd, Portland, OR'
    },
    {
      id: '9',
      name: 'Tech Hub Office Park',
      initials: 'TH',
      state: 'active',
      address: '1500 Technology Pkwy, San Jose, CA'
    },
    {
      id: '10',
      name: 'Heritage Museum Renovation',
      initials: 'HM',
      state: 'completed',
      address: '1200 Museum Mile, Chicago, IL'
    },
    {
      id: '11',
      name: 'Diamond Bay Resort',
      initials: 'DB',
      state: 'active',
      address: '77 Oceanfront Dr, Miami, FL'
    },
    {
      id: '12',
      name: 'Skyline Apartments',
      initials: 'SA',
      state: 'active',
      address: '350 High St, Seattle, WA'
    }
  ];

  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  // Memoized callbacks for StickyHeader to prevent re-renders
  const handleProjectClick = useCallback(() => setIsProjectDrawerOpen(true), []);
  const handleNotificationsClick = useCallback(() => setIsNotificationsOpen(true), []);

  const handleTabChange = (tab: BottomTab) => {
    if (tab === BottomTab.ADD) {
      setIsCreateMenuOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  const handleCreateAction = (action: CreateAction) => {
    setIsCreateMenuOpen(false);
    if (action === 'submission') {
      setIsNewSubmissionOpen(true);
    } else if (action === 'issue') {
      setIsNewIssueOpen(true);
    } else if (action === 'rfs') {
      setIsNewRFSOpen(true);
    }
  };

  const renderContent = () => {
    if (currentTab === BottomTab.TOOLS) {
      return (
        <div className="px-3 pt-3 pb-8">
          <ToolsView
            onOpenIssues={() => setFeedsScope('Issues')}
            onOpenSubmittals={() => setFeedsScope('Submittals')}
            onOpenDailyReport={() => setIsDailyReportListOpen(true)}
            onOpenDMap={() => setIsDMapListOpen(true)}
            onOpenAnalyticsReport={() => setIsAnalyticsReportOpen(true)}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
            onOpenStorage={() => setIsStorageOpen(true)}
          />
        </div>
      );
    }

    if (currentTab === BottomTab.PROFILE) {
      return (
        <div className="px-3 pt-3 pb-8">
          <ProfileView onLogout={() => console.log('Logout clicked')} />
        </div>
      );
    }

    return null;
  };

  // Check if any full-screen overlay is open (hides main content + nav)
  const hasFullOverlay = isNotificationsOpen || selectedTask || selectedFeed ||
    isNewSubmissionOpen || isNewIssueOpen || isNewRFSOpen ||
    isDailyReportListOpen || selectedDailyReport ||
    isDMapListOpen || selectedDMap || isAnalyticsReportOpen ||
    feedsScope || isDirectoryOpen;

  return (
    <div className="relative min-h-screen max-w-md mx-auto bg-[#faf9f6] dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      {!hasFullOverlay && (
        <>
          {/* Hide project header on Profile tab — it's user-scoped, not project-scoped */}
          {currentTab !== BottomTab.PROFILE && (
            <>
              <StickyHeader
                activeProject={activeProject}
                onProjectClick={handleProjectClick}
                onNotificationsClick={handleNotificationsClick}
              />

              {/* Spacer for fixed header — consistent h-16 since no sub-tabs */}
              <div className="h-12" />
            </>
          )}

          <main className="px-0">
            {renderContent()}
          </main>
        </>
      )}

      {isNotificationsOpen && (
        <Notifications onClose={() => setIsNotificationsOpen(false)} />
      )}

      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

      {isNewSubmissionOpen && (
        <NewSubmission onClose={() => setIsNewSubmissionOpen(false)} />
      )}

      {isNewIssueOpen && (
        <NewIssue onClose={() => setIsNewIssueOpen(false)} />
      )}

      {isNewRFSOpen && (
        <NewRFS onClose={() => setIsNewRFSOpen(false)} />
      )}

      {selectedFeed && (
        <FeedDetail item={selectedFeed} onClose={() => setSelectedFeed(null)} />
      )}

      {/* Feeds overlay — scoped to Issues or Submittals (incl. RFS) */}
      {feedsScope && (
        <div className="fixed inset-0 z-50 bg-[#faf9f6] dark:bg-slate-900 max-w-md mx-auto overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#faf9f6] dark:bg-slate-900" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <header className="flex items-center gap-3 px-3 pt-2 pb-1.5">
              <button
                onClick={() => setFeedsScope(null)}
                className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm active:bg-slate-50 dark:active:bg-slate-700 transition-colors"
              >
                <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
              </button>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{feedsScope}</h1>
            </header>
          </div>
          <div className="px-3 pt-1 pb-8">
            <FeedsView
              onSelectFeed={setSelectedFeed}
              feedTypes={feedsScope === 'Issues' ? ['Issue'] : ['Submittal', 'RFS']}
            />
          </div>
        </div>
      )}

      {isDailyReportListOpen && (
        <DailyReportList
          onClose={() => setIsDailyReportListOpen(false)}
          onSelectReport={(report) => {
            setSelectedDailyReport(report);
          }}
        />
      )}

      {selectedDailyReport && (
        <DailyReportDetail
          report={selectedDailyReport}
          onClose={() => setSelectedDailyReport(null)}
        />
      )}

      {isDMapListOpen && (
        <DMapList
          onClose={() => setIsDMapListOpen(false)}
          onSelectMap={(map) => {
            setSelectedDMap(map);
          }}
        />
      )}

      {selectedDMap && (
        <DMapDetail
          map={selectedDMap}
          onClose={() => setSelectedDMap(null)}
        />
      )}

      {isAnalyticsReportOpen && (
        <AnalyticsReportList
          onClose={() => setIsAnalyticsReportOpen(false)}
        />
      )}

      {/* Directory overlay */}
      {isDirectoryOpen && (
        <div className="fixed inset-0 z-50 bg-[#faf9f6] dark:bg-slate-900 max-w-md mx-auto overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#faf9f6] dark:bg-slate-900" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <header className="flex items-center gap-3 px-3 pt-2 pb-1.5">
              <button
                onClick={() => setIsDirectoryOpen(false)}
                className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm active:bg-slate-50 dark:active:bg-slate-700 transition-colors"
              >
                <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
              </button>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Directory</h1>
            </header>
          </div>
          <div className="px-3 pt-1 pb-8">
            <DirectoryView />
          </div>
        </div>
      )}

      {/* Storage Manager — already has isOpen/onClose props */}
      <StorageManager
        isOpen={isStorageOpen}
        onClose={() => setIsStorageOpen(false)}
      />

      <BottomNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
        isVisible={isBottomNavVisible}
      />

      <CreateActionMenu
        isOpen={isCreateMenuOpen}
        onClose={() => setIsCreateMenuOpen(false)}
        onSelect={handleCreateAction}
      />

      <ProjectDrawer
        isOpen={isProjectDrawerOpen}
        onClose={() => setIsProjectDrawerOpen(false)}
        projects={projects}
        activeId={activeProject.id}
        onSelect={(p) => {
          setActiveProject(p);
          setIsProjectDrawerOpen(false);
          setCurrentTab(BottomTab.TOOLS);
          window.scrollTo(0, 0);
          setIsBottomNavVisible(true);
        }}
      />
    </div>
  );
};

export default App;
