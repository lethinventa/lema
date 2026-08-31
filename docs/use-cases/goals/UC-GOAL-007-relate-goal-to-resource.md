# UC-GOAL-007 — Relacionar objetivo a outros recursos

## Objetivo

Permitir associar um objetivo a outros recursos do sistema (Tasks, Events, Documents, Transactions, Budgets e outros Goals como submetas), materializando o diferencial do Lema de conectar informações entre áreas diferentes, conforme a seção "Relações" de `domain-model.md` e o princípio 5 de `principles.md` ("Informações de áreas diferentes devem poder se relacionar"). Também cobre a criação de `GoalAllocations` (`RESERVED`/`COMMITTED`/`PAID`), a forma como um objetivo acompanha valores financeiros que ainda não são uma `Transaction` (ver `docs/product/decisions/PD-007-goal-lightweight-hub.md`).

## Ator

- Ator principal: proprietário do objetivo (`PRIVATE`/`SHARED`) ou qualquer membro do grupo (`GROUP` — ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Objetivo existe.
- Recurso a ser relacionado (ex.: uma `Task`, um `Event`, um `Document`) já existe.
- Ator possui acesso tanto ao objetivo quanto ao recurso a ser relacionado.

## Gatilho

Ator decide conectar um objetivo a outro recurso existente.

## Fluxo principal

1. Ator seleciona o objetivo.
2. Ator seleciona um recurso existente para relacionar.
3. Sistema registra a relação entre o objetivo e o recurso.

## Variações

- Relacionar múltiplos recursos ao mesmo objetivo: permitido, conforme os exemplos de `domain-model.md` (`Goal → Tasks, Transactions, Events, Documents`).
- Remover uma relação existente: o objetivo e o recurso continuam existindo, apenas deixam de estar conectados.
- Relacionar a uma `Transaction` ou a um `Budget` (ver `UC-FIN-001` e `UC-FIN-007`): segue o mesmo mecanismo genérico deste caso de uso, sem regras adicionais. Um `Budget` relacionado a um objetivo é o mecanismo por trás do campo "objetivo relacionado" descrito em `UC-FIN-007`.
- **Relacionar a outro `Goal` como submeta**: cria uma relação `Goal → Goal`, limitada a um único nível — uma submeta não pode, por sua vez, ter suas próprias submetas (ver `PD-007-goal-lightweight-hub.md`). A submeta é um `Goal` completo, com seu próprio título, visibilidade, progresso, `GoalAllocations` e relações.
- **Criar uma `GoalAllocation`**: ator registra um valor associado ao objetivo (ou submeta) em um dos três estados — `RESERVED`, `COMMITTED` ou `PAID`. Uma alocação `PAID` referencia uma `Transaction` existente (ver `UC-FIN-001`); `RESERVED` e `COMMITTED` não referenciam nenhuma `Transaction`, pois representam dinheiro que ainda não se moveu. Uma alocação `COMMITTED` pode, opcionalmente, referenciar um `Document`.

## Regras de negócio

- Um objetivo pode se relacionar a recursos com visibilidade diferente da sua própria (ex.: objetivo `PRIVATE` relacionado a uma tarefa `GROUP`). Não é exigida compatibilidade de visibilidade entre os dois lados da relação.
- Relacionar um objetivo a outro recurso não altera a visibilidade, `owner` ou `createdBy` de nenhum dos dois.
- Excluir um recurso relacionado (ex.: uma `Task`) não exclui o objetivo, apenas encerra a relação.
- Excluir o objetivo não exclui os recursos relacionados a ele (ver `UC-GOAL-004`).
- Quando o progresso do objetivo é calculado a partir de recursos relacionados (ver `UC-GOAL-001`), ele reflete a proporção desses recursos já concluídos (ex.: tarefas relacionadas concluídas). Concluir todos os recursos relacionados desse tipo leva o progresso a 100% e aciona a conclusão automática do objetivo (ver `UC-GOAL-003`).
- Quando o objetivo possui submetas, seu progresso deixa de ser manual (ou inferido de outros recursos) e passa a ser a média do progresso das submetas.
- Uma submeta pode ter visibilidade diferente da do objetivo pai, seguindo a mesma lógica de independência de visibilidade já aplicada a qualquer relação de `Goal` com outro recurso.
- O custo estimado de um objetivo/submeta é um valor definido diretamente pelo usuário, independente da soma de suas `GoalAllocations`. O "restante a organizar" é sempre calculado como custo estimado menos a soma de `RESERVED` + `COMMITTED` + `PAID`.
- Não há limite para a quantidade de recursos que podem ser relacionados a um único objetivo.

## Visibilidade

A relação em si não possui visibilidade própria; cada recurso relacionado mantém sua própria visibilidade, independentemente da visibilidade do objetivo. Um objetivo `PRIVATE` pode se relacionar a um recurso `GROUP` (ou vice-versa): a relação é permitida mesmo quando as visibilidades divergem. Cada pessoa só vê o lado da relação ao qual já tem acesso — quem não tem acesso ao objetivo não vê que ele existe, mesmo enxergando o recurso relacionado.

## Relações com outros módulos

Relaciona-se com `UC-TASK-*`, `UC-CAL-*` e `UC-FIN-*` como possíveis recursos conectados a um objetivo, com `UC-GOAL-001` (submetas e progresso agregado) e `UC-GOAL-003` (conclusão automática via progresso). Ainda não se relaciona com casos de uso de Documentos, que não foram detalhados neste momento.

## Critérios de aceite

- É possível visualizar, a partir de um objetivo, quais recursos estão relacionados a ele, incluindo submetas e `GoalAllocations`.
- Remover uma relação não afeta os recursos relacionados nem o objetivo.
- Uma submeta não pode ser relacionada como submeta de si mesma, nem ter suas próprias submetas.
- Uma `GoalAllocation` em `PAID` sempre referencia uma `Transaction`; `RESERVED` e `COMMITTED` nunca referenciam uma.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
