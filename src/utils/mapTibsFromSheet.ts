import type { TibProtocol } from '../types/Tib';
import type { TibSheetRow } from '../types/TIbSheetRow';

export function mapTibsFromSheet(rows: TibSheetRow[]): TibProtocol[] {
  return rows.map((row) => ({
    id: row[0],
    caseId: row[1],
    rows: Number(row[2]),
    cols: Number(row[3]),
    position: row[4],
    type: row[5],
    diameter: row[6],
    uses: Number(row[7]),
    active: row[8] === true || row[8] === 'true',
  }));
}
