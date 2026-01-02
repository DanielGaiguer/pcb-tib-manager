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

      <label htmlFor="rows">Linha da Ponteira (Sistema):</label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.rows}
        onChange={(e) => setForm({ ...form, rows: Number(e.target.value) })}
      />

      <br />
      <label htmlFor="rows">Coluna da Ponteira (Sistema):</label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.cols}
        onChange={(e) => setForm({ ...form, cols: Number(e.target.value) })}
      />

      <br />
      <label htmlFor="position">Posição da Ponteira:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.position}
        onChange={(e) => setForm({ ...form, position: e.target.value })}
      />

      <br />
      <label htmlFor="position">Tipo da Ponteira:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      />

      <br />
      <label htmlFor="position">Diametro da Ponteira:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.diameter}
        onChange={(e) => setForm({ ...form, diameter: Number(e.target.value) })}
      />

      <br />
      <label htmlFor="position">Quantidade de usos da ponteira:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.uses}
        onChange={(e) => setForm({ ...form, uses: Number(e.target.value) })}
      />

      <br />

      <label htmlFor="active">Status da Ponteira: </label>

      <br />
      <label>
        <input
          type="radio"
          id="active"
          name="active"
          checked={form.active === true}
          onChange={() => setForm({ ...form, active: true })}
        />
        Sim
      </label>

      <label>
        <input
          type="radio"
          id="active"
          name="active"
          checked={form.active === false}
          onChange={() => setForm({ ...form, active: false })}
        />
        Não
      </label>

      <br />

      <button type="submit">Salvar</button>
    </form>
  );
}
