# UC-GOAL-001 — Criar objetivo

## Objetivo

Permitir que um usuário registre um objetivo pessoal ou compartilhado, podendo relacioná-lo a outros recursos do sistema (tarefas, compromissos, documentos e, futuramente, finanças).

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa.
- Se o objetivo for criado como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide registrar algo que deseja alcançar.

## Fluxo principal

1. Usuário informa os dados do objetivo (ex.: título, descrição).
2. Usuário define a visibilidade do objetivo — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
3. Sistema cria o objetivo com `owner` e `createdBy` definidos conforme a visibilidade escolhida.
4. Objetivo passa a existir, podendo ser relacionado a outros recursos posteriormente (ver `UC-GOAL-007`).

## Variações

- Objetivo criado sem prazo definido: válido (ver Questões em aberto quanto à existência de prazo).
- Objetivo criado já relacionado a outros recursos no mesmo fluxo, como atalho para `UC-GOAL-007`.

## Regras de negócio

- Todo objetivo possui um `owner` (`User` para `PRIVATE`/`SHARED`, `Group` para `GROUP`) e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Criar um objetivo `GROUP` exige que o usuário seja membro ativo do grupo no momento da criação.

## Visibilidade

Um objetivo pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`, `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Este caso de uso não redefine essas regras.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` para a mecânica de visibilidade. Relaciona-se com `UC-GOAL-007` (relacionar objetivo a outros recursos).

## Critérios de aceite

- Objetivo criado é visível para quem tem acesso, conforme sua visibilidade.

## Questões em aberto

- Um objetivo deve ter um prazo (data-alvo) obrigatório, opcional, ou este conceito não se aplica?
- Um objetivo possui categoria (ex.: saúde, financeiro, pessoal, família)?
- Um objetivo tem algum tipo de progresso intermediário (ex.: percentual, marcos), ou apenas um estado binário de concluído/não concluído (ver `UC-GOAL-003`)?
