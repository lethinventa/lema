# UC-FIN-008 — Visualizar visão consolidada de finanças

## Objetivo

Permitir que um usuário visualize suas finanças pessoais, as finanças de um grupo, ou uma visão consolidada de ambas, conforme os contextos descritos em `docs/product/vision.md` ("o usuário pode visualizar apenas suas finanças pessoais, apenas as finanças familiares ou uma visão consolidada quando tiver permissão").

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui transações e/ou contas com visibilidade `PRIVATE`, `SHARED` e/ou `GROUP`.

## Gatilho

Usuário acessa a área de Finanças e escolhe um contexto de visualização.

## Fluxo principal

1. Usuário seleciona o contexto desejado: Tudo, Pessoal, um grupo específico, ou Compartilhado com pessoas específicas — conforme os contextos definidos em `vision.md`.
2. Sistema retorna as transações e contas visíveis para aquele contexto, respeitando a visibilidade de cada recurso.
3. Quando o contexto for "Tudo" (visão consolidada), o sistema agrega as transações `PRIVATE` do usuário com as `SHARED` e `GROUP` às quais ele tem acesso.

## Variações

- Usuário sem nenhum grupo: a visão consolidada é equivalente à visão pessoal.
- Usuário com múltiplos grupos com contexto financeiro: pode escolher visualizar um grupo específico ou uma visão agregada de todos (ver Questões em aberto).

## Regras de negócio

- A visão consolidada nunca expõe transações `PRIVATE` de outras pessoas, mesmo que estejam no mesmo grupo — apenas as `PRIVATE` do próprio usuário, além das `SHARED` e `GROUP` às quais ele tem acesso.
- Este caso de uso é apenas uma forma de visualização; não altera a visibilidade nem a propriedade de nenhuma transação ou conta.

## Visibilidade

Este caso de uso consome as regras já definidas em `permissions.md`; não introduz um novo tipo de visibilidade, apenas uma forma agregada de visualizá-las.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Relaciona-se com `UC-FIN-001` (transações) e `UC-FIN-006` (contas).

## Critérios de aceite

- Usuário consegue alternar entre visão pessoal, visão de um grupo específico e visão consolidada.
- Visão consolidada nunca exibe conteúdo `PRIVATE` de outra pessoa.

## Questões em aberto

- Como a visão consolidada deve se comportar quando o usuário pertence a mais de um grupo com contexto financeiro (ex.: família e uma república)? Agrega todos, ou exige escolher um grupo por vez?
- A visão consolidada faz algum tipo de conversão ou soma entre contas de naturezas diferentes (ex.: conta corrente e cartão de crédito), ou apenas lista os valores lado a lado?
