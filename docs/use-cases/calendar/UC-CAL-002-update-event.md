# UC-CAL-002 — Atualizar compromisso

## Objetivo

Permitir editar os dados de um compromisso existente (ex.: título, data, horário, local).

## Ator

- Ator principal: proprietário do compromisso (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP`).

## Pré-condições

- Compromisso existe.
- Ator possui acesso de edição, conforme a visibilidade do compromisso.

## Gatilho

Ator decide alterar dados de um compromisso.

## Fluxo principal

1. Ator seleciona o compromisso.
2. Ator atualiza os dados desejados (ex.: título, data, horário, local).
3. Sistema salva as alterações.

## Variações

- Alterar participantes do compromisso: tratado por `UC-CAL-004`, não por este caso de uso.
- Alterar a visibilidade do compromisso: tratado por `UC-PERM-004`, não por este caso de uso.
- Compromisso já ocorreu (data no passado): pode ser editado normalmente, sem bloqueio.

## Regras de negócio

- Atualizar um compromisso não altera seu `owner` nem `createdBy`.
- Para compromissos `SHARED`, tanto o proprietário quanto as pessoas em `sharedWith` podem editar, conforme `permissions.md`.
- Para compromissos `GROUP`, qualquer membro do grupo pode editar, independentemente de seu papel (`OWNER` ou `MEMBER`) — mesma regra adotada para tarefas (`UC-TASK-002`).
- Editar um compromisso com data no passado é permitido; não há bloqueio por esse motivo.

## Visibilidade

Este caso de uso não altera a visibilidade do compromisso.

## Relações com outros módulos

Relaciona-se com `UC-PERM-004` (mudança de visibilidade) e `UC-CAL-004` (participantes), que são casos de uso distintos.

## Critérios de aceite

- Alterações ficam visíveis para todas as pessoas com acesso ao compromisso.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
