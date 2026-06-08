import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  goal,
  goalUnit,
  accent = "primary",
}: {
  icon: LucideIcon
  label: string
  value: string | number
  unit?: string
  goal?: string
  goalUnit?: string
  accent?: "primary" | "chart-2" | "chart-3" | "chart-4"
}) {
  const accentMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    "chart-2": "bg-[oklch(0.7_0.13_80_/_0.15)] text-[oklch(0.5_0.13_70)]",
    "chart-3": "bg-[oklch(0.6_0.1_220_/_0.15)] text-[oklch(0.5_0.1_220)]",
    "chart-4": "bg-[oklch(0.65_0.15_30_/_0.15)] text-[oklch(0.55_0.15_30)]",
  }

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-xl", accentMap[accent])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {goal && (
          <span className="text-xs font-medium text-muted-foreground">
            of {goal}
            {goalUnit ? ` ${goalUnit}` : ""}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-bold text-foreground">
          {value}
          {unit && <span className="ml-1 text-base font-semibold text-muted-foreground">{unit}</span>}
        </p>
      </div>
    </Card>
  )
}
