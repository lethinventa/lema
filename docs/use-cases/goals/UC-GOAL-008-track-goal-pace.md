# UC-GOAL-008 — Acompanhar ritmo do objetivo (ideal por mês e aviso de ritmo)

## Objetivo

Ajudar o usuário a entender se está no ritmo certo para atingir um objetivo financeiro dentro do prazo, mostrando quanto seria ideal alocar por mês e avisando quando o ritmo atual está muito abaixo do necessário — sem exigir nenhuma ação além de manter o objetivo atualizado.

## Ator

- Ator principal: usuário autenticado com acesso ao objetivo (proprietário, pessoa em `sharedWith`, ou membro do grupo, conforme a visibilidade do objetivo).

## Pré-condições

- Objetivo existe, com `custoEstimado` e prazo (`deadline`) definidos (ver `UC-GOAL-001`).

## Gatilho

Usuário visualiza um objetivo (na lista de Objetivos ou no seu detalhe).

## Fluxo principal

1. Sistema calcula o "restante a organizar": `custoEstimado` menos (soma das `GoalAllocation`s em `RESERVED`/`COMMITTED` mais a soma das `Transaction`s vinculadas ao objetivo, que formam o `PAID` — fórmula já definida em `UC-GOAL-007`).
2. Sistema calcula os meses restantes até o prazo (mínimo de 1, para evitar divisão por zero quando o prazo é no mês corrente).
3. Sistema calcula o **valor ideal por mês** = restante a organizar ÷ meses restantes, e exibe esse valor no objetivo.
4. Sistema calcula o **ritmo esperado até agora** = `custoEstimado` × (tempo decorrido desde a criação do objetivo ÷ tempo total até o prazo).
5. Se o valor total já organizado (`RESERVED` + `COMMITTED` + `PAID`) estiver bem abaixo do ritmo esperado (menos de 90% dele), sistema exibe um aviso de ritmo ("Reveja sua expectativa") — de forma discreta na lista de Objetivos, e com mais detalhe (e um atalho para editar prazo ou custo estimado) no detalhe do objetivo.

## Variações

- Objetivo sem `custoEstimado` ou sem `deadline`: nenhum dos cálculos deste caso de uso é exibido — o objetivo continua funcionando normalmente (progresso manual ou por recursos relacionados, ver `UC-GOAL-001`).
- Prazo já vencido: em vez do valor ideal por mês, sistema exibe que o prazo passou, sem tentar calcular uma divisão por um número de meses negativo ou zero.
- Objetivo já com 100% do valor organizado: nenhum aviso é exibido, independentemente do prazo.
- Objetivo com submetas: este cálculo se aplica a cada submeta individualmente (cada uma com seu próprio `custoEstimado`/prazo/alocações), não ao objetivo pai — que não tem esses campos financeiros diretos quando tem submetas (ver `domain-model.md`, "Objetivos como hubs leves").

## Regras de negócio

- Nenhum valor deste caso de uso é armazenado — "ideal por mês" e o aviso de ritmo são sempre recalculados a partir de `custoEstimado`, `deadline`, data de criação do objetivo, da soma atual de `GoalAllocation`s (`RESERVED`/`COMMITTED`) e da soma das `Transaction`s vinculadas ao objetivo (`PAID`).
- O limiar de 90% usado para disparar o aviso é uma margem de tolerância — pequenos atrasos pontuais no ritmo não devem gerar alerta constante.
- O aviso de ritmo é apenas informativo — não bloqueia nenhuma ação sobre o objetivo, nem altera automaticamente prazo, custo estimado ou alocações.

## Visibilidade

Este caso de uso não introduz visibilidade própria — os valores calculados são visíveis a quem já tem acesso ao objetivo, seguindo a visibilidade dele.

## Relações com outros módulos

Depende de `UC-GOAL-001` (custo estimado, prazo) e `UC-GOAL-007` (`GoalAllocation`, fórmula de restante a organizar). Relaciona-se com `UC-FIN-014` (mesmo princípio de painel derivado, sem armazenar valor calculado).

## Critérios de aceite

- "Ideal por mês" só aparece quando o objetivo tem `custoEstimado` e `deadline` definidos.
- Aviso de ritmo aparece apenas quando o valor alocado está significativamente abaixo do esperado para o tempo decorrido, e desaparece assim que a meta atinge 100%.
- Nenhum dos dois valores é editável diretamente pelo usuário — ambos são sempre derivados.

## Questões em aberto

- O limiar de 90% é o valor certo, ou deveria ser configurável/diferente por tipo de objetivo?
- Quando o aviso de ritmo aparece, o atalho "revise sua expectativa" deve sugerir um novo prazo automaticamente (baseado no ritmo atual), ou apenas abrir o campo de prazo para edição manual?
