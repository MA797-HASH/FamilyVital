import { streamText, convertToModelMessages, type UIMessage } from "ai"
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
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6",
    system: `You are FamilyVital, a warm, encouraging family health coach. You help a household build healthier habits together.

Use the family's live data below to give specific, personalized, and actionable guidance. Reference members by name. Keep responses concise, friendly, and practical — suggest small wins the whole family can do together. Celebrate streaks and progress.

You are NOT a doctor. For anything that sounds like a medical concern, gently recommend consulting a healthcare professional. Never diagnose or prescribe.

${buildFamilyContext()}`,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
