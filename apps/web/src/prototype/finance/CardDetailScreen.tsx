import { CheckCircle2, ChevronLeft, ChevronRight, CreditCard, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { PrimaryButton } from '../components/Buttons'
import { mockGroup } from '../home/homeMockData'
import { AccountSheet, type AccountSheetValues } from './AccountSheet'
import {
  MOCK_TODAY,
  formatCurrency,
  formatDate,
  formatDateLabel,
  initialAccounts,
  initialInvoices,
  parseAmount,
  resolveInvoiceStatus,
  type MockInvoice,
} from './accountsMockData'
import { initialTransactions, type MockTransaction } from './financeMockData'
import { getInvoiceTotal, getInvoiceTransactions } from './financeSelectors'

const STATUS_STYLES: Record<ReturnType<typeof resolveInvoiceStatus>, string> = {
  ABERTA: 'bg-sky-bg text-sky-fg',
  FECHADA: 'bg-peach-bg text-peach-fg',
  PAGA: 'bg-mint-bg text-mint-fg',
}

export function CardDetailScreen() {
  const { accountId } = useParams<{ accountId: string }>()
  const [accounts, setAccounts] = useState(initialAccounts)
  const [invoices, setInvoices] = useState<MockInvoice[]>(initialInvoices)
  const [transactions, setTransactions] = useState<MockTransaction[]>(initialTransactions)
  const [periodIndex, setPeriodIndex] = useState<number | null>(null)
  const [editing, setEditing] = useState(false)

  const card = accounts.find((acc) => acc.id === accountId && acc.type === 'cartao')
  const cardInvoices = invoices.filter((inv) => inv.cardId === accountId).sort((a, b) => a.cycleStart.localeCompare(b.cycleStart))

  if (!card) {
    return <Navigate to="/home/financas/contas" replace />
  }

  const defaultIndex = cardInvoices.findIndex((inv) => resolveInvoiceStatus(inv) === 'ABERTA')
  const index = periodIndex ?? (defaultIndex === -1 ? cardInvoices.length - 1 : defaultIndex)
  const invoice = cardInvoices[index]
  const status = invoice ? resolveInvoiceStatus(invoice) : 'ABERTA'
  const invoiceTotal = invoice ? getInvoiceTotal(invoice, transactions) : 0
  const invoiceTransactions = invoice ? getInvoiceTransactions(invoice, transactions) : []

  const emAberto = cardInvoices
    .filter((inv) => resolveInvoiceStatus(inv) !== 'PAGA')
    .reduce((sum, inv) => sum + getInvoiceTotal(inv, transactions), 0)
  const limite = card.limite ?? 0
  const disponivel = Math.max(0, limite - emAberto)
  const usedPct = limite > 0 ? Math.min(100, Math.round((emAberto / limite) * 100)) : 0

  const paymentAccount = accounts.find((acc) => acc.id === card.contaPagamentoId)
  const cardName = card.name
  const cardContext = card.context

  // Registrar o pagamento não é só marcar a fatura como paga — o dinheiro
  // precisa efetivamente sair da conta de pagamento, senão o saldo dela
  // nunca reflete o que já foi gasto no cartão (gap identificado e corrigido
  // nesta rodada, ver UC-FIN-011).
  function handlePay() {
    if (!invoice) return
    const paymentDate = MOCK_TODAY.toISOString().slice(0, 10)
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? { ...inv, paid: true, paymentDate } : inv)))
    if (paymentAccount) {
      setTransactions((prev) => [
        {
          id: `tx-pay-${invoice.id}`,
          title: `Pagamento da fatura — ${cardName}`,
          category: 'Fatura',
          context: cardContext,
          type: 'despesa',
          amount: invoiceTotal,
          dateLabel: formatDateLabel(paymentDate),
          date: paymentDate,
          accountId: paymentAccount.id,
        },
        ...prev,
      ])
    }
  }

  function handleSave(values: AccountSheetValues) {
    setAccounts((prev) => {
      const next = values.padrao ? prev.map((acc) => ({ ...acc, padrao: false })) : prev
      return next.map((acc) =>
        acc.id === card!.id
          ? {
              ...acc,
              name: values.name,
              padrao: values.padrao,
              ignorarNosTotais: values.ignorarNosTotais,
              limite: parseAmount(values.limite) || acc.limite,
              diaFechamento: Number.parseInt(values.diaFechamento, 10) || acc.diaFechamento,
              diaVencimento: Number.parseInt(values.diaVencimento, 10) || acc.diaVencimento,
              contaPagamentoId: values.contaPagamentoId || undefined,
            }
          : acc,
      )
    })
    setEditing(false)
  }

  return (
    <HomeLayout>
      <BackHeader
        title={card.name}
        to="/home/financas/contas"
        subtitle="Cartão de crédito"
        action={
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-surface-muted text-ink transition active:scale-90"
            aria-label="Editar cartão"
          >
            <Pencil size={17} strokeWidth={2.2} />
          </button>
        }
      />

      <div className="px-6 pb-4 pt-5">
        <Tile span={2}>
          <div className="flex items-center justify-between text-[13px] font-semibold text-ink-muted">
            <span>Limite</span>
            <span>Em aberto</span>
            <span>Limite disp.</span>
          </div>
          <div className="tabular mt-1 flex items-center justify-between text-[15px] font-bold text-ink">
            <span>{formatCurrency(limite)}</span>
            <span className="text-danger">{formatCurrency(emAberto)}</span>
            <span>{formatCurrency(disponivel)}</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-surface-muted">
            <div className="h-full rounded-pill bg-accent" style={{ width: `${usedPct}%` }} />
          </div>
          <p className="mt-3 text-[12px] text-ink-faint">
            Fechamento dia {card.diaFechamento} · Vencimento dia {card.diaVencimento} · Pagamento em{' '}
            {paymentAccount?.name ?? 'a definir'}
          </p>
        </Tile>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setPeriodIndex(index - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-pill text-ink-muted disabled:opacity-30"
            aria-label="Fatura anterior"
          >
            <ChevronLeft size={18} strokeWidth={2.4} />
          </button>
          <span className="text-[14px] font-bold text-ink">{invoice?.periodLabel}</span>
          <button
            type="button"
            disabled={index === cardInvoices.length - 1}
            onClick={() => setPeriodIndex(index + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-pill text-ink-muted disabled:opacity-30"
            aria-label="Próxima fatura"
          >
            <ChevronRight size={18} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Tile span={2}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink-muted">Fatura</span>
              <span className={`rounded-sm px-1.5 py-0.5 text-[11px] font-bold ${STATUS_STYLES[status]}`}>
                {status === 'ABERTA' ? 'Aberta' : status === 'FECHADA' ? 'Fechada' : 'Paga'}
              </span>
            </div>
            <h2 className="tabular mt-1 text-[24px] font-extrabold leading-snug tracking-tight text-ink">{formatCurrency(invoiceTotal)}</h2>

            {status === 'FECHADA' ? (
              <PrimaryButton onClick={handlePay} className="mt-3 h-11 text-[14px]">
                Registrar pagamento
              </PrimaryButton>
            ) : null}
            {status === 'PAGA' && invoice?.paymentDate ? (
              <p className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-mint-fg">
                <CheckCircle2 size={14} strokeWidth={2.4} />
                Paga em {formatDate(invoice.paymentDate)}
              </p>
            ) : null}
            {status === 'ABERTA' ? (
              <p className="mt-3 text-[12px] text-ink-faint">
                O pagamento fica disponível depois que a fatura fechar.
              </p>
            ) : null}
          </Tile>

          <Tile span={2}>
            <span className="mb-1 flex items-center gap-1.5 text-[15px] font-bold text-ink">
              <CreditCard size={15} strokeWidth={2.4} />
              Transações do ciclo
            </span>
            {invoiceTransactions.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-faint">Nenhuma transação nesse ciclo.</p>
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {invoiceTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">{tx.title}</span>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-medium text-ink-faint">{tx.dateLabel}</span>
                        {tx.totalParcelas ? <FlagChip>{tx.numeroParcela}/{tx.totalParcelas}</FlagChip> : null}
                      </div>
                    </span>
                    <span className="tabular shrink-0 text-[14px] font-bold text-ink">{formatCurrency(tx.amount)}</span>
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
          groupName={mockGroup.name}
          paymentAccountOptions={accounts.filter((acc) => acc.type !== 'cartao')}
          initial={{
            name: card.name,
            type: 'cartao',
            context: card.context,
            padrao: card.padrao,
            ignorarNosTotais: card.ignorarNosTotais,
            saldoBase: '',
            limite: (card.limite ?? '').toString(),
            diaFechamento: (card.diaFechamento ?? '').toString(),
            diaVencimento: (card.diaVencimento ?? '').toString(),
            contaPagamentoId: card.contaPagamentoId ?? '',
          }}
          onSave={handleSave}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </HomeLayout>
  )
}
