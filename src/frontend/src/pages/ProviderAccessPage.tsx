import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ShieldCheck, UserX } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useAssignProviderAccess,
  useListUserAssignments,
  useRemoveProviderAccess,
} from "../hooks/use-backend";
import type { ProviderType } from "../types";

const PROVIDERS: { provider: ProviderType; accentClass: string }[] = [
  { provider: "AWS", accentClass: "provider-aws" },
  { provider: "Azure", accentClass: "provider-azure" },
  { provider: "GCP", accentClass: "provider-gcp" },
];

function shortPrincipal(principal: string): string {
  if (principal.length <= 20) return principal;
  return `${principal.slice(0, 10)}…${principal.slice(-8)}`;
}

function ProviderToggle({
  provider,
  accentClass,
  checked,
  disabled,
  onCheckedChange,
}: {
  provider: ProviderType;
  accentClass: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={`${accentClass} flex items-center justify-center gap-2`}
      data-ocid={`provider_access.toggle.${provider.toLowerCase()}`}
    >
      <Checkbox
        id={`provider-${provider.toLowerCase()}`}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="data-[state=checked]:bg-[var(--provider-accent)] data-[state=checked]:border-[var(--provider-accent)] data-[state=checked]:text-[var(--provider-accent-foreground)]"
        aria-label={`${provider} access`}
      />
      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--provider-accent)]">
        {provider}
      </span>
    </div>
  );
}

function UserRow({
  principal,
  providers,
  index,
}: {
  principal: string;
  providers: ProviderType[];
  index: number;
}) {
  const assign = useAssignProviderAccess();
  const remove = useRemoveProviderAccess();
  const assigned = new Set(providers);
  const busy = assign.isPending || remove.isPending;

  const handleToggle = (provider: ProviderType, checked: boolean) => {
    if (checked) {
      assign.mutate(
        { principal, providers: [...assigned, provider] },
        {
          onSuccess: () => toast.success(`${provider} access granted`),
          onError: () => toast.error(`Failed to grant ${provider} access`),
        },
      );
    } else {
      remove.mutate(
        { principal, provider },
        {
          onSuccess: () => toast.success(`${provider} access revoked`),
          onError: () => toast.error(`Failed to revoke ${provider} access`),
        },
      );
    }
  };

  return (
    <tr
      data-ocid={`provider_access.row.${index}`}
      className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground">
            <ShieldCheck size={14} />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs text-foreground truncate">
              {shortPrincipal(principal)}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground truncate">
              {principal}
            </p>
          </div>
        </div>
      </td>
      {PROVIDERS.map(({ provider, accentClass }) => (
        <td key={provider} className="px-4 py-3 text-center">
          <ProviderToggle
            provider={provider}
            accentClass={accentClass}
            checked={assigned.has(provider)}
            disabled={busy}
            onCheckedChange={(checked) => handleToggle(provider, checked)}
          />
        </td>
      ))}
      <td className="px-4 py-3 text-right">
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
          {providers.length === 0 ? (
            <>
              <UserX size={12} />
              No access
            </>
          ) : (
            `${providers.length} provider${providers.length > 1 ? "s" : ""}`
          )}
        </span>
      </td>
    </tr>
  );
}

export default function ProviderAccessPage() {
  const {
    data: assignments,
    isLoading,
    isError,
    refetch,
  } = useListUserAssignments();

  return (
    <Layout>
      <div
        data-ocid="provider_access.page"
        className="space-y-6 max-w-5xl mx-auto"
      >
        {/* Page Title */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            Provider Access
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Assign each user to one or more cloud providers. Users can only view
            and act on the providers they are assigned to.
          </p>
        </div>

        {/* Access table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold text-foreground">
                User Assignments
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Toggle provider access for each user. Changes apply immediately.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              <ShieldCheck size={12} className="text-primary" />
              {isLoading ? "…" : `${assignments?.length ?? 0} users`}
            </span>
          </div>

          {isLoading ? (
            <div
              data-ocid="provider_access.loading_state"
              className="flex items-center justify-center gap-2 py-16 text-muted-foreground"
            >
              <Loader2 size={16} className="animate-spin" />
              <span className="font-mono text-xs">Loading assignments…</span>
            </div>
          ) : isError ? (
            <div
              data-ocid="provider_access.error_state"
              className="flex flex-col items-center justify-center gap-3 py-16 text-center"
            >
              <p className="font-mono text-xs text-destructive">
                Failed to load user assignments.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="provider_access.retry_button"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : assignments && assignments.length === 0 ? (
            <div
              data-ocid="provider_access.empty_state"
              className="flex flex-col items-center justify-center gap-2 py-16 text-center"
            >
              <ShieldCheck size={28} className="text-muted-foreground/50" />
              <p className="font-display text-sm font-semibold text-foreground">
                No users yet
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                User assignments will appear here once users are registered with
                the platform.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Principal
                    </th>
                    {PROVIDERS.map(({ provider, accentClass }) => (
                      <th
                        key={provider}
                        className={`${accentClass} px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--provider-accent)]`}
                      >
                        {provider}
                      </th>
                    ))}
                    <th className="px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Access
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assignments?.map((a, i) => (
                    <UserRow
                      key={a.principal}
                      principal={a.principal}
                      providers={a.providers}
                      index={i}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
