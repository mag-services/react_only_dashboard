import { FileText, TrendingUp, Clock, Scale, FileQuestion, Layers, Users, PieChart, TrendingDown, CircleHelp } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { StatRow } from '../types'

const GLOSSARY: Record<string, string> = {
  'Total Filings': 'Number of new cases registered with the court in the selected period. Includes criminal, civil, and other matter types.',
  'Total Disposals': 'Number of cases that were completed (closed) in the selected period. A disposal means the court has reached a final outcome.',
  'Avg Clearance Rate': 'Percentage of cases disposed (closed) compared to cases filed in the same period. ≥100% means the court is keeping up or reducing backlog; <100% means backlog is growing.',
  'Pending Cases': 'Number of cases still open (not yet disposed) at the end of the period. These cases are awaiting hearing, judgment, or other resolution.',
  'Net Change in Pending (YoY)': 'Year-over-year change in total pending cases. Negative means backlog decreased; positive means it grew. Compare latest year to previous year.',
  'Avg PDR': 'Pending to Disposal Ratio — how many years of work remain at current disposal rates. Lower is better. Target: ≤1.0 for Supreme Court, ≤0.5 for Magistrates and Island Court.',
  'Avg Pending Age (%)': 'Share of pending cases that are older than 2–3 years (2 years for Magistrates & Island Court, 3 years for Supreme Court). Lower is better — indicates fewer long-delayed cases.',
  'Reserved Judgments': 'Cases where a judge has heard the matter but not yet delivered the final written judgment. Typically tracked with a benchmark (e.g. most within 90 days).',
  'Workload Filings': 'New cases filed by type (Criminal, Civil, PI, DV, etc.) across courts. Shows where demand is concentrated.',
  'Location Filings': 'Cases filed by location or province. Shows geographic distribution of court workload.',
  'DV Filings': 'Domestic violence protection order applications filed in Magistrates Court. Reflects demand for family safety orders.',
  'Avg Timeliness (Criminal) — target 180 days': 'Average number of days from filing to final disposition for criminal cases. Target is ≤180 days. Lower means faster resolution.',
  'Avg Timeliness (Civil) — target 365 days': 'Average number of days from filing to final disposition for civil cases. Target is ≤365 days. Lower means faster resolution.',
  'Avg Attendance (%)': 'Average number of court appearances (visits) needed to dispose a case. Lower is better — fewer adjournments and lower cost to parties.',
  'Avg Productivity': 'Cases disposed per full-time judge or magistrate per year. Measures judicial output relative to workforce.',
  'Outcome Records': 'Number of case outcome records (e.g. Guilty, Dismissed, Withdrawn) in the data. Used for outcome analysis.',
  'CoA Filings': 'Cases filed (appeals) at the Court of Appeal. Appeals from Supreme Court first-instance decisions.',
  'CoA Avg Dismissed %': 'Share of Court of Appeal matters that were dismissed (appeal not allowed).',
  'CoA Avg Allowed %': 'Share of Court of Appeal matters where the appeal was allowed (original decision varied or overturned).',
  'Charge Orders': 'Criminal charge orders issued. Reflects volume of formal charges before the courts.',
  'Avg Male (%)': 'Percentage of parties (or accused) in the data who are male. Used for gender-disaggregated analysis.',
  'Avg Female (%)': 'Percentage of parties (or accused) in the data who are female. Used for gender-disaggregated analysis.',
  'DV/Protection Order Trend (YoY)': 'Year-over-year change in DV protection order filings. Rising numbers may indicate increased reporting or demand for protection.',
}

function parseVal(v: string): number {
  if (!v || String(v).toLowerCase() === 'na') return 0
  const n = parseFloat(v)
  return Number.isNaN(n) ? 0 : n
}

const CARD_STYLE = 'flex rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md'
const ICON_BOX = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'

interface Indicator {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>
  color: string
  subtitle?: string
}

interface PageIndicatorsProps {
  data: StatRow[]
  activeTab: number
}

