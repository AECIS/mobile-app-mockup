import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Users, Calendar, Package, Compass, Tag, Hash, Camera, File, ChevronRight, X, Image, FileText } from 'lucide-react';
import { MasterDataSelector } from './MasterDataSelector';
import { DTagSelector } from './DTagSelector';
import { AssigneeSelector } from './AssigneeSelector';
import { packages, disciplines, submissionTypes, dTagTree, stakeholders, projectUsers } from './mockData';
import { ProjectUser } from '../types';

interface NewSubmissionProps {
  onClose: () => void;
}

const NewSubmission: React.FC<NewSubmissionProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDTags, setSelectedDTags] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<ProjectUser | null>(null);
  const [activeSelector, setActiveSelector] = useState<'assignee' | 'package' | 'discipline' | 'type' | 'dtag' | null>(null);
  const [photos, setPhotos] = useState([
    { id: 'p1', url: 'https://picsum.photos/seed/sub1/400/300', name: 'Structural_Detail_A.jpg' },
    { id: 'p2', url: 'https://picsum.photos/seed/sub2/400/300', name: 'Site_Photo_North.jpg' },
  ]);
  const [files, setFiles] = useState([
    { id: 'f1', name: 'Floor_Plan_Rev3.pdf', type: 'pdf' as const, size: '2.4 MB' },
    { id: 'f2', name: 'Material_Spec.docx', type: 'doc' as const, size: '890 KB' },
  ]);

  const getLabel = (id: string | null, options: typeof packages) => options.find(o => o.id === id)?.label ?? null;
  const totalSelectedMasterData = (selectedPackage ? 1 : 0) + selectedDTags.length;
  const totalAttachments = photos.length + files.length;

  // Form validation - all required fields must be filled
  const isFormValid = Boolean(
    title.trim() &&
    description.trim() &&
    selectedType &&
    selectedDiscipline &&
    selectedAssignee
  );

  // Prevent body scroll when selector overlays are open
  useEffect(() => {
    if (activeSelector) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [activeSelector]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;
    // In a real app, this would submit the form data
    console.log('Submitting:', {
      title,
      description,
      dueDate,
      selectedType,
      selectedDiscipline,
      selectedAssignee,
      selectedPackage,
      selectedDTags,
      photos,
      files,
    });
    onClose();
  }, [isFormValid, title, description, dueDate, selectedType, selectedDiscipline, selectedAssignee, selectedPackage, selectedDTags, photos, files, onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[60] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Sticky Header - frosted glass */}
        <div
          className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-slate-100/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
          style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
        >
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full active:bg-slate-100 dark:active:bg-slate-700 active:scale-[0.98] transition-all -ml-1"
            aria-label="Go back"
          >
            <ChevronLeft size={24} className="text-slate-800 dark:text-slate-200" />
          </button>
          <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">New Submission</h1>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            aria-label={isFormValid ? 'Submit form' : 'Complete required fields to submit'}
            className={`text-sm font-bold px-5 py-2.5 rounded-full transition-all min-h-[44px] ${
              isFormValid
                ? 'bg-[#3b82f6] text-white active:scale-95 active:bg-[#2563eb]'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>

        {/* Scrollable Form body */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          <div className="px-5 pt-5" style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}>

            {/* 1. TITLE */}
            <div className={`rounded-2xl px-4 py-3 mb-6 transition-all duration-200 ${title ? 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm' : 'bg-transparent'}`}>
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-black uppercase tracking-tight text-slate-300 dark:text-slate-600 mb-1">Title</div>
                <span className="text-[8px] font-black text-red-400 uppercase tracking-tight mb-1">Required</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter submission title..."
                autoCapitalize="sentences"
                autoCorrect="off"
                aria-label="Submission title"
                aria-required="true"
                aria-invalid={title.trim() === ''}
                className="text-xl font-bold text-slate-800 dark:text-slate-100 outline-none w-full placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-transparent"
              />
            </div>

            {/* 2. FIELDS CARD (Type, Discipline, Assignee, Due Date) */}
            <div className="bg-[#fafafa] dark:bg-slate-800 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-700 mb-6">
              {/* Type row - REQUIRED */}
              <button
                onClick={() => setActiveSelector('type')}
                aria-label={`Select type${selectedType ? `: ${getLabel(selectedType, submissionTypes)}` : ''}`}
                aria-required="true"
                aria-haspopup="dialog"
                className="w-full flex items-center justify-between min-h-[48px] px-1 rounded-xl active:bg-white/60 dark:active:bg-slate-700/60 active:scale-[0.98] transition-all"
              >
                <div className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-3 flex-shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Tag size={16} className="text-amber-500 dark:text-amber-400" />
                  </div>
                  <span>Type</span>
                  <span className="text-[8px] font-black text-red-400 uppercase tracking-tight">Required</span>
                </div>
                <div className="flex items-center gap-2 min-w-0 ml-3">
                  {selectedType ? (
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                      {getLabel(selectedType, submissionTypes)}
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600 text-xs font-medium">Select</span>
                  )}
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                </div>
              </button>

              <div className="h-px bg-slate-100/80 dark:bg-slate-700 mx-2 my-1" />

              {/* Discipline row - REQUIRED */}
              <button
                onClick={() => setActiveSelector('discipline')}
                aria-label={`Select discipline${selectedDiscipline ? `: ${getLabel(selectedDiscipline, disciplines)}` : ''}`}
                aria-required="true"
                aria-haspopup="dialog"
                className="w-full flex items-center justify-between min-h-[48px] px-1 rounded-xl active:bg-white/60 dark:active:bg-slate-700/60 active:scale-[0.98] transition-all"
              >
                <div className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-3 flex-shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                    <Compass size={16} className="text-teal-500 dark:text-teal-400" />
                  </div>
                  <span>Discipline</span>
                  <span className="text-[8px] font-black text-red-400 uppercase tracking-tight">Required</span>
                </div>
                <div className="flex items-center gap-2 min-w-0 ml-3">
                  {selectedDiscipline ? (
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                      {getLabel(selectedDiscipline, disciplines)}
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600 text-xs font-medium">Select</span>
                  )}
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                </div>
              </button>

              <div className="h-px bg-slate-100/80 dark:bg-slate-700 mx-2 my-1" />

              {/* Assignee row - REQUIRED */}
              <button
                onClick={() => setActiveSelector('assignee')}
                aria-label={`Select assignee${selectedAssignee ? `: ${selectedAssignee.name}` : ''}`}
                aria-required="true"
                aria-haspopup="dialog"
                className="w-full flex items-center justify-between min-h-[48px] px-1 rounded-xl active:bg-white/60 dark:active:bg-slate-700/60 active:scale-[0.98] transition-all"
              >
                <div className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-blue-500 dark:text-blue-400" />
                  </div>
                  <span>Assignee</span>
                  <span className="text-[8px] font-black text-red-400 uppercase tracking-tight">Required</span>
                </div>
                {selectedAssignee ? (
                  <div className="flex items-center gap-2.5">
                    <img
                      src={`https://picsum.photos/seed/${selectedAssignee.id}/100`}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/50"
                      alt=""
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedAssignee.name}</span>
                    <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-300 dark:text-slate-600">
                      <span className="text-base font-light">+</span>
                    </div>
                  </div>
                )}
              </button>

              <div className="h-px bg-slate-100/80 dark:bg-slate-700 mx-2 my-1" />

              {/* Due Date row */}
              <div className="flex items-center justify-between min-h-[48px] px-1">
                <div className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar size={16} className="text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <span>Due Date</span>
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  aria-label="Due date"
                  className="bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 font-medium text-right min-h-[44px]"
                />
              </div>
            </div>

            {/* 3. DESCRIPTION */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500">Description</div>
                <span className="text-[8px] font-black text-red-400 uppercase tracking-tight">Required</span>
              </div>
              <div className="bg-[#fafafa] dark:bg-slate-800 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-700 relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a short description..."
                  autoCapitalize="sentences"
                  aria-label="Submission description"
                  aria-required="true"
                  aria-invalid={description.trim() === ''}
                  className="w-full text-sm text-slate-600 dark:text-slate-300 outline-none min-h-[100px] bg-transparent resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 tabular-nums">
                    {description.length > 0 ? `${description.split(/\s+/).filter(Boolean).length} words` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. ATTACHMENTS - Unified photos + files (matching NewIssue) */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500">Attachments</div>
                {totalAttachments > 0 && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase">
                    {totalAttachments}
                  </span>
                )}
              </div>

              {/* Photo thumbnails grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 aspect-square">
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-[9px] font-bold text-white truncate">{photo.name}</p>
                      </div>
                      <button
                        onClick={() => setPhotos(prev => prev.filter(p => p.id !== photo.id))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-all"
                        aria-label={`Remove ${photo.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2 mb-3">
                  {files.map((att) => (
                    <div
                      key={att.id}
                      className={`flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden relative ${
                        att.type === 'pdf' ? 'border-l-[3px] border-l-red-300' :
                        att.type === 'image' ? 'border-l-[3px] border-l-blue-300' :
                        'border-l-[3px] border-l-amber-300'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        att.type === 'pdf' ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400' :
                        att.type === 'image' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400' :
                        'bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400'
                      }`}>
                        {att.type === 'pdf' && <FileText size={20} strokeWidth={2.2} />}
                        {att.type === 'image' && <Image size={20} strokeWidth={2.2} />}
                        {att.type === 'doc' && <FileText size={20} strokeWidth={2.2} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{att.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">{att.size}</p>
                      </div>
                      <button
                        onClick={() => setFiles(prev => prev.filter(a => a.id !== att.id))}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 active:bg-slate-100 dark:active:bg-slate-700 active:scale-95 transition-all flex-shrink-0"
                        aria-label={`Remove ${att.name}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add buttons */}
              <div className="border-2 border-dashed border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-white to-[#fafafa] dark:from-slate-800 dark:to-slate-800 active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <button
                    className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shadow-sm flex items-center justify-center text-slate-400 dark:text-slate-500 active:bg-slate-50 dark:active:bg-slate-600 active:scale-95 transition-all"
                    aria-label="Add photo"
                  >
                    <Camera size={20} />
                  </button>
                  <button
                    className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shadow-sm flex items-center justify-center text-slate-400 dark:text-slate-500 active:bg-slate-50 dark:active:bg-slate-600 active:scale-95 transition-all"
                    aria-label="Add file"
                  >
                    <File size={20} />
                  </button>
                </div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">Tap to add photos or files</span>
              </div>
            </div>

            {/* 5. MORE OPTIONS */}
            <div>
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                aria-expanded={showMoreOptions}
                aria-controls="more-options-section"
                aria-label={`More options${showMoreOptions ? ', expanded' : ', collapsed'}${totalSelectedMasterData > 0 ? `, ${totalSelectedMasterData} items selected` : ''}`}
                className="w-full flex items-center justify-between min-h-[48px] px-1 mb-2 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-400 dark:text-slate-500">More Options</span>
                  {totalSelectedMasterData > 0 && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#3b82f6] text-white uppercase">
                      {totalSelectedMasterData} selected
                    </span>
                  )}
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {showMoreOptions ? <ChevronUp size={14} className="text-slate-500 dark:text-slate-400" /> : <ChevronDown size={14} className="text-slate-500 dark:text-slate-400" />}
                </div>
              </button>

              {showMoreOptions && (
                <div id="more-options-section" className="bg-[#fafafa] dark:bg-slate-800 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-700 mt-1">
                  {/* Package row */}
                  <button
                    onClick={() => setActiveSelector('package')}
                    aria-label={`Select package${selectedPackage ? `: ${getLabel(selectedPackage, packages)}` : ''}`}
                    aria-haspopup="dialog"
                    className="w-full flex items-center justify-between min-h-[48px] px-1 rounded-xl active:bg-white/60 dark:active:bg-slate-700/60 active:scale-[0.98] transition-all"
                  >
                    <div className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-3 flex-shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-purple-500 dark:text-purple-400" />
                      </div>
                      <span>Package</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0 ml-3">
                      {selectedPackage ? (
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                          {getLabel(selectedPackage, packages)}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 text-xs font-medium">Select</span>
                      )}
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                    </div>
                  </button>

                  <div className="h-px bg-slate-100/80 dark:bg-slate-700 mx-2 my-1" />

                  {/* DTag row */}
                  <button
                    onClick={() => setActiveSelector('dtag')}
                    aria-label={`Select DTags${selectedDTags.length > 0 ? `, ${selectedDTags.length} selected` : ''}`}
                    aria-haspopup="dialog"
                    className="w-full flex items-center justify-between min-h-[48px] px-1 rounded-xl active:bg-white/60 dark:active:bg-slate-700/60 active:scale-[0.98] transition-all"
                  >
                    <div className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                        <Hash size={16} className="text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <span>DTag</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDTags.length > 0 ? (
                        <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 uppercase">
                          {selectedDTags.length} selected
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 text-xs font-medium">Select</span>
                      )}
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selector overlays */}
      {activeSelector === 'assignee' && (
        <AssigneeSelector
          stakeholders={stakeholders}
          users={projectUsers}
          selectedId={selectedAssignee?.id ?? null}
          onSelect={setSelectedAssignee}
          onClose={() => setActiveSelector(null)}
        />
      )}
      {activeSelector === 'package' && (
        <MasterDataSelector
          title="Select Package"
          options={packages}
          selected={selectedPackage ? [selectedPackage] : []}
          onSelectionChange={(ids) => setSelectedPackage(ids[0] ?? null)}
          onClose={() => setActiveSelector(null)}
          singleSelect
        />
      )}
      {activeSelector === 'discipline' && (
        <MasterDataSelector
          title="Select Discipline"
          options={disciplines}
          selected={selectedDiscipline ? [selectedDiscipline] : []}
          onSelectionChange={(ids) => setSelectedDiscipline(ids[0] ?? null)}
          onClose={() => setActiveSelector(null)}
          singleSelect
        />
      )}
      {activeSelector === 'type' && (
        <MasterDataSelector
          title="Select Type"
          options={submissionTypes}
          selected={selectedType ? [selectedType] : []}
          onSelectionChange={(ids) => setSelectedType(ids[0] ?? null)}
          onClose={() => setActiveSelector(null)}
          singleSelect
        />
      )}
      {activeSelector === 'dtag' && (
        <DTagSelector
          tree={dTagTree}
          selected={selectedDTags}
          onSelectionChange={setSelectedDTags}
          onClose={() => setActiveSelector(null)}
          allowCreate
        />
      )}
    </>
  );
};

export default NewSubmission;
