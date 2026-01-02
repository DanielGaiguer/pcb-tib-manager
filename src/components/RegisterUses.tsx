import type { JSX } from 'react';
import React from 'react';

type Props = {
  buttonBack: () => void;
};

export function RegisterUses({ buttonBack }: Props): JSX.Element {
  return <button onClick={buttonBack}>Voltar</button>;
}
