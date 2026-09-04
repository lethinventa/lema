import { ChevronRight, LogOut, Plus, Shield, Trash2, Users, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { getInitials, getPersonColor } from '../components/palette'
import { Tile } from '../components/Tile'
import { initialMembersByGroup } from '../groups/groupsMockData'
import { mockGroups, mockUser } from '../home/homeMockData'
import { useOnboarding } from '../state/OnboardingContext'
import { ProfileEditSheet, type ProfileEditValues } from './ProfileEditSheet'

function SettingsRow({
  icon: Icon,
  label,
  subtitle,
  onClick,
  danger,
}: {
  icon: LucideIcon
  label: string
  subtitle?: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 py-3.5 text-left transition active:scale-[0.99]"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-tile)] ${
          danger ? 'bg-danger/10 text-danger' : 'bg-surface text-ink-muted'
        }`}
      >
        <Icon size={17} strokeWidth={2.2} />
      </span>
      <span className="flex-1">
        <span className={`block text-[15px] font-semibold ${danger ? 'text-danger' : 'text-ink'}`}>{label}</span>
        {subtitle ? <span className="mt-0.5 block text-[12px] text-ink-muted">{subtitle}</span> : null}
      </span>
      <ChevronRight size={18} strokeWidth={2.2} className={danger ? 'text-danger/60' : 'text-ink-faint'} />
    </button>
  )
}

export function ProfileHubScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()
  const [editing, setEditing] = useState(false)

  const displayName = data.name || mockUser.firstName
  const email = data.email || 'lethicia@exemplo.com'

  function handleSaveProfile(values: ProfileEditValues) {
    update(values)
    setEditing(false)
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader title="Perfil e Configurações" to="/home" />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <Tile className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-pill text-[20px] font-extrabold text-white"
            style={{ backgroundColor: getPersonColor(displayName) }}
          >
            {getInitials(displayName)}
          </span>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-[17px] font-bold text-ink">{displayName}</span>
            <span className="block truncate text-[13px] text-ink-muted">{email}</span>
          </div>
        </Tile>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 w-full rounded-[var(--radius-tile)] bg-surface-muted px-4 py-2.5 text-center text-[13px] font-semibold text-ink transition active:scale-[0.99]"
        >
          Editar perfil
        </button>

        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[12px] font-bold uppercase tracking-wide text-ink-faint">Grupos</span>
            <button
              type="button"
              onClick={() => navigate('/perfil/grupos/novo')}
              className="flex items-center gap-1 text-[13px] font-semibold text-ink"
            >
              <Plus size={14} strokeWidth={2.6} />
              Criar grupo
            </button>
          </div>
          <Tile className="flex flex-col divide-y divide-line !p-3">
            {mockGroups.map((group) => {
              const count = initialMembersByGroup[group.id]?.length ?? 0
              return (
                <SettingsRow
                  key={group.id}
                  icon={Users}
                  label={group.name}
                  subtitle={`${count} membro${count > 1 ? 's' : ''}`}
                  onClick={() => navigate(`/perfil/grupos/${group.id}`)}
                />
              )
            })}
          </Tile>
        </div>

        <div className="mt-7">
          <span className="mb-2 block px-1 text-[12px] font-bold uppercase tracking-wide text-ink-faint">Conta</span>
          <Tile className="flex flex-col divide-y divide-line !p-3">
            <SettingsRow icon={Shield} label="Segurança" onClick={() => navigate('/perfil/seguranca')} />
            <SettingsRow icon={LogOut} label="Sair" onClick={() => navigate('/')} />
          </Tile>
        </div>

        <div className="mt-7">
          <span className="mb-2 block px-1 text-[12px] font-bold uppercase tracking-wide text-ink-faint">Zona de risco</span>
          <Tile className="flex flex-col divide-y divide-line !p-3">
            <SettingsRow icon={Trash2} label="Excluir conta" onClick={() => navigate('/perfil/excluir')} danger />
          </Tile>
        </div>
      </div>

      {editing ? (
        <ProfileEditSheet
          initial={{ name: displayName, timezone: data.timezone, language: data.language, dateFormat: data.dateFormat }}
          onSave={handleSaveProfile}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </div>
  )
}
