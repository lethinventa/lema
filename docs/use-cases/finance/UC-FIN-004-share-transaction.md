# UC-FIN-004 — Compartilhar transação

## Objetivo

Permitir que o proprietário de uma transação `PRIVATE` a compartilhe com pessoas específicas, tornando-a `SHARED`. Este caso de uso aplica `UC-PERM-002` ao domínio de finanças.

## Ator

- Ator principal: proprietário da transação.
- Ator secundário: pessoas com quem a transação é compartilhada.

## Pré-condições

- Transação existe, com visibilidade `PRIVATE`.
- Pessoas a receber o compartilhamento já possuem conta no Lema.

## Gatilho

Proprietário decide compartilhar a transação com pessoas específicas — por exemplo, uma despesa dividida entre duas pessoas que não fazem parte do mesmo grupo.

## Fluxo principal

1. Proprietário seleciona a transação.
2. Proprietário seleciona uma ou mais pessoas para compartilhar, conforme `UC-PERM-002`.
3. Transação passa a ter visibilidade `SHARED`.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Aplicam-se as mesmas regras de `UC-PERM-002`: o `owner` permanece o mesmo usuário; `sharedWith` passa a existir.
- Pessoas em `sharedWith` podem visualizar e editar a transação, conforme `permissions.md`.
- Compartilhar a transação não altera seu `createdBy` nem a conta associada a ela.

## Visibilidade

`PRIVATE` → `SHARED`, conforme `permissions.md` e `docs/product/decisions/PD-003-visibility-transitions.md`.

## Relações com outros módulos

Aplica `UC-PERM-002`. Relaciona-se com `UC-PERM-004` (transições de visibilidade).

## Critérios de aceite

- Transação compartilhada torna-se visível e editável para as pessoas listadas em `sharedWith`.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
