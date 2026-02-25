import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantStyles = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-2xl',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={`bg-slate-200 ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={{ width, height }}
    />
  );
};

// Pre-built skeleton compositions
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm space-y-4">
    <div className="flex items-center gap-2">
      <Skeleton variant="rounded" width={60} height={24} />
      <Skeleton variant="rounded" width={80} height={24} />
    </div>
    <Skeleton variant="text" className="w-full h-5" />
    <Skeleton variant="text" className="w-3/4 h-5" />
    <Skeleton variant="rounded" className="w-full h-32" />
    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={28} height={28} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
      <Skeleton variant="rounded" width={60} height={28} />
    </div>
  </div>
);

export const SkeletonFeedItem: React.FC = () => (
  <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Skeleton variant="rounded" width={60} height={22} />
        <Skeleton variant="circular" width={4} height={4} />
        <Skeleton variant="text" width={60} height={12} />
      </div>
      <Skeleton variant="rounded" width={70} height={22} />
    </div>
    <Skeleton variant="text" className="w-full h-5 mb-2" />
    <Skeleton variant="text" className="w-2/3 h-5 mb-3" />
    <Skeleton variant="rounded" className="w-full h-40 mb-3" />
    <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl mb-3">
      <Skeleton variant="circular" width={28} height={28} />
      <div className="flex-1">
        <Skeleton variant="text" className="w-32 h-3 mb-1" />
        <Skeleton variant="text" className="w-20 h-2" />
      </div>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
      <div className="flex gap-1.5">
        <Skeleton variant="rounded" width={50} height={20} />
        <Skeleton variant="rounded" width={50} height={20} />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton variant="text" width={20} height={14} />
        <Skeleton variant="text" width={20} height={14} />
      </div>
    </div>
  </div>
);

export const SkeletonStatCard: React.FC = () => (
  <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <Skeleton variant="text" className="w-24 h-3" />
      <Skeleton variant="circular" width={32} height={32} />
    </div>
    <Skeleton variant="text" className="w-16 h-8 mb-2" />
    <Skeleton variant="text" className="w-20 h-3" />
  </div>
);

export default Skeleton;
