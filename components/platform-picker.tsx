"use client"

import { PLATFORMS, type PlatformId } from "@/lib/platforms"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export function PlatformPicker({
  selected,
  onChange,
}: {
  selected: PlatformId[]
  onChange: (next: PlatformId[]) => void
}) {
  const toggle = (id: PlatformId) => {
    onChange(selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id])
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {PLATFORMS.map((p) => {
        const active = selected.includes(p.id)
        const Icon = p.icon
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            aria-pressed={active}
            className={cn(
              "relative flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
              active
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground/40 hover:bg-secondary/50",
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
              <Icon className={cn("h-4 w-4", p.color)} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">{p.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{p.blurb}</span>
            </span>
            {active && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
