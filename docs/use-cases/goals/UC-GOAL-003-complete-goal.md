# UC-GOAL-003 — Concluir objetivo

## Objetivo

Permitir marcar um objetivo como alcançado.

## Ator

- Ator principal: proprietário do objetivo (`PRIVATE`/`SHARED`); em objetivos `GROUP`, ver Questões em aberto.

## Pré-condições

- Objetivo existe e ainda não está concluído.

## Gatilho

Ator marca o objetivo como alcançado.

## Fluxo principal

1. Ator seleciona o objetivo e o marca como concluído.
2. Sistema registra a conclusão, incluindo quem concluiu e quando.
3. Objetivo passa a ser exibido como concluído.

## Variações

- Ator tenta reabrir um objetivo já concluído (ver Questões em aberto).

## Regras de negócio

- A conclusão de um objetivo é sempre uma ação manual e explícita — não é inferida automaticamente a partir da conclusão de recursos relacionados (ver `UC-GOAL-007` e Questões em aberto).
- Concluir um objetivo não exclui nem altera os recursos relacionados a ele (Tasks, Events, Documents etc.).
- Concluir um objetivo não altera seu `owner` nem `createdBy`.

## Visibilidade

Concluir um objetivo não altera sua visibilidade nem sua propriedade.

## Relações com outros módulos

Relaciona-se com `UC-GOAL-007`, quanto à pergunta em aberto sobre inferência automática de conclusão a partir de recursos relacionados.

## Critérios de aceite

- Objetivo concluído registra quem o concluiu e a data/hora da conclusão.

## Questões em aberto

- Quem pode marcar um objetivo `SHARED` ou `GROUP` como concluído — qualquer pessoa com acesso, ou apenas o proprietário (ou, em `GROUP`, qualquer membro, conforme `PD-004-group-resource-governance.md`)? Declarar um objetivo como "alcançado" é um julgamento mais subjetivo do que concluir uma tarefa, então essa extensão não foi assumida automaticamente.
- É possível reabrir um objetivo concluído?
- A conclusão de um objetivo deveria poder ser sugerida ou inferida a partir da conclusão dos recursos relacionados a ele (ex.: todas as tarefas vinculadas concluídas), ou é sempre uma ação manual e independente?
- Um objetivo possui progresso intermediário antes da conclusão (ver `UC-GOAL-001`)?
