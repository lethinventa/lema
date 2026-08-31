# UC-TASK-004 — Excluir tarefa

## Objetivo

Permitir remover uma tarefa que não é mais necessária.

## Ator

- Ator principal: proprietário da tarefa (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP`).

## Pré-condições

- Tarefa existe.
- Ator possui permissão para excluir a tarefa, conforme sua visibilidade.

## Gatilho

Ator decide excluir uma tarefa.

## Fluxo principal

1. Ator seleciona a tarefa a ser excluída.
2. Se a tarefa for recorrente, sistema pergunta se a exclusão deve afetar apenas a ocorrência atual ou toda a série.
3. Ator confirma a exclusão.
4. Sistema move a tarefa para a lixeira, onde permanece por 30 dias antes de ser apagada definitivamente.

## Variações

- Tarefa é recorrente: ao excluir, o sistema pergunta se a exclusão deve afetar apenas a ocorrência atual ou toda a série (ver `UC-TASK-006`).
- Tarefa já concluída: pode ser excluída normalmente, seguindo o mesmo fluxo de lixeira.

## Regras de negócio

- Excluir uma tarefa `GROUP` não afeta a existência do grupo nem de outras tarefas.
- Excluir uma tarefa move-a para uma lixeira; ela não é apagada definitivamente de imediato.
- Após 30 dias na lixeira, a tarefa é apagada de forma definitiva e automática.
- Qualquer membro do grupo pode excluir uma tarefa `GROUP`, independentemente de seu papel.
- Excluir uma tarefa recorrente exige que o ator escolha entre excluir apenas a ocorrência atual ou toda a série (ver `UC-TASK-006`).

## Visibilidade

A exclusão remove a tarefa da lista de tarefas ativas para todas as pessoas que tinham acesso a ela, independentemente de sua visibilidade, ainda que o registro permaneça na lixeira por 30 dias.

## Relações com outros módulos

Relaciona-se com `UC-TASK-006` (tarefas recorrentes) quanto ao escopo da exclusão (ocorrência vs. série).

## Critérios de aceite

- Tarefa excluída deixa de aparecer na lista de tarefas ativas para qualquer pessoa que tinha acesso a ela.
- Tarefa excluída permanece na lixeira por 30 dias antes de ser apagada definitivamente.
- Excluir uma tarefa recorrente pergunta ao ator se a ação deve afetar apenas a ocorrência atual ou toda a série.

## Questões em aberto

- É possível restaurar uma tarefa da lixeira antes dos 30 dias, ou a lixeira serve apenas como período de tolerância antes da exclusão definitiva, sem opção de restauração pelo usuário?
