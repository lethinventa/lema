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

- O recurso continua pertencendo ao proprietário original (`owner = User`), que passa a ter uma lista explícita de pessoas com acesso (`sharedWith = User[]`).
- Apenas as pessoas explicitamente listadas em `sharedWith`, além do proprietário, podem visualizar o recurso.
- Para o MVP, uma pessoa listada em `sharedWith` pode visualizar e editar o recurso (colaborar). Uma granularidade de acesso mais fina (`VIEW` / `EDIT` por pessoa) é uma evolução futura possível, não modelada agora.
- Apenas o proprietário pode alterar a visibilidade do recurso, adicionar ou remover pessoas do compartilhamento, ou mover o recurso para um grupo — mesmo que outras pessoas tenham acesso de edição ao conteúdo.
- Compartilhar um recurso dessa forma não o torna visível para todo um grupo.

## Visibilidade

`SHARED` — o recurso mantém um proprietário (`User`), mas pessoas específicas recebem acesso, conforme `permissions.md`. Esta ação é distinta de tornar um recurso `GROUP` (ver `UC-PERM-003`), onde a propriedade passa a ser do grupo.

## Relações com outros módulos

Aplica-se a qualquer entidade compartilhável do domínio. Relaciona-se com `UC-PERM-004` (mudança de visibilidade) e `UC-PERM-005` (revogar acesso).

## Critérios de aceite

- Recurso compartilhado torna-se visível para as pessoas listadas, além do proprietário.
- Pessoas não listadas continuam sem acesso ao recurso.

## Questões em aberto

- É necessário que as pessoas compartilhadas pertençam a um grupo em comum com o proprietário, ou o compartilhamento é sempre independente de grupo?
- Como e quando a granularidade `VIEW` / `EDIT` por pessoa poderá ser introduzida.
