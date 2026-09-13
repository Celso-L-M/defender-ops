import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Pencil,
  Plus,
  ScrollText,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { ProviderIcon } from "../components/ProviderIcon";
import {
  useAuditLog,
  useDeleteVaultSecret,
  useListVaultSecrets,
  useRevealVaultSecret,
  useSaveVaultSecret,
  useUpdateVaultSecret,
} from "../hooks/use-backend";
import type { ProviderType, VaultEntryView } from "../types";

const PROVIDERS: ProviderType[] = ["AWS", "Azure", "GCP"];

const providerAccent: Record<ProviderType, string> = {
  AWS: "provider-aws",
  Azure: "provider-azure",
  GCP: "provider-gcp",
};

function timestampToDate(ts: bigint): Date | null {
  const date = new Date(Number(ts / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTimestamp(ts: bigint): string {
  const d = timestampToDate(ts);
  if (!d) return "—";
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAuditTime(ts: bigint): string {
  const d = timestampToDate(ts);
  if (!d) return "—";
  return d.toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function maskValue(): string {
  // Render a fixed dot-mask so the length never leaks the real secret.
  return "••••••••••••";
}

// ─── Secret value cell ──────────────────────────────────────────────────────

function SecretValueCell({
  entry,
  revealed,
  onReveal,
  isRevealing,
}: {
  entry: VaultEntryView;
  revealed: string | null;
  onReveal: () => void;
  isRevealing: boolean;
}) {
  if (revealed !== null) {
    return (
      <span
        className="secret-revealed text-xs"
        data-ocid="vault.secret_revealed"
      >
        {revealed}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <span className="secret-masked text-xs" data-ocid="vault.secret_masked">
        {maskValue()}
      </span>
      <button
        type="button"
        data-ocid="vault.reveal_button"
        onClick={onReveal}
        disabled={isRevealing}
        className="secret-reveal-toggle inline-flex items-center gap-1"
        aria-label={`Reveal secret ${entry.name}`}
      >
        {isRevealing ? (
          <Loader2 size={10} className="animate-spin" />
        ) : (
          <Eye size={10} />
        )}
        Reveal
      </button>
    </span>
  );
}

// ─── Add / Edit dialog ──────────────────────────────────────────────────────

function SecretFormDialog({
  open,
  onOpenChange,
  editing,
  defaultProvider,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: VaultEntryView | null;
  defaultProvider: ProviderType;
}) {
  const save = useSaveVaultSecret();
  const update = useUpdateVaultSecret();
  const [provider, setProvider] = useState<ProviderType>(defaultProvider);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  // Reset the form whenever the dialog opens for a new or edited entry.
  React.useEffect(() => {
    if (open) {
      setProvider(editing?.provider ?? defaultProvider);
      setName(editing?.name ?? "");
      setValue("");
    }
  }, [open, editing, defaultProvider]);

  const isEditing = editing !== null;
  const pending = save.isPending || update.isPending;
  const canSubmit = name.trim().length > 0 && value.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedValue = value.trim();
    if (!trimmedName || !trimmedValue) return;
    try {
      if (isEditing) {
        await update.mutateAsync({
          provider: editing.provider,
          name: trimmedName,
          value: trimmedValue,
        });
        toast.success(`Secret "${trimmedName}" updated`);
      } else {
        await save.mutateAsync({
          provider,
          name: trimmedName,
          value: trimmedValue,
        });
        toast.success(`Secret "${trimmedName}" saved`);
      }
      onOpenChange(false);
    } catch (err) {
      const kind =
        typeof err === "object" && err !== null && "err" in (err as object)
          ? ((err as { err: { __kind__: string } }).err.__kind__ ?? "")
          : "";
      if (kind === "AlreadyExists") {
        toast.error(`A secret named "${trimmedName}" already exists`);
      } else if (kind === "InvalidName") {
        toast.error("That secret name is not valid");
      } else if (kind === "NotAuthorized") {
        toast.error("You do not have access to this provider's vault");
      } else {
        toast.error(
          isEditing ? "Failed to update secret" : "Failed to save secret",
        );
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="vault.secret_dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditing ? "Edit Secret" : "Add Secret"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update the value of "${editing.name}". The new value is encrypted at rest.`
              : "Store an arbitrary named secret (API key, token, password, service account JSON) for a provider."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="vault-provider"
              className="text-xs text-muted-foreground uppercase tracking-wider"
            >
              Provider
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p}
                  type="button"
                  data-ocid={`vault.provider_option.${p.toLowerCase()}`}
                  disabled={isEditing}
                  onClick={() => setProvider(p)}
                  className={`${providerAccent[p]} flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-mono font-semibold transition-colors ${
                    provider === p
                      ? "nav-provider-active border-border"
                      : "border-border text-muted-foreground hover:bg-muted/40"
                  } ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <ProviderIcon provider={p} showLabel={false} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="vault-name"
              className="text-xs text-muted-foreground uppercase tracking-wider"
            >
              Secret Name
            </Label>
            <Input
              id="vault-name"
              data-ocid="vault.name_input"
              placeholder="e.g. prod-stripe-api-key"
              className="font-mono"
              value={name}
              disabled={isEditing}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="vault-value"
              className="text-xs text-muted-foreground uppercase tracking-wider"
            >
              Secret Value
            </Label>
            <Input
              id="vault-value"
              data-ocid="vault.value_input"
              placeholder="Enter the secret value"
              className="font-mono"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Encrypted at rest. Never shown in list views.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="vault.cancel_button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              data-ocid="vault.save_button"
              disabled={pending || !canSubmit}
            >
              {pending && <Loader2 size={13} className="animate-spin mr-1.5" />}
              {isEditing ? "Save Changes" : "Add Secret"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Provider vault panel ───────────────────────────────────────────────────

function ProviderVaultPanel({ provider }: { provider: ProviderType }) {
  const { data: secrets, isLoading } = useListVaultSecrets(provider);
  const reveal = useRevealVaultSecret();
  const deleteSecret = useDeleteVaultSecret();
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [revealing, setRevealing] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VaultEntryView | null>(null);
  const [deleting, setDeleting] = useState<VaultEntryView | null>(null);

  const key = (name: string) => `${provider}:${name}`;

  const handleReveal = async (entry: VaultEntryView) => {
    const k = key(entry.name);
    setRevealing((prev) => ({ ...prev, [k]: true }));
    try {
      const value = await reveal.mutateAsync({
        provider: entry.provider,
        name: entry.name,
      });
      setRevealed((prev) => ({ ...prev, [k]: value }));
    } catch {
      toast.error("Unable to reveal secret — check your provider access");
    } finally {
      setRevealing((prev) => ({ ...prev, [k]: false }));
    }
  };

  const handleHide = (entry: VaultEntryView) => {
    const k = key(entry.name);
    setRevealed((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteSecret.mutateAsync({
        provider: deleting.provider,
        name: deleting.name,
      });
      toast.success(`Secret "${deleting.name}" deleted`);
      setDeleting(null);
    } catch {
      toast.error("Failed to delete secret");
    }
  };

  return (
    <div
      data-ocid={`vault.panel.${provider.toLowerCase()}`}
      className="vault-shell"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <Lock size={16} className="vault-accent" />
          <h2 className="font-display text-base font-bold text-foreground">
            {provider} Vault
          </h2>
          <span className="badge-vault">Encrypted</span>
        </div>
        <Button
          type="button"
          size="sm"
          data-ocid="vault.add_button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus size={14} className="mr-1.5" />
          Add Secret
        </Button>
      </div>

      {/* Secrets table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left data-dense">
          <thead>
            <tr className="border-b border-border/60">
              <th className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Secret Name
              </th>
              <th className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Provider
              </th>
              <th className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Last Updated
              </th>
              <th className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Secret Value
              </th>
              <th className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map((id) => (
                <tr key={id} className="border-b border-border/30">
                  <td className="px-5 py-2.5">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="px-5 py-2.5">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-5 py-2.5">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-5 py-2.5">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-5 py-2.5">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                </tr>
              ))
            ) : secrets && secrets.length > 0 ? (
              secrets.map((entry, idx) => {
                const k = key(entry.name);
                const isRevealed = revealed[k] !== undefined;
                return (
                  <tr
                    key={k}
                    data-ocid={`vault.row.${idx + 1}`}
                    className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-5 py-2.5">
                      <span className="flex items-center gap-2 font-mono text-xs font-medium text-foreground">
                        <KeyRound size={12} className="vault-accent" />
                        {entry.name}
                      </span>
                    </td>
                    <td className="px-5 py-2.5">
                      <span
                        className={`${providerAccent[entry.provider]} inline-flex`}
                      >
                        <ProviderIcon provider={entry.provider} />
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-mono text-[11px] text-muted-foreground">
                      {formatTimestamp(entry.updatedAt)}
                    </td>
                    <td className="px-5 py-2.5">
                      <SecretValueCell
                        entry={entry}
                        revealed={isRevealed ? revealed[k] : null}
                        onReveal={() => handleReveal(entry)}
                        isRevealing={!!revealing[k]}
                      />
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        {isRevealed ? (
                          <button
                            type="button"
                            data-ocid="vault.hide_button"
                            onClick={() => handleHide(entry)}
                            className="secret-reveal-toggle inline-flex items-center gap-1"
                            aria-label={`Hide secret ${entry.name}`}
                          >
                            <EyeOff size={10} />
                            Hide
                          </button>
                        ) : null}
                        <button
                          type="button"
                          data-ocid="vault.edit_button"
                          onClick={() => {
                            setEditing(entry);
                            setDialogOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-mono text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
                          aria-label={`Edit secret ${entry.name}`}
                        >
                          <Pencil size={11} />
                          Edit
                        </button>
                        <button
                          type="button"
                          data-ocid="vault.delete_button"
                          onClick={() => setDeleting(entry)}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-mono text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label={`Delete secret ${entry.name}`}
                        >
                          <Trash2 size={11} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10">
                  <div
                    data-ocid="vault.empty_state"
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <Lock size={28} className="vault-accent mb-2" />
                    <p className="font-display text-sm font-semibold text-foreground">
                      No secrets stored for {provider}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      Add API keys, tokens, passwords, or service account JSON.
                      Values are encrypted at rest and masked by default.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      data-ocid="vault.empty_add_button"
                      className="mt-4"
                      onClick={() => {
                        setEditing(null);
                        setDialogOpen(true);
                      }}
                    >
                      <Plus size={14} className="mr-1.5" />
                      Add Secret
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit dialog */}
      <SecretFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        defaultProvider={provider}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent data-ocid="vault.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete secret?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes "{deleting?.name}" from the{" "}
              {deleting?.provider} vault. This action is recorded in the audit
              log and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="vault.delete_cancel_button"
              onClick={() => setDeleting(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="vault.delete_confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSecret.isPending ? (
                <Loader2 size={13} className="animate-spin mr-1.5" />
              ) : (
                <Trash2 size={13} className="mr-1.5" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Audit log section ──────────────────────────────────────────────────────

function AuditLogSection() {
  const { data: entries, isLoading } = useAuditLog("", 50);

  return (
    <div data-ocid="vault.audit_log" className="vault-shell">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/60">
        <ScrollText size={16} className="vault-accent" />
        <h2 className="font-display text-base font-bold text-foreground">
          Audit Log
        </h2>
        <span className="badge-vault">Read-only</span>
      </div>

      <div className="px-5 py-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }, (_, i) => `audit-skeleton-${i}`).map(
              (id) => (
                <Skeleton key={id} className="h-5 w-full" />
              ),
            )}
          </div>
        ) : entries && entries.length > 0 ? (
          <ul className="space-y-2.5">
            {entries.map((entry, idx) => (
              <li
                key={entry.id}
                data-ocid={`vault.audit_item.${idx + 1}`}
                className="flex items-start gap-3 rounded-md border border-border/40 bg-card/40 px-3 py-2"
              >
                <ShieldAlert
                  size={13}
                  className="vault-accent mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-foreground">
                    <span className="font-mono font-semibold">
                      {entry.actorId}
                    </span>{" "}
                    {entry.action}
                  </p>
                  {entry.details && (
                    <p className="font-mono text-[11px] text-muted-foreground truncate">
                      {entry.details}
                    </p>
                  )}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                  {formatAuditTime(entry.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            No vault activity recorded yet.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function VaultPage() {
  const [activeProvider, setActiveProvider] = useState<ProviderType>("AWS");

  return (
    <Layout>
      <div data-ocid="vault.page" className="space-y-6 max-w-5xl mx-auto">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Cloud Vault
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Centralized per-provider secret storage. Values are masked by
              default and revealed only on demand.
            </p>
          </div>
          <span className="badge-vault mt-1">Encrypted at rest</span>
        </div>

        {/* Provider selector */}
        <div data-ocid="vault.provider_tabs" className="grid grid-cols-3 gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p}
              type="button"
              data-ocid={`vault.provider_tab.${p.toLowerCase()}`}
              onClick={() => setActiveProvider(p)}
              className={`${providerAccent[p]} flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-mono text-sm font-semibold transition-smooth ${
                activeProvider === p
                  ? "nav-provider-active border-border"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <ProviderIcon provider={p} showLabel={false} />
              {p}
            </button>
          ))}
        </div>

        {/* Active provider vault panel */}
        <ProviderVaultPanel key={activeProvider} provider={activeProvider} />

        {/* Audit log */}
        <AuditLogSection />
      </div>
    </Layout>
  );
}
