import { Eye, Scale, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { PrimaryButton } from '../components/Buttons'
import { DomainLabel } from '../components/DomainLabel'
import { SPLIT_RULE_OPTIONS, TRANSPARENCY_OPTIONS, splitRuleLabel, transparencyLabel } from '../components/financeArrangementOptions'
import { SelectableCard } from '../components/SelectableCard'
import { TextField } from '../components/TextField'
import { Tile } from '../components/Tile'
import { mockGroups, mockUser } from '../home/homeMockData'
import type { SplitRule, TransparencyLevel } from '../state/OnboardingContext'
import { initialArrangementHistory, initialGroupArrangements } from './groupFinanceMockData'
import { CURRENT_USER_ID, initialInvitesByGroup, initialMembersByGroup } from './groupsMockData'

function slugify(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'grupo'
}

// UC-GROUP-001: criar um grupo embute obrigatoriamente a configuração
// financeira mínima (UC-FIN-009) — igual ao onboarding, só que num único
// formulário em vez de 3 telas em sequência (aqui não é o primeiro contato
// da pessoa com o produto, não precisa do ritmo passo a passo).
export function CreateGroupScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [hasSharedMoney, setHasSharedMoney] = useState<boolean | null>(null)
  const [splitRule, setSplitRule] = useState<SplitRule | null>(null)
  const [transparency, setTransparency] = useState<TransparencyLevel | null>(null)

  const canCreate = name.trim().length > 0 && hasSharedMoney !== null && splitRule !== null && transparency !== null

  // Sem store compartilhado entre telas (ver CLAUDE.md) — mockGroups e os
  // registros de grupos.mockData/groupFinanceMockData são mutados
  // diretamente aqui, de propósito: são módulos simples (não React state),
  // então uma tela recém-navegada que os leia direto (ProfileHubScreen,
  // MembersScreen, GroupFinanceScreen...) já enxerga o grupo novo — sem
  // isso, "criar grupo" não teria como ser testado de verdade.
  function handleCreate() {
    if (!canCreate || hasSharedMoney === null || !splitRule || !transparency) return
    const trimmedName = name.trim()
    const existingIds = new Set(mockGroups.map((g) => g.id))
    let id = slugify(trimmedName)
    if (existingIds.has(id)) id = `${id}-${Date.now()}`

    mockGroups.push({ id, name: trimmedName })
    initialMembersByGroup[id] = [{ id: CURRENT_USER_ID, name: mockUser.firstName, role: 'OWNER' }]
    initialInvitesByGroup[id] = []
    initialGroupArrangements[id] = { hasSharedMoney, splitRule, transparency, exceptions: [] }
    initialArrangementHistory[id] = [
      {
        id: `h-${Date.now()}`,
        field: 'Configuração inicial',
        from: '—',
        to: `${hasSharedMoney ? 'Caixa comum' : 'Sem caixa comum'} · ${splitRuleLabel(splitRule)} · ${transparencyLabel(transparency)}`,
        changedBy: mockUser.firstName,
        changedAt: new Date().toISOString().slice(0, 10),
      },
    ]

    navigate(`/perfil/grupos/${id}`)
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader title="Criar grupo" to="/perfil" />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <Tile>
          <TextField
            label="Nome do grupo"
            placeholder="Ex.: República da Faculdade"
            value={name}
            onChange={(e) => setName(e.target.value)}
            hint="Você poderá convidar outras pessoas depois, na tela de Membros."
          />
        </Tile>

        <Tile className="mt-3">
          <DomainLabel icon={<Wallet size={15} strokeWidth={2.4} />} tone="peach">
            Existe dinheiro comum no grupo?
          </DomainLabel>
          <div className="flex flex-col gap-2">
            <SelectableCard title="Sim, temos caixa comum" selected={hasSharedMoney === true} onSelect={() => setHasSharedMoney(true)} />
            <SelectableCard
              title="Não, cada um mantém o próprio dinheiro"
              selected={hasSharedMoney === false}
              onSelect={() => setHasSharedMoney(false)}
            />
          </div>
        </Tile>

        <Tile className="mt-3">
          <DomainLabel icon={<Scale size={15} strokeWidth={2.4} />} tone="peach">
            Regra padrão de divisão
          </DomainLabel>
          <div className="flex flex-col gap-2">
            {SPLIT_RULE_OPTIONS.map((rule) => (
              <SelectableCard
                key={rule.value}
                title={rule.title}
                description={rule.description}
                selected={splitRule === rule.value}
                onSelect={() => setSplitRule(rule.value)}
              />
            ))}
          </div>
        </Tile>

        <Tile className="mt-3">
          <DomainLabel icon={<Eye size={15} strokeWidth={2.4} />} tone="peach">
            Transparência financeira
          </DomainLabel>
          <div className="flex flex-col gap-2">
            {TRANSPARENCY_OPTIONS.map((opt) => (
              <SelectableCard
                key={opt.value}
                title={opt.title}
                description={opt.description}
                selected={transparency === opt.value}
                onSelect={() => setTransparency(opt.value)}
              />
            ))}
          </div>
        </Tile>

        <p className="mt-3 px-1 text-[12px] leading-normal text-ink-faint">
          Essa configuração é obrigatória antes do grupo poder registrar despesas compartilhadas — dá pra refinar
          depois em Membros → Configuração financeira.
        </p>
      </div>

      <div className="border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <PrimaryButton disabled={!canCreate} onClick={handleCreate}>
          Criar grupo
        </PrimaryButton>
      </div>
    </div>
  )
}
