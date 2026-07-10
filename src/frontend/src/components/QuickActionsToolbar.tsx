import {
  useBlockIp,
  useDisableAzureAdAccount,
  useEscalateToIncident,
  useForceGcpIamReview,
  useIsolateResource,
  useRevokeIamCredentials,
} from "@/hooks/use-backend";
import type {
  BlockIpRequest,
  DisableAzureAdRequest,
  EscalateToIncidentRequest,
  ForceGcpIamReviewRequest,
  IsolateResourceRequest,
  PlaybookResult,
  ProviderType,
  RevokeIamRequest,
  Severity,
} from "@/types";
import {
  AlertTriangle,
  Eye,
  Key,
  Loader2,
  Server,
  Shield,
  UserX,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];
const PROVIDERS: ProviderType[] = ["AWS", "Azure", "GCP"];

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
        aria-labelledby="modal-title"
      >
        <div
          className="flex items-center gap-3 px-6 pt-6 pb-4 border-b"
          style={{ borderColor: "#2a2d3e" }}
        >
          <span className={accentClass}>
            <IconEl size={20} />
          </span>
          <h2
            id="modal-title"
            className="text-base font-semibold text-white font-display"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="quick_action.close_button"
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
      data-ocid="quick_action.dryrun_toggle"
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
          value ? "bg-blue-500" : "bg-white/10"
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
        backgroundColor: "rgba(59,130,246,0.07)",
        borderColor: "rgba(59,130,246,0.3)",
        color: "#93c5fd",
      }}
      data-ocid="quick_action.dryrun_preview"
    >
      <span className="font-semibold uppercase tracking-wide text-blue-400 mr-1.5">
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
  required = true,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      data-ocid={`quick_action.${id}_input`}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition"
      style={inputStyle}
    />
  );
}

