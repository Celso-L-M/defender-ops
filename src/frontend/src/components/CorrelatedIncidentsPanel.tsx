import { ProviderIcon } from "@/components/ProviderIcon";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProviderFilter } from "@/contexts/provider-filter";
import {
  useAlertsForCorrelation,
  useCorrelatedIncidents,
} from "@/hooks/use-backend";
import { AlertTriangle, ChevronRight, Clock, Shield, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import type { CorrelatedIncident, NormalizedAlert } from "../types";

/* ── helpers ── */
function relativeTime(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns / 1_000_000n)).toLocaleString();
}

function incidentTypeBadge(type: string) {
  const isBruteForce =
    type.toLowerCase().includes("brute") || type.toLowerCase().includes("iam");
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide border ${
        isBruteForce
          ? "bg-destructive/20 border-destructive text-destructive"
          : "bg-orange-500/20 border-orange-500 text-orange-400"
      }`}
    >
      {type}
    </span>
  );
}

/* ── detail dialog ── */
function IncidentDetailDialog({
  incident,
  onClose,
}: {
  incident: CorrelatedIncident;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data: alerts = [], isLoading } = useAlertsForCorrelation(
    incident.sourceAlerts,
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    dlg.showModal();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (dlg.open) dlg.close();
    };
  }, [onClose]);

  const sorted = [...alerts].sort((a, b) => Number(a.timestamp - b.timestamp));

  return (
    <dialog
      ref={dialogRef}
      data-ocid="incident.dialog"
      className="fixed inset-0 z-50 m-auto w-full max-w-4xl max-h-[90vh] rounded-xl border border-[#2a2d3e] bg-[#1a1d27] p-0 shadow-2xl overflow-hidden backdrop:bg-black/60 open:flex open:flex-col"
    >
      {/* header */}
      <div className="flex items-start justify-between border-b border-[#2a2d3e] px-6 py-4 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            {incidentTypeBadge(incident.incidentType)}
            <SeverityBadge severity={incident.severity} />
            <span className="text-xs font-mono text-muted-foreground">
              #{incident.incidentId.slice(0, 8)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Detected {relativeTime(incident.detectedAt)} ·{" "}
            {formatDate(incident.detectedAt)}
          </p>
        </div>
        <button
          type="button"
          data-ocid="incident.close_button"
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
        {/* meta fields */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm">
          <MetaField label="Status" value={incident.status} />
          <MetaField
            label="Providers"
            value={incident.sourceProviders.join(", ")}
          />
          {incident.sourceIp && (
            <MetaField label="Source IP" value={incident.sourceIp} mono />
          )}
          <MetaField
            label="Time Delta"
            value={`${incident.timeDeltaMinutes} min apart`}
          />
          <MetaField
            label="Correlation Window"
            value={`${incident.correlationWindowMinutes} min`}
          />
          {incident.assignedOwner && (
            <MetaField label="Owner" value={incident.assignedOwner} />
          )}
          {incident.affectedResources.length > 0 && (
            <div className="col-span-full">
              <p className="text-xs text-muted-foreground mb-1">
                Affected Resources
              </p>
              <div className="flex flex-wrap gap-1">
                {incident.affectedResources.map((r) => (
                  <span
                    key={r}
                    className="text-xs font-mono bg-muted/20 border border-[#2a2d3e] rounded px-1.5 py-0.5"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
          {incident.notes && (
            <div className="col-span-full">
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground">{incident.notes}</p>
            </div>
          )}
        </div>

        {/* timeline */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">
            Event Timeline
          </h3>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <EventTimeline alerts={sorted} incident={incident} />
          )}
        </div>

        {/* side-by-side alerts */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">
            Source Alerts
          </h3>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No alert records found
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sorted.map((alert) => (
                <AlertDetailCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

function MetaField({
  label,
  value,
  mono = false,
}: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function EventTimeline({
  alerts,
  incident,
}: { alerts: NormalizedAlert[]; incident: CorrelatedIncident }) {
  if (alerts.length === 0) {
    /* fallback from incident metadata */
    return (
      <div className="flex flex-col gap-0">
        {incident.sourceProviders.map((prov, idx) => (
          <div key={prov} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-destructive mt-1 shrink-0" />
              {idx < incident.sourceProviders.length - 1 && (
                <div
                  className="w-px flex-1 bg-destructive/30 my-1"
                  style={{ minHeight: "28px" }}
                />
              )}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium text-foreground">
                {prov} Event
              </p>
              <p className="text-xs text-muted-foreground">Provider: {prov}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {alerts.map((alert, idx) => (
        <div key={alert.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-destructive mt-1 shrink-0" />
            {idx < alerts.length - 1 && (
              <>
                <div
                  className="w-px flex-1 bg-destructive/30 my-1"
                  style={{ minHeight: "28px" }}
                />
                <div className="flex items-center justify-center my-1">
                  <span className="text-xs text-muted-foreground font-mono bg-[#0f1117] px-1.5 rounded">
                    +{incident.timeDeltaMinutes}m
                  </span>
                </div>
                <div
                  className="w-px flex-1 bg-destructive/30 my-1"
                  style={{ minHeight: "8px" }}
                />
              </>
            )}
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <ProviderIcon provider={alert.provider} showLabel />
              <SeverityBadge severity={alert.severity} />
            </div>
            <p className="text-sm font-medium mt-1 line-clamp-1">
              {alert.title}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {relativeTime(alert.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertDetailCard({ alert }: { alert: NormalizedAlert }) {
  return (
    <div className="rounded-lg border border-[#2a2d3e] bg-[#0f1117] p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <ProviderIcon provider={alert.provider} showLabel />
        <SeverityBadge severity={alert.severity} />
      </div>
      <p className="text-sm font-semibold text-foreground line-clamp-2">
        {alert.title}
      </p>
      {alert.description && (
        <p className="text-xs text-muted-foreground line-clamp-3">
          {alert.description}
        </p>
      )}
      <div className="space-y-1 pt-1">
        {alert.assetId && (
          <AlertRow label="Resource" value={alert.assetId} mono />
        )}
        {alert.region && <AlertRow label="Region" value={alert.region} />}
        {alert.accountId && (
          <AlertRow label="Account" value={alert.accountId} mono />
        )}
        {alert.mitre && (
          <AlertRow
            label="MITRE"
            value={`${alert.mitre.tactic} · ${alert.mitre.technique}`}
          />
        )}
        <AlertRow label="Time" value={relativeTime(alert.timestamp)} />
      </div>
    </div>
  );
}

function AlertRow({
  label,
  value,
  mono = false,
}: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span
        className={`text-xs font-medium truncate max-w-[60%] text-right ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ── incident card ── */
const IncidentCard = memo(function IncidentCard({
  incident,
  index,
  onClick,
}: {
  incident: CorrelatedIncident;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`incidents.item.${index + 1}`}
      onClick={onClick}
      className="w-full text-left bg-[#1a1d27] border border-[#2a2d3e] rounded-xl p-4 cursor-pointer hover:border-red-500/50 transition-all duration-200"
      style={
        incident.severity === "Critical"
          ? { animation: "criticalPulse 2.5s ease-in-out infinite" }
          : {}
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {incidentTypeBadge(incident.incidentType)}
            <SeverityBadge severity={incident.severity} />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {incident.sourceProviders.map((p) => (
              <ProviderIcon
                key={p}
                provider={p as "AWS" | "Azure" | "GCP"}
                showLabel
              />
            ))}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {incident.sourceIp && (
              <span className="text-xs font-mono text-muted-foreground bg-muted/10 rounded px-1.5 py-0.5">
                {incident.sourceIp}
              </span>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={10} />
              {incident.timeDeltaMinutes} min apart
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {relativeTime(incident.detectedAt)}
          </span>
          <ChevronRight size={14} className="text-muted-foreground" />
        </div>
      </div>
    </button>
  );
});

/* ── main panel ── */
export function CorrelatedIncidentsPanel() {
  const [selectedIncident, setSelectedIncident] =
    useState<CorrelatedIncident | null>(null);
  const { selectedProvider } = useProviderFilter();

  const { data: rawIncidents = [], isLoading } = useCorrelatedIncidents(20);

  const incidents: CorrelatedIncident[] = rawIncidents.map(([, inc]) => inc);

  const filtered = selectedProvider
    ? incidents.filter((inc) => inc.sourceProviders.includes(selectedProvider))
    : incidents;

  const todayCount = filtered.filter((inc) => {
    const ms = Number(inc.detectedAt / 1_000_000n);
    const now = Date.now();
    return now - ms < 86_400_000;
  }).length;

  return (
    <section
      data-ocid="incidents.section"
      className="rounded-xl border border-[#2a2d3e] bg-[#1a1d27] overflow-hidden"
    >
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center justify-center">
            <AlertTriangle size={16} className="text-destructive" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Correlated Incidents
            </h2>
            <p className="text-xs text-muted-foreground">
              {todayCount} active today
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-xs font-mono border-[#2a2d3e] text-muted-foreground"
        >
          {filtered.length}
        </Badge>
      </div>

      {/* body */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="incidents.empty_state"
            className="flex flex-col items-center justify-center py-12 gap-3 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-muted/20 border border-[#2a2d3e] flex items-center justify-center">
              <Shield size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No correlated incidents detected
            </p>
            <p className="text-xs text-muted-foreground/60">
              {selectedProvider
                ? `No incidents involving ${selectedProvider}`
                : "Cross-cloud attack patterns will appear here"}
            </p>
          </div>
        ) : (
          filtered.map((incident, idx) => (
            <IncidentCard
              key={incident.incidentId}
              incident={incident}
              index={idx}
              onClick={() => setSelectedIncident(incident)}
            />
          ))
        )}
      </div>

      {/* detail dialog */}
      {selectedIncident && (
        <IncidentDetailDialog
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {/* pulse keyframe injected via style tag */}
      <style>{`
        @keyframes criticalPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          50% { box-shadow: 0 0 14px 4px rgba(239,68,68,0.4); }
        }
      `}</style>
    </section>
  );
}
