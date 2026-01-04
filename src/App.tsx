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
import { RegisterUses } from './components/RegisterUses';
import { ToastContainer } from 'react-toastify';
import type { TibUsage } from './types/tibUsage';
//import { CaseMatrix } from './components/CaseMatrix';

function App(): JSX.Element {
  const [openCase, setOpenCase] = useState<CaseProtocol | null>(null);
  const [openCaseForm, setOpenCaseForm] = useState<boolean>(false);
  const [dataEditCase, setDataEditCase] = useState<CaseProtocol | undefined>(
    undefined,
  );
  const [openRegisterUse, onOpenRegisterUse] = useState<boolean>(false);
  const [cases, setCases] = useState<CaseProtocol[]>(() => loadLocal().cases);
  const [tibs, setTibs] = useState<TibProtocol[]>(() => loadLocal().tibs);

  useEffect(() => {
    saveLocal(cases, tibs);
  }, [cases, tibs]);

  const addCase = (newCase: CaseProtocol): void => {
    setCases((prev) => [...prev, newCase]);
  };

  const deleteCase = (caseData: CaseProtocol): void => {
    setCases((prevCases) =>
      prevCases.map((caseMap) =>
        caseMap.id === caseData.id ? { ...caseMap, active: false } : caseMap,
      ),
    );
  };

  const editCase = (caseData: CaseProtocol): void => {
    setOpenCaseForm(true);
    setDataEditCase(caseData);
    setCases((prevCases) =>
      prevCases.map((caseMap) =>
        caseMap.id === caseData.id ? { ...caseMap, ...caseData } : caseMap,
      ),
    );
  };

  const addTib = (newTib: TibProtocol): void => {
    setTibs((prevTibs) => {
      // Verifica existência
      // Retorna boolean
      // Não altera o array
      const exists = prevTibs.some((tib) => tib.id === newTib.id);

      if (exists) {
        //“Na posição onde o id bate, coloque OUTRO objeto”
        // Isso é substituição, não adição.
        return prevTibs.map((tib) => (tib.id === newTib.id ? newTib : tib));
      }

      return [...prevTibs, newTib];
    });
  };

  const saveTibUsages = (usages: TibUsage[]) => {
    setTibs((prevTibs) =>
      prevTibs.map((tib) => {
        const usage = usages.find(
          (u) =>
            u.caseId === tib.caseId && u.col === tib.cols && u.row === tib.rows,
        );

        if (usage) {
          return { ...tib, uses: tib.uses + usage.uses };
        }

        return tib;
      }),
    );
  };

  const hasCases = (): boolean => {
    if (cases.find((caseItem) => caseItem.active === true)) return true;
    return false;
  };

  return (
    <div className="app">
      <div className="main">
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
            hasCases={hasCases}
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

        <br />
        {!openCase && hasCases() && (
          <button onClick={() => onOpenRegisterUse(true)}>
            Usar ponteiras
          </button>
        )}
        {openRegisterUse && (
          <div className="center-form-case">
            <RegisterUses
              cases={cases}
              tibs={tibs}
              onSaveTibUsages={saveTibUsages}
              buttonBack={() => onOpenRegisterUse(false)}
            />
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
