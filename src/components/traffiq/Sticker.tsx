import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const tones = {
  orange: "bg-primary text-primary-foreground",
  yellow: "bg-accent text-accent-foreground",
  dark: "bg-foreground text-background",
  green: "text-background",
} as const;

export function Sticker({
  children,
  tone = "orange",
  rotate = -3,
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("sticker", tones[tone], className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        ...(tone === "green" ? { background: "var(--signal-green)" } : {}),
      }}
    >
      {children}
    </span>
  );
}

export function ScribbleLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn("text-xs italic text-muted-foreground", className)}
      style={{ fontFamily: "var(--font-sticker)" }}
    >
      {children}
    </span>
  );
}
