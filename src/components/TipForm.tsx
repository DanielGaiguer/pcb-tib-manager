import React, { useState } from 'react';
import { type JSX } from 'react';
import { type TipProtocol } from '../types/tip';
import type { CaseProtocol } from '../types/case';
import { toast } from 'react-toastify';
import { Middleware } from './Middleware';
import { saveAccess } from '../storage/saveAccess';
import { useAccessGuard } from '../hooks/useAccessGuard';

type Props = {
  caseData: CaseProtocol;
  tipData: TipProtocol | null;
  onSubmit: ((tipData: TipProtocol) => void) | undefined;
  positionTip: [[number, number], [number, string]];
  onOpenTipForm: () => void;
};

export function TipForm({
  caseData,
  tipData,
  onSubmit,
  positionTip,
  onOpenTipForm,
}: Props): JSX.Element {
  const [form, setForm] = useState<TipProtocol>({
    id: tipData?.id ?? crypto.randomUUID(),
    caseId: tipData?.caseId ?? caseData.id,
    rows: tipData?.rows ?? positionTip[0][0],
    cols: tipData?.cols ?? positionTip[0][1],
    position: tipData?.position ?? positionTip[1][0] + positionTip[1][1],
    type: tipData?.type ?? '',
    diameter: tipData?.diameter ?? '0',
    uses: tipData?.uses ?? 0,
    active: tipData?.active ?? true,
  });
  //O ?? só ignora: null e undefined

  // Usando o componente Hook
  const { isLogged, setIsLogged, middleware, setMiddleware } = useAccessGuard();

  const isEditing = Boolean(tipData);

  const handleSubmit = (e: React.FormEvent) => {
    let errors = 0;
    e.preventDefault();
    if (form.type.length <= 0) {
      toast.error('Campo tipo não pode ficar vazio.');
      errors++;
    }
    if (form.diameter.length <= 0) {
      toast.error('Campo diâmetro não pode ficar vazio.');
      errors++;
    }
    if (Number(form.diameter) <= 0) {
      toast.error('Campo diâmetro não deve ser nulo.');
      errors++;
    }
    if (errors) return;

    if (onSubmit) onSubmit(form);
    onOpenTipForm();
    if (!isEditing) {
      toast.success('Ponteira cadastrada com sucesso!');
    } else {
      toast.success('Ponteira atualizada com sucesso!');
    }
  };

  if (!isLogged && middleware) {
    return (
      <Middleware
        closedMiddleware={() => {
          setMiddleware(false);
          onOpenTipForm();
        }}
        acessCompleted={() => {
          saveAccess(); // marca acesso agora
          setIsLogged(true); // agora usuário está logado
          setMiddleware(false);
        }}
      />
    );
  }

  if (isLogged) {
    return (
      <form onSubmit={handleSubmit}>
        <button onClick={onOpenTipForm}> Voltar</button>
        <h2>{isEditing ? 'Editar Ponteira' : 'Cadastrar Ponteira'}</h2>

        <label htmlFor="position">Posição da Ponteira:</label>
        <input
          type="text"
          id="position"
          name="position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />

        <label htmlFor="type">Tipo da Ponteira:</label>
        <input
          type="text"
          id="type"
          name="type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />

        <label htmlFor="diameter">Diâmetro da Ponteira:</label>
        <input
          type="text"
          id="diameter"
          name="diameter"
          value={form.diameter}
          onChange={(e) => {
            const value = e.target.value.replace(',', '.');

            if (!/^\d*([.,]?\d*)?$/.test(value)) {
              toast.error('Este campo não deve conter letras.');
              return;
            }

            setForm({ ...form, diameter: value });
          }}
        />

        <label htmlFor="position">Quantidade de usos da ponteira:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.uses}
          onChange={(e) => {
            if (!/^\d*([.,]?\d*)?$/.test(e.target.value)) {
              toast.error('Este campo não deve conter letras.');
              return;
            }
            setForm({ ...form, uses: Number(e.target.value) });
          }}
        />

        <label htmlFor="active">Status da Ponteira: </label>

        <label>
          <input
            type="radio"
            id="active"
            name="active"
            checked={form.active === true}
            onChange={() => setForm({ ...form, active: true })}
          />
          Ativa
        </label>

        <label>
          <input
            type="radio"
            id="active"
            name="active"
            checked={form.active === false}
            onChange={() => setForm({ ...form, active: false })}
          />
          Inativa
        </label>

        <label htmlFor="rows">Linha da Ponteira (Sistema):</label>
        <input
          type="text"
          id="rows"
          name="rows"
          value={form.rows}
          onChange={(e) => {
            if (!/^\d*([.,]?\d*)?$/.test(e.target.value)) {
              toast.error('Este campo não deve conter letras.');
              return;
            }
            setForm({ ...form, rows: Number(e.target.value) });
          }}
        />

        <label htmlFor="cols">Coluna da Ponteira (Sistema):</label>
        <input
          type="text"
          id="cols"
          name="cols"
          value={form.cols}
          onChange={(e) => {
            if (!/^\d*([.,]?\d*)?$/.test(e.target.value)) {
              toast.error('Este campo não deve conter letras.');
              return;
            }
            setForm({ ...form, cols: Number(e.target.value) });
          }}
        />

        <button type="submit">Salvar</button>
      </form>
    );
  }

  return <h1>Erro 404</h1>;
}
