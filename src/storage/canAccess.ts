const ACCESS_KEY = 'accessedAt';
const THIRTY_MINUTES = 30 * 60 * 1000;

export function canAccess(): boolean {
  const timestampString = localStorage.getItem(ACCESS_KEY);
  if (!timestampString) return false;

  const lastAccess = Number(JSON.parse(timestampString));
  const now = Date.now();

  return now - lastAccess <= THIRTY_MINUTES;
}
