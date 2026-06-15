import React, { useState } from 'react';
import {
  ChevronLeft, X, Send, Mail, Paperclip, Users, UserPlus, Check,
  FileText, QrCode, Camera, FolderOpen, Plus, Trash2, Bell, BellOff,
  Lock, EyeOff
} from 'lucide-react';
import { ProjectUser } from '../types';
import { projectUsers, stakeholders } from './mockData';

export type ActionFormType =
  | 'cancel'
  | 'reassign'
  | 'approve_a'
  | 'approve_b'
  | 'reject_c'
  | 'for_info'
  | 'resubmit'
  | 'submit'
  | 'complete'
  | 'close'
  | 'reopen'
  | 'issue_to'
  | 'supersede'
  | 'obsolete';

interface ActionFormProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionFormType;
  onSubmit: (data: ActionFormData) => void;
  currentAssignee?: ProjectUser;
  ccRecipients?: ProjectUser[];
}

export interface ActionFormData {
  actionType: ActionFormType;
  note: string;
  attachments: { id: string; name: string; type: 'pdf' | 'image' | 'doc' }[];
  sendEmailNotification: boolean;
  distributionList: ProjectUser[];
  newAssignee?: ProjectUser;
  newAssignees?: ProjectUser[]; // For issue_to (multiple)
  pdfQrStamp?: boolean;
  isPrivate?: boolean;
  isRestricted?: boolean;
}

// Action configuration
const ACTION_CONFIG: Record<ActionFormType, {
  title: string;
  description: string;
  color: string;
  showAssignee: boolean;
  showMultipleAssignees: boolean;
  showQrStamp: boolean;
  showVisibilityOptions: boolean;
  resultStatus?: string;
  destructive?: boolean;
}> = {
  cancel: {
    title: 'Cancel',
    description: 'Cancel this item permanently',
    color: '#ADB7BE',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
    resultStatus: 'Cancelled',
    destructive: true,
  },
  reassign: {
    title: 'Reassign',
    description: 'Assign to a different person',
    color: '#2C7ABB',
    showAssignee: true,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: true,
  },
  approve_a: {
    title: 'Approve (A)',
    description: 'No comments. Proceed to construction.',
    color: '#238823',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: true,
    showVisibilityOptions: true,
    resultStatus: 'Approved (A)',
  },
  approve_b: {
    title: 'Approve (B)',
    description: 'Approved with comments noted.',
    color: '#238823',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: true,
    showVisibilityOptions: true,
    resultStatus: 'Approved (B)',
  },
  reject_c: {
    title: 'Reject (C)',
    description: 'Revise and resubmit required.',
    color: '#D2222D',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
    resultStatus: 'Rejected',
    destructive: true,
  },
  for_info: {
    title: 'For Info (D)',
    description: 'For information only.',
    color: '#2C7ABB',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: true,
    resultStatus: 'For Info',
  },
  resubmit: {
    title: 'Request Resubmit',
    description: 'Ask for additional information.',
    color: '#FFBF00',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
  },
  submit: {
    title: 'Submit',
    description: 'Send for review and approval.',
    color: '#2C7ABB',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
    resultStatus: 'Submitted',
  },
  complete: {
    title: 'Mark Complete',
    description: 'Issue has been resolved.',
    color: '#238823',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
    resultStatus: 'Done',
  },
  close: {
    title: 'Close',
    description: 'Close and finalize.',
    color: '#238823',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
    resultStatus: 'Closed',
  },
  reopen: {
    title: 'Re-open',
    description: 'Re-open for further action.',
    color: '#2C7ABB',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
    resultStatus: 'Re-Opened',
  },
  issue_to: {
    title: 'Issue To',
    description: 'Distribute to stakeholders.',
    color: '#2C7ABB',
    showAssignee: false,
    showMultipleAssignees: true,
    showQrStamp: false,
    showVisibilityOptions: true,
  },
  supersede: {
    title: 'Supersede',
    description: 'Replace with newer version.',
    color: '#ADB7BE',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
    resultStatus: 'Superseded',
  },
  obsolete: {
    title: 'Mark Obsolete',
    description: 'No longer valid or needed.',
    color: '#ADB7BE',
    showAssignee: false,
    showMultipleAssignees: false,
    showQrStamp: false,
    showVisibilityOptions: false,
    resultStatus: 'Obsoleted',
    destructive: true,
  },
};

