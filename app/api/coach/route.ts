import { NextResponse } from "next/server"

export const maxDuration = 30

export async function POST(req: Request) {
  const { message } = await req.json()
  
  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 })
  }

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
      system: "You are a family health coach. Give helpful, friendly advice about health, sleep, nutrition, and wellness.",
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
