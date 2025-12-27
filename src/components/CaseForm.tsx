import { useState, type JSX } from 'react';
import { type CaseProtocol } from '../types/case';
import React from 'react';

type Props = {
  onSubmit: (data: CaseProtocol) => void;
};

export function CaseForm({ onSubmit }: Props): JSX.Element {
  const [form, setForm] = useState<CaseProtocol>({
    id: '',
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
      <label htmlFor="id">ID da case</label>
      <input
        type="text"
        id="id"
        name="id"
        value={form.id}
        onChange={(e) => setForm({ ...form, id: e.target.value })}
      />

      <br />
      <label htmlFor="Name">Nome da Case</label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <br />
      <label htmlFor="Name">Nome da Case</label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <br />
      <button type="submit">Adicionar</button>
    </form>
  );
}
