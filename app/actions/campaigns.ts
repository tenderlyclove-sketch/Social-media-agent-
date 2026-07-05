"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { campaigns, campaignMetrics, creatives } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { generateText, Output } from "ai"
import { z } from "zod"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

const STRATEGY_MODEL = "openai/gpt-5"

const strategySchema = z.object({
  summary: z.string().describe("A 2-3 sentence strategic overview of the campaign approach."),
  targetAudience: z.object({
    primary: z.string().describe("The primary audience segment to target."),
    demographics: z.string().describe("Age range, location, and key demographic notes."),
    interests: z.array(z.string()).describe("4-6 relevant interest or behavior targeting keywords."),
  }),
  platformPlan: z
    .array(
      z.object({
        platform: z.string().describe("Platform name: Instagram, Facebook, TikTok, or X / Twitter."),
        budgetShare: z.number().describe("Recommended percentage of total budget, 0-100."),
        rationale: z.string().describe("Why this platform gets this share and how to use it."),
        adFormats: z.array(z.string()).describe("2-3 recommended ad formats for this platform."),
      }),
    )
    .describe("One entry per selected platform."),
  keyMessages: z.array(z.string()).describe("3-5 core messaging angles to test."),
  kpis: z.array(z.string()).describe("3-4 measurable KPIs aligned to the objective."),
  schedule: z.string().describe("Recommended flighting / scheduling guidance in 1-2 sentences."),
})

export type CampaignStrategy = z.infer<typeof strategySchema>

export async function getCampaigns() {
  const userId = await getUserId()
  return db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
    .orderBy(desc(campaigns.createdAt))
}

export async function getCampaign(id: number) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
    .limit(1)
  return rows[0] ?? null
}

export async function createCampaign(input: {
  name: string
  objective: string
  product: string
  audience: string
  platforms: string[]
  budget: number
}) {
  const userId = await getUserId()
  const [row] = await db
    .insert(campaigns)
    .values({
      userId,
      name: input.name,
      objective: input.objective,
      product: input.product,
      audience: input.audience,
      platforms: input.platforms,
      budget: input.budget,
      status: "draft",
    })
    .returning()

  // seed 30 days of synthetic performance data per platform so the
  // analytics dashboard has something meaningful to render.
  await seedMetrics(userId, row.id, input.platforms)

  revalidatePath("/campaigns")
  revalidatePath("/")
  return row
}

export async function deleteCampaign(id: number) {
  const userId = await getUserId()
  await db.delete(campaigns).where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
  await db.delete(creatives).where(and(eq(creatives.campaignId, id), eq(creatives.userId, userId)))
  await db
    .delete(campaignMetrics)
    .where(and(eq(campaignMetrics.campaignId, id), eq(campaignMetrics.userId, userId)))
  revalidatePath("/campaigns")
  revalidatePath("/")
}

export async function generateStrategy(input: {
  product: string
  objective: string
  audience: string
  platforms: string[]
  budget: number
}) {
  await getUserId()

  const { experimental_output: strategy } = await generateText({
    model: STRATEGY_MODEL,
    experimental_output: Output.object({ schema: strategySchema }),
    system:
      "You are an elite paid-social media strategist who has managed eight-figure ad budgets across Meta, TikTok, and X. " +
      "You produce sharp, specific, and actionable media plans. Budget shares across platforms MUST sum to roughly 100.",
    prompt:
      `Create a paid social advertising strategy.\n\n` +
      `Product / offer: ${input.product}\n` +
      `Primary objective: ${input.objective}\n` +
      `Audience notes: ${input.audience || "Not specified — infer a strong target."}\n` +
      `Selected platforms: ${input.platforms.join(", ")}\n` +
      `Total monthly budget: $${input.budget.toLocaleString()}\n\n` +
      `Only build platform plans for the selected platforms.`,
  })

  return strategy
}

export async function saveStrategy(campaignId: number, strategy: CampaignStrategy) {
  const userId = await getUserId()
  await db
    .update(campaigns)
    .set({ strategy, status: "active", updatedAt: new Date() })
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, userId)))
  revalidatePath("/campaigns")
  revalidatePath(`/campaigns/${campaignId}`)
}

// ---------------------------------------------------------------------------
// Synthetic metric seeding
// ---------------------------------------------------------------------------
async function seedMetrics(userId: string, campaignId: number, platforms: string[]) {
  const rows: (typeof campaignMetrics.$inferInsert)[] = []
  const today = new Date()

  for (const platform of platforms) {
    // platform baselines create variety
    const ctrBase = 0.9 + Math.random() * 1.6 // %
    const cvrBase = 1.5 + Math.random() * 3 // %
    const cpmBase = 4 + Math.random() * 12

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      const trend = 1 + (29 - i) * 0.012 // gentle upward trend
      const noise = 0.8 + Math.random() * 0.45
      const impressions = Math.round((2500 + Math.random() * 9000) * trend * noise)
      const ctr = (ctrBase * (0.85 + Math.random() * 0.4)) / 100
      const clicks = Math.round(impressions * ctr)
      const cvr = (cvrBase * (0.8 + Math.random() * 0.5)) / 100
      const conversions = Math.round(clicks * cvr)
      const spend = (impressions / 1000) * cpmBase * (0.9 + Math.random() * 0.25)
      const aov = 35 + Math.random() * 90
      const revenue = conversions * aov

      rows.push({
        userId,
        campaignId,
        platform,
        date: date.toISOString().slice(0, 10),
        impressions,
        clicks,
        spend: spend.toFixed(2),
        conversions,
        revenue: revenue.toFixed(2),
      })
    }
  }

  if (rows.length) {
    await db.insert(campaignMetrics).values(rows)
  }
}
