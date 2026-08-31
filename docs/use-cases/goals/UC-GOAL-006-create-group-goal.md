# UC-GOAL-006 — Criar objetivo de grupo

## Objetivo

Permitir que um membro crie um objetivo que pertence ao grupo, e não a ele individualmente — por exemplo, uma meta compartilhada pela família. Este caso de uso aplica `UC-PERM-003` ao domínio de objetivos.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`).

## Pré-condições

- Usuário é membro ativo de um grupo.

## Gatilho

Membro decide criar um objetivo pertencente ao grupo, em vez de pessoal.

## Fluxo principal

1. Membro cria o objetivo e define seu contexto como o grupo, conforme `UC-PERM-003`.
2. Objetivo é criado com `owner = Group` e `createdBy` igual ao usuário criador.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Seguem-se as mesmas regras de `UC-PERM-003`: qualquer `MEMBER` pode criar; `owner = Group`; `createdBy = User`.
- Qualquer membro do grupo pode editar, concluir ou excluir um objetivo `GROUP`, independentemente de seu papel, conforme `docs/product/decisions/PD-004-group-resource-governance.md` — exceto quanto à conclusão, cuja autoria ainda está em aberto (ver `UC-GOAL-003`).
- O objetivo continua pertencendo ao grupo mesmo que o criador (`createdBy`) deixe de ser membro (ver `docs/product/decisions/PD-002-resource-ownership.md`, `UC-GROUP-004` e `UC-GROUP-005`).

## Visibilidade

`GROUP`, conforme `permissions.md`. Propriedade: `owner = Group`, `createdBy = User`.

## Relações com outros módulos

Aplica `UC-PERM-003`. Relaciona-se com `UC-GROUP-004` (Remover membro), `UC-GROUP-005` (Sair do grupo) e `UC-GOAL-007` (relações com outros recursos).

## Critérios de aceite

- Objetivo criado como `GROUP` é visível para os membros do grupo associado.
- Objetivo `GROUP` continua existindo mesmo que o criador saia do grupo ou seja removido.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento, além da já registrada em `UC-GOAL-003` quanto a quem pode concluir um objetivo `GROUP`.
