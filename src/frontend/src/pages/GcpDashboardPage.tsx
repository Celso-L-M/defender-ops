import {
  AlertTriangle,
  CheckSquare,
  Eye,
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
import { ProviderIcon } from "../components/ProviderIcon";
import { SecurityEventFeed } from "../components/SecurityEventFeed";
import { SeverityBadge } from "../components/SeverityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useProviderFilter } from "../contexts/provider-filter";
import {
  useAssets,
  useBlockIp,
  useComplianceStatus,
  useForceGcpIamReview,
  useGetMyProviders,
  useIsolateResource,
  useNormalizedAlerts,
} from "../hooks/use-backend";
import type {
  Asset,
  NormalizedAlert,
  PlaybookResult,
  ProviderType,
  Severity,
} from "../types";

const GCP: ProviderType = "GCP";

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

// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  isLoading,
  icon,
  ocid,
}: {
  label: string;
  value: string | number;
  isLoading: boolean;
  icon: React.ReactNode;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="provider-shell provider-tint flex items-center gap-3 p-4"
    >
      <div className="provider-accent shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">
          {label}
        </p>
        {isLoading ? (
          <div className="mt-1 h-5 w-16 rounded bg-muted/30 animate-pulse" />
        ) : (
          <p className="provider-accent font-display text-xl font-bold tabular-nums">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── GCP Risk Score ──────────────────────────────────────────────────────────

function GcpRiskScoreCard({
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
      data-ocid="gcp.risk_score.card"
      className="provider-shell provider-tint flex flex-col p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm font-semibold text-foreground tracking-wide">
          GCP Risk Score
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
                ? "No active GCP alerts"
                : `${alerts.length} active GCP alert${alerts.length !== 1 ? "s" : ""}`}
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

// ─── GCP Compliance ──────────────────────────────────────────────────────────

function GcpComplianceCard({
  score,
  passing,
  failing,
  isLoading,
}: {
  score: number;
  passing: number;
  failing: number;
  isLoading: boolean;
}) {
  return (
    <div
      data-ocid="gcp.compliance.card"
      className="provider-shell provider-tint flex flex-col p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm font-semibold text-foreground tracking-wide">
          GCP Compliance
        </h2>
        <CheckSquare size={16} className="provider-accent" />
      </div>
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-10 w-20 rounded bg-muted/30 animate-pulse" />
          <div className="h-4 w-32 rounded bg-muted/30 animate-pulse" />
        </div>
      ) : (
        <>
          <div className="provider-accent font-display text-3xl font-bold tabular-nums">
            {score}%
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
            NIST CSF
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded border border-success/30 bg-success/10 px-3 py-2">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Passing
              </p>
              <p className="font-display text-lg font-bold text-success tabular-nums">
                {passing}
              </p>
            </div>
            <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Failing
              </p>
              <p className="font-display text-lg font-bold text-destructive tabular-nums">
                {failing}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── GCP Assets ──────────────────────────────────────────────────────────────

function GcpAssetsTable({
  assets,
  isLoading,
}: {
  assets: Asset[];
  isLoading: boolean;
}) {
  const atRisk = assets.filter((a) => Number(a.riskScore) > 0).length;

  return (
    <div
      data-ocid="gcp.assets.panel"
      className="provider-shell flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="provider-accent">
            <Server size={16} />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-foreground tracking-wide">
              GCP Assets
            </h2>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${assets.length} assets · ${atRisk} at risk`}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div
          data-ocid="gcp.assets.loading_state"
          className="flex items-center justify-center py-12"
        >
          <LoadingSpinner size={24} />
        </div>
      ) : assets.length === 0 ? (
        <div
          data-ocid="gcp.assets.empty_state"
          className="flex flex-col items-center justify-center py-12 gap-3 text-center"
        >
          <Server size={28} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No GCP assets discovered yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left data-dense">
            <thead>
              <tr className="border-b border-border/40">
                <th className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2">
                  Name
                </th>
                <th className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2">
                  Type
                </th>
                <th className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2">
                  Region
                </th>
                <th className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2 text-right">
                  Risk
                </th>
                <th className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2 text-right">
                  Findings
                </th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, idx) => (
                <tr
                  key={asset.id}
                  data-ocid={`gcp.assets.item.${idx + 1}`}
                  className="border-b border-border/20 hover:bg-muted/10 transition-colors"
                >
                  <td className="font-mono text-xs text-foreground max-w-[220px]">
                    <span className="truncate block" title={asset.name}>
                      {asset.name}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">
                    {asset.assetType}
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">
                    {asset.region}
                  </td>
                  <td className="text-right">
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        Number(asset.riskScore) > 30
                          ? "text-destructive font-bold"
                          : Number(asset.riskScore) > 10
                            ? "text-warning font-semibold"
                            : "text-success font-semibold"
                      }`}
                    >
                      {Number(asset.riskScore)}
                    </span>
                  </td>
                  <td className="text-right">
                    {Number(asset.openFindings) > 0 ? (
                      <span className="font-mono text-xs font-bold text-destructive tabular-nums">
                        {Number(asset.openFindings)}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground">
                        0
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── GCP Quick Actions ───────────────────────────────────────────────────────

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

function ModalShell({
  title,
  accentClass,
  IconEl,
  onClose,
  children,
}: {
  title: string;
  accentClass: string;
  IconEl: React.ElementType;
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
      <dialog
        open
        className="relative w-full max-w-md rounded-xl border p-0 shadow-2xl text-left"
        style={{ backgroundColor: "#1a1d27", borderColor: "#2a2d3e" }}
        aria-labelledby="gcp-modal-title"
      >
        <div
          className="flex items-center gap-3 px-6 pt-6 pb-4 border-b"
          style={{ borderColor: "#2a2d3e" }}
        >
          <span className={accentClass}>
            <IconEl size={20} />
          </span>
          <h2
            id="gcp-modal-title"
            className="text-base font-semibold text-white font-display"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="gcp_quick_action.close_button"
            aria-label="Close dialog"
            className="ml-auto opacity-50 hover:opacity-100 transition-opacity text-white"
          >
            X
          </button>
        </div>
        {children}
      </dialog>
    </div>
  );
}

function DryRunToggle({
  value,
  onChange,
}: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer select-none"
      data-ocid="gcp_quick_action.dryrun_toggle"
      onClick={() => onChange(!value)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!value);
        }
      }}
      role="switch"
      aria-checked={value}
      tabIndex={0}
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          value ? "bg-emerald-500" : "bg-white/10"
        }`}
        aria-hidden="true"
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-xs" style={{ color: "#94a3b8" }}>
        Dry Run (preview only)
      </span>
    </div>
  );
}

function DryRunPreview({ preview }: { preview: string }) {
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs border"
      style={{
        backgroundColor: "rgba(16,185,129,0.07)",
        borderColor: "rgba(16,185,129,0.3)",
        color: "#6ee7b7",
      }}
      data-ocid="gcp_quick_action.dryrun_preview"
    >
      <span className="font-semibold uppercase tracking-wide text-emerald-400 mr-1.5">
        Preview:
      </span>
      {preview}
    </div>
  );
}

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span
        className="block text-xs font-medium uppercase tracking-wide"
        style={{ color: "#64748b" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

const inputStyle = {
  backgroundColor: "#0f1117",
  border: "1px solid #2a2d3e",
  color: "white",
} as const;

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      data-ocid={`gcp_quick_action.${id}_input`}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-500 transition"
      style={inputStyle}
    />
  );
}

function BlockIpModal({ onClose }: { onClose: () => void }) {
  const [ip, setIp] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [preview, setPreview] = useState("");
  const mutation = useBlockIp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await mutation.mutateAsync({
        ip: ip.trim(),
        providers: [GCP],
        dryRun,
        customer: "default",
      });
      showPlaybookToast(result, `Block IP ${ip.trim()} on GCP`);
      if (dryRun && result.dryRunPreview) {
        setPreview(result.dryRunPreview);
        return;
      }
      onClose();
    } catch {
      toast.error("Block IP failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <ModalShell
      title="Block IP (GCP)"
      accentClass="text-emerald-400"
      IconEl={Shield}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Add the IP to GCP firewall deny rules. Takes immediate effect on GCP
          resources only.
        </p>
        <Field label="IP Address">
          <TextInput
            id="ip"
            value={ip}
            onChange={setIp}
            placeholder="e.g. 185.234.219.10"
          />
        </Field>
        <DryRunToggle
          value={dryRun}
          onChange={(v) => {
            setDryRun(v);
            setPreview("");
          }}
        />
        {preview && <DryRunPreview preview={preview} />}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="gcp_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ip.trim() || mutation.isPending}
            data-ocid="gcp_quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-400/40 hover:bg-emerald-400/10 flex items-center justify-center gap-1.5"
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
    </ModalShell>
  );
}

function IsolateResourceModal({ onClose }: { onClose: () => void }) {
  const [resourceId, setResourceId] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [preview, setPreview] = useState("");
  const mutation = useIsolateResource();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await mutation.mutateAsync({
        resourceId: resourceId.trim(),
        provider: GCP,
        dryRun,
        customer: "default",
      });
      showPlaybookToast(result, `Isolate ${resourceId.trim()} on GCP`);
      if (dryRun && result.dryRunPreview) {
        setPreview(result.dryRunPreview);
        return;
      }
      onClose();
    } catch {
      toast.error("Isolate Resource failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <ModalShell
      title="Isolate Resource (GCP)"
      accentClass="text-emerald-400"
      IconEl={Server}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Quarantine the GCP resource from all network access until reviewed.
        </p>
        <Field label="Resource ID">
          <TextInput
            id="resource"
            value={resourceId}
            onChange={setResourceId}
            placeholder="e.g. projects/my-project/zones/us-central1-a/instances/..."
          />
        </Field>
        <DryRunToggle
          value={dryRun}
          onChange={(v) => {
            setDryRun(v);
            setPreview("");
          }}
        />
        {preview && <DryRunPreview preview={preview} />}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="gcp_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!resourceId.trim() || mutation.isPending}
            data-ocid="gcp_quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-400/40 hover:bg-emerald-400/10 flex items-center justify-center gap-1.5"
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
    </ModalShell>
  );
}

function GcpIamReviewModal({ onClose }: { onClose: () => void }) {
  const [projectId, setProjectId] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [preview, setPreview] = useState("");
  const mutation = useForceGcpIamReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await mutation.mutateAsync({
        projectId: projectId.trim(),
        dryRun,
        customer: "default",
      });
      showPlaybookToast(result, `GCP IAM Review for ${projectId.trim()}`);
      if (dryRun && result.dryRunPreview) {
        setPreview(result.dryRunPreview);
        return;
      }
      onClose();
    } catch {
      toast.error("GCP IAM Review failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <ModalShell
      title="Force GCP IAM Review"
      accentClass="text-emerald-400"
      IconEl={Eye}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Generate an IAM review report for the GCP project. All overprivileged
          bindings will be flagged and posted to the incident record.
        </p>
        <Field label="GCP Project ID">
          <TextInput
            id="gcp_project"
            value={projectId}
            onChange={setProjectId}
            placeholder="e.g. my-project-123456"
          />
        </Field>
        <DryRunToggle
          value={dryRun}
          onChange={(v) => {
            setDryRun(v);
            setPreview("");
          }}
        />
        {preview && <DryRunPreview preview={preview} />}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            data-ocid="gcp_quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!projectId.trim() || mutation.isPending}
            data-ocid="gcp_quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-400/40 hover:bg-emerald-400/10 flex items-center justify-center gap-1.5"
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
    </ModalShell>
  );
}

type GcpActionId = "blockIp" | "isolateResource" | "gcpIamReview";

const GCP_ACTIONS: {
  id: GcpActionId;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "blockIp", label: "Block IP", icon: Shield },
  { id: "isolateResource", label: "Isolate Resource", icon: Server },
  { id: "gcpIamReview", label: "Force GCP IAM Review", icon: Eye },
];

function GcpQuickActions() {
  const [activeAction, setActiveAction] = useState<GcpActionId | null>(null);
  const closeModal = () => setActiveAction(null);

  return (
    <>
      <div
        data-ocid="gcp.quick_actions.panel"
        className="provider-shell provider-tint p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={16} className="provider-accent" />
          <h2 className="font-display text-sm font-semibold text-foreground tracking-wide">
            GCP Quick Actions
          </h2>
          <span className="badge-provider ml-1">GCP</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {GCP_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => setActiveAction(action.id)}
                data-ocid={`gcp_quick_action.${action.id}_button`}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10 transition-all active:scale-95"
                style={{ backgroundColor: "#1a1d27" }}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeAction === "blockIp" && <BlockIpModal onClose={closeModal} />}
      {activeAction === "isolateResource" && (
        <IsolateResourceModal onClose={closeModal} />
      )}
      {activeAction === "gcpIamReview" && (
        <GcpIamReviewModal onClose={closeModal} />
      )}
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function GcpDashboardPage() {
  const { setSelectedProvider } = useProviderFilter();
  const { data: myProviders = [], isLoading: loadingProviders } =
    useGetMyProviders();

  useEffect(() => {
    setSelectedProvider(GCP);
    return () => setSelectedProvider(null);
  }, [setSelectedProvider]);

  const isAssigned = myProviders.includes(GCP);

  const alerts = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: GCP,
  });
  const assets = useAssets("", 500);
  const compliance = useComplianceStatus("NISTCSF", GCP);

  const gcpAssets = useMemo(
    () => (assets.data ?? []).filter((a) => a.provider === GCP),
    [assets.data],
  );

  const activeAlerts = useMemo(
    () => (alerts.data ?? []).filter((a) => a.status !== "Resolved"),
    [alerts.data],
  );
  const assetsAtRisk = useMemo(
    () => gcpAssets.filter((a) => Number(a.riskScore) > 0).length,
    [gcpAssets],
  );
  const complianceScore = Number(compliance.data?.score ?? 0n);
  const compliancePassing = Number(compliance.data?.passing ?? 0n);
  const complianceFailing = Number(compliance.data?.failing ?? 0n);

  if (loadingProviders) {
    return (
      <Layout>
        <div
          data-ocid="gcp.loading_state"
          className="provider-gcp flex min-h-[60vh] items-center justify-center"
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
          data-ocid="gcp.access_denied"
          className="provider-gcp flex min-h-[60vh] items-center justify-center"
        >
          <div className="provider-shell provider-tint flex max-w-md flex-col items-center gap-3 p-10 text-center">
            <ShieldAlert size={32} className="provider-accent" />
            <h1 className="font-display text-lg font-semibold text-foreground">
              GCP access not assigned
            </h1>
            <p className="text-sm text-muted-foreground">
              You are not assigned to the GCP provider. Contact an administrator
              to request access. GCP data and remediation actions are blocked.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div data-ocid="gcp.page" className="provider-gcp space-y-6">
        {/* Page header */}
        <div className="provider-shell provider-tint flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <ProviderIcon provider={GCP} className="text-base" />
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                GCP Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Isolated security view for Google Cloud Platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-provider">GCP</span>
            <StatusBadge status="connected" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Alerts"
            value={activeAlerts.length}
            isLoading={alerts.isLoading}
            icon={<ShieldAlert size={16} />}
            ocid="gcp.stat.active_alerts"
          />
          <StatCard
            label="Assets at Risk"
            value={assetsAtRisk}
            isLoading={assets.isLoading}
            icon={<Server size={16} />}
            ocid="gcp.stat.assets_at_risk"
          />
          <StatCard
            label="Compliance Score"
            value={`${complianceScore}%`}
            isLoading={compliance.isLoading}
            icon={<CheckSquare size={16} />}
            ocid="gcp.stat.compliance_score"
          />
          <StatCard
            label="Risk Score"
            value={(() => {
              const totalWeighted = activeAlerts.reduce(
                (sum, a) => sum + severityWeight(a.severity),
                0,
              );
              const maxPossible = activeAlerts.length * 4;
              const raw =
                maxPossible > 0 ? (totalWeighted / maxPossible) * 100 : 0;
              return Math.min(100, Math.round(raw));
            })()}
            isLoading={alerts.isLoading}
            icon={<AlertTriangle size={16} />}
            ocid="gcp.stat.risk_score"
          />
        </div>

        {/* Main grid: event feed + incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div data-ocid="gcp.event_feed.section" className="lg:col-span-2">
            <SecurityEventFeed />
          </div>
          <div data-ocid="gcp.incidents.section" className="lg:col-span-1">
            <CorrelatedIncidentsPanel />
          </div>
        </div>

        {/* Assets + risk/compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div data-ocid="gcp.assets.section" className="lg:col-span-2">
            <GcpAssetsTable assets={gcpAssets} isLoading={assets.isLoading} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <GcpRiskScoreCard
              alerts={activeAlerts}
              isLoading={alerts.isLoading}
            />
            <GcpComplianceCard
              score={complianceScore}
              passing={compliancePassing}
              failing={complianceFailing}
              isLoading={compliance.isLoading}
            />
          </div>
        </div>

        {/* Quick actions */}
        <GcpQuickActions />
      </div>
    </Layout>
  );
}
