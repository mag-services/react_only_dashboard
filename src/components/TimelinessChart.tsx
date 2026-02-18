import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function TimelinessChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'TimelinessCriminal').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const seriesData = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const crim = getValue(court, 'TimelinessCriminal', year)
      const civil = getValue(court, 'TimelinessCivil', year)
      if (crim == null && civil == null) return []
      return [{ court, year, name: `${court} ${year}`, Criminal: crim ?? 0, Civil: civil ?? 0 }]
    })
  )
  const categories = seriesData.map((r) => r.name)

  const series = [
    { name: 'Criminal (days)', data: seriesData.map((r) => r.Criminal), type: 'column' as const, color: '#422AFB' },
    { name: 'Civil (days)', data: seriesData.map((r) => r.Civil), type: 'column' as const, color: '#7551ff' },
  ]

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 400 },
    xAxis: {
      categories,
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { title: { text: 'Days' }, gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0 } },
    series,
    legend: { enabled: true },
    tooltip: { shared: true },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeliness (days) – Criminal vs Civil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
