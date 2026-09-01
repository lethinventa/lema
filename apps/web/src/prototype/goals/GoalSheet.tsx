import { CheckCircle2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { TextField } from '../components/TextField'
import type { HomeContext } from '../home/homeMockData'

export interface GoalSheetValues {
  title: string
  context: Extract<HomeContext, 'personal' | 'group'>
  deadline: string
  category: string
  progress: number
}

interface GoalSheetProps {
  mode: 'create' | 'edit'
  groupName: string
  initial?: GoalSheetValues
  done?: boolean
  onSave: (values: GoalSheetValues) => void
  onComplete?: () => void
  onDelete?: () => void
  onClose: () => void
}

export function GoalSheet({ mode, groupName, initial, done, onSave, onComplete, onDelete, onClose }: GoalSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [context, setContext] = useState<'personal' | 'group'>(initial?.context ?? 'personal')
  const [deadline, setDeadline] = useState(initial?.deadline ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [progress, setProgress] = useState(initial?.progress ?? 0)

  function handleSave() {
    if (!title.trim()) return
    onSave({ title: title.trim(), context, deadline: deadline.trim(), category: category.trim(), progress })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[85%] overflow-y-auto rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
        <h2 className="text-[17px] font-bold text-ink">{mode === 'create' ? 'Novo objetivo' : 'Editar objetivo'}</h2>

        <div className="mt-4 flex flex-col gap-4">
          <TextField
            label="Título"
            placeholder="O que você quer alcançar?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <TextField
                label="Categoria (opcional)"
                placeholder="Ex.: Viagem"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <TextField
                label="Prazo (opcional)"
                placeholder="Ex.: Dez/2026"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
          </div>

          {mode === 'edit' && !done ? (
            <div>
              <span className="mb-2 flex items-center justify-between text-[13px] font-medium text-ink-muted">
                Progresso
                <span className="font-bold text-ink">{progress}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={title.trim().length === 0} onClick={handleSave}>
            {mode === 'create' ? 'Criar objetivo' : 'Salvar alterações'}
          </PrimaryButton>

          {mode === 'edit' && !done && onComplete ? (
            <>
              <GhostButton onClick={onComplete} className="flex items-center justify-center gap-1.5 text-accent">
                <CheckCircle2 size={16} strokeWidth={2.2} />
                Marcar como concluído
              </GhostButton>
              <p className="-mt-1 text-center text-[11px] text-ink-faint">Concluir um objetivo não pode ser desfeito.</p>
            </>
          ) : null}

          {mode === 'edit' && onDelete ? (
            <GhostButton onClick={onDelete} className="flex items-center justify-center gap-1.5 text-danger">
              <Trash2 size={16} strokeWidth={2.2} />
              Excluir objetivo
            </GhostButton>
          ) : mode === 'create' ? (
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
          ) : null}
        </div>
      </div>
    </div>
  )
}
