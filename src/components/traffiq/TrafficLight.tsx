import type { Level } from "@/lib/traffic-data";
import { cn } from "@/lib/utils";

const order: Level[] = ["Low", "Moderate", "High"];
const colors: Record<Level, string> = {
  Low: "var(--signal-green)",
  Moderate: "var(--signal-yellow)",
  High: "var(--signal-red)",
};

export function TrafficLight({
  active,
  horizontal = false,
  size = 18,
}: {
  active: Level;
  horizontal?: boolean;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-foreground/90 p-2",
        horizontal ? "flex-row" : "flex-col",
      )}
    >
      {order.map((l) => {
        const on = l === active;
        return (
          <span
            key={l}
            className="rounded-full transition-all duration-300"
            style={{
              width: size,
              height: size,
              background: on ? colors[l] : "color-mix(in oklab, white 12%, transparent)",
              boxShadow: on ? `0 0 14px 2px ${colors[l]}` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
