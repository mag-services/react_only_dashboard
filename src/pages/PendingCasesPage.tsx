import { PendingCasesTable } from '../components/PendingCasesTable'
import { PendingByTypeChart } from '../components/PendingByTypeChart'
import { PendingAgeChart } from '../components/PendingAgeChart'
import { PendingListedStatusChart } from '../components/PendingListedStatusChart'
import { ReservedJudgmentsChart } from '../components/ReservedJudgmentsChart'
import { LazyChart } from '../components/LazyChart'
import { MANY_YEARS_THRESHOLD } from '@/lib/constants'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
  getRowsByMetric: (metric: string) => (StatRow & { valueNum: number | null })[]
}

export function PendingCasesPage({ data, selectedYears, getValue, getRowsByMetric }: Props) {
  const lazy = selectedYears.length >= MANY_YEARS_THRESHOLD
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <LazyChart enabled={lazy}>
        <PendingCasesTable getRowsByMetric={getRowsByMetric} selectedYears={selectedYears} />
      </LazyChart>
      <LazyChart enabled={lazy}>
        <PendingByTypeChart data={data} selectedYears={selectedYears} getValue={getValue} />
      </LazyChart>
      <LazyChart enabled={lazy}>
        <PendingAgeChart data={data} selectedYears={selectedYears} getValue={getValue} />
      </LazyChart>
      <LazyChart enabled={lazy}>
        <PendingListedStatusChart data={data} selectedYears={selectedYears} getValue={getValue} />
      </LazyChart>
      <LazyChart enabled={lazy}>
        <ReservedJudgmentsChart data={data} selectedYears={selectedYears} getValue={getValue} />
      </LazyChart>
    </div>
  )
}
