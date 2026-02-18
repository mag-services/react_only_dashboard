import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatRow } from '../types'

const ATTENDANCE_METRICS = ['AttendanceCriminal', 'AttendanceCivil', 'AttendanceEnforcement'] as const

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function AttendanceChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => (ATTENDANCE_METRICS as readonly string[]).includes(r.Metric)).map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const seriesData = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const crim = getValue(court, 'AttendanceCriminal', year)
      const civil = getValue(court, 'AttendanceCivil', year)
      const enforcement = getValue(court, 'AttendanceEnforcement', year)
      if (crim == null && civil == null && enforcement == null) return []
      return [{
        court, year, name: `${court} ${year}`,
        Criminal: crim ?? 0, Civil: civil ?? 0, Enforcement: enforcement ?? 0,
      }]
    })
  )

  if (seriesData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No attendance data available for selected years.</p>
        </CardContent>
      </Card>
    )
  }

  const categories = seriesData.map((r) => r.name)
  const series = [
    { name: 'Criminal', data: seriesData.map((r) => r.Criminal), type: 'column' as const, color: '#422AFB' },
    { name: 'Civil', data: seriesData.map((r) => r.Civil), type: 'column' as const, color: '#7551ff' },
    { name: 'Enforcement', data: seriesData.map((r) => r.Enforcement), type: 'column' as const, color: '#1565c0' },
  ]

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 400 },
    xAxis: {
      categories,
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { title: { text: '%' }, gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0 } },
    series,
    legend: { enabled: true },
    tooltip: { shared: true, valueSuffix: '%' },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Rates (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
