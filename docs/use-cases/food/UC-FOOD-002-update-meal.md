# UC-FOOD-002 — Atualizar refeição planejada

## Objetivo

Permitir editar os dados de uma refeição planejada existente (ex.: data, descrição, ingredientes).

## Ator

- Ator principal: proprietário da refeição (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Refeição existe.
- Ator possui acesso de edição, conforme a visibilidade da refeição.

## Gatilho

Ator decide alterar dados de uma refeição planejada.

## Fluxo principal

1. Ator seleciona a refeição.
2. Ator atualiza os dados desejados (ex.: data, descrição, ingredientes).
3. Sistema salva as alterações.

## Variações

- Alterar a visibilidade da refeição: tratado por `UC-PERM-004`, não por este caso de uso.
- Alterar ingredientes depois de já ter gerado uma lista de compras (`UC-FOOD-006`): a lista é sincronizada automaticamente, mas apenas os `ShoppingItem`s vinculados àquela refeição — itens de outras origens na mesma lista não são afetados.
- Alterar o estado da refeição (`PLANNED`/`DONE`/`CANCELLED`): tratado por `UC-FOOD-007`, não por este caso de uso.

## Regras de negócio

- Atualizar uma refeição não altera seu `owner` nem `createdBy`.
- Para refeições `SHARED`, tanto o proprietário quanto as pessoas em `sharedWith` podem editar, conforme `permissions.md`.
- Para refeições `GROUP`, qualquer membro do grupo pode editar, independentemente de seu papel, conforme `PD-004-group-resource-governance.md`.
- Editar os ingredientes de uma refeição sincroniza automaticamente os `ShoppingItem`s que foram gerados a partir dela (ver `UC-FOOD-006`), sem tocar em itens de outras origens presentes na mesma lista.

## Visibilidade

Este caso de uso não altera a visibilidade da refeição.

## Relações com outros módulos

Relaciona-se com `UC-PERM-004` (mudança de visibilidade) e `UC-FOOD-006` (lista de compras gerada a partir dos ingredientes).

## Critérios de aceite

- Alterações ficam visíveis para todas as pessoas com acesso à refeição.
- Alterar ingredientes sincroniza os `ShoppingItem`s vinculados àquela refeição, sem afetar itens de outras origens.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
