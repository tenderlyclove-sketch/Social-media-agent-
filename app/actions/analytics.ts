"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { campaignMetrics } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export interface AnalyticsSummary {
  totals: {
    impressions: number
    clicks: number
    spend: number
    conversions: number
    revenue: number
    ctr: number
    cpc: number
    roas: number
  }
  daily: {
    date: string
    impressions: number
    clicks: number
    spend: number
    conversions: number
    revenue: number
  }[]
  byPlatform: {
    platform: string
    impressions: number
    clicks: number
    spend: number
    conversions: number
    revenue: number
    roas: number
  }[]
}

export async function getAnalytics(): Promise<AnalyticsSummary> {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(campaignMetrics)
    .where(eq(campaignMetrics.userId, userId))

  const totals = {
    impressions: 0,
    clicks: 0,
    spend: 0,
    conversions: 0,
    revenue: 0,
    ctr: 0,
    cpc: 0,
    roas: 0,
  }

  const dailyMap = new Map<string, AnalyticsSummary["daily"][number]>()
  const platMap = new Map<string, AnalyticsSummary["byPlatform"][number]>()

  for (const r of rows) {
    const spend = Number(r.spend)
    const revenue = Number(r.revenue)

    totals.impressions += r.impressions
    totals.clicks += r.clicks
    totals.spend += spend
    totals.conversions += r.conversions
    totals.revenue += revenue

    const d = dailyMap.get(r.date) ?? {
      date: r.date,
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversions: 0,
      revenue: 0,
    }
    d.impressions += r.impressions
    d.clicks += r.clicks
    d.spend += spend
    d.conversions += r.conversions
    d.revenue += revenue
    dailyMap.set(r.date, d)

    const p = platMap.get(r.platform) ?? {
      platform: r.platform,
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversions: 0,
      revenue: 0,
      roas: 0,
    }
    p.impressions += r.impressions
    p.clicks += r.clicks
    p.spend += spend
    p.conversions += r.conversions
    p.revenue += revenue
    platMap.set(r.platform, p)
  }

  totals.ctr = totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0
  totals.cpc = totals.clicks ? totals.spend / totals.clicks : 0
  totals.roas = totals.spend ? totals.revenue / totals.spend : 0

  const byPlatform = [...platMap.values()].map((p) => ({
    ...p,
    spend: Number(p.spend.toFixed(2)),
    revenue: Number(p.revenue.toFixed(2)),
    roas: p.spend ? Number((p.revenue / p.spend).toFixed(2)) : 0,
  }))

  const daily = [...dailyMap.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      ...d,
      spend: Number(d.spend.toFixed(2)),
      revenue: Number(d.revenue.toFixed(2)),
    }))

  return {
    totals: {
      ...totals,
      spend: Number(totals.spend.toFixed(2)),
      revenue: Number(totals.revenue.toFixed(2)),
      ctr: Number(totals.ctr.toFixed(2)),
      cpc: Number(totals.cpc.toFixed(2)),
      roas: Number(totals.roas.toFixed(2)),
    },
    daily,
    byPlatform,
  }
}
