
import React, { useState } from 'react';
import { 
  Info,
  Home,
  Tag,
  Folder,
  ExternalLink,
  Target,
  Briefcase,
  Menu,
  PieChart,
  MapPin,
  Map,
  BarChart,
  Triangle,
  LayoutGrid,
  Percent,
  ChevronDown,
  Camera,
  Layers,
  Calendar
} from 'lucide-react';

interface InfoItemProps {
  icon: any;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-50 dark:border-slate-700/60 last:border-0">
    <div className="mt-0.5 text-slate-400 dark:text-slate-500">
      <Icon size={18} />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{label}</span>
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{value}</span>
    </div>
  </div>
);

// Define explicit interface for DetailSection props with optional children to satisfy TS requirements for wrapper components
interface DetailSectionProps {
  title: string;
  icon: any;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

// Updated DetailSection to use the defined interface
const DetailSection: React.FC<DetailSectionProps> = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-800 border-b border-slate-50 dark:border-slate-700/60"
      >
        <div className="flex items-center gap-2">
          <div className="text-blue-500"><Icon size={18} /></div>
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">{title}</h2>
        </div>
        <ChevronDown size={18} className={`text-slate-300 dark:text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-6 pt-2">{children}</div>}
    </div>
  );
};

const ProjectDetails: React.FC = () => {
  const sitePhotos = [
    'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80&w=400'
  ];

  return (
    <div className="flex flex-col gap-2 py-2 pb-24 animate-in fade-in duration-500">
      
      {/* Photo Gallery Section */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-blue-500" />
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Site Gallery</h2>
          </div>
        </div>
        <div className="p-4 overflow-x-auto no-scrollbar flex gap-3">
          {sitePhotos.map((url, i) => (
            <div key={i} className="min-w-[140px] h-[100px] rounded-2xl overflow-hidden shadow-sm relative group">
              <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Site" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
          <button className="min-w-[140px] h-[100px] border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-300 dark:text-slate-500">
            <Layers size={20} />
            <span className="text-[10px] font-bold">View All</span>
          </button>
        </div>
      </div>

      <DetailSection title="General Information" icon={Info}>
        <div className="grid grid-cols-2 gap-x-6">
          <InfoItem icon={Home} label="Project Type" value="Commercial HQ" />
          <InfoItem icon={Tag} label="Project No" value="KALA-2025-01" />
          <InfoItem icon={Folder} label="Project Name" value="Kala Corporate HQ" />
          <InfoItem icon={ExternalLink} label="Abbreviation" value="KCHQ" />
        </div>
      </DetailSection>

      <DetailSection title="Financial & Schedule" icon={Calendar}>
        <div className="grid grid-cols-2 gap-x-6">
          <InfoItem icon={Briefcase} label="Contract Value" value="$42.5M" />
          <InfoItem icon={Target} label="Target Start" value="Mar 2024" />
          <InfoItem icon={Percent} label="Completion" value="65.4%" />
          <InfoItem icon={Target} label="Target End" value="Oct 2025" />
        </div>
      </DetailSection>

      <DetailSection title="Site Metrics" icon={LayoutGrid} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-x-6">
          <InfoItem icon={BarChart} label="Levels" value="12 Storeys" />
          <InfoItem icon={PieChart} label="Total GLA" value="18,500 sqm" />
          <InfoItem icon={Triangle} label="Footprint" value="4,200 sqm" />
          <InfoItem icon={MapPin} label="Car Parking" value="280 Bays" />
        </div>
      </DetailSection>

      <DetailSection title="Location" icon={Map} defaultOpen={false}>
        <InfoItem icon={Map} label="Country" value="Vietnam" />
        <InfoItem icon={Map} label="City" value="TP. Hồ Chí Minh" />
        <InfoItem icon={MapPin} label="Address" value="23rd District, Tech Corridor A" />
      </DetailSection>

    </div>
  );
};

export default ProjectDetails;
