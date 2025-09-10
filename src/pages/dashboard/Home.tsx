import { AppLayout } from "../../components/layout/AppLayout";
import { MetricCard } from "../../components/charts/MetricCard";
import { ChartContainer } from "../../components/charts/ChartContainer";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { useStatsData } from "../../hooks/useStatsData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ColumnDef } from "@tanstack/react-table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";

function Home() {
  const { suidata } = usePoolsData();
  const { suiStats, loading } = useStatsData();

  // Transform data for charts
  const chartData = Array.isArray(suidata) ? suidata.slice(0, 10).map((pool, index) => ({
    name: pool.coinA?.split("::").pop() + "/" + pool.coinB?.split("::").pop() || `Pool ${index + 1}`,
    liquidity: pool.liqUsd || 0,
    volume: pool.volume || 0,
    swaps: pool.swapCount || 0
  })) : [];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  // Table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Pool",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{row.original.name?.charAt(0) || "P"}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("platform") || "Unknown"}</Badge>
      ),
    },
    {
      accessorKey: "liquidity",
      header: "Liquidity",
      cell: ({ row }) => {
        const value = row.getValue("liquidity") as number;
        return <span className="font-mono">${value?.toLocaleString() || "0"}</span>;
      },
    },
    {
      accessorKey: "volume",
      header: "24h Volume",
      cell: ({ row }) => {
        const value = row.getValue("volume") as number;
        return <span className="font-mono">${value?.toLocaleString() || "0"}</span>;
      },
    },
    {
      accessorKey: "swapCount",
      header: "Swaps",
      cell: ({ row }) => {
        const value = row.getValue("swapCount") as number;
        return <span>{value?.toLocaleString() || "0"}</span>;
      },
    },
  ];

  const tableData = Array.isArray(suidata) ? suidata.map((pool) => ({
    name: pool.coinA?.split("::").pop() + "/" + pool.coinB?.split("::").pop() || "Unknown Pool",
    platform: pool.platform || "Unknown",
    liquidity: pool.liqUsd || 0,
    volume: pool.volume || 0,
    swapCount: pool.swapCount || 0,
  })) : [];

  if (loading) {
    return (
      <AppLayout>
        <LoadingSpinner size="lg" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the Sui ecosystem analytics and metrics
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="SUI Price"
            value={`$${suiStats?.coinPrice?.toFixed(4) || "0.0000"}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description="Current price"
          />
          <MetricCard
            title="Market Cap"
            value={suiStats?.marketCap || 0}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Total market value"
          />
          <MetricCard
            title="24h Volume"
            value={suiStats?.coin24hTradeVolumeUsd || 0}
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            description="Trading volume"
          />
          <MetricCard
            title="Holders"
            value={suiStats?.holdersCount || 0}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="Token holders"
          />
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="liquidity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="liquidity" className="space-y-4">
            <ChartContainer
              title="Top Pools by Liquidity"
              description="Liquidity distribution across top DeFi pools"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Liquidity"]}
                  />
                  <Bar dataKey="liquidity" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="volume" className="space-y-4">
            <ChartContainer
              title="Trading Volume"
              description="24h trading volume across pools"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Volume"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <ChartContainer
              title="Liquidity Distribution"
              description="Market share by liquidity"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="liquidity"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Liquidity"]} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liquidity Pools</CardTitle>
            <CardDescription>
              All active liquidity pools across the Sui ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={tableData} 
              searchKey="name"
              downloadFileName="sui_pools_overview"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Home;
