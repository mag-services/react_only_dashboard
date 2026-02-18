import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'

const ROUTES = [
  'Overview',
  'Pending Cases',
  'Workload',
  'Performance',
  'Outcomes',
  'Other Metrics',
] as const

interface AppSidebarSheetProps {
  activeTab: number
  onTabChange: (tab: number) => void
  years: number[]
  selectedYears: number[]
  onYearsChange: (years: number[]) => void
  courts: readonly string[]
  selectedCourts: string[]
  onCourtsChange: (courts: string[]) => void
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
}: AppSidebarSheetProps) {
  const [open, setOpen] = useState(false)

  const rawMin = years.indexOf(selectedYears[0] ?? years[0] ?? 0)
  const rawMax = years.indexOf(selectedYears[selectedYears.length - 1] ?? years[years.length - 1] ?? 0)
  const yearMinIdx = years.length > 0 ? Math.max(0, rawMin >= 0 ? rawMin : 0) : 0
  const yearMaxIdx = years.length > 0 ? Math.min(years.length - 1, rawMax >= 0 ? rawMax : years.length - 1) : 0
  const sliderValue: [number, number] = [yearMinIdx, Math.max(yearMinIdx, yearMaxIdx)]
  const onSliderChange = (v: number[]) => {
    const [lo, hi] = [Math.min(v[0], v[1]), Math.max(v[0], v[1])]
    onYearsChange(years.slice(lo, hi + 1))
  }
  const toggleCourt = (court: string) => {
    const set = new Set(selectedCourts)
    if (set.has(court)) set.delete(court)
    else set.add(court)
    const next = [...set].filter((c) => courts.includes(c))
    onCourtsChange(next.length > 0 ? next : [])
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
            <Link
              to="/annual-reports"
              onClick={() => setOpen(false)}
              className="block w-full rounded-xl px-3 py-3 text-left text-sm font-medium transition-all hover:bg-muted/80"
            >
              Annual Reports (PDFs)
            </Link>
            <Separator className="my-5" />
            <div className="space-y-3">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Courts</p>
              <div className="flex flex-col gap-0.5">
                {courts.map((court) => (
                  <label
                    key={court}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"
                  >
                    <Checkbox
                      checked={selectedCourts.includes(court)}
                      onCheckedChange={() => toggleCourt(court)}
                    />
                    <span className="truncate">{court}</span>
                  </label>
                ))}
              </div>
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
              className="flex flex-col gap-3 rounded-2xl p-4 text-white"
              style={{
                background: 'linear-gradient(135deg, #7551ff 0%, #a78bfa 50%, #60a5fa 100%)',
                boxShadow: '0 4px 14px 0 rgba(117, 81, 255, 0.4)',
              }}
            >
              <p className="text-sm font-semibold opacity-95">Vanuatu Judiciary</p>
              <p className="text-xs opacity-80">Annual Reports Statistics</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
