import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Clock,
  Mail,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
  Webhook,
} from "lucide-react";
import React from "react";
import { Layout } from "../components/Layout";
import {
  useNormalizedAlerts,
  useNotificationRouting,
  useSaveNotificationRouting,
} from "../hooks/use-backend";
import type { NotificationRouting } from "../types";

// The backend keys notification routing by the same `customer` value every
// normalized alert carries: the provider accountId, or the literal "default"
// when the account has none (see AlertNormalization). Saving under any other
// key — an empty string included — means the router's lookup by
// `alert.customer` never finds the routing and nothing is delivered.
const DEFAULT_CUSTOMER = "default";
const DEFAULT_COOLDOWN_MINUTES = 60;

// ── Validation ─────────────────────────────────────────────────────────────
// Mirrors the backend TeamsWebhook.validateUrl rules so the form rejects the
// same inputs the canister would, with a clear message before the round trip.

function validateWebhookUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null; // optional field
  if (trimmed.length > 2048) return "Webhook URL exceeds maximum length";
  if (!trimmed.startsWith("https://")) return "Webhook URL must use https";
  if (/\s/.test(trimmed)) return "Webhook URL must not contain whitespace";
  return null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "Email address is required";
  if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address";
  return null;
}

function parseMinutes(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) return null;
  return n;
}

// ── Saved-state summary ────────────────────────────────────────────────────

