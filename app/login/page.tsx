"use client"

import { useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  padding: "2rem 1rem",
  backgroundColor: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "480px",
  backgroundColor: "#ffffff",
  borderRadius: "28px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
}

const headerStyle: CSSProperties = {
  padding: "2rem 2rem 1.5rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
}

const headerTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "2rem",
  fontWeight: 800,
  color: "#111827",
}

const headerSubtitleStyle: CSSProperties = {
  margin: "0.75rem 0 0",
  color: "#64748b",
  fontSize: "1rem",
  lineHeight: 1.7,
}

const tabBarStyle: CSSProperties = {
  display: "flex",
  borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
}

const tabStyle: CSSProperties = {
  flex: 1,
  padding: "1rem 1.25rem",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "1rem",
  fontWeight: 700,
  color: "#64748b",
  transition: "all 0.2s ease",
}

const loginTabActiveStyle: CSSProperties = {
  color: "#111827",
  borderBottom: "3px solid #2563eb",
  backgroundColor: "#ffffff",
}

const signupTabActiveStyle: CSSProperties = {
  color: "#ffffff",
  borderBottom: "3px solid #1d4ed8",
  backgroundColor: "#2563eb",
  boxShadow: "0 10px 24px rgba(37, 99, 235, 0.24)",
}

const contentStyle: CSSProperties = {
  padding: "1.75rem 2rem 2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
}

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  color: "#475569",
  fontSize: "0.95rem",
  fontWeight: 700,
}

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: "1rem",
  border: "1px solid rgba(148, 163, 184, 0.3)",
  padding: "0.95rem 1rem",
  fontSize: "1rem",
  color: "#0f172a",
  backgroundColor: "#ffffff",
  outline: "none",
}

const buttonStyle: CSSProperties = {
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

const errorStyle: CSSProperties = {
  color: "#b91c1c",
  backgroundColor: "#fee2e2",
  borderRadius: "1rem",
  padding: "0.95rem 1rem",
  fontSize: "0.95rem",
}

const infoStyle: CSSProperties = {
  color: "#1d4ed8",
  backgroundColor: "#dbebff",
  borderRadius: "1rem",
  padding: "0.95rem 1rem",
  fontSize: "0.95rem",
}

const hintStyle: CSSProperties = {
  marginTop: "0.25rem",
  color: "#64748b",
  fontSize: "0.92rem",
}

const linkStyle: CSSProperties = {
  fontSize: "0.92rem",
  color: "#2563eb",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
}

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [familyName, setFamilyName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePasswordReset = async () => {
    setError(null)
    setInfo(null)

    if (!email) {
      setError("Please enter your email address to reset your password.")
      return
    }

    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setInfo("Password reset email sent. Check your inbox for instructions.")
  }

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
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      })

      const result = (await response.json().catch(() => ({}))) as { error?: string }
      setLoading(false)

      if (!response.ok || result.error) {
        setError(result.error || "Login failed. Please try again.")
        return
      }

      router.push("/dashboard")
      return
    }

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", email, password, familyName }),
    })

    const result = (await response.json().catch(() => ({}))) as { error?: string }
    setLoading(false)

    if (!response.ok || result.error) {
      setError(result.error || "Sign up failed. Please try again.")
      return
    }

    router.push("/dashboard")
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={headerTitleStyle}>FamilyVital</h1>
          <p style={headerSubtitleStyle}>
            {mode === "login"
              ? "Sign in to manage your family health dashboard."
              : "Create your free account in 30 seconds"}
          </p>
        </div>

        <div style={tabBarStyle}>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(null) }}
            style={{
              ...tabStyle,
              ...(mode === "login" ? loginTabActiveStyle : {}),
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null) }}
            style={{
              ...tabStyle,
              ...(mode === "signup" ? signupTabActiveStyle : {}),
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

          {info && <div style={infoStyle}>{info}</div>}

          {mode === "login" && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" style={linkStyle} onClick={handlePasswordReset} disabled={loading}>
                Forgot Password?
              </button>
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
