import type { JSX } from 'react';
import React from 'react';
import type { TibProtocol } from '../types/Tib';

interface InformationTibsProps {
  selectedTib: TibProtocol;
}

export function InformationTibs({
  selectedTib,
}: InformationTibsProps): JSX.Element {
  return (
    <ul>
      <h3>Informações da Ponteira: </h3>
      <li>Posição da Ponteira: {selectedTib.position}</li>
      <li>Tipo da Ponteira: {selectedTib.type}</li>
      <li>Diametro da Ponteira: {selectedTib.diameter}</li>
    </ul>
  );
}
