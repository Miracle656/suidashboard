import React, { useEffect } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { useSuiValidators } from "../../hooks/useSui/useSuiValidators";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetricCard } from "@/components/charts/MetricCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Shield, TrendingUp, Users } from "lucide-react";
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

function SuiValidators() {
  const { validators, validatorsApy, loading, fetchValidators } =
    useSuiValidators();

  useEffect(() => {
    fetchValidators();
  }, []);

  // Chart data
  const chartData = validators?.slice(0, 10).map((validator) => ({
    name: validator.validatorName || "Unknown",
    stake: validator.stakeAmount || 0,
    commission: validator.commissionRate || 0,
    apy: validator.apy || 0,
  })) || [];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  // Table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "validatorName",
      header: "Validator",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.validatorImg} />
            <AvatarFallback>{row.original.validatorName?.charAt(0) || "V"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.validatorName || "Unknown Validator"}</div>
            <div className="text-sm text-muted-foreground font-mono">
              {row.original.validatorAddress?.slice(0, 8)}...{row.original.validatorAddress?.slice(-6)}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "apy",
      header: "APY",
      cell: ({ row }) => {
        const apy = row.getValue("apy") as number;
        return (
          <Badge variant="outline" className="text-green-600">
            {apy ? `${apy.toFixed(2)}%` : "N/A"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "commissionRate",
      header: "Commission",
      cell: ({ row }) => (
        <span>{row.getValue("commissionRate") || 0}%</span>
      ),
    },
    {
      accessorKey: "stakeAmount",
      header: "Stake Amount",
      cell: ({ row }) => {
        const stake = row.getValue("stakeAmount") as number;
        return <span className="font-mono">{stake ? `${stake.toLocaleString()} SUI` : "N/A"}</span>;
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
    {
      id: "social",
      header: "Links",
      cell: ({ row }) => (
        <div className="flex space-x-1">
          {row.original.socialWebsite && (
            <a href={row.original.socialWebsite} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="text-xs">
                Website
              </Badge>
            </a>
          )}
          {row.original.socialTwitter && (
            <a href={row.original.socialTwitter} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="text-xs">
                Twitter
              </Badge>
            </a>
          )}
        </div>
      ),
    },
  ];

  // Calculate metrics
  const totalStake = validators?.reduce((sum, v) => sum + (v.stakeAmount || 0), 0) || 0;
  const verifiedCount = validators?.filter((v) => v.isVerified).length || 0;

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
          <h1 className="text-3xl font-bold tracking-tight">Sui Validators</h1>
          <p className="text-muted-foreground">
            Network validators and staking metrics
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Validators"
            value={validators?.length || 0}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="Active validators"
          />
          <MetricCard
            title="Average APY"
            value={validatorsApy ? `${validatorsApy}%` : "N/A"}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Staking rewards"
          />
          <MetricCard
            title="Total Stake"
            value={`${totalStake.toLocaleString()} SUI`}
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
            description="Network security"
          />
          <MetricCard
            title="Verified Validators"
            value={verifiedCount}
            description="Verified operators"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChartContainer
            title="Top Validators by Stake"
            description="Stake distribution among top validators"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} SUI`, "Stake"]}
                />
                <Bar dataKey="stake" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Stake Distribution"
            description="Network stake distribution"
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
                  dataKey="stake"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} SUI`, "Stake"]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Validators Table */}
        <Card>
          <CardHeader>
            <CardTitle>Network Validators</CardTitle>
            <CardDescription>
              All active validators on the Sui network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={validators || []} 
              searchKey="validatorName"
              downloadFileName="sui_validators"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default SuiValidators;
