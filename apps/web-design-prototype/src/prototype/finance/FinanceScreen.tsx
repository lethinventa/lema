import { ChevronLeft, ChevronRight, PieChart, Plus, Repeat, TrendingDown, TrendingUp, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { CategoryChip } from '../components/CategoryChip'
import { CategoryRanking } from '../components/CategoryRanking'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { DonutChart } from '../components/DonutChart'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { getCategoryStyle } from '../components/palette'
import { type QuickAction, QuickActionsRow } from '../components/QuickActionsRow'
import { SavingsGauge } from '../components/SavingsGauge'
import { SectionHeader } from '../components/SectionHeader'
import { Tile } from '../components/Tile'
import { initialGoals } from '../goals/goalsMockData'
import { addMonthsToMonthIso, formatDate, formatMonthLabel, getCurrentMonthIso, initialAccounts } from './accountsMockData'
import { formatCurrency, initialTransactions, type MockTransaction, type TransactionType } from './financeMockData'
import { getCategoryBreakdown, getIncomeExpenseTotals, getPeriodTransactions } from './financeSelectors'
import { initialRecurrenceRules, type MockRecurrenceRule } from './recurrenceMockData'

// Home do módulo Finanças: resumo geral + atalhos + prévia da atividade +
// "Ver tudo" (TransactionsListScreen, que tem a lista completa/filtrável +
// lixeira) — ver docs/product/interaction-patterns.md.
const PREVIEW_COUNT = 5

const goalTitleById = new Map(initialGoals.map((g) => [g.id, g.title]))

function TransactionRow({ tx, onOpen }: { tx: MockTransaction; onOpen: () => void }) {
  const isIncome = tx.type === 'receita'
  const goalTitle = tx.goalId ? goalTitleById.get(tx.goalId) : undefined
  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 py-3 text-left">
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
          {goalTitle ? <FlagChip>{goalTitle}</FlagChip> : null}
        </div>
      </span>
      <span className={`tabular shrink-0 text-[14.5px] font-bold ${isIncome ? 'text-mint-text' : 'text-ink'}`}>
        {isIncome ? '+' : '−'} {formatCurrency(tx.amount)}
      </span>
    </button>
  )
}

export function FinanceScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [month, setMonth] = useState(getCurrentMonthIso())
  const [rankingTab, setRankingTab] = useState<TransactionType>('despesa')
  const [recurrenceRules, setRecurrenceRules] = useState<MockRecurrenceRule[]>(initialRecurrenceRules)

  function handleCancelRule(ruleId: string) {
    // UC-FIN-013: cancelar a regra não apaga as Transactions já materializadas.
    setRecurrenceRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  const periodTransactions = getPeriodTransactions(initialTransactions, month)
  const visible = periodTransactions.filter((tx) => matchesContext(filter, tx))
  const { income, expense } = getIncomeExpenseTotals(visible)
  const expenseByCategory = getCategoryBreakdown(visible, 'despesa')
  const rankingData = getCategoryBreakdown(visible, rankingTab)
  const preview = visible.slice(0, PREVIEW_COUNT)

  const quickActions: QuickAction[] = [
    { label: 'Nova despesa', icon: TrendingDown, to: '/home/financas/nova?tipo=despesa' },
    { label: 'Nova receita', icon: TrendingUp, to: '/home/financas/nova?tipo=receita' },
    { label: 'Contas', icon: Wallet, to: '/home/financas/contas' },
  ]

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
            onClick={() => navigate('/home/financas/nova')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-ink transition active:scale-90"
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

        <Tile className="mt-4 flex items-center gap-4">
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

        <div className="mt-4">
          <QuickActionsRow actions={quickActions} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
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
        </div>

        <div className="mt-6">
          <SectionHeader title="Atividade" to={`/home/financas/todas?mes=${month}`} />
          {preview.length === 0 ? (
            <Tile>
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra registrar uma transação.</p>
            </Tile>
          ) : (
            <Tile>
              <div className="flex flex-col divide-y divide-line">
                {preview.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} onOpen={() => navigate(`/home/financas/${tx.id}`)} />
                ))}
              </div>
            </Tile>
          )}
        </div>
      </div>
    </HomeLayout>
  )
}
