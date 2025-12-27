import React, { type JSX } from 'react';
import type { CaseProtocol } from '../types/case';

type Props = {
  casesState: CaseProtocol[];
  onDelete: (caseData: CaseProtocol) => void;
  onOpenCase: (caseData: CaseProtocol) => void;
  onOpenCaseForm: (arg0: boolean) => void;
};

export function CaseList({
  casesState,
  onDelete,
  onOpenCase,
  onOpenCaseForm,
}: Props): JSX.Element {
  const casesActive = casesState.filter((c) => c.active);
  console.log(casesState);

  return (
    <>
      <h1>Cases Ativas</h1>
      <ul>
        {casesActive.map((caseData) => (
          <li key={caseData.id}>
            {caseData.name}
            <button onClick={() => onOpenCase(caseData)}>Abrir</button>
            <button onClick={() => onDelete(caseData)}>Deletar</button>
          </li>
        ))}
      </ul>
      <button onClick={() => onOpenCaseForm(true)}>Nova Case</button>
    </>
  );
}
