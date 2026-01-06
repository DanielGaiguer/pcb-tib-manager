import React, { useState } from 'react';
import { type JSX } from 'react';
import { type TibProtocol } from '../types/Tib';
import type { CaseProtocol } from '../types/Case';
import { toast } from 'react-toastify';
import { Middleware } from './middleware';
import { saveAccess } from '../storage/saveAccess';
import { canAccess } from '../storage/canAccess';

type Props = {
  caseData: CaseProtocol;
  tibData: TibProtocol | null;
  onSubmit: ((tibData: TibProtocol) => void) | undefined;
  positionTib: [[number, number], [number, string]];
  onOpenTibForm: () => void;
};

export function TibForm({
  caseData,
  tibData,
  onSubmit,
  positionTib,
  onOpenTibForm,
}: Props): JSX.Element {
  const [form, setForm] = useState<TibProtocol>({
    id: tibData?.id || crypto.randomUUID(),
    caseId: tibData?.caseId || caseData.id,
    rows: tibData?.rows || positionTib[0][0],
    cols: tibData?.cols || positionTib[0][1],
    position: tibData?.position || positionTib[1][0] + positionTib[1][1],
    type: tibData?.type || '',
    diameter: tibData?.diameter || '0',
    uses: tibData?.uses || 0,
    active: tibData?.active || true,
  });

  const [isLogged, setIsLogged] = useState<boolean>(() => canAccess());
  const [middleware, setMiddleware] = useState<boolean>(!canAccess());

  React.useEffect(() => {
    //localStorage.clear();
    if (canAccess()) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  const isEditing = Boolean(tibData);

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
    onOpenTibForm();
    toast.success('Ponteira cadastrada com sucesso!');
  };

  if (!isLogged && middleware) {
    return (
      <Middleware
        closedMiddleware={() => {
          setMiddleware(false);
          onOpenTibForm();
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
        <button onClick={onOpenTibForm}> Voltar</button>
        <h2>{isEditing ? 'Editar Tib' : 'Cadastrar Tib'}</h2>

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

  return <h1>Voce nao tem acesso a esta pagina</h1>;
}
