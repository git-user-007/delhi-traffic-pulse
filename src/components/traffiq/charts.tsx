import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { distribution, hourly, locationCompare } from "@/lib/traffic-data";
import type { ReactNode } from "react";

export function ChartCard({
  title,
  hint,
  children,
  height = 260,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  height?: number;
}) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-bold">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as never}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--popover-foreground)",
  },
} as const;

export function CongestionByHour() {
  return (
    <ChartCard title="Congestion by Hour" hint="Average congestion index across Delhi (24h)">
      <AreaChart data={hourly} margin={{ left: -20, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="gCong" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.65} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="hour" interval={3} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="congestion"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#gCong)"
        />
      </AreaChart>
    </ChartCard>
  );
}

export function VehicleCountChart() {
  return (
    <ChartCard title="Vehicle Count" hint="Vehicles monitored per hour">
      <BarChart data={hourly} margin={{ left: -20, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="hour" interval={3} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="vehicles" fill="var(--accent)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}

export function SpeedChart() {
  return (
    <ChartCard title="Average Speed" hint="km/h across monitored corridors">
      <LineChart data={hourly} margin={{ left: -20, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="hour" interval={3} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        <Line
          type="monotone"
          dataKey="speed"
          stroke="var(--signal-green)"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ChartCard>
  );
}

export function DistributionChart() {
  return (
    <ChartCard title="Congestion Distribution" hint="Class balance in the dataset">
      <PieChart>
        <Tooltip {...tooltipStyle} />
        <Pie
          data={distribution}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={3}
          stroke="none"
        >
          {distribution.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartCard>
  );
}

export function LocationCompareChart() {
  return (
    <ChartCard title="Location Comparison" hint="Congestion index by zone" height={320}>
      <BarChart data={locationCompare} layout="vertical" margin={{ left: 20, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" {...axis} />
        <YAxis type="category" dataKey="name" width={80} {...axis} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="congestion" radius={[0, 6, 6, 0]}>
          {locationCompare.map((d) => (
            <Cell
              key={d.name}
              fill={
                d.congestion > 70
                  ? "var(--signal-red)"
                  : d.congestion > 45
                    ? "var(--signal-yellow)"
                    : "var(--signal-green)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}
