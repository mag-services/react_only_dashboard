import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

const METRICS = [
  { key: 'Pending_WithFutureListing', name: 'With Future Listing', color: '#22c55e' },
  { key: 'Pending_UnderCaseMgmt', name: 'Under Case Mgmt', color: '#7551ff' },
  { key: 'Pending_NoFutureDate', name: 'No Future Date', color: '#ef4444' },
] as const

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function PendingListedStatusChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'Pending_WithFutureListing').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const chartData = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const point: Record<string, string | number> = { court, year, name: `${court} ${year}` }
      let hasAny = false
      METRICS.forEach(({ key }) => {
        const v = getValue(court, key, year)
        if (v != null) {
          point[key] = v
          hasAny = true
        }
      })
      return hasAny ? [point] : []
    })
  )

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending by Listing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No listing status data for selected years.</p>
        </CardContent>
      </Card>
    )
  }

  const series = METRICS.map(({ key, name, color }) => ({
    name,
    data: chartData.map((r) => (r[key] as number) ?? 0),
    type: 'column' as const,
    color,
    stack: 'status',
  }))

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 400 },
    xAxis: {
      categories: chartData.map((r) => r.name),
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { min: 0, max: 100, title: { text: '%' }, gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0, stacking: 'normal' } },
    series,
    legend: { enabled: true },
    tooltip: { shared: true, valueSuffix: '%' },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Cases by Listing Status</CardTitle>
        <p className="text-sm text-muted-foreground">
          Benchmark: 80% should have a future listing. Green = on track.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
