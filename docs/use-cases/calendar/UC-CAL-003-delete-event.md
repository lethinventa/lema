# UC-CAL-003 — Excluir compromisso

## Objetivo

Permitir remover um compromisso que não é mais necessário.

## Ator

- Ator principal: proprietário do compromisso (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP`).

## Pré-condições

- Compromisso existe.
- Ator possui permissão para excluir o compromisso, conforme sua visibilidade.

## Gatilho

Ator decide excluir um compromisso.

## Fluxo principal

1. Ator seleciona o compromisso a ser excluído.
2. Se o compromisso for recorrente, sistema pergunta se a exclusão deve afetar apenas a ocorrência atual ou toda a série.
3. Ator confirma a exclusão.
4. Sistema move o compromisso para a lixeira, onde permanece por 30 dias antes de ser apagado definitivamente.

## Variações

- Compromisso é recorrente: ao excluir, o sistema pergunta se a exclusão deve afetar apenas a ocorrência atual ou toda a série (ver `UC-CAL-007`).
- Ator restaura um compromisso que está na lixeira, dentro do período de 30 dias: compromisso volta a ser um compromisso ativo normal, com seus dados preservados.

## Regras de negócio

- Excluir um compromisso `GROUP` não afeta a existência do grupo nem de outros compromissos.
- Excluir um compromisso move-o para uma lixeira; ele não é apagado definitivamente de imediato — mesmo modelo adotado para tarefas (`UC-TASK-004`).
- Um compromisso na lixeira pode ser restaurado a qualquer momento dentro do período de 30 dias.
- Após 30 dias na lixeira, a exclusão passa a ser definitiva e automática.
- Qualquer membro do grupo pode excluir um compromisso `GROUP`, independentemente de seu papel.
- Excluir um compromisso recorrente exige que o ator escolha entre excluir apenas a ocorrência atual ou toda a série (ver `UC-CAL-007`).

## Visibilidade

A exclusão remove o compromisso da lista de compromissos ativos para todas as pessoas que tinham acesso a ele, independentemente de sua visibilidade, ainda que o registro permaneça na lixeira por 30 dias.

## Relações com outros módulos

Relaciona-se com `UC-CAL-007` (compromissos recorrentes) quanto ao escopo da exclusão (ocorrência vs. série).

## Critérios de aceite

- Compromisso excluído deixa de aparecer na lista de compromissos ativos para qualquer pessoa que tinha acesso a ele.
- Compromisso excluído permanece na lixeira por 30 dias, podendo ser restaurado nesse período.
- Após 30 dias, o compromisso é apagado definitivamente e não pode mais ser restaurado.
- Excluir um compromisso recorrente pergunta ao ator se a ação deve afetar apenas a ocorrência atual ou toda a série.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
