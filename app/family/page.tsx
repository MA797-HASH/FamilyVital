import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { family } from "@/lib/data"
import { ArrowRight, Plus } from "lucide-react"

export default function FamilyPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">Family</h1>
            <p className="mt-1 text-muted-foreground">Manage each member&apos;s profile, focus, and health data.</p>
          </div>
          <Button size="lg" variant="secondary">
            <Plus className="size-5" />
            Add member
          </Button>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {family.map((m) => (
            <Link key={m.id} href={`/family/${m.id}`}>
              <Card className="flex flex-col gap-4 p-6 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14">
                    <AvatarFallback style={{ backgroundColor: m.avatarColor }} className="text-lg font-bold text-white">
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-heading text-lg font-bold text-foreground">{m.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {m.role} · {m.age} yrs
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {m.focus}
                </Badge>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Resting HR {m.vitals.restingHr} bpm</span>
                  <span className="flex items-center gap-1 font-medium text-primary">
                    View <ArrowRight className="size-4" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
