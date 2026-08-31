# PD-005 — Política padrão de exclusão (lixeira)

## Status

Aceito

## Contexto

A exclusão de tarefas (`UC-TASK-004`) foi definida com um modelo de lixeira: o recurso excluído fica retido por 30 dias, podendo ser restaurado nesse período, antes de ser apagado definitivamente. A mesma regra foi estendida a compromissos (`UC-CAL-003`). Sem uma decisão consolidada, cada novo domínio precisaria reabrir a mesma pergunta.

## Decisão

Por padrão, todo recurso excluível do Lema (tarefas, compromissos, objetivos, e demais domínios futuros) segue o mesmo modelo:

- ao ser excluído, o recurso é movido para uma lixeira;
- pode ser restaurado a qualquer momento dentro de 30 dias;
- após 30 dias, a exclusão torna-se definitiva e automática, sem possibilidade de restauração.

## Motivo

Um comportamento de exclusão previsível e consistente entre domínios reduz a chance de perda acidental de dados e evita que o usuário precise aprender uma regra diferente para cada tipo de conteúdo.

## Consequências

Novos casos de uso de exclusão em outros domínios podem aplicar esta regra diretamente, referenciando este documento, em vez de reabrir a mesma questão.

## Questões futuras

Se um tipo específico de recurso precisar de uma regra diferente (ex.: exclusão definitiva imediata por motivos legais ou financeiros), isso deve ser registrado como uma exceção em um PD específico para esse domínio.
