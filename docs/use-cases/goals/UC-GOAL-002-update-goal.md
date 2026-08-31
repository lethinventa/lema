# UC-GOAL-002 — Atualizar objetivo

## Objetivo

Permitir editar os dados de um objetivo existente (ex.: título, descrição).

## Ator

- Ator principal: proprietário do objetivo (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Objetivo existe.
- Ator possui acesso de edição, conforme a visibilidade do objetivo.

## Gatilho

Ator decide alterar dados de um objetivo.

## Fluxo principal

1. Ator seleciona o objetivo.
2. Ator atualiza os dados desejados.
3. Sistema salva as alterações.

## Variações

- Alterar a visibilidade do objetivo: tratado por `UC-PERM-004`, não por este caso de uso.
- Alterar relações com outros recursos: tratado por `UC-GOAL-007`, não por este caso de uso.

## Regras de negócio

- Atualizar um objetivo não altera seu `owner` nem `createdBy`.
- Para objetivos `SHARED`, tanto o proprietário quanto as pessoas em `sharedWith` podem editar, conforme `permissions.md`.
- Para objetivos `GROUP`, qualquer membro do grupo pode editar, independentemente de seu papel, conforme `PD-004-group-resource-governance.md`.

## Visibilidade

Este caso de uso não altera a visibilidade do objetivo.

## Relações com outros módulos

Relaciona-se com `UC-PERM-004` (mudança de visibilidade) e `UC-GOAL-007` (relações com outros recursos).

## Critérios de aceite

- Alterações ficam visíveis para todas as pessoas com acesso ao objetivo.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
