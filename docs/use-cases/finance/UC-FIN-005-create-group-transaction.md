# UC-FIN-005 — Registrar transação de grupo

## Objetivo

Permitir que um membro registre uma transação que pertence ao grupo, e não a ele individualmente — por exemplo, uma despesa da casa. Este caso de uso aplica `UC-PERM-003` ao domínio de finanças.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`).

## Pré-condições

- Usuário é membro ativo de um grupo.

## Gatilho

Membro decide registrar uma transação pertencente ao grupo, em vez de pessoal.

## Fluxo principal

1. Membro registra a transação e define seu contexto como o grupo, conforme `UC-PERM-003`.
2. Transação é criada com `owner = Group` e `createdBy` igual ao usuário que a registrou.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Seguem-se as mesmas regras de `UC-PERM-003`: qualquer `MEMBER` pode criar; `owner = Group`; `createdBy = User`.
- Qualquer membro do grupo pode editar ou excluir uma transação `GROUP`, independentemente de seu papel, conforme `docs/product/decisions/PD-004-group-resource-governance.md`.
- A transação continua pertencendo ao grupo mesmo que quem a registrou (`createdBy`) deixe de ser membro (ver `docs/product/decisions/PD-002-resource-ownership.md`, `UC-GROUP-004` e `UC-GROUP-005`).

## Visibilidade

`GROUP`, conforme `permissions.md`. Propriedade: `owner = Group`, `createdBy = User`.

## Relações com outros módulos

Aplica `UC-PERM-003`. Relaciona-se com `UC-GROUP-004` (Remover membro), `UC-GROUP-005` (Sair do grupo) e `UC-FIN-006` (conta de grupo, ex.: "conta da casa").

## Critérios de aceite

- Transação criada como `GROUP` é visível para os membros do grupo associado.
- Transação `GROUP` continua existindo mesmo que quem a registrou saia do grupo ou seja removido.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
