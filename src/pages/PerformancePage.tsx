import { TimelinessChart } from '../components/TimelinessChart'
import { AttendanceChart } from '../components/AttendanceChart'
import { ProductivityChart } from '../components/ProductivityChart'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function PerformancePage({ data, selectedYears, getValue }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <TimelinessChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <AttendanceChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <ProductivityChart data={data} selectedYears={selectedYears} getValue={getValue} />
    </div>
  )
}
