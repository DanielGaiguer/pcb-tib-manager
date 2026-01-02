import React, { type JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import { CaseMatrix } from './CaseMatrix';
import type { TibProtocol } from '../types/Tib';

type Props = {
  casesState: CaseProtocol[];
  tibsState: TibProtocol[];
  onDelete: (caseData: CaseProtocol) => void;
  onEdit: (caseData: CaseProtocol) => void;
  onOpenCase: (caseData: CaseProtocol) => void;
  onOpenCaseForm: (arg0: boolean) => void;
};

export function CaseList({
  casesState,
  tibsState,
  onDelete,
  onEdit,
  onOpenCase,
  onOpenCaseForm,
}: Props): JSX.Element {
  const casesActive = casesState.filter((c) => c.active);
  //console.log(casesState);

  return (
    <>
      <h1>Cases Ativas</h1>
      <ul>
        {casesActive.map((caseData) => (
          <React.Fragment key={caseData.id}>
            <li key={caseData.id}>
              {caseData.name}
              <button
                onClick={() => {
                  onOpenCase(caseData);
                  onOpenCaseForm(false);
                }}
              >
                Abrir
              </button>
              <button onClick={() => onDelete(caseData)}>Deletar</button>
              <button onClick={() => onEdit(caseData)}>Editar</button>
            </li>
            <CaseMatrix caseData={caseData} tibs={tibsState} mode="preview" />
          </React.Fragment>
        ))}
      </ul>
      <button
        onClick={() => {
          onOpenCaseForm(true);
        }}
      >
        Nova Case
      </button>
    </>
  );
}
