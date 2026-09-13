import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Eye, EyeOff, Loader2, ShieldOff } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useGetEnrichmentKeys,
  useGetWebhookSecretStatus,
  useSaveEnrichmentKeys,
  useSaveWebhookSecret,
} from "../hooks/use-backend";
import type { ProviderType } from "../types";

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

// ── Webhook Signature Secrets Section ────────────────────────────────────

const WEBHOOK_PROVIDERS: { provider: ProviderType; label: string }[] = [
  { provider: "AWS", label: "AWS" },
  { provider: "Azure", label: "Azure" },
  { provider: "GCP", label: "GCP" },
];

function WebhookSecretSection() {
  const { data: status, isLoading: statusLoading } =
    useGetWebhookSecretStatus();
  const saveSecret = useSaveWebhookSecret();
  const [secrets, setSecrets] = useState<Record<ProviderType, string>>({
    AWS: "",
    Azure: "",
    GCP: "",
  });

  const isConfigured = (p: ProviderType) =>
    p === "AWS"
      ? status?.awsSet
      : p === "Azure"
        ? status?.azureSet
        : status?.gcpSet;

  const handleSave = async (provider: ProviderType) => {
    const secret = secrets[provider].trim();
    if (!secret) return;
    try {
      await saveSecret.mutateAsync({ provider, secret });
      toast.success(`${provider} webhook secret saved`);
      setSecrets((prev) => ({ ...prev, [provider]: "" }));
    } catch {
      toast.error(`Failed to save ${provider} webhook secret`);
    }
  };

  return (
    <section
      data-ocid="settings.webhook_secrets.section"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-display text-sm font-semibold text-foreground">
          Webhook Signature Secrets
        </h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Per-provider secrets used to verify incoming webhook signatures.
          Secrets are stored securely and never returned to the frontend.
        </p>
      </div>

      <div className="px-5 pb-6 pt-4 space-y-5">
        {WEBHOOK_PROVIDERS.map(({ provider, label }) => (
          <div key={provider} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={`webhook-secret-${provider.toLowerCase()}`}
                className="text-xs text-muted-foreground uppercase tracking-wider"
              >
                {label} Webhook Secret
              </Label>
              {statusLoading ? (
                <Loader2
                  size={11}
                  className="animate-spin text-muted-foreground"
                />
              ) : isConfigured(provider) ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 size={11} />
                  Secret configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                  <ShieldOff size={11} />
                  Not configured
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <PasswordInput
                  id={`webhook-secret-${provider.toLowerCase()}`}
                  placeholder={`Enter ${label} webhook secret`}
                  value={secrets[provider]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSecrets((prev) => ({
                      ...prev,
                      [provider]: e.target.value,
                    }))
                  }
                  data-ocid={`settings.webhook_secrets.${provider.toLowerCase()}_input`}
                />
              </div>
              <Button
                type="button"
                size="sm"
                data-ocid={`settings.webhook_secrets.${provider.toLowerCase()}_save_button`}
                disabled={saveSecret.isPending || !secrets[provider].trim()}
                onClick={() => handleSave(provider)}
                className="min-w-[120px]"
              >
                {saveSecret.isPending && (
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                )}
                Save Secret
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CloudSettingsPage() {
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
              Threat intelligence and webhook security configuration
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <ThreatIntelSection />
          <WebhookSecretSection />
        </div>
      </div>
    </Layout>
  );
}
