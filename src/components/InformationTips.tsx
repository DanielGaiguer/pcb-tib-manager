import type { JSX } from 'react';
import React from 'react';
import type { TipProtocol } from '../types/tip';

interface InformationTipsProps {
  selectedTip: TipProtocol;
}

export function InformationTips({
  selectedTip,
}: InformationTipsProps): JSX.Element {
  return (
    <ul>
      <h3>Informações da Ponteira: </h3>
      <li>Posição da Ponteira: {selectedTip.position}</li>
      <li>Tipo da Ponteira: {selectedTip.type}</li>
      <li>Diametro da Ponteira: {selectedTip.diameter}</li>
    </ul>
  );
}
