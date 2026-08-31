# UC-PERM-003 — Criar recurso de grupo

## Objetivo

Permitir que um recurso seja criado como parte do contexto compartilhado de um grupo, visível a seus membros autorizados.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`).

## Pré-condições

- Usuário é membro ativo de um grupo.

## Gatilho

Usuário cria um recurso associado ao contexto do grupo, em vez de ao seu espaço pessoal.

## Fluxo principal

1. Membro cria um recurso e define seu contexto como o grupo, em vez de pessoal.
2. Sistema define a visibilidade do recurso como `GROUP`, associado a esse grupo.
3. Recurso passa a ser visível para os membros autorizados do grupo.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Um recurso `GROUP` pertence ao grupo (`owner = Group`), não ao usuário que o criou. O usuário criador é registrado apenas como autor (`createdBy = User`).
- Qualquer `MEMBER` do grupo pode criar recursos `GROUP` nesse grupo — não há restrição por papel neste momento.
- A criação de um recurso `GROUP` é uma decisão explícita do usuário; nenhum recurso se torna `GROUP` automaticamente apenas por ter sido criado por um membro do grupo.
- Apenas membros ativos do grupo podem visualizar um recurso `GROUP` daquele grupo.
- O recurso `GROUP` permanece pertencendo ao grupo mesmo que a pessoa registrada em `createdBy` saia do grupo ou seja removida (ver `UC-GROUP-004`, `UC-GROUP-005` e `docs/product/decisions/PD-002-resource-ownership.md`).

## Visibilidade

`GROUP` — visível para membros autorizados do grupo, conforme `permissions.md`. Propriedade: `owner = Group`, `createdBy = User`.

## Relações com outros módulos

Aplica-se a Tasks, Events, Lists, Transactions e outras entidades que fizerem sentido no contexto de um grupo (ex.: conta da casa, lista de compras, calendário compartilhado), conforme `domain-model.md`.

## Critérios de aceite

- Recurso criado como `GROUP` é visível para os membros do grupo associado.
- Recurso `GROUP` não é visível para usuários que não são membros do grupo.
- Recurso registra corretamente `owner = Group` e `createdBy = User`.

## Questões em aberto

- Caso no futuro exista necessidade de limitar determinados tipos de conteúdo `GROUP` por papel, como isso deveria funcionar.
