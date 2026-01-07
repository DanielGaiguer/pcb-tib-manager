import type { JSX } from 'react';
import React from 'react';
import type { CaseProtocol } from '../types/case';

type Props = {
  caseData: CaseProtocol;
  onBack: () => void;
};

export function CaseDetail({ caseData, onBack }: Props): JSX.Element {
  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack}>
        {' '}
        Voltar
      </button>
      <h2>{caseData.name}</h2>

      <ul>
        <li>ID: {caseData.id}</li>
        <li>Quantidade de Linhas: {caseData.rows}</li>
        <li>Quantidade de Colunas: {caseData.cols}</li>
        <li>Status: {caseData.active ? 'Ativo' : 'Inativo'}</li>
      </ul>
    </div>
  );
}
