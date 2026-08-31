# PD-007 — Objetivos como hubs leves (submetas e estados financeiros)

## Status

Aceito

## Contexto

Alguns objetivos funcionam como pequenos projetos de vida — não apenas uma meta com título, prazo e barra de progresso. Exemplo: um objetivo "Casamento" pode envolver submetas (Espaço, Buffet, Fotografia, Decoração, Lua de mel), planejamento financeiro por submeta, tarefas, eventos, documentos e transações de diferentes membros. Cada submeta pode ter comportamento financeiro próprio — ex.: Buffet com custo estimado de R$ 12.000, R$ 2.000 pagos, R$ 4.000 reservados e R$ 6.000 ainda a organizar; Espaço pago por uma pessoa; Fotografia por outra; Lua de mel com contribuição de ambos ao longo do tempo.

O modelo de `Goal` documentado até aqui (`UC-GOAL-*`) já cobria criação, atualização, conclusão, compartilhamento, contexto de grupo e relação genérica com outros recursos, mas não previa hierarquia entre objetivos nem um vocabulário para valores financeiros que ainda não são uma `Transaction` (dinheiro que ainda não se moveu, mas já está reservado ou comprometido).

## Decisão

### Submetas como autorrelação de Goal

Um `Goal` pode se relacionar com outro `Goal` como submeta, formando uma hierarquia leve. Uma submeta é, ela própria, um `Goal` completo — com seu próprio título, visibilidade, progresso e relações com `Tasks`, `Events`, `Documents` e `Transactions` — e não uma entidade separada. Uma submeta pode ter visibilidade diferente da do objetivo pai (mesma lógica de independência de visibilidade já aplicada a qualquer relação entre `Goal` e outro recurso, ver `UC-GOAL-007`).

### Três estados financeiros dentro de um objetivo

Um objetivo (ou submeta) pode acompanhar valores em três estados financeiros conceituais, além de um custo estimado:

- `RESERVED` — dinheiro separado/guardado para aquele objetivo, ainda não comprometido com um pagamento específico;
- `COMMITTED` — valor já assumido/contratado, mas ainda não totalmente pago;
- `PAID` — dinheiro que efetivamente já saiu, correspondendo a `Transactions` relacionadas ao objetivo (ver `UC-GOAL-007` e `PD-006-financial-organization-model.md`).

A diferença entre o custo estimado e a soma de `RESERVED` + `COMMITTED` + `PAID` é o que ainda não foi organizado.

### Regras financeiras diferentes por submeta

Diferentes submetas do mesmo objetivo podem ter regras financeiras completamente diferentes — quem paga, se é dividido, e como. Isso não exige nenhum mecanismo novo: decorre diretamente de cada submeta ser um `Goal` independente, com suas próprias `Transactions` relacionadas, cada uma com seu próprio pagador, responsável econômico e regra de divisão, conforme já definido em `PD-006-financial-organization-model.md`.

### Princípio

Objetivos podem funcionar como hubs leves que conectam finanças, tarefas, eventos e outros recursos relacionados a uma mesma intenção de vida. Eles não devem virar um gerenciador de projetos detalhado — ver `docs/product/principles.md`, princípio 13.

### GoalAllocation como entidade própria

`RESERVED` e `COMMITTED` são representados por uma nova entidade conceitual, `GoalAllocation`: um valor associado a um `Goal` (ou submeta), com um estado (`RESERVED`, `COMMITTED` ou `PAID`) e, quando `PAID`, uma referência à `Transaction` correspondente. `RESERVED` e `COMMITTED` não têm `Transaction` associada, porque representam dinheiro que ainda não se moveu. Não são uma extensão de `Budget` (que representa um teto de gasto) nem de `Transaction` (que representa movimentação já ocorrida) — são um conceito de planejamento à parte.

### Submetas têm um único nível

Uma submeta não pode ter suas próprias submetas. A hierarquia de objetivos é limitada a dois níveis (objetivo → submetas), para preservar o princípio de "hub leve" e evitar que `Goal` vire uma árvore de projeto arbitrariamente profunda.

### Progresso do objetivo com submetas é agregado, não manual

Quando um objetivo possui submetas, seu progresso deixa de ser editado manualmente e passa a ser calculado automaticamente como a média do progresso de suas submetas. Um objetivo sem submetas continua podendo ter progresso manual ou inferido a partir de recursos relacionados, como já definido em `UC-GOAL-001`.

### COMMITTED não exige documento externo

Referenciar um `Document` (ex.: um contrato) em uma `GoalAllocation` no estado `COMMITTED` é opcional, não obrigatório. O valor comprometido pode ser apenas um número registrado pelo usuário.

### Custo estimado é um campo direto, não calculado

O custo estimado de um objetivo ou submeta é um valor definido diretamente pelo usuário, independente da soma de suas `GoalAllocations`. O "restante a organizar" continua sendo sempre calculado como custo estimado menos a soma de `RESERVED` + `COMMITTED` + `PAID`.

### Exclusão de submeta com alocações

Excluir uma submeta segue a mesma política padrão de exclusão do Lema (`docs/product/decisions/PD-005-deletion-policy.md`): vai para a lixeira por 30 dias, podendo ser restaurada. Suas `GoalAllocations` acompanham o mesmo ciclo de vida da submeta. `Transactions` já registradas (que sustentam alocações `PAID`) não são excluídas — elas têm ciclo de vida próprio (`UC-FIN-003`) e apenas deixam de estar relacionadas à submeta enquanto ela estiver na lixeira.

## Motivo

Sem esse conceito, um objetivo complexo como "Casamento" forçaria o usuário a manter o planejamento financeiro e organizacional fora do Lema (em uma planilha, por exemplo), contradizendo o problema central que o produto busca resolver. Ao mesmo tempo, transformar `Goal` em um gerenciador de projetos completo (com dependências entre tarefas, alocação de orçamento automática, relatórios etc.) contradiria o princípio 8 ("o produto não deve parecer um ERP doméstico") e a proposta de manter funcionalidades simples isoladamente (princípio 9). Reaproveitar a própria entidade `Goal` como submeta, e reaproveitar o modelo financeiro de `PD-006` para as regras por submeta, evita inventar uma segunda hierarquia de conceitos só para objetivos complexos.

## Consequências

- `domain-model.md` precisa registrar `Goal → Goal` como relação válida (submeta, limitada a um nível), os três estados financeiros conceituais e a nova entidade `GoalAllocation`.
- Os `UC-GOAL-*` já documentados (`UC-GOAL-001` a `UC-GOAL-007`) foram escritos antes desta decisão e não cobrem submetas nem estados financeiros. Eles precisarão de revisão — em especial `UC-GOAL-001` (criação, para admitir uma submeta), `UC-GOAL-003` (conclusão, quanto a como o progresso de um objetivo com submetas é calculado) e `UC-GOAL-007` (relações, para cobrir `Goal → Goal` e os três estados financeiros) — mas essa revisão fica deliberadamente fora do escopo deste momento, a pedido explícito.
- Novos casos de uso (criar submeta, registrar valor reservado/comprometido, mover valor de `RESERVED` para `COMMITTED`/`PAID`) só devem ser escritos depois que as questões futuras abaixo forem suficientemente resolvidas.

## Questões futuras

Nenhuma questão em aberto identificada neste momento.
