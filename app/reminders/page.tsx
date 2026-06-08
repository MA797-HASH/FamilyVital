"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { reminders as seedReminders, goals, memberById } from "@/lib/data"
import { Plus, Flame, Target } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RemindersPage() {
  const [items, setItems] = useState(seedReminders)

  function toggle(id: string) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)))
  }

  const completed = items.filter((r) => r.done).length

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">Reminders &amp; Goals</h1>
            <p className="mt-1 text-muted-foreground">
              {completed} of {items.length} reminders done today. Keep the streak going.
            </p>
          </div>
          <Button size="lg">
            <Plus className="size-5" />
            New
          </Button>
        </header>

        <Tabs defaultValue="reminders" className="mt-6">
          <TabsList>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="reminders" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-2 p-3">
                {items.map((r) => {
                  const m = memberById(r.memberId)
                  return (
                    <label
                      key={r.id}
                      htmlFor={r.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3.5 transition-colors hover:bg-muted/50",
                        r.done && "opacity-60",
                      )}
                    >
                      <Checkbox id={r.id} checked={r.done} onCheckedChange={() => toggle(r.id)} />
                      <Avatar className="size-9">
                        <AvatarFallback style={{ backgroundColor: m?.avatarColor }} className="text-xs font-semibold text-white">
                          {m?.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className={cn("text-sm font-semibold text-foreground", r.done && "line-through")}>{r.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {m?.name.split(" ")[0]} · {r.time} · {r.repeat}
                        </p>
                      </div>
                      <Badge variant="secondary">{r.category}</Badge>
                    </label>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {goals.map((g) => {
                const m = memberById(g.memberId)
                return (
                  <Card key={g.id}>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-heading">
                        <Target className="size-4 text-primary" />
                        {g.title}
                      </CardTitle>
                      <span className="flex items-center gap-1 text-xs font-semibold text-accent-foreground">
                        <Flame className="size-4 text-[oklch(0.65_0.15_30)]" />
                        {g.streak}
                      </span>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback style={{ backgroundColor: m?.avatarColor }} className="text-[10px] font-semibold text-white">
                            {m?.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{m?.name.split(" ")[0]} · {g.target}</span>
                      </div>
                      <Progress value={g.progress} className="h-2.5" />
                      <p className="text-right text-xs font-semibold text-foreground">{g.progress}%</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
