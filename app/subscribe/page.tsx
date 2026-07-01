"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, Check } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SubscribePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        router.push("/login")
        return
      }
      setUser(userData.user)
    }
    checkAuth()
  }, [router])

  const handleSubscribe = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.email) {
        setError("User email not found")
        return
      }

      // Call backend API to create a Stripe Checkout session
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { checkoutUrl } = await response.json()

      // Redirect to Stripe Checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Subscription error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#f1f5f9", marginBottom: "8px" }}>
            Choose Your Plan
          </h1>
          <p style={{ fontSize: "16px", color: "#cbd5e1" }}>
            Compare the Free and Premium experience before you upgrade.
          </p>
        </div>

        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", borderRadius: "16px", border: "1px solid #334155", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", margin: 0 }}>Free</h2>
              <span style={{ backgroundColor: "#1d4ed8", color: "#eff6ff", borderRadius: "999px", padding: "0.35rem 0.7rem", fontSize: "0.8rem", fontWeight: 700 }}>Current</span>
            </div>
            <p style={{ color: "#cbd5e1", margin: "0 0 16px" }}>Great for getting started with the basics.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li style={{ color: "#e2e8f0" }}>• 1 family member</li>
              <li style={{ color: "#e2e8f0" }}>• 5 AI Coach messages/month</li>
              <li style={{ color: "#e2e8f0" }}>• Basic metrics only (steps and water)</li>
              <li style={{ color: "#e2e8f0" }}>• Limited reminders</li>
            </ul>
          </div>

          <div style={{ backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #3b82f6", padding: "24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, backgroundColor: "#3b82f6", color: "#ffffff", padding: "6px 16px", fontSize: "12px", fontWeight: "600", borderRadius: "0 12px 0 12px" }}>
              RECOMMENDED
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 8px" }}>Premium</h2>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "42px", fontWeight: "700", color: "#f1f5f9" }}>$9.99</span>
              <span style={{ fontSize: "15px", color: "#94a3b8", fontWeight: "500" }}>CAD/month</span>
            </div>
            <p style={{ color: "#cbd5e1", margin: "0 0 16px" }}>Unlock the full FamilyVital experience.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li style={{ color: "#e2e8f0" }}>• Unlimited family members</li>
              <li style={{ color: "#e2e8f0" }}>• Unlimited AI Coach</li>
              <li style={{ color: "#e2e8f0" }}>• All metrics and full history</li>
              <li style={{ color: "#e2e8f0" }}>• Unlimited reminders and advanced insights</li>
            </ul>
          </div>
        </div>

        <div style={{ backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #475569", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: "8px" }}>
              <Zap style={{ width: "24px", height: "24px", color: "#3b82f6" }} />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", margin: 0 }}>FamilyVital Premium</h2>
          </div>

          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              "Unlimited family members",
              "Unlimited AI Coach conversations",
              "All health metrics and full history",
              "Unlimited reminders and notifications",
              "Priority support",
            ].map((feature, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", backgroundColor: "rgba(34, 197, 94, 0.1)", borderRadius: "4px" }}>
                  <Check style={{ width: "16px", height: "16px", color: "#22c55e" }} />
                </div>
                <span style={{ fontSize: "14px", color: "#e2e8f0" }}>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: loading ? "#3b82f6" : "#3b82f6",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#2563eb"
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#3b82f6"
            }}
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </button>

          {error && (
            <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "14px" }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
