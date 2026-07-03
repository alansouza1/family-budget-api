import { Summary } from "../types";
import { formatCurrency } from "../utils/format";
import { ArrowUpRight, ArrowDownRight, Wallet, Users, Info } from "lucide-react";

interface DashboardProps {
  summary: Summary | null;
  loading: boolean;
}

export default function Dashboard({ summary, loading }: DashboardProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const defaultSummary: Summary = summary || {
    personSummaries: [],
    totalIncome: 0,
    totalExpenses: 0,
    totalBalance: 0
  };

  const hasData = defaultSummary.personSummaries.length > 0;

  return (
    <div className="space-y-6">
      {/* Cards de Totais Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Saldo Líquido Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Saldo Líquido Geral
            </p>
            <h2 className={`text-3xl font-extrabold tracking-tight font-sans ${
              defaultSummary.totalBalance >= 0 ? "text-slate-900" : "text-rose-600"
            }`}>
              {formatCurrency(defaultSummary.totalBalance)}
            </h2>
          </div>
          <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-2">
            <span className={`w-2 h-2 rounded-full ${defaultSummary.totalBalance >= 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
            {defaultSummary.totalBalance >= 0 ? "Saldo Geral Positivo" : "Saldo Geral de Déficit"}
          </p>
        </div>

        {/* Receitas Card */}
        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              Receitas (+)
            </p>
            <h2 className="text-2xl font-extrabold text-emerald-800 font-sans">
              {formatCurrency(defaultSummary.totalIncome)}
            </h2>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Soma de todas as entradas
          </p>
        </div>

        {/* Despesas Card */}
        <div className="bg-rose-50 p-5 rounded-xl border border-rose-100 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div>
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
              Despesas (-)
            </p>
            <h2 className="text-2xl font-extrabold text-rose-800 font-sans">
              {formatCurrency(defaultSummary.totalExpenses)}
            </h2>
          </div>
          <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-2">
            <ArrowDownRight className="h-3.5 w-3.5" />
            Soma de todas as saídas
          </p>
        </div>
      </div>

      {/* Consulta de Totais: Detalhado por Pessoa */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Resumo de Totais por Pessoa
            </h2>
            <p className="text-xs text-slate-500">
              Listagem consolidada das receitas, despesas e saldo líquido individual
            </p>
          </div>
          <div className="text-[10px] bg-slate-200/50 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
            {defaultSummary.personSummaries.length} {defaultSummary.personSummaries.length === 1 ? "Pessoa" : "Pessoas"}
          </div>
        </div>

        {!hasData ? (
          <div className="p-12 text-center bg-white">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
              <Info className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-900">Nenhum dado encontrado</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Cadastre pessoas e adicione transações para ver o detalhamento financeiro consolidado por membro residencial.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-200">
                  <th className="px-6 py-3 font-bold">Nome</th>
                  <th className="px-6 py-3 text-right font-bold">Receitas (+)</th>
                  <th className="px-6 py-3 text-right font-bold">Despesas (-)</th>
                  <th className="px-6 py-3 text-right font-bold">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm bg-white text-slate-800">
                {defaultSummary.personSummaries.map((p) => {
                  const isPositive = p.balance >= 0;
                  return (
                    <tr key={p.personId} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div>{p.personName}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 font-normal select-all">
                          ID: {p.personId}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-600 font-semibold font-mono">
                        {formatCurrency(p.totalIncome)}
                      </td>
                      <td className="px-6 py-4 text-right text-rose-600 font-semibold font-mono">
                        {formatCurrency(p.totalExpenses)}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold font-mono ${
                        isPositive ? "text-emerald-700 bg-emerald-50/25" : "text-rose-700 bg-rose-50/25"
                      }`}>
                        {formatCurrency(p.balance)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold">
                <tr>
                  <td className="px-6 py-4">
                    <div className="text-xs font-extrabold uppercase tracking-wider">TOTAIS GERAIS</div>
                    <div className="text-[9px] text-slate-400 font-normal">Soma agregada da residência</div>
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-emerald-400 font-mono text-base">
                    {formatCurrency(defaultSummary.totalIncome)}
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-rose-400 font-mono text-base">
                    {formatCurrency(defaultSummary.totalExpenses)}
                  </td>
                  <td className={`px-6 py-4 text-right font-extrabold font-mono text-base ${
                    defaultSummary.totalBalance >= 0 ? "text-emerald-300 bg-emerald-950/30" : "text-rose-300 bg-rose-950/30"
                  }`}>
                    {formatCurrency(defaultSummary.totalBalance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
