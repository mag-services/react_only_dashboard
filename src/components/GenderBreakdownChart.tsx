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

export function GenderBreakdownChart({ data, selectedYears, getValue }: Props) {
  const courts = [...new Set(data.filter((r) => r.Metric === 'Gender_Male').map((r) => r.Court))]
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const series = courts.flatMap((court) =>
    sortedYears.map((year) => {
      const male = getValue(court, 'Gender_Male', year)
      const female = getValue(court, 'Gender_Female', year)
      return {
        court,
        year,
        name: `${court} ${year}`,
        Male: male ?? 0,
        Female: female ?? 0,
      }
    })
  )

  const colors = { Male: '#0d47a1', Female: '#006064' }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Gender Breakdown by Court (%)
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Male" stackId="a" fill={colors.Male} name="Male %" />
            <Bar dataKey="Female" stackId="a" fill={colors.Female} name="Female %" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
