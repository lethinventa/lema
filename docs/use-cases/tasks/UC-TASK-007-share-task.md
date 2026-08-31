# UC-TASK-007 — Compartilhar tarefa

## Objetivo

Permitir que o proprietário de uma tarefa `PRIVATE` a compartilhe com pessoas específicas, tornando-a `SHARED`. Este caso de uso aplica `UC-PERM-002` ao domínio de tarefas.

## Ator

- Ator principal: proprietário da tarefa.
- Ator secundário: pessoas com quem a tarefa é compartilhada.

## Pré-condições

- Tarefa existe, com visibilidade `PRIVATE`.
- Pessoas a receber o compartilhamento já possuem conta no Lema.

## Gatilho

Proprietário decide compartilhar a tarefa com pessoas específicas.

## Fluxo principal

1. Proprietário seleciona a tarefa.
2. Proprietário seleciona uma ou mais pessoas para compartilhar, conforme `UC-PERM-002`.
3. Tarefa passa a ter visibilidade `SHARED`.

## Variações

- Tarefa já possuía um responsável definido antes de ser compartilhada: o responsável permanece o mesmo (ver Questões em aberto quanto ao caso em que ele não está em `sharedWith`).

## Regras de negócio

- Aplicam-se as mesmas regras de `UC-PERM-002`: o `owner` permanece o mesmo usuário; `sharedWith` passa a existir.
- Pessoas em `sharedWith` podem visualizar e editar a tarefa, conforme `permissions.md`.
- Compartilhar a tarefa não altera seu `createdBy`, seu histórico de conclusão nem seu responsável.

## Visibilidade

`PRIVATE` → `SHARED`, conforme `permissions.md` e `docs/product/decisions/PD-003-visibility-transitions.md`.

## Relações com outros módulos

Aplica `UC-PERM-002`. Relaciona-se com `UC-PERM-004` (transições de visibilidade) e `UC-TASK-005` (atribuição de responsável).

## Critérios de aceite

- Tarefa compartilhada torna-se visível e editável para as pessoas listadas em `sharedWith`.
- Responsável e histórico de conclusão da tarefa não são alterados pelo compartilhamento.

## Questões em aberto

- Se o responsável de uma tarefa não estiver entre as pessoas do compartilhamento, ele continua sendo responsável mesmo sem ter mais acesso à tarefa?
- Compartilhar uma tarefa notifica as pessoas adicionadas?
