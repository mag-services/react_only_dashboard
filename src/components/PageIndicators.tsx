import { FileText, TrendingUp, Clock, Scale, FileQuestion, Layers, Users, PieChart } from 'lucide-react'
import type { StatRow } from '../types'

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
  const pdrRows = data.filter((r) => r.Metric === 'PDR')
  const avgPDR = pdrRows.length > 0 ? pdrRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / pdrRows.length : 0
  const pendingAgeRows = data.filter((r) => r.Metric === 'PendingAge')
  const avgPendingAge = pendingAgeRows.length > 0 ? pendingAgeRows.reduce((sum, r) => sum + parseVal(r.Value), 0) / pendingAgeRows.length : 0
  const reserved = data.filter((r) => r.Metric === 'ReservedJudgments').reduce((sum, r) => sum + parseVal(r.Value), 0)
  const workloadFilings = data.filter((r) => r.Metric.startsWith('Workload_') && r.Metric.endsWith('_Filings')).reduce((sum, r) => sum + parseVal(r.Value), 0)
  const locationFilings = data.filter((r) => r.Metric.startsWith('Location_') && r.Metric.endsWith('_Filings')).reduce((sum, r) => sum + parseVal(r.Value), 0)
  const dvFilings = data.filter((r) => r.Metric === 'DV_Filings').reduce((sum, r) => sum + parseVal(r.Value), 0)
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
      { label: 'Avg Timeliness (Criminal) days', value: avgTimelinessCrim.toFixed(0), icon: Clock, color: '#422AFB' },
      { label: 'Avg Timeliness (Civil) days', value: avgTimelinessCivil.toFixed(0), icon: Clock, color: '#7551ff' },
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
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <p className="truncate text-xl font-bold text-foreground">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
