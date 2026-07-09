"use client"

import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowRight, BarChart3, HeartPulse, Sparkles } from "lucide-react"

const features = [
  {
    title: "Track Everything",
    description: "Steps, sleep, water, and nutrition for the whole family in one calm place.",
    icon: <BarChart3 size={24} />,
  },
  {
    title: "AI Health Coach",
    description: "Get personalized health advice instantly, whenever your family needs it.",
    icon: <Sparkles size={24} />,
  },
  {
    title: "Family Dashboard",
    description: "See everyone’s progress at a glance and celebrate healthy habits together.",
    icon: <HeartPulse size={24} />,
  },
]

const plans = [
  {
    name: "Free",
    price: "$0 / month",
    description: "For one family member",
    perks: ["Daily health tracking", "Basic family overview"],
    featured: false,
  },
  {
    name: "Premium",
    price: "$9.99 CAD/month",
    description: "Unlimited members",
    perks: ["Unlimited family members", "AI coach access", "Advanced insights"],
    featured: true,
  },
]

const testimonials = [
  {
    name: "Sarah M.",
    quote: "This app completely changed how I manage my family's health. I can see everyone's progress in one place!",
  },
  {
    name: "James T.",
    quote: "The AI Health Coach is incredible. It gives personalized advice for each family member.",
  },
  {
    name: "Emma R.",
    quote: "Finally an app that helps me keep track of my whole family's wellness. Worth every penny!",
  },
]

const faqs = [
  {
    question: "Is it really free?",
    answer: "Yes, the free plan includes 1 family member with full health tracking.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, your data is encrypted and never shared.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, no contracts, cancel anytime.",
  },
]

