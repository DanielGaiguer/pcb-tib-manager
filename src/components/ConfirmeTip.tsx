import type { JSX } from 'react';
import React, { useState } from 'react';
import type { CaseProtocol } from '../types/case';
import type { TipUsage } from '../types/tipUsage';
import { toast } from 'react-toastify';

interface ConfirmeTipsProtocol {
  selectedTips: { caseId: string; row: number; col: number; uses: number }[];
  caseData: CaseProtocol[];
  onSaveTipUsages: (tips: TipUsage[]) => void;
  buttonBack: () => void;
  clearSelectedTip: () => void;
  clearSelectedInformation: () => void;
}

export function ConfirmeTip({
  selectedTips,
  caseData,
  onSaveTipUsages,
  buttonBack,
  clearSelectedTip,
  clearSelectedInformation,
}: ConfirmeTipsProtocol): JSX.Element {
  const [tipStates, setTipStates] = useState(
    selectedTips.map((tip) => ({ ...tip })), // cria cópia de cada tip
  );

  const columnLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C...
  };

  const handleConfirm = () => {
    onSaveTipUsages(tipStates);
    clearSelectedTip();
    clearSelectedInformation();
    buttonBack();
    toast.success('Usos adicionados com sucesso!');
  };

  const changeTipUses = (
    caseId: string,
    row: number,
    col: number,
    delta: number,
  ) => {
    setTipStates((prev) =>
      prev.map((tip) =>
        tip.caseId === caseId && tip.row === row && tip.col === col
          ? { ...tip, uses: Math.max(0, tip.uses + delta) } // evita negativo
          : tip,
      ),
    );
  };

  return (
    <div className="modal-overlay">
      <div className="confirm-tips">
        <button className="btn btn-secondary back-button " onClick={buttonBack}>
          Voltar
        </button>

        {caseData.map((caseItem) => {
          const tipsInCase = tipStates.filter(
            (tip) => tip.caseId === caseItem.id,
          );

          if (tipsInCase.length === 0) return null;

          return (
            <div key={caseItem.id} className="case-block">
              <h3>{caseItem.name}</h3>

              <div className="tips-list">
                {tipsInCase.map((tip, index) => (
                  <div key={index}>
                    <span className="tip-item">
                      {tip.row + 1}
                      {columnLabel(tip.col)}
                    </span>
                    <button
                      onClick={() =>
                        changeTipUses(tip.caseId, tip.row, tip.col, -1)
                      }
                    >
                      -
                    </button>
                    <span>{tip.uses}</span>
                    <button
                      onClick={() =>
                        changeTipUses(tip.caseId, tip.row, tip.col, 1)
                      }
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button className="btn confirm" onClick={handleConfirm}>
          Confirmar
        </button>
      </div>
    </div>
  );
}
