# UC-TASK-001 — Criar tarefa

## Objetivo

Permitir que um usuário registre algo que precisa ser feito, podendo ser pessoal, compartilhado com pessoas específicas ou pertencente a um grupo, conforme a visibilidade escolhida.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa.
- Se a tarefa for criada como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide registrar algo que precisa ser feito.

## Fluxo principal

1. Usuário informa os dados da tarefa (ex.: título; prazo, se houver).
2. Usuário define a visibilidade da tarefa — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
3. Sistema cria a tarefa com `owner` e `createdBy` definidos conforme a visibilidade escolhida.
4. Tarefa passa a existir, sem responsável definido, a menos que o próprio criador atribua alguém no mesmo fluxo (ver `UC-TASK-005`).

## Variações

- Tarefa criada sem prazo definido: válido, a tarefa não possui data associada.
- Tarefa criada sem responsável definido: válido, nenhuma pessoa fica designada até uma atribuição posterior.
- Tarefa criada já com um ou mais responsáveis definidos no mesmo fluxo, como atalho para `UC-TASK-005`.
- Tarefa criada como recorrente: ver `UC-TASK-006`.

## Regras de negócio

- Toda tarefa possui um `owner` (`User` para `PRIVATE`/`SHARED`, `Group` para `GROUP`) e um `createdBy` (o usuário que a criou), conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Uma tarefa pode existir sem prazo e sem responsável.
- Uma tarefa pode ter mais de um responsável simultaneamente (ver `UC-TASK-005`).
- Não há campos obrigatórios além do título.
- Criar uma tarefa `GROUP` exige que o usuário seja membro ativo do grupo no momento da criação.

## Visibilidade

Uma tarefa pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`, `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Este caso de uso não redefine essas regras.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` para a mecânica de visibilidade. Relaciona-se com `UC-TASK-005` (atribuir responsável) e `UC-TASK-006` (tarefa recorrente).

## Critérios de aceite

- Tarefa criada é visível para quem tem acesso, conforme sua visibilidade.
- Tarefa pode ser criada sem prazo e sem responsável definidos.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
