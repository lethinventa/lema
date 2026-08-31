# UC-GROUP-008 — Gerenciar papel de membro

## Objetivo

Permitir que um membro autorizado altere o papel de outro membro dentro do grupo.

## Ator

- Ator principal: membro com papel `OWNER`.
- Ator secundário: membro afetado (pode ser o próprio ator principal, no caso de autorrebaixamento).

## Pré-condições

- Ambos são membros ativos do grupo (ou o ator principal age sobre si mesmo).
- Ator principal possui papel `OWNER` no grupo.

## Gatilho

`OWNER` solicita a alteração do papel de um membro (incluindo, potencialmente, a si mesmo).

## Fluxo principal

1. `OWNER` seleciona o membro e o novo papel (`MEMBER` → `OWNER` ou `OWNER` → `MEMBER`).
2. Sistema atualiza o papel do membro afetado.

## Variações

- Promoção de `MEMBER` para `OWNER`: sempre permitida.
- Rebaixamento de um `OWNER` para `MEMBER` quando existe outro `OWNER` no grupo: permitido.
- `OWNER` tenta rebaixar a si mesmo sendo o único `OWNER` do grupo: ação é bloqueada — ele deve promover outro membro a `OWNER` primeiro.
- `OWNER` tenta rebaixar outro `OWNER` que é o único restante além dele mesmo, de forma que o grupo ficaria sem `OWNER`: ação é bloqueada (situação análoga à anterior).

## Regras de negócio

- Um grupo deve manter ao menos um `OWNER` a qualquer momento.
- Apenas `OWNER` pode alterar o papel de membros, incluindo o próprio papel. `MEMBER` não pode gerenciar papéis.
- Um `OWNER` pode rebaixar outro `OWNER` (ou a si mesmo), desde que o grupo nunca fique sem pelo menos um `OWNER`.

## Visibilidade

Não aplicável diretamente — este caso de uso trata da estrutura de papéis do grupo, não da visibilidade de recursos.

## Relações com outros módulos

O papel do membro pode futuramente influenciar quais ações são permitidas sobre recursos `GROUP`, mas essa relação não está definida neste momento.

## Critérios de aceite

- Papel do membro afetado é atualizado corretamente.
- Sistema impede que a ação resulte em um grupo sem nenhum `OWNER`.
- `MEMBER` não consegue alterar papel de nenhum membro, incluindo o próprio.

## Questões em aberto

- O modelo de papéis deve permanecer apenas `OWNER`/`MEMBER`, ou existe necessidade de um papel intermediário (ex.: alguém que convida/remove membros, mas não gerencia papéis)? Registrado aqui apenas como hipótese, sem decisão tomada.
