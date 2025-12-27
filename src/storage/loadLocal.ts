import type { CaseProtocol } from '../types/case';
import type { TibProtocol } from '../types/tib';

const CASES_KEY = 'cases';
const TIBS_KEY = 'tibs';

export function loadLocal(): { cases: CaseProtocol[]; tibs: TibProtocol[] } {
  const cases = JSON.parse(localStorage.getItem(CASES_KEY) || '[]');
  const tibs = JSON.parse(localStorage.getItem(TIBS_KEY) || '[]');
  return { cases, tibs };
}
