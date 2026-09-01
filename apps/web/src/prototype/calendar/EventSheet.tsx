import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { TextField } from '../components/TextField'
import type { HomeContext } from '../home/homeMockData'

export interface EventSheetValues {
  title: string
  context: Extract<HomeContext, 'personal' | 'group'>
  dayLabel: string
  time: string
  location: string
}

interface EventSheetProps {
  mode: 'create' | 'edit'
  groupName: string
  initial?: EventSheetValues
  onSave: (values: EventSheetValues) => void
  onDelete?: () => void
  onClose: () => void
}

export function EventSheet({ mode, groupName, initial, onSave, onDelete, onClose }: EventSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [context, setContext] = useState<'personal' | 'group'>(initial?.context ?? 'personal')
  const [dayLabel, setDayLabel] = useState(initial?.dayLabel ?? '')
  const [time, setTime] = useState(initial?.time ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')

  const canSave = title.trim().length > 0 && dayLabel.trim().length > 0 && time.trim().length > 0

  function handleSave() {
    if (!canSave) return
    onSave({ title: title.trim(), context, dayLabel: dayLabel.trim(), time: time.trim(), location: location.trim() })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[85%] overflow-y-auto rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
        <h2 className="text-[17px] font-bold text-ink">{mode === 'create' ? 'Novo compromisso' : 'Editar compromisso'}</h2>

        <div className="mt-4 flex flex-col gap-4">
          <TextField
            label="Título"
            placeholder="O que vai acontecer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <TextField label="Dia" placeholder="Ex.: Hoje, Sexta" value={dayLabel} onChange={(e) => setDayLabel(e.target.value)} />
            </div>
            <div className="flex-1">
              <TextField label="Horário" placeholder="Ex.: 14:00" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <TextField
            label="Local (opcional)"
            placeholder="Ex.: Escritório"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={!canSave} onClick={handleSave}>
            {mode === 'create' ? 'Adicionar compromisso' : 'Salvar alterações'}
          </PrimaryButton>
          {mode === 'edit' && onDelete ? (
            <GhostButton onClick={onDelete} className="flex items-center justify-center gap-1.5 text-danger">
              <Trash2 size={16} strokeWidth={2.2} />
              Excluir compromisso
            </GhostButton>
          ) : (
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
          )}
        </div>
      </div>
    </div>
  )
}
