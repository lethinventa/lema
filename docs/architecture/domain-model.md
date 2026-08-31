# Modelo de domínio

> Este documento descreve um modelo conceitual inicial. Não é um modelo de banco de dados nem define implementação técnica.

## Entidades

### User

Representa uma pessoa dentro do Lema. Pode possuir:

- nome;
- e-mail (usado como identidade para autenticação, ver `UC-AUTH-*`);
- foto;
- fuso horário;
- preferências básicas (ex.: idioma, formato de data);
- credencial de acesso (ex.: senha) ou vínculo com provedor social (Google, Apple), tratados como dados sensíveis, nunca expostos a outros usuários ou grupos;
- configuração de MFA (opcional, ver `UC-AUTH-006`).

Nem todo atributo de `User` é visível a outras pessoas com quem ele compartilha grupos ou recursos: nome e foto são visíveis nesse contexto (ver `UC-USER-003`); e-mail, fuso horário, preferências e credenciais permanecem privados ao próprio usuário, salvo decisão futura em contrário.

Um `User` existe independentemente de participar de algum `Group` — toda a organização pessoal do Lema (recursos `PRIVATE`) depende apenas do `User`, não de nenhum grupo.

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

Diferentes submetas do mesmo objetivo podem seguir regras financeiras completamente diferentes (quem paga, se e como se divide), pois cada submeta tem suas próprias `Transactions` relacionadas, cada uma com seu próprio pagador, responsável econômico e `SplitRule` — isso decorre diretamente do modelo já definido em `docs/product/decisions/PD-006-financial-organization-model.md`, sem exigir um mecanismo novo.

`RESERVED` e `COMMITTED` são representados por uma entidade própria, `GoalAllocation` (ver abaixo) — não são uma extensão de `Transaction` nem de `Budget`.

A hierarquia de submetas é limitada a um único nível: uma submeta não pode ter suas próprias submetas. Quando um objetivo possui submetas, seu progresso é calculado automaticamente como a média do progresso delas, em vez de editado manualmente (ver `docs/product/decisions/PD-007-goal-lightweight-hub.md`).

### GoalAllocation

Representa um valor associado a um `Goal` (ou submeta) em um dos três estados financeiros: `RESERVED`, `COMMITTED` ou `PAID`. Uma `GoalAllocation` em estado `PAID` referencia a `Transaction` correspondente; nos estados `RESERVED` e `COMMITTED` não há `Transaction` associada, porque o dinheiro ainda não se moveu. Uma `GoalAllocation` em `COMMITTED` pode, opcionalmente, referenciar um `Document` (ex.: um contrato), mas isso não é obrigatório. O custo estimado de um objetivo/submeta é um valor independente, definido diretamente pelo usuário — não é calculado a partir da soma das `GoalAllocations`. Ao excluir uma submeta, suas `GoalAllocations` seguem o mesmo ciclo de vida dela (lixeira por 30 dias, ver `docs/product/decisions/PD-005-deletion-policy.md`); `Transactions` já registradas não são excluídas, apenas deixam de estar relacionadas enquanto a submeta estiver na lixeira.

### Transaction

Movimentação financeira. Além de `owner`, `createdBy` e visibilidade (ver "Propriedade e autoria"), uma transação distingue os seguintes conceitos, conforme `docs/product/decisions/PD-006-financial-organization-model.md`:

- valor;
- tipo (receita ou despesa);
- data;
- categoria;
- conta associada (`Account`) — de onde o dinheiro efetivamente saiu ou entrou;
- pagador — quem efetivamente pagou ou recebeu, que pode ser diferente do `owner` em uma transação `GROUP`;
- responsável econômico — quem deve arcar com o valor, que pode ser diferente de quem pagou;
- `SplitRule` — regra de divisão do valor entre responsáveis, quando aplicável.

A visibilidade da transação (contexto da despesa) é independente da visibilidade da conta usada para pagá-la, e também é independente da visibilidade dos detalhes de divisão financeira (ver `permissions.md`).

### SplitRule

