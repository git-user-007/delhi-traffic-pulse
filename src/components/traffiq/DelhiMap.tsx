import { useState } from "react";
import { zones, levelColor, type Zone } from "@/lib/traffic-data";
import { Sticker } from "./Sticker";

export function DelhiMap({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<Zone | null>(null);

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-3">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-border"
        style={{ aspectRatio: compact ? "16 / 10" : "16 / 9", background: "var(--muted)" }}
      >
        {/* map base */}
        <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <rect width="100" height="60" fill="var(--muted)" />
          {/* green areas */}
          <ellipse cx="46" cy="40" rx="9" ry="6" fill="var(--signal-green)" opacity="0.13" />
          <ellipse cx="72" cy="18" rx="7" ry="5" fill="var(--signal-green)" opacity="0.1" />
          {/* river */}
          <path
            d="M64 0 C60 12, 70 22, 64 32 C58 44, 68 52, 62 60"
            stroke="var(--chart-2)"
            strokeOpacity="0.35"
            strokeWidth="2.2"
            fill="none"
          />
          {/* ring roads */}
          <circle cx="50" cy="30" r="20" fill="none" stroke="var(--border)" strokeWidth="1.2" />
          <circle cx="50" cy="30" r="12" fill="none" stroke="var(--border)" strokeWidth="1" />
          {/* radial roads */}
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={(50 + Math.cos(a) * 5).toFixed(3)}
                y1={(30 + Math.sin(a) * 5).toFixed(3)}
                x2={(50 + Math.cos(a) * 52).toFixed(3)}
                y2={(30 + Math.sin(a) * 42).toFixed(3)}
                stroke="var(--border)"
                strokeWidth="0.8"
              />
            );
          })}
          <line x1="0" y1="30" x2="100" y2="30" stroke="var(--border)" strokeWidth="1.2" />
        </svg>

        {/* markers */}
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => setActive(active?.id === z.id ? null : z)}
            className="group absolute -translate-x-1/2 -translate-y-full transition-transform duration-200 hover:scale-110 focus:outline-none"
            style={{ left: `${z.x}%`, top: `${z.y}%` }}
            aria-label={z.name}
          >
            <span
              className="block h-6 w-6 rounded-full rounded-bl-none border-2 border-background shadow-lg"
              style={{ background: levelColor[z.level], transform: "rotate(-45deg)" }}
            />
            <span className="pointer-events-none absolute left-1/2 top-7 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background group-hover:block">
              {z.name}
            </span>
          </button>
        ))}

        {/* legend */}
        <div className="glass absolute bottom-3 left-3 flex gap-3 rounded-xl px-3 py-2 text-[11px] font-semibold">
          {(["Low", "Moderate", "High"] as const).map((l) => (
            <span key={l} className="flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: levelColor[l] }} />
              {l}
            </span>
          ))}
        </div>

        {active && (
          <div className="glass absolute right-3 top-3 w-56 animate-scale-in rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 truncate font-display text-sm font-bold">{active.name}</p>
              <button
                onClick={() => setActive(null)}
                className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <p
              className="mt-1 text-xs font-bold uppercase tracking-widest"
              style={{ color: levelColor[active.level] }}
            >
              {active.level} congestion
            </p>
            <dl className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Vehicles</dt>
                <dd className="font-semibold">{active.vehicles.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Avg speed</dt>
                <dd className="font-semibold">{active.speed} km/h</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Predicted</dt>
                <dd className="font-semibold" style={{ color: levelColor[active.predicted] }}>
                  {active.predicted}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <Sticker tone="yellow" rotate={4} className="absolute left-3 top-3">
          Delhi moves different.
        </Sticker>
      </div>
    </div>
  );
}
