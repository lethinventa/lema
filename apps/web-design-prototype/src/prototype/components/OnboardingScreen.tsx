import type { ReactNode } from 'react'
import { OnboardingHeader } from './OnboardingHeader'

interface OnboardingScreenProps {
  progress: number
  onBack?: () => void
  onSkip?: () => void
  skipLabel?: string
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
  footer: ReactNode
}

export function OnboardingScreen({
  progress,
  onBack,
  onSkip,
  skipLabel,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: OnboardingScreenProps) {
  return (
    <div className="flex h-full flex-col">
      <OnboardingHeader progress={progress} onBack={onBack} onSkip={onSkip} skipLabel={skipLabel} />

      <div className="flex-1 overflow-y-auto px-6 pb-4 pt-6">
        {eyebrow ? (
          <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-accent">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-[26px] font-semibold leading-tight text-ink text-balance">{title}</h1>
        {subtitle ? <p className="mt-2 text-[15px] leading-normal text-ink-muted">{subtitle}</p> : null}

        {children ? <div className="mt-6 flex flex-col gap-4">{children}</div> : null}
      </div>

      <div className="border-t border-line bg-bg px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
        {footer}
      </div>
    </div>
  )
}
