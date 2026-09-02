# UC-FIN-013 — Configurar transação recorrente

## Objetivo

Permitir registrar uma receita ou despesa que se repete indefinidamente (ex.: assinatura mensal, salário), sem exigir que o usuário lance manualmente cada ocorrência, e sem materializar ocorrências futuras antes da hora.

## Ator

- Ator principal: usuário autenticado (mesmo ator de `UC-FIN-001`).

## Pré-condições

- Usuário está registrando uma transação (ver `UC-FIN-001`).

## Gatilho

Usuário, ao registrar uma transação, indica que ela se repete e informa a frequência.

## Fluxo principal

1. Usuário informa valor, categoria, conta associada, contexto, dia do mês em que a transação se repete, e opcionalmente uma data de fim (deixar em branco significa recorrência indefinida).
2. Sistema cria uma `RecurrenceRule` com esses dados.
3. Sistema materializa como `Transaction` real apenas a ocorrência do período (mês) atual.
4. Em períodos futuros, a ocorrência ainda não materializada é exibida como projeção (ex.: no saldo previsto, ver `UC-FIN-014`), sem existir como `Transaction` até a data efetivamente chegar.

## Variações

- Recorrência com data de fim: ao passar da data de fim, nenhuma nova ocorrência é materializada nem projetada.
- Cancelar a recorrência: usuário exclui a `RecurrenceRule`; as `Transaction`s já materializadas em períodos anteriores não são afetadas (permanecem no histórico).
- Editar o valor de uma recorrência: afeta apenas as ocorrências futuras (ainda não materializadas); ocorrências já materializadas como `Transaction` mantêm seu valor original, editável individualmente como qualquer transação (ver `UC-FIN-002`).

## Regras de negócio

- Apenas a ocorrência do período atual é materializada como `Transaction`; o sistema nunca cria antecipadamente `Transaction`s de meses futuros para uma recorrência indefinida (diferente do parcelamento, ver `UC-FIN-012`, que tem número de parcelas conhecido).
- A janela de projeção de ocorrências futuras (para efeito de saldo previsto e visão geral) vai até o fim do período corrente, não além.
- Uma `RecurrenceRule` pode estar associada a uma conta comum ou a um cartão de crédito; nesse último caso, a ocorrência materializada entra na fatura do ciclo correspondente (ver `UC-FIN-011`).
- Excluir a `RecurrenceRule` não exclui `Transaction`s já materializadas — apenas impede que novas ocorrências sejam criadas ou projetadas.

## Visibilidade

A `RecurrenceRule` tem a mesma visibilidade da transação que ela gera — não introduz um conceito novo de visibilidade.

## Relações com outros módulos

Depende de `UC-FIN-001`. Relaciona-se com `UC-FIN-011` (recorrência em cartão de crédito) e `UC-FIN-014` (saldo previsto, alimentado pelas ocorrências projetadas).

## Critérios de aceite

- Criar uma transação recorrente materializa apenas a ocorrência do período atual, nunca ocorrências futuras.
- Cancelar a recorrência preserva as `Transaction`s já materializadas.
- O saldo previsto reflete ocorrências futuras projetadas dentro do período corrente, sem exigir que elas existam como `Transaction`.

## Questões em aberto

- Além de mensal, o sistema deve suportar outras frequências (semanal, anual) neste momento, ou isso fica para quando houver demanda concreta?
- Quando a data do período atual chega e a ocorrência é materializada, isso acontece automaticamente (ex.: ao abrir o app) ou exige alguma confirmação do usuário?