export function PageIndicators({ data, activeTab }: PageIndicatorsProps) {
  const filings = data.filter((r) => r.Metric === 'Filings').reduce((sum, r) => sum + parseVal(r.Value), 0)
  const disposals = data.filter((r) => r.Metric === 'Disposals').reduce((sum, r) => sum + parseVal(r.Value), 0)
  const clearanceRows = data.filter((r) => r.Metric === 'ClearanceRate')
  const avgClearance = clearanceRows.length > 0 ? clearanceRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / clearanceRows.length : 0
  const pending = data.filter((r) => r.Metric === 'Pending').reduce((sum, r) => sum + parseVal(r.Value), 0)
  const pendingByYear = data
    .filter((r) => r.Metric === 'Pending')
    .reduce<Record<string, number>>((acc, r) => {
      acc[r.Year] = (acc[r.Year] ?? 0) + parseVal(r.Value)
      return acc
    }, {})
  const yearsWithPending = [...new Set(Object.keys(pendingByYear))].sort((a, b) => Number(a) - Number(b))
  const pendingYoY =
    yearsWithPending.length >= 2
      ? (() => {
          const prevY = yearsWithPending[yearsWithPending.length - 2]
          const currY = yearsWithPending[yearsWithPending.length - 1]
          const prevVal = pendingByYear[prevY] ?? 0
          const currVal = pendingByYear[currY] ?? 0
          const netChange = currVal - prevVal
          const pctChange = prevVal > 0 ? (100 * netChange) / prevVal : 0
          return { netChange, pctChange, prevY, currY }
        })()
      : null
  const pdrRows = data.filter((r) => r.Metric === 'PDR')
  const avgPDR = pdrRows.length > 0 ? pdrRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / pdrRows.length : 0
  const pendingAgeRows = data.filter((r) => r.Metric === 'PendingAge')
  const avgPendingAge = pendingAgeRows.length > 0 ? pendingAgeRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / pendingAgeRows.length : 0
  const reserved = data.filter((r) => r.Metric === 'ReservedJudgments').reduce((sum, r) => sum + parseVal(r.Value), 0)
  const workloadFilings = data.filter((r) => r.Metric.startsWith('Workload_') && r.Metric.endsWith('_Filings')).reduce((sum, r) => sum + parseVal(r.Value), 0)
  const locationFilings = data.filter((r) => r.Metric.startsWith('Location_') && r.Metric.endsWith('_Filings')).reduce((sum, r) => sum + parseVal(r.Value), 0)
  const dvFilings = data.filter((r) => r.Metric === 'DV_Filings').reduce((sum, r) => sum + parseVal(r.Value), 0)
  const dvByYear = data
    .filter((r) => r.Metric === 'DV_Filings')
    .reduce<Record<string, number>>((acc, r) => {
      acc[r.Year] = (acc[r.Year] ?? 0) + parseVal(r.Value)
      return acc
    }, {})
  const yearsWithDV = [...new Set(Object.keys(dvByYear))].sort((a, b) => Number(a) - Number(b))
  const dvYoY =
    yearsWithDV.length >= 2
      ? (() => {
          const prevY = yearsWithDV[yearsWithDV.length - 2]
          const currY = yearsWithDV[yearsWithDV.length - 1]
          const prevVal = dvByYear[prevY] ?? 0
          const currVal = dvByYear[currY] ?? 0
          const netChange = currVal - prevVal
          const pctChange = prevVal > 0 ? (100 * netChange) / prevVal : 0
          return { netChange, pctChange, prevY, currY }
        })()
      : null
  const timelinessCrim = data.filter((r) => r.Metric === 'TimelinessCriminal')
  const avgTimelinessCrim = timelinessCrim.length > 0 ? timelinessCrim.reduce((sum, r) => sum + parseVal(r.Value), 0) / timelinessCrim.length : 0
  const timelinessCivil = data.filter((r) => r.Metric === 'TimelinessCivil')
  const avgTimelinessCivil = timelinessCivil.length > 0 ? timelinessCivil.reduce((sum, r) => sum + parseVal(r.Value), 0) / timelinessCivil.length : 0
  const attendanceRows = data.filter((r) => r.Metric.startsWith('Attendance'))
  const avgAttendance = attendanceRows.length > 0 ? attendanceRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / attendanceRows.length : 0
  const productivityRows = data.filter((r) => r.Metric === 'Productivity')
  const avgProductivity = productivityRows.length > 0 ? productivityRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / productivityRows.length : 0
  const chargeOrders = data.filter((r) => r.Metric === 'ChargeOrders').reduce((sum, r) => sum + parseVal(r.Value), 0)
  const maleRows = data.filter((r) => r.Metric === 'Gender_Male')
  const avgMale = maleRows.length > 0 ? maleRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / maleRows.length : 0
  const femaleRows = data.filter((r) => r.Metric === 'Gender_Female')
  const avgFemale = femaleRows.length > 0 ? femaleRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / femaleRows.length : 0
  const outcomeRows = data.filter((r) => r.Metric.includes('_Guilty') || r.Metric.includes('_Dismissed') || r.Metric.includes('_Withdrawn') || r.Metric.includes('_Allowed') || r.Metric.includes('_Committed') || r.Metric.includes('_NotGuilty'))
  const coaFilings = data.filter((r) => r.Court === 'Court of Appeal' && r.Metric === 'Filings').reduce((s, r) => s + parseVal(r.Value), 0)
  const coaDismissed = data.filter((r) => r.Metric.includes('Dismissed'))
  const avgCoaDismissed = coaDismissed.length > 0 ? coaDismissed.reduce((s, r) => s + parseVal(r.Value), 0) / coaDismissed.length : 0

  const indicatorsByPage: Record<number, Indicator[]> = {
    0: [
      { label: 'Total Filings', value: filings.toLocaleString(), icon: FileText, color: '#422AFB' },
      { label: 'Total Disposals', value: disposals.toLocaleString(), icon: TrendingUp, color: '#7551ff' },
      { label: 'Avg Clearance Rate', value: `${avgClearance.toFixed(1)}%`, icon: Scale, color: '#4318FF' },
      { label: 'Pending Cases', value: pending.toLocaleString(), icon: Clock, color: '#6B7FFF' },
    ],
    1: [
      { label: 'Pending Cases', value: pending.toLocaleString(), icon: Clock, color: '#422AFB' },
      {
        label: 'Net Change in Pending (YoY)',
        value:
          pendingYoY != null
            ? `${pendingYoY.netChange >= 0 ? '+' : ''}${pendingYoY.netChange.toLocaleString()} (${pendingYoY.pctChange >= 0 ? '+' : ''}${pendingYoY.pctChange.toFixed(1)}%)`
            : 'N/A',
        subtitle: pendingYoY == null ? 'Needs at least two selected years for the comparison' : undefined,
        icon: pendingYoY?.netChange != null && pendingYoY.netChange < 0 ? TrendingDown : TrendingUp,
        color: pendingYoY?.netChange != null && pendingYoY.netChange < 0 ? '#22c55e' : '#6B7FFF',
      },
      { label: 'Avg PDR', value: avgPDR.toFixed(2), icon: Scale, color: '#7551ff' },
      { label: 'Avg Pending Age (%)', value: `${avgPendingAge.toFixed(1)}%`, icon: FileText, color: '#6B7FFF' },
      { label: 'Reserved Judgments', value: reserved.toLocaleString(), icon: FileQuestion, color: '#a78bfa' },
    ],
    2: [
      { label: 'Workload Filings', value: workloadFilings.toLocaleString(), icon: Layers, color: '#422AFB' },
      { label: 'Total Filings', value: filings.toLocaleString(), icon: FileText, color: '#7551ff' },
      { label: 'Location Filings', value: locationFilings.toLocaleString(), icon: Layers, color: '#6B7FFF' },
      { label: 'DV Filings', value: dvFilings.toLocaleString(), icon: FileText, color: '#4318FF' },
    ],
    3: [
      { label: 'Avg Timeliness (Criminal) — target 180 days', value: `${avgTimelinessCrim.toFixed(0)} days`, icon: Clock, color: '#422AFB' },
      { label: 'Avg Timeliness (Civil) — target 365 days', value: `${avgTimelinessCivil.toFixed(0)} days`, icon: Clock, color: '#7551ff' },
      { label: 'Avg Attendance (%)', value: `${avgAttendance.toFixed(1)}%`, icon: Users, color: '#6B7FFF' },
      { label: 'Avg Productivity', value: avgProductivity.toFixed(0), icon: TrendingUp, color: '#4318FF' },
    ],
    4: [
      { label: 'Outcome Records', value: outcomeRows.length.toString(), icon: PieChart, color: '#422AFB' },
      { label: 'CoA Filings', value: coaFilings.toLocaleString(), icon: FileText, color: '#7551ff' },
      { label: 'CoA Avg Dismissed %', value: `${avgCoaDismissed.toFixed(1)}%`, icon: Scale, color: '#6B7FFF' },
      { label: 'CoA Avg Allowed %', value: data.filter((r) => r.Metric.includes('Allowed')).length ? `${(data.filter((r) => r.Metric.includes('Allowed')).reduce((s, r) => s + parseVal(r.Value), 0) / data.filter((r) => r.Metric.includes('Allowed')).length).toFixed(1)}%` : 'N/A', icon: PieChart, color: '#a78bfa' },
    ],
    5: [
      { label: 'Charge Orders', value: chargeOrders.toLocaleString(), icon: FileText, color: '#422AFB' },
      { label: 'Avg Male (%)', value: `${avgMale.toFixed(1)}%`, icon: Users, color: '#7551ff' },
      { label: 'Avg Female (%)', value: `${avgFemale.toFixed(1)}%`, icon: Users, color: '#6B7FFF' },
      { label: 'DV Filings', value: dvFilings.toLocaleString(), icon: FileText, color: '#4318FF' },
      {
        label: 'DV/Protection Order Trend (YoY)',
        value:
          dvYoY != null
            ? `${dvYoY.netChange >= 0 ? '+' : ''}${dvYoY.netChange.toLocaleString()} (${dvYoY.pctChange >= 0 ? '+' : ''}${dvYoY.pctChange.toFixed(1)}%)`
            : 'N/A',
        subtitle: dvYoY == null ? 'Needs at least two selected years for the comparison' : undefined,
        icon: dvYoY?.netChange != null && dvYoY.netChange > 0 ? TrendingUp : TrendingDown,
        color: dvYoY?.netChange != null && dvYoY.netChange > 0 ? '#dc2626' : '#22c55e',
      },
    ],
  }

  const cards = indicatorsByPage[activeTab] ?? indicatorsByPage[0]

  return (
    <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={CARD_STYLE}>
          <div className={ICON_BOX} style={{ backgroundColor: `${card.color}15` }}>
            <card.icon className="size-6" style={{ color: card.color }} strokeWidth={1.5} />
          </div>
          <div className="ml-4 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              {GLOSSARY[card.label] && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Definition"
                    >
                      <CircleHelp className="size-4" strokeWidth={1.5} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="max-w-sm text-sm">
                    <p className="text-foreground">{GLOSSARY[card.label]}</p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <p className="truncate text-xl font-bold text-foreground">{card.value}</p>
            {card.subtitle && (
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{card.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
