// Cálculos derivados de Objetivo/Submeta/GoalAllocation (UC-GOAL-001,
// UC-GOAL-007, UC-GOAL-008). Nada aqui é armazenado, sempre recalculado.

import { MOCK_TODAY } from '../finance/accountsMockData'
import type { MockTransaction } from '../finance/financeMockData'
import type { MockGoalAllocation } from './goalAllocationsMockData'
import type { MockGoal } from './goalsMockData'

const TODAY_ISO = MOCK_TODAY.toISOString().slice(0, 10)

export function getSubgoals(goalId: string, allGoals: MockGoal[]) {
  return allGoals.filter((g) => g.parentGoalId === goalId)
}

// Transações já registradas em Finanças e vinculadas a este objetivo — é
// isso que forma o "Pago" (ver nota em financeMockData.ts). Nunca editado
// aqui dentro, só em Finanças.
export function getGoalTransactions(goalId: string, transactions: MockTransaction[]) {
  return transactions.filter((t) => t.goalId === goalId && !t.deletedAt)
}

export function getPaidTotal(goalId: string, transactions: MockTransaction[]) {
  return getGoalTransactions(goalId, transactions).reduce((sum, t) => sum + t.amount, 0)
}

// custo estimado − soma de tudo que já está organizado (RESERVED + COMMITTED
// manuais + PAID derivado das transações vinculadas) — "restante a
// organizar", já documentado em UC-GOAL-007.
export function getAllocatedTotal(goalId: string, allocations: MockGoalAllocation[], transactions: MockTransaction[]) {
  const manual = allocations.filter((a) => a.goalId === goalId).reduce((sum, a) => sum + a.valor, 0)
  return manual + getPaidTotal(goalId, transactions)
}

// Progresso derivado (UC-GOAL-001): com submetas → média do progresso delas;
// sem submetas mas com custoEstimado → alocado ÷ custoEstimado; sem nenhum
// dos dois → cai no progresso manual (fallback).
export function getGoalProgress(
  goal: MockGoal,
  allGoals: MockGoal[],
  allocations: MockGoalAllocation[],
  transactions: MockTransaction[],
): number {
  if (goal.done) return 100

  const subgoals = getSubgoals(goal.id, allGoals)
  if (subgoals.length > 0) {
    const avg = subgoals.reduce((sum, sub) => sum + getGoalProgress(sub, allGoals, allocations, transactions), 0) / subgoals.length
    return Math.round(avg)
  }

  if (goal.custoEstimado && goal.custoEstimado > 0) {
    const allocated = getAllocatedTotal(goal.id, allocations, transactions)
    return Math.min(100, Math.round((allocated / goal.custoEstimado) * 100))
  }

  return goal.progress
}

function monthsBetween(fromIso: string, toIso: string) {
  const from = new Date(`${fromIso}T00:00:00`)
  const to = new Date(`${toIso}T00:00:00`)
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

export interface PaceInfo {
  idealPerMonth: number | null // null = não aplicável (falta custoEstimado/deadline) ou prazo vencido
  deadlinePassed: boolean
  goalMet: boolean
  behindPace: boolean // UC-GOAL-008: alocado < 90% do ritmo esperado
}

// UC-GOAL-008 — ideal por mês e aviso de ritmo. Só se aplica a objetivos
// financeiros diretos (com custoEstimado e deadline); submetas calculam a
// própria; o pai com submetas não tem esses campos diretos.
export function getPaceInfo(goal: MockGoal, allocations: MockGoalAllocation[], transactions: MockTransaction[]): PaceInfo {
  const notApplicable: PaceInfo = { idealPerMonth: null, deadlinePassed: false, goalMet: false, behindPace: false }
  if (!goal.custoEstimado || !goal.deadline) return notApplicable

  const allocated = getAllocatedTotal(goal.id, allocations, transactions)
  const goalMet = allocated >= goal.custoEstimado
  if (goalMet) return { ...notApplicable, goalMet: true }

  const monthsRemaining = monthsBetween(TODAY_ISO, goal.deadline)
  if (monthsRemaining < 0) return { ...notApplicable, deadlinePassed: true }

  const idealPerMonth = (goal.custoEstimado - allocated) / Math.max(1, monthsRemaining)

  const totalMonths = Math.max(1, monthsBetween(goal.createdAt, goal.deadline))
  const elapsedMonths = Math.max(0, monthsBetween(goal.createdAt, TODAY_ISO))
  const expectedByNow = goal.custoEstimado * Math.min(1, elapsedMonths / totalMonths)
  const behindPace = expectedByNow > 0 && allocated < expectedByNow * 0.9

  return { idealPerMonth, deadlinePassed: false, goalMet: false, behindPace }
}
