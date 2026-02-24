import type { ExchangeRequest } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight, Clock, User } from "lucide-react"

interface ExchangeCardProps {
  exchange: ExchangeRequest
}

export function ExchangeCard({ exchange }: ExchangeCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
              {exchange.fromTenantName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{exchange.fromTenantName}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {exchange.createdAt}
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "capitalize shrink-0",
              exchange.status === "pending" && "border-chart-4 text-chart-4",
              exchange.status === "approved" && "border-chart-2 text-chart-2",
              exchange.status === "rejected" && "border-destructive text-destructive",
              exchange.status === "completed" && "border-primary text-primary",
            )}
          >
            {exchange.status}
          </Badge>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">From</p>
            <p className="text-sm font-medium text-foreground truncate">{exchange.fromPropertyTitle}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">To</p>
            <p className="text-sm font-medium text-foreground truncate">{exchange.toPropertyTitle}</p>
          </div>
        </div>

        {exchange.reason && (
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Reason:</span> {exchange.reason}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
