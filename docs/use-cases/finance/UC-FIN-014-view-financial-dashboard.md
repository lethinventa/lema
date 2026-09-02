# UC-FIN-014 — Visualizar painel financeiro (visão geral)

## Objetivo

Permitir que um usuário veja um resumo visual de sua situação financeira num período: economia mensal (receita x despesa), despesas por categoria e ranking de categorias — tudo derivado das transações existentes, sem exigir configuração adicional.

> Revisão pós-implementação: a versão original deste UC também previa um bloco de "saldo inicial do período / saldo atual / saldo previsto" agregando todas as contas visíveis no contexto. Na implementação, isso se mostrou frágil — agregar "saldo previsto" (Fase B, por conta) entre múltiplas contas de tipos diferentes (conta corrente, cartão, dinheiro) sem uma regra clara de conversão não tem uma soma que faça sentido sozinha. O saldo previsto continua existindo por conta (ver `UC-FIN-006`, seção "Saldo previsto", disponível na tela de cada conta) — este painel foca em economia mensal, categoria e ranking, que são agregáveis sem ambiguidade.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui transações e/ou contas com visibilidade `PRIVATE`, `SHARED` e/ou `GROUP`.

## Gatilho

Usuário acessa a área de Finanças / Visão geral.

## Fluxo principal

1. Usuário seleciona o contexto (Tudo, Pessoal, Grupo específico, Compartilhado — ver `UC-FIN-008`) e o período (mês).
2. Sistema calcula e exibe: economia mensal (receita menos despesa do período, como percentual da receita); despesas por categoria (gráfico de proporção); e ranking de categorias, alternável entre receitas e despesas.
3. Usuário pode navegar para o mês anterior ou seguinte, recalculando tudo para o novo período.

## Variações

- Período sem nenhuma transação: painel exibe estado vazio, sem gráficos quebrados (ex.: "nada lançado neste mês").
- Despesa maior que a receita no período: em vez de uma porcentagem negativa de economia, o painel exibe um estado de alerta indicando que os gastos superaram a receita.
- Contexto "Tudo" com múltiplos grupos: valores por categoria são somados entre grupos diferentes — é apenas um total agregado, não um saldo par-a-par nem uma `SplitRule`, então não há mistura de dado sensível entre grupos (ver `docs/product/information-architecture.md`).

## Regras de negócio

- Este caso de uso não introduz nenhum conceito novo de domínio — todos os valores exibidos são calculados a partir de `Transaction` já existente (ver `UC-FIN-001`).
- Economia mensal e ranking de receitas dependem do MVP cobrir o tipo receita (ver `UC-FIN-001`), não apenas despesa.
- Este caso de uso é apenas visualização; nenhuma ação aqui altera visibilidade, saldo ou qualquer dado subjacente. Não deve ser confundido com `Budget` (`UC-FIN-007`), que é um planejamento com limite — este painel não define nem compara a nenhum limite.

## Visibilidade

Consome as regras já definidas em `permissions.md` e o comportamento de agregação já definido em `UC-FIN-008`; não introduz nenhuma regra nova de visibilidade.

## Relações com outros módulos

Depende de `UC-FIN-001`, `UC-FIN-006`, `UC-FIN-008`, `UC-FIN-011`, `UC-FIN-012` e `UC-FIN-013`.

## Critérios de aceite

- Painel reflete exatamente a soma das transações visíveis no contexto e período selecionados, sem dado divergente ou armazenado à parte.
- Trocar contexto ou período recalcula todos os valores exibidos.
- Painel nunca expõe transação `PRIVATE` de outra pessoa, mesmo em contexto de grupo.

## Questões em aberto

- O painel deve considerar transferências entre contas do próprio usuário como receita/despesa para o cálculo de "economia mensal", ou essas devem ser excluídas do cálculo? (O conceito de transferência entre contas ainda não foi modelado no Lema.)
- Tocar numa categoria (no gráfico ou no ranking) para ver a lista de transações filtrada por ela ficou fora desta rodada de implementação — o protótipo mostra os valores, mas o drill-down ainda não existe.
