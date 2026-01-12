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
import { Loading } from './components/Loading';
import './styles/dotsStyles.css';
import './styles/btnStyles.css';
import './styles/formTip.css';
import './styles/formCase.css';
//import { CaseMatrix } from './components/CaseMatrix';

// URL do backend:
const API_URL = 'https://backend-pcb-tip-manager.onrender.com/sync';

function App(): JSX.Element {
  // Estado para abrir o componente, nele tem os dados que serao extraidos e usados no componente, se nao tiver nada, ele nao renderiza
  const [openCase, setOpenCase] = useState<CaseProtocol | null>(null);
  // Estado para abrir o componente, apenas aberto ou não
  const [openCaseForm, setOpenCaseForm] = useState<boolean>(false);
  // Estado para dizer se um dado está sendo editado ou criado, se for undefined ele esta sendo criado
  const [dataEditCase, setDataEditCase] = useState<CaseProtocol | undefined>(
    undefined,
  );
  // Estado somente para renderizar um componente
  const [openRegisterUse, onOpenRegisterUse] = useState<boolean>(false);
  // Estado de todas as cases, todas as cases existentes, ao ser renderizado pega do localStorage, por meio da função
  const [cases, setCases] = useState<CaseProtocol[]>(() => loadLocal().cases);
  // Estado de todas as tips, todas as cases existentes, ao ser renderizado pega do localStorage, por meio da função
  const [tips, setTips] = useState<TipProtocol[]>(() => loadLocal().tips);

  // Estado para dizer se tem alguma atualização pendente no localStorage, que não foi sincronizada com o Google Sheets
  const [pendingSync, setPendingSync] = useState<boolean>(() => {
    // Se existir, começa com ele, senão começa com false
    return loadLocal().pendingSync ?? false;
  });
  // useRef é um hook do React que permite guardar um valor mutável que persiste entre renderizações, sem causar re-render quando ele muda. Diferente do useState, mudar .current não dispara renderização
  // Esta linha afirma se, o localStorage está carregando dados do Sheets, e essa variável não vai fazer o componente renderizar de novo se mudar.
  const isHydratingFromSheets = useRef(false);

  // Essa funçao ira retornar dois estados, que dirão se o usuario está logaado, e se não estiver, se o middleware deve ser aberto para ele logar
  const { isLogged, setIsLogged, middleware, setMiddleware } = useAccessGuard();

  // Estado para renderizar componente de Loading
  const [loading, setLoading] = useState<boolean>(false);

  // Essa função é responsavel por sincronizar, por enviar os dados do estado e salva-los com a planilha do Google Sheets
  const syncWithSheets = async (
    caixas: CaseProtocol[],
    pontas: TipProtocol[],
  ) => {
    try {
      // Vai fazer a ligação com o Backend da aplicação, que é responsavel por registrar os dados na planilha
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caixas, pontas }),
      });

      // Se não tiver resposta, vai retornar um erro
      if (!response.ok) throw new Error('Erro na requisição');

      //Vai guardar a resposta convertida em JSON
      const data = await response.json();

      // Se ela retornar um status diferente, vai lançar um erro
      if (data.status !== 'ok') {
        throw new Error('Resposta inesperada da API');
      }
    } catch (err) {
      console.error('Falha ao sincronizar:', err);
    }
  };

  // Uma função useEffect, será executada toda vez que o componente for renderizado

  // Funções que fazem efeitos colaterais, como buscar dados de uma API ou atualizar estado com setState, não podem rodar durante a renderização do componente. Colocando a função dentro de useEffect, garantimos que ela rode depois que o componente renderizou, de forma segura, e apenas quando quisermos (com o [] de dependências)
  useEffect(() => {
    // vai criar a função que vai carregar os dados do googlw sheets
    async function loadFromSheets() {
      setLoading(true); // mostra loading, enquanto a funcao é executada
      isHydratingFromSheets.current = true; // Declara que os dados da aplicação, são os dados que estão na planilha
      const res = await fetch(API_URL); // Quando nao declarado, faz um get por padrão
      const data = await res.json(); // Vai criar em uma variavel os dados do get

      // Vai chamar uma funçao, que ira reorganizar os dados, para serem extraidos na aplicacao, pois os formatos que veem, direto da API, sao formatos diferentes
      const casesSheet = mapCasesFromSheet(data.caixas);
      const tipsSheet = mapTipsFromSheet(data.pontas);

      // Vai setar o estado com estes dados
      setCases(casesSheet);
      setTips(tipsSheet);

      // Vai salvar no localStorage
      saveLocal(casesSheet, tipsSheet, false);

      //Essa linha marca o fim da hidratação: ela diz à aplicação ‘ok, os dados da planilha já chegaram, podem ser usados normalmente’. Sem isso, outras partes do app poderiam pensar que os dados ainda estão sendo carregados e agir errado. Serve como uma flag para outras partes do código saberem que os dados estão sendo carregados da planilha, e não de outro lugar (como localStorage ou estado já existente).
      isHydratingFromSheets.current = false;

      setLoading(false); // esconde loading
    }

    loadFromSheets(); // Chama a função
  }, []);

  // Esse useEffect sera renderizado sempre que os estados cases, tips, mudarem
  useEffect(() => {
    //Impede que o efeito rode enquanto a aplicação estiver carregando os dados do Google Sheets. Isso evita sobreposição ou sobrescrita dos dados que acabaram de ser carregados da planilha.
    if (isHydratingFromSheets.current) return;

    // vai salvar os dados no localStorage, o terceiro parametro serve para dizer se precisa sincronizar ou não com o Google Sheets
    saveLocal(cases, tips, true);
    // Apresenta a mesma informação, porem no estado
    setPendingSync(true);
  }, [cases, tips]);

  // Esse useEffect sera renderizado sempre que os estados cases, tips e pendingSync mudarem
  useEffect(() => {
    // Se ele for false, vai parar a funcao
    if (!pendingSync) return;

    // Vai criar um timeout para enviar os dados para a planilha, enquanto as mudanças estiverem pendente
    const timeout = setTimeout(async () => {
      try {
        //console.log('Enviando para a planilha');
        // Vai mandar para a planilha
        await syncWithSheets(cases, tips);

        // Vai atualizar o localStorage, e vai dizer que nao esta mais pendente a atualizacao necessaria na planilha
        saveLocal(cases, tips, false);
        // Tambem vai atualizar isso no estado
        setPendingSync(false);
      } catch (err) {
        console.error('Auto-sync falhou, tentará novamente', err);
      }
    }, 3000); // debounce de 3s

    return () => clearTimeout(timeout); // Vai resetar o timeout
  }, [pendingSync, cases, tips]);

  // Vai renderizar se o estado de pendingSync, cases e tips
  useEffect(() => {
    const handler = () => {
      // Verifica se há alterações pendentes (pendingSync). Se houver, tenta sincronizar os dados (syncWithSheets) antes da página ser fechada.
      if (pendingSync) {
        syncWithSheets(cases, tips); // Vai sincronizar com o sheets
      }
    };

    // Adiciona um “ouvinte” para o evento beforeunload. Esse evento é disparado quando o usuário tenta fechar a aba, recarregar a página ou sair do site. Nesse caso, o handler é chamado.
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [pendingSync, cases, tips]);

  // Funcao para ser chamada no submit de adicionar Case
  const handleSubmitCase = (caseData: CaseProtocol) => {
    if (dataEditCase) {
      // Se tiver dados de edicao no estado, inves de criar um novo vai atualiza o case existente
      //Vai setar o estado
      setCases((prev) =>
        //Vai rodar todos os cases, se o id daquela posicao, for igual o id que esta sendo enviado, vai retornar casedata, senao, vai retornar o mesmo da posicao
        prev.map((c) => (c.id === caseData.id ? caseData : c)),
      );
    } else {
      // Novo: apenas adiciona
      setCases((prev) => [...prev, caseData]);
    }

    setOpenCaseForm(false); // Vai fechar o formulario de case
    setDataEditCase(undefined); // vai limpar a edição
  };

  // Funcao para deletar case
  const deleteCase = (caseData: CaseProtocol): void => {
    // vai setar o estado de cases
    setCases((prevCases) =>
      // Vai rodar o array de cases
      prevCases.map((caseMap) =>
        //Se o id da posicao, for igual ao do parametro, vai retornar o mesmo elemeno, mas com active: false, senao retorna o mesmo elemento
        caseMap.id === caseData.id ? { ...caseMap, active: false } : caseMap,
      ),
    );
  };

  // Funcao para edicao da Case
  const editCase = (caseData: CaseProtocol): void => {
    //setOpenCaseForm(false);
    // vai abrir o Middleware, pedir login
    if (!isLogged) setMiddleware(true);
    // vai abrir o formulario da case
    setOpenCaseForm(true);
    // Vai setar o estado de edicao com aquela case
    setDataEditCase(caseData);
  };

  // Funcao para adicionar a tip ao estado global
  const addTip = (newTip: TipProtocol): void => {
    setTips((prevTips) => {
      // Verifica existência
      // Retorna boolean
      // Não altera o array
      // Retorna true se pelo menos um elemento do array satisfizer a condição da função.
      const exists = prevTips.some((tip) => tip.id === newTip.id);

      if (exists) {
        //“Na posição onde o id bate, coloque OUTRO objeto”
        // Isso é substituição, não adição.
        return prevTips.map((tip) => (tip.id === newTip.id ? newTip : tip));
      }

      // Retorna o estado atual mais o novo tip
      return [...prevTips, newTip];
    });
  };

  //Funcao para registrar usos
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

  const handleManualSync = async () => {
    try {
      setLoading(true);

      await syncWithSheets(cases, tips);

      saveLocal(cases, tips, false);
      setPendingSync(false);
    } catch (err) {
      console.error('Erro no sync manual:', err);
    } finally {
      setLoading(false);
    }
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
                      setMiddleware(true);
                      setOpenCaseForm(false);
                    }}
                    acessCompleted={() => {
                      setMiddleware(false);
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
          <>
            <button
              className="btn use-tip"
              onClick={() => onOpenRegisterUse(true)}
            >
              Usar ponteiras
            </button>
            <button
              className="btn btn-sync-sheets"
              onClick={handleManualSync}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar na Planilha'}
            </button>
          </>
        )}
      </>
    );
  }

  return (
    <div className="app">
      <div className="main">
        {loading && <Loading message="Sincronizando dados..." />}
        <h1 className="title-main">Sistema de Ponteiras PCB</h1>

        {/* 🔁 Conteúdo variável */}
        <div className="page-content">{content}</div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
