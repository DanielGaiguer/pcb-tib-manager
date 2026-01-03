import type { JSX } from 'react';
import React from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';
import { CaseMatrixUsage } from './CaseMatrixUsage';

type Props = {
  cases: CaseProtocol[];
  tibs: TibProtocol[];
  buttonBack: () => void;
};

export function RegisterUses({ cases, tibs, buttonBack }: Props): JSX.Element {
  return (
    <React.Fragment>
      <button onClick={buttonBack}>Voltar</button>
      <CaseMatrixUsage caseData={cases} tibs={tibs} />
    </React.Fragment>
  );
}
