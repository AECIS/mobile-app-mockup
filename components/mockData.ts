import { MasterDataOption, DTagNode, Stakeholder, ProjectUser } from '../types';

export const packages: MasterDataOption[] = [
  { id: 'pkg-1', label: 'Structural Works' },
  { id: 'pkg-2', label: 'MEP Services' },
  { id: 'pkg-3', label: 'Architectural Finishes' },
  { id: 'pkg-4', label: 'Facade & Curtain Wall' },
  { id: 'pkg-5', label: 'Landscaping' },
  { id: 'pkg-6', label: 'Fire Protection' },
  { id: 'pkg-7', label: 'Earthworks & Piling' },
  { id: 'pkg-8', label: 'Interior Fit-Out' },
];

export const disciplines: MasterDataOption[] = [
  { id: 'dsc-1', label: 'Civil' },
  { id: 'dsc-2', label: 'Electrical' },
  { id: 'dsc-3', label: 'Mechanical' },
  { id: 'dsc-4', label: 'Plumbing' },
  { id: 'dsc-5', label: 'Structural' },
  { id: 'dsc-6', label: 'Architectural' },
];

export const submissionTypes: MasterDataOption[] = [
  { id: 'typ-1', label: 'Material Approval' },
  { id: 'typ-2', label: 'Shop Drawing' },
  { id: 'typ-3', label: 'Method Statement' },
  { id: 'typ-4', label: 'Inspection Request' },
  { id: 'typ-5', label: 'As-Built Drawing' },
];

export const stakeholders: Stakeholder[] = [
  { id: 's1', name: 'General Contractor', abbreviation: 'GC' },
  { id: 's2', name: 'Architectural Consultant', abbreviation: 'ARC' },
  { id: 's3', name: 'Mechanical Subcontractor', abbreviation: 'MEP' },
];

export const projectUsers: ProjectUser[] = [
  { id: 'm1', name: 'Saski Amora', phone: '+1 555-0123', email: 'saski@gc-kala.com', position: 'Project Manager', stakeholderId: 's1' },
  { id: 'm2', name: 'Kenneth Alanda', phone: '+1 555-0124', email: 'ken@gc-kala.com', position: 'Superintendent', stakeholderId: 's1' },
  { id: 'm3', name: 'James Wilson', phone: '+1 555-0199', email: 'j.wilson@arc-studio.com', position: 'Principal Architect', stakeholderId: 's2' },
  { id: 'm4', name: 'Elena Rodriguez', phone: '+1 555-0210', email: 'elena@mep-solutions.com', position: 'HVAC Lead', stakeholderId: 's3' },
  { id: 'm5', name: 'David Chen', phone: '+1 555-0311', email: 'd.chen@gc-kala.com', position: 'Site Engineer', stakeholderId: 's1' },
  { id: 'm6', name: 'Maria Santos', phone: '+1 555-0415', email: 'maria@arc-studio.com', position: 'Interior Designer', stakeholderId: 's2' },
];

export const dTagTree: DTagNode[] = [
  {
    id: 'dt-1',
    label: 'Building A',
    children: [
      {
        id: 'dt-1-1',
        label: 'Basement',
        children: [
          { id: 'dt-1-1-1', label: 'Zone B1-A' },
          { id: 'dt-1-1-2', label: 'Zone B1-B' },
          { id: 'dt-1-1-3', label: 'Zone B2' },
        ],
      },
      {
        id: 'dt-1-2',
        label: 'Ground Floor',
        children: [
          { id: 'dt-1-2-1', label: 'Lobby' },
          { id: 'dt-1-2-2', label: 'Retail Area' },
          {
            id: 'dt-1-2-3',
            label: 'Loading Bay',
            children: [
              { id: 'dt-1-2-3-1', label: 'Dock 1' },
              { id: 'dt-1-2-3-2', label: 'Dock 2' },
            ],
          },
        ],
      },
      {
        id: 'dt-1-3',
        label: 'Floor 1-10',
        children: [
          { id: 'dt-1-3-1', label: 'Office Wing East' },
          { id: 'dt-1-3-2', label: 'Office Wing West' },
          { id: 'dt-1-3-3', label: 'Core & Services' },
        ],
      },
      {
        id: 'dt-1-4',
        label: 'Floor 11-20',
        children: [
          { id: 'dt-1-4-1', label: 'Executive Suite' },
          { id: 'dt-1-4-2', label: 'Conference Level' },
        ],
      },
      { id: 'dt-1-5', label: 'Rooftop' },
    ],
  },
  {
    id: 'dt-2',
    label: 'Building B',
    children: [
      {
        id: 'dt-2-1',
        label: 'Podium',
        children: [
          { id: 'dt-2-1-1', label: 'Parking Level 1' },
          { id: 'dt-2-1-2', label: 'Parking Level 2' },
        ],
      },
      { id: 'dt-2-2', label: 'Tower' },
    ],
  },
  {
    id: 'dt-3',
    label: 'External Works',
    children: [
      { id: 'dt-3-1', label: 'Roads & Pathways' },
      { id: 'dt-3-2', label: 'Drainage' },
      { id: 'dt-3-3', label: 'Utilities' },
      {
        id: 'dt-3-4',
        label: 'Landscape Zones',
        children: [
          { id: 'dt-3-4-1', label: 'North Garden' },
          { id: 'dt-3-4-2', label: 'South Plaza' },
          { id: 'dt-3-4-3', label: 'Water Feature' },
        ],
      },
    ],
  },
  { id: 'dt-4', label: 'Temporary Works' },
  { id: 'dt-5', label: 'Site-Wide Systems' },
];
