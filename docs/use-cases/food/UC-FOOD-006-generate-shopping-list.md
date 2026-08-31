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
3. Ator escolhe o destino: criar uma nova `List`, ou adicionar os itens a uma lista de compras já existente.
4. Sistema cria (ou atualiza) a lista, adicionando um `ShoppingItem` para cada ingrediente confirmado, cada um vinculado a esta refeição como origem. Ao adicionar a uma lista existente, o sistema tenta consolidar itens com o mesmo nome já presentes nela — somando quantidades — em vez de criar duplicados.
5. Se for uma lista nova, ela herda a visibilidade da refeição que a originou.

## Variações

- Ator escolhe adicionar os itens a uma lista de compras já existente: sistema consolida por nome em vez de duplicar (ver Regras de negócio quanto a limites dessa consolidação).
- Ator gera a lista novamente depois de editar os ingredientes da refeição (ver `UC-FOOD-002`): sistema sincroniza os `ShoppingItem`s já vinculados a esta refeição — atualiza os que mudaram, adiciona os novos, remove os que saíram dos ingredientes — em vez de duplicar ou criar uma lista paralela.
- Ingrediente já existe como item de outra origem na mesma lista (não gerado por esta refeição): sistema também tenta consolidar por nome, mas o item consolidado passa a ter mais de uma origem (ver Questões em aberto quanto ao que acontece se uma das origens for removida depois).

## Regras de negócio

- Gerar uma lista de compras não altera a refeição de origem.
- A lista gerada (ou usada como destino) é um recurso independente (`List`) — excluir a refeição de origem não afeta a lista já gerada (ver `UC-FOOD-003`).
- Uma nova lista herda a visibilidade da refeição no momento da geração; alterações posteriores na visibilidade de uma não afetam a outra (mesma independência já aplicada entre `Goal` e seus recursos relacionados, ver `UC-GOAL-007`).
- Regenerar a lista a partir da mesma refeição nunca duplica itens: sincroniza os `ShoppingItem`s já vinculados a essa refeição como origem.
- Marcar um `ShoppingItem` como comprado nunca altera a refeição de origem — refeição gera necessidade de compra, mas compra não controla a refeição (ver `domain-model.md`).

## Visibilidade

A lista de compras gerada nasce com a mesma visibilidade da refeição de origem (`PRIVATE`, `SHARED` ou `GROUP`), podendo ser alterada depois de forma independente, como qualquer outro recurso (ver `UC-PERM-004`).

## Relações com outros módulos

Relaciona-se com `UC-FOOD-001` (refeição e seus ingredientes) e materializa a relação `Meal → ShoppingItems` descrita em `domain-model.md`. O detalhamento completo de `List` e `ShoppingItem` (criar lista do zero, marcar item como comprado, remover item) fica para quando o domínio de listas de compras for tratado especificamente.

## Critérios de aceite

- Cada ingrediente confirmado vira um `ShoppingItem` na lista de destino (nova ou existente), vinculado a esta refeição como origem.
- Itens com o mesmo nome já presentes na lista de destino são consolidados (quantidade somada), em vez de duplicados.
- Regenerar a lista a partir da mesma refeição sincroniza os itens já vinculados a ela, sem criar duplicados.
- A lista gerada é visível a quem tem acesso, conforme a visibilidade herdada (quando nova).
- Excluir a refeição de origem não exclui a lista já gerada.
- Marcar um `ShoppingItem` como comprado não altera o estado nem qualquer outro dado da refeição de origem.

## Questões em aberto

- Quando um ingrediente é removido da refeição e o `ShoppingItem` vinculado a ele já foi marcado como comprado, a sincronização remove esse item mesmo assim, ou o preserva por já ter sido comprado?
- Um item consolidado entre duas origens diferentes (ex.: ingrediente de duas refeições distintas) — o que acontece com ele quando uma das refeições de origem deixa de precisar desse ingrediente? A quantidade é recalculada, ou o item permanece com o valor consolidado?
- Como o sistema decide que dois itens são "o mesmo" para fins de consolidação — nome exato, ou alguma normalização (maiúsculas/minúsculas, singular/plural, unidade)?
