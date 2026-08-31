# UC-FOOD-005 — Planejar refeição de grupo

## Objetivo

Permitir que um membro planeje uma refeição que pertence ao grupo, e não a ele individualmente — o cardápio da família, por exemplo. Este caso de uso aplica `UC-PERM-003` ao domínio de alimentação.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`).

## Pré-condições

- Usuário é membro ativo de um grupo.

## Gatilho

Membro decide planejar uma refeição pertencente ao grupo, em vez de pessoal.

## Fluxo principal

1. Membro cria a refeição e define seu contexto como o grupo, conforme `UC-PERM-003`.
2. Refeição é criada com `owner = Group` e `createdBy` igual ao usuário criador.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Seguem-se as mesmas regras de `UC-PERM-003`: qualquer `MEMBER` pode criar; `owner = Group`; `createdBy = User`.
- Qualquer membro do grupo pode editar ou excluir uma refeição `GROUP`, independentemente de seu papel, conforme `docs/product/decisions/PD-004-group-resource-governance.md`.
- A refeição continua pertencendo ao grupo mesmo que o criador (`createdBy`) deixe de ser membro (ver `docs/product/decisions/PD-002-resource-ownership.md`, `UC-GROUP-004` e `UC-GROUP-005`).

## Visibilidade

`GROUP`, conforme `permissions.md`. Propriedade: `owner = Group`, `createdBy = User`.

## Relações com outros módulos

Aplica `UC-PERM-003`. Relaciona-se com `UC-GROUP-004` (Remover membro), `UC-GROUP-005` (Sair do grupo) e `UC-FOOD-006` (lista de compras gerada a partir da refeição).

## Critérios de aceite

- Refeição criada como `GROUP` é visível para os membros do grupo associado — é o "cardápio da família" citado em `docs/product/roadmap.md` (Central do Lar).
- Refeição `GROUP` continua existindo mesmo que o criador saia do grupo ou seja removido.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
