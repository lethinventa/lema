import { Trash2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { diffDays, TODAY_ISO } from '../calendar/dateUtils'

const TRASH_RETENTION_DAYS = 30

// Compartilhado pelas 4 lixeiras do MVP (Tarefas/Compromissos/Objetivos/
// Transações) — mesma regra pra todas (PD-005): soft-delete, restaurável por
// 30 dias, depois excluído para sempre. Cada domínio só entra com a linha
// (renderItem) e os IDs deletados; o comportamento de restaurar/expirar é
// idêntico em todo lugar, então vive aqui uma vez só.
interface TrashSheetProps<T> {
  title: string
  items: T[]
  getId: (item: T) => string
  getDeletedAt: (item: T) => string
  renderItem: (item: T) => ReactNode
  onRestore: (id: string) => void
  onDeleteForever: (id: string) => void
  onClose: () => void
}

export function TrashSheet<T>({
  title,
  items,
  getId,
  getDeletedAt,
  renderItem,
  onRestore,
  onDeleteForever,
  onClose,
}: TrashSheetProps<T>) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-bg">
      <div className="flex items-center justify-between gap-2 px-6 pt-8">
        <div className="min-w-0">
          <h1 className="truncate text-[20px] font-semibold leading-tight text-ink">{title}</h1>
          <p className="mt-0.5 text-[13px] text-ink-muted">Restaurável por {TRASH_RETENTION_DAYS} dias após excluir</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar lixeira"
          className="flex h-8 w-8 shrink-0 items-center justify-center text-ink-muted"
        >
          <X size={20} strokeWidth={2.2} />
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-6 pb-[max(24px,env(safe-area-inset-bottom))]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Trash2 size={28} strokeWidth={1.8} className="text-ink-faint" />
            <p className="text-[13px] text-ink-faint">Lixeira vazia</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const id = getId(item)
              const deletedAt = getDeletedAt(item)
              const daysLeft = Math.max(0, TRASH_RETENTION_DAYS - diffDays(deletedAt, TODAY_ISO))
              return (
                <div key={id} className="shadow-card rounded-lg border border-line/60 bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 opacity-70">{renderItem(item)}</div>
                    <span
                      className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[11px] font-bold ${
                        daysLeft <= 5 ? 'bg-peach-bg text-peach-fg' : 'bg-surface-muted text-ink-muted'
                      }`}
                    >
                      {daysLeft}d
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-line pt-3">
                    <button
                      type="button"
                      onClick={() => onRestore(id)}
                      className="flex-1 rounded-sm border border-line px-3 py-2 text-[13px] font-semibold text-ink transition active:scale-[0.98]"
                    >
                      Restaurar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteForever(id)}
                      className="flex-1 rounded-sm px-3 py-2 text-[13px] font-semibold text-danger transition active:scale-[0.98]"
                    >
                      Excluir definitivamente
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
