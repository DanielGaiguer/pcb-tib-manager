import type { JSX } from 'react';
import React from 'react';
import type { CaseProtocol } from '../types/Case';

interface ConfirmeTibsProtocol {
  selectedTibs: { caseId: string; row: number; col: number }[];
  caseData: CaseProtocol[];
  buttonBack: () => void;
}

export function ConfirmeTib({
  selectedTibs,
  caseData,
  buttonBack,
}: ConfirmeTibsProtocol): JSX.Element {
  const columnLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C...
  };

  return (
    <>
      <button onClick={buttonBack}>Voltar</button>

      {caseData.map((caseItem) => {
        const tibsInCase = selectedTibs.filter(
          (tib) => tib.caseId === caseItem.id,
        );

        if (tibsInCase.length === 0) return null;

        return (
          <div key={caseItem.id} className="case-block">
            <h3>{caseItem.name}</h3>

            <div className="tibs-list">
              {tibsInCase.map((tib, index) => (
                <div key={index}>
                  <button>-</button>
                  <span className="tib-item">
                    {tib.row + 1}
                    {columnLabel(tib.col)}
                  </span>
                  <button>+</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
