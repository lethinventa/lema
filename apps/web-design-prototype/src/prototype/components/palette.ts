// Sistema de cor por significado (revisão visual 2026-09):
// - accent (roxo) = ações/CTA/destaque principal, nunca decorativo
// - mint/peach/sky/sun = SOMENTE estado (sucesso/atenção/info/destaque)
// - paleta de categoria (abaixo) = SOMENTE categoria, nunca reutilizada pra outra coisa
// - paleta de pessoa (abaixo) = SOMENTE avatar de pessoa
// Isso existe pra resolver a confusão de "cores diferentes com o mesmo significado,
// mesma cor com significados diferentes" identificada na tela de Finanças.

import {
  Briefcase,
  Car,
  Film,
  Gift,
  HeartPulse,
  Home,
  ShoppingCart,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export interface CategoryStyle {
  bg: string
  fg: string
  hex: string
  icon: LucideIcon
}

// hex mirrors the --color-cat-*-fg values in index.css — kept in sync by
// hand since SVG (donut/ranking) needs a real color value, not a Tailwind class.
const CATEGORY_TONES = [
  { bg: 'bg-cat-sage-bg', fg: 'text-cat-sage-fg', hex: '#4c6b30' },
  { bg: 'bg-cat-sky-bg', fg: 'text-cat-sky-fg', hex: '#33628f' },
  { bg: 'bg-cat-clay-bg', fg: 'text-cat-clay-fg', hex: '#9a5730' },
  { bg: 'bg-cat-blush-bg', fg: 'text-cat-blush-fg', hex: '#9c3564' },
  { bg: 'bg-cat-lilac-bg', fg: 'text-cat-lilac-fg', hex: '#6d3597' },
  { bg: 'bg-cat-sand-bg', fg: 'text-cat-sand-fg', hex: '#85703a' },
  { bg: 'bg-cat-teal-bg', fg: 'text-cat-teal-fg', hex: '#29715f' },
  { bg: 'bg-cat-slate-bg', fg: 'text-cat-slate-fg', hex: '#454f73' },
]

// Palavras-chave em pt-BR pra escolher um ícone reconhecível quando a
// categoria bate com algo comum. Categoria é texto livre (UC-FIN-001), então
// isso é só um atalho visual — fora desses casos, cai no ícone genérico.
const ICON_KEYWORDS: [RegExp, LucideIcon][] = [
  [/mercado|compra|supermercado/i, ShoppingCart],
  [/casa|moradia|aluguel|internet|luz|água|condom/i, Home],
  [/sa[uú]de|academia|farm[aá]cia|m[eé]dic/i, HeartPulse],
  [/lazer|streaming|cinema|show|jogo/i, Film],
  [/transporte|uber|combust[ií]vel|[oô]nibus|carro/i, Car],
  [/presente|aniversário|festa/i, Gift],
  [/trabalho|freela|projeto/i, Briefcase],
  [/investimento|reserva|poupança/i, TrendingUp],
]

function hashString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getCategoryStyle(category: string | undefined): CategoryStyle {
  const key = category?.trim() || 'outros'
  const tone = CATEGORY_TONES[hashString(key.toLowerCase()) % CATEGORY_TONES.length]
  const iconMatch = ICON_KEYWORDS.find(([pattern]) => pattern.test(key))
  return { bg: tone.bg, fg: tone.fg, hex: tone.hex, icon: iconMatch?.[1] ?? Tag }
}

const PERSON_COLORS = [
  'var(--color-person-1)',
  'var(--color-person-2)',
  'var(--color-person-3)',
  'var(--color-person-4)',
  'var(--color-person-5)',
  'var(--color-person-6)',
]

export function getPersonColor(name: string) {
  return PERSON_COLORS[hashString(name.toLowerCase()) % PERSON_COLORS.length]
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}
