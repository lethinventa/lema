# UC-GOAL-003 — Concluir objetivo

## Objetivo

Permitir marcar um objetivo como alcançado.

## Ator

- Ator principal: qualquer pessoa com acesso ao objetivo — proprietário, pessoa em `sharedWith`, ou, em objetivos `GROUP`, qualquer membro do grupo, independentemente do papel (`docs/product/decisions/PD-004-group-resource-governance.md`).
- Ator não-humano: o próprio sistema, quando o progresso do objetivo atinge 100% (ver Regras de negócio).

## Pré-condições

- Objetivo existe e ainda não está concluído.

## Gatilho

Ator marca o objetivo como alcançado, ou o progresso do objetivo atinge 100%.

## Fluxo principal

1. Ator seleciona o objetivo e o marca como concluído.
2. Sistema registra a conclusão, incluindo quem concluiu e quando.
3. Objetivo passa a ser exibido como concluído, de forma permanente.

## Variações

- Progresso do objetivo atinge 100% (manualmente ou por proporção de recursos relacionados concluídos): sistema marca o objetivo como concluído automaticamente, sem exigir a ação manual do fluxo principal.

## Regras de negócio

- Qualquer pessoa com acesso ao objetivo pode marcá-lo como concluído — não é uma ação exclusiva do proprietário.
- A conclusão pode ser inferida automaticamente: quando o progresso do objetivo atinge 100%, o sistema o marca como concluído.
- Quando o objetivo possui submetas, seu progresso é a média do progresso delas (ver `UC-GOAL-001` e `docs/product/decisions/PD-007-goal-lightweight-hub.md`); a conclusão automática por 100% de progresso, nesse caso, só ocorre quando todas as submetas estiverem concluídas.
- A conclusão de um objetivo é permanente — não é possível reabrir um objetivo concluído.
- Concluir um objetivo pai não conclui suas submetas automaticamente, nem o contrário força a submeta a concluir o pai antes de todas as demais também estarem concluídas.
- Concluir um objetivo não exclui nem altera os recursos relacionados a ele (Tasks, Events, Documents etc.) nem suas `GoalAllocations`.
- Concluir um objetivo não altera seu `owner` nem `createdBy`.

## Visibilidade

Concluir um objetivo não altera sua visibilidade nem sua propriedade.

## Relações com outros módulos

Relaciona-se com `UC-GOAL-007`: quando o progresso é calculado a partir de recursos relacionados (ou da média de submetas), a conclusão desses recursos/submetas pode levar o progresso do objetivo a 100% e acionar sua conclusão automática.

## Critérios de aceite

- Objetivo concluído registra quem (ou o próprio sistema, se inferida) concluiu e a data/hora da conclusão.
- Objetivo concluído automaticamente ao atingir 100% de progresso.
- Objetivo concluído não pode ser reaberto.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
