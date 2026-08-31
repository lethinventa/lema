# UC-TASK-006 — Criar tarefa recorrente

## Objetivo

Permitir que uma tarefa se repita conforme um padrão de recorrência (ex.: diária, semanal, mensal), sem exigir que o usuário a recrie manualmente a cada período.

## Ator

- Ator principal: usuário autenticado (mesmo ator de `UC-TASK-001`).

## Pré-condições

- Mesmas pré-condições de `UC-TASK-001`.

## Gatilho

Usuário cria uma tarefa e define um padrão de recorrência.

## Fluxo principal

1. Usuário cria a tarefa (ver `UC-TASK-001`) e define um padrão de recorrência.
2. Sistema registra a tarefa como recorrente, associada a esse padrão.
3. Quando uma ocorrência é concluída, uma nova ocorrência é disponibilizada conforme o padrão (mecanismo exato não definido — ver Questões em aberto).

## Variações

- Recorrência com data final definida.
- Recorrência sem data final (indefinida) — comportamento padrão, já que não existe prazo final de recorrência por padrão.

## Regras de negócio

- Uma tarefa recorrente mantém a mesma visibilidade, `owner` e `createdBy` entre suas ocorrências.
- Concluir uma ocorrência não deve exigir que o usuário recrie manualmente a tarefa para o próximo período.
- Cada ocorrência pode ser editada, concluída ou excluída individualmente, sem afetar as demais ocorrências da série (ver `UC-TASK-002`, `UC-TASK-003` e `UC-TASK-004`).
- Excluir uma tarefa recorrente pergunta ao ator se a exclusão deve afetar apenas a ocorrência atual ou toda a série (ver `UC-TASK-004`).
- Não existe prazo final de recorrência por padrão; a recorrência é indefinida, a menos que uma data final seja explicitamente definida.

## Visibilidade

Segue as mesmas regras de `PRIVATE`, `SHARED` ou `GROUP` de qualquer tarefa, conforme `UC-TASK-001`. A recorrência não é, por si só, um tipo de visibilidade.

## Relações com outros módulos

Relaciona-se diretamente com `UC-TASK-001` (criação) e `UC-TASK-003` (conclusão aciona o comportamento de recorrência). Também se relaciona com `UC-TASK-004` quanto ao escopo de uma exclusão.

## Critérios de aceite

- Após concluir uma ocorrência, a tarefa volta a estar disponível como pendente para o próximo período, conforme o padrão definido.
- É possível identificar que uma tarefa é recorrente e qual é o seu padrão.
- É possível editar, concluir ou excluir uma ocorrência específica sem afetar as demais ocorrências da série.
- Ao excluir, o sistema pergunta se a ação deve afetar apenas a ocorrência atual ou toda a série.

## Questões em aberto

- O(s) responsável(is) atribuído(s) a uma tarefa recorrente permanece(m) automaticamente em cada nova ocorrência, ou precisa(m) ser reatribuído(s) a cada vez?
