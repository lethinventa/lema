# UC-FOOD-004 — Compartilhar refeição planejada

## Objetivo

Permitir que o proprietário de uma refeição `PRIVATE` a compartilhe com pessoas específicas, tornando-a `SHARED`. Este caso de uso aplica `UC-PERM-002` ao domínio de alimentação.

## Ator

- Ator principal: proprietário da refeição.
- Ator secundário: pessoas com quem a refeição é compartilhada.

## Pré-condições

- Refeição existe, com visibilidade `PRIVATE`.
- Pessoas a receber o compartilhamento já possuem conta no Lema.

## Gatilho

Proprietário decide compartilhar a refeição planejada com pessoas específicas.

## Fluxo principal

1. Proprietário seleciona a refeição.
2. Proprietário seleciona uma ou mais pessoas para compartilhar, conforme `UC-PERM-002`.
3. Refeição passa a ter visibilidade `SHARED`.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Aplicam-se as mesmas regras de `UC-PERM-002`: o `owner` permanece o mesmo usuário; `sharedWith` passa a existir.
- Pessoas em `sharedWith` podem visualizar e editar a refeição, conforme `permissions.md`.
- Compartilhar a refeição não altera seu `createdBy` nem os ingredientes já definidos.

## Visibilidade

`PRIVATE` → `SHARED`, conforme `permissions.md` e `docs/product/decisions/PD-003-visibility-transitions.md`.

## Relações com outros módulos

Aplica `UC-PERM-002`. Relaciona-se com `UC-PERM-004` (transições de visibilidade).

## Critérios de aceite

- Refeição compartilhada torna-se visível e editável para as pessoas listadas em `sharedWith`.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
