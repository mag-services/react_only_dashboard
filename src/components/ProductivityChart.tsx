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

export function ProductivityChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'Productivity').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const series = courts.map((court, i) => ({
    name: court,
    type: 'line' as const,
    data: sortedYears.map((year) => getValue(court, 'Productivity', year) ?? 0),
    color: COLORS[i % COLORS.length],
  }))

  const hasData = series.some((s) => s.data.some((v) => v > 0))
  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productivity (cases per judge/magistrate)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No productivity data available for selected years.</p>
        </CardContent>
      </Card>
    )
  }

  const options: Highcharts.Options = {
    chart: { type: 'line', height: 400 },
    xAxis: { categories: sortedYears.map(String), crosshair: true },
    yAxis: { title: { text: 'Cases per judge' }, min: 0, gridLineDashStyle: 'Dot' },
    series,
    legend: { enabled: true },
    tooltip: { shared: true },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity (cases per judge/magistrate)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
