// Dados mockados da área de Finanças (UC-FIN-*). Sem persistência real —
// suficiente pra testar visão consolidada por contexto e registro financeiro.
//
// MVP cobre receita e despesa (UC-FIN-001, revisado — ver docs/product/roadmap.md).
// Orçamentos (UC-FIN-007) e a lixeira (UC-FIN-003) ficam de fora desta rodada.

import type { HomeContext } from '../home/homeMockData'

export type TransactionType = 'receita' | 'despesa'

export interface MockTransaction {
  id: string
  title: string
  category: string
  context: HomeContext
  type: TransactionType
  amount: number
  dateLabel: string
  date: string // ISO — usada pra calcular saldo de conta e ciclo de fatura (UC-FIN-011)
  payer?: string
  accountId?: string
  // Parcelamento (UC-FIN-012): parcelas irmãs compartilham parcelamentoId.
  parcelamentoId?: string
  numeroParcela?: number
  totalParcelas?: number
  // Recorrência (UC-FIN-013): presente só na ocorrência já materializada.
  recurrenceRuleId?: string
  // Vínculo opcional com um objetivo (UC-GOAL-007/PD-007): quando setado,
  // essa transação É a alocação PAID do objetivo — não existe um valor PAID
  // digitado à parte dentro do objetivo, ver goalsSelectors.ts.
  goalId?: string
  // Só existe quando accountId aponta pra um cartão (UC-FIN-011) — um mesmo
  // cartão (ex.: Inter) pode ser usado nos dois modos. 'debito' pula direto
  // pro saldo da conta de pagamento do cartão (contaPagamentoId); 'credito'
  // entra no ciclo da fatura. Ver financeSelectors.ts.
  paymentMethod?: 'debito' | 'credito'
}

