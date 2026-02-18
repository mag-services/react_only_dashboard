import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function ChargeOrdersChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'ChargeOrders').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const chartData = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const v = getValue(court, 'ChargeOrders', year)
      if (v == null) return []
      return [{ court, year, name: `${court} ${year}`, ChargeOrders: v }]
    })
  )

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
      categories: chartData.map((r) => r.name),
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0 } },
    series: [{
      name: 'Charge Orders',
      data: chartData.map((r) => r.ChargeOrders),
      type: 'column',
      color: '#422AFB',
    }],
    legend: { enabled: false },
    tooltip: { shared: false },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Charge Orders by Court</CardTitle>
        <p className="text-sm text-muted-foreground">
          Orders recorded from individual criminal charges. SC typically records 1200+, MC under 200.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
