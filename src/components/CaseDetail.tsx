import type { JSX } from 'react';
import React from 'react';
import type { CaseProtocol } from '../types/Case';

type Props = {
  caseData: CaseProtocol;
  onBack: () => void;
};

export function CaseDetail({ caseData, onBack }: Props): JSX.Element {
  return (
    <>
      <button onClick={onBack}> Voltar</button>
      <h2>{caseData.name}</h2>

      <ul>
        <li>ID do case: {caseData.id}</li>
        <li>Quantidade de Linhas: {caseData.rows}</li>
        <li>Quantidade de Colunas: {caseData.cols}</li>
        <li>Status: {caseData.active ? 'Ativo' : 'Inativo'}</li>
      </ul>
    </>
  );
}
