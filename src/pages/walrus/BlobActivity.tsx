import React from "react";
import { AppLayout as Layout } from "../../components/layout/AppLayout";
import { WalletStatus } from "../../WalletStatus";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { StatsCards } from "../../components/cards/StatsCards";
import { useStatsData } from "../../hooks/useStatsData";

function BlobActivity() {
  const { waldata } = usePoolsData();
  const { suiStats } = useStatsData();

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#292929]">
            Walrus - Blob Activity
          </h2>
          <p className="text-[#292929] mt-1">
            Recent activity across blob storage.
          </p>
        </div>
        <StatsCards stats={suiStats} />
        <ChartsSection
          data={waldata}
          valueField="liqUsd"
          labelField="pool"
          symbolField="coinA"
        />
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default BlobActivity;
