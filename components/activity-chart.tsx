"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { weeklyActivity } from "@/lib/data"

const config = {
  steps: { label: "Steps", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Family activity</CardTitle>
        <CardDescription>Combined steps across the household this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[240px] w-full">
          <BarChart data={weeklyActivity} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="steps" fill="var(--color-steps)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
