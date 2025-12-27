import type { JSX } from 'react';
import React from 'react';
import type { CaseProtocol } from '../types/case';

type Props = {
  caseData: CaseProtocol;
  onBack: () => void;
};

export function CaseDetail({ caseData, onBack }: Props): JSX.Element {
  console.log(caseData);
  return (
    <>
      <button onClick={onBack}> Voltar</button>
      <h2>{caseData.name}</h2>

      <ul>
        <li>{caseData.lines}</li>
        <li>{caseData.id}</li>
        <li>{caseData.rows}</li>
        <li>{caseData.active}</li>
      </ul>
    </>
  );
}
