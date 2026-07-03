export interface Person {
  id: string;
  name: string;
  age: number;
}

export type TransactionType = "Income" | "Expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  personId: string;
  personName?: string;
}

export interface PersonSummary {
  personId: string;
  personName: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface Summary {
  personSummaries: PersonSummary[];
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
}
