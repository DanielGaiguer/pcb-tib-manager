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
import { mapCasesFromSheet } from './utils/mapCasesFromSheet';
import { mapTibsFromSheet } from './utils/mapTibsFromSheet';
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
    async function loadFromSheets() {
      const res = await fetch('http://localhost:3000/sync');
      const data = await res.json();

      console.log(data);
      const casesSheet = mapCasesFromSheet(data.caixas);
      const tibsSheet = mapTibsFromSheet(data.pontas);

      console.log('cases mapeados:', casesSheet);
      console.log('tibs mapeados:', tibsSheet);
    }

    loadFromSheets();
  }, []);

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

  const handleNewCase = (): void => {
    setDataEditCase(undefined); // Garante form limpo
    setOpenCaseForm(true); // Abre o form
  };

  const syncWithSheets = async (
    caixas: CaseProtocol[],
    pontas: TibProtocol[],
  ) => {
    try {
      const response = await fetch('http://localhost:3000/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caixas, pontas }),
      });

      if (!response.ok) throw new Error('Erro na requisição');

      const data = await response.json();
      console.log('Sync status:', data); // deve retornar { status: 'ok' }
    } catch (err) {
      console.error('Falha ao sincronizar:', err);
    }
  };

  let content: JSX.Element;

  if (openRegisterUse) {
    content = (
      <RegisterUses
        cases={cases}
        tibs={tibs}
        onSaveTibUsages={saveTibUsages}
        buttonBack={() => onOpenRegisterUse(false)}
      />
    );
  } else if (openCase) {
    content = (
      <div className="case-detail">
        <CaseDetail caseData={openCase} onBack={() => setOpenCase(null)} />
        <CaseMatrix
          caseData={openCase}
          tibs={tibs}
          onSubmit={addTib}
          mode="detail"
        />
      </div>
    );
  } else {
    content = (
      <>
        <CaseList
          hasCases={hasCases}
          casesState={cases}
          tibsState={tibs}
          onDelete={deleteCase}
          onEdit={editCase}
          onOpenCase={setOpenCase}
          onOpenCaseForm={setOpenCaseForm}
          handleNewCase={handleNewCase}
        />

        {openCaseForm && (
          <div className="center-form-case">
            <div className="form-case">
              <CaseForm
                onSubmit={addCase}
                onOpenCaseForm={() => setOpenCaseForm(false)}
                onDataEdit={dataEditCase}
              />
            </div>
          </div>
        )}

        {!openCase && hasCases() && (
          <button
            className="btn use-tib"
            onClick={() => onOpenRegisterUse(true)}
          >
            Usar ponteiras
          </button>
        )}
      </>
    );
  }

  return (
    <div className="app">
      <div className="main">
        <button onClick={() => syncWithSheets(cases, tibs)}>Sincronizar</button>
        <h1 className="title-main">Sistema de Ponteiras PCB</h1>

        {/* 🔁 Conteúdo variável */}
        <div className="page-content">{content}</div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
