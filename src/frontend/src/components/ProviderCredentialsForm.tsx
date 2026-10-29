import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Loader2,
  PlugZap,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useClearProviderCredential,
  useProviderCredentialStatus,
  useSaveProviderCredential,
  useTestProviderConnection,
  useUpdateProviderCredential,
} from "../hooks/use-backend";
import type {
  CredentialError,
  ProviderCredentialInput,
  ProviderType,
} from "../types";

// ── Field schema per provider ───────────────────────────────────────────────
// Fixed typed credential schema. `secret` fields are masked in status views and
// never rendered back as plaintext.

interface FieldSpec {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  secret?: boolean;
  multiline?: boolean;
  /** Comma-separated list field (regions, subscription IDs, project IDs). */
  list?: boolean;
}

const FIELD_SCHEMA: Record<ProviderType, FieldSpec[]> = {
  AWS: [
    {
      key: "roleArn",
      label: "Role ARN",
      placeholder: "arn:aws:iam::123456789012:role/SecurityAudit",
      required: true,
    },
    {
      key: "externalId",
      label: "External ID",
      placeholder: "optional external ID",
      required: false,
    },
    {
      key: "regions",
      label: "Regions",
      placeholder: "us-east-1, eu-west-1",
      required: true,
      list: true,
    },
  ],
  Azure: [
    {
      key: "clientId",
      label: "Client ID",
      placeholder: "00000000-0000-0000-0000-000000000000",
      required: true,
    },
    {
      key: "clientSecret",
      label: "Client Secret",
      placeholder: "Enter the client secret",
      required: true,
      secret: true,
    },
    {
      key: "tenantId",
      label: "Tenant ID",
      placeholder: "00000000-0000-0000-0000-000000000000",
      required: true,
    },
    {
      key: "subscriptionIds",
      label: "Subscription IDs",
      placeholder: "sub-abc, sub-def",
      required: true,
      list: true,
    },
  ],
  GCP: [
    {
      key: "serviceAccountJson",
      label: "Service Account JSON",
      placeholder: '{ "type": "service_account", "project_id": "…" }',
      required: true,
      secret: true,
      multiline: true,
    },
    {
      key: "projectIds",
      label: "Project IDs",
      placeholder: "my-project-1, my-project-2",
      required: true,
      list: true,
    },
  ],
};

type Draft = Record<string, string>;

