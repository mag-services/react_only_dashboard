import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function GenderBreakdownChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'Gender_Male').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const seriesData = courts.flatMap((court) =>
    sortedYears.map((year) => ({
      court, year, name: `${court} ${year}`,
      Male: getValue(court, 'Gender_Male', year) ?? 0,
      Female: getValue(court, 'Gender_Female', year) ?? 0,
    }))
  )
  const categories = seriesData.map((r) => r.name)

  const series = [
    { name: 'Male %', data: seriesData.map((r) => r.Male), type: 'column' as const, color: '#422AFB', stack: 'gender' },
    { name: 'Female %', data: seriesData.map((r) => r.Female), type: 'column' as const, color: '#7551ff', stack: 'gender' },
  ]

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 400 },
    xAxis: {
      categories,
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
        <CardTitle>Gender Breakdown by Court (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
