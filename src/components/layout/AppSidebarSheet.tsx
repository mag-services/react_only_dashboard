import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CourtsFilterDropdown } from '@/components/CourtsFilterDropdown'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'

const ROUTES = [
  'Overview',
  'Pending Cases',
  'Workload',
  'Performance',
  'Outcomes',
  'Other Metrics',
  'Annual Reports',
  'Glossary',
] as const

function formatLastUpdated(iso: string | null): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return iso
  }
}

interface AppSidebarSheetProps {
  activeTab: number
  onTabChange: (tab: number) => void
  years: number[]
  selectedYears: number[]
  onYearsChange: (years: number[]) => void
  courts: readonly string[]
  selectedCourts: string[]
  onCourtsChange: (courts: string[]) => void
  lastUpdated?: string | null
}

export function AppSidebarSheet({
  activeTab,
  onTabChange,
  years,
  selectedYears,
  onYearsChange,
  courts,
  selectedCourts,
  onCourtsChange,
  lastUpdated: propLastUpdated,
}: AppSidebarSheetProps) {
  const [open, setOpen] = useState(false)
  const [fetchedLastUpdated, setFetchedLastUpdated] = useState<string | null>(null)
  const lastUpdated = propLastUpdated ?? fetchedLastUpdated

  useEffect(() => {
    if (propLastUpdated !== undefined) return
    fetch(`${import.meta.env.BASE_URL}data/years.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setFetchedLastUpdated(json?.lastUpdated ?? null))
      .catch(() => {})
  }, [propLastUpdated])

  const rawMin = years.indexOf(selectedYears[0] ?? years[0] ?? 0)
  const rawMax = years.indexOf(selectedYears[selectedYears.length - 1] ?? years[years.length - 1] ?? 0)
  const yearMinIdx = years.length > 0 ? Math.max(0, rawMin >= 0 ? rawMin : 0) : 0
  const yearMaxIdx = years.length > 0 ? Math.min(years.length - 1, rawMax >= 0 ? rawMax : years.length - 1) : 0
  const sliderValue: [number, number] = [yearMinIdx, Math.max(yearMinIdx, yearMaxIdx)]
  const onSliderChange = (v: number[]) => {
    const [lo, hi] = [Math.min(v[0], v[1]), Math.max(v[0], v[1])]
    onYearsChange(years.slice(lo, hi + 1))
  }
  const handleSelect = (i: number) => {
    onTabChange(i)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-border/60 bg-white shadow-sm hover:bg-muted/50"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-0">
        <div className="flex h-full flex-col bg-white">
          <div className="flex h-[70px] items-center border-b border-border/60 px-5">
            <span className="text-xl font-bold tracking-tight" style={{ color: '#422AFB' }}>
              Vanuatu Courts
            </span>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-4">
            {ROUTES.map((name, i) => (
              <button
                key={name}
                onClick={() => handleSelect(i)}
                className={`block w-full rounded-xl px-3 py-3 text-left text-sm font-medium transition-all ${
                  activeTab === i ? 'bg-[#7551ff]/10 text-[#422AFB]' : 'hover:bg-muted/80'
                }`}
              >
                {name}
              </button>
            ))}
            <Separator className="my-5" />
            <div className="space-y-3">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Courts</p>
              <CourtsFilterDropdown
                courts={courts}
                selectedCourts={selectedCourts}
                onCourtsChange={onCourtsChange}
              />
              <p className="px-2 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Years</p>
              <div className="space-y-2 px-2">
                <p className="text-sm font-medium">
                  {selectedYears.length ? selectedYears.sort((a, b) => a - b).join(' – ') : 'Select years'}
                </p>
                {years.length > 1 && (
                  <>
                    <Slider
                      min={0}
                      max={years.length - 1}
                      step={1}
                      value={sliderValue}
                      onValueChange={onSliderChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{years[0]}</span>
                      <span>{years[years.length - 1]}</span>
                    </div>
                  </>
                )}
                {years.length <= 1 && (
                  <p className="text-xs text-muted-foreground">Loading years…</p>
                )}
              </div>
            </div>
          </nav>
          <div className="p-4">
            <div
              className="flex flex-col gap-2 rounded-2xl p-4 text-white"
              style={{
                background: 'linear-gradient(135deg, #7551ff 0%, #a78bfa 50%, #60a5fa 100%)',
                boxShadow: '0 4px 14px 0 rgba(117, 81, 255, 0.4)',
              }}
            >
              <p className="text-sm font-semibold opacity-95">Data extracted from Vanuatu Courts Annual Reports</p>
              {lastUpdated && (
                <p className="text-xs opacity-80">Last updated: {formatLastUpdated(lastUpdated)}</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
