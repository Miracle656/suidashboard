import { useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { useWalrusAccount } from "../../hooks/usewalrus/useWalrusAccount";
import { useWalrusValidators } from "../../hooks/usewalrus/useWalrusValidators";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetricCard } from "@/components/charts/MetricCard";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

function Accounts() {
  const [accountPage, setAccountPage] = useState(0);
  const [validatorPage, setValidatorPage] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { accountData, loading: accountLoading, error: accountError } = useWalrusAccount(accountPage);
  const { validatorsData, loading: validatorLoading, error: validatorError } = useWalrusValidators(validatorPage);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(value);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Account columns
  const accountColumns: ColumnDef<any>[] = [
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{row.getValue("address")}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(row.getValue("address"))}
          >
            {copiedId === row.getValue("address") ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => (
        <span className="font-mono">{Number(row.getValue("balance")).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "blobs",
      header: "Blobs",
    },
    {
      accessorKey: "events",
      header: "Events",
    },
    {
      accessorKey: "firstSeen",
      header: "First Seen",
      cell: ({ row }) => (
        <span className="text-sm">{new Date(row.getValue("firstSeen")).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: "lastSeen",
      header: "Last Seen",
      cell: ({ row }) => (
        <span className="text-sm">{new Date(row.getValue("lastSeen")).toLocaleDateString()}</span>
      ),
    },
  ];

  // Validator columns
  const validatorColumns: ColumnDef<any>[] = [
    {
      accessorKey: "validatorName",
      header: "Validator",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.imageUrl} />
            <AvatarFallback>{row.original.validatorName?.charAt(0) || "V"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.validatorName}</div>
            {row.original.projectUrl && (
              <a
                href={row.original.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
              >
                Website <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "stake",
      header: "Stake",
      cell: ({ row }) => (
        <span className="font-mono">{Number(row.getValue("stake") || 0).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "commissionRate",
      header: "Commission",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("commissionRate") || 0}%</Badge>
      ),
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <Badge variant={row.getValue("state") === "Active" ? "default" : "secondary"}>
          {row.getValue("state") || "Unknown"}
        </Badge>
      ),
    },
    {
      accessorKey: "poolShare",
      header: "Pool Share",
      cell: ({ row }) => (
        <span>{row.getValue("poolShare") || "N/A"}</span>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Walrus Network</h1>
          <p className="text-muted-foreground">
            Accounts and validators on the Walrus storage network
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Accounts"
            value={accountData?.totalElements || 0}
            description="Registered accounts"
          />
          <MetricCard
            title="Total Validators"
            value={validatorsData?.totalElements || 0}
            description="Active validators"
          />
          <MetricCard
            title="Account Pages"
            value={accountData?.totalPages || 0}
            description="Available pages"
          />
          <MetricCard
            title="Validator Pages"
            value={validatorsData?.totalPages || 0}
            description="Available pages"
          />
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="validators">Validators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Walrus Accounts</CardTitle>
                <CardDescription>
                  All registered accounts on the Walrus network
                </CardDescription>
              </CardHeader>
              <CardContent>
                {accountLoading ? (
                  <LoadingSpinner />
                ) : accountError ? (
                  <div className="text-center text-destructive">
                    Error: {accountError.message}
                  </div>
                ) : (
                  <DataTable 
                    columns={accountColumns} 
                    data={accountData?.content || []} 
                    searchKey="address"
                    downloadFileName={`walrus_accounts_page_${accountPage + 1}`}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Walrus Validators</CardTitle>
                <CardDescription>
                  Network validators and their performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {validatorLoading ? (
                  <LoadingSpinner />
                ) : validatorError ? (
                  <div className="text-center text-destructive">
                    Error: {validatorError.message}
                  </div>
                ) : (
                  <DataTable 
                    columns={validatorColumns} 
                    data={validatorsData?.content || []} 
                    searchKey="validatorName"
                    downloadFileName={`walrus_validators_page_${validatorPage + 1}`}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

export default Accounts;
