// Dados mockados do GroupFinancialArrangement (PD-006/UC-FIN-009/UC-FIN-010).
// Sem persistência real — cada grupo já nasce com a configuração mínima
// resolvida no onboarding (UC-FIN-009); esta tela (GroupFinanceScreen)
// testa a revisão/edição progressiva (UC-FIN-010).

import type { SplitRule, TransparencyLevel } from '../state/OnboardingContext'

export interface SplitException {
  id: string
  category: string
  splitRule: SplitRule
}

export interface GroupFinancialArrangement {
  hasSharedMoney: boolean
  splitRule: SplitRule
  transparency: TransparencyLevel
  exceptions: SplitException[]
}

export interface ArrangementHistoryEntry {
  id: string
  field: string
  from: string
  to: string
  changedBy: string
  changedAt: string // ISO date
}

export const initialGroupArrangements: Record<string, GroupFinancialArrangement> = {
  'familia-duarte': {
    hasSharedMoney: true,
    splitRule: '50-50',
    transparency: 'full',
    exceptions: [{ id: 'exc1', category: 'Casa', splitRule: 'proportional' }],
  },
  'casa-da-mae': {
    hasSharedMoney: false,
    splitRule: 'responsibility',
    transparency: 'full',
    exceptions: [],
  },
}

export const initialArrangementHistory: Record<string, ArrangementHistoryEntry[]> = {
  'familia-duarte': [
    {
      id: 'h1',
      field: 'Configuração inicial',
      from: '—',
      to: 'Caixa comum · 50/50 · transparência total',
      changedBy: 'Lethicia',
      changedAt: '2026-06-01',
    },
    {
      id: 'h2',
      field: 'Exceção por categoria',
      from: 'Nenhuma',
      to: '"Casa" passou a ser proporcional',
      changedBy: 'Lethicia',
      changedAt: '2026-07-14',
    },
  ],
  'casa-da-mae': [
    {
      id: 'h1',
      field: 'Configuração inicial',
      from: '—',
      to: 'Sem caixa comum · por responsabilidade · transparência total',
      changedBy: 'Lethicia',
      changedAt: '2026-07-01',
    },
  ],
}