function SavedSummary({ routing }: { routing: NotificationRouting | null }) {
  if (!routing) {
    return (
      <div
        data-ocid="notification_settings.saved_state"
        className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3"
      >
        <p className="text-xs text-muted-foreground">
          No routing saved yet. Configure the channels below and save to start
          delivering notifications for this customer.
        </p>
      </div>
    );
  }

  const cooldown = Number(routing.cooldownMinutes);
  const escalation =
    routing.escalationMinutes !== undefined
      ? Number(routing.escalationMinutes)
      : null;

  return (
    <div
      data-ocid="notification_settings.saved_state"
      className="rounded-lg border border-border bg-muted/20 px-4 py-3 space-y-2"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Currently saved
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        <span className="flex items-center gap-1.5 text-foreground">
          <Webhook size={12} className="text-muted-foreground" />
          {routing.teamsWebhookUrl ? (
            <span className="font-mono truncate max-w-[240px]">
              {routing.teamsWebhookUrl}
            </span>
          ) : (
            <span className="text-muted-foreground">No Teams webhook</span>
          )}
        </span>
        <span className="flex items-center gap-1.5 text-foreground">
          <Mail size={12} className="text-muted-foreground" />
          {routing.emailRecipients.length > 0 ? (
            <span className="font-mono">
              {routing.emailRecipients.length} recipient
              {routing.emailRecipients.length === 1 ? "" : "s"}
            </span>
          ) : (
            <span className="text-muted-foreground">No email recipients</span>
          )}
        </span>
        <span className="flex items-center gap-1.5 text-foreground">
          <Clock size={12} className="text-muted-foreground" />
          <span className="font-mono">{cooldown} min cooldown</span>
        </span>
        <span className="flex items-center gap-1.5 text-foreground">
          <ShieldAlert size={12} className="text-muted-foreground" />
          {escalation !== null ? (
            <span className="font-mono">{escalation} min escalation</span>
          ) : (
            <span className="text-muted-foreground">No escalation window</span>
          )}
        </span>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function NotificationSettingsPage() {
  // Derive the customer key from the alerts this caller can see. Every
  // normalized alert carries the accountId (or "default") in `customer`, and
  // the router looks routing up by that exact value, so the settings screen
  // must save under the same key. With no alerts yet we fall back to the
  // literal "default" the backend would assign an account without one.
  const { data: alerts, isLoading: isLoadingAlerts } = useNormalizedAlerts({
    customer: "",
    limit: 1,
  });
  const customerKey = alerts?.[0]?.customer ?? DEFAULT_CUSTOMER;

  const {
    data: routing,
    isLoading,
    isError,
  } = useNotificationRouting(customerKey);
  const { mutateAsync: saveRouting, isPending } = useSaveNotificationRouting();

  const [webhookUrl, setWebhookUrl] = React.useState("");
  const [recipients, setRecipients] = React.useState<string[]>([]);
  const [recipientDraft, setRecipientDraft] = React.useState("");
  const [cooldown, setCooldown] = React.useState(
    String(DEFAULT_COOLDOWN_MINUTES),
  );
  const [escalation, setEscalation] = React.useState("");
  const [initialized, setInitialized] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // One-time initialization of the draft from the saved routing. The draft is
  // never overwritten by a later refetch — only the user's own save resets it.
  // Wait for the alerts query to settle first so the customer key (and the
  // routing it loads) is final before the draft is seeded.
  React.useEffect(() => {
    if (initialized || isLoading || isLoadingAlerts) return;
    if (routing) {
      setWebhookUrl(routing.teamsWebhookUrl ?? "");
      setRecipients(routing.emailRecipients);
      setCooldown(String(Number(routing.cooldownMinutes)));
      setEscalation(
        routing.escalationMinutes !== undefined
          ? String(Number(routing.escalationMinutes))
          : "",
      );
    }
    setInitialized(true);
  }, [initialized, isLoading, isLoadingAlerts, routing]);

  const addRecipient = () => {
    const trimmed = recipientDraft.trim();
    const err = validateEmail(trimmed);
    if (err) {
      setErrors((prev) => ({ ...prev, recipientDraft: err }));
      return;
    }
    if (recipients.includes(trimmed)) {
      setErrors((prev) => ({
        ...prev,
        recipientDraft: "That address is already in the list",
      }));
      return;
    }
    setRecipients((prev) => [...prev, trimmed]);
    setRecipientDraft("");
    setErrors((prev) => {
      const { recipientDraft: _drop, ...rest } = prev;
      return rest;
    });
  };

  const removeRecipient = (address: string) => {
    setRecipients((prev) => prev.filter((r) => r !== address));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    const nextErrors: Record<string, string> = {};
    const webhookErr = validateWebhookUrl(webhookUrl);
    if (webhookErr) nextErrors.webhookUrl = webhookErr;

    const cooldownValue = parseMinutes(cooldown);
    if (cooldownValue === null) {
      nextErrors.cooldown = "Enter a whole number of minutes (0 or greater)";
    }

    const escalationValue = parseMinutes(escalation);
    if (escalation.trim().length > 0 && escalationValue === null) {
      nextErrors.escalation = "Enter a whole number of minutes (0 or greater)";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    const payload: NotificationRouting = {
      customer: customerKey,
      cooldownMinutes: BigInt(cooldownValue ?? DEFAULT_COOLDOWN_MINUTES),
      emailRecipients: recipients,
      ...(webhookUrl.trim().length > 0
        ? { teamsWebhookUrl: webhookUrl.trim() }
        : {}),
      ...(escalationValue !== null
        ? { escalationMinutes: BigInt(escalationValue) }
        : {}),
    };

    try {
      await saveRouting(payload);
      setSavedAt(new Date());
    } catch (err) {
      const kind = err instanceof Error ? err.message : "Unknown";
      const message =
        kind === "InvalidWebhookUrl"
          ? "The Teams webhook URL was rejected. Check that it is a valid https URL."
          : kind === "NotAuthorized"
            ? "You are not authorized to change notification routing."
            : kind === "InvalidRule"
              ? "The routing configuration was rejected as invalid."
              : "Failed to save notification routing. Please try again.";
      setSaveError(message);
    }
  };

  return (
    <Layout>
      <div
        data-ocid="notification_settings.page"
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Page header */}
        <div className="flex items-center gap-3">
          <BellRing size={20} className="text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Notification Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Configure Microsoft Teams and email routing, duplicate
              suppression, and escalation for this customer.
            </p>
          </div>
        </div>

        {isLoading || isLoadingAlerts ? (
          <div
            data-ocid="notification_settings.loading_state"
            className="space-y-4"
          >
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : isError ? (
          <div
            data-ocid="notification_settings.error_state"
            className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3"
          >
            <AlertTriangle size={16} className="text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Could not load notification routing
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Refresh the page to try again.
              </p>
            </div>
          </div>
        ) : (
          <>
            <SavedSummary routing={routing ?? null} />

            {savedAt && (
              <div
                data-ocid="notification_settings.success_state"
                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5"
              >
                <CheckCircle2 size={15} className="text-primary" />
                <p className="text-sm text-foreground">
                  Notification routing saved at{" "}
                  <span className="font-mono">
                    {savedAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  .
                </p>
              </div>
            )}

            {saveError && (
              <div
                data-ocid="notification_settings.save_error"
                className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5"
              >
                <AlertTriangle size={15} className="text-destructive mt-0.5" />
                <p className="text-sm text-foreground">{saveError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Teams webhook */}
              <section
                data-ocid="notification_settings.teams_section"
                className="rounded-xl border border-border bg-card p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Webhook size={15} className="text-primary" />
                  <h2 className="font-display font-semibold text-sm text-foreground">
                    Microsoft Teams Webhook
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Alerts routed to Teams are posted to this incoming webhook
                  URL. Leave blank to disable the Teams channel.
                </p>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="teams-webhook"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Webhook URL
                  </Label>
                  <input
                    id="teams-webhook"
                    type="url"
                    data-ocid="notification_settings.webhook_input"
                    value={webhookUrl}
                    onChange={(e) => {
                      setWebhookUrl(e.target.value);
                      if (errors.webhookUrl) {
                        setErrors((prev) => {
                          const { webhookUrl: _drop, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    placeholder="https://outlook.office.com/webhook/..."
                    aria-invalid={!!errors.webhookUrl}
                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${
                      errors.webhookUrl
                        ? "border-destructive focus:ring-destructive/60"
                        : "border-border focus:ring-primary/60"
                    }`}
                  />
                  {errors.webhookUrl && (
                    <p
                      data-ocid="notification_settings.webhook_error"
                      className="text-xs text-destructive"
                    >
                      {errors.webhookUrl}
                    </p>
                  )}
                </div>
              </section>

              {/* Email recipients */}
              <section
                data-ocid="notification_settings.email_section"
                className="rounded-xl border border-border bg-card p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-primary" />
                  <h2 className="font-display font-semibold text-sm text-foreground">
                    Email Recipients
                  </h2>
                  {recipients.length > 0 && (
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] text-muted-foreground border-border"
                    >
                      {recipients.length}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Each address receives an email for every notification that is
                  not suppressed by the cooldown.
                </p>

                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="recipient-input" className="sr-only">
                      Email address
                    </Label>
                    <input
                      id="recipient-input"
                      type="email"
                      data-ocid="notification_settings.recipient_input"
                      value={recipientDraft}
                      onChange={(e) => {
                        setRecipientDraft(e.target.value);
                        if (errors.recipientDraft) {
                          setErrors((prev) => {
                            const { recipientDraft: _drop, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addRecipient();
                        }
                      }}
                      placeholder="security-team@example.com"
                      aria-invalid={!!errors.recipientDraft}
                      className={`w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${
                        errors.recipientDraft
                          ? "border-destructive focus:ring-destructive/60"
                          : "border-border focus:ring-primary/60"
                      }`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="notification_settings.add_recipient_button"
                    onClick={addRecipient}
                    className="gap-1.5 shrink-0"
                  >
                    <Plus size={14} />
                    Add
                  </Button>
                </div>
                {errors.recipientDraft && (
                  <p
                    data-ocid="notification_settings.recipient_error"
                    className="text-xs text-destructive"
                  >
                    {errors.recipientDraft}
                  </p>
                )}

                {recipients.length === 0 ? (
                  <div
                    data-ocid="notification_settings.recipients_empty_state"
                    className="rounded-md border border-dashed border-border px-4 py-5 text-center"
                  >
                    <p className="text-xs text-muted-foreground">
                      No email recipients yet. Add at least one address to
                      deliver notifications by email.
                    </p>
                  </div>
                ) : (
                  <ul
                    data-ocid="notification_settings.recipients_list"
                    className="space-y-1.5"
                  >
                    {recipients.map((address, idx) => (
                      <li
                        key={address}
                        data-ocid={`notification_settings.recipient_item.${idx + 1}`}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2"
                      >
                        <span className="font-mono text-xs text-foreground truncate">
                          {address}
                        </span>
                        <button
                          type="button"
                          data-ocid={`notification_settings.remove_recipient_button.${idx + 1}`}
                          onClick={() => removeRecipient(address)}
                          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label={`Remove ${address}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Suppression & escalation */}
              <section
                data-ocid="notification_settings.timing_section"
                className="rounded-xl border border-border bg-card p-5 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-primary" />
                  <h2 className="font-display font-semibold text-sm text-foreground">
                    Suppression &amp; Escalation
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="cooldown-input"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Duplicate-suppression cooldown
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="cooldown-input"
                        type="number"
                        min={0}
                        step={1}
                        data-ocid="notification_settings.cooldown_input"
                        value={cooldown}
                        onChange={(e) => {
                          setCooldown(e.target.value);
                          if (errors.cooldown) {
                            setErrors((prev) => {
                              const { cooldown: _drop, ...rest } = prev;
                              return rest;
                            });
                          }
                        }}
                        aria-invalid={!!errors.cooldown}
                        className={`w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 transition-colors ${
                          errors.cooldown
                            ? "border-destructive focus:ring-destructive/60"
                            : "border-border focus:ring-primary/60"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground shrink-0">
                        minutes
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Repeated alerts for the same finding are suppressed within
                      this window. Defaults to 60 minutes.
                    </p>
                    {errors.cooldown && (
                      <p
                        data-ocid="notification_settings.cooldown_error"
                        className="text-xs text-destructive"
                      >
                        {errors.cooldown}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="escalation-input"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Escalation window
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="escalation-input"
                        type="number"
                        min={0}
                        step={1}
                        data-ocid="notification_settings.escalation_input"
                        value={escalation}
                        onChange={(e) => {
                          setEscalation(e.target.value);
                          if (errors.escalation) {
                            setErrors((prev) => {
                              const { escalation: _drop, ...rest } = prev;
                              return rest;
                            });
                          }
                        }}
                        placeholder="e.g. 30"
                        aria-invalid={!!errors.escalation}
                        className={`w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${
                          errors.escalation
                            ? "border-destructive focus:ring-destructive/60"
                            : "border-border focus:ring-primary/60"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground shrink-0">
                        minutes
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      If a notification is not acknowledged within this window,
                      it is escalated. Leave blank to disable escalation.
                    </p>
                    {errors.escalation && (
                      <p
                        data-ocid="notification_settings.escalation_error"
                        className="text-xs text-destructive"
                      >
                        {errors.escalation}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  data-ocid="notification_settings.save_button"
                  disabled={isPending}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  {isPending ? (
                    <>
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save routing
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}
