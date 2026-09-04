import { Pencil, Repeat, Target, Trash2 } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { BackHeader } from '../components/BackHeader'
import { GhostButton } from '../components/Buttons'
import { CategoryChip } from '../components/CategoryChip'
import { FlagChip } from '../components/FlagChip'
import { initialGoals } from '../goals/goalsMockData'
import { initialAccounts } from './accountsMockData'
import { TODAY_ISO } from '../calendar/dateUtils'
import { formatCurrency, initialTransactions } from './financeMockData'

// Visualização é a tela padrão ao abrir uma transação — edição é uma ação
// explícita a partir daqui (ver docs/product/interaction-patterns.md).
export function TransactionDetailScreen() {
  const { txId } = useParams<{ txId: string }>()
  const navigate = useNavigate()
  const tx = initialTransactions.find((t) => t.id === txId)

  if (!tx) {
    return <Navigate to="/home/financas" replace />
  }

  const isIncome = tx.type === 'receita'
  const account = tx.accountId ? initialAccounts.find((acc) => acc.id === tx.accountId) : undefined
  const goal = tx.goalId ? initialGoals.find((g) => g.id === tx.goalId) : undefined

  function handleDelete() {
    const target = initialTransactions.find((t) => t.id === txId)
    if (!target) return
    target.deletedAt = TODAY_ISO
    navigate('/home/financas')
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader
        title={tx.title}
        subtitle={tx.dateLabel}
        to="/home/financas"
        action={
          <button
            type="button"
            onClick={() => navigate(`/home/financas/${tx.id}/editar`)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-surface-muted text-ink transition active:scale-90"
            aria-label="Editar transação"
          >
            <Pencil size={17} strokeWidth={2.2} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-md border border-line p-3">
            <CategoryChip category={tx.category} />
            <div className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium text-ink-muted">{tx.category || 'Sem categoria'}</span>
              <span className={`tabular block text-[22px] font-extrabold ${isIncome ? 'text-mint-text' : 'text-ink'}`}>
                {isIncome ? '+' : '−'} {formatCurrency(tx.amount)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <FlagChip>
              {tx.context === 'group' ? 'Grupo' : tx.context === 'shared' ? 'Compartilhado' : 'Pessoal'}
            </FlagChip>
            {tx.totalParcelas ? <FlagChip>{tx.numeroParcela}/{tx.totalParcelas}</FlagChip> : null}
            {tx.recurrenceRuleId ? <FlagChip icon={Repeat}>Recorrente</FlagChip> : null}
            {tx.paymentMethod === 'debito' ? <FlagChip>Débito no cartão</FlagChip> : null}
            {tx.paymentMethod === 'credito' ? <FlagChip>Crédito</FlagChip> : null}
            {goal ? <FlagChip icon={Target}>{goal.title}</FlagChip> : null}
          </div>

          {tx.payer ? (
            <div>
              <span className="mb-1.5 block text-[12px] font-semibold text-ink-muted">Pago por</span>
              <span className="flex items-center gap-1.5 rounded-pill bg-surface-muted py-1 pl-1 pr-2.5">
                <Avatar name={tx.payer} />
                <span className="text-[13px] font-semibold text-ink">{tx.payer}</span>
              </span>
            </div>
          ) : null}

          {account ? (
            <div>
              <span className="mb-1 block text-[12px] font-semibold text-ink-muted">Conta</span>
              <p className="text-[14px] font-semibold text-ink">{account.name}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <GhostButton onClick={handleDelete} className="flex items-center justify-center gap-1.5 text-danger">
          <Trash2 size={16} strokeWidth={2.2} />
          Excluir transação
        </GhostButton>
      </div>
    </div>
  )
}