function emptyDraft(provider: ProviderType): Draft {
  const draft: Draft = {};
  for (const field of FIELD_SCHEMA[provider]) draft[field.key] = "";
  return draft;
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function buildInput(
  provider: ProviderType,
  draft: Draft,
): ProviderCredentialInput {
  if (provider === "AWS") {
    const externalId = draft.externalId.trim();
    return {
      __kind__: "AWS",
      AWS: {
        roleArn: draft.roleArn.trim(),
        ...(externalId ? { externalId } : {}),
        regions: splitList(draft.regions),
      },
    };
  }
  if (provider === "Azure") {
    return {
      __kind__: "Azure",
      Azure: {
        clientId: draft.clientId.trim(),
        clientSecret: draft.clientSecret.trim(),
        tenantId: draft.tenantId.trim(),
        subscriptionIds: splitList(draft.subscriptionIds),
      },
    };
  }
  return {
    __kind__: "GCP",
    GCP: {
      serviceAccountJson: draft.serviceAccountJson.trim(),
      projectIds: splitList(draft.projectIds),
    },
  };
}

/** Returns the first invalid field's message, or null when the draft is valid. */
function validate(provider: ProviderType, draft: Draft): string | null {
  for (const field of FIELD_SCHEMA[provider]) {
    const raw = draft[field.key] ?? "";
    if (field.required && raw.trim().length === 0) {
      return `${field.label} is required`;
    }
    if (field.list && raw.trim().length > 0 && splitList(raw).length === 0) {
      return `${field.label} must contain at least one value`;
    }
  }
  if (provider === "GCP" && draft.serviceAccountJson.trim().length > 0) {
    try {
      JSON.parse(draft.serviceAccountJson);
    } catch {
      return "Service Account JSON is not valid JSON";
    }
  }
  return null;
}

function credentialErrorMessage(err: CredentialError): string {
  switch (err.__kind__) {
    case "NotAuthorized":
      return "You do not have access to this provider's credentials";
    case "NotFound":
      return "No credential is configured for this provider";
    case "InvalidCredential":
      return err.InvalidCredential;
    case "VaultError":
      return err.VaultError;
    default:
      return "The credential could not be saved";
  }
}

function formatUpdatedAt(ts: bigint | undefined): string {
  if (ts === undefined) return "—";
  const date = new Date(Number(ts / 1_000_000n));
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Component ───────────────────────────────────────────────────────────────

export function ProviderCredentialsForm({
  provider,
}: {
  provider: ProviderType;
}) {
  const { data: status, isLoading } = useProviderCredentialStatus(provider);
  const save = useSaveProviderCredential();
  const update = useUpdateProviderCredential();
  const clear = useClearProviderCredential();
  const test = useTestProviderConnection(provider);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(provider));
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const configured = status?.configured ?? false;
  const pending = save.isPending || update.isPending || clear.isPending;

  const setField = (key: string, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setFieldError(null);
  };

  const startEditing = () => {
    setDraft(emptyDraft(provider));
    setFieldError(null);
    setFormMessage(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setFieldError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validate(provider, draft);
    if (invalid) {
      setFieldError(invalid);
      setFormMessage({ kind: "error", text: invalid });
      return;
    }
    const input = buildInput(provider, draft);
    try {
      const result = configured
        ? await update.mutateAsync(input)
        : await save.mutateAsync(input);
      if (result.__kind__ === "err") {
        const message = credentialErrorMessage(result.err);
        setFormMessage({ kind: "error", text: message });
        toast.error(message);
        return;
      }
      setFormMessage({
        kind: "success",
        text: configured
          ? `${provider} credential updated`
          : `${provider} credential saved`,
      });
      toast.success(
        configured
          ? `${provider} credential updated`
          : `${provider} credential saved`,
      );
      setEditing(false);
      setDraft(emptyDraft(provider));
    } catch {
      const message = "The credential could not be saved";
      setFormMessage({ kind: "error", text: message });
      toast.error(message);
    }
  };

  const handleClear = async () => {
    try {
      const result = await clear.mutateAsync(provider);
      if (result.__kind__ === "err") {
        const message = credentialErrorMessage(result.err);
        setFormMessage({ kind: "error", text: message });
        toast.error(message);
        return;
      }
      setFormMessage({
        kind: "success",
        text: `${provider} credential cleared`,
      });
      toast.success(`${provider} credential cleared`);
      setEditing(false);
      setDraft(emptyDraft(provider));
    } catch {
      const message = "The credential could not be cleared";
      setFormMessage({ kind: "error", text: message });
      toast.error(message);
    }
  };

  const handleTest = () => {
    test.mutate(undefined, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success(`${provider} connection succeeded`, {
            description: result.message,
          });
        } else {
          toast.error(`${provider} connection failed`, {
            description: result.message,
          });
        }
      },
      onError: () => {
        toast.error(`${provider} connection test failed`, {
          description: "The connection could not be tested.",
        });
      },
    });
  };

  return (
    <div
      data-ocid={`provider_credentials.${provider.toLowerCase()}.section`}
      className="vault-shell"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <KeyRound size={16} className="vault-accent" />
          <h2 className="font-display text-base font-bold text-foreground">
            {provider} Credentials
          </h2>
          {isLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : configured ? (
            <span
              data-ocid={`provider_credentials.${provider.toLowerCase()}.configured_badge`}
              className="badge-vault"
            >
              Configured
            </span>
          ) : (
            <span
              data-ocid={`provider_credentials.${provider.toLowerCase()}.unconfigured_badge`}
              className="badge-vault"
            >
              Not configured
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid={`provider_credentials.${provider.toLowerCase()}.test_button`}
            onClick={handleTest}
            disabled={test.isPending}
          >
            {test.isPending ? (
              <Loader2 size={13} className="mr-1.5 animate-spin" />
            ) : (
              <PlugZap size={13} className="mr-1.5" />
            )}
            Test Connection
          </Button>
          {!editing && (
            <Button
              type="button"
              size="sm"
              data-ocid={`provider_credentials.${provider.toLowerCase()}.edit_button`}
              onClick={startEditing}
            >
              <KeyRound size={13} className="mr-1.5" />
              {configured ? "Edit" : "Configure"}
            </Button>
          )}
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Configured field summary — masked values only */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }, (_, i) => `cred-skeleton-${i}`).map(
              (id) => (
                <Skeleton key={id} className="h-5 w-full" />
              ),
            )}
          </div>
        ) : configured && status ? (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {status.fields.map((field) => (
              <div
                key={field.name}
                data-ocid={`provider_credentials.${provider.toLowerCase()}.field.${field.name}`}
                className="flex items-center justify-between gap-3 border-b border-border/30 py-1.5"
              >
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {field.name}
                </dt>
                <dd className="min-w-0 text-right">
                  {field.isSet ? (
                    <span className="secret-masked text-xs">
                      {field.maskedValue || "••••••••••••"}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Not set
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p
            data-ocid={`provider_credentials.${provider.toLowerCase()}.empty_state`}
            className="text-xs text-muted-foreground"
          >
            No {provider} credential is configured. Configure the typed fields
            below to enable ingestion and connection tests for this provider.
          </p>
        )}

        {configured && status?.updatedAt !== undefined && (
          <p className="font-mono text-[11px] text-muted-foreground">
            Last updated {formatUpdatedAt(status.updatedAt)}
          </p>
        )}

        {/* Form message */}
        {formMessage && (
          <div
            data-ocid={`provider_credentials.${provider.toLowerCase()}.${formMessage.kind === "success" ? "success_state" : "error_state"}`}
            className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${
              formMessage.kind === "success"
                ? "border-success/40 bg-success/10 text-success"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {formMessage.kind === "success" ? (
              <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            )}
            <span>{formMessage.text}</span>
          </div>
        )}

        {/* Typed credential form */}
        {editing && (
          <form
            onSubmit={handleSubmit}
            data-ocid={`provider_credentials.${provider.toLowerCase()}.form`}
            className="space-y-4"
          >
            {FIELD_SCHEMA[provider].map((field) => {
              const inputId = `cred-${provider}-${field.key}`;
              const value = draft[field.key] ?? "";
              return (
                <div key={field.key} className="space-y-1.5">
                  <Label
                    htmlFor={inputId}
                    className="text-xs text-muted-foreground uppercase tracking-wider"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                  {field.multiline ? (
                    <Textarea
                      id={inputId}
                      data-ocid={`provider_credentials.${provider.toLowerCase()}.${field.key}_input`}
                      className="font-mono text-xs min-h-24"
                      placeholder={field.placeholder}
                      value={value}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      id={inputId}
                      data-ocid={`provider_credentials.${provider.toLowerCase()}.${field.key}_input`}
                      className="font-mono"
                      type={field.secret ? "password" : "text"}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  )}
                  {field.list && (
                    <p className="text-[11px] text-muted-foreground">
                      Comma-separated values.
                    </p>
                  )}
                </div>
              );
            })}

            {fieldError && (
              <p
                data-ocid={`provider_credentials.${provider.toLowerCase()}.field_error`}
                className="text-xs text-destructive"
              >
                {fieldError}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                data-ocid={`provider_credentials.${provider.toLowerCase()}.save_button`}
                disabled={pending}
              >
                {pending ? (
                  <Loader2 size={13} className="mr-1.5 animate-spin" />
                ) : (
                  <Save size={13} className="mr-1.5" />
                )}
                {configured ? "Save Changes" : "Save Credential"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid={`provider_credentials.${provider.toLowerCase()}.cancel_button`}
                onClick={cancelEditing}
                disabled={pending}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Clear action */}
        {configured && !editing && (
          <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-3">
            <p className="text-[11px] text-muted-foreground">
              Clearing removes the stored credential for {provider}. This is
              recorded in the audit log.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid={`provider_credentials.${provider.toLowerCase()}.clear_button`}
              onClick={handleClear}
              disabled={pending}
              className="text-destructive hover:bg-destructive/10 shrink-0"
            >
              {clear.isPending ? (
                <Loader2 size={13} className="mr-1.5 animate-spin" />
              ) : (
                <Trash2 size={13} className="mr-1.5" />
              )}
              Clear
            </Button>
          </div>
        )}

        {/* Connection test result */}
        {test.data && (
          <div
            data-ocid={`provider_credentials.${provider.toLowerCase()}.test_result`}
            className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${
              test.data.success
                ? "border-success/40 bg-success/10 text-success"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {test.data.success ? (
              <ShieldCheck size={13} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            )}
            <span>{test.data.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
