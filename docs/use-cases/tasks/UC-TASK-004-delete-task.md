# UC-TASK-004 — Excluir tarefa

## Objetivo

Permitir remover uma tarefa que não é mais necessária.

## Ator

- Ator principal: proprietário da tarefa (`PRIVATE`/`SHARED`) ou membro do grupo (`GROUP`), conforme a visibilidade — ver Questões em aberto quanto a `GROUP`.

## Pré-condições

- Tarefa existe.
- Ator possui permissão para excluir a tarefa, conforme sua visibilidade.

## Gatilho

Ator decide excluir uma tarefa.

## Fluxo principal

1. Ator seleciona a tarefa a ser excluída.
2. Ator confirma a exclusão.
3. Sistema remove a tarefa.

## Variações

- Tarefa é recorrente: excluir pode afetar apenas a próxima ocorrência ou toda a série (ver `UC-TASK-006` e Questões em aberto).
- Tarefa já concluída: pode ser excluída normalmente (hipótese; ver Questões em aberto).

## Regras de negócio

- Excluir uma tarefa `GROUP` não afeta a existência do grupo nem de outras tarefas.
- Excluir uma tarefa é uma ação definitiva neste momento; não há decisão sobre uma etapa intermediária de recuperação (ver Questões em aberto).

## Visibilidade

A exclusão remove a tarefa para todas as pessoas que tinham acesso a ela, independentemente de sua visibilidade.

## Relações com outros módulos

Relaciona-se com `UC-TASK-006` (tarefas recorrentes) quanto ao escopo da exclusão (ocorrência vs. série).

## Critérios de aceite

- Tarefa excluída deixa de aparecer para qualquer pessoa que tinha acesso a ela.

## Questões em aberto

- Quem pode excluir uma tarefa `GROUP` — qualquer membro, apenas quem a criou (`createdBy`), ou apenas um `OWNER` do grupo?
- Existe uma etapa de recuperação (ex.: lixeira) antes da exclusão definitiva?
- Excluir uma tarefa recorrente remove apenas a próxima ocorrência ou toda a série?
