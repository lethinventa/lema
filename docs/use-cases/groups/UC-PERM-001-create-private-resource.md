# UC-PERM-001 — Criar recurso privado

## Objetivo

Permitir que um usuário crie um recurso (tarefa, despesa, objetivo etc.) visível apenas para si, independentemente de participar de um ou mais grupos.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa.

## Gatilho

Usuário cria um novo recurso sem compartilhá-lo com ninguém.

## Fluxo principal

1. Usuário cria um recurso (ex.: Task, Transaction, Goal).
2. Sistema define a visibilidade do recurso como `PRIVATE`.
3. Recurso passa a ser visível apenas para o proprietário.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Todo recurso criado deve ter um proprietário definido.
- Em um recurso `PRIVATE`, o proprietário é sempre um `User` (`owner = User`), nunca um `Group`.
- Participar de um grupo não torna recursos pessoais visíveis automaticamente para esse grupo.
- Um recurso `PRIVATE` só pode ser visualizado, editado ou removido pelo próprio proprietário.

## Visibilidade

`PRIVATE` — visível apenas para o proprietário, conforme `permissions.md`.

## Relações com outros módulos

Aplica-se a qualquer entidade compartilhável do domínio (Task, Transaction, Goal, Event, List etc.), conforme `domain-model.md`.

## Critérios de aceite

- Recurso criado como `PRIVATE` não é visível para nenhum outro usuário, mesmo que sejam membros do mesmo grupo do proprietário.
- Proprietário consegue visualizar, editar e remover o recurso normalmente.

## Questões em aberto

- A visibilidade padrão de um novo recurso deve ser sempre `PRIVATE`, ou isso pode variar conforme o tipo de recurso ou o contexto em que foi criado?
