import React, { type JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import { CaseMatrix } from './CaseMatrix';
import type { TibProtocol } from '../types/Tib';

type Props = {
  hasCases: () => boolean;
  casesState: CaseProtocol[];
  tibsState: TibProtocol[];
  onDelete: (caseData: CaseProtocol) => void;
  onEdit: (caseData: CaseProtocol) => void;
  onOpenCase: (caseData: CaseProtocol) => void;
  onOpenCaseForm: (arg0: boolean) => void;
};

export function CaseList({
  hasCases,
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
      <h1>{hasCases() ? 'Cases Ativas' : 'Nenhuma Case Cadastrada...'}</h1>
      <ul>
        {casesActive.map((caseData) => (
          <React.Fragment key={caseData.id}>
            <li key={caseData.id}>
              {caseData.name}
              <button
                className="btn btn-primary"
                onClick={() => {
                  onOpenCase(caseData);
                  onOpenCaseForm(false);
                }}
              >
                Abrir
              </button>
              <button className="btn btn-edit" onClick={() => onEdit(caseData)}>
                Editar
              </button>
              <button
                className="btn btn-delete"
                onClick={() => onDelete(caseData)}
              >
                Deletar
              </button>
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
        Cadastrar Case
      </button>
    </>
  );
}
