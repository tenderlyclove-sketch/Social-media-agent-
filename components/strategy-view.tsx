import type { CampaignStrategy } from "@/app/actions/campaigns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Target, Users, LayoutGrid, MessageSquare, Gauge, CalendarClock } from "lucide-react"

export function StrategyView({ strategy }: { strategy: CampaignStrategy }) {
  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Target className="h-4 w-4 text-primary" />
          Strategic overview
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{strategy.summary}</p>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 text-primary" />
            Target audience
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <p className="font-medium text-foreground">{strategy.targetAudience.primary}</p>
            <p className="text-muted-foreground">{strategy.targetAudience.demographics}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {strategy.targetAudience.interests.map((i) => (
                <Badge key={i} variant="secondary">
                  {i}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Gauge className="h-4 w-4 text-primary" />
            Key KPIs
          </div>
          <ul className="mt-3 space-y-2">
            {strategy.kpis.map((k) => (
              <li key={k} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {k}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LayoutGrid className="h-4 w-4 text-primary" />
          Platform plan
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {strategy.platformPlan.map((p, idx) => (
            <div key={p.platform}>
              {idx > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-foreground">{p.platform}</span>
                <Badge variant="default">{p.budgetShare}% of budget</Badge>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(p.budgetShare, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.rationale}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.adFormats.map((f) => (
                  <Badge key={f} variant="secondary">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MessageSquare className="h-4 w-4 text-primary" />
            Messaging angles
          </div>
          <ul className="mt-3 space-y-2">
            {strategy.keyMessages.map((m) => (
              <li key={m} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {m}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CalendarClock className="h-4 w-4 text-primary" />
            Scheduling
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{strategy.schedule}</p>
        </Card>
      </div>
    </div>
  )
}
