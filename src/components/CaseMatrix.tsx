import React from 'react';
import type { JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';
import '../styles/caseMatrix.css';

interface CaseMatrixProps {
  caseData: CaseProtocol;
  tibs: TibProtocol[];
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

  return (
    <div className="matrix" style={{ gap }}>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="matrix-row">
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
                title={
                  !isPreview
                    ? `Linha ${row + 1} - Coluna ${col + 1}`
                    : undefined
                }
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
