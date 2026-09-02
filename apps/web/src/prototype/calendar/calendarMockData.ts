// Dados mockados da área de Calendário (UC-CAL-*). Sem persistência real —
// suficiente pra testar visões Agenda/Semana/Mês, recorrência real e o
// vínculo com tarefas com prazo.
//
// Diferente de tarefas, um compromisso sempre tem data/horário e nunca tem
// estado de conclusão (UC-CAL-001) — por isso não existe "toggle done" aqui.

import { MATEUS_ID } from '../groups/groupsMockData'
import type { HomeContext } from '../home/homeMockData'
import { addDays, addMonths, TODAY_ISO } from './dateUtils'

export type RecurrenceFreq = 'daily' | 'weekly' | 'monthly'

export interface MockEventRecurrence {
  freq: RecurrenceFreq
  endDate?: string // ISO — recorrência sem data final é o padrão (UC-CAL-007)
}

export interface MockEvent {
  id: string
  title: string
  context: HomeContext
  groupId?: string
  date: string // ISO — data da(s) ocorrência(s), ou da 1ª ocorrência se recorrente
  time: string
  endTime?: string
  location?: string
  // Nome livre (UC-CAL-004: convidar alguém sem acesso prévio já concede
  // acesso — só faz sentido pra PRIVATE/SHARED, sem uma lista real de
  // pessoas nesses contextos ainda).
  participants?: string[]
  // Ids de groupsMockData.ts — usado quando context === 'group', onde o
  // participante precisa já ser membro do grupo (UC-CAL-004).
  participantIds?: string[]
  recurrence?: MockEventRecurrence
  // Só existe na raiz da série: datas de ocorrências excluídas ou substituídas
  // por uma versão editada (ver calendarSelectors.ts).
  excludedDates?: string[]
  // Presente quando este evento é uma ocorrência específica editada
  // individualmente (materializada) — aponta pra série de origem.
  seriesId?: string
}

const condominioStart = addDays(TODAY_ISO, 3)
const yogaStart = addDays(TODAY_ISO, 4)

export const initialEvents: MockEvent[] = [
  {
    id: 'ev1',
    title: 'Reunião de trabalho',
    context: 'personal',
    date: TODAY_ISO,
    time: '09:00',
    endTime: '10:00',
    location: 'Escritório',
  },
  {
    id: 'ev2',
    title: 'Consulta médica',
    context: 'personal',
    date: TODAY_ISO,
    time: '14:00',
    endTime: '15:00',
  },
  {
    id: 'ev3',
    title: 'Jantar em família',
    context: 'group',
    groupId: 'familia-duarte',
    date: TODAY_ISO,
    time: '20:00',
    endTime: '22:00',
  },
  {
    id: 'ev4',
    title: 'Aniversário da Ana',
    context: 'shared',
    date: addDays(TODAY_ISO, 1),
    time: '19:00',
    endTime: '23:00',
    location: 'Casa da Ana',
    participants: ['Ana'],
  },
  {
    id: 'ev5',
    title: 'Levar o carro na revisão',
    context: 'personal',
    date: addDays(TODAY_ISO, 3),
    time: '10:00',
    endTime: '11:00',
  },
  {
    id: 'ev6',
    title: 'Reunião de condomínio',
    context: 'group',
    groupId: 'familia-duarte',
    date: condominioStart,
    time: '19:30',
    endTime: '20:30',
    recurrence: { freq: 'monthly' },
  },
  // Ocorrência de ev6 editada individualmente no mês seguinte (horário
  // mudou) — demonstra a exceção de série descrita na UC-CAL-007.
  {
    id: 'ev6-override-1',
    title: 'Reunião de condomínio',
    context: 'group',
    groupId: 'familia-duarte',
    date: addMonths(condominioStart, 1),
    time: '20:00',
    endTime: '21:00',
    seriesId: 'ev6',
  },
  {
    id: 'ev7',
    title: 'Yoga',
    context: 'personal',
    date: yogaStart,
    time: '08:00',
    endTime: '09:00',
    recurrence: { freq: 'weekly' },
    // Ocorrência cancelada 3 semanas depois do início — exceção sem substituto.
    excludedDates: [addDays(yogaStart, 21)],
  },
  {
    id: 'ev8',
    title: 'Almoço em família',
    context: 'group',
    groupId: 'familia-duarte',
    date: addDays(TODAY_ISO, 5),
    time: '12:30',
    endTime: '14:00',
    participantIds: [MATEUS_ID],
  },
  {
    id: 'ev9',
    title: 'Consulta da mãe',
    context: 'group',
    groupId: 'casa-da-mae',
    date: addDays(TODAY_ISO, 2),
    time: '11:00',
    endTime: '12:00',
    location: 'Clínica São Lucas',
  },
]
