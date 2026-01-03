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
    <>
      <h3>Informações da Ponteira: </h3>
      <h4>Posição da Ponteira: {selectedTib.position}</h4>
      <h4>Tipo da Ponteira: {selectedTib.type}</h4>
      <h4>Diametro da Ponteira: {selectedTib.diameter}</h4>
    </>
  );
}
