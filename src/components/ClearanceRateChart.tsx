import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

const COLORS = ['#422AFB', '#7551ff', '#6B7FFF', '#4318FF']

export function ClearanceRateChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'ClearanceRate').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const series = courts.map((court, i) => ({
    name: court,
    type: 'line' as const,
    data: sortedYears.map((year) => getValue(court, 'ClearanceRate', year) ?? 0),
    color: COLORS[i % COLORS.length],
  }))

  const options: Highcharts.Options = {
    chart: { type: 'line', height: 400 },
    xAxis: { categories: sortedYears.map(String), crosshair: true },
    yAxis: { min: 0, max: 110, title: { text: '%' }, gridLineDashStyle: 'Dot' },
    series,
    legend: { enabled: true },
    tooltip: { shared: true, valueSuffix: '%' },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clearance Rates by Court (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
