# UC-FOOD-003 — Excluir refeição planejada

## Objetivo

Permitir remover uma refeição planejada que não é mais necessária.

## Ator

- Ator principal: proprietário da refeição (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Refeição existe.
- Ator possui permissão para excluir a refeição, conforme sua visibilidade.

## Gatilho

Ator decide excluir uma refeição planejada.

## Fluxo principal

1. Ator seleciona a refeição a ser excluída.
2. Se a refeição for recorrente, sistema pergunta se a exclusão deve afetar apenas a ocorrência atual ou toda a série (ver `UC-FOOD-008`).
3. Ator confirma a exclusão.
4. Sistema move a refeição para a lixeira, onde permanece por 30 dias antes de ser apagada definitivamente, conforme `docs/product/decisions/PD-005-deletion-policy.md`.

## Variações

- Ator restaura uma refeição que está na lixeira, dentro do período de 30 dias: refeição volta a ser uma refeição ativa normal.
- Refeição é recorrente: exclusão pergunta o escopo (ocorrência atual ou toda a série), mesmo padrão adotado para tarefas e compromissos recorrentes (`UC-TASK-004`, `UC-CAL-003`).

## Regras de negócio

- Excluir uma refeição `GROUP` não afeta a existência do grupo nem de outras refeições.
- Excluir uma refeição segue a política padrão de exclusão do Lema (`PD-005-deletion-policy.md`): lixeira por 30 dias, com restauração possível nesse período.
- Excluir uma refeição não exclui uma lista de compras já gerada a partir dela (ver `UC-FOOD-006`); a lista continua existindo de forma independente, mas deixa de poder ser sincronizada automaticamente com aquela refeição.

## Visibilidade

A exclusão remove a refeição da lista de refeições ativas para todas as pessoas que tinham acesso a ela, independentemente de sua visibilidade, ainda que o registro permaneça na lixeira por 30 dias.

## Relações com outros módulos

Relaciona-se com `UC-FOOD-006` quanto à independência entre a refeição e uma lista de compras já gerada a partir dela, e com `UC-FOOD-008` quanto ao escopo da exclusão de uma refeição recorrente.

## Critérios de aceite

- Refeição excluída deixa de aparecer na lista de refeições ativas para qualquer pessoa que tinha acesso a ela.
- Refeição excluída permanece na lixeira por 30 dias, podendo ser restaurada nesse período.
- Após 30 dias, a refeição é apagada definitivamente e não pode mais ser restaurada.
- Excluir uma refeição não afeta uma lista de compras já gerada a partir dela.
- Excluir uma refeição recorrente pergunta ao ator se a ação deve afetar apenas a ocorrência atual ou toda a série.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
