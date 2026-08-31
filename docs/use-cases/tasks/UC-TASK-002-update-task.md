# UC-TASK-002 — Atualizar tarefa

## Objetivo

Permitir editar os dados de uma tarefa existente (ex.: título, prazo, descrição), sem afetar seu histórico de conclusão.

## Ator

- Ator principal: proprietário da tarefa (`PRIVATE`/`SHARED`) ou membro do grupo (`GROUP`), conforme a visibilidade — ver Questões em aberto quanto a `GROUP`.

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

- Tarefa já concluída: pode ser editada sem alterar seu estado de conclusão (ver Questões em aberto).
- Alterar o responsável da tarefa: tratado por `UC-TASK-005`, não por este caso de uso.
- Alterar a visibilidade da tarefa: tratado por `UC-PERM-004`, não por este caso de uso.

## Regras de negócio

- Atualizar uma tarefa não altera seu `owner`, `createdBy` nem seu histórico de conclusão.
- Para tarefas `SHARED`, tanto o proprietário quanto as pessoas em `sharedWith` podem editar, conforme `permissions.md`.
- Para tarefas `GROUP`, quem pode editar ainda não está definido (ver Questões em aberto).

## Visibilidade

Este caso de uso não altera a visibilidade da tarefa.

## Relações com outros módulos

Relaciona-se com `UC-PERM-004` (mudança de visibilidade) e `UC-TASK-005` (atribuição de responsável), que são casos de uso distintos.

## Critérios de aceite

- Alterações ficam visíveis para todas as pessoas com acesso à tarefa.
- Atualizar dados não afeta responsável nem histórico de conclusão.

## Questões em aberto

- Quem pode editar uma tarefa `GROUP` — qualquer membro do grupo, apenas quem a criou (`createdBy`), ou apenas um `OWNER` do grupo?
- Uma tarefa já concluída pode ser editada livremente, ou apenas alguns campos ficam bloqueados?
