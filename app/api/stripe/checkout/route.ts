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

    // Get the app URL from environment or request
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${req.headers.get("host")}` || "http://localhost:3000"

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "FamilyVital Premium",
            },
            unit_amount: 999,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: email,
      success_url: `${appUrl}/subscribe?success=true`,
      cancel_url: `${appUrl}/subscribe?canceled=true`,
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
