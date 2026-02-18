import { useCallback, useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'
import Papa from 'papaparse'
import type { StatRow } from './types'
import { ClearanceRateChart } from './components/ClearanceRateChart'
import { FilingsDisposalsChart } from './components/FilingsDisposalsChart'
import { PendingCasesTable } from './components/PendingCasesTable'
import { TimelinessChart } from './components/TimelinessChart'
import { AttendanceChart } from './components/AttendanceChart'
import { GenderBreakdownChart } from './components/GenderBreakdownChart'
import { CaseOutcomesTable } from './components/CaseOutcomesTable'
import { ProductivityChart } from './components/ProductivityChart'

/** Parse numeric value; returns null for NA / empty */
function parseValue(val: string): number | null {
  if (val == null || val === '' || String(val).toLowerCase() === 'na') return null
  const n = parseFloat(String(val))
  return Number.isNaN(n) ? null : n
}

/** Load CSV for a year via fetch */
async function loadYearData(year: number): Promise<StatRow[]> {
  const res = await fetch(`/data/${year}.csv`)
  if (!res.ok) throw new Error(`Failed to load ${year}.csv`)
  const text = await res.text()
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true })
  return (parsed.data ?? []).map((r) => ({
    Court: r.Court ?? '',
    Year: r.Year ?? String(year),
    Metric: r.Metric ?? '',
    Value: r.Value ?? '',
    Unit: r.Unit ?? '',
  }))
}

/** Load available years from manifest */
async function loadAvailableYears(): Promise<number[]> {
  const res = await fetch('/data/years.json')
  if (!res.ok) return [2018, 2020, 2021, 2022, 2023, 2024]
  const json = (await res.json()) as { years: number[] }
  return json.years ?? []
}

export default function App() {
  const [years, setYears] = useState<number[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [data, setData] = useState<StatRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadYears = useCallback(async () => {
    try {
      const y = await loadAvailableYears()
      setYears(y)
      setSelectedYears((prev) => (prev.length === 0 && y.length > 0 ? (y.length >= 3 ? y.slice(-3) : y) : prev))
    } catch (e) {
      setError((e as Error).message)
    }
  }, [])

  useEffect(() => {
    loadYears()
  }, [])

  useEffect(() => {
    if (selectedYears.length === 0) {
      setData([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all(selectedYears.map(loadYearData))
      .then((arr) => {
        if (cancelled) return
        setData(arr.flat())
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedYears])

  const handleYearsChange = (e: SelectChangeEvent<number[]>) => {
    const v = e.target.value
    setSelectedYears(Array.isArray(v) ? v : [v])
  }

  const getValue = useCallback((court: string, metric: string, year?: number): number | null => {
    const row = data.find((r) => r.Court === court && r.Metric === metric && (year == null || r.Year === String(year)))
    return row ? parseValue(row.Value) : null
  }, [data])

  const getRowsByMetric = useCallback(
    (metric: string) =>
      data.filter((r) => r.Metric === metric).map((r) => ({ ...r, valueNum: parseValue(r.Value) })),
    [data]
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vanuatu Courts Dashboard
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }} variant="outlined">
            <InputLabel>Years</InputLabel>
            <Select
              multiple
              value={selectedYears}
              onChange={handleYearsChange}
              label="Years"
              renderValue={(v) => (v as number[]).sort((a, b) => a - b).join(', ')}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {!loading && selectedYears.length === 0 && (
          <Alert severity="info">Select at least one year to view data.</Alert>
        )}

        {!loading && selectedYears.length > 0 && data.length === 0 && (
          <Alert severity="warning">No data available for the selected years.</Alert>
        )}

        {!loading && data.length > 0 && (
          <DashboardTabs
            data={data}
            selectedYears={selectedYears}
            getValue={getValue}
            getRowsByMetric={getRowsByMetric}
          />
        )}
      </Container>
    </Box>
  )
}

function DashboardTabs({
  data,
  selectedYears,
  getValue,
  getRowsByMetric,
}: {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
  getRowsByMetric: (metric: string) => (StatRow & { valueNum: number | null })[]
}) {
  const [tab, setTab] = useState(0)

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tab label="Clearance Rates" />
        <Tab label="Filings & Disposals" />
        <Tab label="Pending & PDR" />
        <Tab label="Timeliness" />
        <Tab label="Attendance" />
        <Tab label="Gender" />
        <Tab label="Case Outcomes" />
        <Tab label="Productivity" />
      </Tabs>

      {tab === 0 && <ClearanceRateChart data={data} selectedYears={selectedYears} getValue={getValue} />}
      {tab === 1 && <FilingsDisposalsChart data={data} selectedYears={selectedYears} getValue={getValue} />}
      {tab === 2 && <PendingCasesTable getRowsByMetric={getRowsByMetric} selectedYears={selectedYears} />}
      {tab === 3 && <TimelinessChart data={data} selectedYears={selectedYears} getValue={getValue} />}
      {tab === 4 && <AttendanceChart data={data} selectedYears={selectedYears} getValue={getValue} />}
      {tab === 5 && <GenderBreakdownChart data={data} selectedYears={selectedYears} getValue={getValue} />}
      {tab === 6 && <CaseOutcomesTable getRowsByMetric={getRowsByMetric} selectedYears={selectedYears} />}
      {tab === 7 && <ProductivityChart data={data} selectedYears={selectedYears} getValue={getValue} />}
    </Box>
  )
}
