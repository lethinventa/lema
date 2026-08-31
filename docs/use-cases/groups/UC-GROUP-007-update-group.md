# UC-GROUP-007 — Atualizar grupo

## Objetivo

Permitir que um membro autorizado atualize informações do grupo, como o nome.

## Ator

- Ator principal: membro com papel `OWNER`.

## Pré-condições

- Grupo existe.
- Ator principal possui papel `OWNER` no grupo.

## Gatilho

`OWNER` solicita alteração de dados do grupo.

## Fluxo principal

1. `OWNER` informa os dados atualizados do grupo (ex.: nome).
2. Sistema atualiza os dados do grupo.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Apenas `OWNER` pode atualizar dados estruturais do grupo. `MEMBER` não pode.
- Atualizar dados do grupo não altera a visibilidade de recursos já existentes associados a ele.

## Visibilidade

Não aplicável diretamente a recursos individuais; este caso de uso afeta apenas os dados do próprio grupo.

## Relações com outros módulos

Não altera relações já estabelecidas com Tasks, Events ou outros recursos `GROUP`.

## Critérios de aceite

- Dados do grupo são atualizados e refletidos para todos os membros.
- `MEMBER` não consegue atualizar dados estruturais do grupo.

## Questões em aberto

- Quais atributos do grupo são editáveis neste estágio (apenas nome, ou também outros dados)?
