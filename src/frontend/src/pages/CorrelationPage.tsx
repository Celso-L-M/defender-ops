import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, GitMerge, X } from "lucide-react";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SeverityBadge } from "../components/SeverityBadge";
import {
  useAlertsForCorrelation,
  useCorrelatedIncidents,
  useCorrelationStats,
  useUpdateCorrelatedIncidentStatus,
} from "../hooks/use-backend";
import type {
  CorrelatedIncident,
  IncidentStatus,
  NormalizedAlert,
} from "../types";

function formatTs(ns: bigint | undefined): string {
  if (!ns) return "—";
  return new Date(Number(ns) / 1_000_000).toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusPill({ status }: { status: IncidentStatus }) {
  const map: Record<IncidentStatus, string> = {
    Open: "bg-destructive/15 border border-destructive/60 text-destructive",
    Investigating: "bg-warning/15 border border-warning/60 text-warning",
    Resolved: "bg-primary/15 border border-primary/60 text-primary",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${
        map[status] ?? "bg-muted/30 border border-border text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

function ProviderPills({ providers }: { providers: string[] }) {
  const colors: Record<string, string> = {
    AWS: "text-orange-400 border-orange-400/40 bg-orange-400/10",
    Azure: "text-blue-400 border-blue-400/40 bg-blue-400/10",
    GCP: "text-green-400 border-green-400/40 bg-green-400/10",
  };
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {providers.map((p) => (
        <span
          key={p}
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold border ${
            colors[p] ?? "text-muted-foreground border-border bg-muted/20"
          }`}
        >
          {p}
        </span>
      ))}
    </div>
  );
}

// ---- Timeline inside detail modal ----
function CorrelationTimeline({
  incident,
  alerts,
}: {
  incident: CorrelatedIncident;
  alerts: NormalizedAlert[];
}) {
  if (alerts.length < 2) {
    return (
      <p className="font-mono text-xs text-muted-foreground py-4 text-center">
        Awaiting alert data to render timeline…
      </p>
    );
  }
  const sorted = [...alerts].sort((a, b) => Number(a.timestamp - b.timestamp));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const deltaMin = incident.timeDeltaMinutes;

  return (
    <div
      data-ocid="correlation.detail.timeline"
      className="mt-4 flex items-center gap-0"
      aria-label="Correlation timeline"
    >
      {/* Event A */}
      <div className="flex-1 min-w-0 bg-muted/20 border border-border rounded-md p-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          {first.provider}
        </p>
        <p className="text-xs font-semibold text-foreground truncate">
          {first.title}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground mt-1">
          {formatTs(first.timestamp)}
        </p>
      </div>

      {/* Arrow with delta */}
      <div className="flex flex-col items-center gap-0.5 px-3 shrink-0">
        <div className="flex items-center gap-1">
          <div className="h-px w-8 bg-border" />
          <ArrowRight size={12} className="text-muted-foreground shrink-0" />
        </div>
        <span className="font-mono text-[10px] text-primary whitespace-nowrap">
          {deltaMin} min
        </span>
      </div>

      {/* Event B */}
      <div className="flex-1 min-w-0 bg-muted/20 border border-border rounded-md p-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          {last.provider}
        </p>
        <p className="text-xs font-semibold text-foreground truncate">
          {last.title}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground mt-1">
          {formatTs(last.timestamp)}
        </p>
      </div>
    </div>
  );
}

// ---- Alert detail card (side-by-side) ----
function AlertDetailCard({ alert }: { alert: NormalizedAlert }) {
  return (
    <div className="bg-muted/10 border border-border rounded-md p-3 space-y-1.5">
      <div className="flex items-center gap-2">
        <SeverityBadge severity={alert.severity} />
        <span className="font-mono text-[10px] text-muted-foreground uppercase">
          {alert.provider}
        </span>
      </div>
      <p className="text-sm font-semibold text-foreground">{alert.title}</p>
      {alert.description && (
        <p className="font-mono text-[11px] text-muted-foreground line-clamp-2">
          {alert.description}
        </p>
      )}
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 font-mono text-[10px]">
        {alert.assetId && (
          <>
            <span className="text-muted-foreground">Resource</span>
            <span className="text-foreground truncate">{alert.assetId}</span>
          </>
        )}
        {alert.region && (
          <>
            <span className="text-muted-foreground">Region</span>
            <span className="text-foreground">{alert.region}</span>
          </>
        )}
        <span className="text-muted-foreground">Time</span>
        <span className="text-foreground">{formatTs(alert.timestamp)}</span>
        <span className="text-muted-foreground">Status</span>
        <span className="text-foreground">{alert.status}</span>
      </div>
    </div>
  );
}

// ---- Detail modal ----
function IncidentDetailModal({
  incident,
  onClose,
}: {
  incident: CorrelatedIncident;
  onClose: () => void;
}) {
  const { data: sourceAlerts, isLoading: alertsLoading } =
    useAlertsForCorrelation(incident.sourceAlerts);
  const updateStatus = useUpdateCorrelatedIncidentStatus();
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus>(
    incident.status,
  );
  const [owner, setOwner] = useState(incident.assignedOwner ?? "");
  const [notes, setNotes] = useState(incident.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStatus.mutateAsync({
        id: incident.incidentId,
        status: selectedStatus,
        owner: owner || undefined,
        notes: notes || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 m-0 max-w-none max-h-none w-full h-full border-0 p-0"
      data-ocid="correlation.detail.dialog"
      aria-labelledby="incident-detail-title"
      open
    >
      <div
        className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-card border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <GitMerge size={16} className="text-primary shrink-0" />
            <div>
              <h2
                id="incident-detail-title"
                className="font-display font-bold text-sm text-foreground"
              >
                {incident.incidentType}
              </h2>
              <p className="font-mono text-[10px] text-muted-foreground">
                {incident.incidentId}
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="correlation.detail.close_button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Incident Fields */}
          <div className="space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Incident Details
            </h3>
            <div className="bg-muted/10 border border-border rounded-md p-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
              <span className="text-muted-foreground">Severity</span>
              <span>
                <SeverityBadge severity={incident.severity} />
              </span>
              <span className="text-muted-foreground">Status</span>
              <span>
                <StatusPill status={incident.status} />
              </span>
              <span className="text-muted-foreground">Providers</span>
              <span>
                <ProviderPills providers={incident.sourceProviders} />
              </span>
              {incident.sourceIp && (
                <>
                  <span className="text-muted-foreground">Source IP</span>
                  <span className="text-foreground font-semibold">
                    {incident.sourceIp}
                  </span>
                </>
              )}
              <span className="text-muted-foreground">Time Delta</span>
              <span className="text-foreground">
                {incident.timeDeltaMinutes} min
              </span>
              <span className="text-muted-foreground">Window</span>
              <span className="text-foreground">
                {Number(incident.correlationWindowMinutes)} min
              </span>
              <span className="text-muted-foreground">Detected At</span>
              <span className="text-foreground">
                {formatTs(incident.detectedAt)}
              </span>
              {incident.affectedResources.length > 0 && (
                <>
                  <span className="text-muted-foreground col-span-2 mt-1">
                    Affected Resources
                  </span>
                  {incident.affectedResources.map((r) => (
                    <span
                      key={r}
                      className="col-span-2 text-foreground truncate"
                    >
                      • {r}
                    </span>
                  ))}
                </>
              )}
            </div>

            {/* Status update */}
            <div className="space-y-2">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Update
              </h3>
              <div className="space-y-2">
                <select
                  data-ocid="correlation.detail.status_select"
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as IncidentStatus)
                  }
                  className="w-full rounded-md border border-border bg-background text-foreground text-xs font-mono px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/60"
                >
                  <option value="Open">Open</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <input
                  type="text"
                  data-ocid="correlation.detail.owner_input"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="Assigned owner (optional)"
                  className="w-full rounded-md border border-border bg-background text-foreground text-xs font-mono px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/60 placeholder:text-muted-foreground"
                />
                <textarea
                  data-ocid="correlation.detail.notes_textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes (optional)"
                  rows={2}
                  className="w-full rounded-md border border-border bg-background text-foreground text-xs font-mono px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/60 placeholder:text-muted-foreground resize-none"
                />
                <button
                  type="button"
                  data-ocid="correlation.detail.save_button"
                  disabled={saving}
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-40"
                >
                  {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Source Alerts */}
          <div className="space-y-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Source Alerts
            </h3>
            {alertsLoading ? (
              <div
                data-ocid="correlation.detail.alerts_loading_state"
                className="flex justify-center py-8"
              >
                <LoadingSpinner size={20} />
              </div>
            ) : !sourceAlerts || sourceAlerts.length === 0 ? (
              <div
                data-ocid="correlation.detail.alerts_empty_state"
                className="py-8 text-center"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  No alert details found
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sourceAlerts.map((alert) => (
                  <AlertDetailCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}

            {/* Timeline */}
            {!alertsLoading && sourceAlerts && sourceAlerts.length >= 2 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Event Timeline
                </h3>
                <CorrelationTimeline
                  incident={incident}
                  alerts={sourceAlerts}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
function StatsRow() {
  const { data: stats, isLoading } = useCorrelationStats();
  const items = [
    {
      label: "Today",
      value: Number(stats?.totalToday ?? 0n),
      ocid: "correlation.stats.today_card",
    },
    {
      label: "This Week",
      value: Number(stats?.totalThisWeek ?? 0n),
      ocid: "correlation.stats.week_card",
    },
    {
      label: "All Time",
      value: Number(stats?.totalAllTime ?? 0n),
      ocid: "correlation.stats.alltime_card",
    },
  ];
  return (
    <div data-ocid="correlation.stats_row" className="grid grid-cols-3 gap-3">
      {items.map(({ label, value, ocid }) => (
        <div
          key={label}
          data-ocid={ocid}
          className="bg-card border border-border rounded-md p-3.5 flex items-start gap-3"
        >
          <div className="rounded bg-primary/15 p-1.5">
            <GitMerge size={14} className="text-primary" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            {isLoading ? (
              <div className="h-6 w-10 bg-muted/40 rounded animate-pulse mt-0.5" />
            ) : (
              <p className="font-display text-2xl font-bold text-foreground leading-tight">
                {value.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Breakdown by type ----
function BreakdownSection() {
  const { data: stats, isLoading } = useCorrelationStats();
  return (
    <section data-ocid="correlation.breakdown.section">
      <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
        Incident Type Breakdown
      </h2>
      <div className="bg-card border border-border rounded-md overflow-hidden">
        {isLoading ? (
          <div
            data-ocid="correlation.breakdown.loading_state"
            className="p-4 space-y-2"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 flex-1 bg-muted/40 rounded animate-pulse" />
                <div className="h-3 w-8 bg-muted/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : !stats || stats.byType.length === 0 ? (
          <div
            data-ocid="correlation.breakdown.empty_state"
            className="py-8 text-center"
          >
            <p className="font-mono text-xs text-muted-foreground">
              No incidents detected yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {stats.byType.map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {type}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-foreground bg-primary/10 border border-primary/30 rounded px-2 py-0.5">
                  {Number(count).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---- Live feed table ----
function IncidentFeedTable({
  onSelect,
}: {
  onSelect: (incident: CorrelatedIncident) => void;
}) {
  const { data: rows, isLoading } = useCorrelatedIncidents(20);
  return (
    <section data-ocid="correlation.feed.section">
      <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
        Live Incident Feed (Latest 20)
      </h2>
      <div className="bg-card border border-border rounded-md overflow-hidden">
        {isLoading ? (
          <div
            data-ocid="correlation.feed.loading_state"
            className="p-4 space-y-2"
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-3 w-32 bg-muted/40 rounded" />
                <div className="h-3 w-16 bg-muted/30 rounded" />
                <div className="h-3 flex-1 bg-muted/20 rounded" />
              </div>
            ))}
          </div>
        ) : !rows || rows.length === 0 ? (
          <div
            data-ocid="correlation.feed.empty_state"
            className="py-12 text-center space-y-2"
          >
            <GitMerge size={28} className="mx-auto text-muted-foreground/40" />
            <p className="font-mono text-xs text-muted-foreground">
              No correlated incidents yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
                    Incident Type
                  </th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-24">
                    Severity
                  </th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-28">
                    Status
                  </th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-28">
                    Providers
                  </th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-32">
                    Source IP
                  </th>
                  <th className="text-right py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-24">
                    Delta
                  </th>
                  <th className="text-right py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-32">
                    Detected At
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([, incident], idx) => (
                  <tr
                    key={incident.incidentId}
                    data-ocid={`correlation.feed.item.${idx + 1}`}
                    onClick={() => onSelect(incident)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onSelect(incident);
                    }}
                    tabIndex={0}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                          {incident.incidentType}
                        </span>
                        <ChevronRight
                          size={10}
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <SeverityBadge severity={incident.severity} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusPill status={incident.status} />
                    </td>
                    <td className="py-2.5 px-3">
                      <ProviderPills providers={incident.sourceProviders} />
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {incident.sourceIp ?? "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-foreground font-semibold">
                        {incident.timeDeltaMinutes} min
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground">
                      {formatTs(incident.detectedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

// ---- Main Page ----
export default function CorrelationPage() {
  const [selectedIncident, setSelectedIncident] =
    useState<CorrelatedIncident | null>(null);

  return (
    <Layout>
      <div data-ocid="correlation.page" className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link
                to="/"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight size={10} className="text-muted-foreground" />
              <span className="font-mono text-xs text-foreground">
                Correlation Engine
              </span>
            </div>
            <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
              Correlation Engine
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5 font-mono">
              Cross-cloud attack pattern detection and incident correlation
            </p>
          </div>
        </div>

        {/* Stats row */}
        <StatsRow />

        {/* Breakdown by type */}
        <BreakdownSection />

        {/* Live feed */}
        <IncidentFeedTable onSelect={setSelectedIncident} />

        {/* Detail modal */}
        {selectedIncident && (
          <IncidentDetailModal
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
          />
        )}
      </div>
    </Layout>
  );
}
