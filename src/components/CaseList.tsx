import React, { useState, type JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import { CaseMatrix } from './CaseMatrix';
import type { TibProtocol } from '../types/Tib';
import { WindowDelete } from './WindowDelete';

type Props = {
  hasCases: () => boolean;
  casesState: CaseProtocol[];
  tibsState: TibProtocol[];
  onDelete: (caseData: CaseProtocol) => void;
  onEdit: (caseData: CaseProtocol) => void;
  onOpenCase: (caseData: CaseProtocol) => void;
  onOpenCaseForm: (arg0: boolean) => void;
  handleNewCase: () => void;
};

export function CaseList({
  hasCases,
  casesState,
  tibsState,
  onDelete,
  onEdit,
  onOpenCase,
  onOpenCaseForm,
  handleNewCase,
}: Props): JSX.Element {
  const casesActive = casesState.filter((c) => c.active);
  const [caseToDelete, setCaseToDelete] = useState<CaseProtocol | null>(null);

  //const onDeleteCase()

  return (
    <>
      <h1>{hasCases() ? 'Cases Ativas' : 'Nenhuma Case Cadastrada...'}</h1>
      <ul className="list-cases">
        {casesActive.map((caseData) => (
          <React.Fragment key={caseData.id}>
            <li className="title-case" key={caseData.id}>
              {caseData.name}
            </li>
            <CaseMatrix caseData={caseData} tibs={tibsState} mode="preview" />
            <div className="div-buttons">
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
                onClick={() => setCaseToDelete(caseData)}
              >
                Deletar
              </button>
              {caseToDelete?.id === caseData.id && (
                <WindowDelete
                  onDelete={() => {
                    onDelete(caseData);
                    setCaseToDelete(null);
                  }}
                  onConfirmedDel={() => setCaseToDelete(null)}
                />
              )}
            </div>
          </React.Fragment>
        ))}
      </ul>
      <button className="btn main-button" onClick={() => handleNewCase()}>
        Cadastrar Case
      </button>
    </>
  );
}
