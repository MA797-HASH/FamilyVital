"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: "2rem 1rem",
  backgroundColor: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const cardStyle = {
  width: "100%",
  maxWidth: "480px",
  backgroundColor: "#ffffff",
  borderRadius: "28px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
}

const headerStyle = {
  padding: "2rem 2rem 1.5rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
}

const headerTitleStyle = {
  margin: 0,
  fontSize: "2rem",
  fontWeight: 800,
  color: "#111827",
}

const headerSubtitleStyle = {
  margin: "0.75rem 0 0",
  color: "#64748b",
  fontSize: "1rem",
  lineHeight: 1.7,
}

const tabBarStyle = {
  display: "flex",
  borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
}

const tabStyle = {
  flex: 1,
  padding: "1rem 1.25rem",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "1rem",
  fontWeight: 700,
  color: "#64748b",
}

const tabActiveStyle = {
  color: "#111827",
  borderBottom: "3px solid #2563eb",
  backgroundColor: "#ffffff",
}

const contentStyle = {
  padding: "1.75rem 2rem 2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
}

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  color: "#475569",
  fontSize: "0.95rem",
  fontWeight: 700,
}

const inputStyle = {
  width: "100%",
  borderRadius: "1rem",
  border: "1px solid rgba(148, 163, 184, 0.3)",
  padding: "0.95rem 1rem",
  fontSize: "1rem",
  color: "#0f172a",
  backgroundColor: "#ffffff",
  outline: "none",
}

const buttonStyle = {
  width: "100%",
  borderRadius: "1rem",
  border: "none",
  padding: "1rem 1.1rem",
  fontSize: "1rem",
  fontWeight: 700,
  color: "#ffffff",
  backgroundColor: "#2563eb",
  cursor: "pointer",
}

const errorStyle = {
  color: "#b91c1c",
  backgroundColor: "#fee2e2",
  borderRadius: "1rem",
  padding: "0.95rem 1rem",
  fontSize: "0.95rem",
}

const hintStyle = {
  marginTop: "0.25rem",
  color: "#64748b",
  fontSize: "0.92rem",
}

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [familyName, setFamilyName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!email || !password || (mode === "signup" && (!familyName || !confirmPw))) {
      setError("Please fill in all required fields.")
      return
    }

    if (mode === "signup" && password !== confirmPw) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setLoading(false)
      if (authError) {
        setError(authError.message)
        return
      }

      router.push("/")
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)
    if (signUpError) {
      setError(signUpError.message)
      return
    }

    router.push("/")
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={headerTitleStyle}>FamilyVital</h1>
          <p style={headerSubtitleStyle}>
            {mode === "login"
              ? "Sign in to manage your family health dashboard."
              : "Create a new account so your family can stay on track."}
          </p>
        </div>

        <div style={tabBarStyle}>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(null) }}
            style={{
              ...tabStyle,
              ...(mode === "login" ? tabActiveStyle : {}),
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null) }}
            style={{
              ...tabStyle,
              ...(mode === "signup" ? tabActiveStyle : {}),
            }}
          >
            Sign Up
          </button>
        </div>

        <form style={contentStyle} onSubmit={handle}>
          {error && <div style={errorStyle}>{error}</div>}

          <div>
            <label style={labelStyle} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label style={labelStyle} htmlFor="familyName">
                Family name
              </label>
              <input
                id="familyName"
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                style={inputStyle}
                placeholder="Rivera Family"
                autoComplete="organization"
              />
            </div>
          )}

          <div>
            <label style={labelStyle} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label style={labelStyle} htmlFor="confirmPw">
                Confirm password
              </label>
              <input
                id="confirmPw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>
              {mode === "login" ? "Welcome back!" : "Secure your family dashboard."}
            </p>
            <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
