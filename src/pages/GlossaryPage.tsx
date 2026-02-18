import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppFooter } from '@/components/layout/AppFooter'
import { GLOSSARY } from '../glossary'

const terms = Object.keys(GLOSSARY).sort()

interface GlossaryPageProps {
  embedded?: boolean
}

export function GlossaryPage({ embedded }: GlossaryPageProps) {
  const content = (
    <>
      <p className="mb-6 text-muted-foreground">
        Plain-language definitions of terms used in the Vanuatu Courts dashboard.
      </p>
      <div className="space-y-4">
        {terms.map((term) => (
          <Card key={term} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#422AFB]/15">
                  <BookOpen className="size-5" style={{ color: '#422AFB' }} />
                </div>
                {term}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{GLOSSARY[term]}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )

  if (embedded) {
    return (
      <div className="mx-auto max-w-2xl">
        {content}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-2xl flex-1">
        <h1 className="mb-2 text-2xl font-bold" style={{ color: '#422AFB' }}>
          Glossary
        </h1>
        {content}
      </div>
      <AppFooter compact />
    </div>
  )
}
