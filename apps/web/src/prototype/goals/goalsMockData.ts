// Dados mockados da área de Objetivos (UC-GOAL-*). Sem persistência real —
// suficiente pra testar lista, progresso, criação rápida e conclusão.
//
// UC-GOAL-001: todo objetivo nasce com progresso 0%. UC-GOAL-003: a conclusão
// é permanente — por isso não existe "reabrir" aqui, diferente de tarefas.
// Submetas e GoalAllocations (UC-GOAL-007) ficam de fora desta rodada.

import type { HomeContext } from '../home/homeMockData'

export interface MockGoal {
  id: string
  title: string
  context: HomeContext
  done: boolean
  progress: number
  deadline?: string
  category?: string
}

export const initialGoals: MockGoal[] = [
  {
    id: 'gl1',
    title: 'Viagem para a praia',
    context: 'shared',
    done: false,
    progress: 64,
    deadline: 'Dez/2026',
    category: 'Viagem',
  },
  { id: 'gl2', title: 'Trocar o carro', context: 'personal', done: false, progress: 30, category: 'Financeiro' },
  {
    id: 'gl3',
    title: 'Reforma da cozinha',
    context: 'group',
    done: false,
    progress: 85,
    deadline: 'Nov/2026',
    category: 'Casa',
  },
  { id: 'gl4', title: 'Fundo de emergência', context: 'shared', done: false, progress: 45, category: 'Financeiro' },
  { id: 'gl5', title: 'Correr 5km sem parar', context: 'personal', done: true, progress: 100, category: 'Saúde' },
]
