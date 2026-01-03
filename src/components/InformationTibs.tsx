import type { JSX } from 'react';
import type { CaseProtocol } from '../types/Case';
import React from 'react';

interface InformationTibsProps {
  caseItem: CaseProtocol;
}

export function InformationTibs(caseItem: InformationTibsProps): JSX.Element {
  console.log(caseItem);
  return (
    <>
      <h3>Informações da Ponteira: </h3>
    </>
  );
}
