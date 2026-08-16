import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/traffiq/AppShell";
import { CountUp } from "@/components/traffiq/CountUp";
import { Sticker } from "@/components/traffiq/Sticker";
import { confusion, featureImportance } from "@/lib/traffic-data";

export const Route = createFileRoute("/model")({
  head: () => ({
    meta: [
      { title: "Model Performance — TRAFFIQ Delhi" },
      {
        name: "description",
        content: "Accuracy, precision, recall, F1, confusion matrix and feature importance of the congestion classifier.",
      },
      { property: "og:title", content: "Model Performance — TRAFFIQ" },
      { property: "og:description", content: "How the Delhi congestion classification model performs." },
    ],
  }),
  component: ModelPage,
});

const metrics = [
  { k: "Accuracy", v: 94.2 },
  { k: "Precision", v: 92.8 },
  { k: "Recall", v: 91.6 },
  { k: "F1 Score", v: 92.2 },
];

const labels = ["Low", "Moderate", "High"];

function ModelPage() {
  const max = Math.max(...confusion.flatMap((r) => r.row));
  return (
    <AppShell>
      <PageHeader
        title="Model Performance"
        subtitle="Gradient boosted classifier trained on the Delhi Traffic Dataset."
        sticker="AI on duty 🤖"
      />

      <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.k} className="glass grain relative overflow-hidden rounded-2xl p-5">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{m.k}</p>
            <p className="mt-2 font-display text-3xl font-black heat-text">
              <CountUp value={m.v} decimals={1} suffix="%" />
            </p>
            <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full heat-bg" style={{ width: `${m.v}%` }} />
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6">
          <h2 className="font-display text-lg font-bold">Model information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Problem", "Traffic Congestion Classification"],
              ["Dataset", "Delhi Traffic Dataset"],
              ["Samples", "4,974+"],
              ["Features", "9"],
              ["Target", "Congestion Level"],
              ["Split", "80 / 20 stratified"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 border-b border-border/70 pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="truncate font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <Sticker tone="green" rotate={-3} className="mt-5">
            Production ready
          </Sticker>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="font-display text-lg font-bold">Confusion matrix</h2>
          <p className="mt-1 text-xs text-muted-foreground">Rows = actual, columns = predicted</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-center text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="p-2" />
                  {labels.map((l) => (
                    <th key={l} className="p-2">
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {confusion.map((r, i) => (
                  <tr key={r.label}>
                    <th className="p-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                      {r.label}
                    </th>
                    {r.row.map((c, j) => (
                      <td key={j} className="p-1">
                        <span
                          className="grid h-14 place-items-center rounded-xl font-display text-base font-bold"
                          style={{
                            background: `color-mix(in oklab, var(--primary) ${Math.round((c / max) * 85)}%, transparent)`,
                            color: i === j ? "var(--primary-foreground)" : "var(--foreground)",
                          }}
                        >
                          {c}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="font-display text-lg font-bold">Feature importance</h2>
          <div className="mt-4 space-y-3">
            {featureImportance.map((f) => (
              <div key={f.feature}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{f.feature}</span>
                  <span className="text-muted-foreground">{(f.value * 100).toFixed(0)}%</span>
                </div>
                <span className="mt-1 block h-2 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full heat-bg transition-all duration-700"
                    style={{ width: `${f.value * 320}%`, maxWidth: "100%" }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
