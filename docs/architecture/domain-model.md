# Modelo de domínio

> Este documento descreve um modelo conceitual inicial. Não é um modelo de banco de dados nem define implementação técnica.

## Entidades

### User

Representa uma pessoa dentro do Lema.

### Group

Representa um contexto compartilhado. Pode futuramente representar:

- família;
- casal;
- casa;
- outro grupo de pessoas.

Evitar acoplar toda a arquitetura exclusivamente ao conceito tradicional de família.

### Membership

Relaciona um usuário a um grupo. Pode futuramente armazenar:

- papel;
- permissões;
- status;
- data de entrada.

### Task

Algo que precisa ser realizado. Pode possuir:

- responsável;
- prazo;
- recorrência;
- contexto;
- visibilidade.

### Event

Compromisso associado a uma data ou período.

### Goal

Objetivo pessoal ou compartilhado. Pode se relacionar com:

- Tasks;
- Transactions;
- Events;
- Documents;
- Budgets.

### Transaction

Movimentação financeira.

### Account

Origem ou destino financeiro.

### Budget

Planejamento financeiro relacionado a período, categoria ou objetivo.

### List

Estrutura genérica para listas. Exemplos:

- compras;
- viagem;
- materiais;
- pendências.

### Meal

Refeição planejada.

### ShoppingItem

Item de compra.

### Document

Documento ou arquivo relevante.

## Relações

Um dos diferenciais do Lema é permitir relações entre áreas diferentes do sistema.

Exemplo:

```
Goal
 → Tasks
 → Transactions
 → Events
 → Documents
```

Outro exemplo:

```
Meal
 → ShoppingItems
 → Transactions
 → Budget
```

A implementação técnica dessas relações ainda não está definida.
