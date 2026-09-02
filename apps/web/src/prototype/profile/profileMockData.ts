// Dados mockados de Perfil e Configurações (UC-USER-*, UC-AUTH-*). Sem
// persistência real.
//
// Modela só o suficiente pra testar a regra de UC-USER-004: quem é o único
// OWNER de um grupo não pode excluir a conta. Como o onboarding do
// protótipo sempre cria o grupo com a pessoa sozinha (nenhum convite foi
// aceito ainda), isso reflete o estado real do fluxo — não é um valor fixo
// arbitrário. Uma tela de Membros (UC-GROUP-006) resolveria isso de verdade,
// mas ainda não existe no protótipo.

import { mockGroup } from '../home/homeMockData'

export interface GroupMembership {
  groupId: string
  groupName: string
  role: 'OWNER' | 'MEMBER'
  memberCount: number
}

export const mockMemberships: GroupMembership[] = [{ groupId: mockGroup.id, groupName: mockGroup.name, role: 'OWNER', memberCount: 1 }]

export function findGroupsBlockingDeletion(memberships: GroupMembership[]) {
  return memberships.filter((m) => m.role === 'OWNER' && m.memberCount <= 1)
}
