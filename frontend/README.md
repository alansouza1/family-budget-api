# Family Budget - Frontend

Interface web para o sistema de controle de gastos residenciais.

## Tecnologias

- React 19 com TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)

## Como Executar

### Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:8080` (ou use o Modo Demo)

### Instalação

```bash
npm install
``````bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`.

### Build para produção

```bash
npm run build
```

## Integração com o Backend

O frontend tenta conectar ao backend em `http://localhost:8080` por padrão.

Caso o backend .NET não esteja ativo, o próprio frontend oferece um **Modo Demo** que simula o comportamento da API e persiste os dados em `localStorage`.

## Funcionalidades

- Cadastro de pessoas (criação, listagem, exclusão com cascata)
- Cadastro de transações (criação, listagem)
- Bloqueio de receitas para menores de 18 anos
- Consulta de totais por pessoa e geral
- Modo Demo para testes offline
