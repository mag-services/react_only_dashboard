import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function FilingsDisposalsChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'Filings').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const byCourtYear = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const filings = getValue(court, 'Filings', year)
      const disposals = getValue(court, 'Disposals', year)
      if (filings == null && disposals == null) return []
      return [{ court, year, name: `${court} ${year}`, Filings: filings ?? 0, Disposals: disposals ?? 0 }]
    })
  )
  const categories = byCourtYear.map((r) => r.name)

  const series = [
    { name: 'Filings', data: byCourtYear.map((r) => r.Filings), color: '#422AFB' },
    { name: 'Disposals', data: byCourtYear.map((r) => r.Disposals), color: '#7551ff' },
  ]

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 400 },
    xAxis: {
      categories,
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { title: { text: '' }, gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0 } },
    series: series.map((s) => ({ ...s, type: 'column' })),
    legend: { enabled: true },
    tooltip: { shared: true },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filings & Disposals by Court and Year</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
