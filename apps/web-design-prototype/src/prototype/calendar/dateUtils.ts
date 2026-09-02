// Utilidades de data compartilhadas por Calendário e Tarefas (datas reais
// substituindo os antigos labels soltos "Hoje"/"Sexta"). Sempre trabalha com
// strings ISO (YYYY-MM-DD) — segue a mesma convenção de accountsMockData.ts
// (new Date(y, m, d) local + toISOString().slice(0,10)) pra não introduzir
// um jeito diferente de lidar com fuso horário.

import { MOCK_TODAY } from '../finance/accountsMockData'

export const TODAY_ISO = MOCK_TODAY.toISOString().slice(0, 10)

function toIso(date: Date) {
  return date.toISOString().slice(0, 10)
}

function parseIso(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return { year, month, day }
}

export function addDays(iso: string, days: number) {
  const { year, month, day } = parseIso(iso)
  return toIso(new Date(year, month - 1, day + days))
}

export function addMonths(iso: string, months: number) {
  const { year, month, day } = parseIso(iso)
  return toIso(new Date(year, month - 1 + months, day))
}

export function diffDays(fromIso: string, toIsoStr: string) {
  const { year: y1, month: m1, day: d1 } = parseIso(fromIso)
  const { year: y2, month: m2, day: d2 } = parseIso(toIsoStr)
  const a = new Date(y1, m1 - 1, d1).getTime()
  const b = new Date(y2, m2 - 1, d2).getTime()
  return Math.round((b - a) / 86400000)
}

export function getWeekday(iso: string) {
  const { year, month, day } = parseIso(iso)
  return new Date(year, month - 1, day).getDay() // 0 = domingo
}

const WEEKDAY_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const WEEKDAY_LONG = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]
const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function formatWeekdayShort(iso: string) {
  return WEEKDAY_SHORT[getWeekday(iso)]
}

export function formatDayNumber(iso: string) {
  return parseIso(iso).day
}

// "Hoje" / "Amanhã" / nome do dia (essa semana) / "12 de setembro" (além disso).
export function formatRelativeDayLabel(iso: string) {
  const diff = diffDays(TODAY_ISO, iso)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  if (diff === -1) return 'Ontem'
  if (diff > 1 && diff < 7) return WEEKDAY_LONG[getWeekday(iso)]
  const { day, month } = parseIso(iso)
  return `${day} de ${MONTH_NAMES[month - 1].toLowerCase()}`
}

export function formatMonthYearLabel(iso: string) {
  const { year, month } = parseIso(iso)
  return `${MONTH_NAMES[month - 1]} ${year}`
}

// Semana começa no domingo (convenção padrão do Google Calendar em pt-BR).
export function getWeekStart(iso: string) {
  return addDays(iso, -getWeekday(iso))
}

export function getWeekDays(iso: string) {
  const start = getWeekStart(iso)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export interface MonthGridDay {
  iso: string
  inMonth: boolean
}

// Grade de 6 semanas (42 dias) — sempre fixa pra não pular de altura entre meses.
export function getMonthGridDays(iso: string): MonthGridDay[] {
  const { year, month } = parseIso(iso)
  const firstOfMonth = toIso(new Date(year, month - 1, 1))
  const start = getWeekStart(firstOfMonth)
  return Array.from({ length: 42 }, (_, i) => {
    const dayIso = addDays(start, i)
    return { iso: dayIso, inMonth: parseIso(dayIso).month === month }
  })
}

export function timeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function minutesToTime(minutes: number) {
  const total = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
