# UC-CAL-004 — Convidar participante para compromisso

## Objetivo

Permitir designar quem deve participar de um compromisso, distinguindo esse papel do proprietário (`owner`) e do autor (`createdBy`) do recurso.

## Ator

- Ator principal: proprietário do compromisso (`PRIVATE`/`SHARED`) ou qualquer membro do grupo, independentemente do papel (`GROUP`).
- Ator secundário: pessoa (ou pessoas) convidada(s) como participante.

## Pré-condições

- Compromisso existe.
- Se o compromisso for `GROUP`, a pessoa a ser convidada deve ser membro ativo do grupo.

## Gatilho

Ator decide convidar (ou remover) uma pessoa como participante do compromisso.

## Fluxo principal

1. Ator seleciona o compromisso.
2. Ator seleciona uma ou mais pessoas para participar.
3. Se a pessoa convidada ainda não tiver acesso ao compromisso (compromisso `PRIVATE`, ou `SHARED` sem essa pessoa em `sharedWith`), o compromisso passa a (ou permanece) `SHARED` e a pessoa é adicionada a `sharedWith` (compartilhamento implícito pelo convite). Compromissos `GROUP` não passam por essa etapa: o participante já precisa ser membro do grupo.
4. Sistema registra essas pessoas como participantes do compromisso, de forma imediata, sem exigir confirmação de presença.
5. Cada pessoa convidada é notificada.

## Variações

- Compromisso sem participantes definidos: estado válido.
- Remover um participante: os demais participantes, se houver, permanecem inalterados. Remover um participante não revoga, por si só, seu acesso de `sharedWith` obtido pelo convite (ver `UC-PERM-005` para revogação explícita de acesso).
- Compromisso `GROUP`: convidar um participante não altera a visibilidade nem o `owner`, já que membros do grupo já têm acesso ao compromisso.

## Regras de negócio

- Diferentemente do modelo adotado para responsáveis de tarefa (`UC-TASK-005`), convidar um participante para um compromisso `PRIVATE` ou `SHARED` concede acesso a ele automaticamente (adicionando-o a `sharedWith`), em vez de exigir que a pessoa já tenha acesso previamente. Essa diferença reflete que, em um compromisso, ser convidado normalmente já significa "ter motivo para ver o compromisso".
- Para compromissos `GROUP`, o participante deve ser membro ativo do grupo — convidar alguém de fora do grupo não é possível por este caso de uso.
- Convidar um participante não altera `owner` nem `createdBy` do compromisso.
- Um compromisso pode ter mais de um participante simultaneamente.
- Convidar é imediato e não exige aceite ou confirmação de presença da pessoa convidada. Um fluxo de confirmação de presença (RSVP) fica registrado como possibilidade futura, não implementada agora.
- Se um participante perder o acesso ao compromisso (ex.: sai do grupo dono de um compromisso `GROUP`, ou tem seu acesso `SHARED` revogado — ver `UC-PERM-005`), ele é removido automaticamente da lista de participantes, pelo mesmo princípio adotado em `UC-TASK-005`.
- Qualquer membro do grupo pode convidar ou remover participantes de um compromisso `GROUP`, independentemente de seu papel.

## Visibilidade

Para compromissos `PRIVATE` ou `SHARED`, convidar uma pessoa sem acesso prévio é a própria ação que estende (ou cria) o `sharedWith`, conforme `UC-PERM-002` (ver Regras de negócio). Para compromissos `GROUP`, convidar um participante não altera a visibilidade — a pessoa precisa já ser membro do grupo.

## Relações com outros módulos

Aplica o mecanismo de `UC-PERM-002` (adicionar pessoas a `sharedWith`) como efeito colateral do convite. Depende de `UC-PERM-003` (quem é membro do grupo) para definir quem pode ser convidado em um compromisso `GROUP`.

## Critérios de aceite

- Pessoa(s) convidada(s) passam a aparecer como participantes do compromisso, imediatamente e sem exigir confirmação.
- Convidar alguém sem acesso prévio a um compromisso `PRIVATE` ou `SHARED` adiciona essa pessoa a `sharedWith` (tornando-o `SHARED`, se ainda não fosse).
- Em um compromisso `GROUP`, apenas membros do grupo podem ser convidados como participantes.
- Participante que perde acesso ao compromisso é removido automaticamente da lista de participantes.

## Questões em aberto

- Participantes são notificados por qual canal? (mesma questão registrada para tarefas em `UC-TASK-007`)
