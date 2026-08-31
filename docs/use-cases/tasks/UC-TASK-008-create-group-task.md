# UC-TASK-008 — Criar tarefa de grupo

## Objetivo

Permitir que um membro crie uma tarefa que pertence ao grupo, e não a ele individualmente. Este caso de uso aplica `UC-PERM-003` ao domínio de tarefas.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`).

## Pré-condições

- Usuário é membro ativo de um grupo.

## Gatilho

Membro decide criar uma tarefa pertencente ao grupo, em vez de pessoal.

## Fluxo principal

1. Membro cria a tarefa e define seu contexto como o grupo, conforme `UC-PERM-003`.
2. Tarefa é criada com `owner = Group` e `createdBy` igual ao usuário criador.
3. Membro pode, opcionalmente, atribuir um responsável dentre os membros do grupo (ver `UC-TASK-005`).

## Variações

- Tarefa de grupo criada sem responsável definido: válido, conforme `UC-TASK-001`.

## Regras de negócio

- Seguem-se as mesmas regras de `UC-PERM-003`: qualquer `MEMBER` pode criar; `owner = Group`; `createdBy = User`.
- O responsável de uma tarefa `GROUP` deve ser um membro ativo do grupo no momento da atribuição (ver `UC-TASK-005`).
- A tarefa continua pertencendo ao grupo mesmo que o criador (`createdBy`) ou o responsável deixem de ser membros (ver `docs/product/decisions/PD-002-resource-ownership.md`, `UC-GROUP-004` e `UC-GROUP-005`).

## Visibilidade

`GROUP`, conforme `permissions.md`. Propriedade: `owner = Group`, `createdBy = User`.

## Relações com outros módulos

Aplica `UC-PERM-003`. Relaciona-se com `UC-TASK-005` (atribuição), `UC-GROUP-004` (Remover membro) e `UC-GROUP-005` (Sair do grupo).

## Critérios de aceite

- Tarefa criada como `GROUP` é visível para os membros do grupo associado.
- Tarefa `GROUP` continua existindo mesmo que o criador saia do grupo ou seja removido.

## Questões em aberto

- O que acontece com o responsável de uma tarefa `GROUP` se essa pessoa deixar de ser membro do grupo — a tarefa fica sem responsável automaticamente, ou o registro permanece apontando para alguém sem mais acesso?
- Quem pode editar, concluir ou excluir uma tarefa `GROUP` — qualquer membro, apenas quem a criou, ou apenas um `OWNER` do grupo (ver `UC-TASK-002`, `UC-TASK-003` e `UC-TASK-004`)?
