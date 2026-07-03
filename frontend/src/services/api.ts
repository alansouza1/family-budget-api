import { Person, Transaction, Summary, PersonSummary, TransactionType } from "../types";

// Base API URL. Can be customized via environment variable or in-app settings.
const DEFAULT_API_URL = "http://localhost:8080";

// Helper to get or set API Base URL and Demo Mode preference in Local Storage
export function getApiBaseUrl(): string {
  return localStorage.getItem("expense_tracker_api_url") || DEFAULT_API_URL;
}

export function setApiBaseUrl(url: string): void {
  localStorage.setItem("expense_tracker_api_url", url);
}

export function isDemoModeEnabled(): boolean {
  // We default to false so it tries the .NET backend as requested,
  // but let the user toggle it if they are reviewing without running the backend locally.
  const stored = localStorage.getItem("expense_tracker_demo_mode");
  return stored === "true";
}

export function setDemoMode(enabled: boolean): void {
  localStorage.setItem("expense_tracker_demo_mode", String(enabled));
}

// Custom Error class that carries server messages
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// Helper to handle response and parse error messages in Portuguese
async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `Erro na requisição (Status: ${response.status})`;
    try {
      const data = await response.json();
      // Look for standard error response keys or message
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data && typeof data === "object") {
        errorMessage = data.message || data.error || data.title || JSON.stringify(data);
      }
    } catch {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {
        // Fallback to default
      }
    }
    throw new ApiError(errorMessage, response.status);
  }

  // Handle empty 204 No Content response
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Generate GUID-like unique ID for local mock fallback
function generateId(): string {
  return "f" + Math.random().toString(36).substring(2, 11) + "-" + Date.now().toString(36);
}

// LOCAL STORAGE INITIAL SEED DATA FOR DEMO MODE
const MOCK_PEOPLE_KEY = "expense_tracker_mock_people";
const MOCK_TRANSACTIONS_KEY = "expense_tracker_mock_transactions";

