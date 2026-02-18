import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

const COLORS = ['#422AFB', '#7551ff', '#6B7FFF']

export function DVFilingsChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'DV_Filings').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const series = courts.map((court, i) => ({
    name: court,
    type: 'line' as const,
    data: sortedYears.map((year) => getValue(court, 'DV_Filings', year) ?? 0),
    color: COLORS[i % COLORS.length],
  }))

  if (courts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Domestic Violence (Protection Orders) Filings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No DV filings data for selected years.</p>
        </CardContent>
      </Card>
    )
  }

  const options: Highcharts.Options = {
    chart: { type: 'line', height: 400 },
    xAxis: { categories: sortedYears.map(String), crosshair: true },
    yAxis: { gridLineDashStyle: 'Dot' },
    series,
    legend: { enabled: true },
    tooltip: { shared: true },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domestic Violence (Protection Orders) Filings</CardTitle>
        <p className="text-sm text-muted-foreground">Violence/DV case filings in Magistrates Court.</p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
