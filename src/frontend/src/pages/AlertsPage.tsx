import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Clock,
  Crosshair,
  Globe,
  Search,
  Server,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { ProviderIcon } from "../components/ProviderIcon";
import { SeverityBadge } from "../components/SeverityBadge";
import {
  useEnrichAlert,
  useNormalizedAlerts,
  useUpdateAlertOwner,
  useUpdateAlertStatus,
} from "../hooks/use-backend";
import type {
  AlertEnrichment,
  AlertStatus,
  NormalizedAlert,
  ProviderType,
  Severity,
} from "../types";

type ProviderFilter = "All" | ProviderType;
type SeverityFilter = "All" | Severity;
type StatusFilter = "All" | AlertStatus;

const STATUS_STYLES: Record<AlertStatus, string> = {
  Open: "border-destructive text-destructive bg-destructive/10",
  InProgress: "border-warning text-warning bg-warning/10",
  Resolved: "border-border text-muted-foreground bg-muted/20",
};

function relativeTime(ts: bigint): string {
  const diffMs = Date.now() - Number(ts / 1_000_000n);
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : `${str.slice(0, max)}…`;
}

function EnrichmentSection({
  alert,
}: {
  alert: NormalizedAlert;
}) {
  const enrich = useEnrichAlert();
  const enrichment = alert.enrichment as AlertEnrichment | null | undefined;

  const statusBadge = enrichment?.enrichedAt ? (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-700/40">
      <Sparkles size={10} />
      Enriched
    </span>
  ) : enrich.isPending ? (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono bg-muted/40 text-muted-foreground border border-border">
      <Zap size={10} className="animate-pulse" />
      Enriching…
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono bg-muted/30 text-muted-foreground border border-border">
      Not Configured
    </span>
  );

  return (
    <div className="space-y-3 pt-1">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe size={13} className="text-primary" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">
            Threat Intelligence
          </span>
        </div>
        {statusBadge}
      </div>

      {/* Enrich Now button */}
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={enrich.isPending}
        onClick={() =>
          enrich.mutate({ alertId: alert.id, customer: alert.customer })
        }
        data-ocid="alert.enrich_now_button"
        className="w-full h-8 text-xs border-primary/40 text-primary hover:bg-primary/10"
      >
        <Sparkles size={11} className="mr-1.5" />
        {enrich.isPending ? "Enriching…" : "Enrich Now"}
      </Button>

      {enrich.isError && (
        <p
          className="text-xs text-destructive"
          data-ocid="alert.enrich.error_state"
        >
          {(enrich.error as Error)?.message ?? "Enrichment failed"}
        </p>
      )}

      {/* Known Malicious IP banner */}
      {enrichment?.knownMaliciousIp && (
        <div
          className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2.5"
          data-ocid="alert.known_malicious_ip_banner"
        >
          <AlertTriangle size={13} className="text-destructive shrink-0" />
          <p className="text-xs font-semibold text-destructive">
            Known Malicious IP — flagged by Emerging Threats blocklist
          </p>
        </div>
      )}

      {/* No enrichment placeholder */}
      {!enrichment && (
        <p
          className="text-xs text-muted-foreground italic py-2"
          data-ocid="alert.enrichment.empty_state"
        >
          No enrichment data yet. Click Enrich Now to fetch threat intelligence.
        </p>
      )}

      {enrichment && (
        <div className="space-y-3">
          {/* IP Reputation */}
          {enrichment.ipReputation && (
            <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                IP Reputation
              </p>
              {/* Abuse score bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Abuse Score
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      enrichment.ipReputation.abuseScore >= 80
                        ? "text-destructive"
                        : enrichment.ipReputation.abuseScore >= 40
                          ? "text-warning"
                          : "text-emerald-400"
                    }`}
                  >
                    {enrichment.ipReputation.abuseScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      enrichment.ipReputation.abuseScore >= 80
                        ? "bg-destructive"
                        : enrichment.ipReputation.abuseScore >= 40
                          ? "bg-warning"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${enrichment.ipReputation.abuseScore}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {(
                  [
                    ["Country", enrichment.ipReputation.country],
                    ["ISP", enrichment.ipReputation.isp],
                    [
                      "Total Reports",
                      String(enrichment.ipReputation.totalReports),
                    ],
                    ["Last Reported", enrichment.ipReputation.lastReported],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                      {label}
                    </p>
                    <p className="text-xs font-mono text-foreground/90 break-all">
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Domain / URL Reputation */}
          {enrichment.domainRep && (
            <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                Domain / URL Reputation
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-destructive/15 text-destructive border border-destructive/30">
                  {enrichment.domainRep.maliciousVotes} Malicious
                </span>
                <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-warning/15 text-warning border border-warning/30">
                  {enrichment.domainRep.suspiciousVotes} Suspicious
                </span>
                <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-700/30">
                  {enrichment.domainRep.cleanVotes} Clean
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                  Last Analysis
                </p>
                <p className="text-xs font-mono text-foreground/80">
                  {enrichment.domainRep.lastAnalysisDate}
                </p>
              </div>
            </div>
          )}

          {/* MITRE Detail */}
          {enrichment.mitreDetail && (
            <div className="rounded-lg border border-chart-5/40 bg-chart-5/5 p-3 space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-chart-5">
                MITRE Detail
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                    Tactic
                  </p>
                  <p className="text-xs font-mono text-foreground/90">
                    {enrichment.mitreDetail.tacticName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                    Technique
                  </p>
                  <p className="text-xs font-mono text-foreground/90">
                    {enrichment.mitreDetail.techniqueName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                    Description
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {enrichment.mitreDetail.description}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                    Mitigations
                  </p>
                  <div className="max-h-28 overflow-y-auto rounded bg-muted/20 p-2">
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {enrichment.mitreDetail.mitigations}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AlertDetailPanel({
  alert,
  onClose,
}: {
  alert: NormalizedAlert | null;
  onClose: () => void;
}) {
  const updateStatus = useUpdateAlertStatus();
  const updateOwner = useUpdateAlertOwner();
  const [status, setStatus] = useState<AlertStatus>(alert?.status ?? "Open");
  const [owner, setOwner] = useState(alert?.owner ?? "");
  const [saving, setSaving] = useState<"status" | "owner" | null>(null);

  if (!alert) return null;

  const handleSaveStatus = async () => {
    setSaving("status");
    await updateStatus.mutateAsync({ alertId: alert.id, status });
    setSaving(null);
  };

  const handleSaveOwner = async () => {
    setSaving("owner");
    await updateOwner.mutateAsync({ alertId: alert.id, owner });
    setSaving(null);
  };

  const hasMitre = alert.mitre && (alert.mitre.tactic || alert.mitre.technique);

  return (
    <Sheet open={!!alert} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-card border-l border-border overflow-y-auto"
        data-ocid="alert.detail.sheet"
      >
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <ProviderIcon provider={alert.provider} showLabel />
            <SeverityBadge severity={alert.severity} />
          </div>
          <SheetTitle className="text-foreground text-base font-semibold leading-snug">
            {alert.title}
          </SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-5">
          {/* Description */}
          {alert.description && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                Description
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {alert.description}
              </p>
            </div>
          )}

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {(
              [
                ["Alert ID", truncate(alert.id, 24)],
                ["Source", alert.provider],
                ["Original Severity", alert.originalSeverity],
                ["Normalized Severity", alert.severity],
                ["Asset ID", alert.assetId ? truncate(alert.assetId, 24) : "—"],
                ["Asset Type", alert.assetType ?? "—"],
                ["Region", alert.region ?? "—"],
                [
                  "Account ID",
                  alert.accountId ? truncate(alert.accountId, 20) : "—",
                ],
                ["Timestamp", relativeTime(alert.timestamp)],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
                  {label}
                </p>
                <p className="text-xs font-mono text-foreground/90 break-all">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* MITRE ATT&CK card */}
          {hasMitre && (
            <div className="rounded-lg border border-chart-5/40 bg-chart-5/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Crosshair size={13} className="text-chart-5" />
                <span className="text-[10px] uppercase tracking-widest font-semibold text-chart-5">
                  MITRE ATT&amp;CK
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {alert.mitre?.techniqueId && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
                      Technique ID
                    </p>
                    <p className="text-xs font-mono font-semibold text-chart-5">
                      {alert.mitre.techniqueId}
                    </p>
                  </div>
                )}
                {alert.mitre?.tactic && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
                      Tactic
                    </p>
                    <p className="text-xs font-mono text-foreground/90">
                      {alert.mitre.tactic}
                    </p>
                  </div>
                )}
                {alert.mitre?.technique && (
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
                      Technique
                    </p>
                    <p className="text-xs font-mono text-foreground/90">
                      {alert.mitre.technique}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enrichment section */}
          <div
            className="rounded-lg border border-primary/20 bg-primary/5 p-3"
            data-ocid="alert.enrichment.section"
          >
            <EnrichmentSection alert={alert} />
          </div>

          {/* Status changer */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Status
            </Label>
            <div className="flex gap-2">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as AlertStatus)}
              >
                <SelectTrigger
                  className="flex-1 bg-background border-input text-sm"
                  data-ocid="alert.status.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveStatus}
                disabled={saving === "status"}
                data-ocid="alert.status.save_button"
              >
                {saving === "status" ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>

          {/* Owner field */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Assigned Owner
            </Label>
            <div className="flex gap-2">
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="email or username"
                className="flex-1 bg-background border-input text-sm font-mono"
                data-ocid="alert.owner.input"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSaveOwner}
                disabled={saving === "owner"}
                data-ocid="alert.owner.save_button"
              >
                {saving === "owner" ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AlertsPage() {
  const { data: alerts = [], isLoading } = useNormalizedAlerts({
    customer: "",
    limit: 200,
  });

  const [provider, setProvider] = useState<ProviderFilter>("All");
  const [severity, setSeverity] = useState<SeverityFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<NormalizedAlert | null>(null);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (provider !== "All" && a.provider !== provider) return false;
      if (severity !== "All" && a.severity !== severity) return false;
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (
        search.trim() &&
        !a.title.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [alerts, provider, severity, statusFilter, search]);

  return (
    <Layout>
      <div className="flex flex-col min-h-full">
        {/* Page header */}
        <div className="bg-card border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-primary" />
            <h1 className="text-xl font-display font-semibold text-foreground">
              Alert Center
            </h1>
            <Badge
              className="ml-1 bg-primary/20 text-primary border border-primary/30 font-mono text-xs"
              data-ocid="alerts.total_badge"
            >
              {isLoading ? "…" : filtered.length}
            </Badge>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-muted/20 border-b border-border px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alerts…"
                className="pl-7 h-8 bg-background border-input text-sm"
                data-ocid="alerts.search_input"
              />
            </div>

            {/* Provider */}
            <Select
              value={provider}
              onValueChange={(v) => setProvider(v as ProviderFilter)}
            >
              <SelectTrigger
                className="h-8 w-32 bg-background border-input text-sm"
                data-ocid="alerts.provider.select"
              >
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="All">All Providers</SelectItem>
                <SelectItem value="AWS">AWS</SelectItem>
                <SelectItem value="Azure">Azure</SelectItem>
                <SelectItem value="GCP">GCP</SelectItem>
              </SelectContent>
            </Select>

            {/* Severity */}
            <Select
              value={severity}
              onValueChange={(v) => setSeverity(v as SeverityFilter)}
            >
              <SelectTrigger
                className="h-8 w-32 bg-background border-input text-sm"
                data-ocid="alerts.severity.select"
              >
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="All">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Status */}
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger
                className="h-8 w-36 bg-background border-input text-sm"
                data-ocid="alerts.status.select"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <AlertsTableSkeleton />
          ) : filtered.length === 0 ? (
            <AlertsEmptyState
              hasFilters={
                !!search ||
                provider !== "All" ||
                severity !== "All" ||
                statusFilter !== "All"
              }
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card/60 sticky top-0 z-10">
                  {[
                    "Time",
                    "Provider",
                    "Severity",
                    "Title",
                    "Status",
                    "MITRE",
                    "Asset",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-[10px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((alert, i) => (
                  <AlertRow
                    key={alert.id}
                    alert={alert}
                    index={i + 1}
                    onView={() => setSelected(alert)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail panel */}
      <AlertDetailPanel alert={selected} onClose={() => setSelected(null)} />
    </Layout>
  );
}

function AlertRow({
  alert,
  index,
  onView,
}: {
  alert: NormalizedAlert;
  index: number;
  onView: () => void;
}) {
  return (
    <tr
      className="border-b border-border/60 hover:bg-muted/20 transition-colors cursor-pointer group"
      data-ocid={`alerts.item.${index}`}
      onClick={onView}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onView();
      }}
    >
      {/* Timestamp */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground">
          <Clock size={11} className="shrink-0" />
          {relativeTime(alert.timestamp)}
        </span>
      </td>

      {/* Provider */}
      <td className="px-4 py-3 whitespace-nowrap">
        <ProviderIcon provider={alert.provider} showLabel />
      </td>

      {/* Severity */}
      <td className="px-4 py-3 whitespace-nowrap">
        <SeverityBadge severity={alert.severity} />
      </td>

      {/* Title */}
      <td className="px-4 py-3 max-w-xs">
        <span className="text-foreground/90 font-medium text-xs leading-snug">
          {truncate(alert.title, 60)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold border ${
            STATUS_STYLES[alert.status]
          }`}
        >
          {alert.status}
        </span>
      </td>

      {/* MITRE tactic */}
      <td className="px-4 py-3 whitespace-nowrap">
        {alert.mitre?.tactic ? (
          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium bg-chart-5/10 border border-chart-5/30 text-chart-5">
            <Crosshair size={9} className="shrink-0" />
            {truncate(alert.mitre.tactic, 18)}
          </span>
        ) : (
          <span className="text-muted-foreground/40 text-xs">—</span>
        )}
      </td>

      {/* Asset ID */}
      <td className="px-4 py-3">
        <span className="text-xs font-mono text-muted-foreground">
          {alert.assetId ? (
            <span className="inline-flex items-center gap-1">
              <Server size={10} className="shrink-0" />
              {truncate(alert.assetId, 20)}
            </span>
          ) : (
            "—"
          )}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 px-2.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          data-ocid={`alerts.view_button.${index}`}
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
        >
          View
        </Button>
      </td>
    </tr>
  );
}

function AlertsTableSkeleton() {
  return (
    <div className="p-6 space-y-2" data-ocid="alerts.loading_state">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Skeleton key={`sk-${i}`} className="h-11 w-full rounded bg-muted/30" />
      ))}
    </div>
  );
}

function AlertsEmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
      data-ocid="alerts.empty_state"
    >
      <ShieldAlert size={40} className="text-muted-foreground/30 mb-4" />
      <p className="text-foreground/70 font-semibold text-base mb-1">
        {hasFilters ? "No alerts match your filters" : "No alerts found"}
      </p>
      <p className="text-muted-foreground text-sm max-w-xs">
        {hasFilters
          ? "Try adjusting your filters or search query."
          : "Alerts will appear here once ingestion begins and findings are normalized."}
      </p>
    </div>
  );
}
