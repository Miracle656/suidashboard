import React, { useState } from "react";
import { AppLayout as Layout } from "../../components/layout/AppLayout";
import { useGetCoins } from "../../hooks/useCoins/useGetCoins";
import { DataTable } from "../../components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { ChartContainer } from "../../components/charts/ChartContainer";
import { MetricCard } from "../../components/charts/MetricCard";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

interface CoinData {
  coinName: string;
  coinSymbol: string;
  coinType: string;
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  volume: number;
  price: number;
  change24h: number;
  decimals: number;
}

const columns: ColumnDef<CoinData>[] = [
  {
    accessorKey: "coinName",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <div>
          <div className="font-medium">{row.getValue("coinName")}</div>
          <div className="text-sm text-muted-foreground">{row.original.coinSymbol}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <div className="font-mono">${price.toFixed(6)}</div>;
    },
  },
  {
    accessorKey: "change24h",
    header: "24h Change",
    cell: ({ row }) => {
      const change = parseFloat(row.getValue("change24h"));
      const isPositive = change > 0;
      return (
        <div className={`flex items-center space-x-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{Math.abs(change).toFixed(2)}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "marketCap",
    header: "Market Cap",
    cell: ({ row }) => {
      const marketCap = parseFloat(row.getValue("marketCap"));
      return <div className="font-mono">${marketCap.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "volume",
    header: "24h Volume",
    cell: ({ row }) => {
      const volume = parseFloat(row.getValue("volume"));
      return <div className="font-mono">${volume.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "totalSupply",
    header: "Total Supply",
    cell: ({ row }) => {
      const supply = parseFloat(row.getValue("totalSupply"));
      return <div className="font-mono">{supply.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "coinType",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <a
          href={`/coins/coin-details/${encodeURIComponent(row.original.coinType)}`}
          className="flex items-center space-x-1"
        >
          <ExternalLink className="h-3 w-3" />
          <span>Details</span>
        </a>
      </Button>
    ),
  },
];

function AccountCoins() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const { coins, loading, error, totalCount } = useGetCoins(page, pageSize);

  // Transform coins data for the table
  const tableData: CoinData[] = coins.map((coin) => ({
    coinName: coin.coinName || "Unknown",
    coinSymbol: coin.coinSymbol || "N/A",
    coinType: coin.coinType || "",
    totalSupply: coin.totalSupply || 0,
    circulatingSupply: coin.circulatingSupply || 0,
    marketCap: coin.marketCap || 0,
    volume: coin.volume || 0,
    price: coin.price || 0,
    change24h: coin.change24h || 0,
    decimals: coin.decimals || 0,
  }));

  // Calculate metrics
  const totalMarketCap = tableData.reduce((sum, coin) => sum + coin.marketCap, 0);
  const totalVolume = tableData.reduce((sum, coin) => sum + coin.volume, 0);
  const avgChange = tableData.length > 0 
    ? tableData.reduce((sum, coin) => sum + coin.change24h, 0) / tableData.length 
    : 0;

  // Prepare chart data
  const chartData = tableData.slice(0, 10).map((coin) => ({
    name: coin.coinSymbol,
    value: coin.marketCap,
    volume: coin.volume,
    price: coin.price,
  }));

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading coins: {error.message}
            </div>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Account Coins</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of all coins on the Sui network
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Market Cap"
            value={`$${totalMarketCap.toLocaleString()}`}
            change={avgChange}
            trend={avgChange > 0 ? "up" : "down"}
          />
          <MetricCard
            title="24h Volume"
            value={`$${totalVolume.toLocaleString()}`}
            change={0}
            trend="neutral"
          />
          <MetricCard
            title="Total Coins"
            value={totalCount.toString()}
            change={0}
            trend="neutral"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Top 10 Coins by Market Cap"
            data={chartData}
            type="bar"
            dataKey="value"
            nameKey="name"
          />
          <ChartContainer
            title="Top 10 Coins by Volume"
            data={chartData}
            type="bar"
            dataKey="volume"
            nameKey="name"
          />
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Coins</CardTitle>
            <CardDescription>
              Complete list of coins with market data and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={tableData}
              searchKey="coinName"
              exportFilename="sui-coins"
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default AccountCoins;