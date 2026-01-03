import type { JSX } from 'react';
import React, { useState } from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibUsage } from '../types/tibUsage';

interface ConfirmeTibsProtocol {
  selectedTibs: { caseId: string; row: number; col: number; uses: number }[];
  caseData: CaseProtocol[];
  onSaveTibUsages: (tibs: TibUsage[]) => void;
  buttonBack: () => void;
}

export function ConfirmeTib({
  selectedTibs,
  caseData,
  onSaveTibUsages,
  buttonBack,
}: ConfirmeTibsProtocol): JSX.Element {
  const [tibUses, setTibUses] = useState<number>(1);

  const columnLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C...
  };

  const handleConfirm = () => {
    onSaveTibUsages(selectedTibs);
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
                  <span className="tib-item">
                    {tib.row + 1}
                    {columnLabel(tib.col)}
                  </span>
                  <button
                    onClick={() => tibUses > 0 && setTibUses(() => tibUses - 1)}
                  >
                    -
                  </button>
                  <span key={index}>{tibUses}</span>
                  <button onClick={() => setTibUses(() => tibUses + 1)}>
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <button onClick={handleConfirm}>Salvar</button>
    </>
  );
}
