import { useNavigate } from 'react-router-dom'

interface OnboardingHeaderProps {
  progress: number
  onBack?: () => void
  onSkip?: () => void
  skipLabel?: string
}

export function OnboardingHeader({ progress, onBack, onSkip, skipLabel = 'Pular' }: OnboardingHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3 px-5 pt-4">
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="Voltar"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink"
      >
        ‹
      </button>
      <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-surface-muted">
        <div
          className="h-full rounded-pill bg-dark transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
      {onSkip ? (
        <button type="button" onClick={onSkip} className="shrink-0 text-[13px] font-medium text-ink-muted">
          {skipLabel}
        </button>
      ) : (
        <span className="w-[34px] shrink-0" />
      )}
    </div>
  )
}
