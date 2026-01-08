import { useEffect, useRef, useState, type JSX } from 'react';
import { type CaseProtocol } from './types/case';
import { type TipProtocol } from './types/tip';
import { loadLocal } from './storage/loadLocal';
import { saveLocal } from './storage/saveLocal';
import { CaseForm } from './components/CaseForm';
import React from 'react';
import { CaseList } from './components/CaseList';
import { CaseDetail } from './components/CaseDetail';
import { CaseMatrix } from './components/CaseMatrix';
import { RegisterUses } from './components/RegisterUses';
import { ToastContainer } from 'react-toastify';
import type { TipUsage } from './types/tipUsage';
import { mapCasesFromSheet } from './utils/mapCasesFromSheet';
import { mapTipsFromSheet } from './utils/mapTipsFromSheet';
import { useAccessGuard } from './hooks/useAccessGuard';
import { Middleware } from './components/Middleware';
//import { CaseMatrix } from './components/CaseMatrix';

const API_URL = 'https://backend-pcb-tip-manager.onrender.com/sync';

function App(): JSX.Element {
  const [openCase, setOpenCase] = useState<CaseProtocol | null>(null);
  const [openCaseForm, setOpenCaseForm] = useState<boolean>(false);
  const [dataEditCase, setDataEditCase] = useState<CaseProtocol | undefined>(
    undefined,
  );
  const [openRegisterUse, onOpenRegisterUse] = useState<boolean>(false);
  const [cases, setCases] = useState<CaseProtocol[]>(() => loadLocal().cases);
  const [tips, setTips] = useState<TipProtocol[]>(() => loadLocal().tips);

  const [pendingSync, setPendingSync] = useState<boolean>(() => {
    return loadLocal().pendingSync ?? false;
  });

  const isHydratingFromSheets = useRef(false);

  const { isLogged, setIsLogged, middleware, setMiddleware } = useAccessGuard();

  const syncWithSheets = async (
    caixas: CaseProtocol[],
    pontas: TipProtocol[],
  ) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caixas, pontas }),
      });

      if (!response.ok) throw new Error('Erro na requisição');

      const data = await response.json();
      console.log('Resgatado da planilha:', data); // deve retornar { status: 'ok'  }
    } catch (err) {
      console.error('Falha ao sincronizar:', err);
    }
  };

  useEffect(() => {
    async function loadFromSheets() {
      isHydratingFromSheets.current = true;
      const res = await fetch(API_URL);
      const data = await res.json();

      const casesSheet = mapCasesFromSheet(data.caixas);
      const tipsSheet = mapTipsFromSheet(data.pontas);

      setCases(casesSheet);
      setTips(tipsSheet);

      saveLocal(casesSheet, tipsSheet, false);

      isHydratingFromSheets.current = false;
    }

    loadFromSheets();
  }, []);

  useEffect(() => {
    if (isHydratingFromSheets.current) return;

    saveLocal(cases, tips, true);
    setPendingSync(true);
  }, [cases, tips]);

  useEffect(() => {
    if (!pendingSync) return;

    const timeout = setTimeout(async () => {
      try {
        console.log('Enviando para a planilha');
        await syncWithSheets(cases, tips);

        saveLocal(cases, tips, false);
        setPendingSync(false);
      } catch (err) {
        console.error('Auto-sync falhou, tentará novamente', err);
      }
    }, 3000); // ⏱️ debounce de 3s

    return () => clearTimeout(timeout);
  }, [pendingSync, cases, tips]);

  useEffect(() => {
    const handler = () => {
      if (pendingSync) {
        syncWithSheets(cases, tips);
      }
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [pendingSync, cases, tips]);

  const handleSubmitCase = (caseData: CaseProtocol) => {
    if (dataEditCase) {
      // Edição: atualiza o case existente
      setCases((prev) =>
        prev.map((c) => (c.id === caseData.id ? caseData : c)),
      );
    } else {
      // Novo: adiciona
      setCases((prev) => [...prev, caseData]);
    }

    setOpenCaseForm(false);
    setDataEditCase(undefined); // limpa edição
  };

  const deleteCase = (caseData: CaseProtocol): void => {
    setCases((prevCases) =>
      prevCases.map((caseMap) =>
        caseMap.id === caseData.id ? { ...caseMap, active: false } : caseMap,
      ),
    );
  };

  const editCase = (caseData: CaseProtocol): void => {
    setMiddleware(true);
    setOpenCaseForm(true);
    setDataEditCase(caseData);
    // setCases((prevCases) =>
    //   prevCases.map((caseMap) =>
    //     caseMap.id === caseData.id ? { ...caseMap, ...caseData } : caseMap,
    //   ),
    // );
  };

  const addTip = (newTip: TipProtocol): void => {
    setTips((prevTips) => {
      // Verifica existência
      // Retorna boolean
      // Não altera o array
      const exists = prevTips.some((tip) => tip.id === newTip.id);

      if (exists) {
        //“Na posição onde o id bate, coloque OUTRO objeto”
        // Isso é substituição, não adição.
        return prevTips.map((tip) => (tip.id === newTip.id ? newTip : tip));
      }

      return [...prevTips, newTip];
    });
  };

  const saveTipUsages = (usages: TipUsage[]) => {
    setTips((prevTips) =>
      prevTips.map((tip) => {
        const usage = usages.find(
          (u) =>
            u.caseId === tip.caseId && u.col === tip.cols && u.row === tip.rows,
        );

        if (usage) {
          return { ...tip, uses: tip.uses + usage.uses };
        }

        return tip;
      }),
    );
  };

  const hasCases = (): boolean => {
    return cases.some((c) => c.active);
  };

  const handleNewCase = (): void => {
    setDataEditCase(undefined); // Garante form limpo
    setOpenCaseForm(true); // Abre o form
  };

  let content: JSX.Element;

  if (openRegisterUse) {
    content = (
      <RegisterUses
        cases={cases}
        tips={tips}
        onSaveTipUsages={saveTipUsages}
        buttonBack={() => onOpenRegisterUse(false)}
      />
    );
  } else if (openCase) {
    content = (
      <div className="case-detail">
        <CaseDetail caseData={openCase} onBack={() => setOpenCase(null)} />
        <CaseMatrix
          caseData={openCase}
          tips={tips}
          onSubmit={addTip}
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
          tipsState={tips}
          onDelete={deleteCase}
          onEdit={editCase}
          onOpenCase={setOpenCase}
          onOpenCaseForm={setOpenCaseForm}
          handleNewCase={handleNewCase}
        />

        {openCaseForm && (
          <>
            <div className="center-form-case">
              <div className="form-case">
                {/* Aplicando Middleware: */}
                {!isLogged && middleware && (
                  <Middleware
                    closedMiddleware={() => {
                      setMiddleware(false);
                      setOpenCaseForm(false);
                    }}
                    acessCompleted={() => {
                      setIsLogged(true);
                      setOpenCaseForm(true);
                    }}
                  />
                )}

                {isLogged && (
                  <CaseForm
                    key={dataEditCase ? dataEditCase.id : 'new-case'}
                    onSubmit={handleSubmitCase}
                    onOpenCaseForm={() => setOpenCaseForm(false)}
                    onDataEdit={dataEditCase}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {!openCase && hasCases() && (
          <button
            className="btn use-tip"
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
        <h1 className="title-main">Sistema de Ponteiras PCB</h1>

        {/* 🔁 Conteúdo variável */}
        <div className="page-content">{content}</div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
