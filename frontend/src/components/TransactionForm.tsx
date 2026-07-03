import React, { useState, useEffect } from "react";
import { Person, TransactionType } from "../types";
import { PlusCircle, AlertCircle, Sparkles } from "lucide-react";
import { apiService, ApiError } from "../services/api";

interface TransactionFormProps {
  people: Person[];
  onTransactionCreated: () => void;
}

export default function TransactionForm({ people, onTransactionCreated }: TransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<TransactionType>("Expense");
  const [personId, setPersonId] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync selected person object when personId changes to evaluate business rules (underage)
  useEffect(() => {
    if (personId) {
      const match = people.find(p => p.id === personId);
      setSelectedPerson(match || null);
      
      // If the selected person is underage (< 18), lock type to "Expense" (Despesa) as per rules
      if (match && match.age < 18) {
        setType("Expense");
      }
    } else {
      setSelectedPerson(null);
    }
  }, [personId, people]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!description.trim()) {
      setError("A descrição da transação é obrigatória.");
      return;
    }
    if (amount === "" || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("O valor da transação deve ser um número maior que zero.");
      return;
    }
    if (!personId) {
      setError("Selecione um morador para associar esta transação.");
      return;
    }

    // Business Rule check: under 18 must be Expense
    if (selectedPerson && selectedPerson.age < 18 && type === "Income") {
      setError("Menores de 18 anos só podem ter transações do tipo Despesa.");
      return;
    }

    setLoading(true);
    try {
      await apiService.createTransaction(description.trim(), Number(amount), type, personId);
      setDescription("");
      setAmount("");
      // Keep selected person or reset
      setPersonId("");
      onTransactionCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Erro ao tentar cadastrar transação. Verifique a conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isSelectedPersonUnderage = selectedPerson && selectedPerson.age < 18;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
          <PlusCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Cadastrar Nova Transação</h3>
          <p className="text-xs text-slate-500">Adicione receitas ou despesas residenciais</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs text-rose-700 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 animate-pulse" />
          <div>{error}</div>
        </div>
      )}

      {/* Warning Rule Alert on screen (Menor de Idade rule) */}
      {isSelectedPersonUnderage && (
        <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 animate-fadeIn">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 animate-pulse" />
          <div>
            <strong>Regra de Negócio Ativa:</strong> {selectedPerson.name} tem {selectedPerson.age} anos (menor de idade). Portanto, o sistema limita esta transação apenas para <strong>Despesa</strong>.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Pessoa */}
        <div>
          <label htmlFor="transaction-person" className="block text-xs font-bold text-slate-600 mb-1">
            Morador Responsável
          </label>
          <select
            id="transaction-person"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
            disabled={loading}
            required
          >
            <option value="">-- Selecione uma pessoa --</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.age} anos)
              </option>
            ))}
          </select>
        </div>

        {/* Campo Descrição */}
        <div>
          <label htmlFor="transaction-desc" className="block text-xs font-bold text-slate-600 mb-1">
            Descrição da Transação
          </label>
          <input
            id="transaction-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Aluguel, Supermercado, Salário"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
            disabled={loading}
            maxLength={150}
            required
          />
        </div>

        {/* Campo Valor */}
        <div>
          <label htmlFor="transaction-amount" className="block text-xs font-bold text-slate-600 mb-1">
            Valor (R$)
          </label>
          <input
            id="transaction-amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              setAmount(val === "" ? "" : Number(val));
            }}
            placeholder="Ex: 1500.00"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={loading}
            min={0.01}
            required
          />
        </div>

        {/* Campo Tipo (Receita / Despesa) */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Tipo de Transação
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Receita */}
            <label
              className={`flex items-center justify-center border rounded-lg p-2.5 text-xs font-bold cursor-pointer transition-all ${
                isSelectedPersonUnderage
                  ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                  : type === "Income"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <input
                type="radio"
                name="transaction-type"
                value="Income"
                checked={type === "Income"}
                onChange={() => setType("Income")}
                disabled={loading || isSelectedPersonUnderage}
                className="sr-only"
              />
              Receita
            </label>

            {/* Despesa */}
            <label
              className={`flex items-center justify-center border rounded-lg p-2.5 text-xs font-bold cursor-pointer transition-all ${
                type === "Expense"
                  ? "bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <input
                type="radio"
                name="transaction-type"
                value="Expense"
                checked={type === "Expense"}
                onChange={() => setType("Expense")}
                disabled={loading}
                className="sr-only"
              />
              Despesa
            </label>
          </div>
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-2 px-4 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          disabled={loading || people.length === 0}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Cadastrando...</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Cadastrar Transação</span>
            </>
          )}
        </button>

        {people.length === 0 && (
          <p className="text-[11px] text-center text-rose-500 font-bold animate-pulse">
            * É necessário cadastrar pelo menos uma pessoa para habilitar transações.
          </p>
        )}
      </form>
    </div>
  );
}
