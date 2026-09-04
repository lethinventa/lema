import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { AccountSheet, type AccountSheetValues } from './AccountSheet'
import { accountTypeLabels, formatCurrency, initialAccounts, parseAmount } from './accountsMockData'
import { initialTransactions } from './financeMockData'
import { getAccountBalance, getProjectedBalance } from './financeSelectors'
import { initialRecurrenceRules } from './recurrenceMockData'

export function AccountDetailScreen() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState(initialAccounts)
  const [archived, setArchived] = useState(false)
  const [editing, setEditing] = useState(false)

  const account = accounts.find((acc) => acc.id === accountId)
  // Inclui também as compras no débito de cartões cuja conta de pagamento
  // seja esta (UC-FIN-011) — elas afetam este saldo mesmo sem accountId
  // apontar direto pra cá, ver financeSelectors.ts.
  const linkedCardIds = accounts.filter((acc) => acc.type === 'cartao' && acc.contaPagamentoId === accountId).map((acc) => acc.id)
  const transactions = initialTransactions.filter(
    (tx) => tx.accountId === accountId || (tx.accountId && linkedCardIds.includes(tx.accountId) && tx.paymentMethod === 'debito'),
  )

  if (!account || archived) {
    return <Navigate to="/home/financas/contas" replace />
  }

  function handleSave(values: AccountSheetValues) {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === account!.id) {
          return {
            ...acc,
            name: values.name,
            padrao: values.padrao,
            ignorarNosTotais: values.ignorarNosTotais,
            saldoBase: parseAmount(values.saldoBase),
          }
        }
        return values.padrao ? { ...acc, padrao: false } : acc
      }),
    )
    setEditing(false)
  }

  return (
    <HomeLayout>
      <BackHeader
        title={account.name}
        to="/home/financas/contas"
        subtitle={accountTypeLabels[account.type]}
        action={
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-surface-muted text-ink transition active:scale-90"
            aria-label="Editar conta"
          >
            <Pencil size={17} strokeWidth={2.2} />
          </button>
        }
      />

      <div className="px-6 pb-4 pt-5">
        <div className="shadow-hero rounded-[var(--radius-card)] bg-gradient-to-br from-accent to-[#3e0b5e] px-5 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wide text-white/70">Saldo atual</span>
              <h2 className="tabular mt-2 text-[28px] font-extrabold leading-snug tracking-tight">
                {formatCurrency(getAccountBalance(account, initialTransactions, accounts))}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-white/70">Previsto</span>
              <h3 className="tabular mt-2 text-[17px] font-bold leading-snug">
                {formatCurrency(getProjectedBalance(account, initialTransactions, initialRecurrenceRules, accounts))}
              </h3>
            </div>
          </div>
          {account.ignorarNosTotais ? (
            <p className="mt-3 text-[12px] text-white/70">Ignorada na soma total de contas</p>
          ) : null}
        </div>

        <div className="mt-6">
          <Tile span={2}>
            <span className="mb-1 block text-[15px] font-bold text-ink">Transações</span>
            {transactions.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-faint">Nenhuma transação nesta conta ainda.</p>
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">{tx.title}</span>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-medium text-ink-faint">{tx.dateLabel}</span>
                        {tx.totalParcelas ? <FlagChip>{tx.numeroParcela}/{tx.totalParcelas}</FlagChip> : null}
                        {tx.paymentMethod === 'debito' && tx.accountId !== account.id ? (
                          <FlagChip>Débito no cartão</FlagChip>
                        ) : null}
                      </div>
                    </span>
                    <span
                      className={`tabular shrink-0 text-[14px] font-bold ${tx.type === 'receita' ? 'text-mint-text' : 'text-ink'}`}
                    >
                      {tx.type === 'receita' ? '+' : '−'} {formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Tile>
        </div>
      </div>

      {editing ? (
        <AccountSheet
          mode="edit"
          paymentAccountOptions={accounts.filter((acc) => acc.type !== 'cartao' && acc.id !== account.id)}
          initial={{
            name: account.name,
            type: account.type,
            context: account.context,
            groupId: account.groupId,
            padrao: account.padrao,
            ignorarNosTotais: account.ignorarNosTotais,
            saldoBase: account.saldoBase.toString().replace('.', ','),
            limite: '',
            diaFechamento: '',
            diaVencimento: '',
            contaPagamentoId: '',
          }}
          onSave={handleSave}
          onDelete={() => {
            setArchived(true)
            navigate('/home/financas/contas')
          }}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </HomeLayout>
  )
}
