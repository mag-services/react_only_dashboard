import { Box, Paper, Typography } from '@mui/material'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function FilingsDisposalsChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'Filings').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const chartData = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const filings = getValue(court, 'Filings', year)
      const disposals = getValue(court, 'Disposals', year)
      if (filings == null && disposals == null) return []
      return [
        { court, year, metric: 'Filings', value: filings ?? 0 },
        { court, year, metric: 'Disposals', value: disposals ?? 0 },
      ]
    })
  )

  const byCourtYear = chartData.reduce(
    (acc, row) => {
      const key = `${row.court}|${row.year}`
      if (!acc[key]) acc[key] = { court: row.court, year: row.year, name: `${row.court} ${row.year}`, Filings: 0, Disposals: 0 }
      acc[key][row.metric as 'Filings' | 'Disposals'] = row.value
      return acc
    },
    {} as Record<string, { court: string; year: number; name: string; Filings: number; Disposals: number }>
  )
  const series = Object.values(byCourtYear)

  const colors = { Filings: '#0d47a1', Disposals: '#006064' }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filings & Disposals by Court and Year
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={series}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
            <YAxis type="number" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Filings" fill={colors.Filings} name="Filings" />
            <Bar dataKey="Disposals" fill={colors.Disposals} name="Disposals" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
