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

export function ChargeOrdersChart({ data, selectedYears, getValue }: Props) {
  const courts = sortCourtsByOrder([...new Set(data.filter((r) => r.Metric === 'ChargeOrders').map((r) => r.Court))])
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const chartData = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const v = getValue(court, 'ChargeOrders', year)
      if (v == null) return []
      return [{ court, year, name: `${court} ${year}`, ChargeOrders: v }]
    })
  )
  const categories = chartData.map((r) => r.name)
  const series = courts.map((court) => ({
    name: court,
    type: 'column' as const,
    data: chartData.map((r) => (r.court === court ? r.ChargeOrders : null)),
    color: getCourtColor(court),
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Charge Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No charge orders data for selected years.</p>
        </CardContent>
      </Card>
    )
  }

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 350 },
    xAxis: {
      categories,
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0 } },
    series,
    legend: { enabled: true },
    tooltip: { shared: false },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>Charge Orders by Court</CardTitle>
          <CourtColorLegend courts={courts} />
          <p className="text-sm text-muted-foreground">
          Orders recorded from individual criminal charges. SC typically records 1200+, MC under 200.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
