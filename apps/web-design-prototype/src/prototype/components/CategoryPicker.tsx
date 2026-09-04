import { Check, ChevronDown, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
// Dropdown (não chips) porque a lista cresce sem limite prático — com
// muitas categorias, chips soltos na tela viram bagunça visual.
export function CategoryPicker({ label, categories, value, onChange, onAddCategory }: CategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setAdding(false)
        setDraft('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function selectCategory(category: string) {
    onChange(category)
    setOpen(false)
    setAdding(false)
    setDraft('')
  }

  function confirmAdd() {
    const name = draft.trim()
    if (!name) return
    if (!categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      onAddCategory(name)
    }
    selectCategory(name)
  }

  const selectedStyle = value ? getCategoryStyle(value) : null
  const SelectedIcon = selectedStyle?.icon

  return (
    <div ref={rootRef} className="relative">
      <span className="mb-2 block text-[13px] font-medium text-ink-muted">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-full items-center justify-between rounded-md border border-line bg-surface px-4 text-[16px] text-ink transition active:scale-[0.99]"
      >
        {value && SelectedIcon ? (
          <span className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-pill ${selectedStyle.bg} ${selectedStyle.fg}`}>
              <SelectedIcon size={13} strokeWidth={2.4} />
            </span>
            <span className="font-medium">{value}</span>
          </span>
        ) : (
          <span className="text-ink-faint">Nenhuma categoria</span>
        )}
        <ChevronDown size={18} strokeWidth={2.2} className={`text-ink-faint transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-y-auto rounded-md border border-line bg-surface p-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => selectCategory('')}
            className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-[14px] text-ink-muted transition active:bg-surface-muted"
          >
            Nenhuma categoria
            {!value ? <Check size={15} strokeWidth={3} /> : null}
          </button>

          {categories.map((category) => {
            const style = getCategoryStyle(category)
            const Icon = style.icon
            const selected = value === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => selectCategory(category)}
                className="flex w-full items-center justify-between gap-2 rounded-sm px-3 py-2.5 text-left text-[14px] text-ink transition active:bg-surface-muted"
              >
                <span className="flex items-center gap-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-pill ${style.bg} ${style.fg}`}>
                    <Icon size={13} strokeWidth={2.4} />
                  </span>
                  {category}
                </span>
                {selected ? <Check size={15} strokeWidth={3} /> : null}
              </button>
            )
          })}

          <div className="mt-1 border-t border-line pt-1.5">
            {adding ? (
              <div className="flex items-center gap-1.5 px-1.5 py-1">
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
                  className="h-9 flex-1 rounded-sm border border-line bg-surface px-2.5 text-[14px] text-ink placeholder:text-ink-faint focus:border-ink/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={confirmAdd}
                  aria-label="Confirmar nova categoria"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-accent text-white"
                >
                  <Check size={15} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2.5 text-left text-[14px] font-semibold text-ink transition active:bg-surface-muted"
              >
                <Plus size={15} strokeWidth={2.6} />
                Nova categoria
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
