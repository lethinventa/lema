import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type GroupChoice = 'create' | 'join' | 'skip' | null

export type SplitRule = '50-50' | 'proportional' | 'responsibility' | 'none'

export type TransparencyLevel = 'full' | 'involved-only'

export interface OnboardingData {
  name: string
  email: string
  avatarDataUrl: string | null
  timezone: string
  language: string
  dateFormat: string
  groupChoice: GroupChoice
  groupName: string
  groupDescription: string
  inviteCode: string
  hasSharedMoney: boolean | null
  splitRule: SplitRule | null
  transparency: TransparencyLevel | null
}

const initialData: OnboardingData = {
  name: '',
  email: '',
  avatarDataUrl: null,
  timezone: 'América/São Paulo (GMT-3)',
  language: 'Português (Brasil)',
  dateFormat: 'DD/MM/AAAA',
  groupChoice: null,
  groupName: '',
  groupDescription: '',
  inviteCode: '',
  hasSharedMoney: null,
  splitRule: null,
  transparency: null,
}

interface OnboardingContextValue {
  data: OnboardingData
  update: (patch: Partial<OnboardingData>) => void
  reset: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData)

  const value = useMemo<OnboardingContextValue>(
    () => ({
      data,
      update: (patch) => setData((prev) => ({ ...prev, ...patch })),
      reset: () => setData(initialData),
    }),
    [data],
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
