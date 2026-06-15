import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Search, X, Check } from 'lucide-react';
import { ProjectUser, Stakeholder } from '../types';

interface AssigneeSelectorProps {
  stakeholders: Stakeholder[];
  users: ProjectUser[];
  selectedId: string | null;
  onSelect: (user: ProjectUser) => void;
  onClose: () => void;
}

export const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
  stakeholders,
  users,
  selectedId,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus search and prevent body scroll
  useEffect(() => {
    const timer = setTimeout(() => searchRef.current?.focus(), 300);

    // Prevent body scroll
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Focus trap - keep focus within the selector
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab' && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [onClose]);

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.position.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  const handleSelect = (user: ProjectUser) => {
    onSelect(user);
    onClose();
  };

  // Group filtered users by stakeholder
  const groupedByStakeholder = stakeholders
    .map((sh) => ({
      stakeholder: sh,
      members: filteredUsers.filter((u) => u.stakeholderId === sh.id),
    }))
    .filter((group) => group.members.length > 0);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Select Assignee"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 bg-[#fafafa] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200"
    >
      {/* Sticky Header - Frosted Glass */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 transition-all -ml-1"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-200" />
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Select Assignee</h1>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 pt-3 pb-3 border-b border-slate-100 dark:border-slate-700">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role..."
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full pl-14 pr-12 py-3 rounded-2xl bg-[#fafafa] dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable User List */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div
          className="px-4 py-3"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {groupedByStakeholder.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-[2rem] flex items-center justify-center">
                <Search className="w-7 h-7 text-slate-300 dark:text-slate-500" />
              </div>
              <p className="text-[15px] font-bold text-slate-400 dark:text-slate-500">
                No users found
              </p>
              <p className="text-[12px] text-slate-300 dark:text-slate-600 mt-1">
                Try searching by name or role
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {groupedByStakeholder.map(({ stakeholder, members }) => (
                <div key={stakeholder.id}>
                  {/* Stakeholder group header - Sticky */}
                  <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-10 flex items-center gap-2.5 px-2 py-2.5 -mx-1 rounded-xl">
                    <span className="bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tight">
                      {stakeholder.abbreviation}
                    </span>
                    <h2 className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">
                      {stakeholder.name}
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-300">
                      {members.length} {members.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  {/* Members */}
                  <div className="space-y-2 mt-1">
                    {members.map((user) => {
                      const isSelected = selectedId === user.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => handleSelect(user)}
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={`Select ${user.name}, ${user.position}`}
                          className={`w-full flex items-center gap-3.5 p-3 min-h-[56px] rounded-2xl transition-all text-left active:scale-[0.98] ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                              : 'bg-[#fafafa] dark:bg-slate-800 border border-slate-100/50 dark:border-slate-700 active:bg-slate-50'
                          }`}
                        >
                          {/* Avatar */}
                          <img
                            src={`https://picsum.photos/seed/${user.id}/100`}
                            className="w-12 h-12 rounded-full flex-shrink-0 object-cover border-2 border-white dark:border-slate-700 shadow-md"
                            alt=""
                          />

                          {/* Name + Position + Email */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate font-medium">
                              {user.position}
                            </p>
                            <p className="text-[10px] text-slate-300 dark:text-slate-600 truncate mt-0.5">
                              {user.email}
                            </p>
                          </div>

                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="w-7 h-7 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0 ring-4 ring-blue-100 shadow-sm">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
