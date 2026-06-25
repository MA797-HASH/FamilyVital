"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { CSSProperties } from "react"
import { StatCard } from "@/components/stat-card"
import { ActivityChart } from "@/components/activity-chart"
import { MemberSnapshot } from "@/components/member-snapshot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type FamilyMember } from "@/lib/data"
import { createClient } from "@supabase/supabase-js"
import { Footprints, Moon, Droplet, HeartPulse, MessageCircleHeart, ArrowRight, Bell } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Reminder = {
  id: string
  title: string
  time: string
  category: string
  done: boolean
  created_at?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [familyName, setFamilyName] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [familyStreak, setFamilyStreak] = useState<number>(0)
  const [upcoming, setUpcoming] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  useEffect(() => {
    const init = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        router.push("/login")
        return
      }

      const email = userData.user.email || ""
      const authenticatedName =
        userData.user.user_metadata?.full_name ||
        (email.includes("@") ? email.split("@")[0] : email) ||
        ""
      setUserName(authenticatedName)

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

        const { data: remindersData, error: remindersError } = await supabase
          .from("reminders")
          .select("id,title,time,category,done")
          .order("created_at", { ascending: true })

        if (remindersError) {
          console.error("Erreur récupération des reminders:", remindersError)
          setUpcoming([])
        } else {
          const fetchedReminders = (remindersData || []) as Reminder[]
          setUpcoming(fetchedReminders.filter((r) => !r.done).slice(0, 4))
        }

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

    await loadData()
  }

  init()
}, [router])

  const totalSteps = familyMembers.reduce((s, m) => s + m.metrics.steps.value, 0)
  const avgSleep = familyMembers.length
    ? (familyMembers.reduce((s, m) => s + m.metrics.sleep.value, 0) / familyMembers.length).toFixed(1)
    : "0.0"
  const totalWater = familyMembers.reduce((s, m) => s + m.metrics.water.value, 0)
  const avgHr = familyMembers.length
    ? Math.round(familyMembers.reduce((s, m) => s + m.vitals.restingHr, 0) / familyMembers.length)
    : 0

  const pageStyle = {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "2rem 0",
  }

  const contentStyle = {
    width: "100%",
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "0 1rem",
  }

  const sectionCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    padding: "1.75rem",
  }

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginTop: "1.5rem",
  }

  const statCardBase: CSSProperties = {
    borderRadius: "24px",
    padding: "1.5rem",
    color: "#ffffff",
    minHeight: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
  }

  const statAccent = {
    steps: { background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)" },
    sleep: { background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" },
    water: { background: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)" },
    hr: { background: "linear-gradient(135deg, #ec4899 0%, #fb7185 100%)" },
  }

  const statLabelStyle = {
    opacity: 0.9,
    fontSize: "0.95rem",
    letterSpacing: "0.01em",
  }

  const statValueStyle = {
    fontSize: "2.5rem",
    fontWeight: 700,
    marginTop: "0.75rem",
    lineHeight: 1,
  }

  const statMetaStyle = {
    opacity: 0.88,
    fontSize: "0.95rem",
    marginTop: "1rem",
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            padding: "1rem 1.25rem",
            borderRadius: "24px",
            backgroundColor: "#ffffff",
            boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.55rem 0.95rem", borderRadius: "0.85rem", backgroundColor: "#eff6ff" }}>
              Dashboard
            </Link>
            <Link href="/family" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.55rem 0.95rem", borderRadius: "0.85rem", backgroundColor: "#eff6ff" }}>
              Family
            </Link>
            <Link href="/reminders" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.55rem 0.95rem", borderRadius: "0.85rem", backgroundColor: "#eff6ff" }}>
              Reminders
            </Link>
            <Link href="/metrics" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.55rem 0.95rem", borderRadius: "0.85rem", backgroundColor: "#eff6ff" }}>
              Métriques
            </Link>
            <Link href="/coach" style={{ color: "#111827", textDecoration: "none", fontWeight: 700, padding: "0.55rem 0.95rem", borderRadius: "0.85rem", backgroundColor: "#eff6ff" }}>
              AI Coach
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              color: "#111827",
              fontWeight: 700,
              padding: "0.55rem 0.95rem",
              borderRadius: "0.85rem",
              backgroundColor: "#f8fafc",
              border: "1px solid rgba(148, 163, 184, 0.24)",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <header style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <p style={{ color: "#2563eb", fontWeight: 700, marginBottom: "0.5rem" }}>
              Good morning, {userName || familyName || "Family"}
            </p>
            <h1 style={{ fontSize: "2.6rem", lineHeight: 1.05, fontWeight: 800, color: "#111827", margin: 0 }}>
              Your family is thriving today
            </h1>
            <p style={{ marginTop: "0.9rem", color: "#475569", fontSize: "1.05rem", maxWidth: "680px" }}>
              Here&apos;s how everyone is doing across their health goals.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <Button render={<Link href="/coach" />} size="lg">
              <MessageCircleHeart className="size-5" />
              Ask your coach
            </Button>
          </div>
        </header>

        <section style={statsGridStyle}>
          <div style={{ ...statCardBase, ...statAccent.steps }}>
            <div>
              <div style={statLabelStyle}>Family steps today</div>
              <div style={statValueStyle}>{totalSteps.toLocaleString()}</div>
            </div>
            <div style={statMetaStyle}>Goal: 10,000 steps</div>
          </div>

          <div style={{ ...statCardBase, ...statAccent.sleep }}>
            <div>
              <div style={statLabelStyle}>Avg sleep</div>
              <div style={statValueStyle}>{avgSleep}h</div>
            </div>
            <div style={statMetaStyle}>Target: 8 hours per night</div>
          </div>

          <div style={{ ...statCardBase, ...statAccent.water }}>
            <div>
              <div style={statLabelStyle}>Glasses of water</div>
              <div style={statValueStyle}>{totalWater}</div>
            </div>
            <div style={statMetaStyle}>Hydration goal: 8 glasses</div>
          </div>

          <div style={{ ...statCardBase, ...statAccent.hr }}>
            <div>
              <div style={statLabelStyle}>Avg resting HR</div>
              <div style={statValueStyle}>{avgHr} bpm</div>
            </div>
            <div style={statMetaStyle}>Family wellness score</div>
          </div>
        </section>

        <section style={{ marginTop: "1.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "1.7fr 1fr" }}>
          <div style={{ ...sectionCardStyle, minHeight: "430px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>Activity overview</h2>
                <p style={{ marginTop: "0.5rem", color: "#64748b", fontSize: "0.95rem" }}>Daily family movement and trends.</p>
              </div>
            </div>
            <ActivityChart />
          </div>

          <Card style={{ ...sectionCardStyle, padding: "1.5rem" }}>
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
              {upcoming.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    borderRadius: "18px",
                    padding: "1rem",
                    backgroundColor: "#f8fafc",
                    border: "1px solid rgba(148, 163, 184, 0.16)",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "#0f172a" }}>{r.title}</p>
                    <p style={{ marginTop: "0.4rem", color: "#64748b", fontSize: "0.9rem" }}>
                      {r.time}
                    </p>
                  </div>
                  <Badge variant="secondary">{r.category}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section style={{ marginTop: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#111827" }}>Family snapshot</h2>
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
    </div>
  )
}
