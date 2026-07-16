import { Sparkles, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Hero() {
  return (
    <Card className="overflow-hidden border border-border bg-gradient-to-br from-emerald-500/10 via-background to-background p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="max-w-2xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            AI Marketing Agent Online
          </div>

          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Welcome back 👋
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Launch campaigns, generate ad creatives, monitor performance,
            and let AI grow your business automatically.
          </p>

          <div className="mt-6 flex gap-3">
            <Button>
              Create Campaign
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="outline">
              View Analytics
            </Button>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Revenue
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              $18.4k
            </h2>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Campaigns
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              14
            </h2>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              ROAS
            </p>
            <div className="mt-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold">
                6.3x
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              AI Score
            </p>
            <h2 className="mt-2 text-3xl font-bold text-primary">
              98%
            </h2>
          </Card>

        </div>

      </div>
    </Card>
  )
}
