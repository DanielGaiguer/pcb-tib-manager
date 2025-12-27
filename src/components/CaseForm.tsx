import { useState, type JSX } from 'react';
import { type CaseProtocol } from '../types/case';
//import { Button } from './button';
import React from 'react';

type Props = {
  onSubmit: (data: CaseProtocol) => void;
};

export function CaseForm({ onSubmit }: Props): JSX.Element {
  const [form, setForm] = useState<CaseProtocol>({
    id: crypto.randomUUID(),
    name: '',
    lines: 0,
    rows: 0,
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ id: '', name: '', lines: 0, rows: 0, active: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Nome da Case: </label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <br />
      <label htmlFor="lines">Quantidade de Linhas: </label>
      <input
        type="number"
        id="lines"
        name="lines"
        value={form.lines}
        onChange={(e) => setForm({ ...form, lines: Number(e.target.value) })}
      />

      <br />
      <label htmlFor="rows">Quantidade de Colunas: </label>
      <input
        type="number"
        id="rows"
        name="rows"
        value={form.rows}
        onChange={(e) => setForm({ ...form, rows: Number(e.target.value) })}
      />

      <br />
      <label htmlFor="active">A case está ativa? </label>
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
