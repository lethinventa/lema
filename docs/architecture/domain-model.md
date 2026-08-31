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
- Budgets;
- outros Goals, como submetas.

#### Objetivos como hubs leves

Alguns objetivos funcionam como pequenos projetos de vida — não apenas uma meta com título, prazo e progresso. Exemplo: um objetivo "Casamento" pode ter submetas como Espaço, Buffet, Fotografia, Decoração e Lua de mel.

Uma submeta é, ela própria, um `Goal` completo, relacionado ao objetivo "pai" (autorrelação `Goal → Goal`), e não uma entidade separada. Cada submeta pode ter suas próprias relações com `Tasks`, `Events`, `Documents` e `Transactions`, seu próprio progresso e seu próprio estado financeiro, independentes das demais submetas do mesmo objetivo. Uma submeta pode até ter visibilidade diferente da do objetivo pai, seguindo a mesma lógica de independência de visibilidade já aplicada a qualquer relação de `Goal` com outro recurso (ver `UC-GOAL-007`).

Objetivos não devem virar um gerenciador de projetos detalhado — ver `docs/product/principles.md` (princípio 13) e `docs/product/decisions/PD-007-goal-lightweight-hub.md`.

#### Estados financeiros dentro de um objetivo

Um objetivo (ou submeta) pode acompanhar valores em três estados financeiros conceituais, além de um custo estimado:

- `RESERVED` — dinheiro separado/guardado para aquele objetivo, ainda não comprometido com um pagamento específico;
- `COMMITTED` — valor já assumido/contratado, mas ainda não totalmente pago;
- `PAID` — dinheiro que efetivamente já saiu, correspondendo a `Transactions` relacionadas ao objetivo.

Exemplo (submeta Buffet): custo estimado R$ 12.000; `PAID` R$ 2.000; `RESERVED` R$ 4.000; R$ 6.000 ainda não organizados em nenhum dos três estados.

Diferentes submetas do mesmo objetivo podem seguir regras financeiras completamente diferentes (quem paga, se e como se divide), pois cada submeta tem suas próprias `Transactions` relacionadas, cada uma com seu próprio pagador, responsável econômico e regra de divisão — isso decorre diretamente do modelo já definido em `docs/product/decisions/PD-006-financial-organization-model.md`, sem exigir um mecanismo novo.

Ainda não está definido como `RESERVED` e `COMMITTED` são representados conceitualmente (ex.: como extensão de `Transaction`, de `Budget`, ou como uma nova entidade) — ver `docs/product/decisions/PD-007-goal-lightweight-hub.md`.

### Transaction

Movimentação financeira. Além de `owner`, `createdBy` e visibilidade (ver "Propriedade e autoria"), uma transação distingue os seguintes conceitos, conforme `docs/product/decisions/PD-006-financial-organization-model.md`:

- valor;
- tipo (receita ou despesa);
- data;
- categoria;
- conta associada (`Account`) — de onde o dinheiro efetivamente saiu ou entrou;
- pagador — quem efetivamente pagou ou recebeu, que pode ser diferente do `owner` em uma transação `GROUP`;
- responsável econômico — quem deve arcar com o valor, que pode ser diferente de quem pagou;
- regra de divisão — como o valor é dividido entre responsáveis, quando aplicável;
- valor a compensar/reembolsar — consequência eventual da regra de divisão (conceito ainda não detalhado).

A visibilidade da transação (contexto da despesa) é independente da visibilidade da conta usada para pagá-la — ver `permissions.md`.

### Account

Origem ou destino financeiro (ex.: conta corrente, cartão de crédito, dinheiro). Pode possuir:

- nome;
- tipo;
- contexto;
- visibilidade.

A visibilidade de uma `Account` é independente da visibilidade de qualquer `Transaction` que a referencie (ver `permissions.md` e `PD-006-financial-organization-model.md`).

### Budget

Planejamento financeiro relacionado a período, categoria ou objetivo. Pode possuir:

- valor-limite;
- período;
- categoria ou objetivo relacionado (`Goal`);
- contexto;
- visibilidade.

Este é o escopo básico do MVP (registrar um planejamento). Acompanhamento automático de gastos, alertas de estouro e orçamentos mais avançados estão previstos apenas para V2, conforme `docs/product/roadmap.md`. Despesas recorrentes e lançamentos sugeridos a partir de notificações bancárias também são V2.

### FinancialProfile

Representa a configuração financeira pessoal de um `User`: como essa pessoa organiza suas próprias contas, cartões, rendas, despesas, categorias, orçamento e metas financeiras, além do nível de exposição dessas informações para os grupos dos quais participa. Participar de um grupo não torna essas informações visíveis aos demais membros automaticamente (ver `PD-006-financial-organization-model.md`).

### GroupFinancialArrangement

Representa como um `Group` organiza suas finanças compartilhadas: se há renda compartilhada, contas ou cartões compartilhados, como despesas são divididas por padrão, quais despesas são sempre pessoais, e se membros podem visualizar valores financeiros pessoais uns dos outros. É resultado do onboarding financeiro do grupo, mas pode ser alterado posteriormente. Não representa um modelo fechado — é uma composição de regras, conforme `PD-006-financial-organization-model.md`.

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
