import { Plus, Wallet } from 'lucide-react'
import { useState } from 'react'
import { ContextFilterChips, type ContextFilterValue } from '../components/ContextFilterChips'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { type HomeContext, mockGroup } from '../home/homeMockData'
import { formatCurrency, initialTransactions, type MockTransaction } from './financeMockData'
import { TransactionSheet, type TransactionSheetValues } from './TransactionSheet'

function matches(filter: ContextFilterValue, context: HomeContext) {
  return filter === 'all' || filter === context
}

function parseAmount(raw: string) {
  const normalized = raw.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')
  const value = Number.parseFloat(normalized)
  return Number.isFinite(value) ? value : 0
}

function TransactionRow({ tx, onEdit }: { tx: MockTransaction; onEdit: () => void }) {
  return (
    <button type="button" onClick={onEdit} className="flex w-full items-center justify-between gap-3 py-3 text-left">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink">{tx.title}</span>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-ink-faint">{tx.dateLabel}</span>
          {tx.category ? (
            <span className="rounded-sm bg-peach-bg px-1.5 py-0.5 text-[11px] font-bold text-peach-fg">
              {tx.category}
            </span>
          ) : null}
          {tx.payer ? (
            <span className="rounded-sm bg-lavender-bg px-1.5 py-0.5 text-[11px] font-bold text-lavender-fg">
              {tx.payer}
            </span>
          ) : null}
        </div>
      </span>
      <span className="shrink-0 text-[15px] font-bold text-ink">{formatCurrency(tx.amount)}</span>
    </button>
  )
}

export function FinanceScreen() {
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [transactions, setTransactions] = useState(initialTransactions)
  const [sheet, setSheet] = useState<{ mode: 'create' } | { mode: 'edit'; txId: string } | null>(null)

  function handleCreate(values: TransactionSheetValues) {
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        title: values.title,
        category: values.category,
        context: values.context,
        amount: parseAmount(values.amount),
        dateLabel: values.dateLabel,
        payer: values.payer || undefined,
      },
      ...prev,
    ])
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
              amount: parseAmount(values.amount),
              dateLabel: values.dateLabel,
              payer: values.payer || undefined,
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

  const visible = transactions.filter((tx) => matches(filter, tx.context))
  const total = visible.reduce((sum, tx) => sum + tx.amount, 0)
  const editingTx = sheet?.mode === 'edit' ? transactions.find((tx) => tx.id === sheet.txId) : undefined

  return (
    <HomeLayout>
      <div className="px-6 pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight text-ink">Finanças</h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              {visible.length === 0 ? 'Nenhuma despesa no período' : `${visible.length} despesa${visible.length > 1 ? 's' : ''} no período`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSheet({ mode: 'create' })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-white transition active:scale-90"
            aria-label="Nova despesa"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-lg bg-accent px-5 py-6 text-white">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-white/70">
              <Wallet size={13} strokeWidth={2.4} />
              Total no filtro
            </span>
            <h2 className="mt-2 text-[28px] font-extrabold leading-snug">{formatCurrency(total)}</h2>
          </div>

          <Tile span={2}>
            <span className="mb-1 block text-[15px] font-bold text-ink">Despesas</span>
            {visible.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra registrar uma despesa.</p>
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
        <TransactionSheet mode="create" groupName={mockGroup.name} onSave={handleCreate} onClose={() => setSheet(null)} />
      ) : null}

      {sheet?.mode === 'edit' && editingTx ? (
        <TransactionSheet
          mode="edit"
          groupName={mockGroup.name}
          initial={{
            title: editingTx.title,
            category: editingTx.category,
            context: editingTx.context === 'group' ? 'group' : 'personal',
            amount: editingTx.amount.toString().replace('.', ','),
            dateLabel: editingTx.dateLabel,
            payer: editingTx.payer ?? '',
          }}
          onSave={handleEditSave}
          onDelete={handleDelete}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </HomeLayout>
  )
}
