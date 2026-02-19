import { TimelinessChart } from '../components/TimelinessChart'
import { AttendanceChart } from '../components/AttendanceChart'
import { ProductivityChart } from '../components/ProductivityChart'
import { LazyChart } from '../components/LazyChart'
import { MANY_YEARS_THRESHOLD } from '@/lib/constants'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function PerformancePage({ data, selectedYears, getValue }: Props) {
  const lazy = selectedYears.length >= MANY_YEARS_THRESHOLD
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <LazyChart enabled={lazy}>
        <TimelinessChart data={data} selectedYears={selectedYears} getValue={getValue} />
      </LazyChart>
      <LazyChart enabled={lazy}>
        <AttendanceChart data={data} selectedYears={selectedYears} getValue={getValue} />
      </LazyChart>
      <LazyChart enabled={lazy}>
        <ProductivityChart data={data} selectedYears={selectedYears} getValue={getValue} />
      </LazyChart>
    </div>
  )
}
