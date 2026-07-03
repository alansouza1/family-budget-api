import React, { useState, useEffect } from "react";
import { Settings, Wifi, WifiOff, RefreshCw, HelpCircle } from "lucide-react";
import { getApiBaseUrl, setApiBaseUrl, isDemoModeEnabled, setDemoMode } from "../services/api";

interface HeaderProps {
  onRefresh: () => void;
  demoMode: boolean;
  setDemoModeState: (val: boolean) => void;
}

export default function Header({ onRefresh, demoMode, setDemoModeState }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "online" | "offline">("checking");

  // Check connection to real backend if demo mode is off
  useEffect(() => {
    if (demoMode) {
      setConnectionStatus("offline"); // In demo mode, we simulate offline
      return;
    }

    let isMounted = true;
    const checkConnection = async () => {
      setConnectionStatus("checking");
      try {
        const response = await fetch(`${apiUrl}/api/persons`, { signal: AbortSignal.timeout(3000) });
        if (response.ok && isMounted) {
          setConnectionStatus("online");
        } else if (isMounted) {
          setConnectionStatus("offline");
        }
      } catch {
        if (isMounted) {
          setConnectionStatus("offline");
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000); // Check every 15 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [demoMode, apiUrl]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(apiUrl.trim());
    setShowSettings(false);
    onRefresh();
  };

  const toggleDemoMode = () => {
    const nextValue = !demoMode;
    setDemoMode(nextValue);
    setDemoModeState(nextValue);
    onRefresh();
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title and Branding */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg tracking-wider text-white shadow-sm">
              $
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Controle Residencial
              </h1>
              <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
                React + TypeScript Frontend (.NET Local Integration)
              </p>
            </div>
          </div>

          {/* Controls & Connection Badges */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Status Badge */}
            {demoMode ? (
              <span 
                onClick={toggleDemoMode}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
                title="Clique para tentar conectar ao servidor real"
              >
                <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                <span>Simulação (Demo)</span>
              </span>
            ) : (
              <span 
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  connectionStatus === "online" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : connectionStatus === "checking"
                    ? "bg-slate-50 text-slate-500 border-slate-200 animate-pulse"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {connectionStatus === "online" ? (
                  <>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="hidden xs:inline text-slate-700 font-medium">Conectado: localhost:8080</span>
                    <span className="xs:hidden text-slate-700 font-medium">Conectado</span>
                  </>
                ) : connectionStatus === "checking" ? (
                  <>
                    <RefreshCw className="h-3 w-3 text-slate-400 animate-spin" />
                    <span className="text-slate-600 font-medium">Conectando...</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                    <span className="hidden xs:inline text-slate-700 font-medium">Sem Conexão .NET</span>
                    <span className="xs:hidden text-slate-700 font-medium">Offline</span>
                  </>
                )}
              </span>
            )}

            {/* Quick Toggle Mode Button */}
            <button
              onClick={toggleDemoMode}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                demoMode 
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              }`}
            >
              {demoMode ? "Usar .NET Real" : "Usar Modo Demo"}
            </button>

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Configurações de API"
              id="btn-settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Manual refresh button */}
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Recarregar dados"
              id="btn-refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal (Overlay) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-400" />
              Configuração do Endereço API
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Por padrão, o frontend tenta se comunicar com a API local em .NET rodando na porta 8080. Você pode alterar este endereço abaixo.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  URL da API .NET Backend
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="Ex: http://localhost:8080"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Dica:</span> Se o backend não estiver rodando no momento, use o <span className="text-indigo-400 font-semibold">Modo Demo</span> para testar todos os cadastros e regras diretamente no navegador com persistência local.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setApiUrl(getApiBaseUrl());
                    setShowSettings(false);
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-medium shadow transition-colors"
                >
                  Salvar Configuração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
