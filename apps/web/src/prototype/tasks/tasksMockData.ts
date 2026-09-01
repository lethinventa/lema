// Dados mockados da área de Tarefas (UC-TASK-*). Sem persistência real —
// suficiente pra testar lista, filtro por contexto, criação rápida e conclusão.

import type { HomeContext } from '../home/homeMockData'

export interface MockTask {
  id: string
  title: string
  context: HomeContext
  done: boolean
  dueLabel?: string
  assignee?: string
  recurring?: boolean
}

export const initialTasks: MockTask[] = [
  { id: 'tk1', title: 'Levar o carro pro conserto', context: 'personal', done: false, dueLabel: 'Hoje' },
  {
    id: 'tk2',
    title: 'Comprar presente de aniversário da Ana',
    context: 'shared',
    done: false,
    dueLabel: 'Amanhã',
  },
  {
    id: 'tk3',
    title: 'Pagar internet',
    context: 'personal',
    done: false,
    dueLabel: 'Sexta',
    recurring: true,
  },
  {
    id: 'tk4',
    title: 'Levar o lixo pra rua',
    context: 'group',
    done: false,
    assignee: 'Mateus',
    recurring: true,
  },
  { id: 'tk5', title: 'Marcar consulta do pet', context: 'shared', done: false },
  {
    id: 'tk6',
    title: 'Preparar apresentação do trabalho',
    context: 'personal',
    done: false,
    dueLabel: 'Quinta',
  },
  {
    id: 'tk7',
    title: 'Organizar a geladeira',
    context: 'group',
    done: true,
    assignee: 'Lethicia',
  },
  { id: 'tk8', title: 'Revisar lista de compras', context: 'group', done: true },
]
