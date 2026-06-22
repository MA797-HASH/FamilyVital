"use client"

import { useState, type FormEvent } from "react"
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
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newTime, setNewTime] = useState("08:00")
  const [newRepeat, setNewRepeat] = useState("Daily")

  function addReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newTitle.trim() || !newTime) return

    const nextReminder = {
      id: `r${Date.now()}`,
      title: newTitle.trim(),
      memberId: items[0]?.memberId ?? "maya",
      time: newTime,
      category: "Activity",
      done: false,
      repeat: newRepeat,
    }

    setItems((prev) => [nextReminder, ...prev])
    setNewTitle("")
    setNewTime("08:00")
    setNewRepeat("Daily")
    setShowForm(false)
  }

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
          <Button size="lg" onClick={() => setShowForm((prev) => !prev)}>
            <Plus className="size-5" />
            New
          </Button>
        </header>

        {showForm && (
          <Card className="mt-6 p-6">
            <form onSubmit={addReminder} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Titre
                </label>
                <input
                  id="title"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                  placeholder="Ex: Boire de l'eau"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="time" className="text-sm font-medium text-foreground">
                  Heure
                </label>
                <input
                  id="time"
                  type="time"
                  value={newTime}
                  onChange={(event) => setNewTime(event.target.value)}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="repeat" className="text-sm font-medium text-foreground">
                  Fréquence
                </label>
                <select
                  id="repeat"
                  value={newRepeat}
                  onChange={(event) => setNewRepeat(event.target.value)}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Once</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full">
                  Ajouter
                </Button>
              </div>
            </form>
          </Card>
        )}

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
