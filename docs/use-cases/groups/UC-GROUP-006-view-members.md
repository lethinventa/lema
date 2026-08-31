# UC-GROUP-006 — Visualizar membros

## Objetivo

Permitir que um membro veja quem faz parte do grupo.

## Ator

- Ator principal: membro do grupo.

## Pré-condições

- Usuário é membro ativo do grupo.

## Gatilho

Usuário acessa a lista de membros do grupo.

## Fluxo principal

1. Usuário solicita a lista de membros do grupo.
2. Sistema retorna os membros ativos do grupo e seus papéis.

## Variações

- Lista pode incluir convites pendentes, exibidos separadamente dos membros ativos (hipótese).

## Regras de negócio

- Apenas membros do grupo podem visualizar a lista de membros.
- A visualização de membros não expõe recursos `PRIVATE` de nenhum membro.

## Visibilidade

Esta visualização diz respeito à composição do grupo (quem participa), e não ao conteúdo `PRIVATE`, `SHARED` ou `GROUP` de cada membro.

## Relações com outros módulos

Serve de base para `UC-GROUP-004`, `UC-GROUP-005` e `UC-GROUP-008`.

## Critérios de aceite

- Usuário membro consegue ver a lista de membros ativos do grupo e seus papéis.
- Usuário que não é membro não consegue acessar essa lista.

## Questões em aberto

- Convites pendentes devem ser visíveis para todos os membros, ou apenas para quem tem permissão de convidar/remover?
