# UC-GROUP-005 — Sair do grupo

## Objetivo

Permitir que um membro decida deixar um grupo por conta própria.

## Ator

- Ator principal: membro do grupo.

## Pré-condições

- Usuário é membro ativo do grupo.

## Gatilho

Usuário solicita sair do grupo.

## Fluxo principal

1. Usuário confirma a intenção de sair do grupo.
2. Sistema encerra a associação (`Membership`) do usuário com o grupo.
3. Usuário perde acesso a conteúdo `GROUP` daquele grupo.

## Variações

- Usuário é `MEMBER`, ou é `OWNER` e existe ao menos outro `OWNER` no grupo: fluxo principal se aplica normalmente.
- Usuário é o único `OWNER` do grupo: ação é bloqueada. Ele deve primeiro promover outro membro a `OWNER` (ver `UC-GROUP-008`) antes de conseguir sair.

## Regras de negócio

- O único `OWNER` de um grupo não pode sair sem antes promover outro membro a `OWNER`.
- Sair do grupo não apaga recursos `PRIVATE` do usuário.
- Sair do grupo não apaga recursos `GROUP` criados por ele: esses recursos pertencem ao grupo (`owner = Group`) e continuam existindo, mantendo `createdBy` apontando para quem saiu (ver `docs/product/decisions/PD-002-resource-ownership.md`).

## Visibilidade

Usuário deixa de ter acesso a qualquer recurso `GROUP` daquele grupo.

## Relações com outros módulos

Semelhante a `UC-GROUP-004`, mas iniciado pelo próprio membro em vez de por outro membro autorizado.

## Critérios de aceite

- Usuário deixa de constar como membro ativo do grupo.
- Usuário não consegue mais visualizar conteúdo `GROUP` do grupo após sair.
- Sistema impede que o único `OWNER` do grupo saia sem antes promover outro membro a `OWNER`.
- Recursos `GROUP` criados pelo usuário continuam existindo no grupo após ele sair.

## Questões em aberto

- Sair do grupo exige alguma confirmação adicional quando há recursos `GROUP` vinculados ao usuário?
