import React from 'react';
import { StreamItem, FeedItemType, getStatusConfig } from '../types';
import PhotoGrid from './feed-photo-grid';
import { FileChipList } from './feed-file-chip';

// ---------------------------------------------------------------------------
// Action labels/descriptions for status-change activities (shared by the feed
// card preview AND the detail thread so activity items read identically).
// ---------------------------------------------------------------------------
const SUBMITTAL_ACTION_CONFIG: Record<string, { label: string; description: string }> = {
  submit: { label: 'submitted', description: 'Sent for review and approval' },
  resubmit: { label: 'resubmitted', description: 'Submitted again with corrections' },
  cancel: { label: 'cancelled', description: 'This submittal is no longer needed' },
  obsolete: { label: 'marked as obsolete', description: 'No longer valid or applicable' },
  supersede: { label: 'superseded', description: 'Replaced by a newer version' },
  approve_a: { label: 'approved (A)', description: 'No comments. Proceed to construction' },
  approve_b: { label: 'approved (B)', description: 'Approved with comments noted' },
  reject_c: { label: 'rejected (C)', description: 'Revise and resubmit required' },
  issue_to: { label: 'issued to stakeholders', description: 'Distributed for action' },
  for_info: { label: 'marked for information (D)', description: 'For reference only' },
};

const ISSUE_ACTION_CONFIG: Record<string, { label: string; description: string }> = {
  open: { label: 'opened issue', description: 'New issue raised for attention' },
  reopen: { label: 'reopened issue', description: 'Issue needs more work' },
  close: { label: 'closed issue', description: 'Resolution verified and confirmed' },
  complete: { label: 'marked complete', description: 'Work done. Awaiting verification' },
  cancel: { label: 'cancelled issue', description: 'No longer relevant' },
};

export const getActionConfig = (type: string, action: string): { label: string; description: string } => {
  if (type === 'Issue') {
    return ISSUE_ACTION_CONFIG[action] ?? { label: action, description: '' };
  }
  return SUBMITTAL_ACTION_CONFIG[action] ?? { label: action, description: '' };
};

// ---------------------------------------------------------------------------
// Stream item - unified presentation of an activity or comment.
// Interactive bits (reply/edit/delete, edit textarea) are injected by the
// caller via `footer` / `bodyOverride` so the detail keeps its state logic.
// ---------------------------------------------------------------------------
interface FeedStreamItemProps {
  entry: StreamItem;
  itemType: FeedItemType;
  isReply?: boolean;          // indent + smaller avatar (detail replies)
  replyToName?: string;       // comment reply parent name (blue prefix)
  bodyOverride?: React.ReactNode; // replaces the text/description body (e.g. edit textarea)
  footer?: React.ReactNode;   // actions row (Reply/Edit/Delete) - detail only
  clamp?: boolean;            // truncate note/text to 2 lines (card preview - uniform heights)
}

const FeedStreamItem: React.FC<FeedStreamItemProps> = ({
  entry, itemType, isReply, replyToName, bodyOverride, footer, clamp,
}) => {
  const clampClass = clamp ? 'line-clamp-2' : '';
  const { userId, userName, userStakeholder, timestamp, attachments } = entry.data;
  const images = (attachments || []).filter((a) => a.type === 'image');
  const files = (attachments || []).filter((a) => a.type !== 'image');

  // Activity-specific
  const actStatus = entry.kind === 'activity' ? getStatusConfig(itemType, entry.data.statusKey) : null;
  const actionConfig = entry.kind === 'activity' ? getActionConfig(itemType, entry.data.action) : null;
  const description = entry.kind === 'activity' ? entry.data.description : undefined;
  // Comment-specific
  const text = entry.kind === 'comment' ? entry.data.text : '';
  const isEdited = entry.kind === 'comment' ? entry.data.isEdited : false;

  return (
    <div className={`flex gap-3 items-start ${isReply ? 'ml-[52px]' : ''}`}>
      {/* Avatar */}
      <img
        src={`https://picsum.photos/seed/${userId}/100`}
        className={`rounded-full flex-shrink-0 ${isReply ? 'w-7 h-7' : 'w-9 h-9'}`}
        alt=""
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name · stakeholder · timestamp */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{userName}</span>
          {userStakeholder && (
            <span className="text-[12px] text-slate-500 dark:text-slate-400">· {userStakeholder}</span>
          )}
          <span className="text-[12px] text-slate-400 dark:text-slate-500">· {timestamp}</span>
          {isEdited && (
            <span className="text-[12px] text-slate-400 dark:text-slate-500 italic">· edited</span>
          )}
        </div>

        {/* Body */}
        {entry.kind === 'activity' ? (
          <>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[14px] text-slate-700 dark:text-slate-300">{actionConfig!.label}</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: actStatus!.color, backgroundColor: `${actStatus!.color}15` }}
              >
                {actStatus!.label}
              </span>
            </div>
            {actionConfig!.description && (
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{actionConfig!.description}</p>
            )}
            {description && (
              <p className={`text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed ${clampClass}`}>{description}</p>
            )}
          </>
        ) : (
          bodyOverride ?? (
            <p className={`text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed mt-0.5 ${clampClass}`}>
              {replyToName && <span className="text-[#3b82f6] font-semibold">{replyToName} </span>}
              {text}
            </p>
          )
        )}

        {/* Attachments (hidden while editing via bodyOverride) */}
        {!bodyOverride && (images.length > 0 || files.length > 0) && (
          <div className="mt-2 space-y-2">
            <PhotoGrid photos={images} />
            <FileChipList files={files} />
          </div>
        )}

        {/* Footer actions */}
        {footer && <div className="mt-1.5">{footer}</div>}
      </div>
    </div>
  );
};

export default FeedStreamItem;
