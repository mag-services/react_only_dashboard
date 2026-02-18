import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/DataTable'
import type { StatRow } from '../types'

interface PendingRow {
  court: string
  year: string
  pending: number | null
  pdr: number | null
}

interface Props {
  getRowsByMetric: (metric: string) => (StatRow & { valueNum: number | null })[]
  selectedYears: number[]
}

export function PendingCasesTable({ getRowsByMetric, selectedYears }: Props) {
  const pendingRows = getRowsByMetric('Pending')
  const pdrRows = getRowsByMetric('PDR')

  const tableData = useMemo(
    () =>
      pendingRows.map((r) => ({
        court: r.Court,
        year: r.Year,
        pending: r.valueNum,
        pdr: pdrRows.find((p) => p.Court === r.Court && p.Year === r.Year)?.valueNum ?? null,
      })),
    [pendingRows, pdrRows]
  )

  const chartData = tableData.map((r) => ({ ...r, name: `${r.court} ${r.year}`, Pending: r.pending ?? 0 }))

  const columns = useMemo<ColumnDef<PendingRow>[]>(
    () => [
      { accessorKey: 'court', header: 'Court', meta: { className: '' } },
      { accessorKey: 'year', header: 'Year', meta: { className: 'text-right' }, cell: ({ getValue }) => <span className="block text-right">{getValue()}</span> },
      { accessorKey: 'pending', header: 'Pending', meta: { className: 'text-right' }, cell: ({ getValue }) => <span className="block text-right">{getValue() ?? 'N/A'}</span> },
      { accessorKey: 'pdr', header: 'PDR', meta: { className: 'text-right' }, cell: ({ getValue }) => <span className="block text-right">{getValue() ?? 'N/A'}</span> },
    ],
    []
  )

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 300 },
    xAxis: {
      categories: chartData.map((r) => r.name),
      labels: { rotation: -45, style: { fontSize: '10px' } },
      crosshair: true,
    },
    yAxis: { gridLineDashStyle: 'Dot' },
    plotOptions: { column: { borderWidth: 0 } },
    series: [{ name: 'Pending', data: chartData.map((r) => r.Pending), type: 'column', color: '#422AFB' }],
    legend: { enabled: false },
    tooltip: { shared: false },
    credits: { enabled: false },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Cases & PDR</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={tableData}
          columns={columns}
          pageSize={5}
          getRowId={(row) => `${row.court}-${row.year}`}
        />
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-muted-foreground">Pending Cases (bar chart)</p>
          <div className="h-[300px]">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
