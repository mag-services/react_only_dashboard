import { Box, Paper, Typography } from '@mui/material'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { StatRow } from '../types'

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
}

export function ProductivityChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'Productivity').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const series = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const v = getValue(court, 'Productivity', year)
      if (v == null) return []
      return [{ court, year, name: `${court} ${year}`, Productivity: v }]
    })
  )

  if (series.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Productivity (cases per judge/magistrate)
        </Typography>
        <Typography color="text.secondary">No productivity data available for selected years.</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Productivity (cases per judge/magistrate)
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Productivity" fill="#0d47a1" name="Cases per judge" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
