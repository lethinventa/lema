# UC-TASK-005 — Atribuir tarefa

## Objetivo

Permitir designar quem deve executar uma tarefa, distinguindo esse papel do proprietário (`owner`) e do autor (`createdBy`) do recurso.

## Ator

- Ator principal: proprietário da tarefa (`PRIVATE`/`SHARED`) ou membro do grupo (`GROUP`), conforme a visibilidade — ver Questões em aberto quanto a `GROUP`.
- Ator secundário: pessoa designada como responsável.

## Pré-condições

- Tarefa existe.
- Pessoa a ser designada já possui acesso à tarefa (é a proprietária, está em `sharedWith`, ou é membro do grupo, conforme a visibilidade).

## Gatilho

Ator decide designar (ou alterar) quem deve executar a tarefa.

## Fluxo principal

1. Ator seleciona a tarefa.
2. Ator seleciona a pessoa responsável, dentre as que já têm acesso à tarefa.
3. Sistema registra essa pessoa como responsável pela tarefa.

## Variações

- Tarefa sem responsável (não atribuída): estado válido, permanece assim até uma atribuição.
- Remover o responsável (desatribuir): tarefa volta a não ter responsável definido.
- Reatribuir para outra pessoa: substitui o responsável anterior.

## Regras de negócio

- O responsável de uma tarefa deve ser uma pessoa que já tem acesso a ela — proprietário, pessoa em `sharedWith`, ou membro do grupo, conforme a visibilidade da tarefa.
- Atribuir um responsável não altera `owner` nem `createdBy` da tarefa. Autor, proprietário e responsável são conceitos distintos: `createdBy` é quem criou o registro, `owner` é a quem (ou a que grupo) o recurso pertence, e o responsável é quem deve executá-lo — as três posições podem recair sobre pessoas diferentes.
- Neste momento, considera-se apenas um responsável por tarefa (ver Questões em aberto quanto a múltiplos responsáveis).

## Visibilidade

Atribuir um responsável não altera a visibilidade da tarefa. A pessoa designada precisa já ter acesso a ela por outro motivo (ser proprietária, estar em `sharedWith`, ou ser membro do grupo).

## Relações com outros módulos

Depende de `UC-PERM-002` (quem está em `sharedWith`) e `UC-PERM-003` (quem é membro do grupo) para definir quem pode ser designado.

## Critérios de aceite

- Pessoa designada passa a aparecer como responsável pela tarefa.
- Apenas pessoas com acesso prévio à tarefa podem ser designadas como responsáveis.

## Questões em aberto

- Uma tarefa pode ter mais de um responsável simultaneamente?
- Atribuir uma tarefa a alguém exige que essa pessoa aceite, ou a atribuição é imediata e unilateral?
- A pessoa responsável é notificada quando uma tarefa é atribuída a ela?
- Quem pode atribuir ou reatribuir uma tarefa `GROUP` — qualquer membro, apenas quem a criou, ou apenas um `OWNER` do grupo?
- O que acontece com o responsável de uma tarefa se ele perder o acesso a ela (ex.: sai do grupo, ou tem seu acesso `SHARED` revogado)?
