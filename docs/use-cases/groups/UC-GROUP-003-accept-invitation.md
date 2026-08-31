# UC-GROUP-003 — Aceitar convite

## Objetivo

Permitir que uma pessoa convidada decida ingressar ou não em um grupo.

## Ator

- Ator principal: pessoa convidada.

## Pré-condições

- Existe um convite (`Invitation`) em estado `PENDING` para essa pessoa nesse grupo.

## Gatilho

Pessoa convidada responde ao convite.

## Fluxo principal

1. Pessoa convidada visualiza o convite `PENDING`.
2. Pessoa aceita o convite.
3. Sistema associa a pessoa ao grupo com papel `MEMBER` (cria a `Membership`).
4. Convite passa para o estado `ACCEPTED`.

## Variações

- Pessoa convidada recusa o convite: convite passa para o estado `DECLINED`, e ela não é associada ao grupo.
- Convite já está em estado `EXPIRED` ou `CANCELLED`: não pode mais ser aceito nem recusado.
- Pessoa convidada ainda não tinha conta no Lema: a aceitação acontece automaticamente ao concluir o cadastro pelo link do convite (ver `UC-AUTH-001`), sem uma etapa 1–2 separada de visualizar e confirmar o convite.

## Regras de negócio

- Apenas a pessoa convidada pode aceitar ou recusar o próprio convite.
- Aceitar um convite não concede automaticamente acesso a conteúdo `PRIVATE` de outros membros.
- Ao aceitar, a pessoa passa a visualizar conteúdo `GROUP` daquele grupo, conforme as regras de visibilidade.
- Um convite só pode transitar para `ACCEPTED` ou `DECLINED` a partir do estado `PENDING`.

## Visibilidade

Após aceitar, a pessoa passa a integrar o conjunto de membros que podem visualizar recursos com visibilidade `GROUP` naquele grupo.

## Relações com outros módulos

É consequência direta de `UC-GROUP-002`. Habilita acesso a Tasks, Events, Lists e outros recursos com visibilidade `GROUP` (ver `UC-PERM-003`).

## Critérios de aceite

- Convite aceito (`ACCEPTED`) resulta em associação ativa da pessoa ao grupo, com papel `MEMBER`.
- Convite recusado (`DECLINED`) não gera associação da pessoa ao grupo.
- Convite `EXPIRED` ou `CANCELLED` não pode ser aceito nem recusado.

## Questões em aberto

- Um convite recusado pode ser reenviado?
- O membro que enviou o convite é notificado quando ele é recusado?
