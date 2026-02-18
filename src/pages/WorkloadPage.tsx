import { CaseWorkloadByTypeChart } from '../components/CaseWorkloadByTypeChart'
import { LocationWorkloadChart } from '../components/LocationWorkloadChart'
import { DVFilingsChart } from '../components/DVFilingsChart'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function WorkloadPage({ data, selectedYears, getValue }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CaseWorkloadByTypeChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <LocationWorkloadChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <DVFilingsChart data={data} selectedYears={selectedYears} getValue={getValue} />
    </div>
  )
}
