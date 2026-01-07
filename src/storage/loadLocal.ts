import type { CaseProtocol } from '../types/case';
import type { TipProtocol } from '../types/tip';

const CASES_KEY = 'cases';
const TIPS_KEY = 'tips';

export function loadLocal(): {
  cases: CaseProtocol[];
  tips: TipProtocol[];
  pendingSync: boolean;
} {
  const cases = JSON.parse(localStorage.getItem(CASES_KEY) || '[]');
  const tips = JSON.parse(localStorage.getItem(TIPS_KEY) || '[]');
  const pendingSync = JSON.parse(
    localStorage.getItem('pendingSync') || 'false',
  );
  return { cases, tips, pendingSync };
}
