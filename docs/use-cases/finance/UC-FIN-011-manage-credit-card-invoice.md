# UC-FIN-011 — Gerenciar cartão de crédito e fatura

## Objetivo

Permitir que um usuário registre um cartão de crédito como uma conta especializada, acompanhe sua fatura por ciclo e registre o pagamento dela, conforme decidido durante o aprofundamento da experiência de Finanças (referência: Minhas Finanças).

## Ator

- Ator principal: usuário autenticado (proprietário do cartão, `PRIVATE`/`SHARED`) ou membro do grupo, quando o cartão é `GROUP` (ver `docs/product/decisions/PD-004-group-resource-governance.md`).

## Pré-condições

- Usuário possui uma conta ativa no Lema.
- Se o cartão for criado como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide registrar um cartão de crédito, ou acessa um cartão já existente para ver/pagar sua fatura.

## Fluxo principal

1. Usuário cria uma conta do tipo "Cartão de crédito" (ver `UC-FIN-006`), informando limite, dia de fechamento, dia de vencimento e, opcionalmente, a conta de pagamento (de onde o valor da fatura sairá quando paga, e também de onde saem as compras lançadas no débito desse cartão — ver "Débito no mesmo cartão", abaixo).
2. Ao lançar uma transação nesse cartão (`UC-FIN-001`), o usuário escolhe a forma de pagamento: crédito ou débito. Sistema passa a agrupar automaticamente, em ciclos mensais definidos pelo dia de fechamento, as transações lançadas **no crédito** desse cartão — cada ciclo é uma `Invoice` (fatura). Transações lançadas **no débito** não entram em nenhuma fatura.
3. Usuário acessa o cartão e navega entre os períodos (mês anterior/atual) para ver cada fatura: valor total (derivado da soma das transações do ciclo), status e lista de transações.
4. Quando a fatura está `FECHADA`, usuário pode registrar o pagamento.
5. Sistema cria uma `Transaction` de saída na conta de pagamento, no valor total da fatura, e muda o status da fatura para `PAGA`.

## Variações

- Cartão sem conta de pagamento definida: válido — a fatura pode ser visualizada e navegada normalmente; "registrar pagamento" fica indisponível até uma conta de pagamento ser definida. Nesse caso, o débito também fica indisponível nesse cartão (ver regra abaixo).
- Fatura sem nenhuma transação no ciclo: válida, com valor total zero.
- Cartão `GROUP`: qualquer membro do grupo pode lançar transações nele e registrar o pagamento da fatura, independentemente do papel (mesma regra geral de `PD-004-group-resource-governance.md`).
- **Débito no mesmo cartão**: um cartão físico pode oferecer as duas funções ao mesmo tempo (ex.: Inter). Isso não é uma configuração do cartão (`Account`) — é uma escolha feita em cada `Transaction` individualmente. Uma transação no débito desse cartão se comporta, para efeito de saldo, como se tivesse sido lançada direto na conta de pagamento do cartão: afeta o saldo dela imediatamente, entra no saldo previsto dela, e nunca aparece em nenhuma fatura.

## Regras de negócio

- Uma fatura (`Invoice`) pertence a exatamente um cartão e a um período (ciclo entre dois fechamentos consecutivos).
- Uma fatura persiste apenas identidade, `status` (`ABERTA`/`FECHADA`/`PAGA`) e `dataPagamento`. Valor total e transações do ciclo nunca são armazenados — são sempre calculados a partir das `Transaction`s daquele cartão dentro do período, para nunca divergir do dado real (mesmo princípio já usado no saldo de `Account`, ver `UC-FIN-006`).
- A fatura muda de `ABERTA` para `FECHADA` automaticamente ao passar o dia de fechamento configurado — não é uma ação manual do usuário.
- "Registrar pagamento" só está disponível quando a fatura está `FECHADA`. Fatura paga não pode ser reaberta; para corrigir um pagamento incorreto, o caminho é excluir a `Transaction` de pagamento gerada (ver `UC-FIN-003`), o que devolve a fatura ao status `FECHADA`.
- Pagamento parcial de fatura está fora de escopo neste momento — o pagamento é sempre do valor total.
- Uma transação parcelada ou recorrente lançada num cartão (ver `UC-FIN-012` e `UC-FIN-013`) entra na fatura do ciclo correspondente à sua data, como qualquer outra transação — mas só se for no crédito; parcelamento não se aplica a compras no débito (não há sentido em parcelar algo que já saiu do saldo na hora).
- Débito só é uma opção quando o cartão tem uma conta de pagamento definida — é essa conta que recebe o efeito da transação. Sem conta de pagamento, toda transação nesse cartão é implicitamente no crédito.
- "Registrar pagamento" cria a `Transaction` de saída na conta de pagamento pelo valor total da fatura — que inclui apenas as compras no crédito daquele ciclo. Compras no débito já afetaram essa mesma conta no momento em que foram lançadas, então não entram de novo nesse valor.

## Visibilidade

Uma `Invoice` não tem visibilidade própria — segue exatamente a visibilidade do cartão (`Account`) ao qual pertence. Quem não tem acesso ao cartão não vê sua fatura.

## Relações com outros módulos

Depende de `UC-FIN-006` (conta/cartão) e `UC-FIN-001` (transações do ciclo, transação de pagamento). Relaciona-se com `UC-FIN-012` (parcelamento), `UC-FIN-013` (recorrência) e `UC-FIN-014` (visão geral, saldo previsto considerando faturas em aberto).

## Critérios de aceite

- Uma fatura sempre reflete a soma exata das transações **no crédito** do cartão naquele ciclo, sem exigir sincronização manual.
- Fatura muda de `ABERTA` para `FECHADA` sozinha, sem ação do usuário.
- Registrar pagamento só é possível com a fatura `FECHADA`, e sempre pelo valor total.
- Uma transação no débito de um cartão nunca aparece em nenhuma fatura, e afeta o saldo da conta de pagamento no mesmo instante em que é lançada, exatamente como uma transação lançada direto nessa conta.

## Questões em aberto

- Se o dia de fechamento ou vencimento do cartão for alterado, isso afeta o ciclo da fatura já `ABERTA`, ou só entra em vigor no próximo ciclo?
- Deve ser possível remover um cartão que tem uma fatura `ABERTA` ou `FECHADA` (não paga)? Ou isso deve ser bloqueado até a fatura ser paga?
- Uma transação no débito pode ser editada depois para virar crédito (ou vice-versa)? Hoje o protótipo permite trocar livremente a qualquer momento; não há uma regra de produto definida sobre se isso deveria ter alguma restrição (ex.: depois que a fatura do ciclo já fechou).
