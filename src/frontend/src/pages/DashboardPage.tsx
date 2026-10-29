import {
  Activity,
  CheckSquare,
  GitMerge,
  RefreshCw,
  RotateCcw,
  Server,
  ShieldAlert,
  Timer,
} from "lucide-react";
import { memo, useMemo } from "react";
import type React from "react";
import { CorrelatedIncidentsPanel } from "../components/CorrelatedIncidentsPanel";
import { Layout } from "../components/Layout";
import { ProviderCards } from "../components/ProviderCards";
import { QuickActionsToolbar } from "../components/QuickActionsToolbar";
import { RiskScoreWidget } from "../components/RiskScoreWidget";
import { SecurityEventFeed } from "../components/SecurityEventFeed";
import { useProviderFilter } from "../contexts/provider-filter";
import {
  useAssets,
  useComplianceStatus,
  useCorrelatedIncidents,
  useGetMyProviders,
  useNormalizedAlerts,
  useRateLimitStates,
  useResetProviderBackoff,
  useThrottleEvents,
} from "../hooks/use-backend";
import type {
  ProviderType,
  RateLimitBackoffState,
  ThrottleEvent,
} from "../types";

// ─── Timestamp helpers ───────────────────────────────────────────────────────

function timestampToDate(ts: bigint): Date | null {
  const date = new Date(Number(ts / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTimestamp(ts: bigint): string {
  const d = timestampToDate(ts);
  if (!d) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "ready";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

// ─── StatCard ────────────────────────────────────────────────────────────────

const StatCard = memo(function StatCard({
  label,
  value,
  isLoading,
  color,
  icon,
  ocid,
}: {
  label: string;
  value: string | number;
  isLoading: boolean;
  color: string;
  icon: React.ReactNode;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="rounded-lg border p-4 flex items-center gap-3"
      style={{ background: "#1a1d27", borderColor: "#2a2d3e" }}
    >
      <div className={`shrink-0 ${color}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">
          {label}
        </p>
        {isLoading ? (
          <div className="mt-1 h-5 w-16 rounded bg-muted/30 animate-pulse" />
        ) : (
          <p className={`font-display text-xl font-bold ${color} tabular-nums`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
});

// ─── ProviderFilterBar ───────────────────────────────────────────────────────

const ProviderFilterBar = memo(function ProviderFilterBar() {
  const { selectedProvider, setSelectedProvider } = useProviderFilter();

  const options: ("AWS" | "Azure" | "GCP" | null)[] = [
    null,
    "AWS",
    "Azure",
    "GCP",
  ];

  const labels: Record<string, string> = {
    all: "All Providers",
    AWS: "AWS",
    Azure: "Azure",
    GCP: "GCP",
  };

  const providerColors: Record<string, string> = {
    AWS: "text-orange-400 border-orange-400/50 bg-orange-400/10",
    Azure: "text-blue-400 border-blue-400/50 bg-blue-400/10",
    GCP: "text-green-400 border-green-400/50 bg-green-400/10",
  };

  return (
    <div
      data-ocid="dashboard.provider_filter"
      className="flex items-center gap-2 flex-wrap"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-1">
        Filter:
      </span>
      {options.map((p) => {
        const key = p ?? "all";
        const isActive = selectedProvider === p;
        const colorCls = p ? providerColors[p] : "";
        return (
          <button
            key={key}
            type="button"
            data-ocid={`dashboard.provider_filter.${key}`}
            onClick={() => setSelectedProvider(p)}
            className={[
              "rounded border px-3 py-1 font-mono text-xs transition-all",
              isActive
                ? p
                  ? colorCls
                  : "border-primary/60 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {labels[key]}
          </button>
        );
      })}
    </div>
  );
});

// ─── RateLimitBackoffPanel ───────────────────────────────────────────────────

const PROVIDER_ACCENT: Record<ProviderType, string> = {
  AWS: "text-orange-400",
  Azure: "text-blue-400",
  GCP: "text-green-400",
};

const PROVIDER_BADGE: Record<ProviderType, string> = {
  AWS: "bg-orange-500/15 text-orange-400 border border-orange-500/40",
  Azure: "bg-blue-500/15 text-blue-400 border border-blue-500/40",
  GCP: "bg-green-500/15 text-green-400 border border-green-500/40",
};

function backoffTone(state: RateLimitBackoffState): {
  label: string;
  className: string;
} {
  const active = Number(state.backoffSeconds) > 0;
  if (active) {
    return {
      label: "Backing off",
      className: "bg-destructive/15 text-red-400 border border-destructive/40",
    };
  }
  if (Number(state.consecutiveThrottles) > 0) {
    return {
      label: "Recovered",
      className: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/40",
    };
  }
  return {
    label: "Healthy",
    className: "bg-green-500/15 text-green-400 border border-green-500/40",
  };
}

const BackoffCard = memo(function BackoffCard({
  state,
  now,
  onReset,
  isResetting,
}: {
  state: RateLimitBackoffState;
  now: number;
  onReset: (provider: ProviderType) => void;
  isResetting: boolean;
}) {
  const provider = state.provider;
  const backoffSeconds = Number(state.backoffSeconds);
  const throttles = Number(state.consecutiveThrottles);
  const nextAttempt = state.nextAttemptAt
    ? timestampToDate(state.nextAttemptAt)
    : null;
  const secondsUntilNext = nextAttempt
    ? Math.max(0, Math.round((nextAttempt.getTime() - now) / 1000))
    : 0;
  const tone = backoffTone(state);
  const isActive = backoffSeconds > 0;

  return (
    <div
      data-ocid={`dashboard.backoff.card.${provider.toLowerCase()}`}
      className="rounded-lg border p-4 space-y-3"
      style={{ background: "#12141c", borderColor: "#2a2d3e" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`font-display text-sm font-bold ${PROVIDER_ACCENT[provider]}`}
        >
          {provider}
        </span>
        <span
          data-ocid={`dashboard.backoff.status.${provider.toLowerCase()}`}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone.className}`}
        >
          {tone.label}
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded border border-border/60 bg-muted/10 px-2 py-1.5">
          <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Backoff
          </dt>
          <dd
            data-ocid={`dashboard.backoff.seconds.${provider.toLowerCase()}`}
            className="font-display text-base font-bold text-foreground tabular-nums"
          >
            {backoffSeconds}s
          </dd>
        </div>
        <div className="rounded border border-border/60 bg-muted/10 px-2 py-1.5">
          <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Throttles
          </dt>
          <dd
            data-ocid={`dashboard.backoff.throttles.${provider.toLowerCase()}`}
            className="font-display text-base font-bold text-foreground tabular-nums"
          >
            {throttles}
          </dd>
        </div>
        <div className="rounded border border-border/60 bg-muted/10 px-2 py-1.5">
          <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Next Try
          </dt>
          <dd
            data-ocid={`dashboard.backoff.next_attempt.${provider.toLowerCase()}`}
            className="font-display text-base font-bold text-foreground tabular-nums"
          >
            {isActive ? formatCountdown(secondsUntilNext) : "—"}
          </dd>
        </div>
      </dl>

      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] text-muted-foreground truncate">
          {state.lastThrottledAt
            ? `Last throttled ${formatTimestamp(state.lastThrottledAt)}`
            : "No throttling recorded"}
        </p>
        <button
          type="button"
          data-ocid={`dashboard.backoff.reset_button.${provider.toLowerCase()}`}
          onClick={() => onReset(provider)}
          disabled={isResetting || (!isActive && throttles === 0)}
          className="inline-flex shrink-0 items-center gap-1 rounded border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>
    </div>
  );
});

const ThrottleEventRow = memo(function ThrottleEventRow({
  event,
  index,
}: {
  event: ThrottleEvent;
  index: number;
}) {
  return (
    <li
      data-ocid={`dashboard.throttle_events.item.${index + 1}`}
      className="flex items-start gap-3 border-b border-border/50 px-3 py-2 last:border-b-0"
    >
      <span
        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${PROVIDER_BADGE[event.provider]}`}
      >
        {event.provider}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-foreground">{event.message}</p>
        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
          {formatTimestamp(event.timestamp)}
          {event.statusCode !== undefined
            ? ` · HTTP ${Number(event.statusCode)}`
            : ""}
          {event.retryAfterSec !== undefined
            ? ` · retry after ${Number(event.retryAfterSec)}s`
            : ""}
        </p>
      </div>
    </li>
  );
});

const RateLimitBackoffPanel = memo(function RateLimitBackoffPanel() {
  const { selectedProvider } = useProviderFilter();
  const { data: myProviders } = useGetMyProviders();
  const { data: states, isLoading: loadingStates } = useRateLimitStates();
  const { data: events, isLoading: loadingEvents } = useThrottleEvents(
    selectedProvider,
    25,
  );
  const resetBackoff = useResetProviderBackoff();

  // Only surface counters for providers the signed-in user is assigned to.
  const assigned = useMemo<ProviderType[]>(
    () => myProviders ?? [],
    [myProviders],
  );

  const visibleStates = useMemo(
    () =>
      (states ?? []).filter(
        (s) =>
          assigned.includes(s.provider) &&
          (!selectedProvider || s.provider === selectedProvider),
      ),
    [states, assigned, selectedProvider],
  );

  const visibleEvents = useMemo(
    () => (events ?? []).filter((e) => assigned.includes(e.provider)),
    [events, assigned],
  );

  const now = Date.now();

  return (
    <section
      data-ocid="dashboard.rate_limit.section"
      className="rounded-lg border"
      style={{ background: "#1a1d27", borderColor: "#2a2d3e" }}
    >
      <header
        className="flex items-center justify-between gap-3 border-b px-5 py-3"
        style={{ borderColor: "#2a2d3e" }}
      >
        <div className="flex items-center gap-2">
          <Timer size={16} className="text-primary" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
            Rate-Limit Backoff
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Auto-refreshing
        </span>
      </header>

      <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
        {/* Backoff counters */}
        <div data-ocid="dashboard.backoff.panel" className="space-y-3">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Provider Backoff State
          </h3>
          {loadingStates ? (
            <div
              data-ocid="dashboard.backoff.loading_state"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {Array.from({ length: 2 }, (_, i) => `backoff-skeleton-${i}`).map(
                (id) => (
                  <div
                    key={id}
                    className="h-32 animate-pulse rounded-lg border border-border/60 bg-muted/20"
                  />
                ),
              )}
            </div>
          ) : visibleStates.length === 0 ? (
            <div
              data-ocid="dashboard.backoff.empty_state"
              className="rounded-lg border border-dashed border-border px-4 py-8 text-center"
            >
              <Activity
                size={20}
                className="mx-auto mb-2 text-muted-foreground"
              />
              <p className="text-sm text-foreground">
                No backoff activity for your providers
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Counters appear here when ingestion retries after a provider
                throttles a request.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visibleStates.map((state) => (
                <BackoffCard
                  key={state.provider}
                  state={state}
                  now={now}
                  onReset={(p) => resetBackoff.mutate(p)}
                  isResetting={resetBackoff.isPending}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent throttling events */}
        <div data-ocid="dashboard.throttle_events.panel" className="space-y-3">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Recent Throttling Events
          </h3>
          {loadingEvents ? (
            <div
              data-ocid="dashboard.throttle_events.loading_state"
              className="space-y-2"
            >
              {Array.from({ length: 4 }, (_, i) => `event-skeleton-${i}`).map(
                (id) => (
                  <div
                    key={id}
                    className="h-12 animate-pulse rounded border border-border/60 bg-muted/20"
                  />
                ),
              )}
            </div>
          ) : visibleEvents.length === 0 ? (
            <div
              data-ocid="dashboard.throttle_events.empty_state"
              className="rounded-lg border border-dashed border-border px-4 py-8 text-center"
            >
              <RefreshCw
                size={20}
                className="mx-auto mb-2 text-muted-foreground"
              />
              <p className="text-sm text-foreground">No throttling events</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Provider rate-limit responses will be logged here as ingestion
                retries.
              </p>
            </div>
          ) : (
            <ul
              data-ocid="dashboard.throttle_events.list"
              className="max-h-72 overflow-y-auto rounded-lg border border-border/60"
            >
              {visibleEvents.map((event, i) => (
                <ThrottleEventRow key={event.id} event={event} index={i} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
});

// ─── DashboardPage ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { selectedProvider } = useProviderFilter();

  // Summary stats — all polled every 15 s
  const { data: allAlerts, isLoading: loadingAlerts } = useNormalizedAlerts({
    customer: "",
    limit: 1000,
    ...(selectedProvider ? { provider: selectedProvider } : {}),
    status: "Open",
  });

  const { data: incidents, isLoading: loadingIncidents } =
    useCorrelatedIncidents(200);

  const { data: assets, isLoading: loadingAssets } = useAssets("", 1000);

  const { data: complianceData, isLoading: loadingCompliance } =
    useComplianceStatus("NISTCSF");

  const totalActiveAlerts = allAlerts?.length ?? 0;
  const openIncidents = useMemo(
    () => (incidents ?? []).filter(([, inc]) => inc.status === "Open").length,
    [incidents],
  );
  const assetsAtRisk = useMemo(
    () => (assets ?? []).filter((a) => Number(a.riskScore ?? 0) > 0).length,
    [assets],
  );
  const complianceScore = useMemo(
    () =>
      complianceData
        ? Number((complianceData as { score?: bigint }).score ?? 0n)
        : 0,
    [complianceData],
  );

  return (
    <Layout>
      <div
        data-ocid="dashboard.page"
        className="min-h-screen"
        style={{ background: "#0f1117" }}
      >
        {/* Summary Stats Bar */}
        <div
          data-ocid="dashboard.stats_bar"
          className="border-b px-6 py-4"
          style={{ borderColor: "#2a2d3e", background: "#1a1d27" }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Active Alerts"
              value={totalActiveAlerts}
              isLoading={loadingAlerts}
              color="text-destructive"
              icon={<ShieldAlert size={16} />}
              ocid="dashboard.stat.total_alerts"
            />
            <StatCard
              label="Open Incidents"
              value={openIncidents}
              isLoading={loadingIncidents}
              color="text-orange-400"
              icon={<GitMerge size={16} />}
              ocid="dashboard.stat.open_incidents"
            />
            <StatCard
              label="Assets at Risk"
              value={assetsAtRisk}
              isLoading={loadingAssets}
              color="text-yellow-400"
              icon={<Server size={16} />}
              ocid="dashboard.stat.assets_at_risk"
            />
            <StatCard
              label="Compliance Score"
              value={`${complianceScore}%`}
              isLoading={loadingCompliance}
              color="text-green-400"
              icon={<CheckSquare size={16} />}
              ocid="dashboard.stat.compliance_score"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Provider Filter Bar */}
          <ProviderFilterBar />

          {/* Rate-Limit Backoff Counters */}
          <RateLimitBackoffPanel />

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Risk Score Widget — spans full width on lg */}
            <div
              data-ocid="dashboard.risk_score.section"
              className="lg:col-span-1 rounded-lg border p-5"
              style={{
                background: "#1a1d27",
                borderColor: "#2a2d3e",
              }}
            >
              <RiskScoreWidget />
            </div>

            {/* Provider Cards — spans 2 cols on lg */}
            <div
              data-ocid="dashboard.provider_cards.section"
              className="md:col-span-1 lg:col-span-2 rounded-lg border p-5"
              style={{
                background: "#1a1d27",
                borderColor: "#2a2d3e",
              }}
            >
              <ProviderCards />
            </div>

            {/* Security Event Feed — spans 2 cols on lg */}
            <div
              data-ocid="dashboard.event_feed.section"
              className="md:col-span-2 lg:col-span-2 rounded-lg border"
              style={{
                background: "#1a1d27",
                borderColor: "#2a2d3e",
              }}
            >
              <SecurityEventFeed />
            </div>

            {/* Correlated Incidents Panel */}
            <div
              data-ocid="dashboard.correlated_incidents.section"
              className="md:col-span-2 lg:col-span-1 rounded-lg border"
              style={{
                background: "#1a1d27",
                borderColor: "#2a2d3e",
              }}
            >
              <CorrelatedIncidentsPanel />
            </div>
          </div>

          {/* Quick Actions Toolbar */}
          <div
            data-ocid="dashboard.quick_actions.section"
            className="rounded-lg border p-5"
            style={{ background: "#1a1d27", borderColor: "#2a2d3e" }}
          >
            <QuickActionsToolbar />
          </div>
        </div>
      </div>
    </Layout>
  );
}
