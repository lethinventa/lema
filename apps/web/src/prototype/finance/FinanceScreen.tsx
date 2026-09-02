import { ChevronLeft, ChevronRight, Landmark, PieChart, Plus, Repeat, Target, TrendingUp, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { CategoryChip } from '../components/CategoryChip'
import { CategoryRanking } from '../components/CategoryRanking'
import { ContextFilterChips, type ContextFilterValue } from '../components/ContextFilterChips'
import { DonutChart } from '../components/DonutChart'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { getCategoryStyle } from '../components/palette'
import { SavingsGauge } from '../components/SavingsGauge'
import { Tile } from '../components/Tile'
import { VisibilityDot } from '../components/VisibilityDot'
import { initialGoals } from '../goals/goalsMockData'
import { type HomeContext, mockGroup } from '../home/homeMockData'
import {
  addMonthsIso,
  addMonthsToMonthIso,
  formatDate,
  formatDateLabel,
  formatMonthLabel,
  getCurrentMonthIso,
  initialAccounts,
  parseAmount,
} from './accountsMockData'
import { formatCurrency, initialTransactions, type MockTransaction, type TransactionType } from './financeMockData'
import {
  getCategoryBreakdown,
  getIncomeExpenseTotals,
  getPeriodTransactions,
  getVisibleAccountsTotal,
} from './financeSelectors'
import { initialRecurrenceRules, type MockRecurrenceRule } from './recurrenceMockData'
import { TransactionSheet, type TransactionSheetValues } from './TransactionSheet'

function matches(filter: ContextFilterValue, context: HomeContext) {
  return filter === 'all' || filter === context
}

const goalTitleById = new Map(initialGoals.map((g) => [g.id, g.title]))

function TransactionRow({ tx, onEdit }: { tx: MockTransaction; onEdit: () => void }) {
  const isIncome = tx.type === 'receita'
  const goalTitle = tx.goalId ? goalTitleById.get(tx.goalId) : undefined
  return (
    <button type="button" onClick={onEdit} className="flex w-full items-center gap-3 py-3 text-left">
      <CategoryChip category={tx.category} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[14px] font-semibold text-ink">{tx.title}</span>
          {tx.payer ? <Avatar name={tx.payer} /> : null}
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-ink-faint">{tx.dateLabel}</span>
          {tx.category ? <span className="text-[11px] font-medium text-ink-faint">· {tx.category}</span> : null}
          {tx.totalParcelas ? <FlagChip>{tx.numeroParcela}/{tx.totalParcelas}</FlagChip> : null}
          {tx.recurrenceRuleId ? <FlagChip icon={Repeat}>Recorrente</FlagChip> : null}
          {tx.paymentMethod === 'debito' ? <FlagChip>Débito no cartão</FlagChip> : null}
          {tx.paymentMethod === 'credito' ? <FlagChip>Crédito</FlagChip> : null}
          {goalTitle ? <FlagChip icon={Target}>{goalTitle}</FlagChip> : null}
        </div>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className={`tabular text-[14.5px] font-bold ${isIncome ? 'text-mint-text' : 'text-ink'}`}>
          {isIncome ? '+' : '−'} {formatCurrency(tx.amount)}
        </span>
        <VisibilityDot context={tx.context} />
      </span>
    </button>
  )
}

export function FinanceScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [month, setMonth] = useState(getCurrentMonthIso())
  const [rankingTab, setRankingTab] = useState<TransactionType>('despesa')
  const [transactions, setTransactions] = useState(initialTransactions)
  const [recurrenceRules, setRecurrenceRules] = useState<MockRecurrenceRule[]>(initialRecurrenceRules)
  const [sheet, setSheet] = useState<{ mode: 'create' } | { mode: 'edit'; txId: string } | null>(null)

  function handleCreate(values: TransactionSheetValues) {
    const amount = parseAmount(values.amount)
    const installmentsCount = Number.parseInt(values.installments, 10)

    if (values.type === 'despesa' && values.accountId && installmentsCount >= 2) {
      // Parcelamento (UC-FIN-012): gera as N transações de uma vez, uma por
      // mês, valor dividido — resto ajustado na última parcela.
      const parcelamentoId = `parc-${Date.now()}`
      const base = Math.floor((amount / installmentsCount) * 100) / 100
      let allocated = 0
      const newTxs: MockTransaction[] = Array.from({ length: installmentsCount }, (_, i) => {
        const isLast = i === installmentsCount - 1
        const value = isLast ? Math.round((amount - allocated) * 100) / 100 : base
        allocated += value
        const date = addMonthsIso(values.date, i)
        return {
          id: `tx-${Date.now()}-${i}`,
          title: values.title,
          category: values.category,
          context: values.context,
          type: values.type,
          amount: value,
          dateLabel: formatDateLabel(date),
          date,
          payer: values.payer || undefined,
          accountId: values.accountId || undefined,
          parcelamentoId,
          numeroParcela: i + 1,
          totalParcelas: installmentsCount,
          goalId: values.goalId || undefined,
          paymentMethod: values.paymentMethod || undefined,
        }
      })
      setTransactions((prev) => [...newTxs, ...prev])
    } else if (values.recurs) {
      // Recorrência (UC-FIN-013): cria a regra e materializa só a ocorrência
      // deste mês — meses futuros ficam projetados, nunca lançados de antemão.
      const ruleId = `rec-${Date.now()}`
      setRecurrenceRules((prev) => [
        ...prev,
        {
          id: ruleId,
          title: values.title,
          category: values.category,
          context: values.context,
          type: values.type,
          amount,
          accountId: values.accountId || undefined,
          dayOfMonth: Number.parseInt(values.date.slice(8, 10), 10),
          startDate: values.date,
          endDate: values.recurUntil || undefined,
        },
      ])
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          title: values.title,
          category: values.category,
          context: values.context,
          type: values.type,
          amount,
          dateLabel: formatDateLabel(values.date),
          date: values.date,
          payer: values.payer || undefined,
          accountId: values.accountId || undefined,
          recurrenceRuleId: ruleId,
          goalId: values.goalId || undefined,
          paymentMethod: values.paymentMethod || undefined,
        },
        ...prev,
      ])
    } else {
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          title: values.title,
          category: values.category,
          context: values.context,
          type: values.type,
          amount,
          dateLabel: formatDateLabel(values.date),
          date: values.date,
          payer: values.payer || undefined,
          accountId: values.accountId || undefined,
          goalId: values.goalId || undefined,
          paymentMethod: values.paymentMethod || undefined,
        },
        ...prev,
      ])
    }
    setSheet(null)
  }

  function handleEditSave(values: TransactionSheetValues) {
    if (sheet?.mode !== 'edit') return
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === sheet.txId
          ? {
              ...tx,
              title: values.title,
              category: values.category,
              context: values.context,
              type: values.type,
              amount: parseAmount(values.amount),
              dateLabel: formatDateLabel(values.date),
              date: values.date,
              payer: values.payer || undefined,
              accountId: values.accountId || undefined,
              goalId: values.goalId || undefined,
              paymentMethod: values.paymentMethod || undefined,
            }
          : tx,
      ),
    )
    setSheet(null)
  }

  function handleDelete() {
    if (sheet?.mode !== 'edit') return
    setTransactions((prev) => prev.filter((tx) => tx.id !== sheet.txId))
    setSheet(null)
  }

  function handleCancelRule(ruleId: string) {
    // UC-FIN-013: cancelar a regra não apaga as Transactions já materializadas.
    setRecurrenceRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  const periodTransactions = getPeriodTransactions(transactions, month)
  const visible = periodTransactions.filter((tx) => matches(filter, tx.context))
  const { income, expense } = getIncomeExpenseTotals(visible)
  const expenseByCategory = getCategoryBreakdown(visible, 'despesa')
  const rankingData = getCategoryBreakdown(visible, rankingTab)
  const editingTx = sheet?.mode === 'edit' ? transactions.find((tx) => tx.id === sheet.txId) : undefined
  const goalOptions = initialGoals.filter((g) => !g.done).map((g) => ({ id: g.id, title: g.title }))

  return (
    <HomeLayout>
      <div className="px-6 pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight text-ink">Finanças</h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              {visible.length === 0 ? 'Nenhuma transação no período' : `${visible.length} transaç${visible.length > 1 ? 'ões' : 'ão'} no período`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSheet({ mode: 'create' })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-white transition active:scale-90"
            aria-label="Nova transação"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth((m) => addMonthsToMonthIso(m, -1))}
            className="flex h-8 w-8 items-center justify-center rounded-pill text-ink-muted transition active:scale-90"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={18} strokeWidth={2.4} />
          </button>
          <span className="text-[14px] font-bold text-ink">{formatMonthLabel(month)}</span>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonthsToMonthIso(m, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-pill text-ink-muted transition active:scale-90"
            aria-label="Próximo mês"
          >
            <ChevronRight size={18} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Tile span={2} className="flex items-center gap-4">
            <SavingsGauge income={income} expense={expense} />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted">
                <TrendingUp size={13} strokeWidth={2.4} />
                Economia mensal
              </div>
              <div className="mt-2 flex items-center justify-between text-[12.5px]">
                <span className="text-ink-faint">Receitas</span>
                <span className="tabular font-bold text-mint-text">{formatCurrency(income)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[12.5px]">
                <span className="text-ink-faint">Despesas</span>
                <span className="tabular font-bold text-ink">{formatCurrency(expense)}</span>
              </div>
              {income > 0 && expense > income ? (
                <p className="mt-2 text-[11px] font-semibold text-danger">Gastos acima da receita neste período.</p>
              ) : null}
            </div>
          </Tile>

          <Tile span={2}>
            <span className="mb-2 flex items-center gap-1.5 text-[15px] font-bold text-ink">
              <PieChart size={15} strokeWidth={2.4} />
              Despesas por categoria
            </span>
            {expenseByCategory.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-faint">Nenhuma despesa neste período.</p>
            ) : (
              <div className="flex items-center gap-4">
                <DonutChart data={expenseByCategory} centerLabel="Despesas" />
                <div className="flex flex-1 flex-col gap-2">
                  {expenseByCategory.slice(0, 5).map((d) => {
                    const style = getCategoryStyle(d.category)
                    return (
                      <div key={d.category} className="flex items-center gap-2 text-[12px]">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-pill" style={{ backgroundColor: style.hex }} />
                        <span className="min-w-0 flex-1 truncate font-medium text-ink-muted">{d.category}</span>
                        <span className="tabular shrink-0 font-bold text-ink">{formatCurrency(d.total)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Tile>

          <Tile span={2}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[15px] font-bold text-ink">Ranking de categorias</span>
              <div className="flex gap-1 rounded-pill bg-surface-muted p-0.5">
                <button
                  type="button"
                  onClick={() => setRankingTab('despesa')}
                  className={`rounded-pill px-2.5 py-1 text-[11px] font-bold transition ${rankingTab === 'despesa' ? 'bg-surface text-ink shadow-card' : 'text-ink-faint'}`}
                >
                  Despesas
                </button>
                <button
                  type="button"
                  onClick={() => setRankingTab('receita')}
                  className={`rounded-pill px-2.5 py-1 text-[11px] font-bold transition ${rankingTab === 'receita' ? 'bg-surface text-ink shadow-card' : 'text-ink-faint'}`}
                >
                  Receitas
                </button>
              </div>
            </div>
            <CategoryRanking data={rankingData} />
          </Tile>

          <Tile span={2} className="p-0">
            <button
              type="button"
              onClick={() => navigate('/home/financas/contas')}
              className="flex w-full items-center gap-3 px-4 py-4 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-accent-soft text-accent">
                <Landmark size={17} strokeWidth={2.4} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-ink">Contas</span>
                <span className="block text-[12px] text-ink-faint">
                  {initialAccounts.length} conta{initialAccounts.length > 1 ? 's' : ''} · Total{' '}
                  {formatCurrency(getVisibleAccountsTotal(initialAccounts, initialTransactions))}
                </span>
              </span>
              <ChevronRight size={18} strokeWidth={2.2} className="shrink-0 text-ink-faint" />
            </button>
          </Tile>

          <Tile span={2}>
            <span className="mb-1 flex items-center gap-1.5 text-[15px] font-bold text-ink">
              <Repeat size={15} strokeWidth={2.4} />
              Recorrências ativas
            </span>
            {recurrenceRules.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-faint">Nenhuma recorrência ativa no momento.</p>
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {recurrenceRules.map((rule) => {
                  const account = initialAccounts.find((acc) => acc.id === rule.accountId)
                  return (
                    <div key={rule.id} className="flex items-center justify-between gap-3 py-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold text-ink">{rule.title}</span>
                        <span className="mt-0.5 block text-[11px] font-medium text-ink-faint">
                          Todo dia {rule.dayOfMonth}
                          {account ? ` · ${account.name}` : ''}
                          {rule.endDate ? ` · até ${formatDate(rule.endDate)}` : ' · indefinida'}
                        </span>
                      </span>
                      <span
                        className={`tabular shrink-0 text-[14px] font-bold ${rule.type === 'receita' ? 'text-mint-text' : 'text-ink'}`}
                      >
                        {formatCurrency(rule.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCancelRule(rule.id)}
                        aria-label={`Cancelar recorrência ${rule.title}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-ink-faint transition active:scale-90"
                      >
                        <X size={15} strokeWidth={2.4} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </Tile>

          <Tile span={2}>
            <span className="mb-1 block text-[15px] font-bold text-ink">Transações</span>
            {visible.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra registrar uma transação.</p>
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {visible.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} onEdit={() => setSheet({ mode: 'edit', txId: tx.id })} />
                ))}
              </div>
            )}
          </Tile>
        </div>
      </div>

      {sheet?.mode === 'create' ? (
        <TransactionSheet
          mode="create"
          groupName={mockGroup.name}
          accountOptions={initialAccounts}
          goalOptions={goalOptions}
          onSave={handleCreate}
          onClose={() => setSheet(null)}
        />
      ) : null}

      {sheet?.mode === 'edit' && editingTx ? (
        <TransactionSheet
          mode="edit"
          groupName={mockGroup.name}
          accountOptions={initialAccounts}
          goalOptions={goalOptions}
          initial={{
            title: editingTx.title,
            category: editingTx.category,
            context: editingTx.context === 'group' ? 'group' : 'personal',
            type: editingTx.type,
            amount: editingTx.amount.toString().replace('.', ','),
            date: editingTx.date,
            payer: editingTx.payer ?? '',
            accountId: editingTx.accountId ?? '',
            installments: '',
            recurs: false,
            recurUntil: '',
            goalId: editingTx.goalId ?? '',
            paymentMethod: editingTx.paymentMethod ?? '',
          }}
          onSave={handleEditSave}
          onDelete={handleDelete}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </HomeLayout>
  )
}
