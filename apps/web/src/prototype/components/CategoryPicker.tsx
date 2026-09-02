import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { getCategoryStyle } from './palette'

interface CategoryPickerProps {
  label: string
  categories: string[]
  value: string
  onChange: (category: string) => void
  onAddCategory: (category: string) => void
}

// Resolve a questão em aberto de UC-FIN-001: nem lista fixa, nem texto
// livre — um seletor de categorias que a própria pessoa vai estendendo.
// Tocar numa categoria já selecionada desmarca (categoria continua opcional).
export function CategoryPicker({ label, categories, value, onChange, onAddCategory }: CategoryPickerProps) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  function confirmAdd() {
    const name = draft.trim()
    if (!name) return
    if (!categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      onAddCategory(name)
    }
    onChange(name)
    setDraft('')
    setAdding(false)
  }

  return (
    <div>
      <span className="mb-2 block text-[13px] font-medium text-ink-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const style = getCategoryStyle(category)
          const selected = value === category
          const Icon = style.icon
          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(selected ? '' : category)}
              className={`flex items-center gap-1.5 rounded-pill py-1 pl-1.5 pr-2.5 text-[12.5px] font-semibold transition active:scale-95 ${style.bg} ${style.fg}`}
            >
              <Icon size={14} strokeWidth={2.4} />
              {category}
              {selected ? <Check size={13} strokeWidth={3} /> : null}
            </button>
          )
        })}

        {adding ? (
          <span className="inline-flex items-center gap-1 rounded-pill border border-line bg-surface py-1 pl-2.5 pr-1">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  confirmAdd()
                }
              }}
              placeholder="Nome da categoria"
              className="w-28 bg-transparent text-[12.5px] text-ink placeholder:text-ink-faint focus:outline-none"
            />
            <button
              type="button"
              onClick={confirmAdd}
              aria-label="Confirmar nova categoria"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-accent text-white"
            >
              <Check size={13} strokeWidth={3} />
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 rounded-pill border border-dashed border-line px-2.5 py-1 text-[12.5px] font-semibold text-ink-muted transition active:scale-95"
          >
            <Plus size={13} strokeWidth={2.6} />
            Nova
          </button>
        )}
      </div>
    </div>
  )
}
