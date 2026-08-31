# UC-FOOD-006 — Gerar lista de compras a partir de uma refeição

## Objetivo

Permitir transformar os ingredientes de uma refeição planejada em uma lista de compras (`List` de `ShoppingItem`s), evitando que o usuário precise digitar os itens novamente em outro lugar — conforme o princípio 3 de `principles.md` ("Compartilhar não deve significar duplicar informação") aplicado, por analogia, à relação entre módulos.

## Ator

- Ator principal: proprietário da refeição (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Refeição existe e possui ao menos um ingrediente informado (ver `UC-FOOD-001`).

## Gatilho

Ator decide gerar uma lista de compras a partir dos ingredientes de uma refeição planejada.

## Fluxo principal

1. Ator seleciona a refeição.
2. Ator confirma quais ingredientes devem virar itens de compra (pode ser todos, por padrão).
3. Sistema cria uma `List` (ou adiciona a uma já existente, ver Variações) com um `ShoppingItem` para cada ingrediente confirmado.
4. Lista criada herda a visibilidade da refeição que a originou.

## Variações

- Ator escolhe adicionar os itens a uma lista de compras já existente, em vez de criar uma nova (ver Questões em aberto quanto a essa mecânica).
- Refeição relacionada a mais de uma lista de compras ao longo do tempo (ex.: gerar de novo depois de editar os ingredientes): cada geração cria itens novos, não substitui os anteriores (ver `UC-FOOD-002`).
- Ingrediente já existe como item em uma lista de compras ativa: sistema não consolida automaticamente as quantidades (ver Questões em aberto).

## Regras de negócio

- Gerar uma lista de compras não altera a refeição de origem.
- A lista gerada é um recurso independente (`List`) — excluir a refeição de origem não afeta a lista já gerada (ver `UC-FOOD-003`).
- A lista gerada herda a visibilidade da refeição no momento da geração; alterações posteriores na visibilidade de uma não afetam a outra (mesma independência já aplicada entre `Goal` e seus recursos relacionados, ver `UC-GOAL-007`).

## Visibilidade

A lista de compras gerada nasce com a mesma visibilidade da refeição de origem (`PRIVATE`, `SHARED` ou `GROUP`), podendo ser alterada depois de forma independente, como qualquer outro recurso (ver `UC-PERM-004`).

## Relações com outros módulos

Relaciona-se com `UC-FOOD-001` (refeição e seus ingredientes) e materializa a relação `Meal → ShoppingItems` descrita em `domain-model.md`. O detalhamento completo de `List` e `ShoppingItem` (criar lista do zero, marcar item como comprado, remover item) fica para quando o domínio de listas de compras for tratado especificamente.

## Critérios de aceite

- Cada ingrediente confirmado vira um `ShoppingItem` na lista gerada.
- A lista gerada é visível a quem tem acesso, conforme a visibilidade herdada da refeição.
- Excluir a refeição de origem não exclui a lista já gerada.

## Questões em aberto

- É possível adicionar os itens gerados a uma lista de compras já existente, em vez de sempre criar uma nova? Como o sistema evita duplicar itens já presentes nela?
- Gerar a lista uma segunda vez, depois de editar os ingredientes da refeição, cria itens duplicados, substitui os anteriores, ou pergunta ao usuário o que fazer?
- Um `ShoppingItem` marcado como comprado deveria refletir, de alguma forma, na refeição de origem, ou as duas permanecem sempre independentes depois da geração?
