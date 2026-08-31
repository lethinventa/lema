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

1. Usuário informa os dados da refeição (ex.: tipo — café da manhã, almoço, jantar, lanche —, data, descrição ou receita).
2. Usuário define a visibilidade da refeição — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
3. Sistema cria a refeição com `owner` e `createdBy` definidos conforme a visibilidade escolhida.

## Variações

- Refeição criada sem descrição/receita detalhada: válido, apenas o tipo e a data são suficientes.
- Refeição criada já com ingredientes informados, como atalho para gerar uma lista de compras posteriormente (ver `UC-FOOD-006`).

## Regras de negócio

- Toda refeição possui um `owner` (`User` para `PRIVATE`/`SHARED`, `Group` para `GROUP`) e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Criar uma refeição `GROUP` exige que o usuário seja membro ativo do grupo no momento da criação.

## Visibilidade

Uma refeição pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`, `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Este caso de uso não redefine essas regras.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` para a mecânica de visibilidade. Relaciona-se com `UC-FOOD-006` (gerar lista de compras a partir dos ingredientes).

## Critérios de aceite

- Refeição criada é visível para quem tem acesso, conforme sua visibilidade.
- Refeição possui um tipo e uma data associados.

## Questões em aberto

- Uma refeição possui estado de conclusão (ex.: "preparada"/"feita"), como uma tarefa, ou apenas ocorre (ou não) na data planejada, como um compromisso (ver `UC-CAL-001`)?
- Refeições planejadas devem suportar recorrência (ex.: "toda segunda: macarrão"), como tarefas e compromissos já suportam? `domain-model.md` ainda não lista esse atributo para `Meal`.
- Existe uma lista fixa de tipos de refeição, ou é texto livre?
