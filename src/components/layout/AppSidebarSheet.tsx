import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
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

  const toggleYear = (y: number) => {
    const set = new Set(selectedYears)
    if (set.has(y)) set.delete(y)
    else set.add(y)
    onYearsChange([...set].sort((a, b) => a - b))
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between gap-2 border-border/60 bg-muted/30 font-medium"
                  >
                    {selectedYears.length ? selectedYears.sort((a, b) => a - b).join(', ') : 'Select years'}
                    <ChevronDownIcon className="size-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="flex flex-col gap-0.5">
                    {years.map((y) => (
                      <label
                        key={y}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"
                      >
                        <Checkbox
                          checked={selectedYears.includes(y)}
                          onCheckedChange={() => toggleYear(y)}
                        />
                        {y}
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
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
