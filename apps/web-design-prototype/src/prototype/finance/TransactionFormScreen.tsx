import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { PrimaryButton } from '../components/Buttons'
import { CategoryPicker } from '../components/CategoryPicker'
import { SelectField, TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import { initialCategories } from '../categories/categoriesMockData'
import { initialGoals } from '../goals/goalsMockData'
import { addMonthsIso, formatDateLabel, initialAccounts, parseAmount } from './accountsMockData'
import { initialTransactions, type MockTransaction, type TransactionType } from './financeMockData'
import { initialRecurrenceRules } from './recurrenceMockData'

// Criar/editar transação é página cheia, não bottom sheet (ver
// docs/product/interaction-patterns.md) — mesmo padrão de
// TaskFormScreen/EventFormScreen. A lógica de parcelamento/recorrência
// (UC-FIN-012/013) veio direto de FinanceScreen, sem mudança de regra.
// Abrir uma transação existente vai pra TransactionDetailScreen
// (visualização); esta tela só existe pelo botão "Editar" de lá, e ao
// salvar volta pra lá — excluir também ficou na visualização.
//
// ?objetivo=<goalId> pré-seleciona o vínculo (chegada a partir de um
// objetivo, ver GoalDetailScreen) e ?voltar=<path> manda pra lá depois de
// salvar em vez do destino padrão (Finanças, ou o detalhe da própria
// transação em edição) — assim essa página não precisa saber nada sobre
// quem a chamou.
export function TransactionFormScreen() {
  const { txId } = useParams<{ txId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editingTx = txId ? initialTransactions.find((tx) => tx.id === txId) : undefined
  const mode: 'create' | 'edit' = txId ? 'edit' : 'create'
  const defaultReturnTo = mode === 'edit' && txId ? `/home/financas/${txId}` : '/home/financas'
  const returnTo = searchParams.get('voltar') || defaultReturnTo

  const [title, setTitle] = useState(editingTx?.title ?? '')
  const [category, setCategory] = useState(editingTx?.category ?? '')
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: editingTx?.context === 'group' ? 'group' : 'personal',
    groupId: editingTx?.groupId,
  })
  const [type, setType] = useState<TransactionType>(editingTx?.type ?? (searchParams.get('tipo') === 'receita' ? 'receita' : 'despesa'))
  const [amount, setAmount] = useState(editingTx?.amount.toString().replace('.', ',') ?? '')
  const [date, setDate] = useState(editingTx?.date ?? '')
  const [payer, setPayer] = useState(editingTx?.payer ?? '')
  const [accountId, setAccountId] = useState(editingTx?.accountId ?? '')
  const [installments, setInstallments] = useState('')
  const [recurs, setRecurs] = useState(false)
  const [recurUntil, setRecurUntil] = useState('')
  const [goalId, setGoalId] = useState(editingTx?.goalId ?? searchParams.get('objetivo') ?? '')
  const [paymentMethod, setPaymentMethod] = useState<'' | 'debito' | 'credito'>(editingTx?.paymentMethod ?? '')

  if (mode === 'edit' && !editingTx) {
    return <Navigate to="/home/financas" replace />
  }

  const goalOptions = initialGoals.filter((g) => !g.done).map((g) => ({ id: g.id, title: g.title }))
  const accountChoices = ['Nenhuma (dinheiro / não detalhado)', ...initialAccounts.map((acc) => acc.name)]
  const selectedAccount = initialAccounts.find((acc) => acc.id === accountId)
  const isCardSelected = selectedAccount?.type === 'cartao'
  const canOfferDebit = isCardSelected && !!selectedAccount?.contaPagamentoId
  const effectivePaymentMethod = isCardSelected ? paymentMethod || 'credito' : ''
  const canParcel = type === 'despesa' && isCardSelected && effectivePaymentMethod === 'credito'
  const parceling = canParcel && installments.trim().length > 0
  const canOfferRecurrence = mode === 'create'
  const goalChoices = ['Nenhum', ...goalOptions.map((g) => g.title)]
  const selectedGoal = goalOptions.find((g) => g.id === goalId)
  const canSave = title.trim().length > 0 && amount.trim().length > 0 && date.trim().length > 0

  function handleAddCategory(newCategory: string) {
    setCategories((prev) => (prev.includes(newCategory) ? prev : [...prev, newCategory]))
    if (!initialCategories.includes(newCategory)) initialCategories.push(newCategory)
  }

  function handleSave() {
    if (!canSave) return
    const parsedAmount = parseAmount(amount)
    const installmentsCount = Number.parseInt(installments, 10)
    const shared = {
      title: title.trim(),
      category: category.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      payer: payer.trim() || undefined,
      accountId: accountId || undefined,
      goalId: goalId || undefined,
      paymentMethod: effectivePaymentMethod || undefined,
    }

    if (mode === 'edit') {
      const target = initialTransactions.find((tx) => tx.id === txId)
      if (target) {
        Object.assign(target, {
          ...shared,
          type,
          amount: parsedAmount,
          dateLabel: formatDateLabel(date),
          date,
        })
      }
      navigate(returnTo)
      return
    }

    if (type === 'despesa' && accountId && installmentsCount >= 2) {
      // Parcelamento (UC-FIN-012): gera as N transações de uma vez, uma por
      // mês, valor dividido — resto ajustado na última parcela.
      const parcelamentoId = `parc-${Date.now()}`
      const base = Math.floor((parsedAmount / installmentsCount) * 100) / 100
      let allocated = 0
      const newTxs: MockTransaction[] = Array.from({ length: installmentsCount }, (_, i) => {
        const isLast = i === installmentsCount - 1
        const value = isLast ? Math.round((parsedAmount - allocated) * 100) / 100 : base
        allocated += value
        const txDate = addMonthsIso(date, i)
        return {
          id: `tx-${Date.now()}-${i}`,
          ...shared,
          type,
          amount: value,
          dateLabel: formatDateLabel(txDate),
          date: txDate,
          parcelamentoId,
          numeroParcela: i + 1,
          totalParcelas: installmentsCount,
        }
      })
      initialTransactions.unshift(...newTxs)
    } else if (!parceling && recurs) {
      // Recorrência (UC-FIN-013): cria a regra e materializa só a ocorrência
      // deste mês — meses futuros ficam projetados, nunca lançados de antemão.
      const ruleId = `rec-${Date.now()}`
      initialRecurrenceRules.push({
        id: ruleId,
        title: shared.title,
        category: shared.category,
        context: shared.context,
        groupId: shared.groupId,
        type,
        amount: parsedAmount,
        accountId: shared.accountId,
        dayOfMonth: Number.parseInt(date.slice(8, 10), 10),
        startDate: date,
        endDate: recurUntil || undefined,
      })
      initialTransactions.unshift({
        id: `tx-${Date.now()}`,
        ...shared,
        type,
        amount: parsedAmount,
        dateLabel: formatDateLabel(date),
        date,
        recurrenceRuleId: ruleId,
      })
    } else {
      initialTransactions.unshift({
        id: `tx-${Date.now()}`,
        ...shared,
        type,
        amount: parsedAmount,
        dateLabel: formatDateLabel(date),
        date,
      })
    }
    navigate(returnTo)
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader
        title={mode === 'create' ? (type === 'receita' ? 'Nova receita' : 'Nova despesa') : 'Editar transação'}
        to={returnTo}
      />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('despesa')}
              className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                type === 'despesa' ? 'border-danger bg-danger text-white' : 'border-line bg-surface text-ink-muted'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('receita')}
              className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                type === 'receita' ? 'border-mint-bg bg-mint-bg text-mint-fg' : 'border-line bg-surface text-ink-muted'
              }`}
            >
              Receita
            </button>
          </div>

          <TextField
            label="Descrição"
            placeholder={type === 'receita' ? 'De onde veio?' : 'Com o que foi gasto?'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <TextField
                label="Valor"
                placeholder="Ex.: 84,50"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <TextField label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <CategoryPicker label="Categoria (opcional)" categories={categories} value={category} onChange={setCategory} onAddCategory={handleAddCategory} />

          <TextField label="Pago por (opcional)" placeholder="Ex.: Mateus" value={payer} onChange={(e) => setPayer(e.target.value)} />

          <SelectField
            label="Conta (opcional)"
            options={accountChoices}
            value={selectedAccount?.name ?? accountChoices[0]}
            onChange={(e) => {
              const found = initialAccounts.find((acc) => acc.name === e.target.value)
              setAccountId(found?.id ?? '')
              if (found?.type !== 'cartao') {
                setInstallments('')
                setPaymentMethod('')
              }
            }}
          />

          {isCardSelected ? (
            <div>
              <span className="mb-2 block text-[13px] font-medium text-ink-muted">Forma de pagamento no cartão</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credito')}
                  className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                    effectivePaymentMethod === 'credito' ? 'border-accent bg-accent text-ink' : 'border-line bg-surface text-ink-muted'
                  }`}
                >
                  Crédito
                </button>
                <button
                  type="button"
                  disabled={!canOfferDebit}
                  onClick={() => setPaymentMethod('debito')}
                  className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 disabled:opacity-40 ${
                    effectivePaymentMethod === 'debito' ? 'border-accent bg-accent text-ink' : 'border-line bg-surface text-ink-muted'
                  }`}
                >
                  Débito
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-ink-faint">
                {canOfferDebit
                  ? effectivePaymentMethod === 'debito'
                    ? 'Sai direto do saldo da conta de pagamento do cartão, sem entrar na fatura.'
                    : 'Entra no ciclo da fatura deste cartão, junto com as outras compras no crédito.'
                  : 'Defina uma conta de pagamento pra este cartão em Contas pra poder usar o débito.'}
              </p>
            </div>
          ) : null}

          {goalOptions.length > 0 ? (
            <SelectField
              label="Vincular a um objetivo (opcional)"
              options={goalChoices}
              value={selectedGoal?.title ?? goalChoices[0]}
              onChange={(e) => {
                const found = goalOptions.find((g) => g.title === e.target.value)
                setGoalId(found?.id ?? '')
              }}
            />
          ) : null}

          {canParcel ? (
            <TextField
              label="Parcelar em quantas vezes? (opcional)"
              placeholder="Ex.: 3"
              inputMode="numeric"
              value={installments}
              onChange={(e) => setInstallments(e.target.value.replace(/\D/g, ''))}
              hint="Uma parcela por mês, mesmo valor total dividido. Deixe em branco pra não parcelar."
            />
          ) : null}

          {canOfferRecurrence && !parceling ? (
            <div className="rounded-md border border-line bg-surface px-4 py-3">
              <button type="button" onClick={() => setRecurs(!recurs)} className="flex w-full items-center justify-between gap-3 text-left">
                <span>
                  <span className="block text-[14px] font-semibold text-ink">Se repete todo mês</span>
                  <span className="mt-0.5 block text-[12px] text-ink-faint">
                    Só lança a ocorrência deste mês; os próximos meses entram no saldo previsto.
                  </span>
                </span>
                <span
                  className={`flex h-6 w-11 shrink-0 items-center rounded-pill px-0.5 transition ${recurs ? 'justify-end bg-accent' : 'justify-start bg-surface-muted'}`}
                >
                  <span className="h-5 w-5 rounded-pill bg-white shadow" />
                </span>
              </button>
              {recurs ? (
                <div className="mt-3">
                  <TextField
                    label="Repete até (opcional)"
                    type="date"
                    value={recurUntil}
                    onChange={(e) => setRecurUntil(e.target.value)}
                    hint="Deixe em branco pra repetir indefinidamente."
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <VisibilityPicker
            value={visibility}
            onChange={setVisibility}
            hint={visibility.context === 'group' ? 'A divisão segue a regra padrão configurada para o grupo.' : undefined}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <PrimaryButton disabled={!canSave} onClick={handleSave}>
          {mode === 'create' ? (type === 'receita' ? 'Registrar receita' : 'Registrar despesa') : 'Salvar alterações'}
        </PrimaryButton>
      </div>
    </div>
  )
}
