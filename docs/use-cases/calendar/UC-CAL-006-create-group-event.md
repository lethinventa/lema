# UC-CAL-006 — Criar compromisso de grupo

## Objetivo

Permitir que um membro crie um compromisso que pertence ao grupo, e não a ele individualmente. Este caso de uso aplica `UC-PERM-003` ao domínio de calendário.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`).

## Pré-condições

- Usuário é membro ativo de um grupo.

## Gatilho

Membro decide criar um compromisso pertencente ao grupo, em vez de pessoal.

## Fluxo principal

1. Membro cria o compromisso e define seu contexto como o grupo, conforme `UC-PERM-003`.
2. Compromisso é criado com `owner = Group` e `createdBy` igual ao usuário criador.
3. Membro pode, opcionalmente, convidar participantes dentre os membros do grupo (ver `UC-CAL-004`).

## Variações

- Compromisso de grupo criado sem participantes definidos: válido, conforme `UC-CAL-001`.

## Regras de negócio

- Seguem-se as mesmas regras de `UC-PERM-003`: qualquer `MEMBER` pode criar; `owner = Group`; `createdBy = User`.
- Os participantes de um compromisso `GROUP` devem ser membros ativos do grupo no momento do convite (ver `UC-CAL-004`).
- O compromisso continua pertencendo ao grupo mesmo que o criador (`createdBy`) deixe de ser membro (ver `docs/product/decisions/PD-002-resource-ownership.md`, `UC-GROUP-004` e `UC-GROUP-005`).
- Se um participante deixar de ser membro do grupo, ele é removido automaticamente da lista de participantes (ver `UC-CAL-004`).

## Visibilidade

`GROUP`, conforme `permissions.md`. Propriedade: `owner = Group`, `createdBy = User`.

## Relações com outros módulos

Aplica `UC-PERM-003`. Relaciona-se com `UC-CAL-004` (participantes), `UC-GROUP-004` (Remover membro) e `UC-GROUP-005` (Sair do grupo).

## Critérios de aceite

- Compromisso criado como `GROUP` é visível para os membros do grupo associado.
- Compromisso `GROUP` continua existindo mesmo que o criador saia do grupo ou seja removido.

## Questões em aberto

- Quem pode editar ou excluir um compromisso `GROUP` — qualquer membro, apenas quem o criou, ou apenas um `OWNER` do grupo? (ver `UC-CAL-002` e `UC-CAL-003`)
