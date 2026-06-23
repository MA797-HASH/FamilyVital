import Link from "next/link"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { createClient } from "@supabase/supabase-js"

export function generateStaticParams() {
  return []
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch member info from Supabase
  const { data: memberRow, error: memberError } = await supabase
    .from("family_members")
    .select("id,name,role,age,initials,avatar_color,focus,resting_hr")
    .eq("id", id)
    .single()

  if (memberError || !memberRow) {
    console.error("Erreur récupération membre:", memberError)
    notFound()
  }

  // Fetch last 7 days of health_metrics for this member
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)
  const fromDate = sevenDaysAgo.toISOString().slice(0, 10)

  const { data: metricsData, error: metricsError } = await supabase
    .from("health_metrics")
    .select("date, steps, sleep_hours, water_glasses")
    .eq("family_member_id", id)
    .gte("date", fromDate)
    .order("date", { ascending: true })

  if (metricsError) console.error("Erreur récupération metrics:", metricsError)

  // Build an array of last 7 days with defaults
  const days: { date: string; steps: number; sleep_hours: number; water_glasses: number }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(sevenDaysAgo.getDate() + i)
    days.push({ date: d.toISOString().slice(0, 10), steps: 0, sleep_hours: 0, water_glasses: 0 })
  }

  ;(metricsData ?? []).forEach((row: any) => {
    const idx = days.findIndex((d) => d.date === String(row.date))
    if (idx >= 0) {
      days[idx] = {
        date: days[idx].date,
        steps: row.steps ?? 0,
        sleep_hours: row.sleep_hours ?? 0,
        water_glasses: row.water_glasses ?? 0,
      }
    }
  })

  // Summary metrics
  const totalSteps = days.reduce((s, d) => s + d.steps, 0)
  const avgSleep = days.length ? +(days.reduce((s, d) => s + d.sleep_hours, 0) / days.length).toFixed(1) : 0
  const totalWater = days.reduce((s, d) => s + d.water_glasses, 0)

  return (
    <AppShell>
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <Link href="/family" style={{ color: "#2563eb", textDecoration: "none" }}>&larr; Back to family</Link>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center", background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
          <div style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: memberRow.avatar_color || "#888", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 28 }}>
            {memberRow.initials || (memberRow.name || "").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{memberRow.name}</h1>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>{memberRow.role} · {memberRow.age ?? "-"} years old</p>
            <div style={{ marginTop: 8, display: "inline-block", background: "#f3f4f6", padding: "6px 10px", borderRadius: 8, color: "#374151", fontWeight: 600 }}>{memberRow.focus}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Last 7 days</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{totalSteps.toLocaleString()} steps</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 6 }}>{avgSleep} h avg · {totalWater} glasses</div>
          </div>
        </div>

        <section style={{ marginTop: 20, background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent metrics</h2>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Date</div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Steps</div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Sleep (h)</div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Water</div>
          </div>

          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {days.map((d) => (
              <div key={d.date} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, alignItems: "center", padding: "10px 0", borderTop: "1px solid #f3f4f6" }}>
                <div style={{ color: "#374151", fontWeight: 600 }}>{d.date}</div>
                <div style={{ color: "#111827" }}>{d.steps.toLocaleString()}</div>
                <div style={{ color: "#111827" }}>{d.sleep_hours}</div>
                <div style={{ color: "#111827" }}>{d.water_glasses}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
