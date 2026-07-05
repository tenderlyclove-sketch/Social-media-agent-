"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  generateStrategy,
  createCampaign,
  saveStrategy,
  type CampaignStrategy,
} from "@/app/actions/campaigns"
import { OBJECTIVES, type PlatformId, PLATFORM_MAP } from "@/lib/platforms"
import { PlatformPicker } from "@/components/platform-picker"
import { StrategyView } from "@/components/strategy-view"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, Loader2, RotateCcw, Check } from "lucide-react"

export function NewCampaignForm() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [product, setProduct] = useState("")
  const [objective, setObjective] = useState<string>(OBJECTIVES[5])
  const [audience, setAudience] = useState("")
  const [budget, setBudget] = useState("5000")
  const [platforms, setPlatforms] = useState<PlatformId[]>(["instagram", "tiktok"])

  const [strategy, setStrategy] = useState<CampaignStrategy | null>(null)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  const canGenerate = name.trim() && product.trim() && platforms.length > 0

  const handleGenerate = async () => {
    if (!canGenerate) {
      toast.error("Add a campaign name, product, and at least one platform.")
      return
    }
    setGenerating(true)
    setStrategy(null)
    try {
      const result = await generateStrategy({
        product,
        objective,
        audience,
        platforms: platforms.map((p) => PLATFORM_MAP[p].name),
        budget: Number(budget) || 0,
      })
      setStrategy(result)
      toast.success("Strategy generated")
    } catch (err) {
      console.error("[v0] strategy generation failed:", err)
      toast.error("Could not generate the strategy. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleLaunch = async () => {
    setSaving(true)
    try {
      const campaign = await createCampaign({
        name,
        objective,
        product,
        audience,
        platforms,
        budget: Number(budget) || 0,
      })
      if (strategy) {
        await saveStrategy(campaign.id, strategy)
      }
      toast.success("Campaign launched")
      router.push(`/campaigns/${campaign.id}`)
    } catch (err) {
      console.error("[v0] campaign launch failed:", err)
      toast.error("Could not launch the campaign.")
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="flex flex-col gap-5 p-6 lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Campaign name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Summer Launch 2026"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="product">Product / offer</Label>
          <Textarea
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Describe what you're advertising — features, price point, what makes it special."
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="objective">Objective</Label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger id="objective">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OBJECTIVES.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="audience">Audience notes (optional)</Label>
          <Textarea
            id="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Who are you trying to reach?"
            rows={2}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="budget">Monthly budget (USD)</Label>
          <Input
            id="budget"
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Platforms</Label>
          <PlatformPicker selected={platforms} onChange={setPlatforms} />
        </div>

        <Button onClick={handleGenerate} disabled={generating || saving} className="w-full">
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Building strategy...
            </>
          ) : strategy ? (
            <>
              <RotateCcw className="h-4 w-4" />
              Regenerate strategy
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate AI strategy
            </>
          )}
        </Button>
      </Card>

      <div className="lg:col-span-3">
        {generating ? (
          <GeneratingState />
        ) : strategy ? (
          <div className="flex flex-col gap-5">
            <StrategyView strategy={strategy} />
            <Button onClick={handleLaunch} disabled={saving} size="lg" className="w-full">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Launching...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Launch campaign
                </>
              )}
            </Button>
          </div>
        ) : (
          <Card className="flex h-full min-h-80 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Your AI media plan appears here</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Fill in the campaign details and the agent will design a full cross-platform strategy.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

function GeneratingState() {
  return (
    <Card className="flex h-full min-h-80 flex-col items-center justify-center gap-4 p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">The agent is thinking...</p>
        <p className="text-sm text-muted-foreground">
          Analyzing your product, audience, and budget across platforms.
        </p>
      </div>
    </Card>
  )
}
