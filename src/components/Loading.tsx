import React from 'react';
import type { JSX } from 'react';
import './loading.css'; // Importa os estilos

type LoadingProps = {
  message?: string; // Mensagem opcional
};

export function Loading({
  message = 'Carregando...',
}: LoadingProps): JSX.Element {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <span className="loading-message">{message}</span>
    </div>
  );
}
