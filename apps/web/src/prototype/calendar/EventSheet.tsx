import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { MemberPicker } from '../components/MemberPicker'
import { SelectField, TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import type { RecurrenceFreq } from './calendarMockData'

export interface EventSheetValues {
  title: string
  context: 'personal' | 'group'
  groupId?: string
  date: string // ISO
  time: string
  endTime: string
  location: string
  participants: string[]
  participantIds: string[]
  recurrenceFreq: RecurrenceFreq | ''
  recurrenceEndDate: string
  // Só é lido quando se está editando uma ocorrência de série recorrente —
  // decide se a alteração/exclusão afeta só esta ocorrência ou toda a série
  // (UC-CAL-007: "o sistema pergunta se a ação deve afetar apenas a
  // ocorrência atual ou toda a série").
  scope: 'occurrence' | 'series'
}

interface EventSheetProps {
  mode: 'create' | 'edit'
  initial?: EventSheetValues
  isRecurringOccurrence?: boolean
  onSave: (values: EventSheetValues) => void
  onDelete?: (scope: 'occurrence' | 'series') => void
  onClose: () => void
}

const RECURRENCE_LABELS: Record<RecurrenceFreq | '', string> = {
  '': 'Não repete',
  daily: 'Diariamente',
  weekly: 'Semanalmente',
  monthly: 'Mensalmente',
}
const RECURRENCE_OPTIONS = ['Não repete', 'Diariamente', 'Semanalmente', 'Mensalmente']

export function EventSheet({ mode, initial, isRecurringOccurrence, onSave, onDelete, onClose }: EventSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: initial?.context ?? 'personal',
    groupId: initial?.groupId,
  })
  const [date, setDate] = useState(initial?.date ?? '')
  const [time, setTime] = useState(initial?.time ?? '')
  const [endTime, setEndTime] = useState(initial?.endTime ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [participants, setParticipants] = useState<string[]>(initial?.participants ?? [])
  const [newParticipant, setNewParticipant] = useState('')
  const [participantIds, setParticipantIds] = useState<string[]>(initial?.participantIds ?? [])
  const [recurrenceFreq, setRecurrenceFreq] = useState<RecurrenceFreq | ''>(initial?.recurrenceFreq ?? '')
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(initial?.recurrenceEndDate ?? '')
  const [scope, setScope] = useState<'occurrence' | 'series'>(initial?.scope ?? 'occurrence')

  const canSave = title.trim().length > 0 && date.trim().length > 0 && time.trim().length > 0
  const showScopeToggle = mode === 'edit' && isRecurringOccurrence

  function handleSave() {
    if (!canSave) return
    onSave({
      title: title.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      date,
      time,
      endTime: endTime.trim(),
      location: location.trim(),
      participants: visibility.context === 'personal' ? participants : [],
      participantIds: visibility.context === 'group' ? participantIds : [],
      recurrenceFreq,
      recurrenceEndDate,
      scope,
    })
  }

  function handleAddParticipant() {
    const name = newParticipant.trim()
    if (!name || participants.includes(name)) return
    setParticipants((prev) => [...prev, name])
    setNewParticipant('')
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[90%] overflow-y-auto rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
        <h2 className="text-[17px] font-bold text-ink">{mode === 'create' ? 'Novo compromisso' : 'Editar compromisso'}</h2>

        {showScopeToggle ? (
          <div className="mt-4">
            <span className="mb-2 block text-[13px] font-medium text-ink-muted">Aplicar alteração a</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScope('occurrence')}
                className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                  scope === 'occurrence' ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink-muted'
                }`}
              >
                Esta ocorrência
              </button>
              <button
                type="button"
                onClick={() => setScope('series')}
                className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                  scope === 'series' ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink-muted'
                }`}
              >
                Toda a série
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-4">
          <TextField
            label="Título"
            placeholder="O que vai acontecer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <TextField
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={showScopeToggle && scope === 'occurrence'}
                hint={showScopeToggle && scope === 'occurrence' ? 'Mudar a data desta ocorrência não é suportado ainda.' : undefined}
              />
            </div>
            <div className="flex-1">
              <TextField label="Início" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="flex-1">
              <TextField label="Fim (opcional)" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <TextField
            label="Local (opcional)"
            placeholder="Ex.: Escritório"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <VisibilityPicker value={visibility} onChange={setVisibility} />

          {visibility.context === 'group' && visibility.groupId ? (
            <MemberPicker
              groupId={visibility.groupId}
              label="Participantes (opcional)"
              selectedIds={participantIds}
              onChange={setParticipantIds}
              hint="Só membros do grupo podem participar de um compromisso de grupo."
            />
          ) : (
            <div>
              {participants.length > 0 ? (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {participants.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 rounded-pill bg-surface-muted py-1 pl-1 pr-2 text-[12px] font-semibold text-ink"
                    >
                      <Avatar name={name} />
                      {name}
                      <button
                        type="button"
                        onClick={() => setParticipants((prev) => prev.filter((p) => p !== name))}
                        aria-label={`Remover ${name}`}
                        className="ml-0.5 flex h-4 w-4 items-center justify-center text-ink-faint"
                      >
                        <X size={11} strokeWidth={2.6} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextField
                    label="Participantes (opcional)"
                    placeholder="Nome da pessoa"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddParticipant()
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md bg-sky-bg text-sky-fg"
                  aria-label="Adicionar participante"
                >
                  <Plus size={18} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          )}

          {!showScopeToggle || scope === 'series' ? (
            <div className="flex gap-3">
              <div className="flex-1">
                <SelectField
                  label="Repetir"
                  options={RECURRENCE_OPTIONS}
                  value={RECURRENCE_LABELS[recurrenceFreq]}
                  onChange={(e) => {
                    const found = (Object.entries(RECURRENCE_LABELS) as [RecurrenceFreq | '', string][]).find(
                      ([, label]) => label === e.target.value,
                    )
                    if (found) setRecurrenceFreq(found[0])
                  }}
                />
              </div>
              {recurrenceFreq ? (
                <div className="flex-1">
                  <TextField
                    label="Até (opcional)"
                    type="date"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={!canSave} onClick={handleSave}>
            {mode === 'create' ? 'Adicionar compromisso' : 'Salvar alterações'}
          </PrimaryButton>
          {mode === 'edit' && onDelete ? (
            <GhostButton onClick={() => onDelete(scope)} className="flex items-center justify-center gap-1.5 text-danger">
              <Trash2 size={16} strokeWidth={2.2} />
              {showScopeToggle ? (scope === 'series' ? 'Excluir toda a série' : 'Excluir esta ocorrência') : 'Excluir compromisso'}
            </GhostButton>
          ) : (
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
          )}
        </div>
      </div>
    </div>
  )
}
