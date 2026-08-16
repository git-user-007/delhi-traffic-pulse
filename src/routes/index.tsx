import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Car, Gauge, ShieldCheck, TriangleAlert } from "lucide-react";
import { AppShell, LiveBadge, PageHeader } from "@/components/traffiq/AppShell";
import { KpiCard } from "@/components/traffiq/KpiCard";
import { Sticker, ScribbleLabel } from "@/components/traffiq/Sticker";
import { TrafficLight } from "@/components/traffiq/TrafficLight";
import { DelhiMap } from "@/components/traffiq/DelhiMap";
import { CongestionByHour, DistributionChart } from "@/components/traffiq/charts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRAFFIQ — Delhi Traffic Intelligence Dashboard" },
      {
        name: "description",
        content:
          "Monitor, analyze and predict traffic congestion across Delhi with a machine learning powered dashboard.",
      },
      { property: "og:title", content: "TRAFFIQ — Delhi Traffic Intelligence" },
      {
        property: "og:description",
        content: "Live congestion, ML predictions and analytics for Delhi traffic.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <section className="glass grain relative mb-6 overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full opacity-25 blur-3xl heat-bg"
        />
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <LiveBadge />
            <h1 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
              Delhi Traffic <span className="heat-text">Intelligence</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Monitor, analyze and predict congestion across Delhi — powered by a classification
              model trained on 4,974 road observations.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/prediction"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-display text-sm font-bold text-black heat-bg transition-transform hover:scale-[1.03]"
              >
                Predict congestion
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Open Delhi map
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            <Sticker rotate={5}>Traffic is wild 🚦</Sticker>
            <Sticker tone="dark" rotate={-6}>
              No more guessing.
            </Sticker>
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Current congestion" value="Moderate" icon={TriangleAlert} accent="accent" trend={{ dir: "up", text: "+6% vs last hour" }} />
        <KpiCard label="Average speed" numeric={32} suffix=" km/h" icon={Gauge} accent="green" trend={{ dir: "down", text: "-4 km/h today" }} />
        <KpiCard label="Vehicles monitored" numeric={4974} icon={Car} accent="primary" trend={{ dir: "up", text: "+312 this hour" }} />
        <KpiCard label="High congestion zones" numeric={18} icon={Activity} accent="red" trend={{ dir: "up", text: "3 new zones" }} />
        <KpiCard label="Model accuracy" numeric={94.2} decimals={1} suffix="%" icon={ShieldCheck} accent="accent" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass grain relative overflow-hidden rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            City traffic status
          </p>
          <div className="mt-4 flex items-center gap-5">
            <TrafficLight active="Moderate" />
            <div className="min-w-0">
              <p
                className="font-display text-4xl font-black leading-none"
                style={{ color: "var(--signal-yellow)" }}
              >
                MODERATE
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Based on current traffic conditions across 10 monitored zones.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {[
              { l: "🟢 Low", v: 37 },
              { l: "🟡 Moderate", v: 39 },
              { l: "🔴 High", v: 24 },
            ].map((r) => (
              <div key={r.l} className="flex items-center gap-3 text-xs">
                <span className="w-24 shrink-0 font-semibold">{r.l}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full heat-bg transition-all duration-700"
                    style={{ width: `${r.v}%` }}
                  />
                </span>
                <span className="w-9 shrink-0 text-right font-semibold">{r.v}%</span>
              </div>
            ))}
          </div>
          <ScribbleLabel className="mt-4 block">updated 12 seconds ago ↗</ScribbleLabel>
        </div>
        <div className="lg:col-span-2">
          <CongestionByHour />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DelhiMap compact />
        </div>
        <DistributionChart />
      </div>
    </AppShell>
  );
}
