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

interface PriceData {
  domainLengthFrom: number;
  domainLengthTo: number;
  priceMist: number;
  priceUSDC: number;
}

interface SuinsPricingTableProps {
  prices: PriceData[];
}

export function SuinsPricingTable({ prices }: SuinsPricingTableProps) {
  const downloadCSV = () => {
    const headers = ["Domain Length From", "Domain Length To", "Price (MIST)", "Price (USDC)"];
    const csvContent = [
      headers.join(","),
      ...prices.map(price => [
        price.domainLengthFrom,
        price.domainLengthTo,
        price.priceMist,
        price.priceUSDC.toFixed(6)
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suins-pricing.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatMist = (mist: number) => {
    return mist.toLocaleString();
  };

  const formatUSDC = (usdc: number) => {
    return usdc.toFixed(6);
  };

  const getDomainLengthRange = (from: number, to: number) => {
    if (from === to) return `${from} chars`;
    return `${from}-${to} chars`;
  };

  const getPriceCategory = (usdc: number) => {
    if (usdc >= 1000) return "premium";
    if (usdc >= 100) return "high";
    if (usdc >= 10) return "medium";
    return "low";
  };

  const getPriceBadgeVariant = (category: string) => {
    switch (category) {
      case "premium": return "destructive";
      case "high": return "secondary";
      case "medium": return "outline";
      case "low": return "default";
      default: return "outline";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">SuiNS Pricing Table</h3>
          <p className="text-sm text-muted-foreground">
            Pricing based on domain name length ({prices.length} tiers)
          </p>
        </div>
        <Button onClick={downloadCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain Length</TableHead>
              <TableHead>Length Range</TableHead>
              <TableHead className="text-right">Price (MIST)</TableHead>
              <TableHead className="text-right">Price (USDC)</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.map((price, index) => {
              const category = getPriceCategory(price.priceUSDC);
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {getDomainLengthRange(price.domainLengthFrom, price.domainLengthTo)}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {price.domainLengthFrom} → {price.domainLengthTo}
                    </code>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatMist(price.priceMist)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${formatUSDC(price.priceUSDC)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriceBadgeVariant(category)}>
                      {category}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>• Premium: $1000+ • High: $100-999 • Medium: $10-99 • Low: &lt;$10</p>
        <p>• Prices are for annual registration/renewal</p>
      </div>
    </Card>
  );
}