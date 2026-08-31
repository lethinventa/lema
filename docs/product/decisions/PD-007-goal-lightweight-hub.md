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

## Motivo

Sem esse conceito, um objetivo complexo como "Casamento" forçaria o usuário a manter o planejamento financeiro e organizacional fora do Lema (em uma planilha, por exemplo), contradizendo o problema central que o produto busca resolver. Ao mesmo tempo, transformar `Goal` em um gerenciador de projetos completo (com dependências entre tarefas, alocação de orçamento automática, relatórios etc.) contradiria o princípio 8 ("o produto não deve parecer um ERP doméstico") e a proposta de manter funcionalidades simples isoladamente (princípio 9). Reaproveitar a própria entidade `Goal` como submeta, e reaproveitar o modelo financeiro de `PD-006` para as regras por submeta, evita inventar uma segunda hierarquia de conceitos só para objetivos complexos.

## Consequências

- `domain-model.md` precisa registrar `Goal → Goal` como relação válida (submeta) e os três estados financeiros conceituais.
- Os `UC-GOAL-*` já documentados (`UC-GOAL-001` a `UC-GOAL-007`) foram escritos antes desta decisão e não cobrem submetas nem estados financeiros. Eles precisarão de revisão — em especial `UC-GOAL-001` (criação, para admitir uma submeta), `UC-GOAL-003` (conclusão, quanto a como o progresso de um objetivo com submetas é calculado) e `UC-GOAL-007` (relações, para cobrir `Goal → Goal` e os três estados financeiros) — mas essa revisão fica deliberadamente fora do escopo deste momento, a pedido explícito.
- Novos casos de uso (criar submeta, registrar valor reservado/comprometido, mover valor de `RESERVED` para `COMMITTED`/`PAID`) só devem ser escritos depois que as questões futuras abaixo forem suficientemente resolvidas.

## Questões futuras

- `RESERVED` e `COMMITTED` precisam de uma nova entidade própria (ex.: uma "alocação financeira" do objetivo), ou podem ser representados como uma extensão de `Budget` ou de `Transaction` com um campo de estado? Isso ainda não foi decidido.
- Existe limite de profundidade para submetas (uma submeta pode ter suas próprias submetas), ou a hierarquia é sempre de um nível só, para preservar o princípio de "hub leve" e evitar virar um gerenciador de projetos?
- Como o progresso do objetivo "pai" se relaciona com o progresso de suas submetas — é sempre manual, é uma média/agregação automática das submetas, ou o objetivo pai simplesmente não tem progresso próprio quando possui submetas?
- Um valor `COMMITTED` exige algum tipo de referência a um compromisso externo (ex.: um documento de contrato relacionado via `Document`), ou é apenas um número registrado pelo usuário?
- O custo estimado de um objetivo/submeta é um campo único, ou pode ser recalculado a partir da soma de valores relacionados (ex.: orçamentos de submetas)?
- Quando uma submeta é excluída, o que acontece com seus valores `RESERVED`/`COMMITTED`/`PAID` — são apenas descartados, ou precisam de alguma confirmação adicional, dado que representam dinheiro real?
