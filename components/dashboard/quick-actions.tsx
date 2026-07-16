import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Plus,
  Wand2,
  Users,
  Calendar,
  BarChart3,
  Sparkles,
} from "lucide-react"

const actions = [                    
  {
    title: "Create Campaign",
  icon: Plus,
  href: "/campaigns/new",
},
  {
    title: "Generate AI Creative",
    icon: Wand2,
  },
  {
    title: "Import Leads",
    icon: Users,
  },
  {
    title: "Schedule Posts",
    icon: Calendar,
  },
  {
    title: "View Analytics",
    icon: BarChart3,
  },
  {
    title: "AI Assistant",
    icon: Sparkles,
  },
]

export function QuickActions() {
  return (
    <Card className="p-6 rounded-2xl">
      <h2 className="text-xl font-semibold mb-5">
        Quick Actions
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((item) => {
          const Icon = item.icon

          return (
            <Button
  key={item.title}
  variant="outline"
  className="h-20 justify-start gap-4 rounded-xl text-left hover:bg-primary hover:text-primary-foreground transition-all"
>
            
              {item.href ? (
  <Link href={item.href}>
    <Icon className="h-6 w-6" />
    <span>{item.title}</span>
  </Link>
) : (
  <>
    <Icon className="h-6 w-6" />
    <span>{item.title}</span>
  </>
)}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
