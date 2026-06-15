import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, MoreHorizontal, Send, X, Image as ImageIcon,
  FileText, Reply, Pencil, Trash2, Clock, Tag, Compass, Users, Calendar,
  MapPin, Layers, AlertTriangle, FileInput, ChevronDown, ChevronUp, Lock, EyeOff,
  Camera, Plus, FolderOpen
} from 'lucide-react';
import { FeedItem, FeedComment, FeedAttachment, StreamItem, getStatusConfig, SUBMITTAL_STATUS_CONFIG, ISSUE_STATUS_CONFIG } from '../types';
import FeedStreamItem from './feed-stream-item';
import OverlayHeader from './overlay-header';
import ActionSheet from './ActionSheet';
import ActionForm, { ActionFormType, ActionFormData } from './ActionForm';
import { projectUsers } from './mockData';

interface FeedDetailProps {
  item: FeedItem;
  onClose: () => void;
}

const EDIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const TYPE_ICON: Record<string, React.ReactNode> = {
  Submittal: <Layers size={14} />,
  Issue: <AlertTriangle size={14} />,
  RFS: <FileInput size={14} />,
};

const TYPE_COLORS: Record<string, string> = {
  Submittal: 'bg-slate-50 text-slate-600 border-slate-100',
  Issue: 'bg-slate-50 text-slate-600 border-slate-100',
  RFS: 'bg-slate-50 text-slate-600 border-slate-100',
};

// File type color configuration
const FILE_TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pdf: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'PDF' },
  doc: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'DOC' },
  docx: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'DOCX' },
  xls: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'XLS' },
  xlsx: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'XLSX' },
  dwg: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'DWG' },
  rvt: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'RVT' },
  ifc: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'IFC' },
  default: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-l-slate-300', label: 'FILE' },
};

const getFileTypeConfig = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return FILE_TYPE_CONFIG[ext] || FILE_TYPE_CONFIG.default;
};

