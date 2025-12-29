import { type CaseProtocol } from '../types/Case';
import { type TibProtocol } from '../types/Tib';

const CASES_KEY = 'cases';
const TIBS_KEY = 'tibs';

export function saveLocal(cases: CaseProtocol[], tibs: TibProtocol[]) {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  localStorage.setItem(TIBS_KEY, JSON.stringify(tibs));
}
