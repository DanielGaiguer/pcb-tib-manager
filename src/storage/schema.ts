import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';

export interface AppStorage {
  cases: CaseProtocol[];
  tibs: TibProtocol[];

  lastModified: number; // Date.now()
  pendingSync: boolean;
}
