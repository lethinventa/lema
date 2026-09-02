import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { MemberPicker } from '../components/MemberPicker'
import { TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'

export interface TaskSheetValues {
  title: string
  context: 'personal' | 'group'
  groupId?: string
  dueDate: string // ISO, opcional (string vazia = sem prazo)
  assigneeIds: string[]
  about: string
}

interface TaskSheetProps {
  mode: 'create' | 'edit'
  initial?: TaskSheetValues
  onSave: (values: TaskSheetValues) => void
  onDelete?: () => void
  onClose: () => void
}

export function TaskSheet({ mode, initial, onSave, onDelete, onClose }: TaskSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: initial?.context ?? 'personal',
    groupId: initial?.groupId,
  })
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [assigneeIds, setAssigneeIds] = useState<string[]>(initial?.assigneeIds ?? [])
  const [about, setAbout] = useState(initial?.about ?? '')

  function handleSave() {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      dueDate,
      assigneeIds: visibility.context === 'group' ? assigneeIds : [],
      about: visibility.context === 'personal' ? about.trim() : '',
    })
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

          <VisibilityPicker value={visibility} onChange={setVisibility} />

          {visibility.context === 'group' && visibility.groupId ? (
            <MemberPicker
              groupId={visibility.groupId}
              label="Responsável (opcional)"
              selectedIds={assigneeIds}
              onChange={setAssigneeIds}
              hint="Quem tem que fazer isso? Pode escolher mais de uma pessoa, ou nenhuma."
            />
          ) : null}

          {visibility.context === 'personal' ? (
            <TextField
              label="Sobre quem ou o que é isso? (opcional)"
              placeholder="Ex.: Minha mãe"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              hint="Só uma lembrança visual pra você — não compartilha nada com ninguém."
            />
          ) : null}

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
