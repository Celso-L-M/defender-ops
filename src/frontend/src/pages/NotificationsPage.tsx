import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCheck,
  Circle,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import {
  useAcknowledgeNotification,
  useAlertRules,
  useDeleteAlertRule,
  useNotificationLogs,
  useSaveAlertRule,
} from "../hooks/use-backend";
import type {
  AlertRule,
  NotificationChannel,
  NotificationStatus,
  ProviderType,
  RuleSeverityThreshold,
} from "../types";

const CUSTOMER = "default";

const SEVERITY_OPTIONS: { label: string; value: RuleSeverityThreshold }[] = [
  { label: "Any Critical", value: "AnyCritical" },
  { label: "Any High+", value: "AnyHigh" },
  { label: "Any Medium+", value: "AnyMedium" },
  { label: "Any Low", value: "AnyLow" },
  { label: "Critical or High", value: "CriticalOrHigh" },
  { label: "All Findings", value: "All" },
];

const CHANNEL_OPTIONS: { label: string; value: NotificationChannel }[] = [
  { label: "In-App", value: "InApp" },
  { label: "Email", value: "Email" },
  { label: "Teams Webhook", value: "TeamsWebhook" },
];

const CHANNEL_COLORS: Record<NotificationChannel, string> = {
  InApp: "bg-primary/20 text-primary border border-primary/40",
  Email: "bg-chart-2/20 text-chart-2 border border-chart-2/40",
  TeamsWebhook: "bg-accent/20 text-accent-foreground border border-accent/40",
};

const STATUS_COLORS: Record<NotificationStatus, string> = {
  Sent: "bg-muted/30 text-muted-foreground border border-border",
  Failed: "bg-destructive/20 text-destructive border border-destructive/40",
  Acknowledged: "bg-chart-2/20 text-chart-2 border border-chart-2/40",
};

function relativeTime(ts: bigint): string {
  try {
    return formatDistanceToNow(new Date(Number(ts / 1_000_000n)), {
      addSuffix: true,
    });
  } catch {
    return "Unknown";
  }
}

