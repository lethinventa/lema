import { CreditCard, Landmark, PiggyBank, Plus, Star, TrendingUp, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { AccountSheet, type AccountSheetValues } from './AccountSheet'
import {
  accountTypeLabels,
  formatCurrency,
  initialAccounts,
  initialInvoices,
  parseAmount,
  resolveInvoiceStatus,
  type MockAccount,
} from './accountsMockData'
import { initialTransactions } from './financeMockData'
import { getAccountBalance, getInvoiceTotal, getVisibleAccountsTotal } from './financeSelectors'

const TYPE_ICONS: Record<MockAccount['type'], ReactNode> = {
  corrente: <Landmark size={18} strokeWidth={2.2} />,
  carteira: <Wallet size={18} strokeWidth={2.2} />,
  poupanca: <PiggyBank size={18} strokeWidth={2.2} />,
  investimento: <TrendingUp size={18} strokeWidth={2.2} />,
  cartao: <CreditCard size={18} strokeWidth={2.2} />,
}

function AccountRow({
  account,
  balance,
  cardInvoiceTotal,
  onOpen,
}: {
  account: MockAccount
  balance: number
  cardInvoiceTotal?: number
  onOpen: () => void
}) {
  const isCard = account.type === 'cartao'
  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 py-3 text-left">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-surface-muted text-ink-muted">
        {TYPE_ICONS[account.type]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[14px] font-semibold text-ink">{account.name}</span>
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-ink-faint">{accountTypeLabels[account.type]}</span>
          {account.padrao ? <FlagChip icon={Star}>Padrão</FlagChip> : null}
          {account.ignorarNosTotais ? <FlagChip>Ignorar nos totais</FlagChip> : null}
        </div>
      </span>
      {isCard ? (
        <span className="shrink-0 text-right">
          <span className="tabular block text-[14.5px] font-bold text-ink">{formatCurrency(cardInvoiceTotal ?? 0)}</span>
          <span className="block text-[11px] text-ink-faint">fatura atual</span>
        </span>
      ) : (
        <span className="tabular shrink-0 text-[14.5px] font-bold text-ink">{formatCurrency(balance)}</span>
      )}
    </button>
  )
}

export function AccountsScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [accounts, setAccounts] = useState(initialAccounts)
  const [sheetOpen, setSheetOpen] = useState(false)

  const transactions = initialTransactions
  const visible = accounts.filter((acc) => matchesContext(filter, acc))
  const total = getVisibleAccountsTotal(visible, transactions)

  function handleCreate(values: AccountSheetValues) {
    const id = `acc-${Date.now()}`
    setAccounts((prev) => {
      const next = values.padrao ? prev.map((acc) => ({ ...acc, padrao: false })) : prev
      return [
        ...next,
        {
          id,
          name: values.name,
          type: values.type,
          context: values.context,
          groupId: values.groupId,
          padrao: values.padrao,
          ignorarNosTotais: values.ignorarNosTotais,
          saldoBase: parseAmount(values.saldoBase),
          limite: values.type === 'cartao' ? parseAmount(values.limite) : undefined,
          diaFechamento: values.type === 'cartao' ? Number.parseInt(values.diaFechamento, 10) || undefined : undefined,
          diaVencimento: values.type === 'cartao' ? Number.parseInt(values.diaVencimento, 10) || undefined : undefined,
          contaPagamentoId: values.type === 'cartao' ? values.contaPagamentoId || undefined : undefined,
        },
      ]
    })
    setSheetOpen(false)
  }

  return (
    <HomeLayout>
      <BackHeader
        title="Contas"
        to="/home/financas"
        subtitle={visible.length === 0 ? 'Nenhuma conta' : `${visible.length} conta${visible.length > 1 ? 's' : ''}`}
        action={
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-ink transition active:scale-90"
            aria-label="Nova conta"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        }
      />

      <div className="px-6 pb-4 pt-5">
        <ContextFilterChips value={filter} onChange={setFilter} />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="shadow-hero col-span-2 rounded-[var(--radius-card)] bg-gradient-to-br from-accent to-[#3e0b5e] px-5 py-6 text-white">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-white/70">
              <Landmark size={13} strokeWidth={2.4} />
              Total em contas
            </span>
            <h2 className="tabular mt-2 text-[28px] font-extrabold leading-snug tracking-tight">{formatCurrency(total)}</h2>
            <p className="mt-1 text-[12px] text-white/70">Não inclui contas marcadas como "ignorar nos totais"</p>
          </div>

          <Tile span={2}>
            {visible.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra criar uma conta.</p>
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {visible.map((account) => {
                  const openInvoice = initialInvoices.find(
                    (inv) => inv.cardId === account.id && resolveInvoiceStatus(inv) === 'ABERTA',
                  )
                  return (
                    <AccountRow
                      key={account.id}
                      account={account}
                      balance={getAccountBalance(account, transactions, accounts)}
                      cardInvoiceTotal={openInvoice ? getInvoiceTotal(openInvoice, transactions) : undefined}
                      onOpen={() =>
                        navigate(
                          account.type === 'cartao'
                            ? `/home/financas/cartoes/${account.id}`
                            : `/home/financas/contas/${account.id}`,
                        )
                      }
                    />
                  )
                })}
              </div>
            )}
          </Tile>
        </div>
      </div>

      {sheetOpen ? (
        <AccountSheet
          mode="create"
          paymentAccountOptions={accounts.filter((acc) => acc.type !== 'cartao')}
          onSave={handleCreate}
          onClose={() => setSheetOpen(false)}
        />
      ) : null}
    </HomeLayout>
  )
}
