import { CaseOutcomesTable } from '../components/CaseOutcomesTable'
import { CoAOutcomesChart } from '../components/CoAOutcomesChart'
import { Card, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'
import type { StatRow } from '../types'

const COURTS_WITHOUT_OUTCOMES = ['Island Court']

interface Props {
  data: StatRow[]
  selectedYears: number[]
  getValue: (court: string, metric: string, year?: number) => number | null
  getRowsByMetric: (metric: string) => (StatRow & { valueNum: number | null })[]
}

export function OutcomesPage({ data, selectedYears, getValue, getRowsByMetric }: Props) {
  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-amber-50/80">
        <CardContent className="flex items-start gap-3 pt-6">
          <Info className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> {COURTS_WITHOUT_OUTCOMES.join(', ')} does not have case outcome data (Guilty, Not Guilty, Withdrawn, etc.) in the annual reports. Outcomes are reported for Court of Appeal, Supreme Court, and Magistrates Court only.
          </p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <CaseOutcomesTable getRowsByMetric={getRowsByMetric} selectedYears={selectedYears} />
      <CoAOutcomesChart data={data} selectedYears={selectedYears} getValue={getValue} />
      </div>
    </div>
  )
}