function ChannelBadge({ channel }: { channel: NotificationChannel }) {
  const label = channel === "TeamsWebhook" ? "Teams" : channel;
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${CHANNEL_COLORS[channel]}`}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: NotificationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
}

interface RuleFormState {
  name: string;
  enabled: boolean;
  severityThreshold: RuleSeverityThreshold | "";
  findingType: string;
  assetId: string;
  provider: ProviderType | "";
  region: string;
  channels: NotificationChannel[];
  cooldownMinutes: number;
  escalationMinutes: number | "";
  escalationRecipient: string;
}

const defaultForm: RuleFormState = {
  name: "",
  enabled: true,
  severityThreshold: "AnyCritical",
  findingType: "",
  assetId: "",
  provider: "",
  region: "",
  channels: ["InApp"],
  cooldownMinutes: 60,
  escalationMinutes: "",
  escalationRecipient: "",
};

function AlertRulesTab() {
  const { data: rules = [], isLoading } = useAlertRules(CUSTOMER);
  const saveRule = useSaveAlertRule();
  const deleteRule = useDeleteAlertRule();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<RuleFormState>(defaultForm);

  function openCreate() {
    setEditId(null);
    setForm(defaultForm);
    setShowForm(true);
  }

  function openEdit(rule: AlertRule) {
    setEditId(rule.id);
    setForm({
      name: rule.name,
      enabled: rule.enabled,
      severityThreshold: rule.severityThreshold ?? "",
      findingType: rule.findingType ?? "",
      assetId: rule.assetId ?? "",
      provider: rule.provider ?? "",
      region: rule.region ?? "",
      channels: rule.channels as NotificationChannel[],
      cooldownMinutes: Number(rule.cooldownMinutes),
      escalationMinutes: rule.escalationMinutes
        ? Number(rule.escalationMinutes)
        : "",
      escalationRecipient: rule.escalationRecipient ?? "",
    });
    setShowForm(true);
  }

  function cancel() {
    setShowForm(false);
    setEditId(null);
    setForm(defaultForm);
  }

  function toggleChannel(ch: NotificationChannel) {
    setForm((f) => ({
      ...f,
      channels: f.channels.includes(ch)
        ? f.channels.filter((c) => c !== ch)
        : [...f.channels, ch],
    }));
  }

  function handleSave() {
    if (!form.name.trim() || form.channels.length === 0) return;
    const rule: AlertRule = {
      id: editId ?? `rule-${Date.now()}`,
      name: form.name.trim(),
      customer: CUSTOMER,
      enabled: form.enabled,
      severityThreshold: form.severityThreshold || undefined,
      findingType: form.findingType.trim() || undefined,
      assetId: form.assetId.trim() || undefined,
      provider: (form.provider as ProviderType) || undefined,
      region: form.region.trim() || undefined,
      channels: form.channels,
      cooldownMinutes: BigInt(form.cooldownMinutes),
      escalationMinutes:
        form.escalationMinutes !== ""
          ? BigInt(form.escalationMinutes)
          : undefined,
      escalationRecipient: form.escalationRecipient.trim() || undefined,
    };
    saveRule.mutate(rule, { onSuccess: () => cancel() });
  }

  function handleToggleEnabled(rule: AlertRule) {
    saveRule.mutate({ ...rule, enabled: !rule.enabled });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {rules.length} rule{rules.length !== 1 ? "s" : ""} configured
        </p>
        {!showForm && (
          <Button
            type="button"
            size="sm"
            onClick={openCreate}
            data-ocid="notifications.create_rule_button"
            className="gap-1.5"
          >
            <Plus size={14} />
            Create Rule
          </Button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <div
          data-ocid="notifications.rule_form"
          className="rounded-lg border border-border bg-card p-4 space-y-4"
        >
          <h3 className="font-display font-semibold text-sm text-foreground">
            {editId ? "Edit Rule" : "New Alert Rule"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Rule Name *
              </Label>
              <Input
                data-ocid="notifications.rule_name_input"
                placeholder="e.g. Critical AWS Alerts"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="bg-background h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch
                data-ocid="notifications.rule_enabled_switch"
                checked={form.enabled}
                onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))}
              />
              <span className="text-sm text-muted-foreground">Enabled</span>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Severity Threshold
              </Label>
              <Select
                value={form.severityThreshold}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    severityThreshold: v as RuleSeverityThreshold,
                  }))
                }
              >
                <SelectTrigger
                  data-ocid="notifications.severity_threshold_select"
                  className="bg-background h-8 text-sm"
                >
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Provider (optional)
              </Label>
              <Select
                value={form.provider}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, provider: v as ProviderType | "" }))
                }
              >
                <SelectTrigger
                  data-ocid="notifications.provider_select"
                  className="bg-background h-8 text-sm"
                >
                  <SelectValue placeholder="Any provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="AWS">AWS</SelectItem>
                  <SelectItem value="Azure">Azure</SelectItem>
                  <SelectItem value="GCP">GCP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Finding Type (optional)
              </Label>
              <Input
                data-ocid="notifications.finding_type_input"
                placeholder="e.g. UnauthorizedAccess"
                value={form.findingType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, findingType: e.target.value }))
                }
                className="bg-background h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Asset ID (optional)
              </Label>
              <Input
                data-ocid="notifications.asset_id_input"
                placeholder="e.g. i-0abc123"
                value={form.assetId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assetId: e.target.value }))
                }
                className="bg-background h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Region (optional)
              </Label>
              <Input
                data-ocid="notifications.region_input"
                placeholder="e.g. us-east-1"
                value={form.region}
                onChange={(e) =>
                  setForm((f) => ({ ...f, region: e.target.value }))
                }
                className="bg-background h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Cooldown (minutes)
              </Label>
              <Input
                data-ocid="notifications.cooldown_input"
                type="number"
                min={1}
                value={form.cooldownMinutes}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    cooldownMinutes: Math.max(1, Number(e.target.value)),
                  }))
                }
                className="bg-background h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Escalate after (minutes, optional)
              </Label>
              <Input
                data-ocid="notifications.escalation_minutes_input"
                type="number"
                min={1}
                placeholder="No escalation"
                value={form.escalationMinutes}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    escalationMinutes:
                      e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
                className="bg-background h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Escalation Recipient (optional)
              </Label>
              <Input
                data-ocid="notifications.escalation_recipient_input"
                placeholder="email or username"
                value={form.escalationRecipient}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    escalationRecipient: e.target.value,
                  }))
                }
                className="bg-background h-8 text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Notification Channels *
            </Label>
            <div className="flex flex-wrap gap-4">
              {CHANNEL_OPTIONS.map((ch) => (
                <label
                  key={ch.value}
                  htmlFor={`channel-${ch.value}`}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <Checkbox
                    id={`channel-${ch.value}`}
                    data-ocid={`notifications.channel_${ch.value.toLowerCase()}_checkbox`}
                    checked={form.channels.includes(ch.value)}
                    onCheckedChange={() => toggleChannel(ch.value)}
                  />
                  <span className="text-sm text-foreground">{ch.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={
                saveRule.isPending ||
                !form.name.trim() ||
                form.channels.length === 0
              }
              data-ocid="notifications.save_rule_button"
            >
              {saveRule.isPending ? "Saving…" : "Save Rule"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancel}
              data-ocid="notifications.cancel_rule_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Rules list */}
      {isLoading ? (
        <div
          data-ocid="notifications.rules_loading_state"
          className="space-y-2"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={`sk-${i}`}
              className="h-20 rounded-lg bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : rules.length === 0 && !showForm ? (
        <div
          data-ocid="notifications.rules_empty_state"
          className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center"
        >
          <BellOff size={32} className="text-muted-foreground/40" />
          <p className="font-display font-semibold text-foreground">
            No alert rules yet
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Create a rule to start routing notifications to your team.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={openCreate}
            className="mt-1 gap-1.5"
          >
            <Plus size={14} /> Create Rule
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              data-ocid={`notifications.rule.item.${idx + 1}`}
              className="rounded-lg border border-border bg-card p-4 space-y-2 hover:border-border/80 transition-smooth"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Switch
                    data-ocid={`notifications.rule.toggle.${idx + 1}`}
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleEnabled(rule)}
                    aria-label={`Toggle rule ${rule.name}`}
                  />
                  <p className="font-display font-semibold text-sm text-foreground truncate">
                    {rule.name}
                  </p>
                  {!rule.enabled && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Disabled
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openEdit(rule)}
                    data-ocid={`notifications.rule.edit_button.${idx + 1}`}
                    aria-label="Edit rule"
                  >
                    <Shield size={13} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => deleteRule.mutate(rule.id)}
                    data-ocid={`notifications.rule.delete_button.${idx + 1}`}
                    aria-label="Delete rule"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {rule.severityThreshold && (
                  <span>
                    Severity:{" "}
                    <span className="text-foreground">
                      {rule.severityThreshold}
                    </span>
                  </span>
                )}
                {rule.provider && (
                  <span>
                    Provider:{" "}
                    <span className="text-foreground">{rule.provider}</span>
                  </span>
                )}
                {rule.findingType && (
                  <span>
                    Type:{" "}
                    <span className="text-foreground">{rule.findingType}</span>
                  </span>
                )}
                {rule.assetId && (
                  <span>
                    Asset:{" "}
                    <span className="font-mono text-foreground">
                      {rule.assetId}
                    </span>
                  </span>
                )}
                {rule.region && (
                  <span>
                    Region:{" "}
                    <span className="text-foreground">{rule.region}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(rule.channels as NotificationChannel[]).map((ch) => (
                  <ChannelBadge key={ch} channel={ch} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  · {Number(rule.cooldownMinutes)} min cooldown
                </span>
                <span className="text-xs text-muted-foreground">
                  ·{" "}
                  {rule.escalationMinutes
                    ? `Escalate after ${Number(rule.escalationMinutes)} min${rule.escalationRecipient ? ` to ${rule.escalationRecipient}` : ""}`
                    : "No escalation"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationCenterTab() {
  const { data: logs = [], isLoading } = useNotificationLogs(CUSTOMER, 200);
  const ackMutation = useAcknowledgeNotification();

  const inAppLogs = logs.filter((l) => l.channel === "InApp");
  const unreadLogs = inAppLogs.filter((l) => !l.acknowledged);

  function markAllRead() {
    for (const log of unreadLogs) {
      ackMutation.mutate(log.id);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadLogs.length} unread
        </p>
        {unreadLogs.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={ackMutation.isPending}
            data-ocid="notifications.mark_all_read_button"
            className="gap-1.5 text-xs"
          >
            <CheckCheck size={13} /> Mark All Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div
          data-ocid="notifications.inbox_loading_state"
          className="space-y-2"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`sk-${i}`}
              className="h-16 rounded-lg bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : inAppLogs.length === 0 ? (
        <div
          data-ocid="notifications.inbox_empty_state"
          className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center"
        >
          <Bell size={32} className="text-muted-foreground/40" />
          <p className="font-display font-semibold text-foreground">
            No notifications
          </p>
          <p className="text-sm text-muted-foreground">You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {inAppLogs.map((log, idx) => (
            <div
              key={log.id}
              data-ocid={`notifications.inbox.item.${idx + 1}`}
              className={`rounded-lg border p-3.5 flex items-start gap-3 transition-smooth ${
                !log.acknowledged
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="mt-1 shrink-0">
                {!log.acknowledged ? (
                  <Circle size={8} className="fill-primary text-primary" />
                ) : (
                  <Circle size={8} className="text-border" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="/alerts"
                    className="text-sm font-medium text-foreground hover:text-primary transition-smooth truncate"
                  >
                    Alert #{log.alertId.slice(0, 8)}
                  </a>
                  <ChannelBadge channel={log.channel as NotificationChannel} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Rule:{" "}
                  <span className="font-mono">{log.ruleId.slice(0, 12)}</span>
                  <span className="mx-1.5">·</span>
                  {relativeTime(log.timestamp)}
                </p>
              </div>
              {!log.acknowledged && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-xs h-7"
                  onClick={() => ackMutation.mutate(log.id)}
                  disabled={ackMutation.isPending}
                  data-ocid={`notifications.inbox.mark_read_button.${idx + 1}`}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationLogTab() {
  const [limit, setLimit] = useState(50);
  const { data: logs = [], isLoading } = useNotificationLogs(CUSTOMER, limit);

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div data-ocid="notifications.log_loading_state" className="space-y-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={`sk-${i}`}
              className="h-10 rounded bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div
          data-ocid="notifications.log_empty_state"
          className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-14 text-center"
        >
          <AlertTriangle size={32} className="text-muted-foreground/40" />
          <p className="font-display font-semibold text-foreground">
            No notification history
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/20">
                  <TableHead className="text-xs text-muted-foreground w-32">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground w-32">
                    Alert ID
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground w-32">
                    Rule
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground w-24">
                    Channel
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground">
                    Recipient
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground w-28">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, idx) => (
                  <TableRow
                    key={log.id}
                    data-ocid={`notifications.log.item.${idx + 1}`}
                    className="border-border hover:bg-muted/10 transition-smooth"
                  >
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {relativeTime(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <a
                        href="/alerts"
                        className="text-xs font-mono text-primary hover:underline"
                      >
                        {log.alertId.slice(0, 10)}…
                      </a>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {log.ruleId.slice(0, 10)}…
                    </TableCell>
                    <TableCell>
                      <ChannelBadge
                        channel={log.channel as NotificationChannel}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-foreground max-w-[160px] truncate">
                      {log.recipient}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={log.status as NotificationStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {logs.length === limit && (
            <div className="flex justify-center pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLimit((l) => l + 50)}
                data-ocid="notifications.log_load_more_button"
                className="text-xs"
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const { data: logs = [] } = useNotificationLogs(CUSTOMER, 200);
  const unreadCount = logs.filter(
    (l) => l.channel === "InApp" && !l.acknowledged,
  ).length;

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
            <Bell size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              Alerting & Notifications
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Alert rules · Notification routing
            </p>
          </div>
        </div>

        <Tabs defaultValue="rules" className="space-y-4">
          <TabsList className="bg-muted/30 border border-border">
            <TabsTrigger
              value="rules"
              data-ocid="notifications.rules_tab"
              className="text-xs data-[state=active]:bg-card"
            >
              Alert Rules
            </TabsTrigger>
            <TabsTrigger
              value="center"
              data-ocid="notifications.center_tab"
              className="text-xs data-[state=active]:bg-card"
            >
              Notification Center
              {unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="log"
              data-ocid="notifications.log_tab"
              className="text-xs data-[state=active]:bg-card"
            >
              Notification Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules">
            <AlertRulesTab />
          </TabsContent>
          <TabsContent value="center">
            <NotificationCenterTab />
          </TabsContent>
          <TabsContent value="log">
            <NotificationLogTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
