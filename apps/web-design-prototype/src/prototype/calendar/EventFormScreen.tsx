import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { BackHeader } from '../components/BackHeader'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { MemberPicker } from '../components/MemberPicker'
import { SelectField, TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import { initialEvents, type MockEventRecurrence, type RecurrenceFreq } from './calendarMockData'
import {
  applyOccurrenceDelete,
  applyOccurrenceEdit,
  applySeriesDelete,
  applySeriesEdit,
  getOccurrencesForDate,
  type EventEditInput,
} from './calendarSelectors'
import { TODAY_ISO } from './dateUtils'

const RECURRENCE_LABELS: Record<RecurrenceFreq | '', string> = {
  '': 'Não repete',
  daily: 'Diariamente',
  weekly: 'Semanalmente',
  monthly: 'Mensalmente',
}
const RECURRENCE_OPTIONS = ['Não repete', 'Diariamente', 'Semanalmente', 'Mensalmente']

function replaceEvents(next: ReturnType<typeof applySeriesEdit>) {
  initialEvents.length = 0
  initialEvents.push(...next)
}

// Criar/editar compromisso é página cheia, não bottom sheet (ver
// docs/product/interaction-patterns.md) — mesmo padrão de TaskFormScreen.
// Ocorrência de série recorrente não tem uma única "linha" no mock — é
// recalculada a partir de eventId (raiz da série) + data (?data=), via
// getOccurrencesForDate, igual a como a Agenda/Semana/Mês já encontram
// ocorrências pra exibir.
export function EventFormScreen() {
  const { eventId } = useParams<{ eventId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const occurrenceDate = searchParams.get('data') ?? TODAY_ISO
  const mode: 'create' | 'edit' = eventId ? 'edit' : 'create'

  const occurrence = eventId
    ? getOccurrencesForDate(initialEvents, occurrenceDate).find((occ) => occ.occurrenceKey === `${eventId}:${occurrenceDate}`)
    : undefined

  const [title, setTitle] = useState(occurrence?.event.title ?? '')
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: occurrence?.event.context === 'group' ? 'group' : 'personal',
    groupId: occurrence?.event.groupId,
  })
  const [date, setDate] = useState(occurrence?.date ?? searchParams.get('data') ?? TODAY_ISO)
  const [time, setTime] = useState(occurrence?.event.time ?? '')
  const [endTime, setEndTime] = useState(occurrence?.event.endTime ?? '')
  const [location, setLocation] = useState(occurrence?.event.location ?? '')
  const [participants, setParticipants] = useState<string[]>(occurrence?.event.participants ?? [])
  const [newParticipant, setNewParticipant] = useState('')
  const [participantIds, setParticipantIds] = useState<string[]>(occurrence?.event.participantIds ?? [])
  const [recurrenceFreq, setRecurrenceFreq] = useState<RecurrenceFreq | ''>(occurrence?.event.recurrence?.freq ?? '')
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(occurrence?.event.recurrence?.endDate ?? '')
  const [scope, setScope] = useState<'occurrence' | 'series'>('occurrence')

  if (mode === 'edit' && !occurrence) {
    return <Navigate to="/home/calendario" replace />
  }

  const showScopeToggle = mode === 'edit' && occurrence!.isRecurring
  const canSave = title.trim().length > 0 && date.trim().length > 0 && time.trim().length > 0

  function handleAddParticipant() {
    const name = newParticipant.trim()
    if (!name || participants.includes(name)) return
    setParticipants((prev) => [...prev, name])
    setNewParticipant('')
  }

  function handleSave() {
    if (!canSave) return
    const recurrence: MockEventRecurrence | undefined = recurrenceFreq
      ? { freq: recurrenceFreq, endDate: recurrenceEndDate || undefined }
      : undefined
    const input: EventEditInput = {
      title: title.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      date,
      time,
      endTime: endTime.trim() || undefined,
      location: location.trim() || undefined,
      participants: visibility.context === 'personal' ? participants : undefined,
      participantIds: visibility.context === 'group' ? participantIds : undefined,
      recurrence,
    }

    if (mode === 'create') {
      initialEvents.push({ id: `ev-${Date.now()}`, ...input })
    } else {
      const rootId = occurrence!.event.seriesId ?? occurrence!.event.id
      replaceEvents(
        showScopeToggle && scope === 'occurrence'
          ? applyOccurrenceEdit(initialEvents, rootId, occurrence!.date, input)
          : applySeriesEdit(initialEvents, rootId, input),
      )
    }
    navigate('/home/calendario')
  }

  function handleDelete() {
    if (!occurrence) return
    const rootId = occurrence.event.seriesId ?? occurrence.event.id
    replaceEvents(
      showScopeToggle && scope === 'occurrence'
        ? applyOccurrenceDelete(initialEvents, rootId, occurrence.date)
        : applySeriesDelete(initialEvents, rootId),
    )
    navigate('/home/calendario')
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader title={mode === 'create' ? 'Novo compromisso' : 'Editar compromisso'} to="/home/calendario" />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        {showScopeToggle ? (
          <div className="mb-4">
            <span className="mb-2 block text-[13px] font-medium text-ink-muted">Aplicar alteração a</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScope('occurrence')}
                className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                  scope === 'occurrence' ? 'border-accent bg-accent text-ink' : 'border-line bg-surface text-ink-muted'
                }`}
              >
                Esta ocorrência
              </button>
              <button
                type="button"
                onClick={() => setScope('series')}
                className={`flex-1 rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
                  scope === 'series' ? 'border-accent bg-accent text-ink' : 'border-line bg-surface text-ink-muted'
                }`}
              >
                Toda a série
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-4">
          <TextField label="Título" placeholder="O que vai acontecer?" value={title} onChange={(e) => setTitle(e.target.value)} />

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

          <TextField label="Local (opcional)" placeholder="Ex.: Escritório" value={location} onChange={(e) => setLocation(e.target.value)} />

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
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <PrimaryButton disabled={!canSave} onClick={handleSave}>
          {mode === 'create' ? 'Adicionar compromisso' : 'Salvar alterações'}
        </PrimaryButton>
        {mode === 'edit' ? (
          <GhostButton onClick={handleDelete} className="flex items-center justify-center gap-1.5 text-danger">
            <Trash2 size={16} strokeWidth={2.2} />
            {showScopeToggle ? (scope === 'series' ? 'Excluir toda a série' : 'Excluir esta ocorrência') : 'Excluir compromisso'}
          </GhostButton>
        ) : null}
      </div>
    </div>
  )
}
