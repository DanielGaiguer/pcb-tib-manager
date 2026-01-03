import { useState, type JSX } from 'react';
import { type CaseProtocol } from '../types/Case';
//import { Button } from './button';
import React from 'react';
import { toast } from 'react-toastify';

type Props = {
  onSubmit: (data: CaseProtocol) => void;
  onOpenCaseForm: () => void;
  onDataEdit?: CaseProtocol;
};

export function CaseForm({
  onSubmit,
  onOpenCaseForm,
  onDataEdit,
}: Props): JSX.Element {
  const [form, setForm] = useState<CaseProtocol>({
    id: onDataEdit?.id ? onDataEdit.id : crypto.randomUUID(),
    name: onDataEdit?.name ? onDataEdit.name : '',
    rows: onDataEdit?.rows ? onDataEdit.rows : 0,
    cols: onDataEdit?.cols ? onDataEdit.cols : 0,
    active: onDataEdit?.active ? onDataEdit.active : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onOpenCaseForm();
    setForm({ id: '', name: '', rows: 0, cols: 0, active: true });
    toast.success('Case adicionada com sucesso.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={onOpenCaseForm}> Voltar</button>
      <label htmlFor="name">Nome da Case: </label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <br />
      <label htmlFor="rows">Quantidade de Linhas: </label>
      <input
        type="number"
        id="rows"
        name="rows"
        value={form.rows}
        onChange={(e) => setForm({ ...form, rows: Number(e.target.value) })}
      />

      <br />
      <label htmlFor="cols">Quantidade de Colunas: </label>
      <input
        type="number"
        id="cols"
        name="cols"
        value={form.cols}
        onChange={(e) => setForm({ ...form, cols: Number(e.target.value) })}
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
