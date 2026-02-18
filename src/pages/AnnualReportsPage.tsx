import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ArrowLeft } from 'lucide-react'

interface Report {
  year: number
  title: string
  file: string
}

export function AnnualReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}annual-reports/reports.json`)
      .then((r) => r.ok ? r.json() : [])
      .then(setReports)
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#422AFB] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
        <h1 className="mb-2 text-2xl font-bold" style={{ color: '#422AFB' }}>
          Annual Reports
        </h1>
        <p className="mb-6 text-muted-foreground">
          PDF reports from the Vanuatu Judiciary. Add files to <code className="rounded bg-muted px-1">public/annual-reports/</code> and update <code className="rounded bg-muted px-1">reports.json</code>.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-10 animate-spin rounded-full border-2 border-[#7551ff] border-t-transparent" />
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No reports yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Place PDF files in <code className="rounded bg-muted px-1">public/annual-reports/</code> and edit <code className="rounded bg-muted px-1">public/annual-reports/reports.json</code> to list them.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Example: Add <code className="rounded bg-muted px-1">2024.pdf</code> and include <code className="rounded bg-muted px-1">{`{"year": 2024, "title": "Annual Statistics 2024", "file": "2024.pdf"}`}</code> in the manifest.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <Card key={r.year} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#422AFB]/15">
                      <FileText className="size-5" style={{ color: '#422AFB' }} />
                    </div>
                    {r.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`${import.meta.env.BASE_URL}annual-reports/${r.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#422AFB] px-4 py-2 text-sm font-medium text-white hover:bg-[#7551ff]"
                  >
                    <FileText className="size-4" />
                    View PDF
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
