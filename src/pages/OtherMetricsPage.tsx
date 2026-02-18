import { ChargeOrdersChart } from '../components/ChargeOrdersChart'
import { GenderBreakdownChart } from '../components/GenderBreakdownChart'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function OtherMetricsPage({ data, selectedYears, getValue }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <ChargeOrdersChart data={data} selectedYears={selectedYears} getValue={getValue} />
      <GenderBreakdownChart data={data} selectedYears={selectedYears} getValue={getValue} />
    </div>
  )
}
