import { getCategoryStyle } from './palette'

interface CategoryChipProps {
  category: string | undefined
  size?: 'sm' | 'md'
}

export function CategoryChip({ category, size = 'md' }: CategoryChipProps) {
  const { bg, fg, icon: Icon } = getCategoryStyle(category)
  const box = size === 'md' ? 'h-9 w-9 rounded-[11px]' : 'h-7 w-7 rounded-[9px]'
  const iconSize = size === 'md' ? 17 : 14

  return (
    <span className={`flex shrink-0 items-center justify-center ${box} ${bg} ${fg}`}>
      <Icon size={iconSize} strokeWidth={2.2} />
    </span>
  )
}
