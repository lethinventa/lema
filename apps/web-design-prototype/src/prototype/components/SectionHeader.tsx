import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Header de seção plano — texto bold + "Ver tudo", sem badge de ícone
// decorativo (referência: headers de lista do Inter, ex. "Transações").
// Deliberadamente diferente de DomainLabel (usado dentro de cada área
// própria, ex. TasksScreen) — na Home, densidade de informação pesa mais
// que identidade visual por domínio.
export function SectionHeader({ title, to }: { title: string; to?: string }) {
  const navigate = useNavigate()
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-[16px] font-extrabold tracking-tight text-ink">{title}</h2>
      {to ? (
        <button
          type="button"
          onClick={() => navigate(to)}
          className="flex items-center gap-0.5 text-[12px] font-bold text-ink-muted transition active:scale-95"
        >
          Ver tudo
          <ChevronRight size={14} strokeWidth={2.6} />
        </button>
      ) : null}
    </div>
  )
}
