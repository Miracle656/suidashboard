import React from "react";
import { AppLayout as Layout } from "../../components/layout/AppLayout";
import { WalletStatus } from "../../WalletStatus";
import { ChartsSection } from "../../components/charts/ChartsSection";
import { usePoolsData } from "../../hooks/useDeep/usePoolsData";
import { StatsCards } from "../../components/cards/StatsCards";
import { useStatsData } from "../../hooks/useStatsData";

function Usage() {
  const { suidata } = usePoolsData();
  const { suiStats } = useStatsData();

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#292929]">
            Stablecoins - Usage
          </h2>
          <p className="text-[#292929] mt-1">
            Usage patterns across apps and protocols.
          </p>
        </div>
        <StatsCards stats={suiStats} />
        <ChartsSection
          data={suidata}
          valueField="liqUsd"
          labelField="pool"
          symbolField="symbol"
        />
      </main>
      <WalletStatus />
    </Layout>
  );
}

export default Usage;
