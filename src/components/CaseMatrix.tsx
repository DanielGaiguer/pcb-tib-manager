import React from 'react';
import { useState, type JSX } from 'react';
import { type TibProtocol } from '../types/Tib';

export function CaseMatrix(): JSX.Element {
  function toggleCell(row: number, col: number) {
    setMatrix((prev) =>
      prev.map((r, rIdx) =>
        r.map((c, cIdx) =>
          rIdx === row && cIdx === col ? { ...c, active: !c.active } : c,
        ),
      ),
    );
  }

  function createMatrix(rows: number, cols: number): TibProtocol[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        ativa: false,
        id: null,
      })),
    );
  }

  const [matrix, setMatrix] = useState(() => createMatrix(rows, cols));

  return (
    <>
      <div className="matrix">
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="cell"
                onClick={() => toggleCell(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
