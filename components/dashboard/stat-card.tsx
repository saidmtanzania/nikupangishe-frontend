import type { DashboardStats } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  stat: DashboardStats
  icon: React.ReactNode
}

export function StatCard({ stat, icon }: StatCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          {icon}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          {stat.change && (
            <div className="flex items-center gap-1">
              {stat.changeType === "positive" && <TrendingUp className="h-3 w-3 text-chart-2" />}
              {stat.changeType === "negative" && <TrendingDown className="h-3 w-3 text-destructive" />}
              {stat.changeType === "neutral" && <Minus className="h-3 w-3 text-muted-foreground" />}
              <span className={cn(
                "text-xs",
                stat.changeType === "positive" && "text-chart-2",
                stat.changeType === "negative" && "text-destructive",
                stat.changeType === "neutral" && "text-muted-foreground",
              )}>
                {stat.change}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
