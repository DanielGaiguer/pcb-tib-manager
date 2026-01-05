import type { JSX } from 'react';
import React from 'react';
import type { CaseProtocol } from '../types/Case';
import type { TibProtocol } from '../types/Tib';
import { CaseMatrixUsage } from './CaseMatrixUsage';
import type { TibUsage } from '../types/tibUsage';
import '../styles/registerUses.css';

type Props = {
  cases: CaseProtocol[];
  tibs: TibProtocol[];
  onSaveTibUsages: (tibs: TibUsage[]) => void;
  buttonBack: () => void;
};

export function RegisterUses({
  cases,
  tibs,
  onSaveTibUsages,
  buttonBack,
}: Props): JSX.Element {
  return (
    <div className="register-uses">
      <button className="btn btn-secondary back-button" onClick={buttonBack}>
        Voltar
      </button>
      <CaseMatrixUsage
        caseData={cases}
        tibs={tibs}
        onSaveTibUsages={onSaveTibUsages}
      />
    </div>
  );
}
