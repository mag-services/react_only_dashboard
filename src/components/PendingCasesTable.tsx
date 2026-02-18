import { Box, Paper, Typography } from '@mui/material'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { StatRow } from '../types'

interface Props {
  getRowsByMetric: (metric: string) => (StatRow & { valueNum: number | null })[]
  selectedYears: number[]
}

export function PendingCasesTable({ getRowsByMetric, selectedYears }: Props) {
  const pendingRows = getRowsByMetric('Pending')
  const pdrRows = getRowsByMetric('PDR')
  const sortedYears = [...selectedYears].sort((a, b) => a - b)

  const tableData = pendingRows.map((r) => ({
    court: r.Court,
    year: r.Year,
    pending: r.valueNum,
    pdr: pdrRows.find((p) => p.Court === r.Court && p.Year === r.Year)?.valueNum ?? null,
  }))

  const byCourtYear = tableData.reduce(
    (acc, row) => {
      const key = `${row.court}|${row.year}`
      acc[key] = { court: row.court, year: row.year, Pending: row.pending ?? 0, PDR: row.pdr ?? 0 }
      return acc
    },
    {} as Record<string, { court: string; year: string; Pending: number; PDR: number }>
  )
  const chartData = Object.values(byCourtYear).map((r) => ({ ...r, name: `${r.court} ${r.year}` }))

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Pending Cases & PDR
      </Typography>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Court</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Pending</TableCell>
              <TableCell align="right">PDR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={`${row.court}-${row.year}`}>
                <TableCell>{row.court}</TableCell>
                <TableCell align="right">{row.year}</TableCell>
                <TableCell align="right">{row.pending ?? 'N/A'}</TableCell>
                <TableCell align="right">{row.pdr ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ height: 300, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Pending Cases (bar chart)
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Pending" fill="#0d47a1" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
