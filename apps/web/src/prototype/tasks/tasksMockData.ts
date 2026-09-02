// Dados mockados da área de Tarefas (UC-TASK-*). Sem persistência real —
// suficiente pra testar lista, filtro por contexto, criação rápida e conclusão.
//
// dueDate é ISO real (não um label solto) — é o que permite a tarefa aparecer
// no Calendário (Agenda/Semana/Mês) como item "dia inteiro", ver
// calendarSelectors.ts. O label exibido (Hoje/Amanhã/...) é sempre derivado
// via formatRelativeDayLabel, nunca armazenado.

import type { HomeContext } from '../home/homeMockData'
import { addDays, TODAY_ISO } from '../calendar/dateUtils'
import { CURRENT_USER_ID, MATEUS_ID } from '../groups/groupsMockData'

export interface MockTask {
  id: string
  title: string
  context: HomeContext
  groupId?: string
  done: boolean
  dueDate?: string // ISO
  // Responsável (UC-TASK-005) — ids de groupsMockData.ts, só existe quando
  // context === 'group' (é o único caso com lista real de pessoas hoje).
  assigneeIds?: string[]
  recurring?: boolean
}

export const initialTasks: MockTask[] = [
  { id: 'tk1', title: 'Levar o carro pro conserto', context: 'personal', done: false, dueDate: TODAY_ISO },
  {
    id: 'tk2',
    title: 'Comprar presente de aniversário da Ana',
    context: 'shared',
    done: false,
    dueDate: addDays(TODAY_ISO, 1),
  },
  {
    id: 'tk3',
    title: 'Pagar internet',
    context: 'personal',
    done: false,
    dueDate: addDays(TODAY_ISO, 3),
    recurring: true,
  },
  {
    id: 'tk4',
    title: 'Levar o lixo pra rua',
    context: 'group',
    groupId: 'familia-duarte',
    done: false,
    assigneeIds: [MATEUS_ID],
    recurring: true,
  },
  { id: 'tk5', title: 'Marcar consulta do pet', context: 'shared', done: false },
  {
    id: 'tk6',
    title: 'Preparar apresentação do trabalho',
    context: 'personal',
    done: false,
    dueDate: addDays(TODAY_ISO, 2),
  },
  {
    id: 'tk7',
    title: 'Organizar a geladeira',
    context: 'group',
    groupId: 'familia-duarte',
    done: true,
    assigneeIds: [CURRENT_USER_ID],
  },
  { id: 'tk8', title: 'Revisar lista de compras', context: 'group', groupId: 'familia-duarte', done: true },
  {
    id: 'tk9',
    title: 'Levar a mãe ao médico',
    context: 'group',
    groupId: 'casa-da-mae',
    done: false,
    dueDate: addDays(TODAY_ISO, 1),
  },
  {
    id: 'tk10',
    title: 'Pagar conta de luz da mãe',
    context: 'group',
    groupId: 'casa-da-mae',
    done: false,
    recurring: true,
  },
]
