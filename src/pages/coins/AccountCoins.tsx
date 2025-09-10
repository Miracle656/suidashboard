import { Link } from "react-router";
import { AppLayout } from "../../components/layout/AppLayout";
import { useGetCoins } from "../../hooks/useCoins/useGetCoins";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, RefreshCw } from "lucide-react";

function AccountCoins() {
  const {
    coins,
    coinCount,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    clearCache,
  } = useGetCoins();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "coinName",
      header: "Coin",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.imgUrl} alt={row.original.coinName} />
            <AvatarFallback>{row.original.coinSymbol?.charAt(0) || "C"}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/coins/coin-details/${encodeURIComponent(row.original.coinType)}`}
              className="font-medium hover:underline flex items-center gap-1"
            >
              {row.original.coinName}
              <ExternalLink className="h-3 w-3" />
            </Link>
            <p className="text-sm text-muted-foreground">{row.original.coinDenom}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "coinSymbol",
      header: "Symbol",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("coinSymbol")}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return <span className="font-mono">{price ? `$${price.toFixed(6)}` : "N/A"}</span>;
      },
    },
    {
      accessorKey: "marketCap",
      header: "Market Cap",
      cell: ({ row }) => {
        const marketCap = row.getValue("marketCap") as number;
        return <span className="font-mono">{marketCap ? `$${marketCap.toLocaleString()}` : "N/A"}</span>;
      },
    },
    {
      accessorKey: "totalVolume",
      header: "Volume",
      cell: ({ row }) => {
        const volume = row.getValue("totalVolume") as number;
        return <span className="font-mono">{volume ? `$${volume.toLocaleString()}` : "N/A"}</span>;
      },
    },
    {
      accessorKey: "holdersCount",
      header: "Holders",
      cell: ({ row }) => {
        const holders = row.getValue("holdersCount") as number;
        return <span>{holders?.toLocaleString() || "N/A"}</span>;
      },
    },
    {
      accessorKey: "isVerified",
      header: "Status",
      cell: ({ row }) => {
        const verified = row.getValue("isVerified") as boolean;
        return (
          <Badge variant={verified ? "default" : "secondary"}>
            {verified ? "Verified" : "Unverified"}
          </Badge>
        );
      },
    },
  ];

  if (loading) {
    return (
      <AppLayout>
        <LoadingSpinner size="lg" />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error: {error.message}
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
            <h1 className="text-3xl font-bold tracking-tight">All Coins</h1>
            <p className="text-muted-foreground">
              {coinCount?.toLocaleString()} coins available on the Sui network
            </p>
          </div>
          <Button
            onClick={() => {
              clearCache();
              window.location.reload();
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "coinName",
      header: "Coin",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.imgUrl} alt={row.original.coinName} />
            <AvatarFallback>{row.original.coinSymbol?.charAt(0) || "C"}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/coins/coin-details/${encodeURIComponent(row.original.coinType)}`}
              className="font-medium hover:underline flex items-center gap-1"
            >
              {row.original.coinName}
              <ExternalLink className="h-3 w-3" />
            </Link>
            <p className="text-sm text-muted-foreground">{row.original.coinDenom}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "coinSymbol",
      header: "Symbol",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("coinSymbol")}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return <span className="font-mono">{price ? `$${price.toFixed(6)}` : "N/A"}</span>;
      },
    },
    {
      accessorKey: "marketCap",
      header: "Market Cap",
      cell: ({ row }) => {
        const marketCap = row.getValue("marketCap") as number;
        return <span className="font-mono">{marketCap ? `$${marketCap.toLocaleString()}` : "N/A"}</span>;
      },
    },
    {
      accessorKey: "totalVolume",
      header: "Volume",
      cell: ({ row }) => {
        const volume = row.getValue("totalVolume") as number;
        return <span className="font-mono">{volume ? `$${volume.toLocaleString()}` : "N/A"}</span>;
      },
    },
    {
      accessorKey: "holdersCount",
      header: "Holders",
      cell: ({ row }) => {
        const holders = row.getValue("holdersCount") as number;
        return <span>{holders?.toLocaleString() || "N/A"}</span>;
      },
    },
    {
      accessorKey: "isVerified",
      header: "Status",
      cell: ({ row }) => {
        const verified = row.getValue("isVerified") as boolean;
        return (
          <Badge variant={verified ? "default" : "secondary"}>
            {verified ? "Verified" : "Unverified"}
          </Badge>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Coins</h1>
            <p className="text-muted-foreground">
              {coinCount?.toLocaleString()} coins available on the Sui network
            </p>
          </div>
          <Button
            onClick={() => {
              clearCache();
              window.location.reload();
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Coins Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sui Coins</CardTitle>
            <CardDescription>
              Page {currentPage + 1} of {totalPages} • {coinCount?.toLocaleString()} total coins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={coins || []} 
              searchKey="coinName"
              downloadFileName={`sui_coins_page_${currentPage + 1}`}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default AccountCoins;
