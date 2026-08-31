# UC-GROUP-002 — Convidar membro

## Objetivo

Permitir que um membro autorizado convide uma nova pessoa para participar de um grupo.

## Ator

- Ator principal: qualquer `MEMBER` ou `OWNER` do grupo (ver `docs/product/decisions/PD-001-group-roles.md`).
- Ator secundário: pessoa convidada.

## Pré-condições

- Grupo já existe.
- Ator principal é membro ativo do grupo.

## Gatilho

Membro solicita o convite de uma pessoa para o grupo.

## Fluxo principal

1. Membro informa a pessoa a ser convidada.
2. Sistema registra um convite (`Invitation`) com estado `PENDING`, associado ao grupo e à pessoa convidada.
3. Sistema gera um link de convite compartilhável, que o membro pode enviar por qualquer canal de sua escolha (WhatsApp, e-mail, SMS, etc.) — o Lema não depende de um canal de envio próprio para o convite funcionar.
4. Se a pessoa convidada já possui conta ativa no Lema, também recebe uma notificação in-app do convite pendente.

## Variações

- Pessoa convidada ainda não possui conta no Lema (hipótese; o fluxo de cadastro não é detalhado neste caso de uso).
- Membro que enviou o convite o cancela enquanto ainda está `PENDING`: convite passa para o estado `CANCELLED`.

## Regras de negócio

- Um convite em estado `PENDING` não concede acesso ao grupo até ser aceito.
- Uma pessoa não pode ter dois convites `PENDING` simultâneos para o mesmo grupo.
- O convite é feito através de um link compartilhável; o envio em si acontece por qualquer canal externo ao Lema (e-mail, WhatsApp, SMS, etc.), a critério de quem convida.
- Os estados possíveis de um convite são: `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`, `CANCELLED`.
- Qualquer `MEMBER` (não apenas `OWNER`) pode convidar novos membros, conforme `docs/product/decisions/PD-001-group-roles.md`.

## Visibilidade

Não aplicável diretamente — o convite antecede qualquer acesso a conteúdo `GROUP`.

## Relações com outros módulos

Relaciona-se com `UC-GROUP-003` (Aceitar convite) e `UC-GROUP-006` (Visualizar membros).

## Critérios de aceite

- Um convite pendente é registrado para a pessoa e o grupo.
- A pessoa convidada não obtém acesso a conteúdo do grupo antes de aceitar o convite.

## Questões em aberto

- Qual o prazo padrão até um convite `PENDING` se tornar `EXPIRED`?
- Qual a estratégia de reenvio de um convite?
- Qual o comportamento de notificações associado a cada estado do convite?
