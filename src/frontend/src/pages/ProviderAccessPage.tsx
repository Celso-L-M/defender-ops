import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
  ShieldOff,
  UserX,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useAssignProviderAccess,
  useGetMyProviders,
  useListUserAssignments,
  useRemoveProviderAccess,
} from "../hooks/use-backend";
import type { ProviderType } from "../types";

const PROVIDERS: { provider: ProviderType; accentClass: string }[] = [
  { provider: "AWS", accentClass: "provider-aws" },
  { provider: "Azure", accentClass: "provider-azure" },
  { provider: "GCP", accentClass: "provider-gcp" },
];

const ALL_PROVIDERS: ProviderType[] = PROVIDERS.map((p) => p.provider);

function shortPrincipal(principal: string): string {
  if (principal.length <= 20) return principal;
  return `${principal.slice(0, 10)}…${principal.slice(-8)}`;
}

function ProviderChip({
  provider,
  accentClass,
  granted,
}: {
  provider: ProviderType;
  accentClass: string;
  granted: boolean;
}) {
  return (
    <span
      data-ocid={`provider_access.my_provider.${provider.toLowerCase()}`}
      className={`${accentClass} inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${
        granted
          ? "border-[var(--provider-accent)] bg-[var(--provider-soft)] text-[var(--provider-accent)]"
          : "border-border bg-muted/20 text-muted-foreground"
      }`}
    >
      {granted ? <CheckCircle2 size={11} /> : <ShieldOff size={11} />}
      {provider}
    </span>
  );
}

function ProviderToggle({
  provider,
  accentClass,
  checked,
  disabled,
  disabledReason,
  onCheckedChange,
}: {
  provider: ProviderType;
  accentClass: string;
  checked: boolean;
  disabled: boolean;
  disabledReason?: string;
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
        title={disabled && disabledReason ? disabledReason : undefined}
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
  manageableProviders,
  canManage,
}: {
  principal: string;
  providers: ProviderType[];
  index: number;
  manageableProviders: Set<ProviderType>;
  canManage: boolean;
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
      {PROVIDERS.map(({ provider, accentClass }) => {
        const providerManageable =
          canManage && manageableProviders.has(provider);
        return (
          <td key={provider} className="px-4 py-3 text-center">
            <ProviderToggle
              provider={provider}
              accentClass={accentClass}
              checked={assigned.has(provider)}
              disabled={busy || !providerManageable}
              disabledReason={
                !canManage
                  ? "Sign in to manage provider access"
                  : `You are not assigned to ${provider}, so you cannot change its access`
              }
              onCheckedChange={(checked) => handleToggle(provider, checked)}
            />
          </td>
        );
      })}
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

function MyAccessPanel({
  principal,
  assignedProviders,
  isLoading,
}: {
  principal: string | null;
  assignedProviders: ProviderType[];
  isLoading: boolean;
}) {
  const assigned = new Set(assignedProviders);
  const denied = ALL_PROVIDERS.filter((p) => !assigned.has(p));

  return (
    <div
      data-ocid="provider_access.my_access_panel"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <ShieldCheck size={16} className="text-primary shrink-0" />
        <div>
          <h2 className="font-display text-sm font-semibold text-foreground">
            Your Access
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Your tenant identity and the cloud providers you are assigned to.
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2">
        {/* Tenant identity */}
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Your Customer
          </p>
          {principal ? (
            <div className="mt-2 flex items-center gap-2.5 min-w-0">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                <ShieldCheck size={15} />
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
          ) : (
            <div
              data-ocid="provider_access.signed_out_state"
              className="mt-2 flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5 text-muted-foreground"
            >
              <Lock size={14} className="shrink-0" />
              <span className="font-mono text-[11px]">
                Sign in to view your customer identity
              </span>
            </div>
          )}
        </div>

        {/* Assigned providers */}
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Providers You Can Access
          </p>
          {isLoading ? (
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Loader2 size={13} className="animate-spin" />
              <span className="font-mono text-[11px]">Loading…</span>
            </div>
          ) : assignedProviders.length === 0 ? (
            <p
              data-ocid="provider_access.my_access_empty"
              className="mt-2 font-mono text-[11px] text-muted-foreground"
            >
              No providers assigned to your account.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PROVIDERS.filter(({ provider }) => assigned.has(provider)).map(
                ({ provider, accentClass }) => (
                  <ProviderChip
                    key={provider}
                    provider={provider}
                    accentClass={accentClass}
                    granted
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Denied providers — isolation made explicit */}
      <div className="border-t border-border px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Providers You Cannot Access
        </p>
        {denied.length === 0 ? (
          <p
            data-ocid="provider_access.denied_empty"
            className="mt-2 font-mono text-[11px] text-muted-foreground"
          >
            You have access to every provider.
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PROVIDERS.filter(({ provider }) => denied.includes(provider)).map(
              ({ provider, accentClass }) => (
                <ProviderChip
                  key={provider}
                  provider={provider}
                  accentClass={accentClass}
                  granted={false}
                />
              ),
            )}
          </div>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">
          Data and actions for these providers are hidden across the app until
          an administrator assigns them to you.
        </p>
      </div>
    </div>
  );
}

export default function ProviderAccessPage() {
  const { identity } = useInternetIdentity();
  const {
    data: assignments,
    isLoading,
    isError,
    refetch,
  } = useListUserAssignments();
  const { data: myProviders = [], isLoading: loadingMyProviders } =
    useGetMyProviders();

  const principal = React.useMemo(() => {
    if (!identity) return null;
    try {
      return identity.getPrincipal().toText();
    } catch {
      return null;
    }
  }, [identity]);

  const manageableProviders = React.useMemo(
    () => new Set(myProviders),
    [myProviders],
  );

  // A user may only change access for providers they themselves are assigned
  // to. The backend returns no assigned providers for anonymous callers, so a
  // signed-out visitor gets every toggle disabled and the screen never offers
  // an action they are not permitted to take.
  const canManage = manageableProviders.size > 0;

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

        {/* Signed-in user's own tenant + provider isolation */}
        <MyAccessPanel
          principal={principal}
          assignedProviders={myProviders}
          isLoading={loadingMyProviders}
        />

        {/* Admin: user assignments */}
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
                      manageableProviders={manageableProviders}
                      canManage={canManage}
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
