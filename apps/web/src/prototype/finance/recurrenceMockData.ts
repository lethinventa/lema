// Dados mockados de recorrência (UC-FIN-013). Só a ocorrência do período atual
// é materializada como Transaction (ver financeMockData.ts, campo
// recurrenceRuleId); ocorrências futuras são projetadas, nunca persistidas.

import type { HomeContext } from '../home/homeMockData'
import type { TransactionType } from './financeMockData'

export interface MockRecurrenceRule {
  id: string
  title: string
  category: string
  context: Extract<HomeContext, 'personal' | 'group'>
  groupId?: string
  type: TransactionType
  amount: number
  accountId?: string
  dayOfMonth: number
  startDate: string // ISO
  endDate?: string // ISO — vazio = indefinida
}

export const initialRecurrenceRules: MockRecurrenceRule[] = [
  {
    id: 'rec-aluguel',
    title: 'Aluguel',
    category: 'Casa',
    context: 'personal',
    type: 'despesa',
    amount: 1200,
    accountId: 'acc-corrente',
    dayOfMonth: 5,
    startDate: '2026-04-05',
  },
  {
    id: 'rec-academia',
    title: 'Assinatura academia',
    category: 'Saúde',
    context: 'personal',
    type: 'despesa',
    amount: 120,
    accountId: 'acc-corrente',
    dayOfMonth: 25,
    startDate: '2026-05-25',
  },
]
