// Dados mockados da área de Finanças (UC-FIN-*). Sem persistência real —
// suficiente pra testar visão consolidada por contexto e registro de despesa.
//
// MVP cobre só despesas (UC-FIN-001) — sem receitas. Contas (UC-FIN-006),
// orçamentos (UC-FIN-007) e a lixeira (UC-FIN-003) ficam de fora desta rodada.

import type { HomeContext } from '../home/homeMockData'

export interface MockTransaction {
  id: string
  title: string
  category: string
  context: HomeContext
  amount: number
  dateLabel: string
  payer?: string
}

export const initialTransactions: MockTransaction[] = [
  { id: 'tx1', title: 'Supermercado', category: 'Mercado', context: 'group', amount: 245.8, dateLabel: 'Hoje' },
  { id: 'tx2', title: 'Internet', category: 'Casa', context: 'group', amount: 120, dateLabel: 'Ontem', payer: 'Mateus' },
  { id: 'tx3', title: 'Jantar com a Ana', category: 'Lazer', context: 'shared', amount: 84.5, dateLabel: 'Sáb' },
  { id: 'tx4', title: 'Academia', category: 'Saúde', context: 'personal', amount: 99.9, dateLabel: '05/09' },
  {
    id: 'tx5',
    title: 'Presente de aniversário',
    category: 'Presentes',
    context: 'shared',
    amount: 150,
    dateLabel: '03/09',
  },
  { id: 'tx6', title: 'Uber', category: 'Transporte', context: 'personal', amount: 32.4, dateLabel: 'Hoje' },
  { id: 'tx7', title: 'Conta de luz', category: 'Casa', context: 'group', amount: 210, dateLabel: '01/09' },
]

export function formatCurrency(amount: number) {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
