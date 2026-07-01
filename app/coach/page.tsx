"use client"

import { useState, useRef, useEffect, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Send, MessageCircleHeart } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { canUseCoach, getCoachUsage, getFreeCoachLimit, getStoredPlan, recordCoachMessage, type Plan } from "@/lib/freemium"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const suggestions = [
  "How can our family sleep better?",
  "Suggest a fun weekend activity for everyone",
  "Diego's water intake is low — any tips?",
  "Give Sofia ideas to cut screen time",
]

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

const pageContainerStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: "2rem 1rem",
  backgroundColor: "#f8fafc",
  display: "flex",
  justifyContent: "center",
}

const pageCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "960px",
  backgroundColor: "#ffffff",
  borderRadius: "28px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 4rem)",
  overflow: "hidden",
}

const headerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1.75rem 1.75rem 1.5rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
}

const headerIconStyle = {
  width: "3rem",
  height: "3rem",
  borderRadius: "1rem",
  display: "grid",
  placeItems: "center",
  backgroundColor: "#eff6ff",
  color: "#2563eb",
}

const headerTitleStyle = {
  margin: 0,
  fontSize: "1.5rem",
  fontWeight: 800,
  color: "#111827",
}

const headerSubtitleStyle = {
  margin: 0,
  marginTop: "0.35rem",
  color: "#64748b",
  fontSize: "0.95rem",
}

const contentStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}

const messagesStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
}

const formStyle = {
  display: "flex",
  gap: "0.75rem",
  alignItems: "center",
  padding: "1.25rem 1.5rem 1.5rem",
  borderTop: "1px solid rgba(148, 163, 184, 0.18)",
  backgroundColor: "#f8fafc",
}

const inputStyle = {
  flex: 1,
  minWidth: 0,
  borderRadius: "1rem",
  border: "1px solid rgba(148, 163, 184, 0.3)",
  padding: "0.95rem 1rem",
  fontSize: "0.96rem",
  color: "#0f172a",
  backgroundColor: "#ffffff",
}

const buttonStyle = {
  borderRadius: "1rem",
  minWidth: "3rem",
  padding: "0.95rem 1rem",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
}

const welcomeCardStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: "1.25rem",
  height: "100%",
  padding: "2rem 1.5rem",
}

const suggestionGridStyle = {
  width: "100%",
  display: "grid",
  gap: "0.75rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
}

const suggestionStyle = {
  borderRadius: "1rem",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  backgroundColor: "#f8fafc",
  padding: "1rem 1rem",
  textAlign: "left" as const,
  fontSize: "0.95rem",
  color: "#0f172a",
  cursor: "pointer",
}

const bubbleContainerStyle = {
  display: "flex",
}

const bubbleBaseStyle = {
  maxWidth: "82%",
  padding: "1rem 1.2rem",
  borderRadius: "24px",
  fontSize: "0.95rem",
  lineHeight: 1.65,
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  whiteSpace: "pre-wrap" as const,
}

const userBubbleStyle = {
  ...bubbleBaseStyle,
  alignSelf: "flex-end",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  borderRadius: "24px 24px 12px 24px",
}

const assistantBubbleStyle = {
  ...bubbleBaseStyle,
  alignSelf: "flex-start",
  backgroundColor: "#f1f5f9",
  color: "#0f172a",
  borderRadius: "24px 24px 24px 12px",
}

const typingStyle = {
  display: "inline-flex",
  gap: "0.5rem",
}

const dotStyle = {
  width: "0.6rem",
  height: "0.6rem",
  borderRadius: "999px",
  backgroundColor: "rgba(15, 23, 42, 0.4)",
  animation: "pulseDot 1s infinite ease-in-out",
}

