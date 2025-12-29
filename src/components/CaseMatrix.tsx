import React from 'react';
import { useState, type JSX } from 'react';
import { type TibProtocol } from '../types/tib';

export function CaseMatrix(): JSX.Element {
  const [matrix, setMatrix] = useState<TibProtocol[][]>([]);

  function createMatrix(rows: number, cols: number): TibProtocol[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        ativa: false,
        id: null,
      })),
    );
  }

  return <> </>;
}
