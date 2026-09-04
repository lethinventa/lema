import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { CategoryPicker } from '../components/CategoryPicker'
import { SelectField, TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import type { MockAccount } from './accountsMockData'
import type { TransactionType } from './financeMockData'

export interface GoalOption {
  id: string
  title: string
}

export interface TransactionSheetValues {
  title: string
  category: string
  context: 'personal' | 'group'
  groupId?: string
  type: TransactionType
  amount: string
  date: string // ISO
  payer: string
  accountId: string
  installments: string // '' = não parcelado; '2'+ = número de parcelas
  recurs: boolean
  recurUntil: string // ISO, opcional
  goalId: string // '' = não vinculada a nenhum objetivo (UC-GOAL-007)
  paymentMethod: '' | 'debito' | 'credito' // só relevante quando a conta é um cartão
}

interface TransactionSheetProps {
  mode: 'create' | 'edit'
  initial?: TransactionSheetValues
  accountOptions: MockAccount[]
  goalOptions?: GoalOption[]
  categoryOptions: string[]
  onAddCategory: (category: string) => void
  onSave: (values: TransactionSheetValues) => void
  onDelete?: () => void
  onClose: () => void
}

export function TransactionSheet({
  mode,
  initial,
  accountOptions,
  goalOptions = [],
  categoryOptions,
  onAddCategory,
  onSave,
  onDelete,
  onClose,
}: TransactionSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: initial?.context ?? 'personal',
    groupId: initial?.groupId,
  })
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'despesa')
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [date, setDate] = useState(initial?.date ?? '')
  const [payer, setPayer] = useState(initial?.payer ?? '')
  const [accountId, setAccountId] = useState(initial?.accountId ?? '')
  const [installments, setInstallments] = useState(initial?.installments ?? '')
  const [recurs, setRecurs] = useState(initial?.recurs ?? false)
  const [recurUntil, setRecurUntil] = useState(initial?.recurUntil ?? '')
  const [goalId, setGoalId] = useState(initial?.goalId ?? '')
  const [paymentMethod, setPaymentMethod] = useState<'' | 'debito' | 'credito'>(initial?.paymentMethod ?? '')

  const canSave = title.trim().length > 0 && amount.trim().length > 0 && date.trim().length > 0
  const accountChoices = ['Nenhuma (dinheiro / não detalhado)', ...accountOptions.map((acc) => acc.name)]
  const selectedAccount = accountOptions.find((acc) => acc.id === accountId)
  const isCardSelected = selectedAccount?.type === 'cartao'
  // Um cartão como o Inter pode ser usado nos dois modos — no débito, o
  // dinheiro precisa de uma conta de verdade pra sair (a conta de pagamento
  // do cartão); sem ela, só crédito faz sentido.
  const canOfferDebit = isCardSelected && !!selectedAccount?.contaPagamentoId
  const effectivePaymentMethod = isCardSelected ? paymentMethod || 'credito' : ''
  const canParcel = type === 'despesa' && isCardSelected && effectivePaymentMethod === 'credito'
  const parceling = canParcel && installments.trim().length > 0
  const canOfferRecurrence = mode === 'create'
  const goalChoices = ['Nenhum', ...goalOptions.map((g) => g.title)]
  const selectedGoal = goalOptions.find((g) => g.id === goalId)

  function handleSave() {
    if (!canSave) return
    onSave({
      title: title.trim(),
      category: category.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      type,
      amount: amount.trim(),
      date,
      payer: payer.trim(),
      accountId,
      installments: canParcel ? installments.trim() : '',
      recurs: !parceling && recurs,
      recurUntil: recurUntil.trim(),
      goalId,
      paymentMethod: effectivePaymentMethod,
    })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[88%] overflow-y-auto rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
        <h2 className="text-[17px] font-bold text-ink">
          {mode === 'create' ? (type === 'receita' ? 'Nova receita' : 'Nova despesa') : 'Editar transação'}
        </h2>

        <div className="mt-4 flex flex-col gap-4">
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

          <CategoryPicker
            label="Categoria (opcional)"
            categories={categoryOptions}
            value={category}
            onChange={setCategory}
            onAddCategory={onAddCategory}
          />

          <TextField
            label="Pago por (opcional)"
            placeholder="Ex.: Mateus"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
          />

          <SelectField
            label="Conta (opcional)"
            options={accountChoices}
            value={selectedAccount?.name ?? accountChoices[0]}
            onChange={(e) => {
              const found = accountOptions.find((acc) => acc.name === e.target.value)
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
                    effectivePaymentMethod === 'credito'
                      ? 'border-accent bg-accent text-ink'
                      : 'border-line bg-surface text-ink-muted'
                  }`}
                >
                  Crédito
                </button>
                <button
                  type="button"
                  disabled={!canOfferDebit}
                  onClick={() => setPaymentMethod('debito')}
                  className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 disabled:opacity-40 ${
                    effectivePaymentMethod === 'debito'
                      ? 'border-accent bg-accent text-ink'
                      : 'border-line bg-surface text-ink-muted'
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
              <button
                type="button"
                onClick={() => setRecurs(!recurs)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
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

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={!canSave} onClick={handleSave}>
            {mode === 'create' ? (type === 'receita' ? 'Registrar receita' : 'Registrar despesa') : 'Salvar alterações'}
          </PrimaryButton>
          {mode === 'edit' && onDelete ? (
            <GhostButton onClick={onDelete} className="flex items-center justify-center gap-1.5 text-danger">
              <Trash2 size={16} strokeWidth={2.2} />
              Excluir transação
            </GhostButton>
          ) : (
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
          )}
        </div>
      </div>
    </div>
  )
}
