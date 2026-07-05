import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  jsonb,
  numeric,
  date,
} from "drizzle-orm/pg-core"

// ---------------------------------------------------------------------------
// Better Auth tables (do not rename columns)
// ---------------------------------------------------------------------------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// App tables (scoped per-user via userId, no FK by design)
// ---------------------------------------------------------------------------
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  objective: text("objective").notNull(),
  product: text("product").notNull(),
  audience: text("audience"),
  platforms: text("platforms").array().notNull().default([]),
  budget: integer("budget").notNull().default(0),
  status: text("status").notNull().default("draft"),
  strategy: jsonb("strategy"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const creatives = pgTable("creatives", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  campaignId: integer("campaignId"),
  platform: text("platform").notNull(),
  headline: text("headline").notNull(),
  primaryText: text("primaryText").notNull(),
  callToAction: text("callToAction").notNull(),
  hashtags: text("hashtags").array().notNull().default([]),
  tone: text("tone"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const campaignMetrics = pgTable("campaign_metrics", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  campaignId: integer("campaignId"),
  platform: text("platform").notNull(),
  date: date("date").notNull(),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  spend: numeric("spend", { precision: 10, scale: 2 }).notNull().default("0"),
  conversions: integer("conversions").notNull().default(0),
  revenue: numeric("revenue", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export type Campaign = typeof campaigns.$inferSelect
export type Creative = typeof creatives.$inferSelect
export type CampaignMetric = typeof campaignMetrics.$inferSelect
