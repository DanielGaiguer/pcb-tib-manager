import React, { useState } from 'react';
import type { JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';
import { TibForm } from './TibForm';
import '../styles/caseMatrix.css';

interface CaseMatrixProps {
  caseData: CaseProtocol;
  tibs: TibProtocol[];
  onSubmit?: ((tib: TibProtocol) => void) | undefined;
  mode?: 'preview' | 'detail';
}

export function CaseMatrix({
  caseData,
  tibs,
  onSubmit,
  mode = 'detail',
}: CaseMatrixProps): JSX.Element {
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

  const maxDotSize = isPreview ? 35 : 40; // tamanho máximo
  const minDotSize = 20; // tamanho mínimo para muitas colunas
  const dotSizeDynamic = Math.min(
    maxDotSize,
    Math.max(minDotSize, 400 / cols), // 400px = largura máxima do grid
  );

  const gap = isPreview ? 8 : 15; // define o espaçamento entre as colunas

  const findTibAtPosition = (
    row: number,
    col: number,
  ): TibProtocol | undefined => {
    return tibs.find(
      (tib) =>
        tib.caseId === id && tib.rows === row && tib.cols === col && tib.active,
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
    <>
      <div
        className={isPreview ? 'matrix-grid preview' : 'matrix-grid detail'}
        style={{
          gridTemplateColumns: `30px repeat(${cols}, ${dotSizeDynamic}px)`,
          gap,
        }}
      >
        <div /> {/* canto superior esquerdo */}
        {Array.from({ length: cols }).map((_, col) => (
          <div key={col} className="matrix-header column">
            {columnLabel(col)}
          </div>
        ))}
        {Array.from({ length: rows }).map((_, row) => (
          <React.Fragment key={row}>
            <div className="matrix-header row">{row + 1}</div>
            {Array.from({ length: cols }).map((_, col) => {
              const occupied = tibs.some(
                (tib) =>
                  tib.caseId === id &&
                  tib.rows === row &&
                  tib.cols === col &&
                  tib.active,
              );
              const inactive = tibs.some(
                (tib) =>
                  tib.caseId === id &&
                  tib.rows === row &&
                  tib.cols === col &&
                  !tib.active,
              );
              return (
                <span
                  key={col}
                  className={`dot ${occupied ? 'occupied' : 'free'} ${inactive ? 'inactive' : ''}`}
                  style={{
                    width: dotSizeDynamic,
                    height: dotSizeDynamic,
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
      <div>
        {openTibForm && (
          <div className="Form-tib">
            <div className="form-tib-card">
              <TibForm
                key={`${statePositionTib[0][0]}-${statePositionTib[0][1]}`}
                caseData={caseData}
                tibData={selectedTib}
                onSubmit={onSubmit}
                positionTib={statePositionTib}
                onOpenTibForm={() => onOpenTibForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
