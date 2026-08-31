# UC-FIN-002 — Atualizar transação

## Objetivo

Permitir editar os dados de uma transação existente (ex.: valor, data, categoria, conta associada).

## Ator

- Ator principal: proprietário da transação (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Transação existe.
- Ator possui acesso de edição, conforme a visibilidade da transação.

## Gatilho

Ator decide alterar dados de uma transação.

## Fluxo principal

1. Ator seleciona a transação.
2. Ator atualiza os dados desejados.
3. Sistema salva as alterações.

## Variações

- Alterar a visibilidade da transação: tratado por `UC-PERM-004`, não por este caso de uso.
- Alterar a conta associada: válido, desde que a nova conta seja acessível ao ator.
- Alterar pagador, responsável econômico ou `SplitRule`: válido; recalcula o saldo corrente entre as pessoas envolvidas (ver `domain-model.md`).

## Regras de negócio

- Atualizar uma transação não altera seu `owner` nem `createdBy`.
- Para transações `SHARED`, tanto o proprietário quanto as pessoas em `sharedWith` podem editar, conforme `permissions.md`.
- Para transações `GROUP`, qualquer membro do grupo pode editar, independentemente de seu papel, conforme `PD-004-group-resource-governance.md`.
- Alterar a `SplitRule` de uma transação já registrada não é retroativo para outras transações — afeta apenas a transação editada, recalculando o saldo entre as pessoas envolvidas a partir dela.

## Visibilidade

Este caso de uso não altera a visibilidade da transação.

## Relações com outros módulos

Relaciona-se com `UC-PERM-004` (mudança de visibilidade) e `UC-FIN-006` (conta associada).

## Critérios de aceite

- Alterações ficam visíveis para todas as pessoas com acesso à transação.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
