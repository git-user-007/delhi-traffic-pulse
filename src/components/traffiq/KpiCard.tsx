import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CountUp } from "./CountUp";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  numeric,
  decimals = 0,
  suffix,
  icon: Icon,
  trend,
  accent = "primary",
}: {
  label: string;
  value?: string;
  numeric?: number;
  decimals?: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: { dir: "up" | "down"; text: string };
  accent?: "primary" | "accent" | "green" | "red";
}) {
  const accentVar =
    accent === "primary"
      ? "var(--primary)"
      : accent === "accent"
        ? "var(--accent)"
        : accent === "green"
          ? "var(--signal-green)"
          : "var(--signal-red)";

  return (
    <div className="glass grain group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:glow-ring">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-50"
        style={{ background: accentVar }}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
          style={{ background: `color-mix(in oklab, ${accentVar} 18%, transparent)`, color: accentVar }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold tracking-tight">
        {numeric !== undefined ? (
          <CountUp value={numeric} decimals={decimals} suffix={suffix ?? ""} />
        ) : (
          value
        )}
      </p>
      {trend && (
        <p
          className={cn("mt-1 flex items-center gap-1 text-xs font-medium")}
          style={{ color: trend.dir === "up" ? "var(--signal-red)" : "var(--signal-green)" }}
        >
          {trend.dir === "up" ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {trend.text}
        </p>
      )}
    </div>
  );
}
