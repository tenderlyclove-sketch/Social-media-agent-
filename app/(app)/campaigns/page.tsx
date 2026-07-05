import Link from "next/link"
import { getCampaigns } from "@/app/actions/campaigns"
import { PageHeader } from "@/components/page-header"
import { CampaignActions } from "@/components/campaign-actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PLATFORM_MAP, type PlatformId } from "@/lib/platforms"
import { Plus, Megaphone, ArrowUpRight } from "lucide-react"

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Every campaign the agent has planned, with its objective, platforms, and budget."
      >
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4" />
            New campaign
          </Link>
        </Button>
      </PageHeader>

      {campaigns.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Megaphone className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              No campaigns yet
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Plan your first AI-powered campaign to get started.
            </p>
          </div>
          <Button asChild>
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4" />
              New campaign
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((c) => (
            <Card key={c.id} className="group flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/campaigns/${c.id}`} className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-foreground group-hover:underline">
                    {c.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{c.objective}</p>
                </Link>
                <div className="flex shrink-0 items-center gap-1">
                  <Badge variant={c.status === "active" ? "default" : "secondary"}>
                    {c.status}
                  </Badge>
                  <CampaignActions id={c.id} />
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {c.product}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex -space-x-1">
                  {c.platforms.map((p) => {
                    const meta = PLATFORM_MAP[p as PlatformId]
                    if (!meta) return null
                    const Icon = meta.icon
                    return (
                      <span
                        key={p}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card"
                        title={meta.name}
                      >
                        <Icon className={`h-3.5 w-3.5 ${meta.color}`} />
                      </span>
                    )
                  })}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    ${c.budget.toLocaleString()}/mo
                  </span>
                  <Link
                    href={`/campaigns/${c.id}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Open campaign"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
