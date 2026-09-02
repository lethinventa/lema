import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { TextField } from '../components/TextField'
import type { HomeContext } from '../home/homeMockData'

export interface TaskSheetValues {
  title: string
  context: Extract<HomeContext, 'personal' | 'group'>
  dueDate: string // ISO, opcional (string vazia = sem prazo)
}

interface TaskSheetProps {
  mode: 'create' | 'edit'
  groupName: string
  initial?: TaskSheetValues
  onSave: (values: TaskSheetValues) => void
  onDelete?: () => void
  onClose: () => void
}

export function TaskSheet({ mode, groupName, initial, onSave, onDelete, onClose }: TaskSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [context, setContext] = useState<'personal' | 'group'>(initial?.context ?? 'personal')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')

  function handleSave() {
    if (!title.trim()) return
    onSave({ title: title.trim(), context, dueDate })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div className="relative rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
        <h2 className="text-[17px] font-bold text-ink">{mode === 'create' ? 'Nova tarefa' : 'Editar tarefa'}</h2>

        <div className="mt-4 flex flex-col gap-4">
          <TextField
            label="Título"
            placeholder="O que precisa ser feito?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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
          </div>

          <TextField
            label="Prazo (opcional)"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={title.trim().length === 0} onClick={handleSave}>
            {mode === 'create' ? 'Adicionar tarefa' : 'Salvar alterações'}
          </PrimaryButton>
          {mode === 'edit' && onDelete ? (
            <GhostButton onClick={onDelete} className="flex items-center justify-center gap-1.5 text-danger">
              <Trash2 size={16} strokeWidth={2.2} />
              Excluir tarefa
            </GhostButton>
          ) : (
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
          )}
        </div>
      </div>
    </div>
  )
}
