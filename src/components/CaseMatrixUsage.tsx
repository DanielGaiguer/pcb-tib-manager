import React, { useState } from 'react';
import type { JSX } from 'react';
import type { CaseProtocol } from '../types/case';
import type { TipProtocol } from '../types/tip';
//import { TibForm } from './TibForm';
import '../styles/caseMatrix.css';
import { toast } from 'react-toastify';
import { InformationTips } from './InformationTips';
import { ConfirmeTip } from './ConfirmeTip';
import type { TipUsage } from '../types/tipUsage';

interface CaseMatrixProps {
  caseData: CaseProtocol[];
  tips: TipProtocol[];
  onSaveTipUsages: (tips: TipUsage[]) => void;
  closeWindow: () => void;
}

export function CaseMatrixUsage({
  caseData,
  tips,
  onSaveTipUsages,
  closeWindow,
}: CaseMatrixProps): JSX.Element {
  const [selectedCell, setSelectedCell] = useState<TipProtocol | null>(null);

  const [selectedPositions, setSelectedPositions] = useState<
    {
      caseId: string;
      row: number;
      col: number;
      uses: number;
    }[]
  >([]);

  const [confirmeUse, setConfirmeUse] = useState<boolean>(false);

  const dotSize = 35;
  const gap = 8;

  const selectTip = (
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

  const checkTypeTip = (
    tipType: string | undefined,
    tipDiameter: string | undefined,
  ) => {
    if (tipType === 'Broca') {
      return 'Broca' + String(tipDiameter).replace('.', '-');
    }
    return tipType?.replaceAll(' ', '');
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
                    const hasTib = tips.some(
                      (tip) =>
                        tip.caseId === id &&
                        tip.rows === row &&
                        tip.cols === col &&
                        tip.active,
                    );

                    const tipAtPosition = tips.find(
                      (tip) =>
                        tip.caseId === id &&
                        tip.rows === row &&
                        tip.cols === col,
                    );

                    const isSelected = selectedPositions.some(
                      (pos) =>
                        pos.caseId === id && pos.row === row && pos.col === col,
                    );

                    let typeTip: string | undefined = '';

                    if (tipAtPosition) {
                      typeTip = checkTypeTip(
                        tipAtPosition?.type,
                        tipAtPosition?.diameter,
                      );
                    }

                    return (
                      <span
                        key={col}
                        className={`dot ${typeTip} ${hasTib ? 'occupied' : 'free'} ${isSelected ? 'selected' : ''}`}
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
                          selectTip(id, row, col, 1);
                          const tib = tips.find(
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

      {selectedCell && (
        <div className="usage-info">
          <InformationTips selectedTip={selectedCell} />
        </div>
      )}

      <p className="usage-count">
        Quantidade de Ponteiras selecionadas: {selectedPositions.length}
      </p>
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
          <ConfirmeTip
            selectedTips={selectedPositions}
            caseData={caseData}
            onSaveTipUsages={onSaveTipUsages}
            buttonBack={() => setConfirmeUse(false)}
            clearSelectedTip={() => setSelectedPositions([])}
            clearSelectedInformation={() => setSelectedCell(null)}
            closeWindow={closeWindow}
          />
        </div>
      )}
    </>
  );
}
