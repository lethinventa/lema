import { Clock, Eye, Scale, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { PrimaryButton } from '../components/Buttons'
import { CategoryPicker } from '../components/CategoryPicker'
import { initialCategories } from '../categories/categoriesMockData'
import { DomainLabel } from '../components/DomainLabel'
import { SPLIT_RULE_OPTIONS, TRANSPARENCY_OPTIONS, splitRuleLabel } from '../components/financeArrangementOptions'
import { SelectableCard } from '../components/SelectableCard'
import { SelectField } from '../components/TextField'
import { Tile } from '../components/Tile'
import { mockGroups } from '../home/homeMockData'
import type { SplitRule } from '../state/OnboardingContext'
import {
  type ArrangementHistoryEntry,
  type GroupFinancialArrangement,
  type SplitException,
  initialArrangementHistory,
  initialGroupArrangements,
} from './groupFinanceMockData'

function formatHistoryDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

export function GroupFinanceScreen() {
  const { groupId } = useParams<{ groupId: string }>()
  const group = mockGroups.find((g) => g.id === groupId)

  const [arrangement, setArrangement] = useState<GroupFinancialArrangement>(
    () => initialGroupArrangements[groupId ?? ''] ?? { hasSharedMoney: false, splitRule: 'none', transparency: 'full', exceptions: [] },
  )
  const [saved, setSaved] = useState<GroupFinancialArrangement>(arrangement)
  const [history, setHistory] = useState<ArrangementHistoryEntry[]>(() => initialArrangementHistory[groupId ?? ''] ?? [])
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [addingException, setAddingException] = useState(false)
  const [draftCategory, setDraftCategory] = useState('')
  const [draftSplitRule, setDraftSplitRule] = useState<SplitRule>('50-50')
  const [justSaved, setJustSaved] = useState(false)

  if (!group) {
    return <Navigate to="/perfil" replace />
  }

  const isDirty = JSON.stringify(arrangement) !== JSON.stringify(saved)

  function addException() {
    if (!draftCategory) return
    const id = `exc-${Date.now()}`
    setArrangement((prev) => ({
      ...prev,
      exceptions: [...prev.exceptions, { id, category: draftCategory, splitRule: draftSplitRule }],
    }))
    setDraftCategory('')
    setDraftSplitRule('50-50')
    setAddingException(false)
  }

  function removeException(id: string) {
    setArrangement((prev) => ({ ...prev, exceptions: prev.exceptions.filter((e) => e.id !== id) }))
  }

  // UC-FIN-010: toda alteração fica registrada — o quê, quem, quando. Só
  // grava no histórico o que de fato mudou entre a última versão salva e a atual.
  function handleSave() {
    const entries: ArrangementHistoryEntry[] = []
    const today = new Date().toISOString().slice(0, 10)

    if (arrangement.hasSharedMoney !== saved.hasSharedMoney) {
      entries.push({
        id: `h-${Date.now()}-1`,
        field: 'Dinheiro comum',
        from: saved.hasSharedMoney ? 'Sim' : 'Não',
        to: arrangement.hasSharedMoney ? 'Sim' : 'Não',
        changedBy: 'Você',
        changedAt: today,
      })
    }
    if (arrangement.splitRule !== saved.splitRule) {
      entries.push({
        id: `h-${Date.now()}-2`,
        field: 'Regra padrão de divisão',
        from: splitRuleLabel(saved.splitRule),
        to: splitRuleLabel(arrangement.splitRule),
        changedBy: 'Você',
        changedAt: today,
      })
    }
    if (arrangement.transparency !== saved.transparency) {
      entries.push({
        id: `h-${Date.now()}-3`,
        field: 'Transparência',
        from: TRANSPARENCY_OPTIONS.find((o) => o.value === saved.transparency)?.title ?? saved.transparency,
        to: TRANSPARENCY_OPTIONS.find((o) => o.value === arrangement.transparency)?.title ?? arrangement.transparency,
        changedBy: 'Você',
        changedAt: today,
      })
    }
    if (arrangement.exceptions.length !== saved.exceptions.length) {
      entries.push({
        id: `h-${Date.now()}-4`,
        field: 'Exceções por categoria',
        from: `${saved.exceptions.length} exceção(ões)`,
        to: `${arrangement.exceptions.length} exceção(ões)`,
        changedBy: 'Você',
        changedAt: today,
      })
    }

    setHistory((prev) => [...entries, ...prev])
    setSaved(arrangement)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader title="Configuração financeira" subtitle={group.name} to={`/perfil/grupos/${group.id}`} />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <p className="text-[12.5px] leading-normal text-ink-faint">
          Visível a todos os membros do grupo. Alterar aqui não muda a divisão de despesas já registradas — vale só
          pra próxima.
        </p>

        <Tile className="mt-4">
          <DomainLabel icon={<Wallet size={15} strokeWidth={2.4} />} tone="peach">
            Existe dinheiro comum no grupo?
          </DomainLabel>
          <div className="flex flex-col gap-2">
            <SelectableCard
              title="Sim, temos caixa comum"
              selected={arrangement.hasSharedMoney === true}
              onSelect={() => setArrangement((prev) => ({ ...prev, hasSharedMoney: true }))}
            />
            <SelectableCard
              title="Não, cada um mantém o próprio dinheiro"
              selected={arrangement.hasSharedMoney === false}
              onSelect={() => setArrangement((prev) => ({ ...prev, hasSharedMoney: false }))}
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
                selected={arrangement.splitRule === rule.value}
                onSelect={() => setArrangement((prev) => ({ ...prev, splitRule: rule.value }))}
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
                selected={arrangement.transparency === opt.value}
                onSelect={() => setArrangement((prev) => ({ ...prev, transparency: opt.value }))}
              />
            ))}
          </div>
        </Tile>

        <Tile className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[15px] font-bold text-ink">Exceções por categoria</span>
            {!addingException ? (
              <button type="button" onClick={() => setAddingException(true)} className="text-[13px] font-semibold text-ink">
                + Nova
              </button>
            ) : null}
          </div>
          <p className="mb-2 text-[12px] text-ink-faint">
            Uma regra diferente pra categorias específicas — tem prioridade sobre a regra padrão acima.
          </p>

          {arrangement.exceptions.length === 0 && !addingException ? (
            <p className="py-2 text-[13px] text-ink-faint">Nenhuma exceção configurada.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {arrangement.exceptions.map((exc: SplitException) => (
                <div key={exc.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-semibold text-ink">{exc.category}</span>
                    <span className="block text-[12px] text-ink-faint">{splitRuleLabel(exc.splitRule)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeException(exc.id)}
                    aria-label={`Remover exceção de ${exc.category}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-ink-faint transition active:scale-90"
                  >
                    <X size={15} strokeWidth={2.4} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {addingException ? (
            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-3">
              <CategoryPicker
                label="Categoria"
                categories={categories}
                value={draftCategory}
                onChange={setDraftCategory}
                onAddCategory={(c) => setCategories((prev) => (prev.includes(c) ? prev : [...prev, c]))}
              />
              <SelectField
                label="Regra pra essa categoria"
                options={SPLIT_RULE_OPTIONS.map((o) => o.title)}
                value={SPLIT_RULE_OPTIONS.find((o) => o.value === draftSplitRule)?.title}
                onChange={(e) => {
                  const found = SPLIT_RULE_OPTIONS.find((o) => o.title === e.target.value)
                  setDraftSplitRule(found?.value ?? '50-50')
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addException}
                  disabled={!draftCategory}
                  className="flex-1 rounded-sm bg-accent px-3 py-2.5 text-[13px] font-semibold text-ink transition active:scale-[0.98] disabled:opacity-40"
                >
                  Adicionar exceção
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingException(false)
                    setDraftCategory('')
                  }}
                  className="flex-1 rounded-sm border border-line px-3 py-2.5 text-[13px] font-semibold text-ink-muted transition active:scale-[0.98]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : null}
        </Tile>

        <Tile className="mt-3">
          <DomainLabel icon={<Clock size={15} strokeWidth={2.4} />} tone="sky">
            Histórico de alterações
          </DomainLabel>
          {history.length === 0 ? (
            <p className="py-2 text-[13px] text-ink-faint">Nenhuma alteração registrada ainda.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {history.map((entry) => (
                <div key={entry.id} className="py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-ink">{entry.field}</span>
                    <span className="tabular shrink-0 text-[11px] font-medium text-ink-faint">
                      {formatHistoryDate(entry.changedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-faint">
                    {entry.from} → {entry.to} · {entry.changedBy}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Tile>
      </div>

      <div className="border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <PrimaryButton disabled={!isDirty} onClick={handleSave}>
          {justSaved ? 'Salvo ✓' : 'Salvar alterações'}
        </PrimaryButton>
      </div>
    </div>
  )
}
