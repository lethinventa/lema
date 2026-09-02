export function SuggestionChips({
  options,
  onPick,
}: {
  options: string[]
  onPick: (value: string) => void
}) {
  return (
    <div className="-mt-1 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onPick(option)}
          className="rounded-sm border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-muted transition active:scale-95"
        >
          {option}
        </button>
      ))}
    </div>
  )
}
