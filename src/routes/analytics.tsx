import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/traffiq/AppShell";
import {
  CongestionByHour,
  DistributionChart,
  LocationCompareChart,
  SpeedChart,
  VehicleCountChart,
} from "@/components/traffiq/charts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Traffic Analytics — TRAFFIQ Delhi" },
      {
        name: "description",
        content: "Hourly congestion, vehicle volume, speed trends and zone comparisons for Delhi.",
      },
      { property: "og:title", content: "Traffic Analytics — TRAFFIQ" },
      { property: "og:description", content: "Deep-dive charts on Delhi traffic congestion patterns." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Traffic Analytics"
        subtitle="Patterns extracted from 4,974 observations across ten Delhi zones."
        sticker="Data don't lie"
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CongestionByHour />
        <VehicleCountChart />
        <SpeedChart />
        <DistributionChart />
        <div className="xl:col-span-2">
          <LocationCompareChart />
        </div>
      </div>
    </AppShell>
  );
}
