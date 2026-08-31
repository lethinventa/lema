# UC-GOAL-005 — Compartilhar objetivo

## Objetivo

Permitir que o proprietário de um objetivo `PRIVATE` o compartilhe com pessoas específicas, tornando-o `SHARED`. Este caso de uso aplica `UC-PERM-002` ao domínio de objetivos.

## Ator

- Ator principal: proprietário do objetivo.
- Ator secundário: pessoas com quem o objetivo é compartilhado.

## Pré-condições

- Objetivo existe, com visibilidade `PRIVATE`.
- Pessoas a receber o compartilhamento já possuem conta no Lema.

## Gatilho

Proprietário decide compartilhar o objetivo com pessoas específicas.

## Fluxo principal

1. Proprietário seleciona o objetivo.
2. Proprietário seleciona uma ou mais pessoas para compartilhar, conforme `UC-PERM-002`.
3. Objetivo passa a ter visibilidade `SHARED`.

## Variações

- Objetivo já possuía relações com outros recursos antes de ser compartilhado: as relações permanecem as mesmas (ver `UC-GOAL-007`).

## Regras de negócio

- Aplicam-se as mesmas regras de `UC-PERM-002`: o `owner` permanece o mesmo usuário; `sharedWith` passa a existir.
- Pessoas em `sharedWith` podem visualizar e editar o objetivo, conforme `permissions.md`.
- Compartilhar o objetivo não altera seu `createdBy`, seu estado de conclusão nem suas relações com outros recursos.

## Visibilidade

`PRIVATE` → `SHARED`, conforme `permissions.md` e `docs/product/decisions/PD-003-visibility-transitions.md`.

## Relações com outros módulos

Aplica `UC-PERM-002`. Relaciona-se com `UC-PERM-004` (transições de visibilidade) e `UC-GOAL-007` (relações com outros recursos).

## Critérios de aceite

- Objetivo compartilhado torna-se visível e editável para as pessoas listadas em `sharedWith`.
- Estado de conclusão e relações do objetivo não são alterados pelo compartilhamento.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
