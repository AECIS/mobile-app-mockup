import React, { useState } from 'react';
import {
  FileText, CheckCircle, Clock, AlertCircle, Loader2,
  HardHat, Wrench, AlertTriangle, X, MapPin, Settings2, Eye
} from 'lucide-react';
import OverlayHeader from '../overlay-header';
import { DailyActivity, DailyReportSummary, SyncStatus, DailyPhoto, DailyDocument } from './types';
import { mockDailyActivity, mockMaterialDailyActivity } from './mockData';
import PhotoDetail from './PhotoDetail';
import PhotoLocationManager, { PhotoLocation } from './PhotoLocationManager';

interface DailyReportDetailProps {
  report: DailyReportSummary;
  onClose: () => void;
}

type TabType = 'information' | 'attachments' | 'photos';

// Sync status bar
const SyncStatusBar: React.FC<{ status: SyncStatus; lastSync?: string }> = ({ status, lastSync }) => {
  const config: Record<SyncStatus, { bg: string; border: string; text: string; icon: React.ReactNode; label: string }> = {
    synced: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle size={14} />, label: 'Synced' },
    pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: <Clock size={14} />, label: 'Pending sync' },
    syncing: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: <Loader2 size={14} className="animate-spin" />, label: 'Syncing...' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: <AlertCircle size={14} />, label: 'Sync failed' },
  };

  const { bg, border, text, icon, label } = config[status];

  return (
    <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${bg} border ${border}`}>
      <div className={`flex items-center gap-2 ${text}`}>
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      {lastSync && (
        <span className="text-[10px] text-slate-500">Last sync: {lastSync}</span>
      )}
    </div>
  );
};

// Progress slider component
const ProgressSlider: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  color?: string;
  disabled?: boolean;
}> = ({ label, value, onChange, color = '#3b82f6', disabled = false }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-sm font-bold text-slate-700">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: color,
        }}
      />
    </div>
  );
};

// Field card component
const FieldCard: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, iconBg, title, children }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <h3 className="text-xs font-extrabold uppercase tracking-tight text-slate-400">{title}</h3>
      </div>
      {children}
    </div>
  );
};

// Number input field
const NumberInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 bg-[#fafafa] rounded-xl px-3 py-2 text-right font-bold text-lg text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
      />
    </div>
  );
};

// Textarea field
const TextareaField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#fafafa] rounded-xl px-4 py-3 text-sm text-slate-700 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] min-h-[80px] resize-none"
      />
    </div>
  );
};

// Impact selector
const ImpactSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const options = [
    { id: 'none', label: 'None', color: 'bg-slate-100 text-slate-600' },
    { id: 'low', label: 'Low', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'medium', label: 'Medium', color: 'bg-amber-50 text-amber-600' },
    { id: 'high', label: 'High', color: 'bg-blue-50 text-blue-600' },
    { id: 'critical', label: 'Critical', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
            value === option.id
              ? `${option.color} ring-2 ring-offset-1 ring-current`
              : 'bg-slate-50 text-slate-400'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Document list item
const DocumentItem: React.FC<{ doc: DailyDocument; onRemove: () => void }> = ({ doc, onRemove }) => {
  const typeConfig: Record<string, { bg: string; text: string; border: string }> = {
    pdf: { bg: 'bg-red-50', text: 'text-red-500', border: 'border-l-red-400' },
    xlsx: { bg: 'bg-green-50', text: 'text-green-500', border: 'border-l-green-400' },
    docx: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-l-blue-400' },
  };

  const config = typeConfig[doc.type] || typeConfig.pdf;

  return (
    <div className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm ${config.border} border-l-[3px]`}>
      <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.text} flex items-center justify-center flex-shrink-0`}>
        <FileText size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-700 truncate">{doc.name}</p>
        <p className="text-[10px] text-slate-400">{doc.size} • {doc.uploadedAt}</p>
      </div>
      <button
        onClick={onRemove}
        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-100 hover:text-slate-500 transition-all"
      >
        <X size={14} />
      </button>
    </div>
  );
};

const DailyReportDetail: React.FC<DailyReportDetailProps> = ({ report, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('information');
  const [selectedPhotoForDetail, setSelectedPhotoForDetail] = useState<DailyPhoto | null>(null);
  const [showLocationManager, setShowLocationManager] = useState(false);

  // Get activity data based on report type
  const activity: DailyActivity = report.type === 'material' ? mockMaterialDailyActivity : mockDailyActivity;

  // Photo locations state (converted from activity.locations for manager)
  const [photoLocations, setPhotoLocations] = useState<PhotoLocation[]>(() =>
    activity.locations.map((loc) => ({
      id: loc.id,
      dTagId: loc.id, // Using same id for mock
      dTagPath: loc.path,
      dTagLabel: loc.name,
      photos: activity.photos
        .filter((p) => p.locationId === loc.id)
        .map((p) => ({
          id: p.id,
          url: p.url,
          caption: p.caption,
          uploadedAt: p.uploadedAt,
        })),
    }))
  );

  // Form state
  const [manPowerQty, setManPowerQty] = useState(activity.manPowerQuantity);
  const [manPowerRemark, setManPowerRemark] = useState(activity.manPowerRemark);
  const [incidentQty, setIncidentQty] = useState(activity.incidentQuantity);
  const [incidentImpact, setIncidentImpact] = useState(activity.incidentImpact);
  const [incidentRemark, setIncidentRemark] = useState(activity.incidentRemark);
  const [equipmentQty, setEquipmentQty] = useState(activity.equipmentQuantity);
  const [equipmentRemark, setEquipmentRemark] = useState(activity.equipmentRemark);
  const [workStart, setWorkStart] = useState(activity.workingTimeStart);
  const [workEnd, setWorkEnd] = useState(activity.workingTimeEnd);
  const [actualProgress, setActualProgress] = useState(activity.actualProgressPercentage);
  const [plannedProgress] = useState(activity.plannedProgressPercentage);
  const [documents, setDocuments] = useState(activity.documents);

  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate total photos from locations
  const totalPhotos = photoLocations.reduce((sum, loc) => sum + loc.photos.length, 0);

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'information', label: 'Information' },
    { id: 'attachments', label: 'Attachments', count: documents.length },
    { id: 'photos', label: 'Photos', count: totalPhotos },
  ];

  const progressDelta = actualProgress - plannedProgress;

  return (
    <div className="fixed inset-0 bg-[#faf9f6] z-[70] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <OverlayHeader
        onBack={onClose}
        center={
          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{formattedDate}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              {report.type === 'general' ? 'General Report' : 'Material Report'} • {report.stakeholder}
            </p>
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-[0.95] transition-all"
              aria-label="Preview PDF"
            >
              <Eye size={18} />
            </button>
            <button
              className="px-4 py-2 rounded-full bg-[#3b82f6] text-white text-sm font-bold active:scale-[0.95] transition-all"
            >
              Submit
            </button>
          </div>
        }
      />

      {/* Sync Status */}
      <div className="flex-shrink-0 px-4 py-3">
        <SyncStatusBar status={activity.syncStatus} lastSync={activity.lastSyncTime} />
      </div>

      {/* Tab Bar */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-[#3b82f6] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="px-3 pb-6" style={{ paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 0.75rem))' }}>
          {/* Information Tab */}
          {activeTab === 'information' && (
            <div className="space-y-4">
              {/* Man Power */}
              <FieldCard
                icon={<HardHat size={16} className="text-amber-600" />}
                iconBg="bg-amber-50"
                title="Man Power"
              >
                <div className="space-y-4">
                  <NumberInput label="Quantity" value={manPowerQty} onChange={setManPowerQty} />
                  <TextareaField
                    label="Remark"
                    value={manPowerRemark}
                    onChange={setManPowerRemark}
                    placeholder="Describe manpower activities..."
                  />
                </div>
              </FieldCard>

              {/* Incidents */}
              <FieldCard
                icon={<AlertTriangle size={16} className="text-red-500" />}
                iconBg="bg-red-50"
                title="Incidents"
              >
                <div className="space-y-4">
                  <NumberInput label="Quantity" value={incidentQty} onChange={setIncidentQty} />
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400">Impact Level</span>
                    <ImpactSelector value={incidentImpact} onChange={(v) => setIncidentImpact(v as any)} />
                  </div>
                  <TextareaField
                    label="Remark"
                    value={incidentRemark}
                    onChange={setIncidentRemark}
                    placeholder="Describe any incidents..."
                  />
                </div>
              </FieldCard>

              {/* Equipment */}
              <FieldCard
                icon={<Wrench size={16} className="text-slate-600" />}
                iconBg="bg-slate-100"
                title="Equipment"
              >
                <div className="space-y-4">
                  <NumberInput label="Quantity" value={equipmentQty} onChange={setEquipmentQty} />
                  <TextareaField
                    label="Remark"
                    value={equipmentRemark}
                    onChange={setEquipmentRemark}
                    placeholder="List equipment used..."
                  />
                </div>
              </FieldCard>

              {/* Working Time */}
              <FieldCard
                icon={<Clock size={16} className="text-blue-500" />}
                iconBg="bg-blue-50"
                title="Working Time"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400 block mb-2">Start</span>
                    <input
                      type="time"
                      value={workStart}
                      onChange={(e) => setWorkStart(e.target.value)}
                      className="w-full bg-[#fafafa] rounded-xl px-4 py-3 text-center font-bold text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
                    />
                  </div>
                  <span className="text-slate-300 font-bold mt-6">—</span>
                  <div className="flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400 block mb-2">End</span>
                    <input
                      type="time"
                      value={workEnd}
                      onChange={(e) => setWorkEnd(e.target.value)}
                      className="w-full bg-[#fafafa] rounded-xl px-4 py-3 text-center font-bold text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
                    />
                  </div>
                </div>
              </FieldCard>

              {/* Progress */}
              <FieldCard
                icon={<CheckCircle size={16} className="text-emerald-500" />}
                iconBg="bg-emerald-50"
                title="Progress"
              >
                <div className="space-y-5">
                  <ProgressSlider
                    label="Actual Progress"
                    value={actualProgress}
                    onChange={setActualProgress}
                    color="#3b82f6"
                  />
                  <ProgressSlider
                    label="Planned Progress"
                    value={plannedProgress}
                    onChange={() => {}}
                    color="#94a3b8"
                    disabled
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-500">Variance</span>
                    <span className={`text-sm font-bold ${progressDelta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {progressDelta > 0 ? '+' : ''}{progressDelta}%
                    </span>
                  </div>
                </div>
              </FieldCard>

              {/* Material-specific fields */}
              {report.type === 'material' && activity.remarks !== undefined && (
                <>
                  {/* Remarks */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <TextareaField
                      label="Remarks"
                      value={activity.remarks}
                      onChange={() => {}}
                      placeholder="Additional remarks..."
                    />
                  </div>

                  {/* Materials Summary */}
                  {activity.materials && activity.materials.length > 0 && (
                    <FieldCard
                      icon={<FileText size={16} className="text-violet-500" />}
                      iconBg="bg-violet-50"
                      title="Materials"
                    >
                      <div className="space-y-2">
                        {activity.materials.slice(0, 3).map(mat => (
                          <div key={mat.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <div>
                              <p className="text-sm font-bold text-slate-700">{mat.name}</p>
                              <p className="text-[10px] text-slate-400">{mat.quantity} {mat.unit} • {mat.locationName}</p>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              mat.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                              mat.status === 'partial' ? 'bg-amber-50 text-amber-600' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {mat.status}
                            </span>
                          </div>
                        ))}
                        {activity.materials.length > 3 && (
                          <button className="w-full text-center text-[11px] font-bold text-[#3b82f6] py-2">
                            View all {activity.materials.length} materials
                          </button>
                        )}
                      </div>
                    </FieldCard>
                  )}
                </>
              )}
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div className="space-y-3">
              {documents.length > 0 ? (
                documents.map(doc => (
                  <DocumentItem
                    key={doc.id}
                    doc={doc}
                    onRemove={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <FileText size={28} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No documents attached</p>
                </div>
              )}

              {/* Add document button */}
              <button className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-all active:scale-[0.98]">
                <FileText size={24} />
                <span className="text-xs font-bold">Add Documents</span>
              </button>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <>
              {/* Manage Locations Button */}
              <button
                onClick={() => setShowLocationManager(true)}
                className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-[#3b82f6] text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg"
              >
                <Settings2 size={16} />
                Manage Photo Locations
              </button>

              {/* Photo Locations from Manager */}
              {photoLocations.length > 0 ? (
                <div className="space-y-4">
                  {photoLocations.map((location) => (
                    <div key={location.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      {/* Location header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#3b82f6]" />
                          <span className="text-xs font-bold text-slate-600">{location.dTagLabel}</span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {location.photos.length}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{location.dTagPath}</span>
                      </div>

                      {/* Photo grid */}
                      {location.photos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {location.photos.map((photo) => (
                            <button
                              key={photo.id}
                              onClick={() => {
                                // Convert to DailyPhoto format for detail view
                                const dailyPhoto: DailyPhoto = {
                                  id: photo.id,
                                  url: photo.url,
                                  caption: photo.caption,
                                  locationId: location.id,
                                  locationName: location.dTagPath,
                                  uploadedAt: photo.uploadedAt,
                                  uploadedBy: 'Current User',
                                };
                                setSelectedPhotoForDetail(dailyPhoto);
                              }}
                              className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 cursor-pointer group active:scale-[0.95] transition-all"
                            >
                              <img
                                src={photo.url}
                                alt={photo.caption}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[8px] font-bold text-white truncate">{photo.caption}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center">
                          <p className="text-[11px] text-slate-400">No photos for this location</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <MapPin size={28} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-1">No photo locations</p>
                  <p className="text-xs text-slate-400 mb-4">Add locations to organize photos</p>
                  <button
                    onClick={() => setShowLocationManager(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6]/10 text-[#3b82f6] rounded-xl text-sm font-bold active:scale-95 transition-all"
                  >
                    <Settings2 size={16} />
                    Manage Locations
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Photo Detail Modal */}
      {selectedPhotoForDetail && (
        <PhotoDetail
          photo={selectedPhotoForDetail}
          allPhotos={photoLocations.flatMap((loc) =>
            loc.photos.map((p) => ({
              id: p.id,
              url: p.url,
              caption: p.caption,
              locationId: loc.id,
              locationName: loc.dTagPath,
              uploadedAt: p.uploadedAt,
              uploadedBy: 'Current User',
            }))
          )}
          onClose={() => setSelectedPhotoForDetail(null)}
          onDelete={(photoId) => {
            // Delete photo from locations
            setPhotoLocations((prev) =>
              prev.map((loc) => ({
                ...loc,
                photos: loc.photos.filter((p) => p.id !== photoId),
              }))
            );
            setSelectedPhotoForDetail(null);
          }}
          onUpdateCaption={(photoId, caption) => {
            // Update caption in locations
            setPhotoLocations((prev) =>
              prev.map((loc) => ({
                ...loc,
                photos: loc.photos.map((p) =>
                  p.id === photoId ? { ...p, caption } : p
                ),
              }))
            );
          }}
        />
      )}

      {/* Photo Location Manager Modal */}
      {showLocationManager && (
        <PhotoLocationManager
          locations={photoLocations}
          onLocationsChange={setPhotoLocations}
          onClose={() => setShowLocationManager(false)}
        />
      )}
    </div>
  );
};

export default DailyReportDetail;
