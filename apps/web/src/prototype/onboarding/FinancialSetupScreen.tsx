import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { TextField } from '../components/TextField'
import { formatCurrency, parseAmount } from '../finance/accountsMockData'
import { useOnboarding, type FixedExpenseEntry } from '../state/OnboardingContext'

export function FinancialSetupScreen() {
  const navigate = useNavigate()
  const { update } = useOnboarding()

  const [income, setIncome] = useState('')
  const [savings, setSavings] = useState('')
  const [expenses, setExpenses] = useState<FixedExpenseEntry[]>([])
  const [draftName, setDraftName] = useState('')
  const [draftAmount, setDraftAmount] = useState('')

  function handleAddExpense() {
    if (!draftName.trim() || !draftAmount.trim()) return
    setExpenses((prev) => [...prev, { id: `fe-${Date.now()}`, name: draftName.trim(), amount: parseAmount(draftAmount) }])
    setDraftName('')
    setDraftAmount('')
  }

  function handleRemoveExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  function handleFinish() {
    update({
      monthlyIncome: parseAmount(income),
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
      <TextField
        label="Renda mensal fixa (opcional)"
        placeholder="Ex.: 4500,00"
        inputMode="decimal"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />

      <div>
        <span className="mb-2 block text-[13px] font-medium text-ink-muted">Contas fixas mensais (opcional)</span>

        {expenses.length > 0 ? (
          <div className="mb-3 flex flex-col divide-y divide-line rounded-md border border-line bg-surface">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-[14px] font-medium text-ink">{expense.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-ink-muted">{formatCurrency(expense.amount)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExpense(expense.id)}
                    aria-label={`Remover ${expense.name}`}
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
              label="Nome"
              placeholder="Ex.: Aluguel"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />
          </div>
          <div className="w-28">
            <TextField
              label="Valor"
              placeholder="0,00"
              inputMode="decimal"
              value={draftAmount}
              onChange={(e) => setDraftAmount(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleAddExpense}
            disabled={!draftName.trim() || !draftAmount.trim()}
            aria-label="Adicionar conta fixa"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-accent text-white transition active:scale-95 disabled:opacity-40"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>
      </div>

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
