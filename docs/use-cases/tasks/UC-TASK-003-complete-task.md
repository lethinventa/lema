# UC-TASK-003 — Concluir tarefa

## Objetivo

Permitir marcar uma tarefa como concluída, registrando quando e por quem.

## Ator

- Ator principal: qualquer pessoa com acesso à tarefa, não apenas quem estiver definido como responsável.

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
- Ator reabre (desmarca) uma tarefa concluída: tarefa volta ao estado pendente. O registro da conclusão anterior permanece no histórico.

## Regras de negócio

- A conclusão registra quem concluiu e quando.
- Todo o histórico de conclusões é preservado, não apenas o evento mais recente — especialmente relevante para tarefas recorrentes (ver `UC-TASK-006`).
- Qualquer pessoa com acesso à tarefa pode concluí-la, independentemente de ser a responsável designada.
- É possível reabrir uma tarefa concluída, retornando-a ao estado pendente; o histórico de conclusões anteriores não é apagado ao reabrir.
- Concluir uma tarefa não a exclui nem apaga seus dados.
- Concluir uma tarefa não altera seu `owner`, `createdBy` nem seu(s) responsável(is).

## Visibilidade

Concluir uma tarefa não altera sua visibilidade nem sua propriedade.

## Relações com outros módulos

Relaciona-se com `UC-TASK-006` (Criar tarefa recorrente), já que a conclusão de uma ocorrência recorrente tem comportamento próprio.

## Critérios de aceite

- Tarefa concluída registra quem a concluiu e a data/hora da conclusão.
- Tarefa concluída permanece visível no histórico, não desaparece da lista de tarefas.
- É possível reabrir uma tarefa concluída, retornando-a ao estado pendente.
- O histórico de conclusão preserva todos os eventos de conclusão ao longo do tempo, não apenas o mais recente.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
