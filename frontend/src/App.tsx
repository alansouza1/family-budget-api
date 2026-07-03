import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import { apiService, isDemoModeEnabled, setDemoMode, ApiError } from "./services/api";
import { Person, Transaction, Summary } from "./types";
import { AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";

/**
 * Main application component coordinating the residential expense tracker state.
 * Implements a single-view, single-screen structural layout for high usability.
 * 
 * Code structure is in English; user interface labels and messages are in Portuguese.
 */
export default function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoMode, setDemoModeState] = useState<boolean>(isDemoModeEnabled());

  /**
   * Refreshes all financial data from the active API service (Live .NET or Local Demo Mock).
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [peopleList, transactionsList, summaryData] = await Promise.all([
        apiService.getPersons(),
        apiService.getTransactions(),
        apiService.getSummary(),
      ]);

      setPeople(peopleList || []);
      setTransactions(transactionsList || []);
      setSummary(summaryData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        // If we fail to connect to .NET server, inform the user and suggest Demo Mode
        setError(
          "Não foi possível conectar ao servidor .NET da porta 8080. Verifique se o backend está ativo ou ative o 'Modo Demo' para testar offline."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial data on mount or when demoMode is toggled
  useEffect(() => {
    loadData();
  }, [demoMode, loadData]);

  // Handle turning on Demo Mode quickly from the alert message
  const handleEnableDemoMode = () => {
    setDemoMode(true);
    setDemoModeState(true);
    setSuccessMessage("Modo de simulação (Demo) ativado com sucesso! Dados persistidos localmente.");
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handlePersonCreated = () => {
    setSuccessMessage("Morador cadastrado com sucesso!");
    loadData();
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handlePersonDeleted = () => {
    setSuccessMessage("Morador e suas transações excluídos com sucesso!");
    loadData();
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleTransactionCreated = () => {
    setSuccessMessage("Transação registrada com sucesso!");
    loadData();
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col pb-12">
      {/* Dynamic Header */}
      <Header 
        onRefresh={loadData} 
        demoMode={demoMode} 
        setDemoModeState={setDemoModeState} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full space-y-6">
        
        {/* Banner de Sucesso */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-2.5 text-emerald-800 text-sm shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Banner de Erros Gerais (com opção de modo Demo inteligente) */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-rose-800 text-sm shadow-sm animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Aviso de Integração</p>
                <p className="text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            {!demoMode && (
              <button
                onClick={handleEnableDemoMode}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-sm cursor-pointer"
                id="btn-force-demo"
              >
                <HelpCircle className="h-4 w-4" />
                Ativar Modo Demo Offline
              </button>
            )}
          </div>
        )}

        {/* 1. SEÇÃO DE CONSULTA DE TOTAIS (Consolidated Dashboard) */}
        <Dashboard summary={summary} loading={loading} />

        {/* 2. GRID PRINCIPAL (Single Screen: Pessoas à esquerda, Transações à direita) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Coluna Pessoas */}
          <div className="space-y-6">
            <PersonForm onPersonCreated={handlePersonCreated} />
            <PersonList 
              people={people} 
              loading={loading} 
              onPersonDeleted={handlePersonDeleted} 
            />
          </div>

          {/* Coluna Transações */}
          <div className="space-y-6">
            <TransactionForm 
              people={people} 
              onTransactionCreated={handleTransactionCreated} 
            />
            <TransactionList 
              transactions={transactions} 
              loading={loading} 
            />
          </div>

        </div>

      </main>
    </div>
  );
}
