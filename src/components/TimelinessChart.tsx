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

export function TimelinessChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'TimelinessCriminal').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const series = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const crim = getValue(court, 'TimelinessCriminal', year)
      const civil = getValue(court, 'TimelinessCivil', year)
      if (crim == null && civil == null) return []
      return [{ court, year, name: `${court} ${year}`, Criminal: crim ?? 0, Civil: civil ?? 0 }]
    })
  )

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Timeliness (days) – Criminal vs Civil
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Criminal" fill="#0d47a1" name="Criminal (days)" />
            <Bar dataKey="Civil" fill="#006064" name="Civil (days)" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
