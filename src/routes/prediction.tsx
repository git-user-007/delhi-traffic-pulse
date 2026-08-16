import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/traffiq/AppShell";
import { Sticker, ScribbleLabel } from "@/components/traffiq/Sticker";
import { TrafficLight } from "@/components/traffiq/TrafficLight";
import { CountUp } from "@/components/traffiq/CountUp";
import { densityOptions, levelColor, weatherOptions, zones, type Level } from "@/lib/traffic-data";

export const Route = createFileRoute("/prediction")({
  head: () => ({
    meta: [
      { title: "Traffic Prediction — TRAFFIQ Delhi" },
      {
        name: "description",
        content: "Predict Delhi road congestion levels from location, hour, density, speed and weather.",
      },
      { property: "og:title", content: "Traffic Prediction — TRAFFIQ" },
      { property: "og:description", content: "ML-powered congestion prediction for Delhi roads." },
    ],
  }),
  component: PredictionPage,
});

interface Result {
  level: Level;
  confidence: number;
  speed: number;
  vehicles: number;
  action: string;
}

const field =
  "w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

function PredictionPage() {
  const [form, setForm] = useState({
    location: zones[0]!.name,
    hour: 9,
    density: "Dense",
    vehicles: 850,
    speed: 24,
    weather: "Clear",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const predict = () => {
    setLoading(true);
    setResult(null);
    const densityScore = densityOptions.indexOf(form.density as (typeof densityOptions)[number]);
    const peak = form.hour >= 8 && form.hour <= 11 ? 1 : form.hour >= 17 && form.hour <= 20 ? 1 : 0;
    const weatherPenalty = ["Rain", "Fog"].includes(form.weather) ? 1 : 0;
    const score =
      densityScore * 1.2 + peak * 1.4 + weatherPenalty + form.vehicles / 700 - form.speed / 25;
    const level: Level = score > 3.6 ? "High" : score > 2 ? "Moderate" : "Low";
    const confidence = Math.min(98, Math.round(78 + Math.abs(score - 2.8) * 6));
    setTimeout(() => {
      setResult({
        level,
        confidence,
        speed: form.speed,
        vehicles: form.vehicles,
        action:
          level === "High"
            ? "Avoid this corridor — reroute via inner ring road or delay travel by 45 minutes."
            : level === "Moderate"
              ? "Expect slowdowns. Leave 15 minutes earlier than usual."
              : "Roads are clear. Good time to travel.",
      });
      setLoading(false);
    }, 700);
  };

  return (
    <AppShell>
      <PageHeader
        title="Traffic Prediction"
        subtitle="Feed road conditions into the model and get an instant congestion classification."
        sticker="No more guessing."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass grain rounded-3xl p-6">
          <h2 className="font-display text-lg font-bold">Input conditions</h2>
          <ScribbleLabel className="mt-1 block">9 features · same schema as training data</ScribbleLabel>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Location</span>
              <select
                className={field}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              >
                {zones.map((z) => (
                  <option key={z.id}>{z.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Hour of day — {form.hour}:00</span>
              <input
                type="range"
                min={0}
                max={23}
                value={form.hour}
                onChange={(e) => setForm({ ...form, hour: Number(e.target.value) })}
                className="mt-3 w-full accent-[var(--primary)]"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Route density</span>
              <select
                className={field}
                value={form.density}
                onChange={(e) => setForm({ ...form, density: e.target.value })}
              >
                {densityOptions.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Vehicle count</span>
              <input
                type="number"
                className={field}
                value={form.vehicles}
                onChange={(e) => setForm({ ...form, vehicles: Number(e.target.value) })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Average speed (km/h)</span>
              <input
                type="number"
                className={field}
                value={form.speed}
                onChange={(e) => setForm({ ...form, speed: Number(e.target.value) })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Weather</span>
              <select
                className={field}
                value={form.weather}
                onChange={(e) => setForm({ ...form, weather: e.target.value })}
              >
                {weatherOptions.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={predict}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-black heat-bg transition-transform hover:scale-[1.01] disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Analyzing roads…" : "Predict congestion"}
          </button>
        </div>

        <div className="relative">
          {!result && !loading && (
            <div className="glass flex h-full min-h-72 flex-col items-center justify-center gap-3 rounded-3xl p-8 text-center">
              <TrafficLight active="Low" size={16} />
              <p className="font-display text-lg font-bold">Awaiting input</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Set the road conditions and run the model to see a predicted congestion level.
              </p>
              <Sticker tone="dark" rotate={-3}>
                AI on duty 🤖
              </Sticker>
            </div>
          )}
          {loading && (
            <div className="glass flex h-full min-h-72 items-center justify-center rounded-3xl p-8">
              <p className="animate-pulse font-display text-sm uppercase tracking-widest text-muted-foreground">
                Running model…
              </p>
            </div>
          )}
          {result && (
            <div
              className="glass grain relative animate-scale-in overflow-hidden rounded-3xl p-6"
              style={{
                boxShadow: `0 0 0 1.5px ${levelColor[result.level]}, 0 20px 60px -22px ${levelColor[result.level]}`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Predicted congestion
                  </p>
                  <p
                    className="mt-2 font-display text-5xl font-black leading-none"
                    style={{ color: levelColor[result.level] }}
                  >
                    {result.level.toUpperCase()}
                  </p>
                </div>
                <TrafficLight active={result.level} />
              </div>

              <div className="mt-6">
                <div className="flex items-end justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Confidence
                  </span>
                  <span className="font-display text-2xl font-black">
                    <CountUp value={result.confidence} suffix="%" />
                  </span>
                </div>
                <span className="mt-2 block h-2.5 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full transition-[width] duration-1000"
                    style={{ width: `${result.confidence}%`, background: levelColor[result.level] }}
                  />
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Expected condition", result.level === "High" ? "Heavy jams" : result.level === "Moderate" ? "Slow moving" : "Free flow"],
                  ["Average speed", `${result.speed} km/h`],
                  ["Vehicle density", `${result.vehicles.toLocaleString("en-IN")} veh/hr`],
                  ["Location", form.location],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border p-3">
                    <dt className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</dt>
                    <dd className="mt-1 truncate font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 rounded-2xl border border-border p-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Recommended action
                </p>
                <p className="mt-1 text-sm font-medium">{result.action}</p>
              </div>

              <Sticker tone="yellow" rotate={4} className="absolute -top-1 right-24">
                Road status: {result.level === "High" ? "chaotic" : "manageable"}
              </Sticker>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
