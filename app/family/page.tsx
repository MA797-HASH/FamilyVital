"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import FamilyClient from "./family-client"
import type { User } from "@/lib/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  padding: "2rem 1rem",
}

const containerStyle = {
  maxWidth: "980px",
  margin: "0 auto",
  padding: "0 0.75rem",
}

const heroStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "28px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
  padding: "2rem",
  marginBottom: "1.5rem",
}

const labelStyle = {
  margin: 0,
  color: "#2563eb",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontSize: "0.85rem",
  fontWeight: 700,
}

const titleStyle = {
  margin: "0.75rem 0 0",
  fontSize: "2.7rem",
  lineHeight: 1.05,
  fontWeight: 800,
  color: "#0f172a",
}

const subtitleStyle = {
  marginTop: "0.9rem",
  color: "#475569",
  fontSize: "1rem",
  lineHeight: 1.75,
  maxWidth: "760px",
}

export default function FamilyPage() {
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
    return <div style={pageStyle}>Chargement...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <p style={labelStyle}>Family hub</p>
          <h1 style={titleStyle}>{user.familyName}</h1>
          <p style={subtitleStyle}>
            Gérez les profils de votre famille avec un design moderne, des cartes visuelles et des interactions claires.
          </p>
        </div>

        <FamilyClient user={user} />
      </div>
    </div>
  )
}
