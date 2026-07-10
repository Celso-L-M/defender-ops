import { CheckSquare, GitMerge, Server, ShieldAlert } from "lucide-react";
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
  useNormalizedAlerts,
} from "../hooks/use-backend";

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
