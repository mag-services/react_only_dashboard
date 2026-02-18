import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function ProductivityChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'Productivity').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const seriesData = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const v = getValue(court, 'Productivity', year)
      if (v == null) return []
      return [{ court, year, name: `${court} ${year}`, Productivity: v }]
    })
  )

  if (seriesData.length === 0) {
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

  const categories = seriesData.map((r) => r.name)
  const options: Highcharts.Options = {
    chart: { type: 'column', height: 400 },
    xAxis: {
      categories,
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { title: { text: 'Cases per judge' }, gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0 } },
    series: [{ name: 'Cases per judge', data: seriesData.map((r) => r.Productivity), type: 'column', color: '#422AFB' }],
    legend: { enabled: false },
    tooltip: { shared: false },
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
