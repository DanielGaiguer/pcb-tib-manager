import type { JSX } from 'react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  closedMiddleware: () => void;
  acessCompleted: () => void;
};

const PASSWORD_KEY = 'Senai2025';
export function Middleware({
  closedMiddleware,
  acessCompleted,
}: Props): JSX.Element {
  const [inputPassword, setInputPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const passwordFilter = inputPassword.trim();
    if (passwordFilter === PASSWORD_KEY) {
      acessCompleted();
      toast.success('Acesso liberado com sucesso!');
    }
  };

  return (
    <>
      <button className="btn" onClick={closedMiddleware}>
        Voltar
      </button>
      <form onSubmit={handleSubmit}>
        <h1>Por favor digite a senha.</h1>
        <label htmlFor="password">Senha de acesso: </label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-edit">
          Confirmar
        </button>
      </form>
    </>
  );
}
