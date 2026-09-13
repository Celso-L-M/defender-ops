import {
  Boxes,
  CheckSquare,
  GitMerge,
  Loader2,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CorrelatedIncidentsPanel } from "../components/CorrelatedIncidentsPanel";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SecurityEventFeed } from "../components/SecurityEventFeed";
import { StatusBadge } from "../components/StatusBadge";
import { useProviderFilter } from "../contexts/provider-filter";
import {
  useAssets,
  useBlockIp,
  useComplianceStatus,
  useCorrelatedIncidents,
  useGetMyProviders,
  useIsolateResource,
  useNormalizedAlerts,
  useProviderStates,
  useRevokeIamCredentials,
} from "../hooks/use-backend";
import type {
  Asset,
  BlockIpRequest,
  ConnectionStatus,
  IsolateResourceRequest,
  NormalizedAlert,
  PlaybookResult,
  ProviderType,
  RevokeIamRequest,
  Severity,
} from "../types";

const AWS: ProviderType = "AWS";

const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];

const SEVERITY_STYLES: Record<Severity, string> = {
  Critical: "bg-destructive/20 text-destructive border border-destructive/40",
  High: "bg-chart-5/20 text-chart-5 border border-chart-5/40",
  Medium: "bg-warning/20 text-warning border border-warning/40",
  Low: "bg-primary/20 text-primary border border-primary/40",
  Unknown: "bg-muted/30 text-muted-foreground border border-border",
};

function severityWeight(severity: Severity): number {
  switch (severity) {
    case "Critical":
      return 4;
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
    default:
      return 0;
  }
}

function riskZone(score: number): { label: string; cls: string } {
  if (score <= 30) return { label: "Low Risk", cls: "text-success" };
  if (score <= 60) return { label: "Moderate", cls: "text-warning" };
  if (score <= 85) return { label: "High", cls: "text-chart-5" };
  return { label: "Critical", cls: "text-destructive" };
}

// ── helpers ──────────────────────────────────────────────────────────────────

function formatLastSeen(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ms).toLocaleDateString();
}

function riskTone(score: number): string {
  if (score > 60) return "text-destructive";
  if (score > 0) return "text-warning";
  return "text-muted-foreground";
}

// ── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  isLoading,
  tone,
  icon,
  ocid,
}: {
  label: string;
  value: string | number;
  isLoading: boolean;
  tone: string;
  icon: React.ReactNode;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="provider-shell provider-tint flex items-center gap-3 p-4"
    >
      <div className={`shrink-0 ${tone}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">
          {label}
        </p>
        {isLoading ? (
          <div className="mt-1 h-5 w-16 rounded bg-muted/30 animate-pulse" />
        ) : (
          <p className={`font-display text-xl font-bold ${tone} tabular-nums`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ── AWS Risk Score ───────────────────────────────────────────────────────────

function AwsRiskScoreCard({
  alerts,
  isLoading,
}: {
  alerts: NormalizedAlert[];
  isLoading: boolean;
}) {
  const totalWeighted = alerts.reduce(
    (sum, a) => sum + severityWeight(a.severity),
    0,
  );
  const maxPossible = alerts.length * 4;
  const rawScore = maxPossible > 0 ? (totalWeighted / maxPossible) * 100 : 0;
  const score = Math.min(100, Math.round(rawScore));
  const zone = riskZone(score);

  const counts = SEVERITIES.reduce<Record<Severity, number>>(
    (acc, sev) => {
      acc[sev] = alerts.filter((a) => a.severity === sev).length;
      return acc;
    },
    { Critical: 0, High: 0, Medium: 0, Low: 0, Unknown: 0 },
  );

  return (
    <div
      data-ocid="aws_dashboard.risk_score.card"
      className="provider-shell provider-tint flex flex-col p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm font-semibold text-foreground tracking-wide">
          AWS Risk Score
        </h2>
        <ShieldAlert size={16} className="provider-accent" />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 w-16 rounded-full bg-muted/30 animate-pulse mx-auto" />
          <div className="h-4 w-24 rounded bg-muted/30 animate-pulse mx-auto" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-1">
            <span className="provider-accent font-display text-4xl font-bold tabular-nums leading-none">
              {score}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              / 100
            </span>
            <span className={`text-sm font-bold mt-1 ${zone.cls}`}>
              {zone.label}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {alerts.length === 0
                ? "No active AWS alerts"
                : `${alerts.length} active AWS alert${alerts.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          <div className="my-4 border-t border-border/40" />

          <div className="grid grid-cols-2 gap-1.5">
            {SEVERITIES.map((sev) => (
              <div
                key={sev}
                className={`flex items-center justify-between rounded px-2 py-1 text-xs font-mono ${SEVERITY_STYLES[sev]}`}
              >
                <span className="truncate pr-1">{sev}</span>
                <span className="font-bold tabular-nums">{counts[sev]}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── AWS Quick Actions ────────────────────────────────────────────────────────

function showPlaybookToast(result: PlaybookResult, label: string) {
  if (result.success) {
    toast.success(result.dryRunPreview ? `[Dry Run] ${label}` : label, {
      description: result.message,
      duration: 5000,
    });
  } else {
    toast.error(`${label} failed`, {
      description:
        "The action could not be completed. Check the audit log for details.",
      duration: 6000,
    });
  }
}

function AwsActionModal({
  title,
  icon,
  accentClass,
  onClose,
  children,
}: {
  title: string;
  icon: React.ElementType;
  accentClass: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const Icon = icon;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="provider-shell provider-aws relative w-full max-w-md rounded-xl border p-0 shadow-2xl text-left"
        style={{ backgroundColor: "#1a1d27" }}
      >
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#2a2d3e]">
          <span className={accentClass}>
            <Icon size={20} />
          </span>
          <h2 className="text-base font-semibold text-white font-display">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="aws_quick_action.close_button"
            aria-label="Close dialog"
            className="ml-auto opacity-50 hover:opacity-100 transition-opacity text-white"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BlockIpAwsModal({ onClose }: { onClose: () => void }) {
  const [ip, setIp] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const mutation = useBlockIp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: BlockIpRequest = {
      ip: ip.trim(),
      providers: [AWS],
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Block IP ${ip.trim()} on AWS`);
      if (!dryRun) onClose();
    } catch {
      toast.error("Block IP failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <AwsActionModal
      title="Block IP (AWS)"
      icon={Shield}
      accentClass="text-orange-400"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Add the IP to AWS network ACL deny rules. Takes immediate effect on
          AWS resources only.
        </p>
        <label className="block space-y-1.5">
          <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            IP Address
          </span>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="e.g. 185.234.219.10"
            data-ocid="aws_quick_action.ip_input"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
            style={{
              backgroundColor: "#0f1117",
              border: "1px solid #2a2d3e",
              color: "white",
            }}
          />
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            data-ocid="aws_quick_action.dryrun_toggle"
            className="accent-orange-500"
          />
          <span className="text-xs text-muted-foreground">
            Dry Run (preview only)
          </span>
        </label>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="aws_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ip.trim() || mutation.isPending}
            data-ocid="aws_quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-orange-400 border border-orange-400/40 hover:bg-orange-400/10 flex items-center justify-center gap-1.5"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Executing
              </>
            ) : (
              "Execute"
            )}
          </button>
        </div>
      </form>
    </AwsActionModal>
  );
}

function IsolateAwsModal({ onClose }: { onClose: () => void }) {
  const [resourceId, setResourceId] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const mutation = useIsolateResource();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: IsolateResourceRequest = {
      resourceId: resourceId.trim(),
      provider: AWS,
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Isolate ${resourceId.trim()} on AWS`);
      if (!dryRun) onClose();
    } catch {
      toast.error("Isolate Resource failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <AwsActionModal
      title="Isolate AWS Resource"
      icon={Server}
      accentClass="text-orange-400"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Quarantine the AWS resource from all network access until reviewed.
        </p>
        <label className="block space-y-1.5">
          <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Resource ID
          </span>
          <input
            type="text"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            placeholder="e.g. arn:aws:ec2:us-east-1:123456789012:instance/i-0abcd1234efgh5678"
            data-ocid="aws_quick_action.resource_input"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
            style={{
              backgroundColor: "#0f1117",
              border: "1px solid #2a2d3e",
              color: "white",
            }}
          />
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            data-ocid="aws_quick_action.dryrun_toggle"
            className="accent-orange-500"
          />
          <span className="text-xs text-muted-foreground">
            Dry Run (preview only)
          </span>
        </label>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="aws_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!resourceId.trim() || mutation.isPending}
            data-ocid="aws_quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-orange-400 border border-orange-400/40 hover:bg-orange-400/10 flex items-center justify-center gap-1.5"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Executing
              </>
            ) : (
              "Execute"
            )}
          </button>
        </div>
      </form>
    </AwsActionModal>
  );
}

function RevokeIamAwsModal({ onClose }: { onClose: () => void }) {
  const [userId, setUserId] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const mutation = useRevokeIamCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: RevokeIamRequest = {
      userId: userId.trim(),
      provider: AWS,
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Revoke IAM credentials for ${userId.trim()}`);
      if (!dryRun) onClose();
    } catch {
      toast.error("Revoke IAM Credentials failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <AwsActionModal
      title="Revoke AWS IAM Credentials"
      icon={ShieldCheck}
      accentClass="text-orange-400"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Revoke the AWS IAM user's access keys and credentials immediately.
          Scoped to AWS only.
        </p>
        <label className="block space-y-1.5">
          <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            IAM User ID
          </span>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. AIDAEXAMPLEUSERID"
            data-ocid="aws_quick_action.user_input"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
            style={{
              backgroundColor: "#0f1117",
              border: "1px solid #2a2d3e",
              color: "white",
            }}
          />
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            data-ocid="aws_quick_action.dryrun_toggle"
            className="accent-orange-500"
          />
          <span className="text-xs text-muted-foreground">
            Dry Run (preview only)
          </span>
        </label>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="aws_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!userId.trim() || mutation.isPending}
            data-ocid="aws_quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-orange-400 border border-orange-400/40 hover:bg-orange-400/10 flex items-center justify-center gap-1.5"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Executing
              </>
            ) : (
              "Execute"
            )}
          </button>
        </div>
      </form>
    </AwsActionModal>
  );
}

type AwsActionId = "blockIp" | "isolate" | "revokeIam";

const AWS_ACTIONS: {
  id: AwsActionId;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "blockIp", label: "Block IP", icon: Shield },
  { id: "isolate", label: "Isolate Resource", icon: Server },
  { id: "revokeIam", label: "Revoke IAM Credentials", icon: ShieldCheck },
];

function AwsQuickActions() {
  const [active, setActive] = useState<AwsActionId | null>(null);
  return (
    <>
      <div
        data-ocid="aws_dashboard.quick_actions.panel"
        className="provider-shell provider-tint p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={16} className="provider-accent" />
          <h2 className="font-display text-sm font-semibold text-foreground tracking-wide">
            AWS Quick Actions
          </h2>
          <span className="badge-provider ml-1">AWS</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Remediation actions scoped to AWS resources only.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {AWS_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => setActive(action.id)}
                data-ocid={`aws_quick_action.${action.id}_button`}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-orange-400/40 text-orange-400 hover:bg-orange-400/10 transition-all active:scale-95"
                style={{ backgroundColor: "#1a1d27" }}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {active === "blockIp" && (
        <BlockIpAwsModal onClose={() => setActive(null)} />
      )}
      {active === "isolate" && (
        <IsolateAwsModal onClose={() => setActive(null)} />
      )}
      {active === "revokeIam" && (
        <RevokeIamAwsModal onClose={() => setActive(null)} />
      )}
    </>
  );
}

// ── AwsDashboardPage ─────────────────────────────────────────────────────────

export default function AwsDashboardPage() {
  const { setSelectedProvider } = useProviderFilter();
  const { data: myProviders = [], isLoading: loadingProviders } =
    useGetMyProviders();

  // Lock the shared provider filter to AWS so the reused SecurityEventFeed and
  // CorrelatedIncidentsPanel scope their data to AWS only. Reset on unmount so
  // the shared filter does not stay locked to AWS for other pages.
  useEffect(() => {
    setSelectedProvider("AWS");
    return () => setSelectedProvider(null);
  }, [setSelectedProvider]);

  const isAssigned = myProviders.includes(AWS);

  // AWS-scoped active alerts
  const { data: awsAlerts, isLoading: loadingAlerts } = useNormalizedAlerts({
    customer: "",
    limit: 1000,
    provider: "AWS",
    status: "Open",
  });

  // AWS assets (filtered client-side; the assets query is not provider-scoped)
  const { data: allAssets, isLoading: loadingAssets } = useAssets("", 1000);
  const awsAssets = useMemo<Asset[]>(
    () => (allAssets ?? []).filter((a) => a.provider === "AWS"),
    [allAssets],
  );
  const assetsAtRisk = useMemo(
    () => awsAssets.filter((a) => Number(a.riskScore ?? 0) > 0).length,
    [awsAssets],
  );

  // AWS compliance score
  const { data: complianceData, isLoading: loadingCompliance } =
    useComplianceStatus("NISTCSF", "AWS");
  const complianceScore = useMemo(
    () =>
      complianceData
        ? Number((complianceData as { score?: bigint }).score ?? 0n)
        : 0,
    [complianceData],
  );

  // AWS correlated incidents (filtered client-side)
  const { data: incidents, isLoading: loadingIncidents } =
    useCorrelatedIncidents(200);
  const awsIncidents = useMemo(
    () =>
      (incidents ?? []).filter(([, inc]) =>
        inc.sourceProviders.includes("AWS"),
      ),
    [incidents],
  );
  const openIncidents = useMemo(
    () => awsIncidents.filter(([, inc]) => inc.status === "Open").length,
    [awsIncidents],
  );

  // AWS connection status
  const { data: providerStates } = useProviderStates();
  const awsState = providerStates?.find((s) => s.provider === "AWS");
  const connectionStatus: ConnectionStatus =
    awsState?.status === "Active"
      ? "connected"
      : awsState?.status === "Error" || awsState?.status === "AuthPaused"
        ? "error"
        : "disconnected";

  const totalActiveAlerts = awsAlerts?.length ?? 0;

  if (loadingProviders) {
    return (
      <Layout>
        <div
          data-ocid="aws.loading_state"
          className="provider-aws flex min-h-[60vh] items-center justify-center"
        >
          <LoadingSpinner size={32} />
        </div>
      </Layout>
    );
  }

  if (!isAssigned) {
    return (
      <Layout>
        <div
          data-ocid="aws.access_denied"
          className="provider-aws flex min-h-[60vh] items-center justify-center"
        >
          <div className="provider-shell provider-tint flex max-w-md flex-col items-center gap-3 p-10 text-center">
            <ShieldAlert size={32} className="provider-accent" />
            <h1 className="font-display text-lg font-semibold text-foreground">
              AWS access not assigned
            </h1>
            <p className="text-sm text-muted-foreground">
              You are not assigned to the AWS provider. Contact an administrator
              to request access. AWS data and remediation actions are blocked.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div data-ocid="aws_dashboard.page" className="provider-aws min-h-screen">
        {/* Page header */}
        <div className="provider-shell provider-tint mb-6 p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="provider-accent-bar h-12 w-1 rounded-full" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    AWS Dashboard
                  </h1>
                  <span className="badge-provider">AWS</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Amazon Web Services security posture — alerts, assets,
                  compliance, and incidents scoped to AWS only.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={connectionStatus} />
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Active Alerts"
            value={totalActiveAlerts}
            isLoading={loadingAlerts}
            tone="text-destructive"
            icon={<ShieldAlert size={16} />}
            ocid="aws_dashboard.stat.active_alerts"
          />
          <StatCard
            label="Assets at Risk"
            value={assetsAtRisk}
            isLoading={loadingAssets}
            tone="text-warning"
            icon={<Server size={16} />}
            ocid="aws_dashboard.stat.assets_at_risk"
          />
          <StatCard
            label="Compliance Score"
            value={`${complianceScore}%`}
            isLoading={loadingCompliance}
            tone="text-success"
            icon={<CheckSquare size={16} />}
            ocid="aws_dashboard.stat.compliance_score"
          />
          <StatCard
            label="Open Incidents"
            value={openIncidents}
            isLoading={loadingIncidents}
            tone="provider-accent"
            icon={<GitMerge size={16} />}
            ocid="aws_dashboard.stat.open_incidents"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Risk score */}
          <div
            data-ocid="aws_dashboard.risk_score.section"
            className="provider-shell provider-tint p-5"
          >
            <AwsRiskScoreCard
              alerts={awsAlerts ?? []}
              isLoading={loadingAlerts}
            />
          </div>

          {/* Security event feed */}
          <div
            data-ocid="aws_dashboard.event_feed.section"
            className="md:col-span-2 lg:col-span-2 provider-shell"
          >
            <SecurityEventFeed />
          </div>

          {/* AWS assets */}
          <div
            data-ocid="aws_dashboard.assets.section"
            className="md:col-span-2 lg:col-span-2 provider-shell"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Boxes size={16} className="provider-accent" />
                  <h2 className="font-display font-semibold text-foreground text-sm tracking-wide">
                    AWS Assets
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {awsAssets.length} assets
                </span>
              </div>

              {loadingAssets ? (
                <div
                  data-ocid="aws_dashboard.assets.loading_state"
                  className="flex items-center justify-center py-10"
                >
                  <LoadingSpinner size={24} />
                </div>
              ) : awsAssets.length === 0 ? (
                <div
                  data-ocid="aws_dashboard.assets.empty_state"
                  className="flex flex-col items-center justify-center py-10 gap-2"
                >
                  <Server size={24} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No AWS assets discovered.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-dense w-full text-left">
                    <thead>
                      <tr className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Type</th>
                        <th className="px-2 py-2">Region</th>
                        <th className="px-2 py-2 text-right">Risk</th>
                        <th className="px-2 py-2 text-right">Findings</th>
                        <th className="px-2 py-2">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {awsAssets.map((asset, i) => (
                        <tr
                          key={asset.id}
                          data-ocid={`aws_dashboard.assets.row.${i + 1}`}
                          className="border-t border-border/30"
                        >
                          <td className="font-medium text-foreground">
                            {asset.name}
                          </td>
                          <td className="font-mono text-xs text-muted-foreground">
                            {asset.assetType}
                          </td>
                          <td className="font-mono text-xs text-muted-foreground">
                            {asset.region}
                          </td>
                          <td
                            className={`text-right font-mono text-xs ${riskTone(Number(asset.riskScore))}`}
                          >
                            {Number(asset.riskScore)}
                          </td>
                          <td className="text-right font-mono text-xs text-foreground">
                            {Number(asset.openFindings)}
                          </td>
                          <td className="font-mono text-xs text-muted-foreground">
                            {formatLastSeen(asset.lastSeen)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Correlated incidents */}
          <div
            data-ocid="aws_dashboard.correlated_incidents.section"
            className="md:col-span-2 lg:col-span-1 provider-shell"
          >
            <CorrelatedIncidentsPanel />
          </div>
        </div>

        {/* Quick actions */}
        <div data-ocid="aws_dashboard.quick_actions.section" className="mt-6">
          <AwsQuickActions />
        </div>
      </div>
    </Layout>
  );
}
