"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { StatCard } from "@/components/stat-card"
import { ActivityChart } from "@/components/activity-chart"
import { MemberSnapshot } from "@/components/member-snapshot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { reminders, memberById, type FamilyMember } from "@/lib/data"
import { createClient } from "@supabase/supabase-js"
import { Footprints, Moon, Droplet, HeartPulse, MessageCircleHeart, ArrowRight, Bell } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const [familyName, setFamilyName] = useState<string>("")
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [familyStreak, setFamilyStreak] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await fetch("/api/user")
        if (!userRes.ok) {
          setLoading(false)
          return
        }

        const userData = await userRes.json()
        const members = userData.members || []
        setFamilyName(userData.familyName || "")

        const memberIds = members.map((m: any) => m.id).filter(Boolean)
        const today = new Date()
        const todayString = today.toISOString().slice(0, 10)

        const streakStart = new Date(today)
        streakStart.setDate(today.getDate() - 30)
        const streakStartString = streakStart.toISOString().slice(0, 10)

        let todayMetrics: any[] = []
        let streakMetrics: any[] = []

        if (memberIds.length > 0) {
          const { data: todayData, error: todayError } = await supabase
            .from("health_metrics")
            .select("family_member_id, steps, sleep_hours, water_glasses, date")
            .in("family_member_id", memberIds)
            .eq("date", todayString)

          if (todayError) {
            console.error("Erreur récupération metrics du jour:", todayError)
          } else {
            todayMetrics = todayData || []
          }

          const { data: streakData, error: streakError } = await supabase
            .from("health_metrics")
            .select("date")
            .in("family_member_id", memberIds)
            .gte("date", streakStartString)
            .order("date", { ascending: false })

          if (streakError) {
            console.error("Erreur récupération du streak:", streakError)
          } else {
            streakMetrics = streakData || []
          }
        }

        const streakDates = new Set(streakMetrics.map((row: any) => String(row.date)))
        let streakCount = 0
        for (let i = 0; i < 30; i++) {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          const dateKey = date.toISOString().slice(0, 10)
          if (streakDates.has(dateKey)) {
            streakCount += 1
          } else {
            break
          }
        }

        const metricsByMemberId = new Map<string, { steps: number; sleep_hours: number; water_glasses: number }>()
        todayMetrics.forEach((row: any) => {
          if (row.family_member_id) {
            metricsByMemberId.set(String(row.family_member_id), {
              steps: row.steps ?? 0,
              sleep_hours: row.sleep_hours ?? 0,
              water_glasses: row.water_glasses ?? 0,
            })
          }
        })

        const enrichedMembers: FamilyMember[] = members.map((m: any) => {
          const metrics = metricsByMemberId.get(String(m.id))
          return {
            id: String(m.id),
            name: m.name,
            role: m.role,
            age: m.age,
            avatarColor: m.avatar_color ?? "#888",
            initials: m.initials ?? m.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
            focus: m.focus,
            metrics: {
              steps: { value: metrics?.steps ?? 0, goal: 10000 },
              sleep: { value: metrics?.sleep_hours ?? 0, goal: 8 },
              water: { value: metrics?.water_glasses ?? 0, goal: 8 },
              activeMinutes: { value: 0, goal: 60 },
            },
            vitals: {
              restingHr: m.resting_hr ?? 0,
              weeklyMood: 3,
            },
          }
        })

        setFamilyMembers(enrichedMembers)
        setFamilyStreak(streakCount)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const totalSteps = familyMembers.reduce((s, m) => s + m.metrics.steps.value, 0)
  const avgSleep = familyMembers.length
    ? (familyMembers.reduce((s, m) => s + m.metrics.sleep.value, 0) / familyMembers.length).toFixed(1)
    : "0.0"
  const totalWater = familyMembers.reduce((s, m) => s + m.metrics.water.value, 0)
  const avgHr = familyMembers.length
    ? Math.round(familyMembers.reduce((s, m) => s + m.vitals.restingHr, 0) / familyMembers.length)
    : 0
  const upcoming = reminders.filter((r) => !r.done).slice(0, 4)

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.5rem 0.75rem", borderRadius: "0.75rem" }}>
            Dashboard
          </Link>
          <Link href="/family" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.5rem 0.75rem", borderRadius: "0.75rem" }}>
            Family
          </Link>
          <Link href="/reminders" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.5rem 0.75rem", borderRadius: "0.75rem" }}>
            Reminders
          </Link>
          <Link href="/metrics" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.5rem 0.75rem", borderRadius: "0.75rem" }}>
            Métriques
          </Link>
          <Link href="/coach" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.5rem 0.75rem", borderRadius: "0.75rem" }}>
            AI Coach
          </Link>
        </div>
      </div>
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Good morning, {familyName}</p>
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
  )
}
