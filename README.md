# Family Budget API

Sistema de controle de gastos residenciais com cadastro de pessoas, transações e consulta de totais.

## Tecnologias

- **Backend**: .NET 10 com C# (ASP.NET Core Web API)
- **Banco de Dados**: PostgreSQL 17 (via Docker)
- **ORM**: Entity Framework Core
- **Validação**: FluentValidation
- **Containerização**: Docker & Docker Compose

## Arquitetura

O projeto segue uma arquitetura em camadas (layered architecture) com endpoints em Minimal APIs agrupados por módulos de rota:

```
Endpoints → Services → Repositories → EF Core → PostgreSQL
```

- **Endpoints**: Definem as rotas HTTP usando Minimal APIs e delegam as operações para os serviços
- **Services**: Contêm as regras de negócio
- **Repositories**: Abstraem o acesso a dados (padrão Repository)
- **Models**: Entidades do domínio
- **DTOs**: Objetos de transferência de dados para request/response
- **Validators**: Validações de entrada com FluentValidation
- **Middlewares**: Tratamento global de exceções

As rotas ficam separadas em módulos de endpoints para manter o `Program.cs` limpo e facilitar a evolução da API:

- `PersonEndpoints`: rotas de pessoas
- `TransactionEndpoints`: rotas de transações
- `SummaryEndpoints`: rota de consulta de totais

## Como Executar

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)

### Subindo a aplicação

```bash
docker compose up -d
```

A API estará disponível em `http://localhost:8080`.

### Parando a aplicação

```bash
docker compose down
```

### Desenvolvimento local (sem Docker para a API)

1. Suba apenas o PostgreSQL:
```bash
docker compose up -d postgres
```

2. Execute a API:
```bash
cd backend/FamilyBudget.Api
dotnet run
```

## Endpoints da API

### Pessoas (`/api/persons`)

| Método | Endpoint              | Descrição                                         |
|--------|-----------------------|---------------------------------------------------|
| GET    | `/api/persons`        | Lista todas as pessoas cadastradas                |
| POST   | `/api/persons`        | Cadastra uma nova pessoa                          |
| DELETE | `/api/persons/{id}`   | Remove uma pessoa e todas as suas transações      |

**POST `/api/persons`** — Exemplo de body:
```json
{
  "name": "João Silva",
  "age": 25
}
```

### Transações (`/api/transactions`)

| Método | Endpoint              | Descrição                                         |
|--------|-----------------------|---------------------------------------------------|
| GET    | `/api/transactions`   | Lista todas as transações                         |
| POST   | `/api/transactions`   | Cadastra uma nova transação                       |

**POST `/api/transactions`** — Exemplo de body:
```json
{
  "description": "Salário",
  "amount": 5000.00,
  "type": "Income",
  "personId": "guid-da-pessoa"
}
```

> **Regra de negócio**: Menores de 18 anos só podem cadastrar despesas (`type: "Expense"`).

### Resumo (`/api/summary`)

| Método | Endpoint        | Descrição                                                        |
|--------|-----------------|------------------------------------------------------------------|
| GET    | `/api/summary`  | Retorna totais de receita, despesa e saldo por pessoa e geral    |

**Exemplo de resposta:**
```json
{
  "personSummaries": [
    {
      "personId": "...",
      "personName": "João Silva",
      "totalIncome": 5000.00,
      "totalExpenses": 1200.00,
      "balance": 3800.00
    }
  ],
  "totalIncome": 5000.00,
  "totalExpenses": 1200.00,
  "totalBalance": 3800.00
}
```

## Regras de Negócio

1. **Identificadores únicos**: Gerados automaticamente (GUID)
2. **Exclusão em cascata**: Ao deletar uma pessoa, todas as suas transações são removidas
3. **Restrição de menores**: Pessoas com idade < 18 anos só podem cadastrar despesas
4. **Validação de pessoa**: Ao cadastrar uma transação, a pessoa informada deve existir
5. **Persistência**: Dados persistem após fechar a aplicação (PostgreSQL)

## Estrutura do Projeto

```
backend/FamilyBudget.Api/
├── Data/                   # DbContext e Migrations
├── Dtos/                   # Objetos de request/response
│   ├── Person/
│   ├── Summary/
│   └── Transaction/
├── Endpoints/              # Minimal APIs agrupadas por recurso
├── Middlewares/             # Tratamento global de erros
├── Models/                  # Entidades do domínio
│   └── Enums/
├── Repositories/            # Acesso a dados
│   └── Interfaces/
├── Services/                # Regras de negócio
│   └── Interfaces/
├── Validators/              # Validações FluentValidation
├── Program.cs               # Configuração e startup
├── Dockerfile               # Build da imagem Docker
└── appsettings.json         # Configurações
docker-compose.yml           # Orquestração dos containers
```
