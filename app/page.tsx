"use client"

import Link from "next/link"
import { useEffect, useState, type CSSProperties } from "react"
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

const steps = [
  {
    icon: "🎯",
    title: "Create your account",
    description: "Sign up free in 30 seconds, no credit card required.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Add your family members",
    description: "Add everyone in your family and set their health goals.",
  },
  {
    icon: "📊",
    title: "Start tracking together",
    description: "Log daily health data and watch your family thrive.",
  },
]

const stats = [
  { value: 500, suffix: "+", label: "Families Tracked" },
  { value: 10000, suffix: "+", label: "Health Logs" },
  { value: 24, suffix: "/7", label: "AI Coach Available" },
]

const trustBadges = [
  { icon: "🔒", text: "Secure & Private" },
  { icon: "✅", text: "No credit card required" },
  { icon: "⭐", text: "Trusted by families worldwide" },
]

export default function LandingPage() {
  const [counterValues, setCounterValues] = useState(stats.map(() => 0))
  const [statsAnimated, setStatsAnimated] = useState(false)

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll(".reveal"))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.15 }
    )

    revealElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const statsSection = document.getElementById("stats-section")
    if (!statsSection || statsAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return

        const duration = 1400
        const start = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)

          setCounterValues(stats.map((item) => Math.round(item.value * eased)))

          if (progress < 1) {
            requestAnimationFrame(tick)
          }
        }

        requestAnimationFrame(tick)
        setStatsAnimated(true)
        observer.disconnect()
      },
      { threshold: 0.35 }
    )

    observer.observe(statsSection)

    return () => observer.disconnect()
  }, [statsAnimated])

  const formatCounterValue = (item: (typeof stats)[number], value: number) => {
    if (item.suffix === "/7") return `${value}/7`
    return `${value.toLocaleString()}${item.suffix}`
  }

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .landing-nav {
            border-radius: 24px;
            padding: 0.8rem 0.9rem;
            flex-wrap: wrap;
            gap: 0.7rem;
          }

          .landing-nav-actions {
            width: 100%;
            justify-content: space-between;
          }

          .landing-hero-grid {
            grid-template-columns: 1fr !important;
          }

          .landing-button-row {
            flex-direction: column;
          }

          .landing-primary-btn,
          .landing-secondary-btn {
            width: 100%;
            justify-content: center;
          }

          .landing-card-grid,
          .landing-plan-grid {
            grid-template-columns: 1fr !important;
          }

          .landing-pricing-card {
            padding: 1.25rem;
          }

          .landing-footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .landing-footer-links {
            flex-direction: column;
            gap: 0.6rem;
          }
        }
      `}</style>
      <main style={pageStyle}>
      <div style={heroShellStyle} className="reveal">
        <nav style={navStyle} className="landing-nav">
          <div style={brandStyle}>
            <div style={brandIconStyle}>❤</div>
            <span>FamilyVital</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }} className="landing-nav-actions">
            <Link href="/login" style={navLinkStyle}>
              Login
            </Link>
            <Link href="/login" style={primaryButtonStyle}>
              Start Free
            </Link>
          </div>
        </nav>

        <section style={heroSectionStyle} className="landing-hero-grid">
          <div style={heroContentStyle}>
            <div style={pillStyle}>Healthy habits, beautifully connected</div>
            <h1 style={headlineStyle}>Your Family&apos;s Health. One Place.</h1>
            <p style={subheadlineStyle}>
              Track sleep, water, steps, and nutrition for every member of your family — with an AI Health Coach available 24/7.
            </p>
            <div style={buttonRowStyle} className="landing-button-row">
              <Link href="/login" style={primaryButtonStyle} className="landing-primary-btn">
                Start Free
                <ArrowRight size={18} />
              </Link>
              <button type="button" onClick={scrollToFeatures} style={secondaryButtonStyle} className="landing-secondary-btn">
                Learn More
              </button>
            </div>
            <div style={trustRowStyle} className="reveal">
              {trustBadges.map((badge) => (
                <span key={badge.text} style={trustBubbleStyle}>
                  {badge.icon} {badge.text}
                </span>
              ))}
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

      <section style={sectionStyle} className="landing-section">
        <div style={sectionHeadingStyle}>
          <p style={eyebrowStyle}>How it works</p>
          <h2 style={sectionTitleStyle}>A simple routine for healthier family habits.</h2>
        </div>
        <div style={cardGridStyle} className="landing-card-grid">
          {steps.map((step) => (
            <article key={step.title} style={featureCardStyle}>
              <div style={{ ...featureIconStyle, fontSize: "1.25rem" }}>{step.icon}</div>
              <h3 style={featureTitleStyle}>{step.title}</h3>
              <p style={featureTextStyle}>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="stats-section" style={statsSectionStyle} className="landing-section reveal">
        <div style={sectionHeadingStyle}>
          <p style={eyebrowStyle}>Community impact</p>
          <h2 style={sectionTitleStyle}>Families are building healthier habits every day.</h2>
        </div>
        <div style={statsGridStyle}>
          {stats.map((stat, index) => (
            <div key={stat.label} style={statsCardStyle} className="reveal">
              <div style={statsValueStyle}>{formatCounterValue(stat, counterValues[index])}</div>
              <p style={statsLabelStyle}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={sectionStyle} className="landing-section reveal">
        <div style={sectionHeadingStyle}>
          <p style={eyebrowStyle}>Features</p>
          <h2 style={sectionTitleStyle}>Everything your family needs to feel their best.</h2>
        </div>
        <div style={cardGridStyle} className="landing-card-grid">
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
          <div style={planGridStyle} className="landing-plan-grid">
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

      <section style={sectionStyle} className="landing-section">
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

      <section style={finalCtaSectionStyle} className="landing-section reveal">
        <div style={finalCtaCardStyle}>
          <p style={eyebrowStyle}>Join today</p>
          <h2 style={finalCtaHeadlineStyle}>Ready to transform your family&apos;s health?</h2>
          <p style={finalCtaSubheadlineStyle}>Join hundreds of families already thriving with FamilyVital</p>
          <Link href="/login" style={finalCtaButtonStyle}>
            Start Free Today
          </Link>
        </div>
      </section>

      <footer style={footerStyle} className="landing-footer reveal">
        <p style={{ margin: 0, color: "#64748b" }}>© 2026 FamilyVital. All rights reserved.</p>
        <div style={footerLinksStyle} className="landing-footer-links">
          <a href="#" style={footerLinkStyle}>Privacy Policy</a>
          <a href="#" style={footerLinkStyle}>Terms of Service</a>
          <a href="mailto:familyvital@gmail.com" style={footerLinkStyle}>Contact us at familyvital@gmail.com</a>
        </div>
      </footer>
      </main>
    </>
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
  background: "linear-gradient(135deg, #2e1065 0%, #4338ca 45%, #2563eb 100%)",
  borderRadius: "40px",
  boxShadow: "0 30px 70px rgba(46, 16, 101, 0.28)",
}

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.9rem 1rem",
  position: "sticky",
  top: 0,
  zIndex: 50,
  backgroundColor: "rgba(248, 251, 255, 0.92)",
  backdropFilter: "blur(10px)",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  marginBottom: "1.5rem",
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
  backgroundColor: "rgba(255,255,255,0.16)",
  color: "#f8fafc",
  fontWeight: 700,
  fontSize: "0.95rem",
  marginBottom: "1rem",
}

const headlineStyle: CSSProperties = {
  fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
  lineHeight: 1.05,
  fontWeight: 800,
  margin: "0 0 1rem",
  color: "#ffffff",
}

const subheadlineStyle: CSSProperties = {
  fontSize: "1.1rem",
  lineHeight: 1.75,
  color: "#e2e8f0",
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
  backgroundColor: "rgba(255,255,255,0.16)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#f8fafc",
  fontSize: "0.95rem",
}

const heroCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.9)",
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

const statsSectionStyle: CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "2rem 1.25rem 3rem",
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1rem",
}

const statsCardStyle: CSSProperties = {
  background: "linear-gradient(135deg, #eff6ff 0%, #fdf2f8 100%)",
  borderRadius: "24px",
  padding: "1.5rem",
  textAlign: "center",
  boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
}

const statsValueStyle: CSSProperties = {
  fontSize: "2rem",
  fontWeight: 800,
  color: "#111827",
  marginBottom: "0.35rem",
}

const statsLabelStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  fontWeight: 600,
}

const finalCtaSectionStyle: CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "2rem 1.25rem 3rem",
}

const finalCtaCardStyle: CSSProperties = {
  background: "linear-gradient(135deg, #2e1065 0%, #4c1d95 45%, #4338ca 100%)",
  borderRadius: "32px",
  padding: "2rem",
  textAlign: "center",
  color: "#ffffff",
  boxShadow: "0 30px 70px rgba(46, 16, 101, 0.28)",
}

const finalCtaHeadlineStyle: CSSProperties = {
  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
  fontWeight: 800,
  margin: "0.35rem 0 0.7rem",
}

const finalCtaSubheadlineStyle: CSSProperties = {
  margin: "0 0 1.2rem",
  color: "#e2e8f0",
  fontSize: "1.05rem",
}

const finalCtaButtonStyle: CSSProperties = {
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
  padding: "0.95rem 1.4rem",
  borderRadius: "999px",
  backgroundColor: "#ffffff",
  color: "#4c1d95",
  fontWeight: 800,
}

const footerStyle: CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "2rem 1.25rem 2.5rem",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  borderTop: "1px solid rgba(148, 163, 184, 0.2)",
}

const footerLinksStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
}

const footerLinkStyle: CSSProperties = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 600,
}
