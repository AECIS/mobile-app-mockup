// Shared helpers for ProjectDrawer: deterministic avatar colors + recent-project persistence.

// Avatar color palette — picked deterministically from an id.
const AVATAR_COLORS = [
  'bg-[#95ac71]', 'bg-[#5b8fb9]', 'bg-[#e07b54]', 'bg-[#8b6fb0]',
  'bg-[#c0855a]', 'bg-[#6b9e8a]', 'bg-[#d4756b]', 'bg-[#7a8eb5]',
  'bg-[#a4875b]', 'bg-[#6baeae]', 'bg-[#b87dad]', 'bg-[#8aab5e]',
];

export const getAvatarColor = (id: string): string => {
  // Hash the whole id so non-numeric ids (e.g. 'w1', 'w2') still spread across the palette.
  const idx = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
};

// Recent project ids persisted in localStorage.
const RECENT_KEY = 'aecis_recent_projects';
const MAX_RECENT = 3;

export const getRecentIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
};

export const pushRecentId = (id: string): void => {
  const prev = getRecentIds().filter((i) => i !== id);
  const next = [id, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};
