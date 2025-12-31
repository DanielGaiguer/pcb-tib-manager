export interface TibProtocol {
  id: string;
  caseId: string;
  rows: number;
  cols: number;
  position: string;
  type: string;
  diameter: number;
  uses: number;
  active: boolean;
  occupied: boolean;
}