export const initialTransactions: MockTransaction[] = [
  {
    id: 'tx1',
    title: 'Supermercado',
    category: 'Mercado',
    context: 'group',
    type: 'despesa',
    amount: 245.8,
    dateLabel: 'Hoje',
    date: '2026-09-15',
    accountId: 'acc-casa',
  },
  {
    id: 'tx2',
    title: 'Internet',
    category: 'Casa',
    context: 'group',
    type: 'despesa',
    amount: 120,
    dateLabel: 'Ontem',
    date: '2026-09-14',
    payer: 'Mateus',
    accountId: 'acc-casa',
  },
  {
    id: 'tx3',
    title: 'Jantar com a Ana',
    category: 'Lazer',
    context: 'shared',
    type: 'despesa',
    amount: 84.5,
    dateLabel: 'Sáb',
    date: '2026-09-12',
  },
  {
    id: 'tx4',
    title: 'Academia',
    category: 'Saúde',
    context: 'personal',
    type: 'despesa',
    amount: 99.9,
    dateLabel: '05/09',
    date: '2026-09-05',
    accountId: 'acc-cartao',
    // No débito, o mesmo cartão pula o ciclo de fatura e sai direto do saldo
    // da conta de pagamento (acc-corrente) — testa o caso "cartão com as duas
    // possibilidades" (ex.: Inter), diferente das outras compras no cartão
    // abaixo, que são no crédito.
    paymentMethod: 'debito',
  },
  {
    id: 'tx5',
    title: 'Presente de aniversário',
    category: 'Presentes',
    context: 'shared',
    type: 'despesa',
    amount: 150,
    dateLabel: '03/09',
    date: '2026-09-03',
  },
  {
    id: 'tx6',
    title: 'Uber',
    category: 'Transporte',
    context: 'personal',
    type: 'despesa',
    amount: 32.4,
    dateLabel: 'Hoje',
    date: '2026-09-15',
    accountId: 'acc-carteira',
  },
  {
    id: 'tx7',
    title: 'Conta de luz',
    category: 'Casa',
    context: 'group',
    type: 'despesa',
    amount: 210,
    dateLabel: '01/09',
    date: '2026-09-01',
    accountId: 'acc-casa',
  },
  {
    id: 'tx8',
    title: 'Assinatura streaming',
    category: 'Lazer',
    context: 'personal',
    type: 'despesa',
    amount: 39.9,
    dateLabel: '10/08',
    date: '2026-08-10',
    accountId: 'acc-cartao',
    paymentMethod: 'credito',
  },
  {
    id: 'tx9',
    title: 'Farmácia',
    category: 'Saúde',
    context: 'personal',
    type: 'despesa',
    amount: 58.7,
    dateLabel: '05/07',
    date: '2026-07-05',
    accountId: 'acc-cartao',
    paymentMethod: 'credito',
  },
  {
    id: 'tx10',
    title: 'Aluguel',
    category: 'Casa',
    context: 'personal',
    type: 'despesa',
    amount: 1200,
    dateLabel: '05/09',
    date: '2026-09-05',
    accountId: 'acc-corrente',
    recurrenceRuleId: 'rec-aluguel',
  },
  // Parcelamento de exemplo (UC-FIN-012) — um notebook em 3x, uma parcela por
  // ciclo de fatura já existente (Julho, Agosto, Setembro), pra testar o
  // indicador de parcela nos três contextos.
  {
    id: 'tx11',
    title: 'Notebook',
    category: 'Casa',
    context: 'personal',
    type: 'despesa',
    amount: 600,
    dateLabel: '15/07',
    date: '2026-07-15',
    accountId: 'acc-cartao',
    parcelamentoId: 'parc-notebook',
    numeroParcela: 1,
    totalParcelas: 3,
    paymentMethod: 'credito',
  },
  {
    id: 'tx12',
    title: 'Notebook',
    category: 'Casa',
    context: 'personal',
    type: 'despesa',
    amount: 600,
    dateLabel: '15/08',
    date: '2026-08-15',
    accountId: 'acc-cartao',
    parcelamentoId: 'parc-notebook',
    numeroParcela: 2,
    totalParcelas: 3,
    paymentMethod: 'credito',
  },
  {
    id: 'tx13',
    title: 'Notebook',
    category: 'Casa',
    context: 'personal',
    type: 'despesa',
    amount: 600,
    dateLabel: '15/09',
    date: '2026-09-15',
    accountId: 'acc-cartao',
    parcelamentoId: 'parc-notebook',
    numeroParcela: 3,
    totalParcelas: 3,
    paymentMethod: 'credito',
  },
  // Receita (UC-FIN-001 revisado) — entra no MVP junto do dashboard (Fase C).
  {
    id: 'tx14',
    title: 'Salário',
    category: 'Trabalho',
    context: 'personal',
    type: 'receita',
    amount: 6200,
    dateLabel: '05/09',
    date: '2026-09-05',
    accountId: 'acc-corrente',
  },
  {
    id: 'tx15',
    title: 'Projeto freela',
    category: 'Trabalho',
    context: 'personal',
    type: 'receita',
    amount: 850,
    dateLabel: '12/09',
    date: '2026-09-12',
    accountId: 'acc-corrente',
  },
  // Transações vinculadas a objetivos (UC-GOAL-007) — substituem os antigos
  // valores PAID digitados solto dentro do objetivo (ver goalAllocationsMockData.ts).
  {
    id: 'tx16',
    title: 'Passagens aéreas',
    category: 'Viagem',
    context: 'shared',
    type: 'despesa',
    amount: 2000,
    dateLabel: '20/08',
    date: '2026-08-20',
    accountId: 'acc-corrente',
    goalId: 'gl1',
  },
  {
    id: 'tx17',
    title: 'Marcenaria — primeira etapa',
    category: 'Casa',
    context: 'group',
    type: 'despesa',
    amount: 6800,
    dateLabel: '10/07',
    date: '2026-07-10',
    accountId: 'acc-casa',
    goalId: 'gl3a',
  },
  {
    id: 'tx18',
    title: 'Mão de obra da reforma',
    category: 'Casa',
    context: 'group',
    type: 'despesa',
    amount: 2100,
    dateLabel: '05/08',
    date: '2026-08-05',
    accountId: 'acc-casa',
    goalId: 'gl3c',
  },
]

export function formatCurrency(amount: number) {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
