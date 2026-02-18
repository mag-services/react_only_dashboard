import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourtColorLegend } from './CourtColorLegend'
import { getCourtColor, sortCourtsByOrder } from '@/lib/court-colors'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function DVFilingsChart({ data, selectedYears, getValue }: Props) {
  const courts = sortCourtsByOrder([...new Set(data.filter((r) => r.Metric === 'DV_Filings').map((r) => r.Court))])
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const series = courts.map((court) => ({
    name: court,
    type: 'line' as const,
    data: sortedYears.map((year) => getValue(court, 'DV_Filings', year) ?? 0),
    color: getCourtColor(court),
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
        <div className="flex flex-col gap-2">
          <CardTitle>Domestic Violence (Protection Orders) Filings</CardTitle>
          <p className="text-sm text-muted-foreground">Violence/DV case filings in Magistrates Court.</p>
          <CourtColorLegend courts={courts} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
