const ACCESS_KEY = 'accessedAt';

export function saveAccess(): void {
  localStorage.setItem(ACCESS_KEY, JSON.stringify(Date.now()));
}
