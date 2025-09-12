import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Asset {
  name: string;
  symbol: string;
  protocol: string;
  change7d: string | number;
  change30d: string | number;
  marketCap: string;
  assetClass: string;
  swapCount?: string | number;
  price?: string | number;
}

interface AssetsTableProps {
  assets: Asset[];
}

export function AssetsTable({ assets }: AssetsTableProps) {
  const downloadCSV = () => {
    const headers = ["Name", "Symbol", "Protocol", "7d Change", "30d Change", "Market Cap", "Asset Class"];
    const csvContent = [
      headers.join(","),
      ...assets.map(asset => [
        asset.name,
        asset.symbol,
        asset.protocol,
        asset.change7d,
        asset.change30d,
        asset.marketCap,
        asset.assetClass
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assets.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatChange = (change: string | number) => {
    if (change === "-" || change === "N/A") return change;
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    if (isNaN(numChange)) return change;
    return numChange > 0 ? `+${numChange.toFixed(2)}%` : `${numChange.toFixed(2)}%`;
  };

  const getChangeColor = (change: string | number) => {
    if (change === "-" || change === "N/A") return "secondary";
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    if (isNaN(numChange)) return "secondary";
    return numChange > 0 ? "default" : "destructive";
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Assets ({assets.length})</h3>
        <Button onClick={downloadCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>7d Change</TableHead>
              <TableHead>30d Change</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>Asset Class</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.symbol}</TableCell>
                <TableCell>{asset.protocol}</TableCell>
                <TableCell>
                  <Badge variant={getChangeColor(asset.change7d)}>
                    {formatChange(asset.change7d)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getChangeColor(asset.change30d)}>
                    {formatChange(asset.change30d)}
                  </Badge>
                </TableCell>
                <TableCell>{asset.marketCap}</TableCell>
                <TableCell>
                  <Badge variant="outline">{asset.assetClass}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}