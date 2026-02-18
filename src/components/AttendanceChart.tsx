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

const ATTENDANCE_METRICS = ['AttendanceCriminal', 'AttendanceCivil', 'AttendanceEnforcement'] as const

export function AttendanceChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => (ATTENDANCE_METRICS as readonly string[]).includes(r.Metric)).map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const series = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const crim = getValue(court, 'AttendanceCriminal', year)
      const civil = getValue(court, 'AttendanceCivil', year)
      const enforcement = getValue(court, 'AttendanceEnforcement', year)
      if (crim == null && civil == null && enforcement == null) return []
      return [
        {
          court,
          year,
          name: `${court} ${year}`,
          Criminal: crim ?? 0,
          Civil: civil ?? 0,
          Enforcement: enforcement ?? 0,
        },
      ]
    })
  )

  if (series.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Rates
        </Typography>
        <Typography color="text.secondary">No attendance data available for selected years.</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Attendance Rates (%)
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Criminal" fill="#0d47a1" name="Criminal" />
            <Bar dataKey="Civil" fill="#006064" name="Civil" />
            <Bar dataKey="Enforcement" fill="#1565c0" name="Enforcement" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
