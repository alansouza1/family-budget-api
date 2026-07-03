import React, { useState } from "react";
import { UserPlus, AlertCircle } from "lucide-react";
import { apiService, ApiError } from "../services/api";

interface PersonFormProps {
  onPersonCreated: () => void;
}

export default function PersonForm({ onPersonCreated }: PersonFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!name.trim()) {
      setError("O nome da pessoa é obrigatório.");
      return;
    }
    if (age === "" || isNaN(Number(age))) {
      setError("A idade é obrigatória e deve ser um número válido.");
      return;
    }
    if (Number(age) < 0) {
      setError("A idade não pode ser negativa.");
      return;
    }

    setLoading(true);
    try {
      await apiService.createPerson(name.trim(), Number(age));
      setName("");
      setAge("");
      onPersonCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Erro ao tentar cadastrar pessoa. Verifique a conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Cadastrar Nova Pessoa</h3>
          <p className="text-xs text-slate-500">Adicione moradores ao controle residencial</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs text-rose-700 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 animate-pulse" />
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome */}
        <div>
          <label htmlFor="person-name" className="block text-xs font-bold text-slate-600 mb-1">
            Nome Completo
          </label>
          <input
            id="person-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: João Silva"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
            disabled={loading}
            maxLength={100}
            required
          />
        </div>

        {/* Campo Idade */}
        <div>
          <label htmlFor="person-age" className="block text-xs font-bold text-slate-600 mb-1">
            Idade
          </label>
          <input
            id="person-age"
            type="number"
            value={age}
            onChange={(e) => {
              const val = e.target.value;
              setAge(val === "" ? "" : Number(val));
            }}
            placeholder="Ex: 25"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={loading}
            min={0}
            max={150}
            required
          />
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-2 px-4 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Cadastrando...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Cadastrar Pessoa</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
