import type { JSX } from 'react';
import React from 'react';

interface Props {
  onDelete: () => void;
  onConfirmedDel: () => void;
}

export function WindowDelete({ onDelete, onConfirmedDel }: Props): JSX.Element {
  const confirmDel = (): void => {
    onDelete();
    onConfirmedDel();
  };

  return (
    <div className="windowConfirmDel">
      <div className="confirm-card">
        <h3>Tem certeza que deseja deletar?</h3>
        <button className="btn btn-secondary" onClick={onConfirmedDel}>
          Não
        </button>

        <button className="btn btn-delete" onClick={confirmDel}>
          Sim
        </button>
      </div>
    </div>
  );
}
