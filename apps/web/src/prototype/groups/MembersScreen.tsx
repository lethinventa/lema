import { ChevronRight, Check, Crown, LogOut, Plus, UserMinus, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { splitRuleLabel, transparencyLabel } from '../components/financeArrangementOptions'
import { TextField } from '../components/TextField'
import { Tile } from '../components/Tile'
import { getInitials, getPersonColor } from '../components/palette'
import { mockGroups } from '../home/homeMockData'
import { initialGroupArrangements } from './groupFinanceMockData'
import {
  CURRENT_USER_ID,
  generateInviteCode,
  initialInvitesByGroup,
  initialMembersByGroup,
  isSoleOwner,
  type GroupMember,
  type PendingInvite,
} from './groupsMockData'

function MemberRow({
  member,
  isOwner,
  canManage,
  onPromote,
  onDemote,
  onRemove,
}: {
  member: GroupMember
  isOwner: boolean
  canManage: boolean
  onPromote: () => void
  onDemote: () => void
  onRemove: () => void
}) {
  const isMe = member.id === CURRENT_USER_ID
  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-[13px] font-extrabold text-white"
        style={{ backgroundColor: getPersonColor(member.name) }}
      >
        {getInitials(member.name)}
      </span>
      <div className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[14px] font-semibold text-ink">{member.name}</span>
          {isMe ? <span className="text-[12px] font-medium text-ink-faint">(você)</span> : null}
        </span>
        <span
          className={`mt-0.5 inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11px] font-bold ${
            member.role === 'OWNER' ? 'bg-sun-bg text-sun-fg' : 'bg-surface-muted text-ink-muted'
          }`}
        >
          {member.role === 'OWNER' ? <Crown size={11} strokeWidth={2.6} /> : null}
          {member.role === 'OWNER' ? 'Responsável (OWNER)' : 'Membro'}
        </span>
      </div>
      {canManage ? (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={member.role === 'OWNER' ? onDemote : onPromote}
            title={member.role === 'OWNER' ? 'Rebaixar a Membro' : 'Promover a OWNER'}
            className="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-muted text-ink-muted transition active:scale-90"
          >
            <Crown size={15} strokeWidth={2.2} />
          </button>
          {!isMe ? (
            <button
              type="button"
              onClick={onRemove}
              title="Remover do grupo"
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-danger/10 text-danger transition active:scale-90"
            >
              <UserMinus size={15} strokeWidth={2.2} />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function MembersScreen() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const group = mockGroups.find((g) => g.id === groupId)
  const arrangement = initialGroupArrangements[groupId ?? '']

  const [members, setMembers] = useState<GroupMember[]>(() => initialMembersByGroup[groupId ?? ''] ?? [])
  const [invites, setInvites] = useState<PendingInvite[]>(() => initialInvitesByGroup[groupId ?? ''] ?? [])
  const [inviting, setInviting] = useState(false)
  const [inviteeName, setInviteeName] = useState('')
  const [leaveBlocked, setLeaveBlocked] = useState(false)

  if (!group) {
    return <Navigate to="/perfil" replace />
  }

  const me = members.find((m) => m.id === CURRENT_USER_ID)
  const canManage = me?.role === 'OWNER'

  function handlePromote(memberId: string) {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: 'OWNER' } : m)))
  }

  function handleDemote(memberId: string) {
    if (isSoleOwner(members, memberId)) return
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: 'MEMBER' } : m)))
  }

  function handleRemove(memberId: string) {
    if (isSoleOwner(members, memberId)) return
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  function handleLeaveGroup() {
    if (isSoleOwner(members, CURRENT_USER_ID)) {
      setLeaveBlocked(true)
      return
    }
    navigate('/perfil')
  }

  function handleCreateInvite() {
    setInvites((prev) => [...prev, { id: `inv-${Date.now()}`, code: generateInviteCode() }])
    setInviteeName('')
    setInviting(false)
  }

  function handleCancelInvite(id: string) {
    setInvites((prev) => prev.filter((inv) => inv.id !== id))
  }

  // Sem um segundo usuário de verdade neste protótipo, isso simula o efeito
  // de UC-GROUP-003 (aceitar convite) — só pra tornar promover/remover
  // testável com mais de uma pessoa no grupo.
  function handleSimulateAccept(invite: PendingInvite) {
    setMembers((prev) => [...prev, { id: invite.id, name: `Convidado ${invite.code}`, role: 'MEMBER' }])
    setInvites((prev) => prev.filter((inv) => inv.id !== invite.id))
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader
        title={group.name}
        subtitle={`${members.length} membro${members.length > 1 ? 's' : ''}`}
        to="/perfil"
      />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <Tile>
          <span className="mb-1 block text-[15px] font-bold text-ink">Membros</span>
          <div className="flex flex-col divide-y divide-line">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                isOwner={member.role === 'OWNER'}
                canManage={canManage}
                onPromote={() => handlePromote(member.id)}
                onDemote={() => handleDemote(member.id)}
                onRemove={() => handleRemove(member.id)}
              />
            ))}
          </div>
        </Tile>

        <Tile className="mt-3 p-0">
          <button
            type="button"
            onClick={() => navigate(`/perfil/grupos/${group.id}/financas`)}
            className="flex w-full items-center gap-3 px-4 py-4 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-accent-soft text-accent">
              <Wallet size={17} strokeWidth={2.4} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">Configuração financeira</span>
              <span className="block text-[12px] text-ink-faint">
                {arrangement ? `${splitRuleLabel(arrangement.splitRule)} · ${transparencyLabel(arrangement.transparency)}` : 'Ainda não configurada'}
              </span>
            </span>
            <ChevronRight size={18} strokeWidth={2.2} className="shrink-0 text-ink-faint" />
          </button>
        </Tile>

        <div className="mt-6">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wide text-ink-faint">Convites pendentes</span>
            <button
              type="button"
              onClick={() => setInviting(true)}
              className="flex items-center gap-1 text-[13px] font-semibold text-accent"
            >
              <Plus size={14} strokeWidth={2.6} />
              Convidar
            </button>
          </div>

          {invites.length === 0 ? (
            <p className="py-2 text-[13px] text-ink-faint">Nenhum convite pendente.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line rounded-lg border border-line bg-surface px-4">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <span className="tabular block text-[14px] font-bold text-ink">{invite.code}</span>
                    <span className="block text-[11px] text-ink-faint">Compartilhe este código por qualquer canal</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulateAccept(invite)}
                      title="Simular aceite (só neste protótipo)"
                      className="flex h-8 w-8 items-center justify-center rounded-sm bg-mint-bg text-mint-fg"
                    >
                      <Check size={15} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelInvite(invite.id)}
                      title="Cancelar convite"
                      className="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-muted text-ink-muted"
                    >
                      <X size={15} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <GhostButton onClick={handleLeaveGroup} className="flex items-center justify-center gap-1.5 text-danger">
            <LogOut size={16} strokeWidth={2.2} />
            Sair do grupo
          </GhostButton>
          {leaveBlocked ? (
            <p className="mt-1 text-center text-[12px] leading-normal text-danger">
              Você é a única pessoa responsável (OWNER) deste grupo — promova outra pessoa antes de sair.
            </p>
          ) : null}
        </div>
      </div>

      {inviting ? (
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <button type="button" aria-label="Fechar" onClick={() => setInviting(false)} className="absolute inset-0 bg-ink/40" />
          <div className="relative rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
            <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
            <h2 className="text-[17px] font-bold text-ink">Convidar pessoa</h2>
            <div className="mt-4">
              <TextField
                label="Nome (opcional, só pra identificar o convite)"
                placeholder="Ex.: Mateus"
                value={inviteeName}
                onChange={(e) => setInviteeName(e.target.value)}
              />
              <p className="mt-2 text-[12px] leading-normal text-ink-faint">
                Gera um código/link que você compartilha por qualquer canal — a pessoa não precisa já ter conta no
                Lema.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <PrimaryButton onClick={handleCreateInvite}>Gerar convite</PrimaryButton>
              <GhostButton onClick={() => setInviting(false)}>Cancelar</GhostButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
