import type { JSX } from 'react';
import React, { useState } from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibUsage } from '../types/tibUsage';
import { toast } from 'react-toastify';

interface ConfirmeTibsProtocol {
  selectedTibs: { caseId: string; row: number; col: number; uses: number }[];
  caseData: CaseProtocol[];
  onSaveTibUsages: (tibs: TibUsage[]) => void;
  buttonBack: () => void;
  clearSelectedTib: () => void;
  clearSelectedInformation: () => void;
}

export function ConfirmeTib({
  selectedTibs,
  caseData,
  onSaveTibUsages,
  buttonBack,
  clearSelectedTib,
  clearSelectedInformation,
}: ConfirmeTibsProtocol): JSX.Element {
  const [tibStates, setTibStates] = useState(
    selectedTibs.map((tib) => ({ ...tib })), // cria cópia de cada tib
  );

  const columnLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C...
  };

  const handleConfirm = () => {
    console.log(tibStates);
    onSaveTibUsages(tibStates);
    clearSelectedTib();
    clearSelectedInformation();
    buttonBack();
    toast.success('Usos adicionados com sucesso!');
  };

  const changeTibUses = (
    caseId: string,
    row: number,
    col: number,
    delta: number,
  ) => {
    setTibStates((prev) =>
      prev.map((tib) =>
        tib.caseId === caseId && tib.row === row && tib.col === col
          ? { ...tib, uses: Math.max(0, tib.uses + delta) } // evita negativo
          : tib,
      ),
    );
  };

  return (
    <div className="modal-overlay">
      <div className="confirm-tibs">
        <button className="btn btn-secondary back-button " onClick={buttonBack}>
          Voltar
        </button>

        {caseData.map((caseItem) => {
          const tibsInCase = tibStates.filter(
            (tib) => tib.caseId === caseItem.id,
          );

          if (tibsInCase.length === 0) return null;

          return (
            <div key={caseItem.id} className="case-block">
              <h3>{caseItem.name}</h3>

              <div className="tibs-list">
                {tibsInCase.map((tib, index) => (
                  <div key={index}>
                    <span className="tib-item">
                      {tib.row + 1}
                      {columnLabel(tib.col)}
                    </span>
                    <button
                      onClick={() =>
                        changeTibUses(tib.caseId, tib.row, tib.col, -1)
                      }
                    >
                      -
                    </button>
                    <span>{tib.uses}</span>
                    <button
                      onClick={() =>
                        changeTibUses(tib.caseId, tib.row, tib.col, 1)
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
