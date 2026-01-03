import type { JSX } from 'react';
import React from 'react';

interface ConfirmeTibsProtocol {
  selectedTibs: { caseId: string; row: number; col: number }[];
  buttonBack: () => void;
}

export function ConfirmeTib({
  selectedTibs,
  buttonBack,
}: ConfirmeTibsProtocol): JSX.Element {
  return (
    <>
      <button onClick={buttonBack}>Voltar</button>
    </>
  );
}
