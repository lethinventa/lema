# UC-TODAY-002 — Filtrar Home por contexto

## Objetivo

Permitir que um usuário visualize a Home restrita a um contexto específico — Tudo, Pessoal, Família (um grupo específico), ou Compartilhado com pessoas específicas — conforme os contextos definidos em `docs/product/vision.md`.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário está autenticado e acessando a Home (ver `UC-TODAY-001`).

## Gatilho

Usuário decide restringir a Home a um contexto específico, em vez da visão agregada padrão.

## Fluxo principal

1. Usuário seleciona um contexto: Tudo, Pessoal, um grupo específico, ou Compartilhado com pessoas específicas.
2. Sistema filtra os itens exibidos na Home para mostrar apenas os que pertencem àquele contexto.

## Variações

- Usuário sem nenhum grupo: contextos "Família" não se aplicam, apenas "Tudo" e "Pessoal" coincidem.
- Usuário com múltiplos grupos: pode escolher visualizar um grupo específico por vez (mesmo padrão de escolha já registrado como questão em `UC-FIN-008` para a visão financeira consolidada).

## Regras de negócio

- Filtrar por contexto não altera a visibilidade nem a propriedade de nenhum recurso — é apenas uma forma de visualização, mesmo princípio de `UC-FIN-008`.
- O contexto "Pessoal" mostra apenas recursos `PRIVATE` do próprio usuário. O contexto de um grupo específico mostra os recursos `GROUP` daquele grupo aos quais o usuário tem acesso. "Compartilhado" mostra recursos `SHARED` que envolvem o usuário.

## Visibilidade

Este caso de uso não introduz uma visibilidade nova — apenas filtra a agregação já definida em `UC-TODAY-001` conforme as regras de visibilidade existentes.

## Relações com outros módulos

Depende de `UC-TODAY-001`. Usa o mesmo conceito de contextos já aplicado em `UC-FIN-008` (visão consolidada de finanças).

## Critérios de aceite

- Usuário consegue alternar entre os contextos definidos em `vision.md`.
- Cada contexto exibe apenas os itens que pertencem a ele.

## Questões em aberto

- Como a Home se comporta quando o usuário pertence a mais de um grupo — os contextos de grupo aparecem lado a lado, ou o usuário escolhe um por vez? (mesma questão já registrada em `UC-FIN-008`, aplicada aqui de forma mais ampla)
