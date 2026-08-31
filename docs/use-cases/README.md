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

### Outros domínios (ainda não detalhados)

- `UC-FIN-001` — Registrar despesa manual
- `UC-TASK-001` — Criar tarefa
- `UC-GOAL-001` — Criar objetivo
- `UC-CAL-001` — Criar compromisso

## Futuros

- `UC-INT-001` — Registrar despesa via WhatsApp
- `UC-INT-002` — Sugerir despesa a partir de notificação bancária
- `UC-HOME-001` — Visualizar Central do Lar
