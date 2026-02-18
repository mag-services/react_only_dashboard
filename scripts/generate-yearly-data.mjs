#!/usr/bin/env node
/**
 * Generates one CSV per year from the three source files in data/.
 * Run: npm run generate-data
 * Sources: data/gender_analysis.csv, data/court_metrics.csv, data/case_outcomes.csv
 * Output: public/data/2018.csv, ..., public/data/2024.csv, public/data/years.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'data')

// Column -> unit mapping for court_metrics
const COURT_METRIC_UNITS = {
  Filings: '',
  Disposals: '',
  ClearanceRate: '%',
  Pending: '',
  PDR: '',
  PendingAge: 'days',
  TimelinessCriminal: 'days',
  TimelinessCivil: 'days',
  AttendanceCriminal: '%',
  AttendanceCivil: '%',
  AttendanceEnforcement: '%',
  Productivity: '',
  ReservedJudgments: '',
}

function parseCSV(content) {
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const row = {}
    headers.forEach((h, i) => (row[h] = values[i] ?? ''))
    return row
  })
}

function readCSV(filename) {
  const p = path.join(DATA_DIR, filename)
  return parseCSV(fs.readFileSync(p, 'utf-8'))
}

function writeYearlyCSV(year, rows) {
  const header = 'Court,Year,Metric,Value,Unit'
  const content = [header, ...rows.map((r) => [r.Court, r.Year, r.Metric, r.Value, r.Unit].join(','))].join('\n')
  const outPath = path.join(ROOT, 'public', 'data', `${year}.csv`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, content + '\n')
}

// Load source data
const genderData = readCSV('gender_analysis.csv')
const courtMetrics = readCSV('court_metrics.csv')
const caseOutcomes = readCSV('case_outcomes.csv')

const years = [...new Set([...courtMetrics.map((r) => r.Year), ...genderData.map((r) => r.Year), ...caseOutcomes.map((r) => r.Year)])].filter(Boolean).map(Number).sort((a, b) => a - b)

for (const year of years) {
  const rows = []

  // Court metrics
  for (const r of courtMetrics.filter((x) => x.Year === String(year))) {
    const court = r.Court
    for (const [col, unit] of Object.entries(COURT_METRIC_UNITS)) {
      const val = r[col]
      if (val === undefined || val === '' || val.toLowerCase() === 'na') continue
      rows.push({ Court: court, Year: String(year), Metric: col, Value: val, Unit: unit })
    }
  }

  // Gender
  for (const r of genderData.filter((x) => x.Year === String(year))) {
    const court = r.Court
    if (r.Male) rows.push({ Court: court, Year: String(year), Metric: 'Gender_Male', Value: r.Male, Unit: '%' })
    if (r.Female) rows.push({ Court: court, Year: String(year), Metric: 'Gender_Female', Value: r.Female, Unit: '%' })
  }

  // Case outcomes (prefix with CaseType)
  for (const r of caseOutcomes.filter((x) => x.Year === String(year))) {
    const court = r.Court
    const prefix = r.CaseType + '_'
    for (const col of ['Guilty', 'NotGuilty', 'Withdrawn', 'Committed', 'Dismissed']) {
      const val = r[col]
      if (val === undefined || val === '' || val.toLowerCase() === 'na') continue
      rows.push({ Court: court, Year: String(year), Metric: prefix + col, Value: val, Unit: '%' })
    }
  }

  writeYearlyCSV(year, rows)
  console.log(`Wrote public/data/${year}.csv (${rows.length} rows)`)
}

// Write years manifest for app to discover available years
const manifestPath = path.join(ROOT, 'public', 'data', 'years.json')
fs.writeFileSync(manifestPath, JSON.stringify({ years }))
console.log(`Wrote public/data/years.json (${years.join(', ')})`)
