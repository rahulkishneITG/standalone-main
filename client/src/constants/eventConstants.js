export const EVENT_STATUSES = ['upcoming', 'past', 'draft', 'completed'];

export const getBadgeStatus = (status) => {
  const key = status.toLowerCase();
  if (key === 'upcoming') return 'success';
  if (key === 'draft') return 'info';
  return 'attention';
};

export const getBadgeTone = (status) => {
  const key = status.toLowerCase();
  if (key === 'upcoming') return 'attention';
  if (key === 'past' || key === 'completed') return 'info';
  return undefined;
};
