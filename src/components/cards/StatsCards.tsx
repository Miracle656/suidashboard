import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

interface StatData {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

interface StatsCardsProps {
  stats: StatData[] | any;
}

export function StatsCards({ stats }: StatsCardsProps) {
  // Handle different stat formats
  const normalizedStats: StatData[] = Array.isArray(stats) 
    ? stats 
    : stats 
      ? [
          { label: "Total Value", value: stats.totalValue || "N/A" },
          { label: "24h Volume", value: stats.volume24h || "N/A" },
          { label: "Market Cap", value: stats.marketCap || "N/A" },
          { label: "Active Users", value: stats.activeUsers || "N/A" },
        ]
      : [];

  const formatValue = (value: string | number) => {
    if (typeof value === "number") {
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
      if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
      return value.toLocaleString();
    }
    return value;
  };

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (normalizedStats.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loading...</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {normalizedStats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold">
                {formatValue(stat.value)}
              </p>
              {stat.change && (
                <p className={`text-xs ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change.toFixed(2)}%
                </p>
              )}
            </div>
            {getTrendIcon(stat.trend)}
          </div>
        </Card>
      ))}
    </div>
  );
}