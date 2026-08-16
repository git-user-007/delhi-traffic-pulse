import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/traffiq/AppShell";
import { DelhiMap } from "@/components/traffiq/DelhiMap";
import { levelColor, zones } from "@/lib/traffic-data";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Delhi Traffic Map — TRAFFIQ" },
      {
        name: "description",
        content: "Interactive Delhi congestion map with colour-coded markers for every monitored zone.",
      },
      { property: "og:title", content: "Delhi Traffic Map — TRAFFIQ" },
      { property: "og:description", content: "Click any marker for congestion, speed and predictions." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <AppShell>
      <PageHeader
        title="Delhi Map"
        subtitle="Click a marker to inspect congestion, vehicle counts and the next-hour prediction."
        sticker="Delhi moves different."
      />
      <DelhiMap />
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {zones.map((z) => (
          <div key={z.id} className="glass flex items-center gap-3 rounded-2xl p-4">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: levelColor[z.level], boxShadow: `0 0 12px ${levelColor[z.level]}` }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{z.name}</p>
              <p className="text-xs text-muted-foreground">
                {z.vehicles.toLocaleString("en-IN")} veh · {z.speed} km/h
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              {z.level}
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
