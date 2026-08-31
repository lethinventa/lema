# UC-TASK-005 — Atribuir tarefa

## Objetivo

Permitir designar quem deve executar uma tarefa, distinguindo esse papel do proprietário (`owner`) e do autor (`createdBy`) do recurso.

## Ator

- Ator principal: proprietário da tarefa (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP`).
- Ator secundário: pessoa (ou pessoas) designada(s) como responsável.

## Pré-condições

- Tarefa existe.
- Pessoa a ser designada já possui acesso à tarefa (é a proprietária, está em `sharedWith`, ou é membro do grupo, conforme a visibilidade).

## Gatilho

Ator decide designar (ou alterar) quem deve executar a tarefa.

## Fluxo principal

1. Ator seleciona a tarefa.
2. Ator seleciona uma ou mais pessoas responsáveis, dentre as que já têm acesso à tarefa.
3. Sistema registra essas pessoas como responsáveis pela tarefa, de forma imediata, sem exigir aceite.
4. Cada pessoa designada é notificada de que se tornou responsável pela tarefa.

## Variações

- Tarefa sem responsável (não atribuída): estado válido, permanece assim até uma atribuição.
- Remover um responsável (desatribuir): os demais responsáveis, se houver, permanecem inalterados.
- Adicionar mais uma pessoa a uma tarefa que já tem responsável(is): acumula, não substitui.
- Reatribuir removendo todos os responsáveis anteriores e definindo outro(s) em seu lugar.

## Regras de negócio

- O responsável de uma tarefa deve ser uma pessoa que já tem acesso a ela — proprietário, pessoa em `sharedWith`, ou membro do grupo, conforme a visibilidade da tarefa.
- Atribuir um responsável não altera `owner` nem `createdBy` da tarefa. Autor, proprietário e responsável são conceitos distintos: `createdBy` é quem criou o registro, `owner` é a quem (ou a que grupo) o recurso pertence, e o responsável é quem deve executá-lo — as três posições podem recair sobre pessoas diferentes.
- Uma tarefa pode ter mais de um responsável simultaneamente.
- Atribuir um responsável é imediato e não exige aceite da pessoa designada.
- A pessoa designada é notificada quando se torna responsável por uma tarefa.
- Se uma pessoa responsável perder o acesso à tarefa (ex.: sai do grupo dono de uma tarefa `GROUP` — ver `UC-GROUP-004`/`UC-GROUP-005` — ou tem seu acesso `SHARED` revogado — ver `UC-PERM-005`), ela é removida automaticamente da lista de responsáveis.

## Visibilidade

Atribuir um responsável não altera a visibilidade da tarefa. A pessoa designada precisa já ter acesso a ela por outro motivo (ser proprietária, estar em `sharedWith`, ou ser membro do grupo).

## Relações com outros módulos

Depende de `UC-PERM-002` (quem está em `sharedWith`) e `UC-PERM-003` (quem é membro do grupo) para definir quem pode ser designado.

## Critérios de aceite

- Pessoa(s) designada(s) passam a aparecer como responsáveis pela tarefa imediatamente, sem exigir aceite.
- Cada pessoa designada é notificada.
- Apenas pessoas com acesso prévio à tarefa podem ser designadas como responsáveis.
- Uma tarefa pode ter múltiplos responsáveis simultaneamente.
- Responsável que perde o acesso à tarefa é removido automaticamente da lista de responsáveis.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
