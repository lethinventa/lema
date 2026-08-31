# UC-GROUP-003 — Aceitar convite

## Objetivo

Permitir que uma pessoa convidada decida ingressar ou não em um grupo.

## Ator

- Ator principal: pessoa convidada.

## Pré-condições

- Existe um convite pendente para essa pessoa nesse grupo.

## Gatilho

Pessoa convidada responde ao convite.

## Fluxo principal

1. Pessoa convidada visualiza o convite pendente.
2. Pessoa aceita o convite.
3. Sistema associa a pessoa ao grupo com papel `MEMBER`.
4. Convite deixa de ser pendente.

## Variações

- Pessoa convidada recusa o convite. Nesse caso, ela não é associada ao grupo e o convite é encerrado.

## Regras de negócio

- Apenas a pessoa convidada pode aceitar ou recusar o próprio convite.
- Aceitar um convite não concede automaticamente acesso a conteúdo `PRIVATE` de outros membros.
- Ao aceitar, a pessoa passa a visualizar conteúdo `GROUP` daquele grupo, conforme as regras de visibilidade.

## Visibilidade

Após aceitar, a pessoa passa a integrar o conjunto de membros que podem visualizar recursos com visibilidade `GROUP` naquele grupo.

## Relações com outros módulos

É consequência direta de `UC-GROUP-002`. Habilita acesso a Tasks, Events, Lists e outros recursos com visibilidade `GROUP` (ver `UC-PERM-003`).

## Critérios de aceite

- Convite aceito resulta em associação ativa da pessoa ao grupo, com papel `MEMBER`.
- Convite recusado não gera associação da pessoa ao grupo.

## Questões em aberto

- Um convite recusado pode ser reenviado?
- O membro que enviou o convite é notificado quando ele é recusado?
