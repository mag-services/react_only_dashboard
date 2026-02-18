import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/DataTable'
import type { StatRow } from '../types'

interface PendingAgeRow {
  court: string
  year: number
  name: string
  PendingAge: number
}

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function PendingAgeChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'PendingAge').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const tableData = useMemo(
    () =>
      courts.flatMap((court) =>
        sortedYears.map((year) => {
          const v = getValue(court, 'PendingAge', year)
          return { court, year, name: `${court} ${year}`, PendingAge: v ?? 0 }
        })
      ),
    [courts, sortedYears, getValue]
  )

  const columns = useMemo<ColumnDef<PendingAgeRow>[]>(
    () => [
      { accessorKey: 'court', header: 'Court' },
      { accessorKey: 'year', header: 'Year', meta: { className: 'text-right' }, cell: ({ getValue }) => <span className="block text-right">{getValue()}</span> },
      { accessorKey: 'PendingAge', header: 'Pending Age (%)', meta: { className: 'text-right' }, cell: ({ getValue }) => <span className="block text-right">{getValue()}%</span> },
    ],
    []
  )

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 300 },
    xAxis: {
      categories: tableData.map((r) => r.name),
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { min: 0, max: 100, title: { text: '%' }, gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0 } },
    series: [{
      name: 'Older than 2-3 years',
      data: tableData.map((r) => r.PendingAge),
      type: 'column',
      color: '#422AFB',
    }],
    legend: { enabled: false },
    tooltip: { valueSuffix: '%' },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Age – % of Cases Older Than 2–3 Years</CardTitle>
        <p className="text-sm text-muted-foreground">
          SC: cases older than 3 years. MC & IC: cases older than 2 years. Lower is better.
        </p>
      </CardHeader>
      <CardContent>
        <DataTable
          data={tableData}
          columns={columns}
          pageSize={5}
          getRowId={(row) => `${row.court}-${row.year}`}
        />
        <div className="mt-4 h-[300px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
