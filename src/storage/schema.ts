import type { CaseProtocol } from '../types/case';
import type { TipProtocol } from '../types/tip';

export interface AppStorage {
  cases: CaseProtocol[];
  tips: TipProtocol[];

  lastModified: number; // Date.now()
  pendingSync: boolean;
}
