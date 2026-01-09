import type { JSX } from 'react';
import React from 'react';
import type { CaseProtocol } from '../types/case';
import type { TipProtocol } from '../types/tip';
import { CaseMatrixUsage } from './CaseMatrixUsage';
import type { TipUsage } from '../types/tipUsage';
import '../styles/registerUses.css';

type Props = {
  cases: CaseProtocol[];
  tips: TipProtocol[];
  onSaveTipUsages: (tips: TipUsage[]) => void;
  buttonBack: () => void;
};

export function RegisterUses({
  cases,
  tips,
  onSaveTipUsages,
  buttonBack,
}: Props): JSX.Element {
  return (
    <div className="register-uses">
      <button className="btn btn-secondary back-button" onClick={buttonBack}>
        Voltar
      </button>
      <CaseMatrixUsage
        caseData={cases}
        tips={tips}
        onSaveTipUsages={onSaveTipUsages}
        closeWindow={buttonBack}
      />
    </div>
  );
}
