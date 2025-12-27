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
  const [openCaseForm, setOpenCaseForm] = useState<boolean>(false);
  const [cases, setCases] = useState<CaseProtocol[]>(() => loadLocal().cases);
  const [tibs, setTibs] = useState<TibProtocol[]>(() => loadLocal().tibs);

  useEffect(() => {
    saveLocal(cases, tibs);
  }, [cases, tibs]);

  const addCase = (newCase: CaseProtocol): void => {
    setCases((prev) => [...prev, newCase]);
    console.log(newCase);
  };

  const deleteCase = (caseData: CaseProtocol): void => {
    setCases((prevCases) =>
      prevCases.map((caseMap) =>
        caseMap.id === caseData.id ? { ...caseMap, active: false } : caseMap,
      ),
    );
  };

  return (
    <>
      <h1>Sistema de Ponteiras PCB</h1>

      {openCase ? (
        <CaseDetail caseData={openCase} onBack={() => setOpenCase(null)} />
      ) : (
        <CaseList
          casesState={cases}
          onDelete={deleteCase}
          onOpenCase={setOpenCase}
          onOpenCaseForm={setOpenCaseForm}
        />
      )}

      <div className="case-form">
        {openCaseForm && (
          <CaseForm
            onSubmit={addCase}
            onOpenCaseForm={() => setOpenCaseForm(false)}
          />
        )}
      </div>
    </>
  );
}

export default App;
