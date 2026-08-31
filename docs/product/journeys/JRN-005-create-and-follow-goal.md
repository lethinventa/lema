# JRN-005 — Criar objetivo, submetas e acompanhar progresso

## Objetivo da jornada

Mostrar como um objetivo funciona como um hub leve, conectando submetas e tarefas, com o progresso acompanhado ao longo do tempo até a conclusão.

## Ator principal

Usuário autenticado (o objetivo pode ser `PRIVATE`, `SHARED` ou `GROUP`).

## Ponto de entrada

Usuário decide registrar algo que quer alcançar — potencialmente um objetivo complexo (ex.: "Casamento").

## Fluxo

`UC-GOAL-001` → `UC-GOAL-007` → `UC-TASK-001`/`UC-TASK-008` → `UC-TASK-003` → `UC-GOAL-003`

1. `UC-GOAL-001` — Criar objetivo.
2. `UC-GOAL-007` — Relacionar objetivo a outros recursos: criar submetas (`Goal → Goal`, ex.: "Buffet", "Espaço") e relacionar tarefas a cada uma.
3. `UC-TASK-001` / `UC-TASK-008` — Criar as tarefas relacionadas a cada submeta.
4. `UC-TASK-003` — Concluir essas tarefas ao longo do tempo.
5. Progresso do objetivo evolui: manual ou inferido a partir de tarefas relacionadas quando não há submetas (`UC-GOAL-001`); média do progresso das submetas quando existem (`UC-GOAL-003`).
6. `UC-GOAL-003` — Concluir objetivo: automático ao atingir 100% de progresso, ou manual a qualquer momento por quem tem acesso.

## Resultado esperado

Objetivo (e suas submetas) refletem o progresso real das tarefas relacionadas, sem que o usuário precise atualizar percentuais manualmente, e é marcado como concluído quando tudo estiver pronto.

## Pontos de decisão

- Objetivo simples (sem submetas) ou complexo (com submetas), conforme `docs/product/decisions/PD-007-goal-lightweight-hub.md`.
- Progresso de cada submeta é atualizado manualmente ou inferido a partir de tarefas relacionadas.
- Concluir manualmente antes de 100%, ou deixar o sistema inferir a conclusão.

## Dependências

Nenhuma jornada anterior é obrigatória — um objetivo pode ser inteiramente pessoal. Depende de `JRN-002` apenas se o objetivo (ou alguma submeta) for `GROUP`.

## Questões em aberto

- Esta jornada não cobre o lado financeiro de um objetivo complexo (`GoalAllocation`, estados `RESERVED`/`COMMITTED`/`PAID`), porque nenhum caso de uso detalha, passo a passo, como criar ou atualizar uma `GoalAllocation` — `UC-GOAL-007` menciona o conceito, mas não o fluxo. **Gap identificado**: falta um caso de uso dedicado a registrar/atualizar uma `GoalAllocation`, algo como "UC-GOAL-008 — Registrar alocação financeira do objetivo".
- `UC-GOAL-007` não distingue explicitamente "criar uma nova submeta" de "relacionar um objetivo já existente como submeta" — ambos usam o mesmo caso de uso, o que parece adequado, mas vale confirmar que essa generalização cobre bem os dois casos na prática.
