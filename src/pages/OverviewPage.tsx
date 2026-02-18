import { Clock, Scale, TrendingUp, FileText, Users, Layers } from 'lucide-react'
import { Sparkline } from '../components/Sparkline'
import type { StatRow } from '../types'

function parseVal(v: string): number {
  if (!v || String(v).toLowerCase() === 'na') return 0
  const n = parseFloat(v)
  return Number.isNaN(n) ? 0 : n
}

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

const CARD_COLORS = {
  pending: '#422AFB',
  clearance: '#7551ff',
  backlog: '#6B7FFF',
  dv: '#a855f7',
  gender: '#4318FF',
  filings: '#6366f1',
  disposals: '#22c55e',
  netPending: '#0ea5e9',
} as const

export function OverviewPage({ data, selectedYears, getValue }: Props) {
  const sortedYears = [...selectedYears].sort((a, b) => a - b)
  const courts = [...new Set(data.map((r) => r.Court))]

  // Total Pending + sparkline data
  const pendingByYear = sortedYears.map(
    (y) => data.filter((r) => r.Metric === 'Pending' && r.Year === String(y)).reduce((s, r) => s + parseVal(r.Value), 0)
  )
  const totalPending = pendingByYear.length > 0 ? pendingByYear[pendingByYear.length - 1] : 0

  // Clearance Rate trend (avg per year)
  const clearanceByYear = sortedYears.map((y) => {
    const rows = data.filter((r) => r.Metric === 'ClearanceRate' && r.Year === String(y))
    return rows.length > 0 ? rows.reduce((s, r) => s + parseVal(r.Value), 0) / rows.length : 0
  })
  const avgClearance = clearanceByYear.length > 0 ? clearanceByYear.reduce((a, b) => a + b, 0) / clearanceByYear.length : 0

  // Top 3 Backlog Courts (by latest year's pending)
  const latestYear = sortedYears[sortedYears.length - 1] ?? sortedYears[0]
  const pendingByCourt = courts
    .map((court) => ({
      court,
      pending: getValue(court, 'Pending', latestYear) ?? data.filter((r) => r.Court === court && r.Metric === 'Pending' && r.Year === String(latestYear)).reduce((s, r) => s + parseVal(r.Value), 0),
    }))
    .filter((x) => x.pending > 0)
    .sort((a, b) => b.pending - a.pending)
    .slice(0, 3)

  // DV Trend
  const dvByYear = sortedYears.map(
    (y) => data.filter((r) => r.Metric === 'DV_Filings' && r.Year === String(y)).reduce((s, r) => s + parseVal(r.Value), 0)
  )
  const totalDV = dvByYear.reduce((a, b) => a + b, 0)

  // Gender Avg
  const maleRows = data.filter((r) => r.Metric === 'Gender_Male')
  const femaleRows = data.filter((r) => r.Metric === 'Gender_Female')
  const avgMale = maleRows.length > 0 ? maleRows.reduce((s, r) => s + parseVal(r.Value), 0) / maleRows.length : 0
  const avgFemale = femaleRows.length > 0 ? femaleRows.reduce((s, r) => s + parseVal(r.Value), 0) / femaleRows.length : 0

  // Total Filings + sparkline
  const filingsByYear = sortedYears.map(
    (y) => data.filter((r) => r.Metric === 'Filings' && r.Year === String(y)).reduce((s, r) => s + parseVal(r.Value), 0)
  )
  const totalFilings = filingsByYear.reduce((a, b) => a + b, 0)

  // Total Disposals + sparkline
  const disposalsByYear = sortedYears.map(
    (y) => data.filter((r) => r.Metric === 'Disposals' && r.Year === String(y)).reduce((s, r) => s + parseVal(r.Value), 0)
  )
  const totalDisposals = disposalsByYear.reduce((a, b) => a + b, 0)

  // Net Pending YoY
  const pendingYoY =
    pendingByYear.length >= 2
      ? (() => {
          const prev = pendingByYear[pendingByYear.length - 2]
          const curr = pendingByYear[pendingByYear.length - 1]
          const net = curr - prev
          const pct = prev > 0 ? (100 * net) / prev : 0
          return { net, pct }
        })()
      : null

  const cards = [
    {
      label: 'Total Pending',
      value: totalPending.toLocaleString(),
      icon: Clock,
      color: CARD_COLORS.pending,
      sparklineData: pendingByYear,
    },
    {
      label: 'Clearance Rate Trend',
      value: `${avgClearance.toFixed(1)}%`,
      icon: Scale,
      color: CARD_COLORS.clearance,
      sparklineData: clearanceByYear,
    },
    {
      label: 'Top 3 Backlog Courts',
      value: pendingByCourt.length > 0 ? pendingByCourt.map((x) => x.court.replace(/ Court$/, '')).join(', ') : 'N/A',
      icon: Layers,
      color: CARD_COLORS.backlog,
      sparklineData: null,
      subtitle:
        pendingByCourt.length > 0
          ? pendingByCourt.map((x) => `${x.court.replace(/ Court$/, '')}: ${x.pending.toLocaleString()}`).join(' · ')
          : undefined,
    },
    {
      label: 'DV Trend',
      value: totalDV.toLocaleString(),
      icon: FileText,
      color: CARD_COLORS.dv,
      sparklineData: dvByYear.length > 0 ? dvByYear : null,
    },
    {
      label: 'Gender Balance',
      value: avgMale > 0 || avgFemale > 0 ? `${avgMale.toFixed(0)}% Male / ${avgFemale.toFixed(0)}% Female` : 'N/A',
      icon: Users,
      color: CARD_COLORS.gender,
      sparklineData: null,
    },
    {
      label: 'Total Filings',
      value: totalFilings.toLocaleString(),
      icon: TrendingUp,
      color: CARD_COLORS.filings,
      sparklineData: filingsByYear,
    },
    {
      label: 'Total Disposals',
      value: totalDisposals.toLocaleString(),
      icon: TrendingUp,
      color: CARD_COLORS.disposals,
      sparklineData: disposalsByYear,
    },
    {
      label: 'Net Pending (YoY)',
      value:
        pendingYoY != null
          ? `${pendingYoY.net >= 0 ? '+' : ''}${pendingYoY.net.toLocaleString()} (${pendingYoY.pct >= 0 ? '+' : ''}${pendingYoY.pct.toFixed(1)}%)`
          : 'Needs 2+ years',
      icon: TrendingUp,
      color: pendingYoY?.net != null && pendingYoY.net < 0 ? '#22c55e' : CARD_COLORS.netPending,
      sparklineData: pendingByYear.length >= 2 ? pendingByYear : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This dashboard summarizes key performance indicators from the Vanuatu Judiciary across the Court of Appeal, Supreme Court, Magistrates Court, and Island Court. Use the cards below to scan caseload (pending, filings, disposals), clearance and backlog trends, domestic violence protection orders, and gender representation. Select years and courts in the sidebar to filter the data. For detailed breakdowns, see the Pending Cases, Workload, Performance, Outcomes, and Other Metrics pages.
        </p>
      </div>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${card.color}18` }}
              >
                <card.icon className="size-6" style={{ color: card.color }} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <p className="mt-0.5 truncate text-xl font-bold text-foreground">{card.value}</p>
                {card.subtitle && (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-muted-foreground" title={card.subtitle}>
                    {card.subtitle}
                  </p>
                )}
              </div>
            </div>
            {card.sparklineData && card.sparklineData.length >= 2 && (
              <div className="shrink-0">
                <Sparkline data={card.sparklineData} width={80} height={36} color={card.color} strokeWidth={2} />
              </div>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
