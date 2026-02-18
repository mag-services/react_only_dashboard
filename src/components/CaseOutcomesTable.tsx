import { Box, Paper, Typography } from '@mui/material'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { StatRow } from '../types'

interface Props {
  getRowsByMetric: (metric: string) => (StatRow & { valueNum: number | null })[]
  selectedYears: number[]
}

const OUTCOME_METRICS = [
  'Criminal_Guilty',
  'Criminal_NotGuilty',
  'Criminal_Withdrawn',
  'Criminal_Dismissed',
  'Civil_Guilty',
  'Civil_NotGuilty',
  'Civil_Withdrawn',
  'Civil_Committed',
  'Civil_Dismissed',
  'PI_Guilty',
  'PI_NotGuilty',
  'PI_Withdrawn',
  'PI_Committed',
  'PI_Dismissed',
] as const

export function CaseOutcomesTable({ getRowsByMetric, selectedYears }: Props) {
  const outcomeRows = OUTCOME_METRICS.flatMap((m) => getRowsByMetric(m))
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const byCourtYearMetric = outcomeRows.reduce(
    (acc, row) => {
      const key = `${row.Court}|${row.Year}|${row.Metric}`
      acc[key] = row
      return acc
    },
    {} as Record<string, (StatRow & { valueNum: number | null })>
  )

  const courts = [...new Set(outcomeRows.map((r) => r.Court))]
  const chartData = courts.flatMap((court) =>
    sortedYears.flatMap((year) => {
      const metrics = OUTCOME_METRICS.filter((m) => {
        const r = byCourtYearMetric[`${court}|${year}|${m}`]
        return r?.valueNum != null
      })
      if (metrics.length === 0) return []
      const point: Record<string, string | number> = { court, year, name: `${court} ${year}` }
      metrics.forEach((m) => {
        point[m] = byCourtYearMetric[`${court}|${year}|${m}`]?.valueNum ?? 0
      })
      return [point]
    })
  )

  const barKeys = [...new Set(chartData.flatMap((d) => Object.keys(d).filter((k) => !['court', 'year', 'name'].includes(k))))]
  const barColors: Record<string, string> = {
    Criminal_Guilty: '#0d47a1',
    Criminal_NotGuilty: '#006064',
    Criminal_Withdrawn: '#1565c0',
    Criminal_Dismissed: '#00838f',
    Civil_Guilty: '#4dd0e1',
    Civil_NotGuilty: '#81d4fa',
    Civil_Withdrawn: '#b2ebf2',
    Civil_Committed: '#b2dfdb',
    Civil_Dismissed: '#e0f2f1',
    PI_Guilty: '#00695c',
    PI_NotGuilty: '#26a69a',
    PI_Withdrawn: '#80cbc4',
    PI_Committed: '#4db6ac',
    PI_Dismissed: '#b2dfdb',
  }

  const tableRows = outcomeRows.map((r) => ({
    court: r.Court,
    year: r.Year,
    metric: r.Metric,
    value: r.valueNum ?? 'N/A',
  }))

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Case Outcomes (Guilty, NotGuilty, Withdrawn, Committed, Dismissed)
      </Typography>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Court</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell>Metric</TableCell>
              <TableCell align="right">Value (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row, i) => (
              <TableRow key={`${row.court}-${row.year}-${row.metric}-${i}`}>
                <TableCell>{row.court}</TableCell>
                <TableCell align="right">{row.year}</TableCell>
                <TableCell>{row.metric}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {chartData.length > 0 && barKeys.length > 0 && (
        <Box sx={{ height: 350, mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Case Outcomes by Court and Year (%)
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              {barKeys.map((k) => (
                <Bar key={k} dataKey={k} fill={barColors[k] ?? '#78909c'} name={k.replace('_', ' ')} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  )
}
