# UC-PERM-002 — Compartilhar recurso com membros específicos

## Objetivo

Permitir que o proprietário de um recurso conceda acesso a esse recurso para pessoas específicas, sem torná-lo parte do contexto de um grupo.

## Ator

- Ator principal: proprietário do recurso.
- Ator secundário: pessoas com quem o recurso é compartilhado.

## Pré-condições

- Recurso existe e possui um proprietário.
- Pessoas a receber o compartilhamento já possuem conta no Lema.

## Gatilho

Proprietário decide dar acesso ao recurso a pessoas específicas.

## Fluxo principal

1. Proprietário seleciona o recurso.
2. Proprietário seleciona uma ou mais pessoas para compartilhar.
3. Sistema define a visibilidade do recurso como `SHARED` e registra as pessoas com acesso.

## Variações

- Proprietário compartilha com uma única pessoa (ex.: planejamento entre duas pessoas) ou com múltiplas pessoas específicas.

## Regras de negócio

- O recurso continua pertencendo ao proprietário original.
- Apenas as pessoas explicitamente listadas, além do proprietário, podem visualizar o recurso.
- Compartilhar um recurso dessa forma não o torna visível para todo um grupo.

## Visibilidade

`SHARED` — o recurso mantém um proprietário, mas pessoas específicas recebem acesso, conforme `permissions.md`. Esta ação é distinta de tornar um recurso `GROUP` (ver `UC-PERM-003`).

## Relações com outros módulos

Aplica-se a qualquer entidade compartilhável do domínio. Relaciona-se com `UC-PERM-004` (mudança de visibilidade) e `UC-PERM-005` (revogar acesso).

## Critérios de aceite

- Recurso compartilhado torna-se visível para as pessoas listadas, além do proprietário.
- Pessoas não listadas continuam sem acesso ao recurso.

## Questões em aberto

- As pessoas com quem o recurso é compartilhado podem editá-lo, ou apenas visualizá-lo?
- É necessário que as pessoas compartilhadas pertençam a um grupo em comum com o proprietário, ou o compartilhamento é sempre independente de grupo?
