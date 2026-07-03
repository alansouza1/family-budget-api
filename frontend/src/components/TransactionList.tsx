import { useState } from "react";
import { Transaction, TransactionType } from "../types";
import { formatCurrency } from "../utils/format";
import { ArrowUpRight, ArrowDownRight, ClipboardList, Filter } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
}

export default function TransactionList({ transactions, loading }: TransactionListProps) {
  const [filter, setFilter] = useState<"All" | TransactionType>("All");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "All") return true;
    return t.type === filter;
  });

  const hasTransactions = filteredTransactions.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header com Filtros */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-blue-600" />
            Transações Registradas
          </h2>
          <p className="text-xs text-slate-500">Histórico de todas as receitas e despesas</p>
        </div>

        {/* Botões de Filtros */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" />
            Filtrar:
          </span>
          <button
            onClick={() => setFilter("All")}
            className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
              filter === "All"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tudo
          </button>
          <button
            onClick={() => setFilter("Income")}
            className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer flex items-center gap-0.5 transition-colors ${
              filter === "Income"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Receitas
          </button>
          <button
            onClick={() => setFilter("Expense")}
            className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer flex items-center gap-0.5 transition-colors ${
              filter === "Expense"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            <ArrowDownRight className="h-3.5 w-3.5" />
            Despesas
          </button>
        </div>
      </div>

      {/* Tabela ou estado vazio */}
      {!hasTransactions ? (
        <div className="p-12 text-center text-slate-500 bg-white">
          <p className="text-sm font-medium">Nenhuma transação encontrada.</p>
          <p className="text-xs text-slate-400 mt-1">
            {filter === "All"
              ? "Cadastre transações vinculadas aos moradores no formulário ao lado."
              : `Não existem transações do tipo ${filter === "Income" ? "Receita" : "Despesa"} registradas.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-200">
                <th className="px-5 py-3 font-bold">ID Transação</th>
                <th className="px-5 py-3 font-bold">Descrição</th>
                <th className="px-5 py-3 font-bold">Morador</th>
                <th className="px-5 py-3 font-bold">Tipo</th>
                <th className="px-5 py-3 text-right font-bold">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm bg-white">
              {filteredTransactions.map((t) => {
                const isIncome = t.type === "Income";
                return (
                  <tr key={t.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100 text-slate-800">
                    {/* ID */}
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 select-all">
                      {t.id}
                    </td>

                    {/* Descrição */}
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {t.description}
                    </td>

                    {/* Pessoa vinculada */}
                    <td className="px-5 py-3.5">
                      <div className="text-slate-800 font-bold">
                        {t.personName || "Morador"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID Pessoa: {t.personId}
                      </div>
                    </td>

                    {/* Tipo badge */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}>
                        {isIncome ? (
                          <>
                            <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                            Receita
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="h-3 w-3 text-rose-600" />
                            Despesa
                          </>
                        )}
                      </span>
                    </td>

                    {/* Valor em BRL */}
                    <td className={`px-5 py-3.5 text-right font-bold font-mono text-sm ${
                      isIncome ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {isIncome ? "+" : "-"} {formatCurrency(t.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
