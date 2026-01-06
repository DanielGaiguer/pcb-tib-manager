import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';

const CASES_KEY = 'cases';
const TIBS_KEY = 'tibs';

export function loadLocal(): {
  cases: CaseProtocol[];
  tibs: TibProtocol[];
  pendingSync: boolean;
} {
  const cases = JSON.parse(localStorage.getItem(CASES_KEY) || '[]');
  const tibs = JSON.parse(localStorage.getItem(TIBS_KEY) || '[]');
  const pendingSync = JSON.parse(
    localStorage.getItem('pendingSync') || 'false',
  );
  return { cases, tibs, pendingSync };
}
