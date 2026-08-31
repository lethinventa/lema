# UC-CAL-004 — Convidar participante para compromisso

## Objetivo

Permitir designar quem deve participar de um compromisso, distinguindo esse papel do proprietário (`owner`) e do autor (`createdBy`) do recurso.

## Ator

- Ator principal: proprietário do compromisso (`PRIVATE`/`SHARED`) ou membro do grupo (`GROUP`) — ver Questões em aberto.
- Ator secundário: pessoa (ou pessoas) convidada(s) como participante.

## Pré-condições

- Compromisso existe.
- Pessoa a ser convidada já possui acesso ao compromisso (é a proprietária, está em `sharedWith`, ou é membro do grupo, conforme a visibilidade) — ver Questões em aberto quanto a inverter essa ordem.

## Gatilho

Ator decide convidar (ou remover) uma pessoa como participante do compromisso.

## Fluxo principal

1. Ator seleciona o compromisso.
2. Ator seleciona uma ou mais pessoas para participar, dentre as que já têm acesso ao compromisso.
3. Sistema registra essas pessoas como participantes do compromisso.
4. Cada pessoa convidada é notificada.

## Variações

- Compromisso sem participantes definidos: estado válido.
- Remover um participante: os demais participantes, se houver, permanecem inalterados.

## Regras de negócio

- Seguindo o mesmo padrão adotado para responsáveis de tarefa (`UC-TASK-005`), um participante deve ser uma pessoa que já tem acesso ao compromisso — proprietário, pessoa em `sharedWith`, ou membro do grupo, conforme a visibilidade.
- Convidar um participante não altera `owner` nem `createdBy` do compromisso.
- Um compromisso pode ter mais de um participante simultaneamente.
- Se um participante perder o acesso ao compromisso (ex.: sai do grupo dono de um compromisso `GROUP`, ou tem seu acesso `SHARED` revogado), ele é removido automaticamente da lista de participantes, pelo mesmo princípio adotado em `UC-TASK-005`.

## Visibilidade

Convidar um participante não altera a visibilidade do compromisso. A pessoa convidada precisa já ter acesso a ele por outro motivo (ser proprietária, estar em `sharedWith`, ou ser membro do grupo).

## Relações com outros módulos

Depende de `UC-PERM-002` (quem está em `sharedWith`) e `UC-PERM-003` (quem é membro do grupo) para definir quem pode ser convidado.

## Critérios de aceite

- Pessoa(s) convidada(s) passam a aparecer como participantes do compromisso.
- Apenas pessoas com acesso prévio ao compromisso podem ser convidadas como participantes.
- Participante que perde acesso ao compromisso é removido automaticamente da lista de participantes.

## Questões em aberto

- Convidar alguém para um compromisso deveria conceder acesso a ele automaticamente (um compartilhamento implícito), em vez de exigir que a pessoa já tenha acesso previamente? Essa é uma diferença relevante em relação ao modelo adotado para tarefas.
- Compromissos deveriam suportar um fluxo de aceite/recusa de participação (ex.: "confirmar presença"), diferente do modelo de atribuição imediata sem aceite usado em tarefas (`UC-TASK-005`)?
- Quem pode convidar ou remover participantes de um compromisso `GROUP` — qualquer membro, apenas quem o criou, ou apenas um `OWNER` do grupo?
- Participantes são notificados por qual canal?
