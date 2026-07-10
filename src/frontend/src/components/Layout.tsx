import { useIsMobile } from "@/hooks/use-mobile";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileBarChart2,
  Filter,
  GitMerge,
  LayoutDashboard,
  List,
  LogIn,
  LogOut,
  RefreshCw,
  ScrollText,
  Search,
  Server,
  Settings2,
  Shield,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import React from "react";
import {
  ProviderFilterProvider,
  useProviderFilter,
} from "../contexts/provider-filter";
import {
  useAssets,
  useComplianceStatus,
  useCorrelatedIncidents,
  useGlobalSearch,
  useNormalizedAlerts,
  usePipelineHealth,
} from "../hooks/use-backend";

const navLinks = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard_link",
  },
  {
    to: "/settings",
    label: "Cloud Settings",
    icon: Settings2,
    ocid: "nav.settings_link",
  },
  {
    to: "/findings",
    label: "Raw Findings",
    icon: List,
    ocid: "nav.findings_link",
  },
  {
    to: "/alerts",
    label: "SIEM / Alerts",
    icon: ShieldAlert,
    ocid: "nav.alerts_link",
  },
  {
    to: "/correlation",
    label: "Threat Intelligence",
    icon: GitMerge,
    ocid: "nav.correlation_link",
  },
  {
    to: "/assets",
    label: "Asset Inventory",
    icon: Server,
    ocid: "nav.assets_link",
  },
  {
    to: "/compliance",
    label: "Compliance",
    icon: ClipboardCheck,
    ocid: "nav.compliance_link",
  },
  {
    to: "/notifications",
    label: "Incident Response",
    icon: Bell,
    ocid: "nav.notifications_link",
  },
  {
    to: "/audit",
    label: "Audit Log",
    icon: ScrollText,
    ocid: "nav.audit_link",
  },
  {
    to: "/reports",
    label: "Reports",
    icon: FileBarChart2,
    ocid: "nav.reports_link",
  },
];

