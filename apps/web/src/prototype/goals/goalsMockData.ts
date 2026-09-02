// Dados mockados da área de Objetivos (UC-GOAL-*). Sem persistência real —
// suficiente pra testar lista, progresso, criação rápida, conclusão, submetas
// e o modelo financeiro (GoalAllocation, ver goalAllocationsMockData.ts).
//
// UC-GOAL-001: todo objetivo nasce com progresso 0%. UC-GOAL-003: a conclusão
// é permanente — por isso não existe "reabrir" aqui, diferente de tarefas.

import type { HomeContext } from '../home/homeMockData'

export interface MockGoal {
  id: string
  title: string
  context: HomeContext
  groupId?: string
  done: boolean
  // Progresso manual — só é usado quando o objetivo não tem custoEstimado
  // nem submetas (fallback, ver UC-GOAL-001). Nos demais casos, o progresso
  // exibido é sempre derivado (goalsSelectors.ts), nunca este campo.
  progress: number
  deadline?: string // ISO — pré-requisito pra "ideal por mês" (UC-GOAL-008)
  category?: string
  custoEstimado?: number
  createdAt: string // ISO — usado pro cálculo de ritmo esperado (UC-GOAL-008)
  parentGoalId?: string // submeta (Goal→Goal, 1 nível — PD-007)
}

export const initialGoals: MockGoal[] = [
  {
    id: 'gl1',
    title: 'Viagem para a praia',
    context: 'shared',
    done: false,
    progress: 0,
    deadline: '2026-12-31',
    category: 'Viagem',
    custoEstimado: 5000,
    createdAt: '2026-03-01',
  },
  {
    id: 'gl2',
    title: 'Trocar o carro',
    context: 'personal',
    done: false,
    progress: 30,
    category: 'Financeiro',
    createdAt: '2026-06-01',
  },
  {
    id: 'gl3',
    title: 'Reforma da cozinha',
    context: 'group',
    groupId: 'familia-duarte',
    done: false,
    progress: 0,
    deadline: '2026-11-30',
    category: 'Casa',
    createdAt: '2026-05-01',
  },
  {
    id: 'gl3a',
    title: 'Marcenaria',
    context: 'group',
    groupId: 'familia-duarte',
    done: false,
    progress: 0,
    category: 'Casa',
    custoEstimado: 8000,
    createdAt: '2026-05-01',
    parentGoalId: 'gl3',
  },
  {
    id: 'gl3b',
    title: 'Eletrodomésticos',
    context: 'group',
    groupId: 'familia-duarte',
    done: false,
    progress: 0,
    category: 'Casa',
    custoEstimado: 6000,
    createdAt: '2026-05-01',
    parentGoalId: 'gl3',
  },
  {
    id: 'gl3c',
    title: 'Mão de obra',
    context: 'group',
    groupId: 'familia-duarte',
    done: false,
    progress: 0,
    category: 'Casa',
    custoEstimado: 3000,
    createdAt: '2026-05-01',
    parentGoalId: 'gl3',
  },
  {
    id: 'gl4',
    title: 'Fundo de emergência',
    context: 'shared',
    done: false,
    progress: 0,
    deadline: '2026-12-31',
    category: 'Financeiro',
    custoEstimado: 10000,
    createdAt: '2026-01-05',
  },
  {
    id: 'gl5',
    title: 'Correr 5km sem parar',
    context: 'personal',
    done: true,
    progress: 100,
    category: 'Saúde',
    createdAt: '2026-04-01',
  },
  {
    id: 'gl6',
    title: 'Trocar o colchão da mãe',
    context: 'group',
    groupId: 'casa-da-mae',
    done: false,
    progress: 0,
    category: 'Casa',
    custoEstimado: 1800,
    createdAt: '2026-07-01',
  },
]
