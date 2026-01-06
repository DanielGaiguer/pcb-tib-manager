import type { JSX } from 'react';
import React, { useState } from 'react';
import { saveAccess } from '../storage/saveAccess';
import { toast } from 'react-toastify';

type Props = {
  closedMiddleware: () => void;
};

const PASSWORD_KEY = 'Senai2025';
export function Middleware({ closedMiddleware }: Props): JSX.Element {
  const [inputPassword, setInputPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const passwordFilter = inputPassword.trim();
    if (passwordFilter === PASSWORD_KEY) {
      saveAccess();
      closedMiddleware();
      toast.success('Acesso liberado com sucesso!');
    }
  };

  return (
    <>
      <button onClick={closedMiddleware}>Voltar</button>
      <form onSubmit={handleSubmit}>
        <h1>Por favor digite a senha</h1>
        <label htmlFor="password">Senha de acesso: </label>
        <input
          type="text"
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
