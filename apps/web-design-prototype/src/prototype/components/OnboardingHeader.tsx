import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Wordmark } from './Wordmark'

interface OnboardingHeaderProps {
  progress: number
  onBack?: () => void
  onSkip?: () => void
  skipLabel?: string
}

export function OnboardingHeader({ progress, onBack, onSkip, skipLabel = 'Pular' }: OnboardingHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="px-6 pt-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack ?? (() => navigate(-1))}
          aria-label="Voltar"
          className="-ml-1.5 flex h-7 w-7 items-center justify-center text-ink-muted"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <Wordmark className="flex-1" />
        {onSkip ? (
          <button type="button" onClick={onSkip} className="shrink-0 text-[13px] font-medium text-ink-muted">
            {skipLabel}
          </button>
        ) : null}
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-pill bg-surface-muted">
        <div
          className="h-full rounded-pill bg-accent transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
    </div>
  )
}
