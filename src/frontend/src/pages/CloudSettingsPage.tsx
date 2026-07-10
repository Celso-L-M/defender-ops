import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { ProviderIcon } from "../components/ProviderIcon";
import { StatusBadge } from "../components/StatusBadge";
import {
  useCredentialHealth,
  useGetEnrichmentKeys,
  useProviderStates,
  useSaveAwsCredentials,
  useSaveAzureCredentials,
  useSaveEnrichmentKeys,
  useSaveGcpCredentials,
  useSetPollingInterval,
  useTestConnection,
} from "../hooks/use-backend";
import { type CredentialHealth, CredentialHealthStatus } from "../types";
import type {
  PollingInterval,
  ProviderPollingState,
  ProviderType,
} from "../types";

// ─── CredentialHealthBadge ──────────────────────────────────────────────────

function formatExpiryTime(expiryNs: bigint | null): string {
  if (!expiryNs) return "";
  const expiryMs = Number(expiryNs / 1_000_000n);
  const d = new Date(expiryMs);
  return `Expires ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

function CredentialHealthBadge({
  health,
  expiryNs,
}: {
  health: CredentialHealth;
  expiryNs: bigint | null;
}) {
  if (health.__kind__ === "Valid") {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-green-950/50 text-emerald-400 border border-emerald-700/50">
          <ShieldCheck size={11} />
          Valid
        </span>
        {expiryNs && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {formatExpiryTime(expiryNs)}
          </span>
        )}
      </div>
    );
  }
  if (health.__kind__ === "Authenticating") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-muted/40 text-muted-foreground border border-border">
        <Loader2 size={11} className="animate-spin" />
        Authenticating...
      </span>
    );
  }
  if (health.__kind__ === "ExpiringSoon") {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-warning/15 text-warning border border-warning/40">
          <Clock size={11} />
          Expiring Soon
        </span>
        <span className="font-mono text-[10px] text-warning">{health._0}</span>
      </div>
    );
  }
  if (health.__kind__ === "Expired") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-destructive/15 text-destructive border border-destructive/40">
        <ShieldOff size={11} />
        Expired
      </span>
    );
  }
  // Error
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-destructive/15 text-destructive border border-destructive/40">
        <XCircle size={11} />
        Error
      </span>
      <p className="font-mono text-[11px] text-destructive mt-0.5">
        {health._0}
      </p>
    </div>
  );
}

function ProviderHealthBadge({ provider }: { provider: ProviderType }) {
  const { data: healthList, isLoading } = useCredentialHealth();
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-mono bg-muted/40 text-muted-foreground border border-border">
        <Loader2 size={11} className="animate-spin" />
        Checking...
      </span>
    );
  }
  const entry = healthList?.find((h) => h.provider === provider);
  if (!entry) return null;
  return (
    <CredentialHealthBadge health={entry.health} expiryNs={entry.expiryNs} />
  );
}

// ─── helpers ───────────────────────────────────────────────────────────────

function splitCsv(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const INTERVALS: { label: string; value: PollingInterval }[] = [
  { label: "Every 5 min", value: "FiveMin" },
  { label: "Every 15 min", value: "FifteenMin" },
  { label: "Every 30 min", value: "ThirtyMin" },
  { label: "Every hour", value: "OneHour" },
];

function formatTs(ts?: bigint): string {
  if (!ts) return "Never";
  const ms = Number(ts / 1_000_000n);
  if (ms === 0) return "Never";
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pollingStatusToConnection(
  state?: ProviderPollingState,
): "connected" | "disconnected" | "error" | "inactive" {
  if (!state) return "disconnected";
  if (state.status === "Active") return "connected";
  if (state.status === "Error") return "error";
  return "inactive";
}

// ─── PasswordInput ──────────────────────────────────────────────────────────

function PasswordInput({
  id,
  placeholder,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="font-mono pr-9"
        {...rest}
      />
      <button
        type="button"
        aria-label={show ? "Hide" : "Show"}
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

// ─── FieldError ─────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

// ─── TestResult ─────────────────────────────────────────────────────────────

function TestResult({
  success,
  message,
}: { success: boolean; message: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-xs mt-2 ${
        success ? "text-[oklch(var(--success))]" : "text-destructive"
      }`}
    >
      {success ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
      <span className="font-mono">{message}</span>
    </div>
  );
}

