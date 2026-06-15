import React from 'react';
import { FeedAttachment } from '../types';

// ---------------------------------------------------------------------------
// Shared adaptive photo grid - used by the feed card preview AND the detail
// thread so photo layout is identical everywhere.
// Layouts: 1 hero (16:9) / 2 split / 3 mixed / 4+ 2x2 grid with +N overlay.
// ---------------------------------------------------------------------------
const PhotoGrid: React.FC<{ photos: FeedAttachment[]; maxShow?: number }> = ({ photos, maxShow = 4 }) => {
  if (photos.length === 0) return null;

  const display = photos.slice(0, maxShow);
  const remaining = photos.length - maxShow;
  const imgClass = 'w-full h-full object-cover';
  const shell = 'rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 relative';

  if (display.length === 1) {
    return (
      <div className={shell}>
        <div className="relative aspect-[16/9]">
          <img src={display[0].url || `https://picsum.photos/seed/${display[0].id}/400/225`} alt={display[0].name} className={imgClass} loading="lazy" />
        </div>
      </div>
    );
  }

  if (display.length === 2) {
    return (
      <div className={shell}>
        <div className="grid grid-cols-2 gap-0.5">
          {display.map((p) => (
            <div key={p.id} className="relative aspect-[4/3] overflow-hidden">
              <img src={p.url || `https://picsum.photos/seed/${p.id}/200/150`} alt={p.name} className={imgClass} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (display.length === 3) {
    return (
      <div className={shell}>
        <div className="grid grid-cols-2 gap-0.5" style={{ aspectRatio: '16/9' }}>
          <div className="relative overflow-hidden row-span-2">
            <img src={display[0].url || `https://picsum.photos/seed/${display[0].id}/200/225`} alt={display[0].name} className={imgClass} loading="lazy" />
          </div>
          <div className="grid grid-rows-2 gap-0.5">
            {display.slice(1).map((p) => (
              <div key={p.id} className="relative overflow-hidden">
                <img src={p.url || `https://picsum.photos/seed/${p.id}/200/112`} alt={p.name} className={imgClass} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className="grid grid-cols-2 gap-0.5">
        {display.slice(0, 4).map((p, idx) => (
          <div key={p.id} className="relative aspect-[4/3] overflow-hidden">
            <img src={p.url || `https://picsum.photos/seed/${p.id}/200/150`} alt={p.name} className={imgClass} loading="lazy" />
            {idx === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-white text-lg font-extrabold">+{remaining}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
