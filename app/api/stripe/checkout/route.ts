import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, userId } = body

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Email and userId are required" },
        { status: 400 }
      )
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "price_1QozO8D6s1NCBQ5CZjN5T0oL" // Fallback price ID for $9.99 CAD/month

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscribe?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscribe?canceled=true`,
      metadata: {
        userId,
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout URL" },
        { status: 500 }
      )
    }

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
