// Dados mockados da área de Grupos / Família (UC-GROUP-002/004/005/006/008).
// Sem persistência real.
//
// Estado inicial: cada grupo tem só quem o criou, como OWNER — reflete o
// onboarding do protótipo, onde nenhum convite ainda foi aceito. Como cada
// tela guarda seu próprio estado local (sem store compartilhado), promover
// alguém aqui não muda o que "Excluir conta" vê ao navegar pra lá depois —
// mesma limitação já documentada em CLAUDE.md, não uma pendência nova.

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

export const initialMembersByGroup: Record<string, GroupMember[]> = Object.fromEntries(
  mockGroups.map((g) => [g.id, [{ id: CURRENT_USER_ID, name: mockUser.firstName, role: 'OWNER' as MemberRole }]]),
)

export const initialInvitesByGroup: Record<string, PendingInvite[]> = Object.fromEntries(
  mockGroups.map((g) => [g.id, []]),
)

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
