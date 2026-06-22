"use client"

import { useState, useRef, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Send, MessageCircleHeart } from "lucide-react"
import { cn } from "@/lib/utils"

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

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const busy = loading

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage(text: string) {
    const value = text.trim()
    if (!value || busy) return

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
      <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col px-4 md:h-screen md:px-8">
        <div className="flex items-center gap-3 border-b border-border py-4">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessageCircleHeart className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-heading text-lg font-bold text-foreground">FamilyVital Coach</h1>
            <p className="text-xs text-muted-foreground">Personalized guidance for the Rivera family</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto py-6">
          {messages.length === 0 ? (
            <Welcome onPick={submit} />
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role}>
                  {m.content}
                </Bubble>
              ))}
              {loading && (
                <Bubble role="assistant">
                  <span className="inline-flex gap-1">
                    <Dot /> <Dot /> <Dot />
                  </span>
                </Bubble>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="flex items-center gap-2 border-t border-border py-4"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your family health coach..."
            className="h-12 rounded-xl"
            aria-label="Message"
          />
          <Button type="submit" size="icon" className="size-12 shrink-0 rounded-xl" disabled={busy || !input.trim()}>
            <Send className="size-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </AppShell>
  )
}

function Welcome({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Leaf className="size-8" aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-foreground text-balance">
          Hi! I&apos;m your family health coach
        </h2>
        <p className="mt-1 max-w-md text-muted-foreground text-pretty">
          Ask me anything about your family&apos;s sleep, activity, nutrition, or habits. I know everyone&apos;s goals.
        </p>
      </div>
      <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-card p-3 text-left text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-muted/50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function Bubble({ role, children }: { role: string; children: React.ReactNode }) {
  const isUser = role === "user"
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  )
}

function Dot() {
  return <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.2s] first:[animation-delay:-0.3s]" />
}
