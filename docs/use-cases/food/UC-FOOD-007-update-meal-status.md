# UC-FOOD-007 — Marcar refeição como realizada ou cancelada

## Objetivo

Permitir atualizar o estado de uma refeição planejada para indicar se ela de fato aconteceu ou foi cancelada.

## Ator

- Ator principal: proprietário da refeição (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`), mesma governança de `UC-FOOD-002`.

## Pré-condições

- Refeição existe e está no estado `PLANNED`.

## Gatilho

Ator marca a refeição como realizada ou cancela o planejamento.

## Fluxo principal

1. Ator seleciona a refeição planejada.
2. Ator marca o estado como `DONE` (realizada) ou `CANCELLED` (cancelada).
3. Sistema atualiza o estado da refeição.

## Variações

- Refeição é uma ocorrência de uma série recorrente: alterar o estado afeta apenas aquela ocorrência, não as demais (mesmo princípio de `UC-TASK-006` e `UC-CAL-007`, ver `UC-FOOD-008`).

## Regras de negócio

- Toda refeição nasce no estado `PLANNED` (ver `UC-FOOD-001`).
- Alterar o estado da refeição não afeta a lista de compras já gerada nem os `ShoppingItem`s vinculados a ela (ver `UC-FOOD-006`) — refeição gera necessidade de compra, mas compra não controla a refeição, e o inverso também é verdadeiro: o estado da refeição não é controlado pela compra.
- Mesma governança de edição definida em `UC-FOOD-002`.

## Visibilidade

Alterar o estado não altera a visibilidade nem a propriedade da refeição.

## Relações com outros módulos

Relaciona-se com `UC-FOOD-001` (estado inicial) e `UC-FOOD-006` (independência frente à lista de compras). Relaciona-se com `UC-FOOD-008` quanto ao escopo da alteração em uma refeição recorrente.

## Critérios de aceite

- Refeição pode ser marcada como `DONE` ou `CANCELLED`.
- Alterar o estado não altera a lista de compras vinculada nem os `ShoppingItem`s dela.

## Questões em aberto

- É possível voltar uma refeição de `DONE`/`CANCELLED` para `PLANNED`?
- Marcar uma refeição como `CANCELLED` deveria sugerir remover os itens ainda pendentes da lista de compras vinculada a ela, ou isso é sempre uma decisão manual do usuário?
