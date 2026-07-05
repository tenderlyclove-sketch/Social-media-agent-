"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { creatives } from "@/lib/db/schema"
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

const COPY_MODEL = "openai/gpt-5"

const variantSchema = z.object({
  headline: z.string().describe("A punchy headline, under 40 characters."),
  primaryText: z
    .string()
    .describe("The main ad body copy. Match platform norms and length conventions."),
  callToAction: z.string().describe("A short CTA button label, e.g. 'Shop Now', 'Learn More'."),
  hashtags: z.array(z.string()).describe("3-6 relevant hashtags WITHOUT the # symbol."),
  angle: z.string().describe("The persuasion angle in 2-4 words, e.g. 'Social proof'."),
})

const copyResultSchema = z.object({
  variants: z.array(variantSchema).describe("Exactly 3 distinct ad variants."),
})

export type AdVariant = z.infer<typeof variantSchema>

export async function getCreatives() {
  const userId = await getUserId()
  return db
    .select()
    .from(creatives)
    .where(eq(creatives.userId, userId))
    .orderBy(desc(creatives.createdAt))
}

export async function generateAdCopy(input: {
  product: string
  platform: string
  tone: string
  audience: string
  keyPoints: string
}) {
  await getUserId()

  const platformGuidance: Record<string, string> = {
    Instagram: "Visual-first, lifestyle oriented, emoji-friendly, 1-2 short paragraphs.",
    Facebook: "Conversational, can be slightly longer, clear value prop early.",
    TikTok: "Native, trend-aware, casual and hook-driven in the first line.",
    "X / Twitter": "Concise, witty, punchy. Keep under 280 characters total.",
  }

  const { experimental_output } = await generateText({
    model: COPY_MODEL,
    experimental_output: Output.object({ schema: copyResultSchema }),
    system:
      "You are a world-class direct-response copywriter specializing in paid social ads. " +
      "You write scroll-stopping, conversion-focused copy tailored to each platform's native voice. " +
      "Produce 3 genuinely distinct variants that test different angles.",
    prompt:
      `Write 3 ad variants.\n\n` +
      `Product / offer: ${input.product}\n` +
      `Platform: ${input.platform} — ${platformGuidance[input.platform] ?? ""}\n` +
      `Desired tone: ${input.tone}\n` +
      `Target audience: ${input.audience || "Infer a strong target."}\n` +
      `Key points to emphasize: ${input.keyPoints || "Highlight the strongest benefits."}`,
  })

  return experimental_output.variants
}

export async function saveCreative(input: {
  platform: string
  headline: string
  primaryText: string
  callToAction: string
  hashtags: string[]
  tone: string
  campaignId?: number
}) {
  const userId = await getUserId()
  const [row] = await db
    .insert(creatives)
    .values({
      userId,
      campaignId: input.campaignId ?? null,
      platform: input.platform,
      headline: input.headline,
      primaryText: input.primaryText,
      callToAction: input.callToAction,
      hashtags: input.hashtags,
      tone: input.tone,
    })
    .returning()
  revalidatePath("/creative")
  return row
}

export async function deleteCreative(id: number) {
  const userId = await getUserId()
  await db.delete(creatives).where(and(eq(creatives.id, id), eq(creatives.userId, userId)))
  revalidatePath("/creative")
}
