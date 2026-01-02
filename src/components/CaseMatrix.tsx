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
                  tib.active,
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
      <div className="Form-tib">
        {openTibForm && (
          <div className="center-form-tib">
            <TibForm
              key={`${statePositionTib[0][0]}-${statePositionTib[0][1]}`} //Quando a key muda, o React pensa: “Isso não é o mesmo componente Vou destruir o antigo E criar um novo do zero”, isso e para mudar o formulario.
              caseData={caseData}
              tibData={selectedTib}
              onSubmit={onSubmit}
              positionTib={statePositionTib}
              onOpenTibForm={() => onOpenTibForm(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}
