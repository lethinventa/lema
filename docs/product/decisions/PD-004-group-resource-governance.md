# PD-004 — Governança de recursos GROUP entre domínios

## Status

Aceito

## Contexto

`PD-001` definiu os papéis de grupo (`OWNER`/`MEMBER`) e as regras de gestão de membros, mas não definiu quem pode editar, concluir ou excluir os recursos que pertencem a um grupo (Tasks, Events, e futuramente outros). Essa lacuna foi preenchida separadamente para tarefas (`UC-TASK-002`, `UC-TASK-003`, `UC-TASK-004`) e compromissos (`UC-CAL-002`, `UC-CAL-003`), e ambos os domínios chegaram à mesma resposta.

## Decisão

Qualquer membro de um grupo — independentemente de seu papel (`OWNER` ou `MEMBER`) — pode editar, concluir (quando o recurso tiver esse conceito) ou excluir um recurso `GROUP` pertencente a esse grupo.

Esta é a regra padrão para qualquer domínio de recurso `GROUP` do Lema (tarefas, compromissos, objetivos, e futuramente outros, como finanças ou listas), a menos que uma decisão específica do domínio a substitua explicitamente.

## Motivo

Um recurso `GROUP` representa conteúdo do grupo, não de um indivíduo (ver `PD-002-resource-ownership.md`). Restringir edição ou exclusão a papéis específicos contradiria a ideia de que o grupo compartilha responsabilidade sobre seu próprio conteúdo, e criaria inconsistência entre domínios sem motivo aparente.

## Consequências

Novos casos de uso sobre recursos `GROUP` em outros domínios (ex.: `UC-GOAL-*`) podem aplicar esta regra diretamente, referenciando este documento, em vez de reabrir a mesma questão em cada domínio.

## Questões futuras

Se surgir necessidade concreta de restringir essa regra para um tipo específico de recurso (ex.: apenas `OWNER` pode excluir uma conta financeira do grupo), essa exceção deve ser registrada em um PD específico para esse domínio.
