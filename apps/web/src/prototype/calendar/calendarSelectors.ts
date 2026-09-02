// Expansão de ocorrências de compromissos recorrentes (UC-CAL-007). Nada aqui
// é armazenado — ocorrências são sempre recalculadas pra uma janela de datas
// visível (semana/mês), exceto exceções (ocorrência editada ou excluída
// individualmente), que ficam registradas no evento (ver calendarMockData.ts).

import type { MockTask } from '../tasks/tasksMockData'
import { addDays, getWeekday } from './dateUtils'
import type { MockEvent, MockEventRecurrence } from './calendarMockData'

export interface EventOccurrence {
  event: MockEvent
  date: string // ISO da ocorrência concreta (pode diferir de event.date se for override)
  occurrenceKey: string // estável — usar como key de lista e como alvo de edição/exclusão
  isRecurring: boolean
}

function dayOfMonth(iso: string) {
  return Number(iso.slice(8, 10))
}

function occursOn(root: MockEvent, iso: string): boolean {
  if (!root.recurrence) return root.date === iso
  if (iso < root.date) return false
  if (root.recurrence.endDate && iso > root.recurrence.endDate) return false
  if (root.excludedDates?.includes(iso)) return false
  switch (root.recurrence.freq) {
    case 'daily':
      return true
    case 'weekly':
      return getWeekday(iso) === getWeekday(root.date)
    case 'monthly':
      return dayOfMonth(iso) === dayOfMonth(root.date)
    default:
      return false
  }
}

// Percorre dia a dia a janela pedida — janelas aqui são no máximo ~42 dias
// (grade de mês), então o custo é irrelevante pro protótipo.
//
// Uma exceção "editada" (override, seriesId setado) é checada ANTES do
// padrão de recorrência — sua presença nessa data já significa "ocorre,
// modificada", independente de excludedDates. excludedDates só existe pra
// exceções "excluídas sem substituto" (ver applyOccurrenceDelete).
export function expandOccurrences(events: MockEvent[], startIso: string, endIso: string): EventOccurrence[] {
  const roots = events.filter((e) => !e.seriesId)
  const overrides = events.filter((e) => e.seriesId)
  const result: EventOccurrence[] = []

  for (const root of roots) {
    let day = startIso
    while (day <= endIso) {
      const override = overrides.find((o) => o.seriesId === root.id && o.date === day)
      if (override) {
        result.push({ event: override, date: day, occurrenceKey: `${root.id}:${day}`, isRecurring: !!root.recurrence })
      } else if (occursOn(root, day)) {
        result.push({ event: root, date: day, occurrenceKey: `${root.id}:${day}`, isRecurring: !!root.recurrence })
      }
      day = addDays(day, 1)
    }
  }

  return result.sort((a, b) => (a.date === b.date ? a.event.time.localeCompare(b.event.time) : a.date.localeCompare(b.date)))
}

export function getOccurrencesForDate(events: MockEvent[], iso: string) {
  return expandOccurrences(events, iso, iso)
}

export function getTasksForDate(tasks: MockTask[], iso: string) {
  return tasks.filter((t) => t.dueDate === iso)
}

function uniq(values: string[]) {
  return Array.from(new Set(values))
}

export interface EventEditInput {
  title: string
  context: MockEvent['context']
  groupId?: string
  date: string
  time: string
  endTime?: string
  location?: string
  participants?: string[]
  recurrence?: MockEventRecurrence
}

// Edita a configuração da série (raiz): passa a valer pras próximas
// ocorrências, sem afetar as já geradas (UC-CAL-007). Se a recorrência for
// removida (série vira um compromisso único), as exceções da série deixam de
// fazer sentido e são descartadas junto.
export function applySeriesEdit(events: MockEvent[], rootId: string, input: EventEditInput): MockEvent[] {
  const keepOverrides = !!input.recurrence
  return events
    .filter((e) => keepOverrides || e.seriesId !== rootId)
    .map((e) => (e.id === rootId ? { id: rootId, ...input } : e))
}

// Edita só esta ocorrência: materializa uma exceção (override) associada à
// série, sem tocar na raiz nem nas demais ocorrências.
export function applyOccurrenceEdit(
  events: MockEvent[],
  rootId: string,
  occurrenceDate: string,
  input: EventEditInput,
): MockEvent[] {
  const withoutOldOverride = events.filter((e) => !(e.seriesId === rootId && e.date === occurrenceDate))
  const overrideEvent: MockEvent = {
    id: `${rootId}-ov-${occurrenceDate}`,
    title: input.title,
    context: input.context,
    groupId: input.groupId,
    date: occurrenceDate,
    time: input.time,
    endTime: input.endTime,
    location: input.location,
    participants: input.participants,
    seriesId: rootId,
  }
  return [...withoutOldOverride, overrideEvent]
}

export function applySeriesDelete(events: MockEvent[], rootId: string): MockEvent[] {
  return events.filter((e) => e.id !== rootId && e.seriesId !== rootId)
}

// Exclui só esta ocorrência: some com o override (se houver) e marca a data
// como excluída na raiz, pra ela não voltar a ser gerada pelo padrão.
export function applyOccurrenceDelete(events: MockEvent[], rootId: string, occurrenceDate: string): MockEvent[] {
  const withoutOverride = events.filter((e) => !(e.seriesId === rootId && e.date === occurrenceDate))
  return withoutOverride.map((e) =>
    e.id === rootId ? { ...e, excludedDates: uniq([...(e.excludedDates ?? []), occurrenceDate]) } : e,
  )
}
