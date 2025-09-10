import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: "percentage" | "absolute"
  icon?: React.ReactNode
  description?: string
  trend?: "up" | "down" | "neutral"
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "percentage",
  icon,
  description,
  trend
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`
      if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`
      if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`
      return val.toLocaleString()
    }
    return val
  }

  const getTrendIcon = () => {
    if (trend === "up" || (change && change > 0)) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    if (trend === "down" || (change && change < 0)) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getChangeColor = () => {
    if (change === undefined) return "text-gray-400"
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-400"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {(change !== undefined || description) && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            {change !== undefined && (
              <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
                {getTrendIcon()}
                <span>
                  {changeType === "percentage" ? `${Math.abs(change).toFixed(2)}%` : formatValue(Math.abs(change))}
                </span>
              </div>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}