import { useProviderFilter } from "@/contexts/provider-filter";
import {
  useAssets,
  useBlockIp,
  useComplianceStatus,
  useDisableAzureAdAccount,
  useGetMyProviders,
  useIsolateResource,
  useNormalizedAlerts,
} from "@/hooks/use-backend";
import type {
  BlockIpRequest,
  DisableAzureAdRequest,
  IsolateResourceRequest,
  NormalizedAlert,
  PlaybookResult,
} from "@/types";
import {
  AlertTriangle,
  CheckSquare,
  Cloud,
  Loader2,
  Server,
  Shield,
  ShieldAlert,
  UserX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CorrelatedIncidentsPanel } from "../components/CorrelatedIncidentsPanel";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SecurityEventFeed } from "../components/SecurityEventFeed";
import { SeverityBadge } from "../components/SeverityBadge";
import { StatusBadge } from "../components/StatusBadge";

const AZURE = "Azure" as const;

function computeWeight(severity: NormalizedAlert["severity"]): number {
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

function getRiskZone(score: number): { label: string; color: string } {
  if (score <= 30) return { label: "Low Risk", color: "#22c55e" };
  if (score <= 60) return { label: "Moderate", color: "#eab308" };
  if (score <= 85) return { label: "High", color: "#f97316" };
  return { label: "Critical", color: "#ef4444" };
}

function StatCard({
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
      className="provider-shell provider-tint rounded-lg p-4 flex items-center gap-3"
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
}

function AzureRiskScore() {
  const { data: alerts = [], isLoading } = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: AZURE,
  });

  const totalWeighted = alerts.reduce(
    (sum, a) => sum + computeWeight(a.severity),
    0,
  );
  const maxPossible = alerts.length * 4;
  const rawScore = maxPossible > 0 ? (totalWeighted / maxPossible) * 100 : 0;
  const score = Math.min(100, Math.round(rawScore));
  const { label, color } = getRiskZone(score);

  return (
    <div
      data-ocid="azure_dashboard.risk_score.card"
      className="provider-shell provider-tint rounded-lg p-5"
    >
      <h2 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wide">
        Azure Risk Score
      </h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size={28} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex items-center justify-center rounded-full border-4"
            style={{
              width: 120,
              height: 120,
              borderColor: color,
              boxShadow: score >= 86 ? `0 0 16px ${color}80` : undefined,
            }}
          >
            <span
              className="font-display text-3xl font-bold tabular-nums"
              style={{ color }}
            >
              {score}
            </span>
          </div>
          <span
            className="text-sm font-bold tracking-wide"
            style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {label}
          </span>
          <span className="text-xs text-muted-foreground">
            {alerts.length === 0
              ? "No active Azure alerts"
              : `${alerts.length} active Azure alert${alerts.length !== 1 ? "s" : ""}`}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Azure-scoped quick actions ──────────────────────────────────────────────

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

function AzureActionModal({
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
        className="provider-shell provider-azure relative w-full max-w-md rounded-xl border p-0 shadow-2xl text-left"
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
            data-ocid="azure_quick_action.close_button"
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

function BlockIpAzureModal({ onClose }: { onClose: () => void }) {
  const [ip, setIp] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const mutation = useBlockIp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: BlockIpRequest = {
      ip: ip.trim(),
      providers: [AZURE],
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Block IP ${ip.trim()} on Azure`);
      if (!dryRun) onClose();
    } catch {
      toast.error("Block IP failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <AzureActionModal
      title="Block IP (Azure)"
      icon={Shield}
      accentClass="text-blue-400"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Add the IP to Azure network security group deny rules. Takes immediate
          effect on Azure resources only.
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
            data-ocid="azure_quick_action.ip_input"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
            data-ocid="azure_quick_action.dryrun_toggle"
            className="accent-blue-500"
          />
          <span className="text-xs text-muted-foreground">
            Dry Run (preview only)
          </span>
        </label>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="azure_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ip.trim() || mutation.isPending}
            data-ocid="azure_quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 border border-blue-400/40 hover:bg-blue-400/10 flex items-center justify-center gap-1.5"
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
    </AzureActionModal>
  );
}

function IsolateAzureModal({ onClose }: { onClose: () => void }) {
  const [resourceId, setResourceId] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const mutation = useIsolateResource();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: IsolateResourceRequest = {
      resourceId: resourceId.trim(),
      provider: AZURE,
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Isolate ${resourceId.trim()} on Azure`);
      if (!dryRun) onClose();
    } catch {
      toast.error("Isolate Resource failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <AzureActionModal
      title="Isolate Azure Resource"
      icon={Server}
      accentClass="text-orange-400"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Quarantine the Azure resource from all network access until reviewed.
        </p>
        <label className="block space-y-1.5">
          <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Resource ID
          </span>
          <input
            type="text"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            placeholder="e.g. /subscriptions/.../resourceGroups/.../providers/Microsoft.Compute/virtualMachines/vm-prod-01"
            data-ocid="azure_quick_action.resource_input"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
            data-ocid="azure_quick_action.dryrun_toggle"
            className="accent-blue-500"
          />
          <span className="text-xs text-muted-foreground">
            Dry Run (preview only)
          </span>
        </label>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="azure_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!resourceId.trim() || mutation.isPending}
            data-ocid="azure_quick_action.confirm_button"
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
    </AzureActionModal>
  );
}

function DisableAzureAdModal({ onClose }: { onClose: () => void }) {
  const [upn, setUpn] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const mutation = useDisableAzureAdAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: DisableAzureAdRequest = {
      userPrincipalName: upn.trim(),
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Disable Azure AD account ${upn.trim()}`);
      if (!dryRun) onClose();
    } catch {
      toast.error("Disable Azure AD failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <AzureActionModal
      title="Disable Azure AD Account"
      icon={UserX}
      accentClass="text-blue-400"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Disable the Azure AD account immediately. The user will be signed out
          of all sessions.
        </p>
        <label className="block space-y-1.5">
          <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            User Principal Name
          </span>
          <input
            type="email"
            value={upn}
            onChange={(e) => setUpn(e.target.value)}
            placeholder="user@company.onmicrosoft.com"
            data-ocid="azure_quick_action.upn_input"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
            data-ocid="azure_quick_action.dryrun_toggle"
            className="accent-blue-500"
          />
          <span className="text-xs text-muted-foreground">
            Dry Run (preview only)
          </span>
        </label>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="azure_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!upn.trim() || mutation.isPending}
            data-ocid="azure_quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 border border-blue-400/40 hover:bg-blue-400/10 flex items-center justify-center gap-1.5"
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
    </AzureActionModal>
  );
}

type AzureActionId = "blockIp" | "isolate" | "disableAD";

const AZURE_ACTIONS: {
  id: AzureActionId;
  label: string;
  icon: React.ElementType;
  accent: string;
  hoverBorder: string;
}[] = [
  {
    id: "blockIp",
    label: "Block IP",
    icon: Shield,
    accent: "text-red-400",
    hoverBorder: "hover:border-red-400",
  },
  {
    id: "isolate",
    label: "Isolate Resource",
    icon: Server,
    accent: "text-orange-400",
    hoverBorder: "hover:border-orange-400",
  },
  {
    id: "disableAD",
    label: "Disable Azure AD Account",
    icon: UserX,
    accent: "text-blue-400",
    hoverBorder: "hover:border-blue-400",
  },
];

function AzureQuickActions() {
  const [active, setActive] = useState<AzureActionId | null>(null);
  return (
    <>
      <div
        data-ocid="azure_dashboard.quick_actions.panel"
        className="provider-shell provider-tint rounded-lg p-5"
      >
        <h2 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wide">
          Azure Quick Actions
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Remediation actions scoped to Azure resources only.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {AZURE_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => setActive(action.id)}
                data-ocid={`azure_quick_action.${action.id}_button`}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-all ${action.accent} ${action.hoverBorder} hover:bg-white/5 active:scale-95`}
                style={{ backgroundColor: "#1a1d27", borderColor: "#2a2d3e" }}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {active === "blockIp" && (
        <BlockIpAzureModal onClose={() => setActive(null)} />
      )}
      {active === "isolate" && (
        <IsolateAzureModal onClose={() => setActive(null)} />
      )}
      {active === "disableAD" && (
        <DisableAzureAdModal onClose={() => setActive(null)} />
      )}
    </>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function AzureDashboardPage() {
  const { setSelectedProvider } = useProviderFilter();
  const { data: myProviders = [], isLoading: loadingProviders } =
    useGetMyProviders();

  useEffect(() => {
    setSelectedProvider(AZURE);
    return () => setSelectedProvider(null);
  }, [setSelectedProvider]);

  const isAssigned = myProviders.includes(AZURE);

  const { data: alerts = [], isLoading: loadingAlerts } = useNormalizedAlerts({
    customer: "",
    limit: 1000,
    provider: AZURE,
    status: "Open",
  });
  const { data: assets = [], isLoading: loadingAssets } = useAssets("", 1000);
  const { data: complianceData, isLoading: loadingCompliance } =
    useComplianceStatus("CISAzure", AZURE);

  const azureAssets = useMemo(
    () => assets.filter((a) => a.provider === AZURE),
    [assets],
  );
  const assetsAtRisk = useMemo(
    () => azureAssets.filter((a) => Number(a.riskScore ?? 0) > 0).length,
    [azureAssets],
  );
  const complianceScore = useMemo(
    () =>
      complianceData
        ? Number((complianceData as { score?: bigint }).score ?? 0n)
        : 0,
    [complianceData],
  );

  if (loadingProviders) {
    return (
      <Layout>
        <div
          data-ocid="azure.loading_state"
          className="provider-azure flex min-h-[60vh] items-center justify-center"
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
          data-ocid="azure.access_denied"
          className="provider-azure flex min-h-[60vh] items-center justify-center"
        >
          <div className="provider-shell provider-tint flex max-w-md flex-col items-center gap-3 p-10 text-center">
            <ShieldAlert size={32} className="provider-accent" />
            <h1 className="font-display text-lg font-semibold text-foreground">
              Azure access not assigned
            </h1>
            <p className="text-sm text-muted-foreground">
              You are not assigned to the Azure provider. Contact an
              administrator to request access. Azure data and remediation
              actions are blocked.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        data-ocid="azure_dashboard.page"
        className="provider-azure min-h-screen space-y-6"
      >
        {/* Header */}
        <div
          data-ocid="azure_dashboard.header"
          className="provider-shell provider-tint rounded-lg px-6 py-5"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg provider-accent-bar">
              <Cloud size={20} className="text-white" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl font-bold text-foreground">
                  Azure Dashboard
                </h1>
                <span className="badge-provider">Azure</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Azure Security Center posture — alerts, assets, compliance, and
                risk scoped to Azure only.
              </p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div
          data-ocid="azure_dashboard.stats_bar"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            label="Azure Active Alerts"
            value={alerts.length}
            isLoading={loadingAlerts}
            color="text-destructive"
            icon={<ShieldAlert size={16} />}
            ocid="azure_dashboard.stat.active_alerts"
          />
          <StatCard
            label="Azure Assets"
            value={azureAssets.length}
            isLoading={loadingAssets}
            color="text-blue-400"
            icon={<Server size={16} />}
            ocid="azure_dashboard.stat.assets"
          />
          <StatCard
            label="Azure Assets at Risk"
            value={assetsAtRisk}
            isLoading={loadingAssets}
            color="text-yellow-400"
            icon={<AlertTriangle size={16} />}
            ocid="azure_dashboard.stat.assets_at_risk"
          />
          <StatCard
            label="Azure Compliance (CIS)"
            value={`${complianceScore}%`}
            isLoading={loadingCompliance}
            color="text-green-400"
            icon={<CheckSquare size={16} />}
            ocid="azure_dashboard.stat.compliance"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            data-ocid="azure_dashboard.risk_score.section"
            className="lg:col-span-1"
          >
            <AzureRiskScore />
          </div>

          <div
            data-ocid="azure_dashboard.event_feed.section"
            className="lg:col-span-2"
          >
            <SecurityEventFeed />
          </div>

          <div
            data-ocid="azure_dashboard.incidents.section"
            className="lg:col-span-2"
          >
            <CorrelatedIncidentsPanel />
          </div>

          <div
            data-ocid="azure_dashboard.connection.section"
            className="lg:col-span-1 provider-shell provider-tint rounded-lg p-5"
          >
            <h2 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wide">
              Azure Connection
            </h2>
            <div className="flex items-center gap-2">
              <StatusBadge status="connected" />
              <span className="text-xs text-muted-foreground">
                Azure Security Center
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Severity mix</span>
                <span className="font-mono text-foreground">
                  {alerts.length} open
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(["Critical", "High", "Medium", "Low"] as const).map((sev) => {
                  const count = alerts.filter((a) => a.severity === sev).length;
                  return (
                    <div key={sev} className="flex items-center gap-1.5">
                      <SeverityBadge severity={sev} />
                      <span className="font-mono text-xs text-muted-foreground">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <AzureQuickActions />
      </div>
    </Layout>
  );
}
