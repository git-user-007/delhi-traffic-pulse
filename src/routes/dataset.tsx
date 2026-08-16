import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/traffiq/AppShell";
import { datasetRows, levelColor, zones, type Level } from "@/lib/traffic-data";

export const Route = createFileRoute("/dataset")({
  head: () => ({
    meta: [
      { title: "Dataset Explorer — TRAFFIQ Delhi" },
      {
        name: "description",
        content: "Explore the Delhi traffic dataset: 4,974 records, 9 features, congestion labels.",
      },
      { property: "og:title", content: "Dataset Explorer — TRAFFIQ" },
      { property: "og:description", content: "Searchable, filterable view of the Delhi traffic dataset." },
    ],
  }),
  component: DatasetPage,
});

function Badge({ level }: { level: Level }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
      style={{
        background: `color-mix(in oklab, ${levelColor[level]} 20%, transparent)`,
        color: levelColor[level],
      }}
    >
      {level}
    </span>
  );
}

function DatasetPage() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<"All" | Level>("All");

  const rows = useMemo(
    () =>
      datasetRows.filter(
        (r) =>
          (level === "All" || r.level === level) &&
          (q === "" ||
            r.location.toLowerCase().includes(q.toLowerCase()) ||
            r.weather.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, level],
  );

  return (
    <AppShell>
      <PageHeader
        title="Dataset"
        subtitle="Delhi Traffic Dataset — the raw fuel behind every prediction."
        sticker="4,974 rows deep"
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {[
          ["Records", "4,974"],
          ["Features", "9"],
          ["Missing values", "0"],
          ["Duplicates", "12"],
          ["Zones", String(zones.length)],
        ].map(([k, v]) => (
          <div key={k} className="glass rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
            <p className="mt-1 font-display text-xl font-black">{v}</p>
          </div>
        ))}
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-4 sm:flex sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search location or weather…"
              className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex shrink-0 gap-1 rounded-xl border border-border p-1">
            {(["All", "Low", "Moderate", "High"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors " +
                  (level === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")
                }
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[560px] overflow-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="sticky top-0 bg-card/95 backdrop-blur">
              <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                {["#", "Location", "Hour", "Route density", "Vehicles", "Avg speed", "Weather", "Congestion"].map(
                  (h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border/70 transition-colors hover:bg-secondary/50">
                  <td className="px-4 py-2.5 text-muted-foreground">{r.id}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-medium">{r.location}</td>
                  <td className="px-4 py-2.5">{String(r.hour).padStart(2, "0")}:00</td>
                  <td className="whitespace-nowrap px-4 py-2.5">{r.density}</td>
                  <td className="px-4 py-2.5">{r.vehicles.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-2.5">{r.speed} km/h</td>
                  <td className="px-4 py-2.5">{r.weather}</td>
                  <td className="px-4 py-2.5">
                    <Badge level={r.level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          Showing {rows.length} of {datasetRows.length} sampled rows.
        </p>
      </div>
    </AppShell>
  );
}
