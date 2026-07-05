import {
  Camera,
  Users,
  Play,
  Briefcase,
  MessageCircle,
  Clapperboard,
} from "lucide-react"

export type PlatformId =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "twitter"

export const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    blurb: "Photos, Reels and Stories",
    icon: Camera,
    color: "text-pink-500",
  },
  {
    id: "facebook",
    name: "Facebook",
    blurb: "Communities and Ads",
    icon: Users,
    color: "text-blue-600",
  },
  {
    id: "tiktok",
    name: "TikTok",
    blurb: "Short-form viral videos",
    icon: Clapperboard,
    color: "text-black dark:text-white",
  },
  {
    id: "youtube",
    name: "YouTube",
    blurb: "Video marketing",
    icon: Play,
    color: "text-red-600",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    blurb: "Professional audience",
    icon: Briefcase,
    color: "text-blue-700",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    blurb: "Real-time conversations",
    icon: MessageCircle,
    color: "text-slate-700 dark:text-slate-200",
  },
] as const

export const PLATFORM_MAP = Object.fromEntries(
  PLATFORMS.map((platform) => [platform.id, platform]),
) as Record<PlatformId, (typeof PLATFORMS)[number]>

export const OBJECTIVES = [
  "Brand Awareness",
  "Website Traffic",
  "Lead Generation",
  "Sales",
  "App Installs",
  "Engagement",
]
