
import React from 'react';

const ActivityMap: React.FC = () => {
  // Mock data for the heatmap
  const rows = 4;
  const cols = 9;
  const intensities = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 3, 2, 1, 2, 3, 1, 0, 2, 1, 3, 2, 1, 0, 1, 2, 3, 1, 0, 2, 1, 3, 2, 1, 0, 1, 2];
  
  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-[#f0f3e8] dark:bg-slate-800';
      case 1: return 'bg-[#d6e2b1] dark:bg-slate-700';
      case 2: return 'bg-[#abc378] dark:bg-slate-600';
      case 3: return 'bg-[#8ca35b] dark:bg-slate-500';
      default: return 'bg-[#f0f3e8] dark:bg-slate-800';
    }
  };

  return (
    <div className="grid grid-cols-9 gap-2">
      {intensities.map((intensity, idx) => (
        <div 
          key={idx} 
          className={`h-6 rounded-md transition-all ${getColor(intensity)} hover:scale-110`}
        />
      ))}
    </div>
  );
};

export default ActivityMap;
