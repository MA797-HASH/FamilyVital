"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { AppShell } from "@/components/app-shell"
import type { User } from "@/lib/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateAuth = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/user")
      if (!response.ok) {
        router.push("/login")
        return
      }

      const userData = (await response.json()) as User
      setUser(userData)
      setLoading(false)
    }

    validateAuth()
  }, [router])

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-6">Loading dashboard...</div>
  }

  if (!user) {
    return null
  }

  return (
    <AppShell streak={7}>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Welcome back</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{user.familyName || "Your family"}</h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              Your family dashboard is ready. Use the navigation to review activity, reminders, and coaching insights.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
