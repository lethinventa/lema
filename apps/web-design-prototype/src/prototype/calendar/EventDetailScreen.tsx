import { MapPin, Pencil, Repeat, Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { BackHeader } from '../components/BackHeader'
import { GhostButton } from '../components/Buttons'
import { FlagChip } from '../components/FlagChip'
import { resolveMemberNames } from '../groups/groupsMockData'
import { initialEvents } from './calendarMockData'
import { applyOccurrenceDelete, applySeriesDelete, getOccurrencesForDate } from './calendarSelectors'
import { formatRelativeDayLabel, TODAY_ISO } from './dateUtils'

const RECURRENCE_FREQ_LABELS: Record<string, string> = {
  daily: 'Diariamente',
  weekly: 'Semanalmente',
  monthly: 'Mensalmente',
}

function replaceEvents(next: typeof initialEvents) {
  initialEvents.length = 0
  initialEvents.push(...next)
}

function editPath(eventId: string, date: string) {
  return `/home/calendario/${eventId}/editar?data=${date}`
}

// Visualização é a tela padrão ao abrir um compromisso — edição é uma ação
// explícita a partir daqui (ver docs/product/interaction-patterns.md).
export function EventDetailScreen() {
  const { eventId } = useParams<{ eventId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const occurrenceDate = searchParams.get('data') ?? TODAY_ISO
  const occurrence = eventId
    ? getOccurrencesForDate(initialEvents, occurrenceDate).find((occ) => occ.occurrenceKey === `${eventId}:${occurrenceDate}`)
    : undefined
  const [scope, setScope] = useState<'occurrence' | 'series'>('occurrence')

  if (!eventId || !occurrence) {
    return <Navigate to="/home/calendario" replace />
  }

  const { event } = occurrence
  const participantNames = event.participantIds ? resolveMemberNames(event.groupId, event.participantIds) : (event.participants ?? [])

  function handleDelete() {
    const rootId = event.seriesId ?? event.id
    replaceEvents(
      occurrence!.isRecurring && scope === 'occurrence'
        ? applyOccurrenceDelete(initialEvents, rootId, occurrence!.date)
        : applySeriesDelete(initialEvents, rootId),
    )
    navigate('/home/calendario')
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader
        title={event.title}
        subtitle={`${formatRelativeDayLabel(occurrence.date)} · ${event.time}${event.endTime ? `–${event.endTime}` : ''}`}
        to="/home/calendario"
        action={
          <button
            type="button"
            onClick={() => navigate(editPath(eventId, occurrenceDate))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-surface-muted text-ink transition active:scale-90"
            aria-label="Editar compromisso"
          >
            <Pencil size={17} strokeWidth={2.2} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <FlagChip>
              {event.context === 'group' ? 'Grupo' : event.context === 'shared' ? 'Compartilhado' : 'Pessoal'}
            </FlagChip>
            {event.recurrence ? (
              <FlagChip icon={Repeat}>{RECURRENCE_FREQ_LABELS[event.recurrence.freq]}</FlagChip>
            ) : null}
          </div>

          {event.location ? (
            <div className="flex items-center gap-2 text-[14px] text-ink">
              <MapPin size={16} strokeWidth={2.2} className="shrink-0 text-ink-faint" />
              {event.location}
            </div>
          ) : null}

          {participantNames.length > 0 ? (
            <div>
              <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted">
                <Users size={13} strokeWidth={2.4} />
                Participantes
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {participantNames.map((name) => (
                  <span key={name} className="flex items-center gap-1.5 rounded-pill bg-surface-muted py-1 pl-1 pr-2.5">
                    <Avatar name={name} />
                    <span className="text-[13px] font-semibold text-ink">{name}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        {occurrence.isRecurring ? (
          <div className="mb-1 flex gap-2">
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
        ) : null}
        <GhostButton onClick={handleDelete} className="flex items-center justify-center gap-1.5 text-danger">
          <Trash2 size={16} strokeWidth={2.2} />
          {occurrence.isRecurring ? (scope === 'series' ? 'Excluir toda a série' : 'Excluir esta ocorrência') : 'Excluir compromisso'}
        </GhostButton>
      </div>
    </div>
  )
}
