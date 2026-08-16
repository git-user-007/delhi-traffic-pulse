import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/traffiq/AppShell";
import { Sticker } from "@/components/traffiq/Sticker";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TRAFFIQ Delhi" },
      { name: "description", content: "Configure alerts, refresh interval and monitoring preferences in TRAFFIQ." },
      { property: "og:title", content: "Settings — TRAFFIQ" },
      { property: "og:description", content: "Tune your Delhi traffic monitoring preferences." },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { k: "High congestion alerts", d: "Notify me when a zone crosses the high threshold." },
  { k: "Prediction auto-refresh", d: "Re-run the model every 5 minutes." },
  { k: "Weather signals", d: "Include rain and fog data in predictions." },
  { k: "Sticker mode", d: "Keep the playful labels around the dashboard." },
];

function SettingsPage() {
  const [on, setOn] = useState<Record<string, boolean>>({
    "High congestion alerts": true,
    "Prediction auto-refresh": true,
    "Weather signals": false,
    "Sticker mode": true,
  });

  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Tune how TRAFFIQ monitors Delhi for you." sticker="Your rules" />
      <div className="glass max-w-2xl rounded-3xl p-6">
        <div className="space-y-4">
          {toggles.map((t) => (
            <div key={t.k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border/70 pb-4 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{t.k}</p>
                <p className="text-xs text-muted-foreground">{t.d}</p>
              </div>
              <button
                onClick={() => setOn((s) => ({ ...s, [t.k]: !s[t.k] }))}
                aria-label={t.k}
                className="relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors"
                style={{ background: on[t.k] ? "var(--primary)" : "var(--muted)" }}
              >
                <span
                  className="absolute top-0.5 h-4.5 w-4.5 rounded-full bg-background transition-all duration-300"
                  style={{ left: on[t.k] ? 22 : 3, height: 18, width: 18 }}
                />
              </button>
            </div>
          ))}
        </div>
        <Sticker tone="dark" rotate={-3} className="mt-6">
          Traffic is wild 🚦
        </Sticker>
      </div>
    </AppShell>
  );
}
