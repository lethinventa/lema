# UC-TASK-002 — Atualizar tarefa

## Objetivo

Permitir editar os dados de uma tarefa existente (ex.: título, prazo, descrição), sem afetar seu histórico de conclusão.

## Ator

- Ator principal: proprietário da tarefa (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP`).

## Pré-condições

- Tarefa existe.
- Ator possui acesso de edição à tarefa, conforme sua visibilidade.

## Gatilho

Ator decide alterar dados de uma tarefa.

## Fluxo principal

1. Ator seleciona a tarefa.
2. Ator atualiza os dados desejados (ex.: título, prazo, descrição).
3. Sistema salva as alterações.

## Variações

- Tarefa já concluída: pode ser editada normalmente, sem alterar seu estado de conclusão nem apagar o histórico já registrado.
- Alterar o responsável da tarefa: tratado por `UC-TASK-005`, não por este caso de uso.
- Alterar a visibilidade da tarefa: tratado por `UC-PERM-004`, não por este caso de uso.

## Regras de negócio

- Atualizar uma tarefa não altera seu `owner`, `createdBy` nem seu histórico de conclusão.
- Para tarefas `SHARED`, tanto o proprietário quanto as pessoas em `sharedWith` podem editar, conforme `permissions.md`.
- Para tarefas `GROUP`, qualquer membro do grupo pode editar, independentemente de seu papel (`OWNER` ou `MEMBER`).
- Editar uma tarefa concluída não desfaz sua conclusão.

## Visibilidade

Este caso de uso não altera a visibilidade da tarefa.

## Relações com outros módulos

Relaciona-se com `UC-PERM-004` (mudança de visibilidade) e `UC-TASK-005` (atribuição de responsável), que são casos de uso distintos.

## Critérios de aceite

- Alterações ficam visíveis para todas as pessoas com acesso à tarefa.
- Atualizar dados não afeta responsável nem histórico de conclusão.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
