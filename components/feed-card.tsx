import React from 'react';
import { FeedItem } from '../types';
import FeedStreamItem from './feed-stream-item';

// ---------------------------------------------------------------------------
// Feed Card - minimal: #refNo + title + last activity/comment.
// The last activity is rendered with the SAME design as the detail thread
// (shared FeedStreamItem) so the preview matches the destination.
// ---------------------------------------------------------------------------
interface FeedCardProps {
  item: FeedItem;
  onSelect: (item: FeedItem) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, onSelect }) => {
  const last = item.stream[item.stream.length - 1];

  return (
    <button
      onClick={() => onSelect(item)}
      aria-label={`${item.type} ${item.refNo}: ${item.title}`}
      className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-200 active:scale-[0.98] hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 cursor-pointer"
    >
      {/* #refNo + title */}
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[14px] leading-snug line-clamp-2">
        <span className="font-extrabold text-slate-400 dark:text-slate-500">#{item.refNo}</span>{' '}
        {item.title}
      </h3>

      {/* Last activity / comment - same design as detail */}
      {last && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <FeedStreamItem entry={last} itemType={item.type} clamp />
        </div>
      )}
    </button>
  );
};

export default FeedCard;
