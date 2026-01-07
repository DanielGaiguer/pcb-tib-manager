import { type CaseProtocol } from '../types/Case';
import { type TipProtocol } from '../types/Tip';

const CASES_KEY = 'cases';
const TIPS_KEY = 'tips';

export function saveLocal(
  cases: CaseProtocol[],
  tips: TipProtocol[],
  pendingSync: boolean,
) {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  localStorage.setItem(TIPS_KEY, JSON.stringify(tips));
  localStorage.setItem('pendingSync', JSON.stringify(pendingSync));
}
