// Dados mockados da área de Calendário (UC-CAL-*). Sem persistência real —
// suficiente pra testar agenda agrupada por dia, filtro por contexto e criação rápida.
//
// Diferente de tarefas, um compromisso sempre tem data/horário e nunca tem
// estado de conclusão (UC-CAL-001) — por isso não existe "toggle done" aqui.

import type { HomeContext } from '../home/homeMockData'

export interface MockEvent {
  id: string
  title: string
  context: HomeContext
  dayLabel: string
  time: string
  location?: string
  participant?: string
  recurring?: boolean
}

export const initialEvents: MockEvent[] = [
  { id: 'ev1', title: 'Reunião de trabalho', context: 'personal', dayLabel: 'Hoje', time: '09:00', location: 'Escritório' },
  { id: 'ev2', title: 'Consulta médica', context: 'personal', dayLabel: 'Hoje', time: '14:00' },
  { id: 'ev3', title: 'Jantar em família', context: 'group', dayLabel: 'Hoje', time: '20:00' },
  { id: 'ev4', title: 'Aniversário da Ana', context: 'shared', dayLabel: 'Amanhã', time: '19:00', location: 'Casa da Ana' },
  { id: 'ev5', title: 'Levar o carro na revisão', context: 'personal', dayLabel: 'Sexta', time: '10:00' },
  { id: 'ev6', title: 'Reunião de condomínio', context: 'group', dayLabel: 'Sexta', time: '19:30', recurring: true },
  { id: 'ev7', title: 'Yoga', context: 'personal', dayLabel: 'Sábado', time: '08:00', recurring: true },
  {
    id: 'ev8',
    title: 'Almoço em família',
    context: 'group',
    dayLabel: 'Domingo',
    time: '12:30',
    participant: 'Mateus',
  },
]
