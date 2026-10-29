import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  BellRing,
  Mail,
  MessageSquare,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useAlertRules,
  useDeleteAlertRule,
  useNormalizedAlerts,
  useSaveAlertRule,
} from "../hooks/use-backend";
import type {
  AlertRule,
  NotificationChannel,
  ProviderType,
  RuleSeverityThreshold,
} from "../types";

// The backend keys alert rules by the same `customer` value every normalized
// alert carries: the provider accountId, or the literal "default" when the
// account has none (see AlertNormalization). The router matches a rule only
// when its customer is empty or equals the alert's customer, so rules must be
// loaded and saved under that exact key. With no alerts yet we fall back to
// the literal "default" the backend would assign an account without one.
const DEFAULT_CUSTOMER = "default";

const SEVERITY_OPTIONS: { label: string; value: RuleSeverityThreshold }[] = [
  { label: "Any Critical", value: "AnyCritical" },
  { label: "Any High or above", value: "AnyHigh" },
  { label: "Any Medium or above", value: "AnyMedium" },
  { label: "Any Low", value: "AnyLow" },
  { label: "Critical or High", value: "CriticalOrHigh" },
  { label: "All findings", value: "All" },
];

const PROVIDER_OPTIONS: ProviderType[] = ["AWS", "Azure", "GCP"];

const CHANNEL_OPTIONS: {
  value: NotificationChannel;
  label: string;
  description: string;
  icon: typeof BellRing;
}[] = [
  {
    value: "InApp",
    label: "In-app",
    description: "Notification center",
    icon: BellRing,
  },
  {
    value: "Email",
    label: "Email",
    description: "Routed recipients",
    icon: Mail,
  },
  {
    value: "TeamsWebhook",
    label: "Teams",
    description: "Microsoft Teams webhook",
    icon: MessageSquare,
  },
];

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  InApp: "In-app",
  Email: "Email",
  TeamsWebhook: "Teams",
};

const CHANNEL_BADGE: Record<NotificationChannel, string> = {
  InApp: "border-primary/40 text-primary",
  Email: "border-chart-2/40 text-chart-2",
  TeamsWebhook: "border-accent/40 text-accent-foreground",
};

interface RuleFormState {
  name: string;
  enabled: boolean;
  severityThreshold: RuleSeverityThreshold | "";
  findingType: string;
  assetId: string;
  provider: ProviderType | "";
  region: string;
  channels: NotificationChannel[];
  cooldownMinutes: string;
  escalationMinutes: string;
  escalationRecipient: string;
}

const DEFAULT_FORM: RuleFormState = {
  name: "",
  enabled: true,
  severityThreshold: "",
  findingType: "",
  assetId: "",
  provider: "",
  region: "",
  channels: ["InApp"],
  cooldownMinutes: "60",
  escalationMinutes: "",
  escalationRecipient: "",
};

function ruleToForm(rule: AlertRule): RuleFormState {
  return {
    name: rule.name,
    enabled: rule.enabled,
    severityThreshold: rule.severityThreshold ?? "",
    findingType: rule.findingType ?? "",
    assetId: rule.assetId ?? "",
    provider: rule.provider ?? "",
    region: rule.region ?? "",
    channels: rule.channels as NotificationChannel[],
    cooldownMinutes: String(Number(rule.cooldownMinutes)),
    escalationMinutes: rule.escalationMinutes
      ? String(Number(rule.escalationMinutes))
      : "",
    escalationRecipient: rule.escalationRecipient ?? "",
  };
}

function validate(form: RuleFormState): string | null {
  if (!form.name.trim()) return "A rule name is required.";
  if (form.channels.length === 0)
    return "Select at least one notification channel.";
  const cooldown = Number(form.cooldownMinutes);
  if (!Number.isFinite(cooldown) || cooldown < 0)
    return "Cooldown must be zero or more minutes.";
  if (form.escalationMinutes !== "") {
    const escalation = Number(form.escalationMinutes);
    if (!Number.isFinite(escalation) || escalation <= 0)
      return "Escalation window must be a positive number of minutes.";
    if (!form.escalationRecipient.trim())
      return "An escalation recipient is required when an escalation window is set.";
  }
  return null;
}

