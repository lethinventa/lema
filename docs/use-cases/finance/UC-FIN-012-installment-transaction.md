# UC-FIN-012 — Parcelar transação

## Objetivo

Permitir registrar uma compra parcelada em um número fixo de vezes (ex.: 3x de R$ 100), gerando automaticamente as transações futuras correspondentes, tipicamente associada a um cartão de crédito.

## Ator

- Ator principal: usuário autenticado (mesmo ator de `UC-FIN-001`).

## Pré-condições

- Usuário está registrando uma transação (ver `UC-FIN-001`) associada a uma conta do tipo cartão de crédito (ver `UC-FIN-006`, `UC-FIN-011`).

## Gatilho

Usuário, ao registrar uma transação, indica que ela é parcelada e informa o número de parcelas.

## Fluxo principal

1. Usuário informa o valor total da compra, a conta (cartão de crédito) e o número de parcelas.
2. Sistema divide o valor total pelo número de parcelas — se a divisão não for exata, a diferença é ajustada na última parcela, para que a soma das parcelas seja sempre igual ao valor total.
3. Sistema cria, de uma vez, uma `Transaction` para cada parcela, todas com a mesma categoria, contexto e visibilidade da transação original, uma por mês a partir da data informada, vinculadas por um `parcelamentoId` comum e com sua posição (`numeroParcela`/`totalParcelas`).
4. Cada parcela entra na fatura do cartão correspondente ao seu próprio mês (ver `UC-FIN-011`).

## Variações

- Parcelamento em conta que não é cartão de crédito: fora de escopo — parcelamento só está disponível para contas do tipo cartão de crédito neste momento.
- Editar uma parcela específica (ex.: mudar a categoria da 2ª de 3 parcelas): afeta apenas aquela parcela, sem alterar as demais (ver `UC-FIN-002`).
- Excluir uma parcela específica: afeta apenas aquela parcela, sem excluir ou recalcular as demais — segue o fluxo padrão de `UC-FIN-003`, sem diálogo de "esta ou as futuras".

## Regras de negócio

- O número de parcelas é definido no momento da criação e não muda depois — para mudar o parcelamento, o caminho é excluir as parcelas ainda não realizadas e lançar novamente.
- Todas as parcelas de um mesmo parcelamento compartilham `parcelamentoId`, categoria, contexto e visibilidade; valor, data e status podem ser editados individualmente depois de criadas.
- Parcelas com data futura contam para o saldo previsto da conta/cartão (ver `domain-model.md`, seção "Saldo previsto"), mas não para o saldo atual.

## Visibilidade

Cada parcela tem a mesma visibilidade da transação original — não há visibilidade própria do parcelamento como um todo.

## Relações com outros módulos

Depende de `UC-FIN-001` e `UC-FIN-011`. Relaciona-se com `UC-FIN-002` e `UC-FIN-003` (edição/exclusão de parcela individual) e `UC-FIN-014` (saldo previsto, visão geral).

## Critérios de aceite

- Criar uma transação parcelada gera exatamente N transações, cuja soma dos valores é igual ao valor total informado.
- Cada parcela aparece na fatura do cartão referente ao seu próprio mês.
- Editar ou excluir uma parcela nunca afeta as demais parcelas do mesmo parcelamento.

## Questões em aberto

- Deve haver um limite máximo de parcelas (ex.: 24x)?
- Ao editar o valor de uma parcela ainda não realizada, o sistema deve sugerir redistribuir a diferença entre as parcelas restantes, ou deixar como ajuste manual do usuário?
