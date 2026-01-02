import { useEffect, useState, type JSX } from 'react';
import { type CaseProtocol } from './types/Case';
import { type TibProtocol } from './types/Tib';
import { loadLocal } from './storage/loadLocal';
import { saveLocal } from './storage/saveLocal';
import { CaseForm } from './components/CaseForm';
import React from 'react';
import { CaseList } from './components/CaseList';
import { CaseDetail } from './components/CaseDetail';
import { CaseMatrix } from './components/CaseMatrix';
//import { CaseMatrix } from './components/CaseMatrix';

function App(): JSX.Element {
  const [openCase, setOpenCase] = useState<CaseProtocol | null>(null);
  const [openCaseForm, setOpenCaseForm] = useState<boolean>(false);
  const [dataEditCase, setDataEditCase] = useState<CaseProtocol | undefined>(
    undefined,
  );
  const [cases, setCases] = useState<CaseProtocol[]>(() => loadLocal().cases);
  const [tibs, setTibs] = useState<TibProtocol[]>(() => loadLocal().tibs);

  useEffect(() => {
    saveLocal(cases, tibs);
    console.log('Todas as Ponteiras no State:', tibs);
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

  const editCase = (caseData: CaseProtocol): void => {
    console.log(caseData);
    setOpenCaseForm(true);
    setDataEditCase(caseData);
    setCases((prevCases) =>
      prevCases.map((caseMap) =>
        caseMap.id === caseData.id ? { ...caseMap, ...caseData } : caseMap,
      ),
    );
  };

  const addTib = (newTib: TibProtocol): void => {
    setTibs((prev) => [...prev, newTib]);
    console.log(newTib);
  };

  return (
    <>
      <h1>Sistema de Ponteiras PCB</h1>

      {openCase ? (
        <>
          <CaseDetail caseData={openCase} onBack={() => setOpenCase(null)} />
          <CaseMatrix
            caseData={openCase}
            tibs={tibs}
            onSubmit={addTib}
            mode="detail"
          />
        </>
      ) : (
        <CaseList
          casesState={cases}
          tibsState={tibs}
          onDelete={deleteCase}
          onEdit={editCase}
          onOpenCase={setOpenCase}
          onOpenCaseForm={setOpenCaseForm}
        />
      )}

      {openCaseForm && (
        <div className="center-form-case">
          <CaseForm
            onSubmit={addCase}
            onOpenCaseForm={() => setOpenCaseForm(false)}
            onDataEdit={dataEditCase}
          />
        </div>
      )}
    </>
  );
}

export default App;
