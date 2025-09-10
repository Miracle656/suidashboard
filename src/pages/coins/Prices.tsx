import React from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { useCoinTrend } from "../../hooks/useCoins/useCoinTrend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetricCard } from "@/components/charts/MetricCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Activity, Users } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

function Prices() {
  const { trendingCoins, loading, error, refetch } = useCoinTrend({ 
    autoFetch: true, 
    pageSize: 100 
  });

  const formatNumber = (num: string | number | null | undefined) => {
    if (!num || num === "NaN" || isNaN(Number(num))) return "N/A";
    const numValue = Number(num);
    if (numValue >= 1e9) return (numValue / 1e9).toFixed(2) + "B";
    if (numValue >= 1e6) return (numValue / 1e6).toFixed(2) + "M";
    if (numValue >= 1e3) return (numValue / 1e3).toFixed(2) + "K";
    return numValue.toLocaleString();
  };

  const formatPrice = (price: string | number) => {
    if (!price || price === "NaN" || isNaN(Number(price))) return "N/A";
    const numPrice = Number(price);
    if (numPrice < 0.01) return numPrice.toFixed(6);
    if (numPrice < 1) return numPrice.toFixed(4);
    return numPrice.toFixed(2);
  };

  const formatPercentage = (percentage: string | number) => {
    if (!percentage || percentage === "NaN" || isNaN(Number(percentage)))
      return "N/A";
    const numPercentage = Number(percentage);
    return numPercentage.toFixed(2) + "%";
  };

  const getPercentageColor = (percentage: string | number) => {
    if (!percentage || percentage === "NaN" || isNaN(Number(percentage)))
      return "gray";
    const numPercentage = Number(percentage);
    return numPercentage >= 0 ? "green" : "red";
  };

  // Chart data
  const chartData = trendingCoins.slice(0, 20).map((coin) => ({
    name: coin.coinMetadata?.symbol || "Unknown",
    price: coin.price || 0,
    marketCap: coin.marketCap || 0,
    volume24h: (coin.buyVolumeStats1d?.volumeUsd || 0) + (coin.sellVolumeStats1d?.volumeUsd || 0),
    change24h: coin.percentagePriceChange1d || 0,
    holders: coin.holdersCount || 0,
  }));

  // Table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "coinMetadata.name",
      header: "Token",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.coinMetadata?.iconUrl} />
            <AvatarFallback>{row.original.coinMetadata?.symbol?.charAt(0) || "T"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.coinMetadata?.name || "Unknown Token"}</div>
            <div className="text-sm text-muted-foreground">{row.original.coinMetadata?.symbol || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-mono">${formatPrice(row.getValue("price"))}</span>
      ),
    },
    {
      accessorKey: "marketCap",
      header: "Market Cap",
      cell: ({ row }) => (
        <span className="font-mono">${formatNumber(row.getValue("marketCap"))}</span>
      ),
    },
    {
      id: "volume24h",
      header: "24h Volume",
      cell: ({ row }) => {
        const volume = (row.original.buyVolumeStats1d?.volumeUsd || 0) + (row.original.sellVolumeStats1d?.volumeUsd || 0);
        return <span className="font-mono">${formatNumber(volume)}</span>;
      },
    },
    {
      accessorKey: "percentagePriceChange1h",
      header: "1h Change",
      cell: ({ row }) => {
        const change = row.getValue("percentagePriceChange1h") as number;
        const isPositive = change >= 0;
        return (
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
              {formatPercentage(change)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "percentagePriceChange1d",
      header: "24h Change",
      cell: ({ row }) => {
        const change = row.getValue("percentagePriceChange1d") as number;
        const isPositive = change >= 0;
        return (
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
              {formatPercentage(change)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "holdersCount",
      header: "Holders",
      cell: ({ row }) => (
        <span>{formatNumber(row.getValue("holdersCount"))}</span>
      ),
    },
    {
      accessorKey: "totalLiquidityUsd",
      header: "Liquidity",
      cell: ({ row }) => (
        <span className="font-mono">${formatNumber(row.getValue("totalLiquidityUsd"))}</span>
      ),
    },
    {
      accessorKey: "uniqueTraders1d",
      header: "24h Traders",
      cell: ({ row }) => (
        <span>{formatNumber(row.getValue("uniqueTraders1d"))}</span>
      ),
    },
  ];

  // Calculate metrics
  const totalMarketCap = trendingCoins.reduce((sum, coin) => sum + (coin.marketCap || 0), 0);
  const totalVolume = trendingCoins.reduce((sum, coin) => 
    sum + (coin.buyVolumeStats1d?.volumeUsd || 0) + (coin.sellVolumeStats1d?.volumeUsd || 0), 0
  );
  const avgChange24h = trendingCoins.reduce((sum, coin) => sum + (coin.percentagePriceChange1d || 0), 0) / trendingCoins.length;

  if (error) {
    return (
      <AppLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4">
              <AlertTriangle className="text-destructive h-5 w-5" />
              <span className="text-destructive">Error: {error.message}</span>
              <Button onClick={refetch} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trending Coins</h1>
            <p className="text-muted-foreground">
              Real-time cryptocurrency data with price movements and volume metrics
            </p>
          </div>
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Market Cap"
                value={totalMarketCap}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                description="Combined market value"
              />
              <MetricCard
                title="24h Volume"
                value={totalVolume}
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                description="Total trading volume"
              />
              <MetricCard
                title="Average 24h Change"
                value={`${avgChange24h.toFixed(2)}%`}
                trend={avgChange24h >= 0 ? "up" : "down"}
                description="Market sentiment"
              />
              <MetricCard
                title="Tracked Coins"
                value={trendingCoins.length}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                description="Available tokens"
              />
            </div>

            {/* Charts */}
            <Tabs defaultValue="prices" className="space-y-4">
              <TabsList>
                <TabsTrigger value="prices">Price Chart</TabsTrigger>
                <TabsTrigger value="volume">Volume Chart</TabsTrigger>
                <TabsTrigger value="changes">24h Changes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="prices" className="space-y-4">
                <ChartContainer
                  title="Token Prices"
                  description="Current prices of trending tokens"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`$${formatPrice(value)}`, "Price"]}
                      />
                      <Bar dataKey="price" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="volume" className="space-y-4">
                <ChartContainer
                  title="24h Trading Volume"
                  description="Trading volume across trending tokens"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`$${formatNumber(value)}`, "Volume"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="volume24h" 
                        stroke="hsl(var(--chart-1))" 
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="changes" className="space-y-4">
                <ChartContainer
                  title="24h Price Changes"
                  description="Price change distribution"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}%`, "Change"]}
                      />
                      <Bar 
                        dataKey="change24h" 
                        fill={(entry: any) => entry.change24h >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-5))"}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>

            {/* Trending Coins Table */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Cryptocurrencies</CardTitle>
                <CardDescription>
                  {trendingCoins.length} trending tokens with real-time data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={columns} 
                  data={trendingCoins} 
                  searchKey="coinMetadata.name"
                  downloadFileName="trending_coins"
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default Prices;
