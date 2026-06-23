"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, LayoutDashboard, Users, Bell, MessageCircleHeart, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/family", label: "Family", icon: Users },
  { href: "/reminders", label: "Reminders & Goals", icon: Bell },
  { href: "/metrics", label: "Métriques", icon: Activity },
  { href: "/coach", label: "AI Coach", icon: MessageCircleHeart },
]

export function AppShell({ children, streak = 0 }: { children: React.ReactNode; streak?: number }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 md:flex">
        <Brand />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="rounded-xl bg-sidebar-accent p-4">
          <div className="flex items-center gap-2 text-sidebar-accent-foreground">
            <Activity className="size-4" aria-hidden="true" />
            <span className="text-sm font-semibold">Family streak</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-sidebar-accent-foreground font-heading">{streak} days</p>
          <p className="text-xs text-sidebar-accent-foreground/80">Everyone hit their goals!</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <Brand />
      </header>

      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-border bg-background/95 px-2 py-2 backdrop-blur md:hidden">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" aria-hidden="true" />
              {item.label.split(" ")[0]}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="size-5" aria-hidden="true" />
      </span>
      <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">FamilyVital</span>
    </Link>
  )
}
