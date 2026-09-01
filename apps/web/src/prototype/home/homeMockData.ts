// Dados mockados para prototipar a Home (JRN-006). Sem persistência real —
// só o suficiente pra testar filtro por contexto e a hierarquia das seções.

export type HomeContext = 'personal' | 'group' | 'shared'

export interface MockGroup {
  id: string
  name: string
}

export const mockUser = {
  firstName: 'Lethicia',
}

export const mockGroup: MockGroup = {
  id: 'familia-duarte',
  name: 'Família Duarte',
}

export interface TaskItem {
  id: string
  title: string
  context: HomeContext
  done: boolean
}

export interface CalendarItem {
  id: string
  title: string
  context: HomeContext
  time: string
}

export interface GoalItem {
  id: string
  title: string
  context: HomeContext
  progress: number
  progressLabel: string
}

export interface FinanceItem {
  id: string
  title: string
  context: HomeContext
  amount: string
}

export const mockTasks: TaskItem[] = [
  { id: 't1', title: 'Levar o carro pro conserto', context: 'personal', done: false },
  { id: 't2', title: 'Comprar presente de aniversário da Ana', context: 'shared', done: false },
  { id: 't3', title: 'Organizar a geladeira', context: 'group', done: true },
]

export const mockCalendar: CalendarItem[] = [
  { id: 'c1', title: 'Consulta médica', context: 'personal', time: '14:00' },
  { id: 'c2', title: 'Jantar em família', context: 'group', time: '20:00' },
]

export const mockGoals: GoalItem[] = [
  { id: 'g1', title: 'Viagem para a praia', context: 'shared', progress: 64, progressLabel: 'R$ 3.200 de R$ 5.000' },
]

export const mockFinance: FinanceItem[] = [
  { id: 'f1', title: 'Conta de luz pendente', context: 'group', amount: 'R$ 210,00' },
  { id: 'f2', title: 'Dividir jantar de sexta', context: 'shared', amount: 'R$ 84,50' },
]
