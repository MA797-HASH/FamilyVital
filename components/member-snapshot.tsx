import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Footprints, Moon, Droplet } from "lucide-react"
import type { FamilyMember } from "@/lib/data"

export function MemberSnapshot({ member }: { member: FamilyMember }) {
  const stepsPct = Math.min(100, Math.round((member.metrics.steps.value / member.metrics.steps.goal) * 100))
  const sleepPct = Math.min(100, Math.round((member.metrics.sleep.value / member.metrics.sleep.goal) * 100))
  const waterPct = Math.min(100, Math.round((member.metrics.water.value / member.metrics.water.goal) * 100))

  return (
    <Link href={`/family/${member.id}`}>
      <Card className="flex flex-col gap-4 p-5 transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            <AvatarFallback style={{ backgroundColor: member.avatarColor }} className="font-semibold text-white">
              {member.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-heading font-bold text-foreground">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">{member.focus}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <MiniBar icon={Footprints} label="Steps" pct={stepsPct} />
          <MiniBar icon={Moon} label="Sleep" pct={sleepPct} />
          <MiniBar icon={Droplet} label="Water" pct={waterPct} />
        </div>
      </Card>
    </Link>
  )
}

function MiniBar({ icon: Icon, label, pct }: { icon: typeof Footprints; label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <Progress value={pct} className="h-2" />
      <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">{pct}%</span>
    </div>
  )
}
