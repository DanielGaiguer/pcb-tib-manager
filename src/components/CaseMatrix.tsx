import React, { useState } from 'react';
import type { JSX } from 'react';
import type { CaseProtocol } from '../types/case';
import type { TipProtocol } from '../types/tip';
import { TipForm } from './TipForm';
import '../styles/caseMatrix.css';

interface CaseMatrixProps {
  caseData: CaseProtocol;
  tips: TipProtocol[];
  onSubmit?: ((tip: TipProtocol) => void) | undefined;
  mode?: 'preview' | 'detail';
}

export function CaseMatrix({
  caseData,
  tips,
  onSubmit,
  mode = 'detail',
}: CaseMatrixProps): JSX.Element {
  const [selectedTip, setSelectedTip] = useState<TipProtocol | null>(null);
  const [statePositionTip, setStatePositionTip] = useState<
    [[number, number], [number, string]]
  >([
    [0, 0],
    [0, ''],
  ]);
  const [openTipForm, onOpenTipForm] = useState<boolean>(false);
  const { rows, cols, id } = caseData;
  const isPreview = mode === 'preview';

  const maxDotSize = isPreview ? 35 : 40; // tamanho máximo
  const minDotSize = 20; // tamanho mínimo para muitas colunas
  const dotSizeDynamic = Math.min(
    maxDotSize,
    Math.max(minDotSize, 400 / cols), // 400px = largura máxima do grid
  );

  const gap = isPreview ? 8 : 15; // define o espaçamento entre as colunas

  const findTipAtPosition = (
    row: number,
    col: number,
  ): TipProtocol | undefined => {
    return tips.find(
      (tip) =>
        tip.caseId === id &&
        tip.rows === row &&
        tip.cols === col /*&& tip.active*/,
    );
  };

  const selectTip = (row: number, col: number): void => {
    const tip = findTipAtPosition(row, col);

    setStatePositionTip([
      [row, col],
      [row + 1, columnLabel(col)],
    ]);

    setSelectedTip(tip ?? null); // salva a tip inteira (ou null)
    onOpenTipForm(true);
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
              const tipAtPosition = tips.find(
                (tip) =>
                  tip.caseId === id && tip.rows === row && tip.cols === col,
              );

              let status: 'free' | 'occupied' | 'inactive' = 'free';

              if (tipAtPosition) {
                status = tipAtPosition.active ? 'occupied' : 'inactive';
              }

              return (
                <span
                  key={col}
                  className={`dot ${status}`}
                  style={{
                    width: dotSizeDynamic,
                    height: dotSizeDynamic,
                    cursor: isPreview ? 'default' : 'pointer',
                  }}
                  title={`Linha ${row + 1} - Coluna ${columnLabel(col)}`}
                  onClick={() => !isPreview && selectTip(row, col)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div>
        {openTipForm && (
          <div className="Form-tip">
            <div className="form-tip-card">
              <TipForm
                key={`${statePositionTip[0][0]}-${statePositionTip[0][1]}`}
                caseData={caseData}
                tipData={selectedTip}
                onSubmit={onSubmit}
                positionTip={statePositionTip}
                onOpenTipForm={() => onOpenTipForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
