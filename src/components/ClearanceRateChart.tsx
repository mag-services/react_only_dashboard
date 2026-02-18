import { Box, Paper, Typography } from '@mui/material'
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

export function ClearanceRateChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'ClearanceRate').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const chartData = sortedYears.map((year) => {
    const point: Record<string, string | number> = { year }
    courts.forEach((court) => {
      const v = getValue(court, 'ClearanceRate', year)
      point[court] = v ?? 0
    })
    return point
  })

  const colors = ['#0d47a1', '#006064', '#1565c0', '#00838f']

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Clearance Rates by Court (%)
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[0, 110]} />
            <Tooltip />
            <Legend />
            {courts.map((court, i) => (
              <Line key={court} type="monotone" dataKey={court} stroke={colors[i % colors.length]} strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
