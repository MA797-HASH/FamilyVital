"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/js"
import { Zap, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
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

      // Call your backend API to create a Stripe Checkout session
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      if (!stripe) {
        throw new Error("Failed to load Stripe")
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        setError(stripeError.message)
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
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#f1f5f9",
              marginBottom: "8px",
            }}
          >
            Choose Your Plan
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#cbd5e1",
            }}
          >
            Upgrade to FamilyVital Premium and unlock advanced features
          </p>
        </div>

        {/* Premium Plan Card */}
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            border: "1px solid #475569",
            padding: "32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Badge */}
          <div
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              padding: "6px 16px",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "0 12px 0 12px",
            }}
          >
            RECOMMENDED
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Zap style={{ width: "24px", height: "24px", color: "#3b82f6" }} />
            </div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#f1f5f9",
              }}
            >
              FamilyVital Premium
            </h2>
          </div>

          {/* Pricing */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "48px",
                  fontWeight: "700",
                  color: "#f1f5f9",
                }}
              >
                $9.99
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#94a3b8",
                  fontWeight: "500",
                }}
              >
                CAD/month
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#cbd5e1",
              }}
            >
              Cancel anytime. Billing cycles renew automatically.
            </p>
          </div>

          {/* Features List */}
          <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "Advanced health metrics tracking",
              "Personalized AI coaching",
              "Family goal collaboration",
              "Activity history & insights",
              "Unlimited reminders & notifications",
              "Priority support",
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    borderRadius: "4px",
                  }}
                >
                  <Check style={{ width: "16px", height: "16px", color: "#22c55e" }} />
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#e2e8f0",
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
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

          {/* Error Message */}
          {error && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderRadius: "6px",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Free Plan Info */}
        <div
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            borderRadius: "12px",
            border: "1px solid #334155",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#cbd5e1",
              marginBottom: "8px",
            }}
          >
            You're currently on the
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#f1f5f9",
            }}
          >
            FamilyVital Free Plan
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            Limited features. Upgrade to unlock the full potential of FamilyVital.
          </p>
        </div>
      </div>
    </div>
  )
}
