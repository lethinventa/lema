# UC-PERM-003 — Criar recurso de grupo

## Objetivo

Permitir que um recurso seja criado como parte do contexto compartilhado de um grupo, visível a seus membros autorizados.

## Ator

- Ator principal: membro do grupo.

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

- Um recurso `GROUP` pertence ao contexto compartilhado do grupo, não apenas ao usuário que o criou.
- A criação de um recurso `GROUP` é uma decisão explícita do usuário; nenhum recurso se torna `GROUP` automaticamente apenas por ter sido criado por um membro do grupo.
- Apenas membros ativos do grupo podem visualizar um recurso `GROUP` daquele grupo.

## Visibilidade

`GROUP` — visível para membros autorizados do grupo, conforme `permissions.md`.

## Relações com outros módulos

Aplica-se a Tasks, Events, Lists, Transactions e outras entidades que fizerem sentido no contexto de um grupo (ex.: conta da casa, lista de compras, calendário compartilhado), conforme `domain-model.md`.

## Critérios de aceite

- Recurso criado como `GROUP` é visível para os membros do grupo associado.
- Recurso `GROUP` não é visível para usuários que não são membros do grupo.

## Questões em aberto

- Todo membro pode criar recursos `GROUP`, ou isso depende do papel (`OWNER`/`MEMBER`)?
- Quem é considerado "proprietário" de um recurso `GROUP` — o usuário que o criou, ou o grupo em si?
