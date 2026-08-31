# Casos de uso

Este documento define o padrão para registrar futuros casos de uso do Lema.

## Identificação

Os IDs são organizados por domínio:

- `UC-FIN-000` — Finanças
- `UC-TASK-000` — Tarefas
- `UC-GOAL-000` — Objetivos
- `UC-GROUP-000` — Grupos/Família
- `UC-PERM-000` — Permissões
- `UC-CAL-000` — Calendário
- `UC-FOOD-000` — Alimentação
- `UC-HOME-000` — Central do Lar
- `UC-INT-000` — Integrações

## Template

```
UC-XXX-000 — Nome do caso de uso

Objetivo
Ator
Pré-condições
Gatilho
Fluxo principal
Variações
Regras de negócio
Visibilidade
Relações com outros módulos
Critérios de aceite
Questões em aberto
```

A seção **Questões em aberto** registra decisões de produto que ainda não foram tomadas pela documentação existente. Ela não deve ser respondida artificialmente apenas para "fechar" o documento — o objetivo é também usar os casos de uso para descobrir decisões pendentes.

## Backlog inicial

### Grupos e permissões

Domínio detalhado — casos de uso documentados individualmente em [`docs/use-cases/groups/`](groups/):

- [`UC-GROUP-001`](groups/UC-GROUP-001-create-group.md) — Criar grupo
- [`UC-GROUP-002`](groups/UC-GROUP-002-invite-member.md) — Convidar membro
- [`UC-GROUP-003`](groups/UC-GROUP-003-accept-invitation.md) — Aceitar convite
- [`UC-GROUP-004`](groups/UC-GROUP-004-remove-member.md) — Remover membro
- [`UC-GROUP-005`](groups/UC-GROUP-005-leave-group.md) — Sair do grupo
- [`UC-GROUP-006`](groups/UC-GROUP-006-view-members.md) — Visualizar membros
- [`UC-GROUP-007`](groups/UC-GROUP-007-update-group.md) — Atualizar grupo
- [`UC-GROUP-008`](groups/UC-GROUP-008-manage-member-role.md) — Gerenciar papel de membro
- [`UC-PERM-001`](groups/UC-PERM-001-create-private-resource.md) — Criar recurso privado
- [`UC-PERM-002`](groups/UC-PERM-002-share-resource-with-members.md) — Compartilhar recurso com membros específicos
- [`UC-PERM-003`](groups/UC-PERM-003-create-group-resource.md) — Criar recurso de grupo
- [`UC-PERM-004`](groups/UC-PERM-004-change-resource-visibility.md) — Alterar visibilidade de recurso
- [`UC-PERM-005`](groups/UC-PERM-005-revoke-resource-access.md) — Revogar acesso a recurso

### Tarefas

Domínio detalhado — casos de uso documentados individualmente em [`docs/use-cases/tasks/`](tasks/):

- [`UC-TASK-001`](tasks/UC-TASK-001-create-task.md) — Criar tarefa
- [`UC-TASK-002`](tasks/UC-TASK-002-update-task.md) — Atualizar tarefa
- [`UC-TASK-003`](tasks/UC-TASK-003-complete-task.md) — Concluir tarefa
- [`UC-TASK-004`](tasks/UC-TASK-004-delete-task.md) — Excluir tarefa
- [`UC-TASK-005`](tasks/UC-TASK-005-assign-task.md) — Atribuir tarefa
- [`UC-TASK-006`](tasks/UC-TASK-006-create-recurring-task.md) — Criar tarefa recorrente
- [`UC-TASK-007`](tasks/UC-TASK-007-share-task.md) — Compartilhar tarefa
- [`UC-TASK-008`](tasks/UC-TASK-008-create-group-task.md) — Criar tarefa de grupo

### Calendário

Domínio detalhado — casos de uso documentados individualmente em [`docs/use-cases/calendar/`](calendar/):

- [`UC-CAL-001`](calendar/UC-CAL-001-create-event.md) — Criar compromisso
- [`UC-CAL-002`](calendar/UC-CAL-002-update-event.md) — Atualizar compromisso
- [`UC-CAL-003`](calendar/UC-CAL-003-delete-event.md) — Excluir compromisso
- [`UC-CAL-004`](calendar/UC-CAL-004-invite-participant.md) — Convidar participante para compromisso
- [`UC-CAL-005`](calendar/UC-CAL-005-share-event.md) — Compartilhar compromisso
- [`UC-CAL-006`](calendar/UC-CAL-006-create-group-event.md) — Criar compromisso de grupo
- [`UC-CAL-007`](calendar/UC-CAL-007-create-recurring-event.md) — Criar compromisso recorrente

### Objetivos

Domínio detalhado — casos de uso documentados individualmente em [`docs/use-cases/goals/`](goals/):

- [`UC-GOAL-001`](goals/UC-GOAL-001-create-goal.md) — Criar objetivo
- [`UC-GOAL-002`](goals/UC-GOAL-002-update-goal.md) — Atualizar objetivo
- [`UC-GOAL-003`](goals/UC-GOAL-003-complete-goal.md) — Concluir objetivo
- [`UC-GOAL-004`](goals/UC-GOAL-004-delete-goal.md) — Excluir objetivo
- [`UC-GOAL-005`](goals/UC-GOAL-005-share-goal.md) — Compartilhar objetivo
- [`UC-GOAL-006`](goals/UC-GOAL-006-create-group-goal.md) — Criar objetivo de grupo
- [`UC-GOAL-007`](goals/UC-GOAL-007-relate-goal-to-resource.md) — Relacionar objetivo a outros recursos

### Outros domínios (ainda não detalhados)

- `UC-FIN-001` — Registrar despesa manual

## Futuros

- `UC-INT-001` — Registrar despesa via WhatsApp
- `UC-INT-002` — Sugerir despesa a partir de notificação bancária
- `UC-HOME-001` — Visualizar Central do Lar
