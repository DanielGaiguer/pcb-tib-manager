import React, { useState } from 'react';
import type { JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';
//import { TibForm } from './TibForm';
import '../styles/caseMatrix.css';
import { toast } from 'react-toastify';
import { InformationTibs } from './InformationTibs';
import { ConfirmeTib } from './ConfirmeTib';
import type { TibUsage } from '../types/tibUsage';

interface CaseMatrixProps {
  caseData: CaseProtocol[];
  tibs: TibProtocol[];
  onSaveTibUsages: (tibs: TibUsage[]) => void;
}

export function CaseMatrixUsage({
  caseData,
  tibs,
  onSaveTibUsages,
}: CaseMatrixProps): JSX.Element {
  const [selectedCell, setSelectedCell] = useState<TibProtocol | null>(null);

  const [selectedPositions, setSelectedPositions] = useState<
    { caseId: string; row: number; col: number; uses: number }[]
  >([]);

  const [confirmeUse, setConfirmeUse] = useState<boolean>(false);

  const dotSize = 35;
  const gap = 8;

  const selectTib = (
    caseId: string,
    row: number,
    col: number,
    uses: number,
  ): void => {
    setSelectedPositions((prev) => {
      const exists = prev.some(
        (pos) => pos.caseId === caseId && pos.row === row && pos.col === col,
      );

      if (exists) {
        return prev.filter(
          (pos) =>
            !(pos.caseId === caseId && pos.row === row && pos.col === col),
        );
      }

      return [...prev, { caseId, row, col, uses }];
    });
  };

  const emptyWarning = () => {
    toast.error('Essa posição está vazia!');
  };

  const columnLabel = (index: number): string =>
    String.fromCharCode(65 + index);

  return (
    <>
      {caseData.map((caseItem) => {
        if (caseItem.active === false) return null;
        const { id, rows, cols } = caseItem;

        return (
          <div key={id}>
            <h3 className="title-case">{caseItem.name}</h3>

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
                  <div className="matrix-header row">{row + 1}</div>

                  {Array.from({ length: cols }).map((_, col) => {
                    const hasTib = tibs.some(
                      (tib) =>
                        tib.caseId === id &&
                        tib.rows === row &&
                        tib.cols === col &&
                        tib.active,
                    );
                    const isSelected = selectedPositions.some(
                      (pos) =>
                        pos.caseId === id && pos.row === row && pos.col === col,
                    );

                    return (
                      <span
                        key={col}
                        className={`dot ${hasTib ? 'occupied' : 'free'} ${isSelected ? 'selected' : ''}`}
                        style={{
                          width: dotSize,
                          height: dotSize,
                        }}
                        title={`Linha ${row + 1} - Coluna ${columnLabel(col)}`}
                        onClick={() => {
                          if (!hasTib) {
                            emptyWarning();
                            return;
                          }
                          selectTib(id, row, col, 1);
                          const tib = tibs.find(
                            (t) =>
                              t.caseId === id &&
                              t.rows === row &&
                              t.cols === col &&
                              t.active,
                          );

                          if (tib) {
                            setSelectedCell(tib);
                          }
                        }}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
      <br />
      <div className="usage-info">
        {selectedCell && <InformationTibs selectedTib={selectedCell} />}
      </div>
      <p className="usage-count">
        Quantidade de Ponteiras selecionadas: {selectedPositions.length}
      </p>
      <br />
      {!confirmeUse && (
        <div className="actions">
          <button
            className="main-button"
            onClick={() =>
              selectedPositions.length > 0
                ? setConfirmeUse(true)
                : toast.error('Nenhuma ponta selecionada')
            }
          >
            Salvar usos
          </button>
        </div>
      )}
      {confirmeUse && (
        <div>
          <ConfirmeTib
            selectedTibs={selectedPositions}
            caseData={caseData}
            onSaveTibUsages={onSaveTibUsages}
            buttonBack={() => setConfirmeUse(false)}
            clearSelectedTib={() => setSelectedPositions([])}
            clearSelectedInformation={() => setSelectedCell(null)}
          />
        </div>
      )}
    </>
  );
}
