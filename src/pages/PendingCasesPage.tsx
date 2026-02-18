import { PendingCasesTable } from '../components/PendingCasesTable'
import { PendingByTypeChart } from '../components/PendingByTypeChart'
import { PendingAgeChart } from '../components/PendingAgeChart'
import { PendingListedStatusChart } from '../components/PendingListedStatusChart'
import { ReservedJudgmentsChart } from '../components/ReservedJudgmentsChart'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
  getRowsByMetric: (metric: string) => (StatRow & { valueNum: number | null })[]
}

export function PendingCasesPage({ data, selectedYears, getValue, getRowsByMetric }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PendingCasesTable getRowsByMetric={getRowsByMetric} selectedYears={selectedYears} />
      <PendingByTypeChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <PendingAgeChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <PendingListedStatusChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <ReservedJudgmentsChart data={data} selectedYears={selectedYears} getValue={getValue} />
    </div>
  )
}
