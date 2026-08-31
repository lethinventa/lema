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

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Sair do grupo não apaga recursos `PRIVATE` do usuário.
- Sair do grupo não apaga automaticamente recursos `GROUP` relacionados a ele (mesma questão de `UC-GROUP-004`).

## Visibilidade

Usuário deixa de ter acesso a qualquer recurso `GROUP` daquele grupo.

## Relações com outros módulos

Semelhante a `UC-GROUP-004`, mas iniciado pelo próprio membro em vez de por outro membro autorizado.

## Critérios de aceite

- Usuário deixa de constar como membro ativo do grupo.
- Usuário não consegue mais visualizar conteúdo `GROUP` do grupo após sair.

## Questões em aberto

- Um `OWNER` pode sair de um grupo se for o único `OWNER`? O que acontece com o grupo nesse caso?
- Sair do grupo exige alguma confirmação adicional quando há recursos `GROUP` vinculados ao usuário?
