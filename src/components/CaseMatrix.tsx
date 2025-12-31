import React, { useState } from 'react';
import type { JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';
import { TibForm } from './TibForm';
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
  //console.log('CaseMatrix props:', caseData);
  //console.log(tibs);
  const [selectedTib, setSelectedTib] = useState<TibProtocol | null>(null);
  const [statePositionTib, setStatePositionTib] = useState<
    [[number, number], [number, string]]
  >([
    [0, 0],
    [0, ''],
  ]);
  const [openTibForm, onOpenTibForm] = useState<boolean>(false);
  const { rows, cols, id } = caseData;
  const isPreview = mode === 'preview';

  const dotSize = isPreview ? 20 : 30;
  const gap = isPreview ? 4 : 8;

  const findTibAtPosition = (
    row: number,
    col: number,
  ): TibProtocol | undefined => {
    return tibs.find(
      (tib) =>
        tib.caseId === id &&
        tib.rows === row &&
        tib.cols === col &&
        tib.occupied,
    );
  };

  const selectTib = (row: number, col: number): void => {
    const tib = findTibAtPosition(row, col);

    setStatePositionTib([
      [row, col],
      [row + 1, columnLabel(col)],
    ]);

    setSelectedTib(tib ?? null); // salva a tib inteira (ou null)
    onOpenTibForm(true);
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
      <div className="Form-tib">
        {openTibForm && (
          <TibForm
            caseData={caseData}
            tibData={selectedTib}
            positionTib={statePositionTib}
            onOpenTibForm={() => onOpenTibForm(false)}
          />
        )}
      </div>
    </div>
  );
}
