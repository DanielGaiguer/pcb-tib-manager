import React, { useState } from 'react';
import { type JSX } from 'react';
import { type TibProtocol } from '../types/Tib';
import type { CaseProtocol } from '../types/Case';

type Props = {
  caseData: CaseProtocol;
  tibData: TibProtocol | null;
  positionTib: [[number, number], [number, string]];
  onOpenTibForm: () => void;
};

export function TibForm({
  caseData,
  tibData,
  onOpenTibForm,
  positionTib,
}: Props): JSX.Element {
  const [form, setForm] = useState<TibProtocol>({
    id: tibData?.id || crypto.randomUUID(),
    caseId: tibData?.caseId || caseData.id,
    rows: tibData?.rows || positionTib[0][0],
    cols: tibData?.cols || positionTib[0][1],
    position: tibData?.position || positionTib[1][0] + positionTib[1][1],
    type: tibData?.type || '',
    diameter: tibData?.diameter || 0,
    uses: tibData?.uses || 0,
    active: tibData?.active || false,
    occupied: tibData?.occupied || false,
  });

  const isEditing = Boolean(tibData);

  console.log(caseData);
  console.log(positionTib);
  console.log(tibData);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={onOpenTibForm}> Voltar</button>
      <h2>{isEditing ? 'Editar Tib' : 'Cadastrar Tib'}</h2>
    </form>
  );
}
