import type { CaseProtocol } from '../types/Case';
import type { TipProtocol } from '../types/Tip';

export interface AppStorage {
  cases: CaseProtocol[];
  tips: TipProtocol[];

  lastModified: number; // Date.now()
  pendingSync: boolean;
}