Representa como o valor de uma transação é dividido entre responsáveis (ex.: 50/50, proporcional, valor fixo, sem divisão). Uma `SplitRule` pode ser definida diretamente em uma `Transaction`, ou vir do `GroupFinancialArrangement` do grupo — como regra padrão ou como exceção por categoria, conta ou tipo de despesa. A ordem de resolução, da mais para a menos específica, é: regra da própria transação → exceção do grupo para aquela categoria/conta/tipo → regra padrão do grupo. Se o grupo não tiver nenhuma `SplitRule` configurada, a divisão precisa ser informada manualmente no lançamento da transação (ver `docs/product/decisions/PD-006-financial-organization-model.md`).

Quando uma `SplitRule` aplicada a uma ou mais transações resulta em valores não compensados entre pessoas, esse saldo é exposto como um saldo corrente par a par (ex.: "Mateus tem R$ 320 a receber de Lethicia") — uma visão computada a partir das transações envolvidas, sempre rastreável até elas, e não um valor registrado isoladamente.

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

Representa a configuração financeira pessoal de um `User`: como essa pessoa organiza suas próprias contas, cartões, rendas, despesas, categorias, orçamento e metas financeiras. Inclui também a configuração de exposição de dados pessoais (ex.: renda, saldo, limite, extrato) para cada grupo do qual participa — essa exposição é independente do modelo `PRIVATE`/`SHARED`/`GROUP` usado pelos demais recursos, e é configurada por grupo (um usuário pode expor dados diferentes para grupos diferentes). O sistema pode usar um dado pessoal para calcular uma regra (ex.: divisão proporcional à renda) sem necessariamente expô-lo aos demais. Participar de um grupo não torna essas informações visíveis aos demais membros automaticamente (ver `PD-006-financial-organization-model.md`).

### GroupFinancialArrangement

Representa como um `Group` organiza suas finanças compartilhadas: se há renda compartilhada, contas ou cartões compartilhados, se existe dinheiro comum, a `SplitRule` padrão e suas exceções por categoria/conta/tipo de despesa, quais despesas são sempre pessoais, e o nível de transparência da divisão financeira entre os membros. Antes de usar finanças compartilhadas, um grupo precisa definir um mínimo: regra padrão de divisão, existência ou não de dinheiro comum, e nível básico de transparência financeira — as demais configurações (exceções, metas financeiras etc.) podem ser feitas progressivamente, depois. É resultado do onboarding financeiro do grupo, mas pode ser alterado posteriormente. Não representa um modelo fechado — é uma composição de regras, conforme `PD-006-financial-organization-model.md`.

### List

Estrutura genérica para listas. Exemplos:

- compras;
- viagem;
- materiais;
- pendências.

O detalhamento completo de `List` (título, tipo, itens genéricos, contexto, visibilidade) fica para quando o domínio de listas de compras for tratado especificamente; por ora, `List` existe conceitualmente como o contêiner que uma `Meal` pode gerar (ver abaixo).

### Meal

Refeição planejada. Pode possuir:

- tipo — lista base (café da manhã, almoço, jantar, lanche) mais opção personalizada ("Outro");
- data;
- estado: `PLANNED`, `DONE` ou `CANCELLED` (ver `UC-FOOD-007`) — mais simples que o estado de conclusão de `Task`, já que uma refeição não é "concluída" no mesmo sentido, apenas acontece, é cancelada, ou ainda está planejada;
- recorrência (ver `UC-FOOD-008`);
- descrição ou receita;
- ingredientes, relacionados a `ShoppingItem`;
- contexto;
- visibilidade.

Uma `Meal` pode gerar uma `List` de compras a partir de seus ingredientes (ver seção "Relações" e `UC-FOOD-006`). A regra central dessa relação: **a refeição gera necessidade de compra, mas a compra não controla a refeição** — marcar um `ShoppingItem` como comprado nunca altera o estado da `Meal` que o originou.

### ShoppingItem

Item de compra. Pode possuir:

- nome;
- quantidade;
- refeição de origem (`Meal`), quando o item foi gerado a partir de uma refeição (ver `UC-FOOD-006`) — usada para consolidar e sincronizar itens ao regenerar a lista, sem duplicar;
- estado (ex.: pendente, comprado);
- lista associada (`List`);
- contexto;
- visibilidade.

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
 → Goal (submeta, um único nível)
```

Outro exemplo:

```
Meal
 → ShoppingItems
 → Transactions
 → Budget
```

A implementação técnica dessas relações ainda não está definida.
