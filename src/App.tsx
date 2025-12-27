import { useEffect, useState, type JSX } from 'react';
import { type CaseProtocol } from './types/case';
import { type TibProtocol } from './types/tib';
import { loadLocal } from './storage/loadLocal';
import { saveLocal } from './storage/saveLocal';
import { CaseForm } from './components/CaseForm';
import React from 'react';
import { CaseList } from './components/caseList';
import { CaseDetail } from './components/CaseDetail';

function App(): JSX.Element {
  const [openCase, setOpenCase] = useState<CaseProtocol | null>(null);
  const [cases, setCases] = useState<CaseProtocol[]>(() => loadLocal().cases);
  const [tibs, setTibs] = useState<TibProtocol[]>(() => loadLocal().tibs);

  useEffect(() => {
    saveLocal(cases, tibs);
  }, [cases, tibs]);

  const addCase = (newCase: CaseProtocol): void => {
    setCases((prev) => [...prev, newCase]);
    console.log(newCase);
  };

  return (
    <>
      <h1>Sistema de Ponteiras PCB</h1>
      <div className="case-form">
        <CaseForm onSubmit={addCase} />
      </div>

      {openCase ? (
        <CaseDetail caseData={openCase} onBack={() => setOpenCase(null)} />
      ) : (
        <CaseList casesState={cases} onOpenCase={setOpenCase} />
      )}
    </>
  );
}

export default App;
