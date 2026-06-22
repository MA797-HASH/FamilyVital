import { NextResponse } from "next/server"
import { family, goals, reminders } from "@/lib/data"

export const maxDuration = 30

function buildFamilyContext() {
  const members = family
    .map(
      (m) =>
        `- ${m.name} (${m.role}, age ${m.age}). Focus: ${m.focus}. Today: ${m.metrics.steps.value}/${m.metrics.steps.goal} steps, ${m.metrics.sleep.value}/${m.metrics.sleep.goal}h sleep, ${m.metrics.water.value}/${m.metrics.water.goal} glasses water, ${m.metrics.activeMinutes.value} active min. Resting HR ${m.vitals.restingHr} bpm.`,
    )
    .join("\n")
  const goalLines = goals.map((g) => `- ${g.title} (${g.target}) — ${g.progress}% done, ${g.streak} day streak.`).join("\n")
  const reminderLines = reminders.map((r) => `- ${r.title} at ${r.time} (${r.done ? "done" : "pending"}).`).join("\n")
  return `FAMILY MEMBERS:\n${members}\n\nACTIVE GOALS:\n${goalLines}\n\nTODAY'S REMINDERS:\n${reminderLines}`
}

export async function POST(req: Request) {
  const { message }: { message: string } = await req.json()
  if (!message) {
    return NextResponse.json({ error: "Missing user message." }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Anthropic API key is not configured." }, { status: 500 })
  }

  const prompt = `You are FamilyVital, a warm, encouraging family health coach. You help a household build healthier habits together.

Use the family's live data below to give specific, personalized, and actionable guidance. Reference members by name. Keep responses concise, friendly, and practical — suggest small wins the whole family can do together. Celebrate streaks and progress.

You are NOT a doctor. For anything that sounds like a medical concern, gently recommend consulting a healthcare professional. Never diagnose or prescribe.

${buildFamilyContext()}`

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: prompt,
      messages: [
        { role: "user", content: message },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Anthropic error:", errorBody)
    return NextResponse.json({ error: "Anthropic request failed.", details: errorBody, body: errorBody }, { status: response.status })
  }

  const data = await response.json()
  const completion =
    typeof data.completion === "string"
      ? data.completion
      : data?.message?.content ?? data?.messages?.[0]?.content ?? ""

  return NextResponse.json({ completion })
}