const FeedDetail: React.FC<FeedDetailProps> = ({ item, onClose }) => {
  const [stream, setStream] = useState<StreamItem[]>(item.stream);
  const [commentText, setCommentText] = useState('');
  const [commentAttachments, setCommentAttachments] = useState<FeedAttachment[]>([]);
  const [replyTo, setReplyTo] = useState<FeedComment | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionFormType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamEndRef = useRef<HTMLDivElement>(null);

  const statusConfig = getStatusConfig(item.type, item.status);
  const statusLabel = statusConfig.label;
  const statusColor = statusConfig.color;

  const now = Date.now();

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stream.length]);

  const handleSendComment = () => {
    if (!commentText.trim() && commentAttachments.length === 0) return;
    const newComment: FeedComment = {
      id: `c-${Date.now()}`,
      userId: 'm1',
      userName: 'Saski Amora',
      userStakeholder: 'MC',
      text: commentText.trim(),
      timestamp: 'Just now',
      timestampMs: Date.now(),
      attachments: commentAttachments.length > 0 ? [...commentAttachments] : undefined,
      parentId: replyTo?.id,
    };
    setStream(prev => [...prev, { kind: 'comment', data: newComment }]);
    setCommentText('');
    setCommentAttachments([]);
    setReplyTo(null);
  };

  const handleDeleteComment = (commentId: string) => {
    setStream(prev => prev.filter(s => !(s.kind === 'comment' && s.data.id === commentId)));
  };

  const handleSaveEdit = (commentId: string) => {
    setStream(prev => prev.map(s => {
      if (s.kind === 'comment' && s.data.id === commentId) {
        return { ...s, data: { ...s.data, text: editText, isEdited: true } };
      }
      return s;
    }));
    setEditingComment(null);
    setEditText('');
  };

  const handleAddMockAttachment = () => {
    const mockFile: FeedAttachment = {
      id: `att-${Date.now()}`,
      name: `Document_${commentAttachments.length + 1}.pdf`,
      type: 'pdf',
      size: '1.2 MB',
    };
    setCommentAttachments(prev => [...prev, mockFile]);
  };

  // Find parent comment for a reply
  const findParentComment = (parentId: string): FeedComment | undefined => {
    for (const s of stream) {
      if (s.kind === 'comment' && s.data.id === parentId) return s.data;
    }
    return undefined;
  };

  // Handle action selection from action sheet
  const handleActionSelect = (actionKey: string) => {
    setSelectedAction(actionKey as ActionFormType);
    setShowActionForm(true);
  };

  // Handle action form submission
  const handleActionFormSubmit = (data: ActionFormData) => {
    console.log('Action submitted:', data);
    // In production, this would send to API and update the item status
    // For now, we'll just log it and close the form
    setShowActionForm(false);
    setSelectedAction(null);
  };

  // Get current assignee as ProjectUser
  const currentAssignee = projectUsers.find(u => u.id === item.assignee.id);

  // Separate media (images) from documents
  const mediaAttachments = item.attachments.filter(a => a.type === 'image');
  const documentAttachments = item.attachments.filter(a => a.type !== 'image');

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[60] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Sticky Header */}
      <OverlayHeader
        onBack={onClose}
        center={
          <>
            {/* Private Badge */}
            {(item.visibility === 'private' || item.visibility === 'both') && (
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                <Lock size={9} />
                Private
              </span>
            )}
            {/* Restricted Badge */}
            {(item.visibility === 'restricted' || item.visibility === 'both') && (
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                <EyeOff size={9} />
                Restricted
              </span>
            )}
            {/* Status Badge - solid with alpha background */}
            <span
              className="inline-flex text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide"
              style={{ color: statusColor, backgroundColor: `${statusColor}20` }}
            >
              {statusLabel}
            </span>
          </>
        }
        right={
          <button
            onClick={() => setShowActionSheet(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700 transition-all"
          >
            <MoreHorizontal size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        }
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-4 pt-4" style={{ paddingBottom: 'max(7rem, calc(env(safe-area-inset-bottom) + 7rem))' }}>

          {/* Ref No + Title */}
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight mb-2">
            <span className="font-extrabold text-slate-500">#{item.refNo}</span>
            <span className="text-slate-300 dark:text-slate-600 mx-2">|</span>
            {item.title}
          </h1>

          {/* Story Line - Creator submitted to Assignee */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={`https://picsum.photos/seed/${item.createdBy.id}/100`}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
              alt=""
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">{item.createdBy.name}</span>
              <span className="text-slate-400 dark:text-slate-500"> ({item.createdBy.stakeholder}) submitted to </span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{item.assignee.name}</span>
              <span className="text-slate-400 dark:text-slate-500"> ({item.assignee.stakeholder})</span>
            </p>
          </div>

          {/* Meta Info Row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap text-[10px]">
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <Clock size={10} />
              <span className="font-bold">{item.createdAt}</span>
            </div>
            <div className="h-1 w-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <MapPin size={10} />
              <span className="font-medium">{item.project}</span>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{item.description}</p>
          )}

          {/* Attachments Section - Photos + Documents together */}
          {(mediaAttachments.length > 0 || documentAttachments.length > 0) && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400 dark:text-slate-500">Attachments</span>
                  <div className="flex items-center gap-1.5">
                    {mediaAttachments.length > 0 && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <ImageIcon size={9} />
                        {mediaAttachments.length}
                      </span>
                    )}
                    {documentAttachments.length > 0 && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FileText size={9} />
                        {documentAttachments.length}
                      </span>
                    )}
                  </div>
                </div>
                {mediaAttachments.length > 1 && (
                  <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <span>Swipe</span>
                    <ChevronRight size={10} />
                  </span>
                )}
              </div>

              {/* Photo Gallery */}
              {mediaAttachments.length > 0 && (
                <div className="relative mb-2">
                  <div
                    className="flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-4 px-4"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {mediaAttachments.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="flex-shrink-0 snap-center first:snap-start last:snap-end"
                        style={{ width: mediaAttachments.length === 1 ? '100%' : 'calc(100% - 2rem)' }}
                      >
                        <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800 cursor-pointer group">
                          <div className="relative aspect-[4/3]">
                            <img
                              src={photo.url || `https://picsum.photos/seed/${photo.id}/400/300`}
                              alt={photo.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                              <ImageIcon size={10} className="text-white" />
                              <span className="text-[9px] font-extrabold text-white">{idx + 1}/{mediaAttachments.length}</span>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-3">
                              <p className="text-[10px] font-bold text-white/95 truncate">{photo.name}</p>
                              {photo.size && (
                                <p className="text-[9px] font-medium text-white/60 mt-0.5">{photo.size}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {mediaAttachments.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-2">
                      {mediaAttachments.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === 0 ? 'w-4 bg-[#3b82f6]' : 'w-1.5 bg-slate-200 dark:bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Documents List */}
              {documentAttachments.length > 0 && (
                <div className="space-y-2">
                  {documentAttachments.map(att => {
                    const typeConfig = getFileTypeConfig(att.name);
                    return (
                      <div key={att.id} className={`flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl px-2.5 py-2 border border-slate-100 dark:border-slate-700 border-l-[3px] ${typeConfig.border} cursor-pointer active:scale-[0.98] transition-transform group shadow-sm`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${typeConfig.bg} ${typeConfig.text}`}>
                          <FileText size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-[#3b82f6] transition-colors">{att.name}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${typeConfig.bg} ${typeConfig.text}`}>
                              {typeConfig.label}
                            </span>
                            {att.size && <span className="text-[9px] text-slate-400 dark:text-slate-500">{att.size}</span>}
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-[#3b82f6] transition-colors flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Collapsible Details - Metadata only */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between py-3 px-1 mb-2 active:scale-[0.98] transition-all"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400 dark:text-slate-500">Details</span>
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              {showDetails ? <ChevronUp size={12} className="text-slate-500 dark:text-slate-400" /> : <ChevronDown size={12} className="text-slate-500 dark:text-slate-400" />}
            </div>
          </button>

          {showDetails && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm mb-4 space-y-3">
              {item.submissionType && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
                    <Tag size={14} /> Type
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{item.submissionType}</span>
                </div>
              )}
              {item.discipline && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
                    <Compass size={14} /> Discipline
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{item.discipline}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
                  <Users size={14} /> Assignee
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={`https://picsum.photos/seed/${item.assignee.id}/100`}
                    className="w-6 h-6 rounded-full border border-white dark:border-slate-700 shadow-sm"
                    alt=""
                  />
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{item.assignee.name}</span>
                </div>
              </div>
              {item.dueDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
                    <Calendar size={14} /> Due Date
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{item.dueDate}</span>
                </div>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50 dark:border-slate-700">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Divider before stream with total count */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-300 dark:text-slate-600">Activity & Comments</span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                {stream.length}
              </span>
            </div>
            <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-700" />
          </div>

          {/* Activity + Comment Stream - Unified Facebook Style */}
          <div className="space-y-2">
            {stream.map((entry) => {
              // ===== ACTIVITY =====
              if (entry.kind === 'activity') {
                const act = entry.data;
                return (
                  <FeedStreamItem
                    key={act.id}
                    entry={entry}
                    itemType={item.type}
                    footer={
                      <button
                        onClick={() => {
                          setReplyTo({ id: act.id, userName: act.userName, text: '', timestamp: act.timestamp, timestampMs: 0 });
                          inputRef.current?.focus();
                        }}
                        className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 hover:underline active:text-slate-700 dark:active:text-slate-300 transition-colors"
                      >
                        Reply
                      </button>
                    }
                  />
                );
              }

              // ===== COMMENT =====
              const comment = entry.data;
              const canModify = (now - comment.timestampMs) < EDIT_WINDOW_MS && comment.userId === 'm1';
              const isReply = !!comment.parentId;
              const parentComment = comment.parentId ? findParentComment(comment.parentId) : null;
              const isEditing = editingComment === comment.id;

              return (
                <FeedStreamItem
                  key={comment.id}
                  entry={entry}
                  itemType={item.type}
                  isReply={isReply}
                  replyToName={parentComment?.userName}
                  bodyOverride={isEditing ? (
                    <div className="mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full text-[14px] text-slate-700 dark:text-slate-200 bg-[#f0f2f5] dark:bg-slate-700 rounded-2xl p-3 outline-none border-none resize-none min-h-[60px]"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2 justify-end">
                        <button
                          onClick={() => { setEditingComment(null); setEditText(''); }}
                          className="text-[12px] font-bold text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="text-[12px] font-bold text-white bg-[#3b82f6] px-4 py-1.5 rounded-full active:scale-95 transition-all"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : undefined}
                  footer={!isEditing ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setReplyTo(comment); inputRef.current?.focus(); }}
                        className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 hover:underline active:text-slate-700 dark:active:text-slate-300 transition-colors"
                      >
                        Reply
                      </button>
                      {canModify && (
                        <>
                          <button
                            onClick={() => { setEditingComment(comment.id); setEditText(comment.text); }}
                            className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 hover:underline active:text-slate-700 dark:active:text-slate-300 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 hover:underline active:text-red-500 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ) : undefined}
                />
              );
            })}
            <div ref={streamEndRef} />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Comment Input */}
      <div
        className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-700"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        {/* Reply indicator - Facebook style */}
        {replyTo && (
          <div className="px-4 pt-2 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5 py-2 px-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <Reply size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <span className="text-[13px] text-slate-500 dark:text-slate-400">Replying to</span>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{replyTo.userName}</span>
              <button
                onClick={() => setReplyTo(null)}
                className="ml-auto w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 dark:active:bg-slate-500 transition-colors"
              >
                <X size={14} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Attachment preview */}
        {commentAttachments.length > 0 && (
          <div className="px-4 pt-2 flex gap-2 overflow-x-auto no-scrollbar">
            {commentAttachments.map(att => (
              <div key={att.id} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg px-2.5 py-1.5 border border-slate-100 dark:border-slate-600 flex-shrink-0">
                <FileText size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">{att.name}</span>
                <button
                  onClick={() => setCommentAttachments(prev => prev.filter(a => a.id !== att.id))}
                  className="w-4 h-4 flex items-center justify-center rounded-full active:bg-slate-200 dark:active:bg-slate-600"
                >
                  <X size={10} className="text-slate-400 dark:text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="px-3 pt-1.5 flex items-center gap-2">
          {/* Left buttons - Camera & More */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleAddMockAttachment}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 active:scale-95 transition-all"
            >
              <Camera size={20} />
            </button>
            <button
              onClick={() => setShowAttachOptions(!showAttachOptions)}
              className={`w-9 h-9 flex items-center justify-center rounded-full active:scale-95 transition-all ${
                showAttachOptions
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600'
              }`}
            >
              <Plus size={20} className={showAttachOptions ? 'rotate-45' : ''} style={{ transition: 'transform 0.2s' }} />
            </button>
          </div>

          {/* Input field */}
          <div className="flex-1 bg-[#f0f2f5] dark:bg-slate-700 rounded-full flex items-center px-3.5 py-1.5 min-h-[36px]">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }}
              onFocus={() => setShowAttachOptions(false)}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent outline-none text-[14px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-0"
            />
          </div>

          {/* Send button - always visible on right */}
          <button
            onClick={handleSendComment}
            disabled={!commentText.trim() && commentAttachments.length === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all flex-shrink-0 ${
              commentText.trim() || commentAttachments.length > 0
                ? 'text-[#3b82f6]'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          >
            <Send size={20} />
          </button>
        </div>

        {/* Attachment Options Panel - Keyboard style */}
        {showAttachOptions && (
          <div className="bg-[#f0f2f5] dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600 px-3 py-3">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  handleAddMockAttachment();
                  setShowAttachOptions(false);
                }}
                className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-800 active:bg-slate-50 dark:active:bg-slate-700 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                  <ImageIcon size={24} className="text-white" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Photo Library</span>
              </button>

              <button
                onClick={() => {
                  handleAddMockAttachment();
                  setShowAttachOptions(false);
                }}
                className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-800 active:bg-slate-50 dark:active:bg-slate-700 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                  <FolderOpen size={24} className="text-white" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Files</span>
              </button>

              <button
                onClick={() => {
                  handleAddMockAttachment();
                  setShowAttachOptions(false);
                }}
                className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-800 active:bg-slate-50 dark:active:bg-slate-700 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                  <Camera size={24} className="text-white" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Camera</span>
              </button>

              <button
                onClick={() => {
                  handleAddMockAttachment();
                  setShowAttachOptions(false);
                }}
                className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-800 active:bg-slate-50 dark:active:bg-slate-700 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                  <FileText size={24} className="text-white" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Document</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Sheet */}
      <ActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        itemType={item.type}
        currentStatus={item.status}
        onActionSelect={handleActionSelect}
      />

      {/* Action Form */}
      {selectedAction && (
        <ActionForm
          isOpen={showActionForm}
          onClose={() => { setShowActionForm(false); setSelectedAction(null); }}
          actionType={selectedAction}
          onSubmit={handleActionFormSubmit}
          currentAssignee={currentAssignee}
          ccRecipients={item.ccRecipients?.map(u => projectUsers.find(pu => pu.id === u.id)).filter(Boolean) as any}
        />
      )}
    </div>
  );
};

export default FeedDetail;
