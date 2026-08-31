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

Relaciona um usuário a um grupo, representando participação ativa. Sua existência já implica que o usuário é membro do grupo.

Papéis considerados neste momento:

- `OWNER`
- `MEMBER`

Um grupo pode ter mais de um `OWNER` simultaneamente, mas deve sempre manter ao menos um. Não há, por enquanto, papel intermediário (ver `docs/product/decisions/PD-001-group-roles.md`).

Pode futuramente armazenar outros atributos, como data de entrada.

### Invitation

Representa o convite de uma pessoa para participar de um grupo, anterior e distinto de uma `Membership`. Uma `Membership` só passa a existir quando um convite é aceito.

Estados considerados neste momento:

- `PENDING`
- `ACCEPTED`
- `DECLINED`
- `EXPIRED`
- `CANCELLED`

O canal pelo qual o convite é enviado (e-mail, link, WhatsApp etc.), prazo de expiração e estratégia de reenvio ainda não estão definidos.

### Task

Algo que precisa ser realizado. Pode possuir:

- responsável;
- prazo;
- recorrência;
- contexto;
- visibilidade.

### Event

Compromisso associado a uma data ou período. Pode possuir:

- descrição;
- local;
- participantes;
- recorrência;
- contexto;
- visibilidade.

Diferentemente de `Task`, um `Event` não possui estado de conclusão — ele simplesmente ocorre (ou não) na data definida.

### Goal

Objetivo pessoal ou compartilhado. Pode se relacionar com:

- Tasks;
- Transactions;
- Events;
- Documents;
- Budgets.

### Transaction

Movimentação financeira. Pode possuir:

- valor;
- tipo (receita ou despesa);
- data;
- conta associada (`Account`);
- categoria;
- contexto;
- visibilidade.

### Account

Origem ou destino financeiro (ex.: conta corrente, cartão de crédito, dinheiro). Pode possuir:

- nome;
- tipo;
- contexto;
- visibilidade.

### Budget

Planejamento financeiro relacionado a período, categoria ou objetivo. Pode possuir:

- valor-limite;
- período;
- categoria ou objetivo relacionado (`Goal`);
- contexto;
- visibilidade.

Este é o escopo básico do MVP (registrar um planejamento). Acompanhamento automático de gastos, alertas de estouro e orçamentos mais avançados estão previstos apenas para V2, conforme `docs/product/roadmap.md`. Despesas recorrentes e lançamentos sugeridos a partir de notificações bancárias também são V2.

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

## Propriedade e autoria

Recursos compartilháveis (Task, Transaction, Goal, Event, List etc.) distinguem **proprietário** (`owner`) de **autor** (`createdBy`):

- **`PRIVATE`**: o recurso pertence a um `User`. `owner = User`.
- **`SHARED`**: o recurso continua pertencendo a um `User`, mas possui pessoas explicitamente autorizadas. `owner = User`, `sharedWith = User[]`.
- **`GROUP`**: o recurso pertence ao `Group`, não ao usuário que o criou. `owner = Group`, `createdBy = User`.

Essa distinção é o que permite que um recurso `GROUP` continue existindo, pertencendo ao grupo, mesmo que a pessoa registrada em `createdBy` deixe de ser membro (ver `UC-GROUP-004`, `UC-GROUP-005` e `UC-PERM-003`). Detalhes em `docs/product/decisions/PD-002-resource-ownership.md`.

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
