import { createFileRoute } from "@tanstack/react-router";
import { AppShell, LiveBadge, PageHeader } from "@/components/traffiq/AppShell";
import { levelColor, zones } from "@/lib/traffic-data";
import { TrafficLight } from "@/components/traffiq/TrafficLight";
import { Sticker } from "@/components/traffiq/Sticker";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Traffic — TRAFFIQ Delhi" },
      { name: "description", content: "Live congestion feed for 10 monitored Delhi corridors." },
      { property: "og:title", content: "Live Traffic — TRAFFIQ" },
      { property: "og:description", content: "Real-time Delhi congestion, speeds and vehicle counts." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  return (
    <AppShell>
      <PageHeader
        title="Live Traffic"
        subtitle="Real-time congestion feed across monitored Delhi corridors."
      >
        <LiveBadge />
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {zones.map((z, i) => (
          <div
            key={z.id}
            className="glass grain group relative overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-bold">{z.name}</h3>
                <p
                  className="mt-1 text-xs font-bold uppercase tracking-widest"
                  style={{ color: levelColor[z.level] }}
                >
                  {z.level} congestion
                </p>
              </div>
              <TrafficLight active={z.level} horizontal size={10} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Vehicles", z.vehicles.toLocaleString("en-IN")],
                ["Speed", `${z.speed} km/h`],
                ["Next hr", z.predicted],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border py-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
                  <p className="mt-0.5 truncate text-sm font-bold">{v}</p>
                </div>
              ))}
            </div>
            {i === 0 && (
              <Sticker tone="orange" rotate={-6} className="absolute -right-2 top-3">
                Hotspot
              </Sticker>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
