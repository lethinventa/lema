# UC-CAL-003 — Excluir compromisso

## Objetivo

Permitir remover um compromisso que não é mais necessário.

## Ator

- Ator principal: proprietário do compromisso (`PRIVATE`/`SHARED`) ou membro do grupo (`GROUP`) — ver Questões em aberto quanto a `GROUP`.

## Pré-condições

- Compromisso existe.
- Ator possui permissão para excluir o compromisso, conforme sua visibilidade.

## Gatilho

Ator decide excluir um compromisso.

## Fluxo principal

1. Ator seleciona o compromisso a ser excluído.
2. Ator confirma a exclusão.
3. Sistema remove o compromisso.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Excluir um compromisso `GROUP` não afeta a existência do grupo nem de outros compromissos.

## Visibilidade

A exclusão remove o compromisso para todas as pessoas que tinham acesso a ele, independentemente de sua visibilidade.

## Relações com outros módulos

Nenhuma relação adicional além das já estabelecidas por `UC-CAL-001`.

## Critérios de aceite

- Compromisso excluído deixa de aparecer para qualquer pessoa que tinha acesso a ele.

## Questões em aberto

- Quem pode excluir um compromisso `GROUP` — qualquer membro, apenas quem o criou, ou apenas um `OWNER` do grupo?
- Compromissos excluídos seguem o mesmo modelo de lixeira com restauração em até 30 dias definido para tarefas (`UC-TASK-004`), ou têm regra própria, ou são excluídos definitivamente de imediato?