function HeaderSearch() {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [debounced, setDebounced] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 400);
    return () => clearTimeout(t);
  }, [q]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data: searchData, isLoading } = useGlobalSearch(debounced, "");
  const displayed = (searchData?.results ?? []).slice(0, 8);
  const showDropdown = open && debounced.length >= 2;

  return (
    <div ref={ref} className="relative w-full" data-ocid="header.search">
      <div className="relative">
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          data-ocid="header.search_input"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search alerts, assets..."
          className="w-full rounded-md border border-border bg-background pl-7 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors font-mono"
        />
        {isLoading && debounced.length >= 2 ? (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : q ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setDebounced("");
              setOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <XCircle size={12} />
          </button>
        ) : null}
      </div>
      {showDropdown && (
        <div
          data-ocid="header.search.popover"
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-md shadow-lg overflow-hidden max-h-80 overflow-y-auto"
        >
          {displayed.length === 0 && !isLoading ? (
            <div className="py-6 text-center text-muted-foreground font-mono text-xs">
              No results
            </div>
          ) : (
            displayed.map((r) => (
              <button
                key={r.id}
                type="button"
                data-ocid="header.search_result"
                onClick={() => setOpen(false)}
                className="w-full flex items-start gap-2 px-3 py-2 hover:bg-muted/20 transition-colors border-b border-border/50 last:border-0 text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {r.title}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground truncate">
                    {r.description.slice(0, 50)}
                    {r.description.length > 50 ? "…" : ""}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function HeaderRefresh() {
  const queryClient = useQueryClient();
  const [lastRefresh, setLastRefresh] = React.useState(new Date());

  const handleRefresh = React.useCallback(() => {
    queryClient.invalidateQueries();
    setLastRefresh(new Date());
  }, [queryClient]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="flex items-center gap-1.5">
      <span
        data-ocid="header.last_refresh_time"
        className="font-mono text-[10px] text-muted-foreground hidden lg:block"
      >
        {formatTime(lastRefresh)}
      </span>
      <button
        type="button"
        data-ocid="header.refresh_button"
        onClick={handleRefresh}
        className="flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
        aria-label="Refresh data"
      >
        <RefreshCw size={12} />
      </button>
    </div>
  );
}

function NotificationBell() {
  const { data: alerts } = useNormalizedAlerts({
    customer: "",
    limit: 50,
    status: "Open" as const,
  } as Parameters<typeof useNormalizedAlerts>[0]);
  const unread = Math.min(
    (alerts ?? []).filter((a) => a.status === "Open").length,
    99,
  );

  return (
    <button
      type="button"
      data-ocid="header.notification_bell"
      className="relative flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
      aria-label={`${unread} unread notifications`}
    >
      <Bell size={14} />
      {unread > 0 && (
        <span
          data-ocid="header.notification_badge"
          className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold min-w-[16px] h-[16px] px-0.5 leading-none"
        >
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </button>
  );
}

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(false);
  const { login, clear, identity } = useInternetIdentity();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isLoggedIn = !!identity;
  const { data: pipelineHealth } = usePipelineHealth();
  const { selectedProvider, setSelectedProvider } = useProviderFilter();
  const totalFailedIngestions = pipelineHealth
    ? pipelineHealth.reduce((sum, s) => sum + Number(s.failedIngestionCount), 0)
    : 0;

  const sidebarW = collapsed ? "w-14" : "w-56";

  const activeLabel =
    navLinks.find((l) =>
      l.to === "/" ? pathname === "/" : pathname.startsWith(l.to),
    )?.label ??
    (pathname.startsWith("/failed-ingestions")
      ? "Failed Ingestions"
      : pathname.startsWith("/assets/")
        ? "Asset Inventory"
        : "Overview");

  return (
    <ProviderFilterProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-30 flex h-full flex-col bg-card border-r border-border transition-smooth ${sidebarW} ${isMobile && collapsed ? "-translate-x-full" : "translate-x-0"}`}
        >
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-3.5 py-4 border-b border-border">
            <Shield size={20} className="text-primary shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-display font-bold text-sm text-foreground truncate leading-tight">
                  DEFENDER OPS
                </p>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  Threat Monitoring
                </p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
            {navLinks.map(({ to, label, icon: Icon, ocid }) => {
              const isActive =
                to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  data-ocid={ocid}
                  className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-smooth group
                    ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/25"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
                    }`}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
            {/* Failed Ingestions with alert badge */}
            {(() => {
              const to = "/failed-ingestions";
              const isActive = pathname.startsWith(to);
              const hasFailed = totalFailedIngestions > 0;
              return (
                <Link
                  to={to}
                  data-ocid="nav.failed_ingestions_link"
                  className={`relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-smooth group
                    ${
                      isActive
                        ? "bg-destructive/15 text-destructive border border-destructive/25"
                        : hasFailed
                          ? "text-destructive/80 hover:bg-destructive/10 hover:text-destructive border border-transparent"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
                    }`}
                >
                  <XCircle
                    size={16}
                    className={`shrink-0 ${
                      isActive || hasFailed
                        ? "text-destructive"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate">Failed Ingestions</span>
                  )}
                  {!collapsed && hasFailed && (
                    <span
                      data-ocid="nav.failed_ingestions_badge"
                      className="inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold min-w-[18px] h-[18px] px-1"
                    >
                      {totalFailedIngestions > 99
                        ? "99+"
                        : totalFailedIngestions}
                    </span>
                  )}
                  {collapsed && hasFailed && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Link>
              );
            })()}
          </nav>

          {/* Collapse toggle */}
          <div className="px-2 pb-3">
            <button
              type="button"
              data-ocid="nav.collapse_button"
              onClick={() => setCollapsed((c) => !c)}
              className="w-full flex items-center justify-center gap-2 rounded-md px-2.5 py-2 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-smooth border border-transparent"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight size={14} />
              ) : (
                <>
                  <ChevronLeft size={14} />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>

          {/* Footer branding */}
          {!collapsed && (
            <div className="px-3.5 pb-3 border-t border-border pt-3">
              <p className="font-mono text-[10px] text-muted-foreground/50 leading-relaxed">
                © {new Date().getFullYear()} ·{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-smooth"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          )}
        </aside>

        {/* Main area */}
        <div
          className={`flex flex-1 flex-col transition-smooth ${collapsed ? "ml-14" : "ml-56"}`}
        >
          {/* Header */}
          <header className="sticky top-0 z-20 flex items-center gap-3 bg-card border-b border-border px-4 py-2 shadow-sm">
            {/* Page label */}
            <div className="flex items-center gap-2 shrink-0">
              <BarChart3 size={15} className="text-primary" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest hidden md:block">
                {activeLabel}
              </span>
            </div>

            <span className="hidden md:block text-border text-sm">|</span>

            {/* Search box */}
            <div className="flex-1 min-w-0 max-w-xs hidden sm:block">
              <HeaderSearch />
            </div>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              {/* Provider filter indicator */}
              {selectedProvider && (
                <button
                  type="button"
                  data-ocid="header.provider_filter_indicator"
                  onClick={() => setSelectedProvider(null)}
                  className="flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1 text-[11px] font-mono text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Clear provider filter"
                >
                  <Filter size={10} className="text-muted-foreground" />
                  <span
                    className={`font-semibold ${
                      selectedProvider === "AWS"
                        ? "text-orange-400"
                        : selectedProvider === "Azure"
                          ? "text-blue-400"
                          : "text-green-400"
                    }`}
                  >
                    {selectedProvider}
                  </span>
                  <XCircle size={10} className="text-muted-foreground ml-0.5" />
                </button>
              )}

              {/* Last refresh + manual refresh */}
              <HeaderRefresh />

              {/* Notification bell */}
              <NotificationBell />

              {/* Auth */}
              <span className="font-mono text-xs text-muted-foreground hidden lg:block">
                {isLoggedIn ? "SYS_ADMIN" : "GUEST"}
              </span>
              <button
                type="button"
                data-ocid="header.auth_button"
                onClick={isLoggedIn ? clear : login}
                className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 transition-smooth"
              >
                {isLoggedIn ? <LogOut size={13} /> : <LogIn size={13} />}
                <span>{isLoggedIn ? "Logout" : "Login"}</span>
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 bg-background p-5">{children}</main>
        </div>
      </div>
    </ProviderFilterProvider>
  );
}
