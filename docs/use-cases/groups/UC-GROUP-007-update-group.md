# UC-GROUP-007 — Atualizar grupo

## Objetivo

Permitir que um membro autorizado atualize informações do grupo, como o nome.

## Ator

- Ator principal: membro com permissão para editar o grupo.

## Pré-condições

- Grupo existe.
- Ator principal possui permissão para editar o grupo.

## Gatilho

Membro autorizado solicita alteração de dados do grupo.

## Fluxo principal

1. Membro autorizado informa os dados atualizados do grupo (ex.: nome).
2. Sistema atualiza os dados do grupo.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Apenas membros com permissão para editar podem atualizar o grupo (ver Questões em aberto).
- Atualizar dados do grupo não altera a visibilidade de recursos já existentes associados a ele.

## Visibilidade

Não aplicável diretamente a recursos individuais; este caso de uso afeta apenas os dados do próprio grupo.

## Relações com outros módulos

Não altera relações já estabelecidas com Tasks, Events ou outros recursos `GROUP`.

## Critérios de aceite

- Dados do grupo são atualizados e refletidos para todos os membros.
- Usuário sem permissão não consegue atualizar o grupo.

## Questões em aberto

- Quem pode editar dados do grupo — apenas `OWNER`, ou qualquer `MEMBER`?
- Quais atributos do grupo são editáveis neste estágio (apenas nome, ou também outros dados)?
