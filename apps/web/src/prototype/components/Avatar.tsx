import { getInitials, getPersonColor } from './palette'

interface AvatarProps {
  name: string
  size?: 'xs' | 'sm'
}

export function Avatar({ name, size = 'xs' }: AvatarProps) {
  const box = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-[18px] w-[18px] text-[9px]'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-pill font-extrabold text-white ${box}`}
      style={{ backgroundColor: getPersonColor(name) }}
      title={name}
    >
      {getInitials(name)}
    </span>
  )
}
