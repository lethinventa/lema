import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { BackHeader } from '../components/BackHeader'
import { CategoryChip } from '../components/CategoryChip'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { TrashSheet } from '../components/TrashSheet'
import { initialGoals } from '../goals/goalsMockData'
import { mockGroups } from '../home/homeMockData'
import { addMonthsToMonthIso, formatMonthLabel, getCurrentMonthIso } from './accountsMockData'
import { formatCurrency, initialTransactions, type MockTransaction } from './financeMockData'
import { getPeriodTransactions } from './financeSelectors'

const goalTitleById = new Map(initialGoals.map((g) => [g.id, g.title]))

// Lista completa/filtrável de transações do mês, incluindo lixeira —
// destino do "Ver tudo" de FinanceScreen (que virou a home do módulo:
// resumo + atalhos + prévia). Ver docs/product/interaction-patterns.md.
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
          {tx.recurrenceRuleId ? <FlagChip>Recorrente</FlagChip> : null}
          {tx.paymentMethod === 'debito' ? <FlagChip>Débito no cartão</FlagChip> : null}
          {tx.paymentMethod === 'credito' ? <FlagChip>Crédito</FlagChip> : null}
          {goalTitle ? <FlagChip>{goalTitle}</FlagChip> : null}
        </div>
      </span>
      <span className={`tabular shrink-0 text-[14.5px] font-bold ${isIncome ? 'text-mint-text' : 'text-ink'}`}>
        {isIncome ? '+' : '−'} {formatCurrency(tx.amount)}
      </span>
    </button>
  )
}

export function TransactionsListScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [month, setMonth] = useState(searchParams.get('mes') || getCurrentMonthIso())
  const [transactions, setTransactions] = useState(initialTransactions)
  const [showTrash, setShowTrash] = useState(searchParams.get('lixeira') === '1')
  const [query, setQuery] = useState('')

  function handleRestoreTransaction(id: string) {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, deletedAt: undefined } : tx)))
  }

  function handleDeleteTransactionForever(id: string) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  const periodTransactions = getPeriodTransactions(transactions, month)
  const visible = periodTransactions
    .filter((tx) => matchesContext(filter, tx))
    .filter((tx) => tx.title.toLowerCase().includes(query.trim().toLowerCase()))
  const trashedTransactions = transactions.filter((tx) => tx.deletedAt)

  return (
    <HomeLayout>
      <BackHeader
        title="Todas as transações"
        to="/home/financas"
        action={
          <button
            type="button"
            onClick={() => setShowTrash(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-pill bg-surface-muted text-ink transition active:scale-90"
            aria-label="Lixeira de transações"
          >
            <Trash2 size={17} strokeWidth={2.2} />
            {trashedTransactions.length > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-pill bg-danger" />
            ) : null}
          </button>
        }
      />

      <div className="px-6 pb-4 pt-4">
        <div className="mb-4">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mb-4 flex items-center justify-between">
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

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar transação"
          className="mb-4 h-11 w-full rounded-md border border-line bg-surface px-3.5 text-[14px] text-ink placeholder:text-ink-faint focus:border-ink/30 focus:outline-none"
        />

        <Tile>
          {visible.length === 0 ? (
            <p className="py-2 text-[13px] text-ink-faint">Nenhuma transação encontrada.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {visible.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} onOpen={() => navigate(`/home/financas/${tx.id}`)} />
              ))}
            </div>
          )}
        </Tile>
      </div>

      {showTrash ? (
        <TrashSheet
          title="Lixeira · Transações"
          items={trashedTransactions}
          getId={(tx) => tx.id}
          getDeletedAt={(tx) => tx.deletedAt!}
          renderItem={(tx) => (
            <div>
              <span className="flex items-center gap-1.5">
                <span className="text-[15px] font-semibold text-ink">{tx.title}</span>
                <span className={`tabular text-[13px] font-bold ${tx.type === 'receita' ? 'text-mint-text' : 'text-ink-muted'}`}>
                  {tx.type === 'receita' ? '+' : '−'} {formatCurrency(tx.amount)}
                </span>
              </span>
              <span className="mt-1 block text-[12px] text-ink-faint">
                {tx.category ? `${tx.category} · ` : ''}
                {tx.context === 'group' ? mockGroups.find((g) => g.id === tx.groupId)?.name : tx.context === 'shared' ? 'Compartilhado' : 'Pessoal'}
              </span>
            </div>
          )}
          onRestore={handleRestoreTransaction}
          onDeleteForever={handleDeleteTransactionForever}
          onClose={() => setShowTrash(false)}
        />
      ) : null}
    </HomeLayout>
  )
}
