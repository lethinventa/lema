import type { LucideIcon } from 'lucide-react'
import { HomeLayout } from '../components/HomeLayout'

interface PlaceholderScreenProps {
  title: string
  icon: LucideIcon
}

export function PlaceholderScreen({ title, icon: Icon }: PlaceholderScreenProps) {
  return (
    <HomeLayout>
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-md bg-surface-muted text-ink-faint">
          <Icon size={26} strokeWidth={1.8} />
        </span>
        <h1 className="text-[18px] font-semibold text-ink">{title}</h1>
        <p className="max-w-[240px] text-[14px] leading-normal text-ink-muted">
          Esse módulo ainda não foi prototipado. Volte pra Home pra continuar explorando.
        </p>
      </div>
    </HomeLayout>
  )
}
