import Link from "next/link"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { family, goals, reminders, memberById } from "@/lib/data"
import { Footprints, Moon, Droplet, Timer, HeartPulse, Smile, ArrowLeft, MessageCircleHeart } from "lucide-react"

export function generateStaticParams() {
  return family.map((m) => ({ id: m.id }))
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = memberById(id)
  if (!member) notFound()

  const memberGoals = goals.filter((g) => g.memberId === id)
  const memberReminders = reminders.filter((r) => r.memberId === id)
  const moods = ["", "Rough", "Low", "Okay", "Good", "Great"]

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
        <Button render={<Link href="/family" />} variant="ghost" size="sm" className="mb-4 -ml-2">
          <ArrowLeft className="size-4" />
          Back to family
        </Button>

        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback style={{ backgroundColor: member.avatarColor }} className="text-xl font-bold text-white">
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-foreground">{member.name}</h1>
              <p className="text-sm text-muted-foreground">
                {member.role} · {member.age} years old
              </p>
              <Badge variant="secondary" className="mt-2">
                {member.focus}
              </Badge>
            </div>
          </div>
          <Button render={<Link href="/coach" />}>
            <MessageCircleHeart className="size-5" />
            Coach for {member.name.split(" ")[0]}
          </Button>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Footprints} label="Steps" value={member.metrics.steps.value.toLocaleString()} goal={member.metrics.steps.goal.toLocaleString()} accent="primary" />
          <StatCard icon={Moon} label="Sleep" value={member.metrics.sleep.value} unit="h" goal={String(member.metrics.sleep.goal)} goalUnit="h" accent="chart-3" />
          <StatCard icon={Droplet} label="Water" value={member.metrics.water.value} goal={String(member.metrics.water.goal)} goalUnit="glasses" accent="chart-2" />
          <StatCard icon={Timer} label="Active min" value={member.metrics.activeMinutes.value} goal={String(member.metrics.activeMinutes.goal)} accent="chart-4" />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Goals</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {memberGoals.length === 0 && <p className="text-sm text-muted-foreground">No goals set yet.</p>}
              {memberGoals.map((g) => (
                <div key={g.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{g.title}</p>
                    <span className="text-xs font-medium text-primary">{g.streak} day streak</span>
                  </div>
                  <Progress value={g.progress} className="h-2.5" />
                  <p className="text-xs text-muted-foreground">{g.target}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Vitals</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <HeartPulse className="size-5 text-[oklch(0.55_0.15_30)]" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted-foreground">Resting HR</p>
                    <p className="font-heading text-lg font-bold">{member.vitals.restingHr} bpm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Smile className="size-5 text-[oklch(0.6_0.13_80)]" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted-foreground">Weekly mood</p>
                    <p className="font-heading text-lg font-bold">{moods[member.vitals.weeklyMood]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Reminders</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {memberReminders.length === 0 && <p className="text-sm text-muted-foreground">No reminders.</p>}
                {memberReminders.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.time} · {r.repeat}</p>
                    </div>
                    <Badge variant={r.done ? "secondary" : "default"}>{r.done ? "Done" : r.category}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
