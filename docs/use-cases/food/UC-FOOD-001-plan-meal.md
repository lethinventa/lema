# UC-FOOD-001 — Planejar refeição

## Objetivo

Permitir que um usuário registre uma refeição planejada para uma data, podendo ser pessoal, compartilhada com pessoas específicas ou pertencente a um grupo.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa.
- Se a refeição for criada como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide planejar uma refeição para uma data.

## Fluxo principal

1. Usuário informa os dados da refeição: tipo (café da manhã, almoço, jantar, lanche, ou "Outro" com nome livre), data, descrição ou receita.
2. Usuário define a visibilidade da refeição — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
3. Sistema cria a refeição com `owner` e `createdBy` definidos conforme a visibilidade escolhida, e com estado inicial `PLANNED`.

## Variações

- Refeição criada sem descrição/receita detalhada: válido, apenas o tipo e a data são suficientes.
- Refeição criada já com ingredientes informados, como atalho para gerar uma lista de compras posteriormente (ver `UC-FOOD-006`).
- Refeição criada como recorrente: ver `UC-FOOD-008`.
- Tipo "Outro": usuário informa um nome livre para o tipo de refeição, fora da lista base.

## Regras de negócio

- Toda refeição possui um `owner` (`User` para `PRIVATE`/`SHARED`, `Group` para `GROUP`) e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- O tipo de refeição segue uma lista base (café da manhã, almoço, jantar, lanche) mais uma opção personalizada ("Outro"), sem restringir o usuário a apenas essas quatro categorias.
- Toda refeição nasce no estado `PLANNED`; mudanças de estado são tratadas por `UC-FOOD-007`.
- Uma refeição não possui estado de conclusão como uma tarefa — seu ciclo de vida é apenas `PLANNED` → `DONE` ou `CANCELLED` (ver `UC-FOOD-007`).
- Criar uma refeição `GROUP` exige que o usuário seja membro ativo do grupo no momento da criação.

## Visibilidade

Uma refeição pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`, `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Este caso de uso não redefine essas regras.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` para a mecânica de visibilidade. Relaciona-se com `UC-FOOD-006` (gerar lista de compras a partir dos ingredientes), `UC-FOOD-007` (mudança de estado) e `UC-FOOD-008` (recorrência).

## Critérios de aceite

- Refeição criada é visível para quem tem acesso, conforme sua visibilidade.
- Refeição possui um tipo e uma data associados.
- Refeição é criada no estado `PLANNED`.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
