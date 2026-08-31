# UC-FIN-003 — Excluir transação

## Objetivo

Permitir remover uma transação registrada incorretamente ou que não deveria mais constar no histórico financeiro.

## Ator

- Ator principal: proprietário da transação (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Transação existe.
- Ator possui permissão para excluir a transação, conforme sua visibilidade.

## Gatilho

Ator decide excluir uma transação.

## Fluxo principal

1. Ator seleciona a transação a ser excluída.
2. Ator confirma a exclusão.
3. Sistema move a transação para a lixeira, onde permanece por 30 dias antes de ser apagada definitivamente, conforme `docs/product/decisions/PD-005-deletion-policy.md`.

## Variações

- Ator restaura uma transação que está na lixeira, dentro do período de 30 dias: transação volta a ser uma transação ativa normal.

## Regras de negócio

- Excluir uma transação `GROUP` não afeta a existência do grupo nem de outras transações.
- Excluir uma transação segue a política padrão de exclusão do Lema (`PD-005-deletion-policy.md`): lixeira por 30 dias, com restauração possível nesse período.
- Se a transação compunha um saldo corrente entre pessoas (ver `domain-model.md`), excluí-la remove sua contribuição a esse saldo; restaurá-la dentro dos 30 dias a recalcula de volta.
- Se a transação estiver referenciada por uma `GoalAllocation` em estado `PAID` (ver `UC-GOAL-007`), a alocação permanece registrada, mas perde a referência à transação enquanto ela estiver na lixeira ou após a exclusão definitiva.

## Visibilidade

A exclusão remove a transação da lista de transações ativas para todas as pessoas que tinham acesso a ela, independentemente de sua visibilidade, ainda que o registro permaneça na lixeira por 30 dias.

## Relações com outros módulos

Nenhuma relação adicional além das já estabelecidas por `UC-FIN-001`.

## Critérios de aceite

- Transação excluída deixa de aparecer na lista de transações ativas para qualquer pessoa que tinha acesso a ela.
- Transação excluída permanece na lixeira por 30 dias, podendo ser restaurada nesse período.
- Após 30 dias, a transação é apagada definitivamente e não pode mais ser restaurada.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
