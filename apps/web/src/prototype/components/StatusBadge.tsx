const STYLES: Record<string, string> = {
  DRAFT: 'bg-surface-muted text-ink-muted',
  REVIEW: 'bg-accent-soft text-accent',
  'APPROVED FOR DEV': 'bg-dark text-white',
  IMPLEMENTED: 'bg-accent text-white',
}

/**
 * Visual marker of the screen's status in the DRAFT → REVIEW → APPROVED FOR DEV → IMPLEMENTED
 * lifecycle. Positioned absolutely within the nearest `relative` ancestor — render it once inside
 * the phone frame (see `PhoneFrame`), not per-screen, so it never competes with in-flow header
 * controls like the header's skip link.
 */
export function StatusBadge({ status = 'DRAFT' }: { status?: keyof typeof STYLES }) {
  return (
    <span
      className={`pointer-events-none absolute right-3 top-3 z-50 rounded-pill px-2.5 py-1 text-[10px] font-semibold tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  )
}
