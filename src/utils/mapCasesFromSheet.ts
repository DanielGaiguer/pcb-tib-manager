import type { CaseProtocol } from '../types/Case';
import type { CaseSheetRow } from '../types/CaseSheetRow';

export function mapCasesFromSheet(rows: CaseSheetRow[]): CaseProtocol[] {
  return rows.map((row) => ({
    id: row[0],
    name: row[1],
    rows: Number(row[2]),
    cols: Number(row[3]),
    active: row[4] === true || row[4] === 'true',
  }));
}
