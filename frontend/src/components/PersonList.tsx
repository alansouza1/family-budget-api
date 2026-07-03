/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Person } from "../types";
import { Trash2, AlertTriangle, Users, ShieldAlert, Check } from "lucide-react";
import { apiService, ApiError } from "../services/api";

interface PersonListProps {
  people: Person[];
  loading: boolean;
  onPersonDeleted: () => void;
}

export default function PersonList({ people, loading, onPersonDeleted }: PersonListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError(null);
    try {
      await apiService.deletePerson(deleteTarget.id);
      setDeleteTarget(null);
      onPersonDeleted();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível excluir a pessoa. Tente novamente.");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const hasPeople = people.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Moradores Cadastrados
          </h2>
          <p className="text-xs text-slate-500">Gerencie as pessoas do controle residencial</p>
        </div>
        <span className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
          {people.length} {people.length === 1 ? "cadastrada" : "cadastradas"}
        </span>
      </div>

      {error && (
        <div className="m-4 flex items-start gap-2 bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs text-rose-700">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {!hasPeople ? (
        <div className="p-12 text-center text-slate-500 bg-white">
          <p className="text-sm font-medium">Nenhuma pessoa cadastrada.</p>
          <p className="text-xs text-slate-400 mt-1">Utilize o formulário ao lado para adicionar a primeira pessoa.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-200">
                <th className="px-5 py-3 font-bold">Identificador único (ID)</th>
                <th className="px-5 py-3 font-bold">Nome</th>
                <th className="px-5 py-3 font-bold">Idade</th>
                <th className="px-5 py-3 text-right font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm bg-white">
              {people.map((p) => {
                const isUnderage = p.age < 18;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100 text-slate-800">
                    {/* ID */}
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-400 select-all">
                      {p.id}
                    </td>
                    
                    {/* Nome */}
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {p.name}
                    </td>
                    
                    {/* Idade */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-medium">{p.age} anos</span>
                        {isUnderage ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Menor de Idade
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            Maior de Idade
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Botão de Excluir */}
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Excluir pessoa e suas transações"
                        id={`delete-btn-${p.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Popover / Overlay de Confirmação de Deleção em Cascata */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-2xl p-6 text-slate-700 animate-fadeIn">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirmar Exclusão</h3>
                <p className="text-xs text-slate-500">Esta ação é permanente e irreversível!</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-sm">
              <p className="text-slate-800">
                Tem certeza que deseja excluir <span className="font-bold text-slate-900">{deleteTarget.name}</span>?
              </p>
              
              {/* ALERTA CRÍTICO DE NEGÓCIO: "Em casos que se delete uma pessoa, todas a transações dessa pessoa deverão ser apagadas." */}
              <div className="text-xs text-amber-700 flex gap-1.5 items-start">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>Atenção às regras de negócio:</strong> Ao excluir este morador, todas as transações associadas a ele serão apagadas automaticamente no banco de dados.
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-3 bg-rose-50 border border-rose-100 rounded-lg p-2.5 text-xs text-rose-700">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setError(null);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Confirmar e Excluir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
