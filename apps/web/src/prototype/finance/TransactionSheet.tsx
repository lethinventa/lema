import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { TextField } from '../components/TextField'
import type { HomeContext } from '../home/homeMockData'

export interface TransactionSheetValues {
  title: string
  category: string
  context: Extract<HomeContext, 'personal' | 'group'>
  amount: string
  dateLabel: string
  payer: string
}

interface TransactionSheetProps {
  mode: 'create' | 'edit'
  groupName: string
  initial?: TransactionSheetValues
  onSave: (values: TransactionSheetValues) => void
  onDelete?: () => void
  onClose: () => void
}

export function TransactionSheet({ mode, groupName, initial, onSave, onDelete, onClose }: TransactionSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [context, setContext] = useState<'personal' | 'group'>(initial?.context ?? 'personal')
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [dateLabel, setDateLabel] = useState(initial?.dateLabel ?? '')
  const [payer, setPayer] = useState(initial?.payer ?? '')

  const canSave = title.trim().length > 0 && amount.trim().length > 0 && dateLabel.trim().length > 0

  function handleSave() {
    if (!canSave) return
    onSave({
      title: title.trim(),
      category: category.trim(),
      context,
      amount: amount.trim(),
      dateLabel: dateLabel.trim(),
      payer: payer.trim(),
    })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[85%] overflow-y-auto rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
        <h2 className="text-[17px] font-bold text-ink">{mode === 'create' ? 'Nova despesa' : 'Editar despesa'}</h2>

        <div className="mt-4 flex flex-col gap-4">
          <TextField
            label="Descrição"
            placeholder="Com o que foi gasto?"
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
              <TextField label="Data" placeholder="Ex.: Hoje, 05/09" value={dateLabel} onChange={(e) => setDateLabel(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <TextField
                label="Categoria (opcional)"
                placeholder="Ex.: Mercado"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <TextField
                label="Pago por (opcional)"
                placeholder="Ex.: Mateus"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
              />
            </div>
          </div>

          <div>
            <span className="mb-2 block text-[13px] font-medium text-ink-muted">Visibilidade</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setContext('personal')}
                className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                  context === 'personal'
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-surface text-ink-muted'
                }`}
              >
                Pessoal
              </button>
              <button
                type="button"
                onClick={() => setContext('group')}
                className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                  context === 'group' ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink-muted'
                }`}
              >
                {groupName}
              </button>
            </div>
            {context === 'group' ? (
              <p className="mt-2 text-[11px] leading-normal text-ink-faint">
                A divisão segue a regra padrão configurada para o grupo.
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={!canSave} onClick={handleSave}>
            {mode === 'create' ? 'Registrar despesa' : 'Salvar alterações'}
          </PrimaryButton>
          {mode === 'edit' && onDelete ? (
            <GhostButton onClick={onDelete} className="flex items-center justify-center gap-1.5 text-danger">
              <Trash2 size={16} strokeWidth={2.2} />
              Excluir despesa
            </GhostButton>
          ) : (
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
          )}
        </div>
      </div>
    </div>
  )
}
