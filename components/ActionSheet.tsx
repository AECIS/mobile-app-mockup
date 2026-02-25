import React, { useEffect, useState } from 'react';
import { X, Check, FileCheck, XCircle, Info, RotateCcw, Send, Ban, Archive, FileX, UserPlus } from 'lucide-react';
import { FeedItemType } from '../types';

export interface ActionItem {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  destructive?: boolean;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: FeedItemType;
  currentStatus: string;
  onActionSelect: (actionKey: string) => void;
}

// Define available actions for different statuses
const SUBMITTAL_ACTIONS: Record<string, ActionItem[]> = {
  'Submitted': [
    { key: 'approve_a', label: 'Approve (A)', description: 'No comments. Proceed to fabrication/construction.', icon: <Check size={18} />, color: '#238823' },
    { key: 'approve_b', label: 'Approve (B)', description: 'Approved with comments. Make corrections noted.', icon: <FileCheck size={18} />, color: '#238823' },
    { key: 'reject_c', label: 'Reject (C)', description: 'Revise and resubmit. Not approved for construction.', icon: <XCircle size={18} />, color: '#D2222D', destructive: true },
    { key: 'for_info', label: 'For Info (D)', description: 'For information only. No action required.', icon: <Info size={18} />, color: '#2C7ABB' },
    { key: 'reassign', label: 'Reassign', description: 'Assign to a different reviewer.', icon: <UserPlus size={18} />, color: '#2C7ABB' },
    { key: 'resubmit', label: 'Request Resubmit', description: 'Ask submitter to provide additional information.', icon: <RotateCcw size={18} />, color: '#FFBF00' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this submittal permanently.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'ReSubmitted': [
    { key: 'approve_a', label: 'Approve (A)', description: 'No comments. Proceed to fabrication/construction.', icon: <Check size={18} />, color: '#238823' },
    { key: 'approve_b', label: 'Approve (B)', description: 'Approved with comments. Make corrections noted.', icon: <FileCheck size={18} />, color: '#238823' },
    { key: 'reject_c', label: 'Reject (C)', description: 'Revise and resubmit. Not approved for construction.', icon: <XCircle size={18} />, color: '#D2222D', destructive: true },
    { key: 'for_info', label: 'For Info (D)', description: 'For information only. No action required.', icon: <Info size={18} />, color: '#2C7ABB' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this submittal permanently.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'Approved_A': [
    { key: 'issue_to', label: 'Issue To', description: 'Distribute to selected stakeholders for action.', icon: <Send size={18} />, color: '#2C7ABB' },
    { key: 'supersede', label: 'Supersede', description: 'Replace with a newer version of this submittal.', icon: <Archive size={18} />, color: '#ADB7BE' },
    { key: 'obsolete', label: 'Mark as Obsolete', description: 'This submittal is no longer valid or needed.', icon: <FileX size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'Approved_B': [
    { key: 'issue_to', label: 'Issue To', description: 'Distribute to selected stakeholders for action.', icon: <Send size={18} />, color: '#2C7ABB' },
    { key: 'supersede', label: 'Supersede', description: 'Replace with a newer version of this submittal.', icon: <Archive size={18} />, color: '#ADB7BE' },
    { key: 'obsolete', label: 'Mark as Obsolete', description: 'This submittal is no longer valid or needed.', icon: <FileX size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'InProgress': [
    { key: 'submit', label: 'Submit', description: 'Send to reviewer for approval.', icon: <Send size={18} />, color: '#2C7ABB' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this submittal permanently.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'Draft': [
    { key: 'submit', label: 'Submit', description: 'Send to reviewer for approval.', icon: <Send size={18} />, color: '#2C7ABB' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this submittal permanently.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'Rejected': [
    { key: 'resubmit', label: 'Resubmit', description: 'Submit again with corrections made.', icon: <RotateCcw size={18} />, color: '#2C7ABB' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this submittal permanently.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'ForInfo': [
    { key: 'issue_to', label: 'Issue To', description: 'Distribute to selected stakeholders for action.', icon: <Send size={18} />, color: '#2C7ABB' },
  ],
};

const ISSUE_ACTIONS: Record<string, ActionItem[]> = {
  'Opened': [
    { key: 'complete', label: 'Mark Complete', description: 'Issue has been resolved. Awaiting verification.', icon: <Check size={18} />, color: '#238823' },
    { key: 'close', label: 'Close', description: 'Close this issue. No further action required.', icon: <FileCheck size={18} />, color: '#238823' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this issue. It is no longer relevant.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'ReOpened': [
    { key: 'complete', label: 'Mark Complete', description: 'Issue has been resolved. Awaiting verification.', icon: <Check size={18} />, color: '#238823' },
    { key: 'close', label: 'Close', description: 'Close this issue. No further action required.', icon: <FileCheck size={18} />, color: '#238823' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this issue. It is no longer relevant.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'Done': [
    { key: 'close', label: 'Close', description: 'Verify and close. Resolution confirmed.', icon: <FileCheck size={18} />, color: '#238823' },
    { key: 'reopen', label: 'Re-open', description: 'Issue not resolved. Needs more work.', icon: <RotateCcw size={18} />, color: '#2C7ABB' },
  ],
  'Closed': [
    { key: 'reopen', label: 'Re-open', description: 'Issue has recurred or needs attention again.', icon: <RotateCcw size={18} />, color: '#2C7ABB' },
  ],
  'Overdue': [
    { key: 'complete', label: 'Mark Complete', description: 'Issue has been resolved. Awaiting verification.', icon: <Check size={18} />, color: '#238823' },
    { key: 'close', label: 'Close', description: 'Close this issue. No further action required.', icon: <FileCheck size={18} />, color: '#238823' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this issue. It is no longer relevant.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
};

const RFS_ACTIONS: Record<string, ActionItem[]> = {
  'InProgress': [
    { key: 'submit', label: 'Submit', description: 'Send request for approval.', icon: <Send size={18} />, color: '#2C7ABB' },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this request permanently.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
  'Submitted': [
    { key: 'approve_a', label: 'Approve', description: 'Approve this request. Proceed with work.', icon: <Check size={18} />, color: '#238823' },
    { key: 'reject_c', label: 'Reject', description: 'Reject this request. Cannot proceed.', icon: <XCircle size={18} />, color: '#D2222D', destructive: true },
    { key: 'cancel', label: 'Cancel', description: 'Cancel this request permanently.', icon: <Ban size={18} />, color: '#ADB7BE', destructive: true },
  ],
};

const ActionSheet: React.FC<ActionSheetProps> = ({ isOpen, onClose, itemType, currentStatus, onActionSelect }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get available actions based on type and status
  const getActions = (): ActionItem[] => {
    if (itemType === 'Issue') {
      return ISSUE_ACTIONS[currentStatus] || [];
    } else if (itemType === 'RFS') {
      return RFS_ACTIONS[currentStatus] || [];
    } else {
      return SUBMITTAL_ACTIONS[currentStatus] || [];
    }
  };

  const actions = getActions();

  const handleActionClick = (actionKey: string) => {
    onActionSelect(actionKey);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center transition-all duration-300 ${
        isVisible ? 'bg-black/40' : 'bg-black/0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full bg-white dark:bg-slate-800 rounded-t-[2rem] shadow-2xl transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxWidth: '640px',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Actions</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700 transition-all"
          >
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Actions List */}
        <div className="px-4 py-3 space-y-2">
          {actions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">No actions available</p>
            </div>
          ) : (
            actions.map((action) => (
              <button
                key={action.key}
                onClick={() => handleActionClick(action.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all active:scale-[0.98] ${
                  action.destructive
                    ? 'bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-800 active:bg-red-50 dark:active:bg-red-900/30'
                    : 'bg-slate-50/50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-600 active:bg-slate-100 dark:active:bg-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    action.destructive ? 'bg-red-100 dark:bg-red-900/40' : 'bg-white dark:bg-slate-600 border border-slate-100 dark:border-slate-500'
                  }`}
                  style={{ color: action.color }}
                >
                  {action.icon}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className={`text-[13px] font-bold block ${action.destructive ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>
                    {action.label}
                  </span>
                  <span className={`text-[11px] block mt-0.5 leading-snug ${action.destructive ? 'text-red-400 dark:text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {action.description}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Cancel Button */}
        <div className="px-4 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold active:bg-slate-200 dark:active:bg-slate-600 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionSheet;
