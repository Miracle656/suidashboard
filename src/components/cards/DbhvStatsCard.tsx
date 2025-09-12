import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Activity } from "lucide-react";

interface HistoricalVolumeStatsProps {
  volumeData: Record<string, number>;
}

export function HistoricalVolumeStats({ volumeData }: HistoricalVolumeStatsProps) {
  const volumes = Object.values(volumeData);
  const pools = Object.keys(volumeData);
  
  const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
  const avgVolume = volumes.length > 0 ? totalVolume / volumes.length : 0;
  const maxVolume = Math.max(...volumes, 0);
  const activePoolsCount = pools.length;

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toLocaleString();
  };

  const stats = [
    {
      label: "Total Volume",
      value: formatVolume(totalVolume),
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Average Volume",
      value: formatVolume(avgVolume),
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      label: "Peak Volume",
      value: formatVolume(maxVolume),
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      label: "Active Pools",
      value: activePoolsCount.toString(),
      icon: Activity,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">
                  {stat.value}
                </p>
              </div>
              <IconComponent className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}