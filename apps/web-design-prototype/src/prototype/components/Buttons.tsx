import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }

export function PrimaryButton({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`h-14 w-full rounded-md bg-accent px-6 text-[15px] font-medium text-white transition active:scale-[0.98] disabled:opacity-40 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`h-12 w-full rounded-md text-[15px] font-medium text-ink-muted transition active:scale-[0.98] ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function SocialButton({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-md border border-line bg-surface px-6 text-[15px] font-medium text-ink transition active:scale-[0.98] ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
