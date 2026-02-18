/**
 * Court-specific colors for consistent visualization across the dashboard.
 * Supreme = dark blue, Magistrates = teal, Island = green, Court of Appeal = purple.
 */
export const COURT_COLORS: Record<string, string> = {
  'Court of Appeal': '#7c3aed',   // purple
  'Supreme Court': '#1e40af',     // dark blue
  'Magistrates Court': '#0d9488',  // teal
  'Island Court': '#16a34a',       // green
}

/** Canonical court order for consistent legend/series ordering */
export const COURT_ORDER = [
  'Court of Appeal',
  'Supreme Court',
  'Magistrates Court',
  'Island Court',
] as const

/** Get color for a court, fallback for unknown courts */
export function getCourtColor(court: string): string {
  return COURT_COLORS[court] ?? '#64748b'
}

/** Lighter variant for stacked/secondary segments (e.g. Female in Male/Female breakdown) */
export function getCourtColorLight(court: string): string {
  const hex = getCourtColor(court)
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, 0.55)`
}

/** Sort courts in canonical order, with data-only courts appended */
export function sortCourtsByOrder(courts: string[]): string[] {
  const ordered: string[] = []
  for (const c of COURT_ORDER) {
    if (courts.includes(c)) ordered.push(c)
  }
  for (const c of courts) {
    if (!ordered.includes(c)) ordered.push(c)
  }
  return ordered
}
