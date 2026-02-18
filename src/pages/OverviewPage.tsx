import { ClearanceRateChart } from '../components/ClearanceRateChart'
import { FilingsDisposalsChart } from '../components/FilingsDisposalsChart'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function OverviewPage({ data, selectedYears, getValue }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <ClearanceRateChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <FilingsDisposalsChart data={data} selectedYears={selectedYears} getValue={getValue} />
    </div>
  )
}