const ActionForm: React.FC<ActionFormProps> = ({
  isOpen,
  onClose,
  actionType,
  onSubmit,
  currentAssignee,
  ccRecipients = [],
}) => {
  const [note, setNote] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; name: string; type: 'pdf' | 'image' | 'doc' }[]>([]);
  const [sendEmail, setSendEmail] = useState(true);
  const [distributionList, setDistributionList] = useState<ProjectUser[]>(ccRecipients);
  const [newAssignee, setNewAssignee] = useState<ProjectUser | null>(null);
  const [newAssignees, setNewAssignees] = useState<ProjectUser[]>([]); // For issue_to
  const [pdfQrStamp, setPdfQrStamp] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [pickerMode, setPickerMode] = useState<'single' | 'multiple'>('single');

  const config = ACTION_CONFIG[actionType];

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      actionType,
      note,
      attachments,
      sendEmailNotification: sendEmail,
      distributionList,
      newAssignee: newAssignee || undefined,
      newAssignees: newAssignees.length > 0 ? newAssignees : undefined,
      pdfQrStamp: config.showQrStamp ? pdfQrStamp : undefined,
      isPrivate: config.showVisibilityOptions ? isPrivate : undefined,
      isRestricted: config.showVisibilityOptions ? isRestricted : undefined,
    });
    onClose();
  };

  const handleAddAttachment = () => {
    const mockFile = {
      id: `att-${Date.now()}`,
      name: `Document_${attachments.length + 1}.pdf`,
      type: 'pdf' as const,
    };
    setAttachments(prev => [...prev, mockFile]);
    setShowAttachOptions(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleDistribution = (user: ProjectUser) => {
    if (distributionList.find(u => u.id === user.id)) {
      setDistributionList(prev => prev.filter(u => u.id !== user.id));
    } else {
      setDistributionList(prev => [...prev, user]);
    }
  };

  const handleRemoveFromDistribution = (userId: string) => {
    setDistributionList(prev => prev.filter(u => u.id !== userId));
  };

  const handleSelectAssignee = (user: ProjectUser) => {
    setNewAssignee(user);
    setShowAssigneePicker(false);
    setUserSearch('');
  };

  const handleToggleAssignee = (user: ProjectUser) => {
    if (newAssignees.find(u => u.id === user.id)) {
      setNewAssignees(prev => prev.filter(u => u.id !== user.id));
    } else {
      setNewAssignees(prev => [...prev, user]);
    }
  };

  const handleRemoveAssignee = (userId: string) => {
    setNewAssignees(prev => prev.filter(u => u.id !== userId));
  };

  const filteredUsers = projectUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const getStakeholderName = (stakeholderId: string) => {
    return stakeholders.find(s => s.id === stakeholderId)?.abbreviation || '';
  };

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[80] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700 active:scale-[0.98] transition-all -ml-1"
          >
            <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{config.title}</h1>
          </div>
          <button
            onClick={handleSubmit}
            className="text-sm font-bold px-5 py-2.5 rounded-full transition-all min-h-[44px] text-white active:scale-95"
            style={{ backgroundColor: config.color }}
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-4 py-5" style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}>

          {/* Status Change Indicator */}
          {config.resultStatus && (
            <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  <Check size={20} style={{ color: config.color }} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">Status will change to</p>
                  <p className="text-[14px] font-bold" style={{ color: config.color }}>{config.resultStatus}</p>
                </div>
              </div>
            </div>
          )}

          {/* Visibility Options (Private & Restricted) */}
          {config.showVisibilityOptions && (
            <div className="mb-6">
              <div className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 mb-2 flex items-center gap-2">
                <EyeOff size={14} />
                Visibility Settings
              </div>
              <div className="space-y-2">
                {/* Private Toggle */}
                <button
                  onClick={() => setIsPrivate(!isPrivate)}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-3 active:bg-slate-50 dark:active:bg-slate-700 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPrivate ? 'bg-slate-700' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Lock size={20} className={isPrivate ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Private</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Only visible to selected users</p>
                  </div>
                  <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isPrivate ? 'bg-slate-700' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </button>

                {/* Restricted Toggle */}
                <button
                  onClick={() => setIsRestricted(!isRestricted)}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-3 active:bg-slate-50 dark:active:bg-slate-700 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRestricted ? 'bg-amber-500' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <EyeOff size={20} className={isRestricted ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Restricted</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Limited access to authorized users</p>
                  </div>
                  <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isRestricted ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${isRestricted ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* New Assignee (for Reassign - single) */}
          {config.showAssignee && (
            <div className="mb-6">
              <div className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 mb-2 flex items-center gap-2">
                <UserPlus size={14} />
                New Assignee
                <span className="text-[8px] font-extrabold text-red-400 uppercase tracking-tight">Required</span>
              </div>
              <button
                onClick={() => { setShowAssigneePicker(true); setPickerMode('single'); }}
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-3 active:bg-slate-50 dark:active:bg-slate-700 transition-all"
              >
                {newAssignee ? (
                  <>
                    <img
                      src={`https://picsum.photos/seed/${newAssignee.id}/100`}
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    <div className="flex-1 text-left">
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{newAssignee.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{newAssignee.position} · {getStakeholderName(newAssignee.stakeholderId)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setNewAssignee(null); }}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center"
                    >
                      <X size={14} className="text-slate-500 dark:text-slate-400" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <UserPlus size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <span className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">Select new assignee...</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Multiple Assignees (for Issue To) */}
          {config.showMultipleAssignees && (
            <div className="mb-6">
              <div className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 mb-2 flex items-center gap-2">
                <Users size={14} />
                Issue To
                <span className="text-[8px] font-extrabold text-red-400 uppercase tracking-tight">Required</span>
                {newAssignees.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                    {newAssignees.length} selected
                  </span>
                )}
              </div>

              {/* Selected Assignees */}
              {newAssignees.length > 0 && (
                <div className="space-y-2 mb-3">
                  {newAssignees.map(user => (
                    <div key={user.id} className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <img
                        src={`https://picsum.photos/seed/${user.id}/100`}
                        className="w-9 h-9 rounded-full"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-slate-700 dark:text-slate-300 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user.position} · {getStakeholderName(user.stakeholderId)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveAssignee(user.id)}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                      >
                        <X size={14} className="text-slate-400 dark:text-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setShowAssigneePicker(true); setPickerMode('multiple'); }}
                className="w-full p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 active:bg-slate-50 dark:active:bg-slate-700 transition-all"
              >
                <Plus size={18} />
                <span className="text-[12px] font-semibold">Add Assignees</span>
              </button>
            </div>
          )}

          {/* Note */}
          <div className="mb-6">
            <div className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 mb-2 flex items-center gap-2">
              <FileText size={14} />
              Note
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note or comment..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[14px] text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none resize-none focus:border-slate-200 dark:focus:border-slate-600 transition-colors"
            />
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <div className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 mb-2 flex items-center gap-2">
              <Paperclip size={14} />
              Attachments
            </div>

            {/* Attachment List */}
            {attachments.length > 0 && (
              <div className="space-y-2 mb-3">
                {attachments.map(att => (
                  <div key={att.id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                      <FileText size={16} className="text-red-500" />
                    </div>
                    <span className="flex-1 text-[12px] font-semibold text-slate-700 dark:text-slate-300">{att.name}</span>
                    <button
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                    >
                      <Trash2 size={14} className="text-slate-400 dark:text-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Attachment Button */}
            <button
              onClick={() => setShowAttachOptions(!showAttachOptions)}
              className="w-full p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 active:bg-slate-50 dark:active:bg-slate-700 transition-all"
            >
              <Plus size={18} />
              <span className="text-[12px] font-semibold">Add Attachment</span>
            </button>

            {/* Attachment Options */}
            {showAttachOptions && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  onClick={handleAddAttachment}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Camera size={20} className="text-purple-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Camera</span>
                </button>
                <button
                  onClick={handleAddAttachment}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FolderOpen size={20} className="text-blue-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Files</span>
                </button>
                <button
                  onClick={handleAddAttachment}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <FileText size={20} className="text-green-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Document</span>
                </button>
              </div>
            )}
          </div>

          {/* PDF QR Stamp Option (for Approve actions) */}
          {config.showQrStamp && (
            <div className="mb-6">
              <button
                onClick={() => setPdfQrStamp(!pdfQrStamp)}
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-3 active:bg-slate-50 dark:active:bg-slate-700 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pdfQrStamp ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <QrCode size={20} className={pdfQrStamp ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">PDF QR Stamp</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Add QR code stamp to PDF attachments</p>
                </div>
                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${pdfQrStamp ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${pdfQrStamp ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </button>
            </div>
          )}

          {/* Email Notification */}
          <div className="mb-6">
            <div className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400 mb-2 flex items-center gap-2">
              <Mail size={14} />
              Email Notification
            </div>

            {/* Toggle */}
            <button
              onClick={() => setSendEmail(!sendEmail)}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-3 active:bg-slate-50 dark:active:bg-slate-700 transition-all mb-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sendEmail ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                {sendEmail ? <Bell size={20} className="text-blue-600" /> : <BellOff size={20} className="text-slate-400 dark:text-slate-500" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Send Email Notification</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Notify users in distribution list</p>
              </div>
              <div className={`w-12 h-7 rounded-full p-1 transition-colors ${sendEmail ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${sendEmail ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>

            {/* Distribution List */}
            {sendEmail && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-[11px] font-extrabold uppercase tracking-tight text-slate-400">Distribution List</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      {distributionList.length}
                    </span>
                  </div>
                  <button
                    onClick={() => { setShowUserPicker(true); setPickerMode('multiple'); }}
                    className="text-[11px] font-bold text-[#3b82f6] flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add / Edit
                  </button>
                </div>

                {/* User List */}
                {distributionList.length > 0 ? (
                  <div className="space-y-2">
                    {distributionList.map(user => (
                      <div key={user.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-700">
                        <img
                          src={`https://picsum.photos/seed/${user.id}/100`}
                          className="w-8 h-8 rounded-full"
                          alt=""
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-slate-700 dark:text-slate-300 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromDistribution(user.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                        >
                          <X size={12} className="text-slate-400 dark:text-slate-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400 dark:text-slate-500 text-center py-4">No recipients added</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* User Picker Modal - Multi-select */}
      {showUserPicker && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[90] flex items-end justify-center">
          <div
            className="w-full bg-white dark:bg-slate-800 rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{
              maxWidth: '640px',
              maxHeight: '80vh',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
            }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Select Recipients</h3>
              <button
                onClick={() => { setShowUserPicker(false); setUserSearch(''); }}
                className="text-[13px] font-bold text-[#3b82f6] px-4 py-2 rounded-full active:bg-blue-50 dark:active:bg-blue-900/30"
              >
                Done ({distributionList.length})
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <div className="bg-[#f0f2f5] dark:bg-slate-700 rounded-full flex items-center px-4 py-2">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="flex-1 bg-transparent outline-none text-[14px] text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  autoFocus
                />
              </div>
            </div>

            {/* User List with Checkboxes */}
            <div className="px-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
              <div className="space-y-2 pb-4">
                {filteredUsers.map(user => {
                  const isSelected = distributionList.some(u => u.id === user.id);

                  return (
                    <button
                      key={user.id}
                      onClick={() => handleToggleDistribution(user)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                      <img
                        src={`https://picsum.photos/seed/${user.id}/100`}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignee Picker Modal */}
      {showAssigneePicker && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[90] flex items-end justify-center">
          <div
            className="w-full bg-white dark:bg-slate-800 rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{
              maxWidth: '640px',
              maxHeight: '80vh',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
            }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                {pickerMode === 'multiple' ? 'Select Assignees' : 'Select Assignee'}
              </h3>
              {pickerMode === 'multiple' ? (
                <button
                  onClick={() => { setShowAssigneePicker(false); setUserSearch(''); }}
                  className="text-[13px] font-bold text-[#3b82f6] px-4 py-2 rounded-full active:bg-blue-50 dark:active:bg-blue-900/30"
                >
                  Done ({newAssignees.length})
                </button>
              ) : (
                <button
                  onClick={() => { setShowAssigneePicker(false); setUserSearch(''); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700"
                >
                  <X size={20} className="text-slate-500 dark:text-slate-400" />
                </button>
              )}
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <div className="bg-[#f0f2f5] dark:bg-slate-700 rounded-full flex items-center px-4 py-2">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="flex-1 bg-transparent outline-none text-[14px] text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  autoFocus
                />
              </div>
            </div>

            {/* User List */}
            <div className="px-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
              <div className="space-y-2 pb-4">
                {filteredUsers.map(user => {
                  const isSelected = pickerMode === 'multiple'
                    ? newAssignees.some(u => u.id === user.id)
                    : newAssignee?.id === user.id;

                  return (
                    <button
                      key={user.id}
                      onClick={() => pickerMode === 'multiple' ? handleToggleAssignee(user) : handleSelectAssignee(user)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700'
                      }`}
                    >
                      {pickerMode === 'multiple' && (
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                      )}
                      <img
                        src={`https://picsum.photos/seed/${user.id}/100`}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.position} · {getStakeholderName(user.stakeholderId)}</p>
                      </div>
                      {pickerMode === 'single' && isSelected && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionForm;
