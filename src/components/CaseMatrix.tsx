import React from 'react';
import type { JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';
import '../styles/caseMatrix.css';

interface CaseMatrixProps {
  caseData: CaseProtocol;
  tibs: TibProtocol[];
  setStateTib?: (tib: TibProtocol) => void;
  mode?: 'preview' | 'detail';
}

export function CaseMatrix({
  caseData,
  tibs,
  mode = 'detail',
}: CaseMatrixProps): JSX.Element {
  console.log('CaseMatrix props:', caseData);
  const { rows, cols, id } = caseData;
  const isPreview = mode === 'preview';

  const dotSize = isPreview ? 20 : 30;
  const gap = isPreview ? 4 : 8;

  const selectTib = (row: number, col: number): void => {
    console.log(row, col);
    console.log(row + 1, columnLabel(col));
  };

  const columnLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C...
  };

  return (
    <div
      className="matrix-grid"
      style={{
        gridTemplateColumns: `30px repeat(${cols}, ${dotSize}px)`,
        gap,
      }}
    >
      <div />

      {/* Cabeçalho das colunas */}
      {Array.from({ length: cols }).map((_, col) => (
        <div key={col} className="matrix-header column">
          {columnLabel(col)}
        </div>
      ))}

      {/* Linhas */}
      {Array.from({ length: rows }).map((_, row) => (
        <React.Fragment key={row}>
          {/* Cabeçalho da linha */}
          <div className="matrix-header row">{row + 1}</div>

          {/* Bolinhas */}
          {Array.from({ length: cols }).map((_, col) => {
            const occupied = tibs.some(
              (tib) =>
                tib.caseId === id &&
                tib.rows === row &&
                tib.cols === col &&
                tib.occupied,
            );

            return (
              <span
                key={col}
                className={`dot ${occupied ? 'occupied' : 'free'}`}
                style={{
                  width: dotSize,
                  height: dotSize,
                  cursor: isPreview ? 'default' : 'pointer',
                }}
                title={`Linha ${row + 1} - Coluna ${columnLabel(col)}`}
                onClick={() => !isPreview && selectTib(row, col)}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
