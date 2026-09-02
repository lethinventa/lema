import { CheckSquare2, MapPin, Repeat } from 'lucide-react'
import { Avatar } from '../components/Avatar'
import { FlagChip } from '../components/FlagChip'
import { VisibilityDot } from '../components/VisibilityDot'
import type { MockTask } from '../tasks/tasksMockData'
import type { EventOccurrence } from './calendarSelectors'

// Linha de compromisso reutilizada por Agenda/Semana(lista)/Mês — uma
// ocorrência concreta (já expandida), nunca a série crua.
export function EventOccurrenceRow({ occurrence, onEdit }: { occurrence: EventOccurrence; onEdit: () => void }) {
  const { event } = occurrence
  return (
    <button type="button" onClick={onEdit} className="flex w-full items-start gap-3 py-3 text-left">
      <span className="tabular mt-0.5 w-12 shrink-0 text-[13px] font-bold text-ink">{event.time}</span>
      <span className="flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[15px] font-semibold text-ink">{event.title}</span>
          {event.participants?.map((name) => <Avatar key={name} name={name} />)}
        </span>
        {event.location || occurrence.isRecurring ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {event.location ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-ink-faint">
                <MapPin size={12} strokeWidth={2.4} />
                {event.location}
              </span>
            ) : null}
            {occurrence.isRecurring ? <FlagChip icon={Repeat}>Recorrente</FlagChip> : null}
          </div>
        ) : null}
      </span>
      <VisibilityDot context={event.context} className="mt-1.5" />
    </button>
  )
}

// Tarefa com prazo aparecendo na agenda do dia — visualmente distinta de um
// compromisso (sem horário fixo, checkbox no lugar do horário; tocar conclui
// direto, sem abrir sheet). Integração experimental, sem UC formal ainda
// (ver nota em CalendarScreen.tsx).
export function TaskAgendaRow({ task, onToggle }: { task: MockTask; onToggle: () => void }) {
  return (
    <div className="flex w-full items-start gap-3 py-3 text-left">
      <button
        type="button"
        onClick={onToggle}
        aria-label={task.done ? 'Marcar como pendente' : 'Marcar como concluída'}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border-2 transition active:scale-90 ${
          task.done ? 'border-mint-fg bg-mint-fg' : 'border-line'
        }`}
      >
        {task.done ? <CheckSquare2 size={13} strokeWidth={3} className="text-white" /> : null}
      </button>
      <span className="flex-1">
        <span className="flex items-center gap-1.5">
          <span className={`text-[15px] font-semibold ${task.done ? 'text-ink-faint line-through' : 'text-ink'}`}>{task.title}</span>
          {task.assignee ? <Avatar name={task.assignee} /> : null}
        </span>
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <FlagChip>Tarefa</FlagChip>
        </span>
      </span>
      <VisibilityDot context={task.context} className="mt-1.5" />
    </div>
  )
}
