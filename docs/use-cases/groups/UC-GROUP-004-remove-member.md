# UC-GROUP-004 — Remover membro

## Objetivo

Permitir que um membro autorizado remova outro membro do grupo.

## Ator

- Ator principal: membro com papel `OWNER`.
- Ator secundário: membro removido.

## Pré-condições

- Ambos os usuários são membros ativos do mesmo grupo.
- Ator principal possui papel `OWNER` no grupo.

## Gatilho

`OWNER` solicita a remoção de outro membro do grupo.

## Fluxo principal

1. `OWNER` seleciona o membro a ser removido.
2. Sistema encerra a associação (`Membership`) daquele usuário com o grupo.
3. Usuário removido perde acesso a conteúdo `GROUP` do grupo.

## Variações

- Membro removido é `MEMBER`: fluxo principal se aplica normalmente.
- Membro removido é `OWNER` e existe ao menos outro `OWNER` no grupo: fluxo principal se aplica normalmente.
- Membro removido é o único `OWNER` do grupo: ação é bloqueada — não é possível remover o único `OWNER` restante.

## Regras de negócio

- Apenas `OWNER` pode remover membros. `MEMBER` não pode remover ninguém.
- Um membro não pode remover a si mesmo por este caso de uso (ver `UC-GROUP-005` — Sair do grupo).
- Um `OWNER` pode remover outro `OWNER`, desde que o grupo nunca fique sem pelo menos um `OWNER`.
- Remover um membro não apaga recursos `PRIVATE` que esse membro criou.
- Remover um membro não apaga recursos `GROUP` criados por ele: esses recursos pertencem ao grupo (`owner = Group`) e continuam existindo, mantendo `createdBy` apontando para a pessoa removida (ver `docs/product/decisions/PD-002-resource-ownership.md`).

## Visibilidade

Após a remoção, o usuário perde acesso a qualquer recurso `GROUP` daquele grupo. Recursos `SHARED` que o envolvam especificamente não são afetados por este caso de uso.

## Relações com outros módulos

Relaciona-se com `UC-GROUP-006` (Visualizar membros), `UC-GROUP-008` (Gerenciar papel de membro) e com a propriedade de recursos `GROUP` criados por membros (`UC-PERM-003`).

## Critérios de aceite

- Membro removido não é mais listado como membro ativo do grupo.
- Membro removido não consegue mais visualizar conteúdo `GROUP` do grupo.
- Sistema impede a remoção do único `OWNER` restante do grupo.
- Recursos `GROUP` criados pelo membro removido continuam existindo no grupo após a remoção.

## Questões em aberto

- A interface deve indicar de alguma forma que o `createdBy` de um recurso `GROUP` não é mais membro do grupo?
