import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { TextField } from '../components/TextField'
import { formatCurrency, parseAmount } from '../finance/accountsMockData'
import { useOnboarding, type FixedExpenseEntry } from '../state/OnboardingContext'

// Lista "nome + valor" com adicionar/remover — mesmo padrão usado tanto pra
// fontes de renda quanto pra contas fixas, então vira um componente local em
// vez de duplicar o bloco duas vezes.
function AmountList({
  idPrefix,
  label,
  namePlaceholder,
  entries,
  onAdd,
  onRemove,
}: {
  idPrefix: string
  label: string
  namePlaceholder: string
  entries: FixedExpenseEntry[]
  onAdd: (name: string, amount: string) => void
  onRemove: (id: string) => void
}) {
  const [draftName, setDraftName] = useState('')
  const [draftAmount, setDraftAmount] = useState('')

  function handleAdd() {
    if (!draftName.trim() || !draftAmount.trim()) return
    onAdd(draftName.trim(), draftAmount.trim())
    setDraftName('')
    setDraftAmount('')
  }

  return (
    <div>
      <span className="mb-2 block text-[13px] font-medium text-ink-muted">{label}</span>

      {entries.length > 0 ? (
        <div className="mb-3 flex flex-col divide-y divide-line rounded-md border border-line bg-surface">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-[14px] font-medium text-ink">{entry.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-ink-muted">{formatCurrency(entry.amount)}</span>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  aria-label={`Remover ${entry.name}`}
                  className="flex h-6 w-6 items-center justify-center text-ink-faint"
                >
                  <X size={15} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <TextField
            id={`${idPrefix}-nome`}
            label="Nome"
            placeholder={namePlaceholder}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
        </div>
        <div className="w-28">
          <TextField
            id={`${idPrefix}-valor`}
            label="Valor"
            placeholder="0,00"
            inputMode="decimal"
            value={draftAmount}
            onChange={(e) => setDraftAmount(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!draftName.trim() || !draftAmount.trim()}
          aria-label={`Adicionar a ${label.toLowerCase()}`}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-accent text-ink transition active:scale-95 disabled:opacity-40"
        >
          <Plus size={20} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  )
}

export function FinancialSetupScreen() {
  const navigate = useNavigate()
  const { update } = useOnboarding()

  const [incomeSources, setIncomeSources] = useState<FixedExpenseEntry[]>([])
  const [expenses, setExpenses] = useState<FixedExpenseEntry[]>([])
  const [savings, setSavings] = useState('')

  function handleFinish() {
    update({
      incomeSources,
      savings: parseAmount(savings),
      fixedExpenses: expenses,
      financialSetupDone: true,
    })
    navigate('/home')
  }

  return (
    <OnboardingScreen
      progress={1}
      onBack={() => navigate('/onboarding/done')}
      onSkip={() => navigate('/home')}
      skipLabel="Pular por enquanto"
      title="Vamos organizar suas finanças?"
      subtitle="Leva menos de 2 minutos. Tudo aqui é opcional — dá pra pular qualquer pergunta e configurar depois em Finanças."
      footer={<PrimaryButton onClick={handleFinish}>Concluir</PrimaryButton>}
    >
      <AmountList
        idPrefix="renda"
        label="Fontes de renda mensal (opcional)"
        namePlaceholder="Ex.: Salário, Freela"
        entries={incomeSources}
        onAdd={(name, amount) =>
          setIncomeSources((prev) => [...prev, { id: `is-${Date.now()}`, name, amount: parseAmount(amount) }])
        }
        onRemove={(id) => setIncomeSources((prev) => prev.filter((e) => e.id !== id))}
      />

      <AmountList
        idPrefix="conta-fixa"
        label="Contas fixas mensais (opcional)"
        namePlaceholder="Ex.: Aluguel"
        entries={expenses}
        onAdd={(name, amount) => setExpenses((prev) => [...prev, { id: `fe-${Date.now()}`, name, amount: parseAmount(amount) }])}
        onRemove={(id) => setExpenses((prev) => prev.filter((e) => e.id !== id))}
      />

      <TextField
        label="Quanto você já tem guardado hoje (opcional)"
        placeholder="Ex.: 8000,00"
        inputMode="decimal"
        hint="Poupança, reserva de emergência, o que já existir."
        value={savings}
        onChange={(e) => setSavings(e.target.value)}
      />
    </OnboardingScreen>
  )
}
