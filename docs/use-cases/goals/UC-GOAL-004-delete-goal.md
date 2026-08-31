# UC-GOAL-004 — Excluir objetivo

## Objetivo

Permitir remover um objetivo que não é mais necessário.

## Ator

- Ator principal: proprietário do objetivo (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Objetivo existe.
- Ator possui permissão para excluir o objetivo, conforme sua visibilidade.

## Gatilho

Ator decide excluir um objetivo.

## Fluxo principal

1. Ator seleciona o objetivo a ser excluído.
2. Ator confirma a exclusão.
3. Sistema move o objetivo para a lixeira, onde permanece por 30 dias antes de ser apagado definitivamente, conforme `docs/product/decisions/PD-005-deletion-policy.md`.

## Variações

- Ator restaura um objetivo que está na lixeira, dentro do período de 30 dias: objetivo volta a ser um objetivo ativo normal, com seus dados e relações preservados.

## Regras de negócio

- Excluir um objetivo `GROUP` não afeta a existência do grupo nem de outros objetivos.
- Excluir um objetivo segue a política padrão de exclusão do Lema (`PD-005-deletion-policy.md`): lixeira por 30 dias, com restauração possível nesse período.
- Excluir um objetivo não exclui os recursos relacionados a ele (Tasks, Events, Documents etc.), apenas encerra as relações com eles (ver `UC-GOAL-007` quanto a essa questão).
- Se o objetivo for uma submeta, suas `GoalAllocations` (`RESERVED`/`COMMITTED`/`PAID`) acompanham o mesmo ciclo de vida da submeta — vão para a lixeira junto com ela e são restauradas junto, se aplicável. `Transactions` já registradas (que sustentam alocações `PAID`) não são excluídas; apenas deixam de estar relacionadas enquanto a submeta estiver na lixeira (ver `docs/product/decisions/PD-007-goal-lightweight-hub.md`).
- Excluir um objetivo "pai" não exclui suas submetas automaticamente — elas permanecem como objetivos independentes, sem mais um pai associado, consistente com o padrão do sistema de não propagar exclusão a recursos relacionados.

## Visibilidade

A exclusão remove o objetivo da lista de objetivos ativos para todas as pessoas que tinham acesso a ele, independentemente de sua visibilidade, ainda que o registro permaneça na lixeira por 30 dias.

## Relações com outros módulos

Relaciona-se com `UC-GOAL-007` quanto ao destino das relações com outros recursos após a exclusão.

## Critérios de aceite

- Objetivo excluído deixa de aparecer na lista de objetivos ativos para qualquer pessoa que tinha acesso a ele.
- Objetivo excluído permanece na lixeira por 30 dias, podendo ser restaurado nesse período.
- Após 30 dias, o objetivo é apagado definitivamente e não pode mais ser restaurado.
- Se o objetivo excluído for uma submeta, suas `GoalAllocations` acompanham o mesmo ciclo de lixeira/restauração.
- Excluir um objetivo pai não afeta a existência de suas submetas.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