function getMockPeople(): Person[] {
  const data = localStorage.getItem(MOCK_PEOPLE_KEY);
  if (!data) {
    const initial: Person[] = [
      { id: "1a2b3c4d-1111-2222-3333-444455556666", name: "João Silva", age: 25 },
      { id: "5e6f7g8h-5555-6666-7777-888899990000", name: "Maria Oliveira", age: 32 },
      { id: "9i0j1k2l-9999-0000-1111-222233334444", name: "Pedro Santos (Menor)", age: 16 }
    ];
    localStorage.setItem(MOCK_PEOPLE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

function saveMockPeople(people: Person[]): void {
  localStorage.setItem(MOCK_PEOPLE_KEY, JSON.stringify(people));
}

function getMockTransactions(): Transaction[] {
  const data = localStorage.getItem(MOCK_TRANSACTIONS_KEY);
  if (!data) {
    const initial: Transaction[] = [
      {
        id: "t1",
        description: "Salário de Desenvolvedor",
        amount: 5000.00,
        type: "Income",
        personId: "1a2b3c4d-1111-2222-3333-444455556666",
        personName: "João Silva"
      },
      {
        id: "t2",
        description: "Supermercado Semanal",
        amount: 350.00,
        type: "Expense",
        personId: "1a2b3c4d-1111-2222-3333-444455556666",
        personName: "João Silva"
      },
      {
        id: "t3",
        description: "Freelance UI Design",
        amount: 1500.00,
        type: "Income",
        personId: "5e6f7g8h-5555-6666-7777-888899990000",
        personName: "Maria Oliveira"
      },
      {
        id: "t4",
        description: "Curso de C# e React",
        amount: 250.00,
        type: "Expense",
        personId: "5e6f7g8h-5555-6666-7777-888899990000",
        personName: "Maria Oliveira"
      },
      {
        id: "t5",
        description: "Mesada (Apenas Despesas)",
        amount: 100.00,
        type: "Expense",
        personId: "9i0j1k2l-9999-0000-1111-222233334444",
        personName: "Pedro Santos (Menor)"
      }
    ];
    localStorage.setItem(MOCK_TRANSACTIONS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

function saveMockTransactions(transactions: Transaction[]): void {
  localStorage.setItem(MOCK_TRANSACTIONS_KEY, JSON.stringify(transactions));
}

// API SERVICE OBJECT
export const apiService = {
  /**
   * List all persons
   */
  async getPersons(): Promise<Person[]> {
    if (isDemoModeEnabled()) {
      return getMockPeople();
    }

    const response = await fetch(`${getApiBaseUrl()}/api/persons`);
    return handleResponse(response);
  },

  /**
   * Create a new person
   */
  async createPerson(name: string, age: number): Promise<Person> {
    // Basic validation in English / UI outputs Portuguese messages
    if (!name || name.trim() === "") {
      throw new ApiError("O nome é obrigatório.", 400);
    }
    if (age === undefined || age === null || isNaN(age)) {
      throw new ApiError("A idade é obrigatória.", 400);
    }
    if (age < 0) {
      throw new ApiError("A idade não pode ser negativa.", 400);
    }

    if (isDemoModeEnabled()) {
      const people = getMockPeople();
      const newPerson: Person = {
        id: generateId(),
        name: name.trim(),
        age: Number(age)
      };
      people.push(newPerson);
      saveMockPeople(people);
      return newPerson;
    }

    const response = await fetch(`${getApiBaseUrl()}/api/persons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, age })
    });
    return handleResponse(response);
  },

  /**
   * Delete a person and their transactions
   */
  async deletePerson(id: string): Promise<void> {
    if (isDemoModeEnabled()) {
      const people = getMockPeople();
      const filteredPeople = people.filter(p => p.id !== id);
      saveMockPeople(filteredPeople);

      // Cascade delete transactions of deleted person
      const transactions = getMockTransactions();
      const filteredTransactions = transactions.filter(t => t.personId !== id);
      saveMockTransactions(filteredTransactions);
      return;
    }

    const response = await fetch(`${getApiBaseUrl()}/api/persons/${id}`, {
      method: "DELETE"
    });
    return handleResponse(response);
  },

  /**
   * List all transactions
   */
  async getTransactions(): Promise<Transaction[]> {
    if (isDemoModeEnabled()) {
      return getMockTransactions();
    }

    const response = await fetch(`${getApiBaseUrl()}/api/transactions`);
    return handleResponse(response);
  },

  /**
   * Create a transaction
   */
  async createTransaction(
    description: string,
    amount: number,
    type: TransactionType,
    personId: string
  ): Promise<Transaction> {
    // Validations
    if (!description || description.trim() === "") {
      throw new ApiError("A descrição é obrigatória.", 400);
    }
    if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
      throw new ApiError("O valor deve ser maior que zero.", 400);
    }
    if (type !== "Income" && type !== "Expense") {
      throw new ApiError("Tipo de transação inválido.", 400);
    }
    if (!personId) {
      throw new ApiError("A pessoa da transação é obrigatória.", 400);
    }

    if (isDemoModeEnabled()) {
      const people = getMockPeople();
      const person = people.find(p => p.id === personId);
      if (!person) {
        throw new ApiError("A pessoa informada não existe no cadastro.", 404);
      }

      // Business Rule: Under 18 can only register "Expense" (Despesa)
      if (person.age < 18 && type === "Income") {
        throw new ApiError("Transação inválida: Menores de 18 anos só podem ter transações do tipo Despesa.", 400);
      }

      const transactions = getMockTransactions();
      const newTransaction: Transaction = {
        id: generateId(),
        description: description.trim(),
        amount: Number(amount),
        type,
        personId,
        personName: person.name
      };

      transactions.push(newTransaction);
      saveMockTransactions(transactions);
      return newTransaction;
    }

    const response = await fetch(`${getApiBaseUrl()}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ description, amount, type, personId })
    });
    return handleResponse(response);
  },

  /**
   * Get totals and summaries
   */
  async getSummary(): Promise<Summary> {
    if (isDemoModeEnabled()) {
      const people = getMockPeople();
      const transactions = getMockTransactions();

      let totalIncome = 0;
      let totalExpenses = 0;

      const personSummaries: PersonSummary[] = people.map(person => {
        const personTrans = transactions.filter(t => t.personId === person.id);
        
        let pIncome = 0;
        let pExpenses = 0;

        personTrans.forEach(t => {
          if (t.type === "Income") {
            pIncome += t.amount;
          } else {
            pExpenses += t.amount;
          }
        });

        totalIncome += pIncome;
        totalExpenses += pExpenses;

        return {
          personId: person.id,
          personName: person.name,
          totalIncome: pIncome,
          totalExpenses: pExpenses,
          balance: pIncome - pExpenses
        };
      });

      return {
        personSummaries,
        totalIncome,
        totalExpenses,
        totalBalance: totalIncome - totalExpenses
      };
    }

    const response = await fetch(`${getApiBaseUrl()}/api/summary`);
    return handleResponse(response);
  }
};
