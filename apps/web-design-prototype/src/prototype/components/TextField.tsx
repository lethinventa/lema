import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function TextField({ label, hint, id, ...rest }: TextFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-2 block text-[13px] font-medium text-ink-muted">{label}</span>
      <input
        id={inputId}
        className="h-14 w-full rounded-md border border-line bg-surface px-4 text-[16px] text-ink placeholder:text-ink-faint focus:border-ink/30 focus:outline-none"
        {...rest}
      />
      {hint ? <span className="mt-1.5 block text-[12px] text-ink-faint">{hint}</span> : null}
    </label>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
}

export function SelectField({ label, options, id, ...rest }: SelectFieldProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <label htmlFor={selectId} className="block">
      <span className="mb-2 block text-[13px] font-medium text-ink-muted">{label}</span>
      <select
        id={selectId}
        className="h-14 w-full rounded-md border border-line bg-surface px-4 text-[16px] text-ink focus:border-ink/30 focus:outline-none"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}
