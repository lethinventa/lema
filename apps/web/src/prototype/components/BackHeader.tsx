import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface BackHeaderProps {
  title: string
  subtitle?: string
  to?: string
  action?: ReactNode
}

export function BackHeader({ title, subtitle, to, action }: BackHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between gap-2 px-6 pt-8">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => (to ? navigate(to) : navigate(-1))}
          aria-label="Voltar"
          className="-ml-1.5 flex h-8 w-8 shrink-0 items-center justify-center text-ink-muted"
        >
          <ChevronLeft size={22} strokeWidth={2.2} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[20px] font-semibold leading-tight text-ink">{title}</h1>
          {subtitle ? <p className="mt-0.5 truncate text-[13px] text-ink-muted">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
