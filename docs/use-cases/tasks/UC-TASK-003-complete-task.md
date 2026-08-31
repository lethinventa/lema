# UC-TASK-003 — Concluir tarefa

## Objetivo

Permitir marcar uma tarefa como concluída, registrando quando e por quem.

## Ator

- Ator principal: responsável pela tarefa, quando definido; caso contrário, qualquer pessoa com acesso à tarefa (ver Questões em aberto).

## Pré-condições

- Tarefa existe e ainda não está concluída.
- Ator possui acesso à tarefa, conforme sua visibilidade.

## Gatilho

Ator marca a tarefa como concluída.

## Fluxo principal

1. Ator seleciona a tarefa e a marca como concluída.
2. Sistema registra a conclusão, incluindo quem concluiu e quando.
3. Tarefa passa a ser exibida como concluída.

## Variações

- Tarefa é recorrente: conclusão aciona o comportamento descrito em `UC-TASK-006`.
- Ator tenta reabrir (desmarcar) uma tarefa já concluída (ver Questões em aberto).

## Regras de negócio

- A conclusão registra quem concluiu e quando, como histórico mínimo.
- Concluir uma tarefa não a exclui nem apaga seus dados.
- Concluir uma tarefa não altera seu `owner`, `createdBy` nem seu responsável.

## Visibilidade

Concluir uma tarefa não altera sua visibilidade nem sua propriedade.

## Relações com outros módulos

Relaciona-se com `UC-TASK-006` (Criar tarefa recorrente), já que a conclusão de uma ocorrência recorrente tem comportamento próprio.

## Critérios de aceite

- Tarefa concluída registra quem a concluiu e a data/hora da conclusão.
- Tarefa concluída permanece visível no histórico, não desaparece da lista de tarefas.

## Questões em aberto

- Quando há um responsável definido, apenas ele pode concluir a tarefa, ou qualquer pessoa com acesso a ela também pode?
- É possível reabrir (desmarcar) uma tarefa concluída?
- O histórico de conclusão registra apenas o último evento, ou todas as conclusões ao longo do tempo (relevante principalmente para tarefas recorrentes)?
