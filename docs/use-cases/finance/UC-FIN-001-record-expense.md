# UC-FIN-001 — Registrar despesa manual

## Objetivo

Permitir que um usuário registre manualmente uma movimentação financeira, podendo ser pessoal, compartilhada com pessoas específicas ou pertencente a um grupo.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa no Lema.
- Se a transação for criada como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide registrar uma movimentação financeira que ocorreu.

## Fluxo principal

1. Usuário informa os dados da transação (ex.: valor, data, categoria, tipo).
2. Usuário associa a transação a uma conta existente, se aplicável (ver `UC-FIN-006`), e informa o pagador, se diferente de quem está registrando.
3. Usuário define a visibilidade da transação — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
4. Se a transação for `GROUP`, sistema resolve a `SplitRule` aplicável (transação → exceção do `GroupFinancialArrangement` → padrão do grupo); se nenhuma regra estiver configurada, o usuário informa a divisão manualmente (ver `docs/product/decisions/PD-006-financial-organization-model.md`).
5. Sistema cria a transação com `owner` e `createdBy` definidos conforme a visibilidade escolhida.

## Variações

- Transação sem conta associada: válido — associar uma conta é opcional, não obrigatório. Uma despesa em dinheiro, ou que o usuário não quer detalhar a origem, pode ser registrada sem `Account`.
- Transação sem categoria definida: válido.
- Transação `PRIVATE`: pagador e responsável econômico coincidem com o `owner`; não há `SplitRule` a resolver.
- Transação `SHARED`: pode ter `SplitRule` entre o proprietário e as pessoas em `sharedWith`, mas como não há `GroupFinancialArrangement` associado, a divisão precisa ser sempre definida diretamente na transação.

## Regras de negócio

- Toda transação possui um `owner` (`User` para `PRIVATE`/`SHARED`, `Group` para `GROUP`) e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Uma transação possui um valor e uma data associados, além de pagador, responsável econômico e `SplitRule` (ver `domain-model.md` e `PD-006-financial-organization-model.md`).
- Criar uma transação `GROUP` exige que o usuário seja membro ativo do grupo no momento do registro.
- A detecção e sugestão automática de lançamentos a partir de notificações bancárias é uma visão futura registrada em `docs/product/roadmap.md`, fora do escopo deste caso de uso — aqui o registro é sempre manual.
- O MVP cobre apenas o registro de despesas. Registrar receitas fica fora do escopo do MVP — junto de "despesas recorrentes" e "orçamentos mais avançados" no roadmap (`docs/product/roadmap.md`), por exigir um tratamento próprio (ex.: recorrência de salário, visão de fluxo de caixa) que não é essencial para validar a proposta central do produto.
- Associar uma transação a uma `Account` é sempre opcional, nunca obrigatório.

## Visibilidade

Uma transação pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`, `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Este caso de uso não redefine essas regras.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` para a mecânica de visibilidade. Relaciona-se com `UC-FIN-005` (regras de divisão em transações de grupo), `UC-FIN-006` (conta associada), `UC-FIN-007` (orçamento) e `UC-GOAL-007` (relação com objetivos, inclusive `GoalAllocation` em estado `PAID`).

## Critérios de aceite

- Transação criada é visível para quem tem acesso, conforme sua visibilidade.
- Transação possui valor e data associados.

## Questões em aberto

- As categorias de transação seguem uma lista fixa predefinida, ou são texto livre (como decidido para categoria de objetivos em `UC-GOAL-001`)?