function SelectInput({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-ocid={`quick_action.${id}_select`}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition"
      style={inputStyle}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function BlockIpModal({ onClose }: { onClose: () => void }) {
  const [ip, setIp] = useState("");
  const [providers, setProviders] = useState<ProviderType[]>(["AWS"]);
  const [dryRun, setDryRun] = useState(false);
  const [preview, setPreview] = useState("");
  const mutation = useBlockIp();

  const toggleProvider = (p: ProviderType) =>
    setProviders((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (providers.length === 0) {
      toast.error("Select at least one provider");
      return;
    }
    try {
      const result = await mutation.mutateAsync({
        ip: ip.trim(),
        providers,
        dryRun,
        customer: "default",
      });
      showPlaybookToast(result, `Block IP ${ip.trim()}`);
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
      title="Block IP"
      accentClass="text-red-400"
      IconEl={Shield}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Add the IP to network deny rules across selected providers. Takes
          immediate effect.
        </p>
        <Field label="IP Address">
          <TextInput
            id="ip"
            value={ip}
            onChange={setIp}
            placeholder="e.g. 185.234.219.10"
          />
        </Field>
        <Field label="Providers">
          <div className="flex gap-3">
            {PROVIDERS.map((p) => (
              <label
                key={p}
                className="flex items-center gap-1.5 text-sm cursor-pointer"
                style={{ color: "#94a3b8" }}
              >
                <input
                  type="checkbox"
                  checked={providers.includes(p)}
                  onChange={() => toggleProvider(p)}
                  data-ocid={`quick_action.provider_${p.toLowerCase()}_checkbox`}
                  className="accent-blue-500"
                />
                {p}
              </label>
            ))}
          </div>
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
            data-ocid="quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              !ip.trim() || providers.length === 0 || mutation.isPending
            }
            data-ocid="quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-red-400 border border-red-400/40 hover:bg-red-400/10 flex items-center justify-center gap-1.5"
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
  const [provider, setProvider] = useState<ProviderType>("AWS");
  const [dryRun, setDryRun] = useState(false);
  const [preview, setPreview] = useState("");
  const mutation = useIsolateResource();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: IsolateResourceRequest = {
      resourceId: resourceId.trim(),
      provider,
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Isolate ${resourceId.trim()}`);
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
      title="Isolate Resource"
      accentClass="text-orange-400"
      IconEl={Server}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Quarantine the resource from all network access. The resource will be
          isolated until reviewed.
        </p>
        <Field label="Resource ID">
          <TextInput
            id="resource"
            value={resourceId}
            onChange={setResourceId}
            placeholder="e.g. i-0a1b2c3d4e5f67890"
          />
        </Field>
        <Field label="Provider">
          <SelectInput
            id="isolate_provider"
            value={provider}
            onChange={(v) => setProvider(v as ProviderType)}
            options={PROVIDERS}
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
            data-ocid="quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!resourceId.trim() || mutation.isPending}
            data-ocid="quick_action.confirm_button"
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
    </ModalShell>
  );
}

function RevokeIamModal({ onClose }: { onClose: () => void }) {
  const [userId, setUserId] = useState("");
  const [provider, setProvider] = useState<ProviderType>("AWS");
  const [dryRun, setDryRun] = useState(false);
  const [preview, setPreview] = useState("");
  const mutation = useRevokeIamCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: RevokeIamRequest = {
      userId: userId.trim(),
      provider,
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Revoke credentials for ${userId.trim()}`);
      if (dryRun && result.dryRunPreview) {
        setPreview(result.dryRunPreview);
        return;
      }
      onClose();
    } catch {
      toast.error("Revoke IAM failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <ModalShell
      title="Revoke IAM Credentials"
      accentClass="text-yellow-400"
      IconEl={Key}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Revoke all active sessions and credentials for the specified user. The
          user will need to re-authenticate.
        </p>
        <Field label="User / Role ID">
          <TextInput
            id="iam_user"
            value={userId}
            onChange={setUserId}
            placeholder="arn:aws:iam::123456789:user/username"
          />
        </Field>
        <Field label="Provider">
          <SelectInput
            id="iam_provider"
            value={provider}
            onChange={(v) => setProvider(v as ProviderType)}
            options={PROVIDERS}
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
            data-ocid="quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!userId.trim() || mutation.isPending}
            data-ocid="quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-yellow-400 border border-yellow-400/40 hover:bg-yellow-400/10 flex items-center justify-center gap-1.5"
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

function DisableAzureAdModal({ onClose }: { onClose: () => void }) {
  const [upn, setUpn] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [preview, setPreview] = useState("");
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
      if (dryRun && result.dryRunPreview) {
        setPreview(result.dryRunPreview);
        return;
      }
      onClose();
    } catch {
      toast.error("Disable Azure AD failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <ModalShell
      title="Disable Azure AD Account"
      accentClass="text-blue-400"
      IconEl={UserX}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Disable the Azure AD account immediately. The user will be signed out
          of all sessions.
        </p>
        <Field label="User Principal Name">
          <TextInput
            id="azure_upn"
            value={upn}
            onChange={setUpn}
            placeholder="user@company.onmicrosoft.com"
            type="email"
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
            data-ocid="quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!upn.trim() || mutation.isPending}
            data-ocid="quick_action.confirm_button"
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
    const req: ForceGcpIamReviewRequest = {
      projectId: projectId.trim(),
      dryRun,
      customer: "default",
    };
    try {
      const result = await mutation.mutateAsync(req);
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
      accentClass="text-green-400"
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
            data-ocid="quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!projectId.trim() || mutation.isPending}
            data-ocid="quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-green-400 border border-green-400/40 hover:bg-green-400/10 flex items-center justify-center gap-1.5"
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

function EscalateModal({ onClose }: { onClose: () => void }) {
  const [alertId, setAlertId] = useState("");
  const [severity, setSeverity] = useState<Severity>("High");
  const [owner, setOwner] = useState("");
  const [notes, setNotes] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [preview, setPreview] = useState("");
  const mutation = useEscalateToIncident();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: EscalateToIncidentRequest = {
      alertId: alertId.trim(),
      severity,
      assignedOwner: owner.trim(),
      notes: notes.trim(),
      customer: "default",
      dryRun,
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Escalate alert ${alertId.trim()} to incident`);
      if (dryRun && result.dryRunPreview) {
        setPreview(result.dryRunPreview);
        return;
      }
      onClose();
    } catch {
      toast.error("Escalate to Incident failed", {
        description: "The action could not be completed. Check the audit log.",
      });
    }
  };

  return (
    <ModalShell
      title="Escalate to Incident"
      accentClass="text-purple-400"
      IconEl={AlertTriangle}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Promote the alert to a full incident response case. The security team
          will be notified immediately.
        </p>
        <Field label="Alert ID">
          <TextInput
            id="alert_id"
            value={alertId}
            onChange={setAlertId}
            placeholder="e.g. alert-uuid or 'UnauthorizedAccess:EC2'"
          />
        </Field>
        <Field label="Severity">
          <SelectInput
            id="escalate_severity"
            value={severity}
            onChange={(v) => setSeverity(v as Severity)}
            options={SEVERITIES}
          />
        </Field>
        <Field label="Assigned Owner">
          <TextInput
            id="owner"
            value={owner}
            onChange={setOwner}
            placeholder="e.g. john.doe@company.com"
            required={false}
          />
        </Field>
        <Field label="Notes">
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional context for the incident..."
            rows={3}
            data-ocid="quick_action.notes_textarea"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition resize-none"
            style={inputStyle}
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
            data-ocid="quick_action.cancel_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
            style={{ borderColor: "#2a2d3e", color: "#94a3b8" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!alertId.trim() || mutation.isPending}
            data-ocid="quick_action.confirm_button"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-purple-400 border border-purple-400/40 hover:bg-purple-400/10 flex items-center justify-center gap-1.5"
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

type ActionId =
  | "blockIp"
  | "isolateResource"
  | "revokeIam"
  | "disableAD"
  | "gcpIamReview"
  | "escalate";

const ACTION_BUTTONS: {
  id: ActionId;
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
    id: "isolateResource",
    label: "Isolate Resource",
    icon: Server,
    accent: "text-orange-400",
    hoverBorder: "hover:border-orange-400",
  },
  {
    id: "revokeIam",
    label: "Revoke IAM Credentials",
    icon: Key,
    accent: "text-yellow-400",
    hoverBorder: "hover:border-yellow-400",
  },
  {
    id: "disableAD",
    label: "Disable Azure AD Account",
    icon: UserX,
    accent: "text-blue-400",
    hoverBorder: "hover:border-blue-400",
  },
  {
    id: "gcpIamReview",
    label: "Force GCP IAM Review",
    icon: Eye,
    accent: "text-green-400",
    hoverBorder: "hover:border-green-400",
  },
  {
    id: "escalate",
    label: "Escalate to Incident",
    icon: AlertTriangle,
    accent: "text-purple-400",
    hoverBorder: "hover:border-purple-400",
  },
];

export function QuickActionsToolbar() {
  const [activeAction, setActiveAction] = useState<ActionId | null>(null);
  const closeModal = useCallback(() => setActiveAction(null), []);

  return (
    <>
      <div
        data-ocid="quick_actions.panel"
        className="sticky bottom-0 border-t py-3 px-6 z-40"
        style={{ backgroundColor: "#0f1117", borderColor: "#2a2d3e" }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-semibold uppercase tracking-widest mr-2"
            style={{ color: "#4a5568" }}
          >
            Quick Actions
          </span>
          {ACTION_BUTTONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => setActiveAction(action.id)}
                data-ocid={`quick_action.${action.id}_button`}
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

      {activeAction === "blockIp" && <BlockIpModal onClose={closeModal} />}
      {activeAction === "isolateResource" && (
        <IsolateResourceModal onClose={closeModal} />
      )}
      {activeAction === "revokeIam" && <RevokeIamModal onClose={closeModal} />}
      {activeAction === "disableAD" && (
        <DisableAzureAdModal onClose={closeModal} />
      )}
      {activeAction === "gcpIamReview" && (
        <GcpIamReviewModal onClose={closeModal} />
      )}
      {activeAction === "escalate" && <EscalateModal onClose={closeModal} />}
    </>
  );
}
