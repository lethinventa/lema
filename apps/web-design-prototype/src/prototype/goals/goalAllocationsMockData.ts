// GoalAllocation (UC-GOAL-007, PD-007) — valor associado a um objetivo/submeta
// num dos três estados financeiros. PAID nunca é criado aqui: ele é sempre
// derivado ao vivo das Transactions com goalId === este objetivo (ver
// financeMockData.ts e goalsSelectors.ts) — evita ter o mesmo dinheiro
// digitado duas vezes, uma em Finanças e outra dentro do objetivo. Este
// arquivo guarda só RESERVED/COMMITTED, que por definição ainda não têm
// transação nenhuma por trás.

export type AllocationStatus = 'RESERVED' | 'COMMITTED'

export interface MockGoalAllocation {
  id: string
  goalId: string
  valor: number
  estado: AllocationStatus
  documentId?: string // opcional, só quando estado === 'COMMITTED'
}

export const initialGoalAllocations: MockGoalAllocation[] = [
  // Viagem para a praia (gl1) — parte já paga (ver tx16 em financeMockData.ts),
  // parte só reservada ainda.
  { id: 'ga2', goalId: 'gl1', valor: 1200, estado: 'RESERVED' },

  // Reforma da cozinha (gl3) — submetas. Marcenaria (gl3a) e mão de obra
  // (gl3c) já têm parte paga via transação (tx17/tx18); eletrodomésticos
  // (gl3b) ainda está só reservado.
  { id: 'ga4', goalId: 'gl3b', valor: 6000, estado: 'RESERVED' },

  // Fundo de emergência (gl4) — atrasado em relação ao ritmo esperado.
  { id: 'ga6', goalId: 'gl4', valor: 2000, estado: 'RESERVED' },
  { id: 'ga7', goalId: 'gl4', valor: 500, estado: 'COMMITTED' },
]
