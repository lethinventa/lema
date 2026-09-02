// Dados mockados da área de Grupos / Família (UC-GROUP-002/004/005/006/008).
// Sem persistência real.
//
// Como cada tela guarda seu próprio estado local (sem store compartilhado),
// mudanças feitas em Membros não aparecem em outras telas ao navegar — mesma
// limitação já documentada em CLAUDE.md, não uma pendência nova.

import { mockGroups, mockUser } from '../home/homeMockData'

export type MemberRole = 'OWNER' | 'MEMBER'

export interface GroupMember {
  id: string
  name: string
  role: MemberRole
}

export interface PendingInvite {
  id: string
  code: string
}

export const CURRENT_USER_ID = 'me'
// Segundo membro real de "Família Duarte" — dá pra atribuir tarefas/
// compromissos a alguém além de si mesma (Fase 3 do plano multi-grupo).
// Referenciado por assigneeIds/participantIds em tasksMockData.ts e
// calendarMockData.ts, então o id precisa bater.
export const MATEUS_ID = 'mateus'

// Estado inicial: "Casa da Mãe" tem só quem a criou (nenhum convite aceito
// ainda — a mãe provavelmente nem usa o Lema, ver análise crítica anterior).
// "Família Duarte" já nasce com o cônjuge como MEMBER, pra refletir um
// núcleo familiar de verdade desde o primeiro acesso.
export const initialMembersByGroup: Record<string, GroupMember[]> = {
  'familia-duarte': [
    { id: CURRENT_USER_ID, name: mockUser.firstName, role: 'OWNER' },
    { id: MATEUS_ID, name: 'Mateus', role: 'MEMBER' },
  ],
  'casa-da-mae': [{ id: CURRENT_USER_ID, name: mockUser.firstName, role: 'OWNER' }],
}

export const initialInvitesByGroup: Record<string, PendingInvite[]> = Object.fromEntries(
  mockGroups.map((g) => [g.id, []]),
)

// Resolve ids de responsável/participante (assigneeIds, participantIds) pra
// nomes de exibição — usado pelas telas de Tarefas e Calendário.
export function resolveMemberNames(groupId: string | undefined, memberIds: string[] | undefined) {
  if (!groupId || !memberIds?.length) return []
  const members = initialMembersByGroup[groupId] ?? []
  return memberIds.map((id) => members.find((m) => m.id === id)?.name ?? id)
}

export function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function isSoleOwner(members: GroupMember[], memberId: string) {
  const member = members.find((m) => m.id === memberId)
  if (member?.role !== 'OWNER') return false
  return members.filter((m) => m.role === 'OWNER').length <= 1
}

// Usado por Perfil → Excluir conta (UC-USER-004): a pessoa não pode excluir
// a conta enquanto for a única OWNER de algum grupo.
export function findGroupsBlockingDeletion() {
  return mockGroups.filter((g) => isSoleOwner(initialMembersByGroup[g.id] ?? [], CURRENT_USER_ID))
}
