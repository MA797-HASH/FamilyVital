import { NextResponse } from "next/server"

export const maxDuration = 30

function detectLanguage(message: string): "en" | "fr" {
  const normalized = message.toLowerCase()

  const frenchMarkers = [
    /\bbonjour\b/, /\bsalut\b/, /\bmerci\b/, /\bsvp\b/, /\bbonsoir\b/,
    /\bcomment\b/, /\bpeux\b/, /\bpeut\b/, /\bpourquoi\b/, /\bquand\b/,
    /\btrès\b/, /\bça\b/, /\bje\b/, /\btu\b/, /\bma\b/, /\bmon\b/,
    /[àâäçéèêëîïôöùûüÿæœ]/,
  ]

  if (frenchMarkers.some((pattern) => pattern.test(normalized))) {
    return "fr"
  }

  return "en"
}

export async function POST(req: Request) {
  const { message, plan, coachUsageCount } = await req.json()

  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 })
  }

  const normalizedPlan = plan === "premium" ? "premium" : "free"
  const usageCount = typeof coachUsageCount === "number" ? coachUsageCount : 0

  if (normalizedPlan !== "premium" && usageCount >= 5) {
    return NextResponse.json({ error: "Free plan includes 5 AI Coach messages per month. Upgrade to Premium for unlimited AI Coach access." }, { status: 403 })
  }

  const language = detectLanguage(message)
  const systemPrompt =
    language === "fr"
      ? "You are a family health coach. Give helpful, friendly advice about health, sleep, nutrition, and wellness. Always respond in French, matching the user's language."
      : "You are a family health coach. Give helpful, friendly advice about health, sleep, nutrition, and wellness. Always respond in English, matching the user's language."

  const apiKey = process.env.ANTHROPIC_API_KEY

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey!,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: message }]
    })
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: 500 })
  }

  const completion = data.content[0].text
  return NextResponse.json({ completion })
}
