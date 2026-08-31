# UC-GOAL-007 — Relacionar objetivo a outros recursos

## Objetivo

Permitir associar um objetivo a outros recursos do sistema (Tasks, Events, Documents e, futuramente, Transactions e Budgets), materializando o diferencial do Lema de conectar informações entre áreas diferentes, conforme a seção "Relações" de `domain-model.md` e o princípio 5 de `principles.md` ("Informações de áreas diferentes devem poder se relacionar").

## Ator

- Ator principal: proprietário do objetivo (`PRIVATE`/`SHARED`) ou qualquer membro do grupo (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Objetivo existe.
- Recurso a ser relacionado (ex.: uma `Task`, um `Event`, um `Document`) já existe.
- Ator possui acesso tanto ao objetivo quanto ao recurso a ser relacionado.

## Gatilho

Ator decide conectar um objetivo a outro recurso existente.

## Fluxo principal

1. Ator seleciona o objetivo.
2. Ator seleciona um recurso existente para relacionar.
3. Sistema registra a relação entre o objetivo e o recurso.

## Variações

- Relacionar múltiplos recursos ao mesmo objetivo: permitido, conforme os exemplos de `domain-model.md` (`Goal → Tasks, Transactions, Events, Documents`).
- Remover uma relação existente: o objetivo e o recurso continuam existindo, apenas deixam de estar conectados.
- Relacionar a um recurso de Finanças (`Transaction`, `Budget`): esses domínios ainda não têm casos de uso próprios detalhados (ver Questões em aberto).

## Regras de negócio

- Relacionar um objetivo a outro recurso não altera a visibilidade, `owner` ou `createdBy` de nenhum dos dois.
- Excluir um recurso relacionado (ex.: uma `Task`) não exclui o objetivo, apenas encerra a relação.
- Excluir o objetivo não exclui os recursos relacionados a ele (ver `UC-GOAL-004`).

## Visibilidade

A relação em si não possui visibilidade própria; cada recurso relacionado mantém sua própria visibilidade, que pode ser diferente da visibilidade do objetivo (ver Questões em aberto).

## Relações com outros módulos

Relaciona-se com `UC-TASK-*` e `UC-CAL-*` como possíveis recursos conectados a um objetivo. Ainda não se relaciona com casos de uso de Finanças ou Documentos, que não foram detalhados neste momento.

## Critérios de aceite

- É possível visualizar, a partir de um objetivo, quais recursos estão relacionados a ele.
- Remover uma relação não afeta os recursos relacionados nem o objetivo.

## Questões em aberto

- O que acontece quando um objetivo e um recurso relacionado têm visibilidades diferentes (ex.: objetivo `PRIVATE` relacionado a uma tarefa `GROUP`)? A relação é permitida mesmo assim, com cada lado mantendo sua própria visibilidade, ou o sistema deve exigir visibilidades compatíveis?
- Como essa relação deve se comportar quando os recursos de Finanças (`Transaction`, `Budget`) forem detalhados em casos de uso próprios?
- Existe um limite de quantos recursos podem ser relacionados a um único objetivo?
