import { Card } from "@/components/ui/card"

const stats = [
  {
    title: "Revenue",
    value: "$18.4k",
    change: "+18%",
  },
  {
    title: "Campaigns",
    value: "14",
    change: "+3",
  },
  {
    title: "ROAS",
    value: "6.3x",
    change: "+12%",
  },
  {
    title: "AI Score",
    value: "98%",
    change: "Excellent",
  },
]

export function StatsCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <Card
          key={item.title}
          className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-xl"
        >
          <p className="text-sm text-muted-foreground">
            {item.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            {item.value}
          </h2>

          <p className="mt-3 text-sm text-primary font-medium">
            {item.change}
          </p>
        </Card>
      ))}
    </section>
  )
}