function RuleForm({
  editing,
  customer,
  onClose,
}: {
  editing: AlertRule | null;
  customer: string;
  onClose: () => void;
}) {
  const [form, setForm] = React.useState<RuleFormState>(() =>
    editing ? ruleToForm(editing) : DEFAULT_FORM,
  );
  const [error, setError] = React.useState<string | null>(null);
  const saveRule = useSaveAlertRule();

  function toggleChannel(channel: NotificationChannel) {
    setForm((f) => ({
      ...f,
      channels: f.channels.includes(channel)
        ? f.channels.filter((c) => c !== channel)
        : [...f.channels, channel],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    const rule: AlertRule = {
      id: editing?.id ?? `rule-${Date.now()}`,
      name: form.name.trim(),
      customer,
      enabled: form.enabled,
      severityThreshold: form.severityThreshold || undefined,
      findingType: form.findingType.trim() || undefined,
      assetId: form.assetId.trim() || undefined,
      provider: (form.provider as ProviderType) || undefined,
      region: form.region.trim() || undefined,
      channels: form.channels,
      cooldownMinutes: BigInt(Number(form.cooldownMinutes)),
      escalationMinutes:
        form.escalationMinutes !== ""
          ? BigInt(Number(form.escalationMinutes))
          : undefined,
      escalationRecipient: form.escalationRecipient.trim() || undefined,
    };
    saveRule.mutate(rule, {
      onSuccess: () => {
        toast.success(editing ? "Alert rule updated" : "Alert rule created");
        onClose();
      },
      onError: () => {
        setError("Could not save the rule. Please try again.");
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid="alert_rules.form"
      className="rounded-lg border border-border bg-card overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <h2 className="font-display font-semibold text-sm text-foreground">
          {editing ? "Edit Alert Rule" : "New Alert Rule"}
        </h2>
        <button
          type="button"
          data-ocid="alert_rules.form.close_button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          aria-label="Close rule form"
        >
          <X size={15} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="rule-name"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Rule Name
            </Label>
            <Input
              id="rule-name"
              data-ocid="alert_rules.name_input"
              placeholder="e.g. Critical AWS production alerts"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-background h-9 text-sm"
            />
          </div>
          <div className="flex items-end gap-3 pb-1.5">
            <Switch
              data-ocid="alert_rules.enabled_switch"
              checked={form.enabled}
              onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))}
            />
            <div>
              <p className="text-sm text-foreground leading-tight">
                {form.enabled ? "Enabled" : "Disabled"}
              </p>
              <p className="text-xs text-muted-foreground">
                {form.enabled
                  ? "Rule is actively matching findings"
                  : "Rule is saved but will not fire"}
              </p>
            </div>
          </div>
        </div>

        {/* Match criteria */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            Match Criteria
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="rule-severity"
                className="text-xs font-medium text-muted-foreground"
              >
                Severity threshold
              </Label>
              <select
                id="rule-severity"
                data-ocid="alert_rules.severity_select"
                value={form.severityThreshold}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    severityThreshold: e.target.value as
                      | RuleSeverityThreshold
                      | "",
                  }))
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
              >
                <option value="">Any severity</option>
                {SEVERITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="rule-provider"
                className="text-xs font-medium text-muted-foreground"
              >
                Provider
              </Label>
              <select
                id="rule-provider"
                data-ocid="alert_rules.provider_select"
                value={form.provider}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    provider: e.target.value as ProviderType | "",
                  }))
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
              >
                <option value="">Any provider</option>
                {PROVIDER_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="rule-finding-type"
                className="text-xs font-medium text-muted-foreground"
              >
                Finding type
              </Label>
              <Input
                id="rule-finding-type"
                data-ocid="alert_rules.finding_type_input"
                placeholder="e.g. UnauthorizedAccess"
                value={form.findingType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, findingType: e.target.value }))
                }
                className="bg-background h-9 text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="rule-asset"
                className="text-xs font-medium text-muted-foreground"
              >
                Asset ID
              </Label>
              <Input
                id="rule-asset"
                data-ocid="alert_rules.asset_input"
                placeholder="e.g. i-0abc123def"
                value={form.assetId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assetId: e.target.value }))
                }
                className="bg-background h-9 text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label
                htmlFor="rule-region"
                className="text-xs font-medium text-muted-foreground"
              >
                Region
              </Label>
              <Input
                id="rule-region"
                data-ocid="alert_rules.region_input"
                placeholder="e.g. us-east-1"
                value={form.region}
                onChange={(e) =>
                  setForm((f) => ({ ...f, region: e.target.value }))
                }
                className="bg-background h-9 text-sm font-mono"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Leave a criterion blank to match any value.
          </p>
        </div>

        {/* Channels */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            Notification Channels
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {CHANNEL_OPTIONS.map(
              ({ value, label, description, icon: Icon }) => {
                const active = form.channels.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    data-ocid={`alert_rules.channel_${value.toLowerCase()}_toggle`}
                    aria-pressed={active}
                    onClick={() => toggleChannel(value)}
                    className={`flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-background hover:bg-muted/30"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={`mt-0.5 shrink-0 ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {label}
                      </span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {description}
                      </span>
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Deduplication & escalation */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            Deduplication &amp; Escalation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="rule-cooldown"
                className="text-xs font-medium text-muted-foreground"
              >
                Cooldown (minutes)
              </Label>
              <Input
                id="rule-cooldown"
                type="number"
                min={0}
                data-ocid="alert_rules.cooldown_input"
                value={form.cooldownMinutes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cooldownMinutes: e.target.value }))
                }
                className="bg-background h-9 text-sm font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Suppress duplicate alerts for this window.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="rule-escalation"
                className="text-xs font-medium text-muted-foreground"
              >
                Escalation window (minutes)
              </Label>
              <Input
                id="rule-escalation"
                type="number"
                min={1}
                data-ocid="alert_rules.escalation_minutes_input"
                placeholder="Optional"
                value={form.escalationMinutes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, escalationMinutes: e.target.value }))
                }
                className="bg-background h-9 text-sm font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Escalate if unacknowledged within this window.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="rule-escalation-recipient"
                className="text-xs font-medium text-muted-foreground"
              >
                Escalation recipient
              </Label>
              <Input
                id="rule-escalation-recipient"
                data-ocid="alert_rules.escalation_recipient_input"
                placeholder="e.g. oncall@example.com"
                value={form.escalationRecipient}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    escalationRecipient: e.target.value,
                  }))
                }
                className="bg-background h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Required when an escalation window is set.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
            data-ocid="alert_rules.form.error_state"
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5"
          >
            <AlertTriangle
              size={15}
              className="mt-0.5 shrink-0 text-destructive"
            />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            data-ocid="alert_rules.form.cancel_button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            data-ocid="alert_rules.form.submit_button"
            disabled={saveRule.isPending}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {saveRule.isPending ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <SlidersHorizontal size={14} />
                {editing ? "Save Changes" : "Create Rule"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

function RuleCard({
  rule,
  index,
  onEdit,
}: {
  rule: AlertRule;
  index: number;
  onEdit: (rule: AlertRule) => void;
}) {
  const saveRule = useSaveAlertRule();
  const deleteRule = useDeleteAlertRule();

  const criteria: string[] = [];
  if (rule.severityThreshold) {
    const label =
      SEVERITY_OPTIONS.find((o) => o.value === rule.severityThreshold)?.label ??
      rule.severityThreshold;
    criteria.push(label);
  }
  if (rule.provider) criteria.push(rule.provider);
  if (rule.findingType) criteria.push(rule.findingType);
  if (rule.region) criteria.push(rule.region);
  if (rule.assetId) criteria.push(rule.assetId);

  function handleToggle(enabled: boolean) {
    saveRule.mutate(
      { ...rule, enabled },
      {
        onSuccess: () =>
          toast.success(enabled ? "Rule enabled" : "Rule disabled"),
        onError: () => toast.error("Could not update the rule"),
      },
    );
  }

  function handleDelete() {
    deleteRule.mutate(rule.id, {
      onSuccess: () => toast.success("Alert rule deleted"),
      onError: () => toast.error("Could not delete the rule"),
    });
  }

  return (
    <div
      data-ocid={`alert_rules.item.${index}`}
      className={`rounded-lg border bg-card p-4 transition-colors ${
        rule.enabled ? "border-border" : "border-border/60 opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-sm text-foreground truncate">
              {rule.name}
            </h3>
            <span
              className={
                rule.enabled
                  ? "badge-status-connected"
                  : "badge-status-inactive"
              }
            >
              {rule.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {criteria.length > 0 ? (
              criteria.map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="text-[10px] font-mono border-border text-muted-foreground"
                >
                  {c}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                Matches all findings
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {rule.channels.map((channel) => (
              <Badge
                key={channel}
                variant="outline"
                className={`text-[10px] font-mono ${CHANNEL_BADGE[channel]}`}
              >
                {CHANNEL_LABELS[channel]}
              </Badge>
            ))}
            <span className="font-mono text-[10px] text-muted-foreground ml-1">
              {Number(rule.cooldownMinutes)} min cooldown
            </span>
            {rule.escalationMinutes ? (
              <span className="font-mono text-[10px] text-muted-foreground">
                · escalates after {Number(rule.escalationMinutes)} min
                {rule.escalationRecipient
                  ? ` to ${rule.escalationRecipient}`
                  : ""}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Switch
            data-ocid={`alert_rules.toggle.${index}`}
            checked={rule.enabled}
            disabled={saveRule.isPending}
            onCheckedChange={handleToggle}
            aria-label={rule.enabled ? "Disable rule" : "Enable rule"}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid={`alert_rules.edit_button.${index}`}
            onClick={() => onEdit(rule)}
            className="h-7 gap-1.5 text-xs"
          >
            <Pencil size={11} />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid={`alert_rules.delete_button.${index}`}
            onClick={handleDelete}
            disabled={deleteRule.isPending}
            className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10"
          >
            <Trash2 size={11} />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AlertRulesPage() {
  // Derive the customer key from the alerts this caller can see, exactly as
  // the notification settings screen does. Every normalized alert carries the
  // accountId (or "default") in `customer`, and the router looks rules up by
  // that exact value, so the rules screen must load and save under the same
  // key. With no alerts yet we fall back to the literal "default".
  const { data: alerts, isLoading: isLoadingAlerts } = useNormalizedAlerts({
    customer: "",
    limit: 1,
  });
  const customerKey = alerts?.[0]?.customer ?? DEFAULT_CUSTOMER;

  const { data: rules = [], isLoading } = useAlertRules(customerKey);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AlertRule | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(rule: AlertRule) {
    setEditing(rule);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  const enabledCount = rules.filter((r) => r.enabled).length;

  return (
    <Layout>
      <div data-ocid="alert_rules.page" className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={20} className="text-primary" />
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                Alert Rules
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Define which findings raise alerts and how they are routed.
              </p>
            </div>
          </div>
          {!formOpen && (
            <Button
              type="button"
              data-ocid="alert_rules.create_button"
              onClick={openCreate}
              className="gap-2 bg-primary hover:bg-primary/90 shrink-0"
            >
              <Plus size={15} />
              New Rule
            </Button>
          )}
        </div>

        {/* Summary strip */}
        {!isLoading && rules.length > 0 && (
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-foreground">
                {rules.length}
              </span>
              <span className="text-xs text-muted-foreground">
                rule{rules.length !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-primary">
                {enabledCount}
              </span>
              <span className="text-xs text-muted-foreground">active</span>
            </div>
          </div>
        )}

        {/* Form */}
        {formOpen && (
          <RuleForm
            editing={editing}
            customer={customerKey}
            onClose={closeForm}
          />
        )}

        {/* Rules list */}
        {isLoading || isLoadingAlerts ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => `rule-skeleton-${i}`).map(
              (id) => (
                <Skeleton key={id} className="h-28 w-full rounded-lg" />
              ),
            )}
          </div>
        ) : rules.length === 0 ? (
          <div
            data-ocid="alert_rules.empty_state"
            className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card py-16 text-center"
          >
            <SlidersHorizontal size={32} className="text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">
              No alert rules yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Create a rule to decide which findings raise alerts and which
              channels notify your team.
            </p>
            <Button
              type="button"
              data-ocid="alert_rules.empty_create_button"
              onClick={openCreate}
              className="gap-2 mt-1 bg-primary hover:bg-primary/90"
            >
              <Plus size={15} />
              Create your first rule
            </Button>
          </div>
        ) : (
          <div data-ocid="alert_rules.list" className="space-y-3">
            {rules.map((rule, idx) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                index={idx + 1}
                onEdit={openEdit}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
