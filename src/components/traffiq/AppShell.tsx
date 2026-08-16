import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Brain,
  Database,
  Gauge,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sticker } from "./Sticker";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/prediction", label: "Traffic Prediction", icon: Brain },
  { to: "/live", label: "Live Traffic", icon: Activity },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/map", label: "Delhi Map", icon: Map },
  { to: "/dataset", label: "Dataset", icon: Database },
  { to: "/model", label: "Model Performance", icon: Gauge },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Logo() {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl heat-bg">
        <span className="absolute inset-0 rounded-xl blur-md opacity-60 heat-bg" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor">
          <path d="M4 21 L10 3 h4 l6 18" stroke="black" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 6v3M12 12v3M12 18v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-lg font-extrabold tracking-tight">
          TRAFFIQ
        </span>
        <span className="block truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Delhi Traffic Intelligence
        </span>
      </span>
    </div>
  );
}

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("traffiq-theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("traffiq-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_var(--primary)]"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <div className="mt-auto space-y-3 pt-4">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-secondary/60 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <span className="flex items-center gap-2">
          {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {dark ? "Dark mode" : "Light mode"}
        </span>
        <span className="relative h-5 w-9 rounded-full bg-muted">
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full transition-all duration-300 heat-bg",
              dark ? "left-4" : "left-0.5",
            )}
          />
        </span>
      </button>
      <div className="flex items-center gap-3 rounded-xl border border-border p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full heat-bg font-display text-sm font-black text-black">
          H
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Harshita</p>
          <p className="truncate text-[11px] text-muted-foreground">ML Engineer</p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(700px circle at 12% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 60%), radial-gradient(600px circle at 90% 10%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 55%)",
        }}
      />

      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/60 p-4 backdrop-blur-xl lg:flex">
        <Logo />
        <div className="my-5 h-px hazard-stripes opacity-40" style={{ height: 3 }} />
        <NavList />
        <SidebarFooter dark={dark} toggle={toggle} />
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo />
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 animate-slide-in-right flex-col border-r border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close navigation" className="shrink-0 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="my-5 hazard-stripes opacity-40" style={{ height: 3 }} />
            <NavList onNavigate={() => setOpen(false)} />
            <SidebarFooter dark={dark} toggle={toggle} />
          </div>
        </div>
      )}

      <main className="relative lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        <footer className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 pb-10 pt-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <Sticker tone="dark" rotate={-2}>
            AI on duty 🤖
          </Sticker>
          <span>TRAFFIQ · Delhi Traffic Intelligence · demo data</span>
        </footer>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  sticker,
  children,
}: {
  title: string;
  subtitle: string;
  sticker?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          {sticker && (
            <Sticker tone="yellow" rotate={-4}>
              {sticker}
            </Sticker>
          )}
        </div>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </header>
  );
}

export function LiveBadge() {
  return (
    <span className="glass inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest">
      <span
        className="live-dot h-2 w-2 rounded-full"
        style={{ background: "var(--signal-green)" }}
      />
      System online
    </span>
  );
}