export default function LandingPage() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main style={pageStyle}>
      <div style={heroShellStyle}>
        <nav style={navStyle}>
          <div style={brandStyle}>
            <div style={brandIconStyle}>❤</div>
            <span>FamilyVital</span>
          </div>
          <Link href="/login" style={navLinkStyle}>
            Login
          </Link>
        </nav>

        <section style={heroSectionStyle}>
          <div style={heroContentStyle}>
            <div style={pillStyle}>Healthy habits, beautifully connected</div>
            <h1 style={headlineStyle}>Your Family&apos;s Health. One Place.</h1>
            <p style={subheadlineStyle}>
              Track sleep, water, steps, and nutrition for every member of your family — with an AI Health Coach available 24/7.
            </p>
            <div style={buttonRowStyle}>
              <Link href="/login" style={primaryButtonStyle}>
                Start Free
                <ArrowRight size={18} />
              </Link>
              <button type="button" onClick={scrollToFeatures} style={secondaryButtonStyle}>
                Learn More
              </button>
            </div>
            <div style={trustRowStyle}>
              <span style={trustBubbleStyle}>Sleep</span>
              <span style={trustBubbleStyle}>Hydration</span>
              <span style={trustBubbleStyle}>Nutrition</span>
            </div>
          </div>

          <div style={heroCardStyle}>
            <div style={heroCardTopStyle}>
              <div style={heroCardBadgeStyle}>Family Score</div>
              <div style={heroCardValueStyle}>94%</div>
            </div>
            <div style={heroCardGridStyle}>
              <div style={heroMetricStyle}>
                <span style={heroMetricLabelStyle}>Steps</span>
                <strong>82,400</strong>
              </div>
              <div style={heroMetricStyle}>
                <span style={heroMetricLabelStyle}>Sleep</span>
                <strong>7.8h</strong>
              </div>
              <div style={heroMetricStyle}>
                <span style={heroMetricLabelStyle}>Water</span>
                <strong>24 cups</strong>
              </div>
              <div style={heroMetricStyle}>
                <span style={heroMetricLabelStyle}>Coach</span>
                <strong>Online</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="features" style={sectionStyle}>
        <div style={sectionHeadingStyle}>
          <p style={eyebrowStyle}>Features</p>
          <h2 style={sectionTitleStyle}>Everything your family needs to feel their best.</h2>
        </div>
        <div style={cardGridStyle}>
          {features.map((feature) => (
            <article key={feature.title} style={featureCardStyle}>
              <div style={featureIconStyle}>{feature.icon}</div>
              <h3 style={featureTitleStyle}>{feature.title}</h3>
              <p style={featureTextStyle}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={pricingCardStyle}>
          <div style={pricingTextStyle}>
            <p style={eyebrowStyle}>Pricing</p>
            <h2 style={sectionTitleStyle}>Simple plans for every family.</h2>
            <p style={featureTextStyle}>
              Start free and grow with your family’s health goals.
            </p>
          </div>
          <div style={planGridStyle}>
            {plans.map((plan) => (
              <div key={plan.name} style={{ ...planCardStyle, ...(plan.featured ? featuredPlanStyle : {}) }}>
                <div style={planHeaderStyle}>
                  <h3 style={planTitleStyle}>{plan.name}</h3>
                  {plan.featured ? <span style={featuredBadgeStyle}>Most Popular</span> : null}
                </div>
                <div style={priceStyle}>{plan.price}</div>
                <p style={planDescriptionStyle}>{plan.description}</p>
                <ul style={planListStyle}>
                  {plan.perks.map((perk) => (
                    <li key={perk} style={planListItemStyle}>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link href="/login" style={planButtonStyle(plan.featured)}>
                  {plan.featured ? "Get Premium" : "Start Free"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeadingStyle}>
          <p style={eyebrowStyle}>Testimonials</p>
          <h2 style={sectionTitleStyle}>Families love FamilyVital.</h2>
        </div>
        <div style={cardGridStyle}>
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} style={featureCardStyle}>
              <div style={{ marginBottom: "0.75rem", color: "#f59e0b", fontSize: "1rem" }}>★★★★★</div>
              <p style={{ ...featureTextStyle, marginBottom: "0.9rem" }}>{testimonial.quote}</p>
              <strong style={{ color: "#111827" }}>{testimonial.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={pricingCardStyle}>
          <div style={sectionHeadingStyle}>
            <p style={eyebrowStyle}>FAQ</p>
            <h2 style={sectionTitleStyle}>Common questions.</h2>
          </div>
          <div style={{ display: "grid", gap: "0.9rem" }}>
            {faqs.map((faq) => (
              <div key={faq.question} style={{ padding: "1rem 1.1rem", borderRadius: "18px", backgroundColor: "#f8fafc", border: "1px solid rgba(148, 163, 184, 0.16)" }}>
                <h3 style={{ margin: "0 0 0.35rem", fontSize: "1rem", fontWeight: 800, color: "#111827" }}>{faq.question}</h3>
                <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8fbff 0%, #fdf2f8 100%)",
  color: "#0f172a",
}

const heroShellStyle: CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "1.25rem 1.25rem 3rem",
}

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 0 2rem",
}

const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontWeight: 800,
  fontSize: "1.05rem",
  color: "#111827",
}

const brandIconStyle: CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "2.2rem",
  height: "2.2rem",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #2563eb 0%, #ec4899 100%)",
  color: "#ffffff",
  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.22)",
}

const navLinkStyle: CSSProperties = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 700,
  padding: "0.65rem 1rem",
  borderRadius: "999px",
  backgroundColor: "rgba(37, 99, 235, 0.1)",
}

const heroSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "2rem",
  alignItems: "center",
  padding: "2rem 0 1rem",
}

const heroContentStyle: CSSProperties = {
  maxWidth: "640px",
}

const pillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "0.5rem 0.85rem",
  borderRadius: "999px",
  backgroundColor: "rgba(236, 72, 153, 0.12)",
  color: "#be185d",
  fontWeight: 700,
  fontSize: "0.95rem",
  marginBottom: "1rem",
}

const headlineStyle: CSSProperties = {
  fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
  lineHeight: 1.05,
  fontWeight: 800,
  margin: "0 0 1rem",
  color: "#111827",
}

const subheadlineStyle: CSSProperties = {
  fontSize: "1.1rem",
  lineHeight: 1.75,
  color: "#475569",
  marginBottom: "1.6rem",
}

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.9rem",
  marginBottom: "1rem",
}

const primaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  textDecoration: "none",
  padding: "0.95rem 1.25rem",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #2563eb 0%, #ec4899 100%)",
  color: "#ffffff",
  fontWeight: 700,
  boxShadow: "0 16px 30px rgba(37, 99, 235, 0.2)",
}

const secondaryButtonStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.25)",
  backgroundColor: "#ffffff",
  color: "#111827",
  padding: "0.95rem 1.25rem",
  borderRadius: "999px",
  fontWeight: 700,
  cursor: "pointer",
}

const trustRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.7rem",
  marginTop: "0.75rem",
}

const trustBubbleStyle: CSSProperties = {
  padding: "0.5rem 0.8rem",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.8)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  color: "#475569",
  fontSize: "0.95rem",
}

const heroCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.86)",
  backdropFilter: "blur(10px)",
  borderRadius: "32px",
  boxShadow: "0 30px 70px rgba(15, 23, 42, 0.12)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  padding: "1.4rem",
}

const heroCardTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
}

const heroCardBadgeStyle: CSSProperties = {
  color: "#2563eb",
  fontWeight: 700,
  backgroundColor: "rgba(37, 99, 235, 0.12)",
  padding: "0.5rem 0.75rem",
  borderRadius: "999px",
}

const heroCardValueStyle: CSSProperties = {
  fontSize: "2rem",
  fontWeight: 800,
  color: "#111827",
}

const heroCardGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.75rem",
}

const heroMetricStyle: CSSProperties = {
  padding: "1rem",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #eff6ff 0%, #fdf2f8 100%)",
  display: "flex",
  flexDirection: "column",
  gap: "0.3rem",
}

const heroMetricLabelStyle: CSSProperties = {
  color: "#64748b",
  fontSize: "0.9rem",
}

const sectionStyle: CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "2rem 1.25rem 3rem",
}

const sectionHeadingStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "1.5rem",
}

const eyebrowStyle: CSSProperties = {
  color: "#ec4899",
  fontWeight: 800,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  fontSize: "0.8rem",
  marginBottom: "0.3rem",
}

const sectionTitleStyle: CSSProperties = {
  fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
  fontWeight: 800,
  color: "#111827",
  margin: 0,
}

const cardGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "1rem",
}

const featureCardStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: "1.4rem",
  boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
}

const featureIconStyle: CSSProperties = {
  width: "2.7rem",
  height: "2.7rem",
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",
  marginBottom: "1rem",
  color: "#2563eb",
  background: "linear-gradient(135deg, #eff6ff 0%, #fdf2f8 100%)",
}

const featureTitleStyle: CSSProperties = {
  margin: "0 0 0.5rem",
  fontSize: "1.15rem",
  fontWeight: 800,
  color: "#111827",
}

const featureTextStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.7,
}

const pricingCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: "32px",
  padding: "2rem",
  boxShadow: "0 30px 70px rgba(15, 23, 42, 0.12)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
}

const pricingTextStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "1.5rem",
}

const planGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "1rem",
}

const planCardStyle: CSSProperties = {
  borderRadius: "24px",
  padding: "1.4rem",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
}

const featuredPlanStyle: CSSProperties = {
  background: "linear-gradient(135deg, #eff6ff 0%, #fdf2f8 100%)",
  borderColor: "rgba(37, 99, 235, 0.25)",
}

const planHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
}

const planTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 800,
  color: "#111827",
}

const featuredBadgeStyle: CSSProperties = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "0.3rem 0.6rem",
  borderRadius: "999px",
  fontSize: "0.8rem",
  fontWeight: 700,
}

const priceStyle: CSSProperties = {
  fontSize: "2rem",
  fontWeight: 800,
  color: "#111827",
}

const planDescriptionStyle: CSSProperties = {
  margin: 0,
  color: "#64748b",
}

const planListStyle: CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "0.5rem",
}

const planListItemStyle: CSSProperties = {
  color: "#334155",
  display: "flex",
  alignItems: "center",
  gap: "0.45rem",
}

const planButtonStyle = (featured: boolean): CSSProperties => ({
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "0.4rem",
  textDecoration: "none",
  padding: "0.9rem 1rem",
  borderRadius: "999px",
  fontWeight: 700,
  background: featured ? "linear-gradient(135deg, #2563eb 0%, #ec4899 100%)" : "#eff6ff",
  color: featured ? "#ffffff" : "#2563eb",
})