export default function CoachPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<Plan>("free")
  const [coachUsage, setCoachUsage] = useState(0)
  const [upgradeMessage, setUpgradeMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const busy = loading

  useEffect(() => {
    const validateAuth = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push("/login")
      }
    }
    validateAuth()
  }, [router])

  useEffect(() => {
    const currentPlan = getStoredPlan()
    setPlan(currentPlan)
    setCoachUsage(getCoachUsage().count)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage(text: string) {
    const value = text.trim()
    if (!value || busy) return

    const currentUsage = getCoachUsage()
    if (!canUseCoach(plan, currentUsage.count)) {
      setUpgradeMessage(`Free plan includes ${getFreeCoachLimit()} AI Coach messages per month. Upgrade to Premium for unlimited AI Coach access.`)
      return
    }

    setUpgradeMessage("")
    const nextUsage = recordCoachMessage()
    setCoachUsage(nextUsage.count)

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: value,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value }),
      })

      const data = await response.json()
      const assistantContent = typeof data.completion === "string" ? data.completion : "Sorry, I couldn't get a response."
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: assistantContent,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, something went wrong while contacting the coach.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage(value)
  }

  return (
    <AppShell>
      <div style={pageContainerStyle}>
        <div style={pageCardStyle}>
          <div style={headerStyle}>
            <div style={headerIconStyle}>
              <MessageCircleHeart style={{ width: "1.2rem", height: "1.2rem" }} aria-hidden="true" />
            </div>
            <div>
              <h1 style={headerTitleStyle}>FamilyVital Coach</h1>
              <p style={headerSubtitleStyle}>Personalized guidance for the Rivera family</p>
            </div>
          </div>

          <div style={contentStyle}>
            <div ref={scrollRef} style={messagesStyle}>
              {messages.length === 0 ? (
                <Welcome onPick={submit} />
              ) : (
                <>
                  {messages.map((m) => (
                    <Bubble key={m.id} role={m.role}>
                      {m.content}
                    </Bubble>
                  ))}
                  {loading && (
                    <Bubble role="assistant">
                      <span style={typingStyle}>
                        <Dot />
                        <Dot />
                        <Dot />
                      </span>
                    </Bubble>
                  )}
                </>
              )}
            </div>

            {upgradeMessage ? (
              <div style={{ margin: "0 1.5rem 1rem", borderRadius: "1rem", border: "1px solid #fde68a", backgroundColor: "#fffbeb", padding: "0.9rem 1rem", color: "#92400e", fontWeight: 600 }}>
                {upgradeMessage}
                <div style={{ marginTop: "0.5rem" }}>
                  <a href="/subscribe" style={{ color: "#b45309", textDecoration: "underline", fontWeight: 700 }}>
                    Upgrade to Premium
                  </a>
                </div>
              </div>
            ) : null}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(input)
              }}
              style={formStyle}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your family health coach..."
                aria-label="Message"
                style={inputStyle}
              />
              <Button type="submit" disabled={busy || !input.trim()} style={buttonStyle}>
                <Send style={{ width: "1.15rem", height: "1.15rem" }} />
              </Button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </AppShell>
  )
}

function Welcome({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div style={welcomeCardStyle}>
      <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "1.25rem", display: "grid", placeItems: "center", backgroundColor: "#eff6ff", color: "#2563eb" }}>
        <Leaf style={{ width: "1.5rem", height: "1.5rem" }} aria-hidden="true" />
      </div>
      <div>
        <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "#111827" }}>Hi! I'm your family health coach</h2>
        <p style={{ marginTop: "0.75rem", color: "#64748b", fontSize: "1rem", maxWidth: "40rem", lineHeight: 1.7 }}>
          Ask me anything about your family's sleep, activity, nutrition, or habits. I know everyone's goals.
        </p>
      </div>
      <div style={suggestionGridStyle}>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            style={suggestionStyle}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function renderMarkdown(text: string) {
  const headingStyle = {
    margin: "0 0 0.75rem 0",
    color: "#0f172a",
    fontSize: "1.05rem",
    fontWeight: 700,
  }

  const paragraphStyle = {
    margin: "0 0 0.75rem 0",
    color: "#0f172a",
    fontSize: "0.95rem",
    lineHeight: 1.75,
  }

  const parts = text.split("\n").map((line, index) => {
    if (line.startsWith("### ")) {
      return (
        <h3 key={index} style={{ ...headingStyle, fontSize: "0.98rem", marginTop: "1rem" }}>
          {renderInline(line.slice(4))}
        </h3>
      )
    }

    if (line.startsWith("## ")) {
      return (
        <h2 key={index} style={headingStyle}>
          {renderInline(line.slice(3))}
        </h2>
      )
    }

    if (line.startsWith("# ")) {
      return (
        <h2 key={index} style={{ ...headingStyle, fontSize: "1.2rem" }}>
          {renderInline(line.slice(2))}
        </h2>
      )
    }

    return (
      <p key={index} style={paragraphStyle}>
        {renderInline(line)}
      </p>
    )
  })

  return parts
}

function renderInline(line: string) {
  const tokens = line.split(/(\*\*[^*]+\*\*)/g)
  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={idx} style={{ fontWeight: 700 }}>
          {token.slice(2, -2)}
        </strong>
      )
    }
    return token
  })
}

function Bubble({ role, children }: { role: string; children: React.ReactNode }) {
  const isUser = role === "user"
  const content = typeof children === "string" && role === "assistant" ? renderMarkdown(children) : children

  return (
    <div style={{ ...bubbleContainerStyle, justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div style={isUser ? userBubbleStyle : assistantBubbleStyle}>{content}</div>
    </div>
  )
}

function Dot() {
  return <span style={dotStyle} />
}