// ─── PollingSelect ──────────────────────────────────────────────────────────

function PollingSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: PollingInterval) => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as PollingInterval)}
      className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
    >
      {INTERVALS.map((i) => (
        <option key={i.value} value={i.value}>
          {i.label}
        </option>
      ))}
    </select>
  );
}

// ─── StatusBar ──────────────────────────────────────────────────────────────

function StatusBar() {
  const { data: states, isLoading } = useProviderStates();
  const providers: ProviderType[] = ["AWS", "Azure", "GCP"];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      data-ocid="settings.status_bar"
    >
      {providers.map((p) => {
        const s = states?.find((x) => x.provider === p);
        const connStatus = pollingStatusToConnection(s);
        return (
          <div
            key={p}
            data-ocid={`settings.provider_status.${p.toLowerCase()}`}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <ProviderIcon provider={p} showLabel={false} />
              <span className="font-mono text-xs font-semibold text-foreground">
                {p}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              {isLoading ? (
                <Loader2
                  size={12}
                  className="animate-spin text-muted-foreground"
                />
              ) : (
                <StatusBadge status={connStatus} />
              )}
              <span className="font-mono text-[10px] text-muted-foreground">
                {s ? formatTs(s.lastSuccessfulPoll) : "—"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SectionHeader ──────────────────────────────────────────────────────────

function SectionHeader({
  provider,
  open,
  onToggle,
  state,
}: {
  provider: ProviderType;
  open: boolean;
  onToggle: () => void;
  state?: ProviderPollingState;
}) {
  const connStatus = pollingStatusToConnection(state);
  return (
    <button
      type="button"
      onClick={onToggle}
      data-ocid={`settings.${provider.toLowerCase()}.toggle_button`}
      className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <ProviderIcon provider={provider} />
        <StatusBadge status={connStatus} />
        {state?.lastSuccessfulPoll && (
          <span className="font-mono text-[11px] text-muted-foreground">
            Last sync: {formatTs(state.lastSuccessfulPoll)}
          </span>
        )}
      </div>
      <svg
        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// ─── AWS Form ────────────────────────────────────────────────────────────────

interface AwsFormValues {
  roleArn: string;
  externalId: string;
  regions: string;
  interval: PollingInterval;
}

function AwsForm({ state }: { state?: ProviderPollingState }) {
  const save = useSaveAwsCredentials();
  const test = useTestConnection("AWS");
  const setInterval = useSetPollingInterval();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AwsFormValues>({
    defaultValues: { interval: state?.interval ?? "FifteenMin" },
  });

  const interval = watch("interval");
  const testResult = test.data;

  const onSave = handleSubmit(async (vals) => {
    try {
      await save.mutateAsync({
        roleArn: vals.roleArn,
        ...(vals.externalId.trim()
          ? { externalId: vals.externalId.trim() }
          : {}),
        regions: splitCsv(vals.regions),
      });
      await setInterval.mutateAsync({
        provider: "AWS",
        interval: vals.interval,
      });
      toast.success("AWS credentials saved");
    } catch {
      toast.error("Failed to save AWS credentials");
    }
  });

  return (
    <form
      onSubmit={onSave}
      className="px-5 pb-6 pt-2 space-y-5"
      data-ocid="settings.aws.form"
    >
      {/* Credential Health Badge */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Credential Status:
        </span>
        <ProviderHealthBadge provider="AWS" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label
            htmlFor="aws-role-arn"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Role ARN
          </Label>
          <Input
            id="aws-role-arn"
            placeholder="arn:aws:iam::123456789:role/SecOpsRole"
            className="font-mono"
            data-ocid="settings.aws.role_arn_input"
            {...register("roleArn", { required: "Required" })}
          />
          <FieldError message={errors.roleArn?.message} />
        </div>
        <div className="md:col-span-2">
          <Label
            htmlFor="aws-external-id"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            External ID (optional)
          </Label>
          <Input
            id="aws-external-id"
            placeholder="Optional external ID for trust policy"
            className="font-mono"
            data-ocid="settings.aws.external_id_input"
            {...register("externalId")}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="aws-regions"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Regions
          </Label>
          <Input
            id="aws-regions"
            placeholder="us-east-1, us-west-2, eu-west-1"
            className="font-mono"
            data-ocid="settings.aws.regions_input"
            {...register("regions")}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Comma-separated list
          </p>
        </div>
        <div>
          <Label
            htmlFor="aws-interval"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Polling Interval
          </Label>
          <PollingSelect
            id="aws-interval"
            value={interval}
            onChange={(v) => setValue("interval", v)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="settings.aws.test_button"
            disabled={test.isPending}
            onClick={() => test.mutate()}
            className="min-w-[140px]"
          >
            {test.isPending && (
              <Loader2 size={13} className="animate-spin mr-1.5" />
            )}
            Test Connection
          </Button>
          <Button
            type="submit"
            size="sm"
            data-ocid="settings.aws.save_button"
            disabled={save.isPending}
            className="min-w-[140px]"
          >
            {save.isPending && (
              <Loader2 size={13} className="animate-spin mr-1.5" />
            )}
            Save Credentials
          </Button>
        </div>
        {testResult && (
          <TestResult
            success={testResult.success}
            message={testResult.message}
          />
        )}
        {test.isError && (
          <TestResult success={false} message="Connection test failed" />
        )}
      </div>
    </form>
  );
}

// ─── Azure Form ──────────────────────────────────────────────────────────────

interface AzureFormValues {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  subscriptionIds: string;
  interval: PollingInterval;
}

function AzureForm({ state }: { state?: ProviderPollingState }) {
  const save = useSaveAzureCredentials();
  const test = useTestConnection("Azure");
  const setInterval = useSetPollingInterval();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AzureFormValues>({
    defaultValues: { interval: state?.interval ?? "FifteenMin" },
  });

  const interval = watch("interval");
  const testResult = test.data;

  const onSave = handleSubmit(async (vals) => {
    try {
      await save.mutateAsync({
        clientId: vals.clientId,
        clientSecret: vals.clientSecret,
        tenantId: vals.tenantId,
        subscriptionIds: splitCsv(vals.subscriptionIds),
      });
      await setInterval.mutateAsync({
        provider: "Azure",
        interval: vals.interval,
      });
      toast.success("Azure credentials saved");
    } catch {
      toast.error("Failed to save Azure credentials");
    }
  });

  return (
    <form
      onSubmit={onSave}
      className="px-5 pb-6 pt-2 space-y-5"
      data-ocid="settings.azure.form"
    >
      {/* Credential Health Badge - Azure */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Credential Status:
        </span>
        <ProviderHealthBadge provider="Azure" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="az-client-id"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Client ID
          </Label>
          <Input
            id="az-client-id"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="font-mono"
            data-ocid="settings.azure.client_id_input"
            {...register("clientId", { required: "Required" })}
          />
          <FieldError message={errors.clientId?.message} />
        </div>
        <div>
          <Label
            htmlFor="az-tenant-id"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Tenant ID
          </Label>
          <Input
            id="az-tenant-id"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="font-mono"
            data-ocid="settings.azure.tenant_id_input"
            {...register("tenantId", { required: "Required" })}
          />
          <FieldError message={errors.tenantId?.message} />
        </div>
      </div>
      <div>
        <Label
          htmlFor="az-client-secret"
          className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
        >
          Client Secret
        </Label>
        <PasswordInput
          id="az-client-secret"
          data-ocid="settings.azure.client_secret_input"
          {...register("clientSecret", { required: "Required" })}
        />
        <FieldError message={errors.clientSecret?.message} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="az-subs"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Subscription IDs
          </Label>
          <Input
            id="az-subs"
            placeholder="sub-id-1, sub-id-2"
            className="font-mono"
            data-ocid="settings.azure.subscription_ids_input"
            {...register("subscriptionIds")}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Comma-separated list
          </p>
        </div>
        <div>
          <Label
            htmlFor="az-interval"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Polling Interval
          </Label>
          <PollingSelect
            id="az-interval"
            value={interval}
            onChange={(v) => setValue("interval", v)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="settings.azure.test_button"
            disabled={test.isPending}
            onClick={() => test.mutate()}
            className="min-w-[140px]"
          >
            {test.isPending && (
              <Loader2 size={13} className="animate-spin mr-1.5" />
            )}
            Test Connection
          </Button>
          <Button
            type="submit"
            size="sm"
            data-ocid="settings.azure.save_button"
            disabled={save.isPending}
            className="min-w-[140px]"
          >
            {save.isPending && (
              <Loader2 size={13} className="animate-spin mr-1.5" />
            )}
            Save Credentials
          </Button>
        </div>
        {testResult && (
          <TestResult
            success={testResult.success}
            message={testResult.message}
          />
        )}
        {test.isError && (
          <TestResult success={false} message="Connection test failed" />
        )}
      </div>
    </form>
  );
}

// ─── GCP Form ────────────────────────────────────────────────────────────────

interface GcpFormValues {
  serviceAccountJson: string;
  projectIds: string;
  interval: PollingInterval;
}

function GcpForm({ state }: { state?: ProviderPollingState }) {
  const save = useSaveGcpCredentials();
  const test = useTestConnection("GCP");
  const setInterval = useSetPollingInterval();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GcpFormValues>({
    defaultValues: { interval: state?.interval ?? "FifteenMin" },
  });

  const interval = watch("interval");
  const testResult = test.data;

  const onSave = handleSubmit(async (vals) => {
    try {
      await save.mutateAsync({
        serviceAccountJson: vals.serviceAccountJson,
        projectIds: splitCsv(vals.projectIds),
      });
      await setInterval.mutateAsync({
        provider: "GCP",
        interval: vals.interval,
      });
      toast.success("GCP credentials saved");
    } catch {
      toast.error("Failed to save GCP credentials");
    }
  });

  return (
    <form
      onSubmit={onSave}
      className="px-5 pb-6 pt-2 space-y-5"
      data-ocid="settings.gcp.form"
    >
      {/* Credential Health Badge - GCP */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Credential Status:
        </span>
        <ProviderHealthBadge provider="GCP" />
      </div>
      <div>
        <Label
          htmlFor="gcp-sa-json"
          className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
        >
          Service Account JSON
        </Label>
        <Textarea
          id="gcp-sa-json"
          placeholder='{"type": "service_account", "project_id": "...", "private_key": "..."}'
          rows={6}
          className="font-mono text-xs resize-y"
          data-ocid="settings.gcp.service_account_textarea"
          {...register("serviceAccountJson", { required: "Required" })}
        />
        <FieldError message={errors.serviceAccountJson?.message} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="gcp-projects"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Project IDs
          </Label>
          <Input
            id="gcp-projects"
            placeholder="my-project-1, my-project-2"
            className="font-mono"
            data-ocid="settings.gcp.project_ids_input"
            {...register("projectIds")}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Comma-separated list
          </p>
        </div>
        <div>
          <Label
            htmlFor="gcp-interval"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block"
          >
            Polling Interval
          </Label>
          <PollingSelect
            id="gcp-interval"
            value={interval}
            onChange={(v) => setValue("interval", v)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="settings.gcp.test_button"
            disabled={test.isPending}
            onClick={() => test.mutate()}
            className="min-w-[140px]"
          >
            {test.isPending && (
              <Loader2 size={13} className="animate-spin mr-1.5" />
            )}
            Test Connection
          </Button>
          <Button
            type="submit"
            size="sm"
            data-ocid="settings.gcp.save_button"
            disabled={save.isPending}
            className="min-w-[140px]"
          >
            {save.isPending && (
              <Loader2 size={13} className="animate-spin mr-1.5" />
            )}
            Save Credentials
          </Button>
        </div>
        {testResult && (
          <TestResult
            success={testResult.success}
            message={testResult.message}
          />
        )}
        {test.isError && (
          <TestResult success={false} message="Connection test failed" />
        )}
      </div>
    </form>
  );
}

// ─── Accordion Section ───────────────────────────────────────────────────────

function ProviderSection({
  provider,
  state,
  children,
}: {
  provider: ProviderType;
  state?: ProviderPollingState;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);
  return (
    <section
      data-ocid={`settings.${provider.toLowerCase()}.section`}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <SectionHeader
        provider={provider}
        open={open}
        onToggle={() => setOpen((o) => !o)}
        state={state}
      />
      {open && (
        <>
          <Separator className="bg-border" />
          {children}
        </>
      )}
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

// ── Threat Intelligence API Keys Section ───────────────────────────────

function ThreatIntelSection() {
  const { data: keyStatus, isLoading: keysLoading } = useGetEnrichmentKeys();
  const saveKeys = useSaveEnrichmentKeys();
  const [abuseKey, setAbuseKey] = useState("");
  const [vtKey, setVtKey] = useState("");

  const handleSave = async () => {
    try {
      await saveKeys.mutateAsync({
        abuseIpdbKey: abuseKey.trim() || null,
        virusTotalKey: vtKey.trim() || null,
      });
      toast.success("API keys saved");
      setAbuseKey("");
      setVtKey("");
    } catch {
      toast.error("Failed to save API keys");
    }
  };

  return (
    <section
      data-ocid="settings.threat_intel.section"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-display text-sm font-semibold text-foreground">
          Threat Intelligence
        </h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          API keys for AbuseIPDB and VirusTotal enrichment. Keys are stored
          securely and never returned to the frontend.
        </p>
      </div>

      <div className="px-5 pb-6 pt-4 space-y-5">
        {/* AbuseIPDB */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="abuse-ipdb-key"
              className="text-xs text-muted-foreground uppercase tracking-wider"
            >
              AbuseIPDB API Key
            </Label>
            {keysLoading ? (
              <Loader2
                size={11}
                className="animate-spin text-muted-foreground"
              />
            ) : keyStatus?.abuseIpdbKeySet ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 size={11} />
                Key configured
              </span>
            ) : null}
          </div>
          <PasswordInput
            id="abuse-ipdb-key"
            placeholder="Enter AbuseIPDB API key"
            value={abuseKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAbuseKey(e.target.value)
            }
            data-ocid="settings.threat_intel.abuseipdb_input"
          />
        </div>

        {/* VirusTotal */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="virus-total-key"
              className="text-xs text-muted-foreground uppercase tracking-wider"
            >
              VirusTotal API Key
            </Label>
            {keysLoading ? (
              <Loader2
                size={11}
                className="animate-spin text-muted-foreground"
              />
            ) : keyStatus?.virusTotalKeySet ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 size={11} />
                Key configured
              </span>
            ) : null}
          </div>
          <PasswordInput
            id="virus-total-key"
            placeholder="Enter VirusTotal API key"
            value={vtKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVtKey(e.target.value)
            }
            data-ocid="settings.threat_intel.virustotal_input"
          />
        </div>

        <Button
          type="button"
          size="sm"
          data-ocid="settings.threat_intel.save_button"
          disabled={saveKeys.isPending || (!abuseKey.trim() && !vtKey.trim())}
          onClick={handleSave}
          className="min-w-[140px]"
        >
          {saveKeys.isPending && (
            <Loader2 size={13} className="animate-spin mr-1.5" />
          )}
          Save API Keys
        </Button>
      </div>
    </section>
  );
}

export default function CloudSettingsPage() {
  const { data: states } = useProviderStates();

  const getState = (p: ProviderType) => states?.find((s) => s.provider === p);

  return (
    <Layout>
      <div data-ocid="settings.page" className="space-y-6 max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Cloud Provider Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Configure credentials for each cloud provider
            </p>
          </div>
          <RefreshCw
            size={16}
            className="text-muted-foreground mt-1"
            aria-hidden="true"
          />
        </div>

        {/* Status Bar */}
        <StatusBar />

        {/* Provider Accordions */}
        <div className="space-y-4">
          <ProviderSection provider="AWS" state={getState("AWS")}>
            <AwsForm state={getState("AWS")} />
          </ProviderSection>

          <ProviderSection provider="Azure" state={getState("Azure")}>
            <AzureForm state={getState("Azure")} />
          </ProviderSection>

          <ProviderSection provider="GCP" state={getState("GCP")}>
            <GcpForm state={getState("GCP")} />
          </ProviderSection>

          <ThreatIntelSection />
        </div>
      </div>
    </Layout>
  );
}
