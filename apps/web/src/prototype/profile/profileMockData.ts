// Dados mockados de Perfil e Configurações (UC-USER-*, UC-AUTH-*). Sem
// persistência real.
//
// Modela só o suficiente pra testar a regra de UC-USER-004: quem é o único
// OWNER de um grupo não pode excluir a conta. Como o onboarding do
// protótipo sempre cria o grupo com a pessoa sozinha (nenhum convite foi
// aceito ainda), isso reflete o estado real do fluxo — não é um valor fixo
// arbitrário. Uma tela de Membros (UC-GROUP-006) resolveria isso de verdade,
// mas ainda não existe no protótipo.

import { mockGroups } from '../home/homeMockData'

export interface GroupMembership {
  groupId: string
  groupName: string
  role: 'OWNER' | 'MEMBER'
  memberCount: number
}

// A pessoa é OWNER solo dos dois grupos que criou no onboarding — nenhum
// convite foi aceito em nenhum deles ainda, então ambos bloqueiam exclusão
// de conta (ver findGroupsBlockingDeletion).
export const mockMemberships: GroupMembership[] = mockGroups.map((g) => ({
  groupId: g.id,
  groupName: g.name,
  role: 'OWNER',
  memberCount: 1,
}))

export function findGroupsBlockingDeletion(memberships: GroupMembership[]) {
  return memberships.filter((m) => m.role === 'OWNER' && m.memberCount <= 1)
}
