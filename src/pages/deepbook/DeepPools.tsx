import { AppLayout } from "../../components/layout/AppLayout";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetricCard } from "@/components/charts/MetricCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
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
  Cell
} from "recharts";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function DeepPools() {
  const { dbdata } = usePoolsData();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate stats
  const totalMinSize = dbdata?.reduce((sum, p) => sum + (Number(p.min_size) || 0), 0) || 0;
  const totalLotSize = dbdata?.reduce((sum, p) => sum + (Number(p.lot_size) || 0), 0) || 0;
  const totalTickSize = dbdata?.reduce((sum, p) => sum + (Number(p.tick_size) || 0), 0) || 0;

  // Chart data
  const chartData = dbdata?.slice(0, 10).map((pool) => ({
    name: `${pool.base_asset_symbol}/${pool.quote_asset_symbol}`,
    min_size: pool.min_size,
    lot_size: pool.lot_size,
    tick_size: pool.tick_size,
  })) || [];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  // Table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "pool_name",
      header: "Pool",
    },
    {
      accessorKey: "pair",
      header: "Pair",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.base_asset_symbol}/{row.original.quote_asset_symbol}
        </Badge>
      ),
    },
    {
      accessorKey: "base_asset_name",
      header: "Base Asset",
      cell: ({ row }) => (
        <div className="flex items-center justify-between">
          <span>{row.original.base_asset_symbol} – {row.original.base_asset_name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(row.original.base_asset_id)}
          >
            {copiedId === row.original.base_asset_id ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "quote_asset_name",
      header: "Quote Asset",
      cell: ({ row }) => (
        <div className="flex items-center justify-between">
          <span>{row.original.quote_asset_symbol} – {row.original.quote_asset_name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(row.original.quote_asset_id)}
          >
            {copiedId === row.original.quote_asset_id ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "min_size",
      header: "Min Size",
      cell: ({ row }) => (
        <span className="font-mono">{row.getValue("min_size")?.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "lot_size",
      header: "Lot Size",
      cell: ({ row }) => (
        <span className="font-mono">{row.getValue("lot_size")?.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "tick_size",
      header: "Tick Size",
      cell: ({ row }) => (
        <span className="font-mono">{row.getValue("tick_size")?.toLocaleString()}</span>
      ),
    },
  ];

  if (!dbdata) {
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
          <h1 className="text-3xl font-bold tracking-tight">DeepBook Pools</h1>
          <p className="text-muted-foreground">
            Liquidity pools and trading pairs on DeepBook
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Pools"
            value={dbdata?.length || 0}
            description="Active pools"
          />
          <MetricCard
            title="Total Min Size"
            value={totalMinSize.toLocaleString()}
            description="Aggregate min size"
          />
          <MetricCard
            title="Total Lot Size"
            value={totalLotSize.toLocaleString()}
            description="Aggregate lot size"
          />
          <MetricCard
            title="Total Tick Size"
            value={totalTickSize.toLocaleString()}
            description="Aggregate tick size"
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <ChartContainer
              title="Pool Metrics Comparison"
              description="Min size, lot size, and tick size across pools"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="min_size" fill="hsl(var(--chart-1))" name="Min Size" />
                  <Bar dataKey="lot_size" fill="hsl(var(--chart-2))" name="Lot Size" />
                  <Bar dataKey="tick_size" fill="hsl(var(--chart-3))" name="Tick Size" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <ChartContainer
              title="Pool Distribution by Min Size"
              description="Distribution of minimum trade sizes"
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
                    dataKey="min_size"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), "Min Size"]} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>

        {/* Pools Table */}
        <Card>
          <CardHeader>
            <CardTitle>All DeepBook Pools</CardTitle>
            <CardDescription>
              Complete list of trading pools with detailed metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={dbdata || []} 
              searchKey="pool_name"
              downloadFileName="deepbook_pools"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default DeepPools;
