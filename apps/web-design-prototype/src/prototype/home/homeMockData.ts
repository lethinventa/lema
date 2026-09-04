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

// Usuário pertence a mais de um grupo (ex.: a família e o cuidado da mãe) —
// UC-TODAY-002 exige que o contexto de grupo seja escolhido um por vez, não
// que só exista um grupo possível. Todo item com context 'group' referencia
// um destes pelo campo groupId.
export const mockGroups: MockGroup[] = [
  { id: 'familia-duarte', name: 'Família Duarte' },
  { id: 'casa-da-mae', name: 'Casa da Mãe' },
]

export interface TaskItem {
  id: string
  title: string
  context: HomeContext
  groupId?: string
  done: boolean
}

export interface CalendarItem {
  id: string
  title: string
  context: HomeContext
  groupId?: string
  time: string
  location?: string
}

export interface GoalItem {
  id: string
  title: string
  context: HomeContext
  groupId?: string
  progress: number
  progressLabel: string
}

export interface FinanceItem {
  id: string
  title: string
  context: HomeContext
  groupId?: string
  amount: string
}

export const mockTasks: TaskItem[] = [
  { id: 't1', title: 'Levar o carro pro conserto', context: 'personal', done: false },
  { id: 't2', title: 'Comprar presente de aniversário da Ana', context: 'shared', done: false },
  { id: 't3', title: 'Organizar a geladeira', context: 'group', groupId: 'familia-duarte', done: true },
  { id: 't4', title: 'Levar a mãe ao médico', context: 'group', groupId: 'casa-da-mae', done: false },
]

export const mockCalendar: CalendarItem[] = [
  { id: 'c1', title: 'Consulta médica', context: 'personal', time: '14:00', location: 'Clínica Vida' },
  { id: 'c2', title: 'Jantar em família', context: 'group', groupId: 'familia-duarte', time: '19:30', location: 'Casa da mãe' },
]

export const mockGoals: GoalItem[] = [
  { id: 'g1', title: 'Viagem para a praia', context: 'shared', progress: 64, progressLabel: 'R$ 3.200 de R$ 5.000' },
]

export const mockFinance: FinanceItem[] = [
  { id: 'f1', title: 'Conta de luz pendente', context: 'group', groupId: 'familia-duarte', amount: 'R$ 210,00' },
  { id: 'f2', title: 'Dividir jantar de sexta', context: 'shared', amount: 'R$ 84,50' },
  { id: 'f3', title: 'Farmácia da mãe', context: 'group', groupId: 'casa-da-mae', amount: 'R$ 68,00' },
]
