import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { ActivityChart } from "@/components/activity-chart"
import { MemberSnapshot } from "@/components/member-snapshot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { reminders, memberById, type FamilyMember } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"
import { Footprints, Moon, Droplet, HeartPulse, MessageCircleHeart, ArrowRight, Bell } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const familyMembers: FamilyMember[] = (user?.members ?? []).map((m) => ({
    id: m.id ?? m.name,
    name: m.name,
    role: m.role,
    age: m.age,
    avatarColor: m.avatar_color ?? "#888",
    initials: m.initials ?? m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    focus: m.focus,
    metrics: {
      steps: { value: 0, goal: 10000 },
      sleep: { value: 0, goal: 8 },
      water: { value: 0, goal: 8 },
      activeMinutes: { value: 0, goal: 60 },
    },
    vitals: {
      restingHr: m.resting_hr ?? 0,
      weeklyMood: 3,
    },
  }))
  const totalSteps = familyMembers.reduce((s, m) => s + m.metrics.steps.value, 0)
  const avgSleep = familyMembers.length ? (familyMembers.reduce((s, m) => s + m.metrics.sleep.value, 0) / familyMembers.length).toFixed(1) : "0.0"
  const totalWater = familyMembers.reduce((s, m) => s + m.metrics.water.value, 0)
  const avgHr = familyMembers.length ? Math.round(familyMembers.reduce((s, m) => s + m.vitals.restingHr, 0) / familyMembers.length) : 0
  const upcoming = reminders.filter((r) => !r.done).slice(0, 4)

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Good morning, {user?.familyName}</p>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance">
              Your family is thriving today
            </h1>
            <p className="mt-1 text-muted-foreground">Here&apos;s how everyone is doing across their health goals.</p>
          </div>
          <Button render={<Link href="/coach" />} size="lg">
            <MessageCircleHeart className="size-5" />
            Ask your coach
          </Button>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Footprints} label="Family steps today" value={totalSteps.toLocaleString()} accent="primary" />
          <StatCard icon={Moon} label="Avg sleep" value={avgSleep} unit="h" accent="chart-3" />
          <StatCard icon={Droplet} label="Glasses of water" value={totalWater} accent="chart-2" />
          <StatCard icon={HeartPulse} label="Avg resting HR" value={avgHr} unit="bpm" accent="chart-4" />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-heading">
                <Bell className="size-5 text-primary" />
                Up next
              </CardTitle>
              <Button render={<Link href="/reminders" />} variant="ghost" size="sm">
                All <ArrowRight className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {upcoming.map((r) => {
                const m = memberById(r.memberId)
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {m?.name.split(" ")[0]} · {r.time}
                      </p>
                    </div>
                    <Badge variant="secondary">{r.category}</Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground">Family snapshot</h2>
            <Button render={<Link href="/family" />} variant="ghost" size="sm">
              View profiles <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {familyMembers.map((m) => (
              <MemberSnapshot key={m.id} member={m} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
