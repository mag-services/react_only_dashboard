import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ExternalLink, Database } from 'lucide-react'

interface Report {
  year: number
  title: string
  url: string
}

const SOURCE_CSVS = [
  { file: 'court_metrics.csv', description: 'Filings, disposals, clearance, pending, PDR, timeliness, attendance, productivity, reserved judgments' },
  { file: 'gender_analysis.csv', description: 'Male/Female % by court' },
  { file: 'case_outcomes.csv', description: 'Guilty, Not guilty, Withdrawn, Dismissed, etc. (CoA, SC, MC only)' },
  { file: 'case_workload_by_type.csv', description: 'Filings by case type (Total, Criminal, Civil, PI, Maintenance, Violence)' },
  { file: 'pending_by_type.csv', description: 'Pending cases by type' },
  { file: 'pending_listed_status.csv', description: 'With future listing, Under case mgmt, No future date' },
  { file: 'dv_filings.csv', description: 'Domestic violence / protection order filings' },
  { file: 'location_workload.csv', description: 'Filings by province (MC & Island Court)' },
  { file: 'charge_orders.csv', description: 'Charge orders by court' },
  { file: 'coa_outcomes.csv', description: 'Court of Appeal outcomes (Civil/Criminal: Dismissed, Allowed, Withdrawn)' },
] as const

const ASSUMPTIONS = [
  {
    metric: 'Pending Age (%)',
    formula: 'cases older than benchmark age ÷ total pending × 100',
    notes: 'Supreme Court: benchmark = 3 years. Magistrates Court & Island Court: benchmark = 2 years. Court of Appeal: typically 0% (reserved judgments tracked separately).',
  },
  {
    metric: 'Clearance Rate',
    formula: 'Disposals ÷ Filings (same period) × 100',
    notes: '≥100% means backlog is reducing; under 100% means backlog is growing.',
  },
  {
    metric: 'PDR (Pending to Disposal Ratio)',
    formula: 'Pending ÷ Disposals',
    notes: 'Years of work remaining at current disposal rates. Targets: ≤1.0 (Supreme Court), ≤0.5 (Magistrates & Island Court).',
  },
  {
    metric: 'Pending Listed Status',
    formula: 'Percentage with future listing / under case mgmt / no future date',
    notes: 'Benchmark: 80% of pending cases should have a future listing date. Green = on track.',
  },
  {
    metric: 'Timeliness (Criminal)',
    formula: 'Average days from filing to final disposition',
    notes: 'Target: ≤180 days.',
  },
  {
    metric: 'Timeliness (Civil)',
    formula: 'Average days from filing to final disposition',
    notes: 'Target: ≤365 days.',
  },
  {
    metric: 'Productivity',
    formula: 'Cases disposed ÷ full-time judge/magistrate equivalents',
    notes: 'Cases disposed per judicial officer per year.',
  },
  {
    metric: 'Reserved Judgments',
    formula: 'Count of cases awaiting written judgment',
    notes: 'Benchmark: most judgments delivered within 90 days of hearing.',
  },
  {
    metric: 'Outcomes (Guilty, Dismissed, etc.)',
    formula: 'As reported in annual reports',
    notes: 'Island Court does not report case outcomes in the annual reports. Data available for Court of Appeal, Supreme Court, and Magistrates Court only.',
  },
] as const

interface DataSourcesMethodologyPageProps {
  embedded?: boolean
}

export function DataSourcesMethodologyPage({ embedded }: DataSourcesMethodologyPageProps) {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}annual-reports/reports.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setReports)
      .catch(() => setReports([]))
  }, [])

  return (
    <div className={embedded ? 'mx-auto max-w-3xl' : ''}>
      <p className="mb-6 text-muted-foreground">
        Documentation of data sources, extraction process, and methodology assumptions used in this dashboard.
      </p>

      <div className="space-y-6">
        {/* PDFs used */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              PDFs Used (Annual Reports)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Data is extracted from Vanuatu Judiciary Annual Reports published at{' '}
              <a href="https://courts.gov.vu" target="_blank" rel="noopener noreferrer" className="text-[#422AFB] hover:underline">
                courts.gov.vu
              </a>
              . The following reports are used as source documents:
            </p>
            <ul className="space-y-2">
              {reports.length === 0 ? (
                <li className="text-sm text-muted-foreground">Loading reports…</li>
              ) : (
                reports.map((r) => (
                  <li key={r.year} className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                    <span className="font-medium">{r.title}</span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#422AFB] hover:underline"
                    >
                      View PDF
                      <ExternalLink className="size-3.5" />
                    </a>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Extraction notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5" />
              Extraction Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Data is extracted from annual report PDFs using advanced data-science LLMs trained for document understanding and structured information extraction. The models parse tables, figures, and narrative text to produce structured CSV files in the <code className="rounded bg-muted px-1.5 py-0.5">data/</code> folder. The build script{' '}
              <code className="rounded bg-muted px-1.5 py-0.5">scripts/generate-yearly-data.mjs</code> merges these into yearly CSVs loaded by the dashboard.
            </p>
            <div>
              <p className="mb-2 text-sm font-medium">Source files:</p>
              <ul className="space-y-1.5 text-sm">
                {SOURCE_CSVS.map(({ file, description }) => (
                  <li key={file} className="flex gap-2">
                    <code className="shrink-0 rounded bg-muted px-1.5 py-0.5">{file}</code>
                    <span className="text-muted-foreground">— {description}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Missing or NA values in source CSVs are omitted from the generated data. Report layout varies slightly by year; the extraction models are trained to adapt to table structure changes and follow the published definitions in each report.
            </p>
          </CardContent>
        </Card>

        {/* Assumptions / Methodology */}
        <Card>
          <CardHeader>
            <CardTitle>Methodology & Assumptions</CardTitle>
            <p className="text-sm text-muted-foreground">
              How metrics are calculated or interpreted, based on annual report definitions and dashboard conventions.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {ASSUMPTIONS.map(({ metric, formula, notes }) => (
                <li key={metric} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="font-medium text-foreground">{metric}</p>
                  <p className="mt-1 text-sm">
                    <span className="text-muted-foreground">Formula:</span>{' '}
                    <code className="rounded bg-muted px-1.5 py-0.5">{formula}</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{notes}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
