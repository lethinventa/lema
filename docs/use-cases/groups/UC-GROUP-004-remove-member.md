# UC-GROUP-004 — Remover membro

## Objetivo

Permitir que um membro autorizado remova outro membro do grupo.

## Ator

- Ator principal: membro com permissão para remover membros.
- Ator secundário: membro removido.

## Pré-condições

- Ambos os usuários são membros ativos do mesmo grupo.
- Ator principal possui permissão para remover membros.

## Gatilho

Membro autorizado solicita a remoção de outro membro do grupo.

## Fluxo principal

1. Membro autorizado seleciona o membro a ser removido.
2. Sistema encerra a associação (`Membership`) daquele usuário com o grupo.
3. Usuário removido perde acesso a conteúdo `GROUP` do grupo.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Um membro não pode remover a si mesmo por este caso de uso (ver `UC-GROUP-005` — Sair do grupo).
- Remover um membro não apaga recursos `PRIVATE` que esse membro criou.
- Remover um membro não apaga automaticamente recursos `GROUP` relacionados a ele (ver Questões em aberto).

## Visibilidade

Após a remoção, o usuário perde acesso a qualquer recurso `GROUP` daquele grupo. Recursos `SHARED` que o envolvam especificamente não são afetados por este caso de uso.

## Relações com outros módulos

Relaciona-se com `UC-GROUP-006` (Visualizar membros) e com a propriedade de recursos `GROUP` criados por membros.

## Critérios de aceite

- Membro removido não é mais listado como membro ativo do grupo.
- Membro removido não consegue mais visualizar conteúdo `GROUP` do grupo.

## Questões em aberto

- Quem pode remover membros — apenas `OWNER`, ou qualquer `MEMBER` pode remover outros?
- Um `OWNER` pode ser removido por outro `OWNER`?
- O que acontece com recursos `GROUP` criados por um membro removido — permanecem no grupo, são transferidos, ou são removidos?
