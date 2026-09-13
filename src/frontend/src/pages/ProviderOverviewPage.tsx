import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useMemo } from "react";
import { Layout } from "../components/Layout";
import { ProviderIcon } from "../components/ProviderIcon";
import {
  useGetMyProviders,
  useNormalizedAlerts,
  useProviderStates,
} from "../hooks/use-backend";
import type { ProviderType, Severity } from "../types";

const PROVIDERS: ProviderType[] = ["AWS", "Azure", "GCP"];

const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];

const PROVIDER_META: Record<
  ProviderType,
  { accentClass: string; to: string; ocid: string }
> = {
  AWS: {
    accentClass: "provider-aws",
    to: "/providers/aws",
    ocid: "overview.provider_aws",
  },
  Azure: {
    accentClass: "provider-azure",
    to: "/providers/azure",
    ocid: "overview.provider_azure",
  },
  GCP: {
    accentClass: "provider-gcp",
    to: "/providers/gcp",
    ocid: "overview.provider_gcp",
  },
};

const SEVERITY_STYLES: Record<Severity, string> = {
  Critical: "bg-destructive/20 text-destructive border border-destructive/40",
  High: "bg-chart-5/20 text-chart-5 border border-chart-5/40",
  Medium: "bg-warning/20 text-warning border border-warning/40",
  Low: "bg-primary/20 text-primary border border-primary/40",
  Unknown: "bg-muted/30 text-muted-foreground border border-border",
};

function ProviderCard({
  provider,
  alerts,
  isConnected,
  hasError,
}: {
  provider: ProviderType;
  alerts: { severity: Severity; status: string }[];
  isConnected: boolean;
  hasError: boolean;
}) {
  const meta = PROVIDER_META[provider];

  const activeAlerts = alerts.filter((a) => a.status !== "Resolved");
  const total = activeAlerts.length;

  const severityCounts = SEVERITIES.reduce<Record<Severity, number>>(
    (acc, sev) => {
      acc[sev] = activeAlerts.filter((a) => a.severity === sev).length;
      return acc;
    },
    { Critical: 0, High: 0, Medium: 0, Low: 0, Unknown: 0 },
  );

  const connectionLabel = isConnected
    ? "Connected"
    : hasError
      ? "Error"
      : "Disconnected";
  const ConnectionIcon = isConnected
    ? Wifi
    : hasError
      ? AlertTriangle
      : WifiOff;
  const connectionClass = isConnected
    ? "badge-status-connected"
    : hasError
      ? "badge-status-error"
      : "badge-status-inactive";

  return (
    <div
      data-ocid={`${meta.ocid}.card`}
      className={`${meta.accentClass} provider-shell flex flex-col p-5 transition-smooth hover:border-opacity-80`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <ProviderIcon provider={provider} className="text-base" />
        <span className={`inline-flex items-center gap-1.5 ${connectionClass}`}>
          <ConnectionIcon size={10} />
          {connectionLabel}
        </span>
      </div>

      {/* Active alert count */}
      <div className="mb-4">
        <div className="provider-accent font-display text-4xl font-bold tabular-nums leading-none">
          {total}
        </div>
        <div className="text-xs text-muted-foreground mt-1.5 font-mono uppercase tracking-widest">
          Active Alerts
        </div>
      </div>

      {/* Severity breakdown */}
      <div className="grid grid-cols-2 gap-1.5 mb-5">
        {SEVERITIES.map((sev) => (
          <div
            key={sev}
            className={`flex items-center justify-between rounded px-2 py-1 text-xs font-mono ${SEVERITY_STYLES[sev]}`}
          >
            <span className="truncate pr-1">{sev}</span>
            <span className="font-bold tabular-nums">
              {severityCounts[sev]}
            </span>
          </div>
        ))}
      </div>

      {/* Link to dashboard */}
      <Link
        to={meta.to}
        data-ocid={`${meta.ocid}.dashboard_link`}
        className="mt-auto inline-flex items-center justify-between gap-2 rounded-md border border-border bg-background/40 px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/40 transition-smooth"
      >
        <span>Open Dashboard</span>
        <ArrowRight size={14} className="provider-accent" />
      </Link>
    </div>
  );
}

export default function ProviderOverviewPage() {
  const { data: myProviders = [], isLoading: loadingProviders } =
    useGetMyProviders();
  const { data: providerStates = [] } = useProviderStates();

  const assigned = useMemo(() => new Set(myProviders), [myProviders]);
  const visibleProviders = PROVIDERS.filter((p) => assigned.has(p));

  const awsAlerts = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: "AWS",
  });
  const azureAlerts = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: "Azure",
  });
  const gcpAlerts = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: "GCP",
  });

  const alertsByProvider: Record<
    ProviderType,
    { severity: Severity; status: string }[]
  > = {
    AWS: awsAlerts.data ?? [],
    Azure: azureAlerts.data ?? [],
    GCP: gcpAlerts.data ?? [],
  };

  const loadingAlerts =
    awsAlerts.isLoading || azureAlerts.isLoading || gcpAlerts.isLoading;

  return (
    <Layout>
      <div data-ocid="overview.page" className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            Provider Overview
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select a cloud provider to open its isolated security dashboard. You
            only see providers you are assigned to.
          </p>
        </div>

        {/* Loading state */}
        {loadingProviders || loadingAlerts ? (
          <div
            data-ocid="overview.loading_state"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
              <div
                key={id}
                className="provider-shell h-64 animate-pulse bg-muted/20"
              />
            ))}
          </div>
        ) : visibleProviders.length === 0 ? (
          <div
            data-ocid="overview.empty_state"
            className="provider-shell flex flex-col items-center justify-center gap-3 p-10 text-center"
          >
            <ShieldCheck size={32} className="text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              No providers assigned
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              You are not currently assigned to any cloud provider. Contact an
              administrator to grant you access to AWS, Azure, or GCP.
            </p>
          </div>
        ) : (
          <div
            data-ocid="overview.provider_grid"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleProviders.map((provider) => {
              const state = providerStates.find((s) => s.provider === provider);
              const isConnected = state?.status === "Active";
              const hasError =
                state?.status === "Error" || state?.status === "AuthPaused";
              return (
                <ProviderCard
                  key={provider}
                  provider={provider}
                  alerts={alertsByProvider[provider]}
                  isConnected={isConnected}
                  hasError={hasError}
                />
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
