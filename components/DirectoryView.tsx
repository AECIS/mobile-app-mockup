
import React from 'react';
import { Stakeholder, ProjectUser } from '../types';
import { Phone, Mail, ChevronRight, Search } from 'lucide-react';

const DirectoryView: React.FC = () => {
  const stakeholders: Stakeholder[] = [
    { id: 's1', name: 'General Contractor', abbreviation: 'GC' },
    { id: 's2', name: 'Architectural Consultant', abbreviation: 'ARC' },
    { id: 's3', name: 'Mechanical Subcontractor', abbreviation: 'MEP' }
  ];

  const members: ProjectUser[] = [
    { id: 'm1', name: 'Saski Amora', phone: '+1 555-0123', email: 'saski@gc-kala.com', position: 'Project Manager', stakeholderId: 's1' },
    { id: 'm2', name: 'Kenneth Alanda', phone: '+1 555-0124', email: 'ken@gc-kala.com', position: 'Superintendent', stakeholderId: 's1' },
    { id: 'm3', name: 'James Wilson', phone: '+1 555-0199', email: 'j.wilson@arc-studio.com', position: 'Principal Architect', stakeholderId: 's2' },
    { id: 'm4', name: 'Elena Rodriguez', phone: '+1 555-0210', email: 'elena@mep-solutions.com', position: 'HVAC Lead', stakeholderId: 's3' }
  ];

  return (
    <div className="flex flex-col gap-4 py-2 pb-24">
      <div className="relative">
        <input
          type="text"
          placeholder="Search directory..."
          className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500" size={18} />
      </div>

      {stakeholders.map((sh) => (
        <section key={sh.id} className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-800 dark:text-slate-100">{sh.name}</h2>
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                {sh.abbreviation}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">
              {members.filter(m => m.stakeholderId === sh.id).length} MEMBERS
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {members.filter(m => m.stakeholderId === sh.id).map((member) => (
              <div key={member.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <img src={`https://picsum.photos/seed/${member.id}/100`} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{member.name}</h3>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{member.position}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`tel:${member.phone}`} className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                    <Phone size={16} />
                  </a>
                  <a href={`mailto:${member.email}`} className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                    <Mail size={16} />
                  </a>
                  <button className="p-2 text-slate-200 dark:text-slate-600">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default DirectoryView;
