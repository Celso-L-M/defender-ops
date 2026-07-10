import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProviderFilter } from "../contexts/provider-filter";
import { useNormalizedAlerts } from "../hooks/use-backend";
import type { NormalizedAlert, Severity } from "../types";
import { ProviderIcon } from "./ProviderIcon";
import { SeverityBadge } from "./SeverityBadge";

// ── helpers ──────────────────────────────────────────────────────────────────

function relativeTime(tsNs: bigint): string {
  const tsMs = Number(tsNs / 1_000_000n);
  const diffS = Math.floor((Date.now() - tsMs) / 1000);
  if (diffS < 60) return "just now";
  if (diffS < 3600) return `${Math.floor(diffS / 60)} minutes ago`;
  if (diffS < 86400) return `${Math.floor(diffS / 3600)} hours ago`;
  return new Date(tsMs).toLocaleDateString();
}

const SEVERITY_BORDER: Record<Severity, string> = {
  Critical: "border-l-red-500",
  High: "border-l-orange-500",
  Medium: "border-l-yellow-500",
  Low: "border-l-blue-500",
  Unknown: "border-l-border",
};

type SeverityFilter = "All" | "Critical" | "High" | "Medium" | "Low";
type StatusFilter = "All" | "Open" | "InProgress" | "Resolved";

// ── detail panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  alert: NormalizedAlert | null;
  onClose: () => void;
}

function DetailPanel({ alert, onClose }: DetailPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (alert) {
      dlg.show();
    } else {
      dlg.close();
    }
  }, [alert]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    dlg.addEventListener("keydown", handleKey);
    return () => dlg.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const tsMs = alert ? Number(alert.timestamp / 1_000_000n) : 0;
  const isoTimestamp = alert ? new Date(tsMs).toISOString() : "";

  return (
    <dialog
      ref={dialogRef}
      data-ocid="security_feed.dialog"
      style={{
        position: "fixed",
        inset: "auto",
        right: 0,
        top: 0,
        height: "100dvh",
        width: "384px",
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        className="flex h-full w-full flex-col overflow-hidden border-l bg-[#1a1d27]"
        style={{ borderColor: "#2a2d3e" }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "#2a2d3e" }}
        >
          <h2 className="font-display font-semibold text-foreground">
            Alert Detail
          </h2>
          <button
            type="button"
            data-ocid="security_feed.close_button"
            aria-label="Close detail panel"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* body */}
        {alert && (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Title
              </p>
              <p className="font-medium text-foreground leading-snug">
                {alert.title}
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Severity
                </p>
                <SeverityBadge severity={alert.severity} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Provider
                </p>
                <ProviderIcon provider={alert.provider} showLabel />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Status
                </p>
                <span className="font-mono text-xs text-foreground">
                  {alert.status}
                </span>
              </div>
            </div>

            {alert.description && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  {alert.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Alert ID
                </p>
                <p className="font-mono text-xs text-foreground break-all">
                  {alert.id}
                </p>
              </div>
              {alert.assetId && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Asset ID
                  </p>
                  <p className="font-mono text-xs text-foreground break-all">
                    {alert.assetId}
                  </p>
                </div>
              )}
              {alert.accountId && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Account
                  </p>
                  <p className="font-mono text-xs text-foreground">
                    {alert.accountId}
                  </p>
                </div>
              )}
              {alert.region && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Region
                  </p>
                  <p className="font-mono text-xs text-foreground">
                    {alert.region}
                  </p>
                </div>
              )}
            </div>

            {alert.mitre && (
              <div
                className="rounded-lg border p-3 space-y-1"
                style={{ borderColor: "#2a2d3e", background: "#0f1117" }}
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  MITRE ATT&amp;CK
                </p>
                <p className="text-xs text-foreground">
                  <span className="text-muted-foreground">Tactic:</span>{" "}
                  <span className="font-medium">{alert.mitre.tactic}</span>
                </p>
                <p className="text-xs text-foreground">
                  <span className="text-muted-foreground">Technique:</span>{" "}
                  <span className="font-medium">{alert.mitre.technique}</span>{" "}
                  <span className="font-mono text-muted-foreground">
                    ({alert.mitre.techniqueId})
                  </span>
                </p>
              </div>
            )}

            {alert.ingestionSource && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Ingestion Source
                </p>
                <p className="font-mono text-xs text-foreground capitalize">
                  {alert.ingestionSource}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Timestamp
              </p>
              <p className="font-mono text-xs text-foreground">
                {isoTimestamp}
              </p>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function SecurityEventFeed() {
  const { selectedProvider } = useProviderFilter();
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<NormalizedAlert | null>(
    null,
  );
  const prevIdsRef = useRef<Set<string>>(new Set());
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  const query = useNormalizedAlerts({
    customer: "",
    limit: 50,
    ...(selectedProvider ? { provider: selectedProvider } : {}),
  });

  // 15s polling — guard prevents stacking when canister call is slow
  const fetchingRef = useRef(false);
  useEffect(() => {
    const id = setInterval(async () => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        await query.refetch();
      } finally {
        fetchingRef.current = false;
      }
    }, 15_000);
    return () => clearInterval(id);
  }, [query.refetch]);

  // track new IDs for flash animation
  useEffect(() => {
    const alerts = query.data ?? [];
    const currentIds = new Set(alerts.map((a) => a.id));
    const incoming = new Set<string>();
    for (const id of currentIds) {
      if (!prevIdsRef.current.has(id)) incoming.add(id);
    }
    if (incoming.size > 0) {
      setNewIds(incoming);
      const timer = setTimeout(() => setNewIds(new Set()), 2500);
      prevIdsRef.current = currentIds;
      return () => clearTimeout(timer);
    }
    prevIdsRef.current = currentIds;
  }, [query.data]);

  const filtered = useMemo(() => {
    const alerts = query.data ?? [];
    return alerts.filter((a) => {
      if (severityFilter !== "All" && a.severity !== severityFilter)
        return false;
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [
          a.title,
          a.assetId ?? "",
          a.region ?? "",
          a.provider,
          a.description,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query.data, severityFilter, statusFilter, search]);

  const severityOptions: SeverityFilter[] = [
    "All",
    "Critical",
    "High",
    "Medium",
    "Low",
  ];
  const statusOptions: StatusFilter[] = [
    "All",
    "Open",
    "InProgress",
    "Resolved",
  ];

  return (
    <>
      <div
        data-ocid="security_feed.panel"
        className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl overflow-hidden"
      >
        {/* card header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "#2a2d3e" }}
        >
          <h3 className="font-display font-semibold text-foreground text-sm tracking-wide">
            Security Event Feed
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            {filtered.length} of {query.data?.length ?? 0} events
          </span>
        </div>

        {/* filter bar */}
        <div
          className="flex flex-wrap gap-2 px-4 py-3 border-b"
          style={{ borderColor: "#2a2d3e" }}
        >
          <input
            type="search"
            data-ocid="security_feed.search_input"
            placeholder="Search alerts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 min-w-0 flex-1 rounded border bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ borderColor: "#2a2d3e" }}
          />

          <div className="flex gap-1">
            {severityOptions.map((s) => (
              <button
                key={s}
                type="button"
                data-ocid={`security_feed.severity_filter.${s.toLowerCase()}`}
                onClick={() => setSeverityFilter(s)}
                className={`rounded px-2 py-1 text-xs font-medium transition ${
                  severityFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            {statusOptions.map((s) => (
              <button
                key={s}
                type="button"
                data-ocid={`security_feed.status_filter.${s.toLowerCase()}`}
                onClick={() => setStatusFilter(s)}
                className={`rounded px-2 py-1 text-xs font-medium transition ${
                  statusFilter === s
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {s === "InProgress" ? "In Progress" : s}
              </button>
            ))}
          </div>
        </div>

        {/* event list */}
        <div
          data-ocid="security_feed.list"
          className="max-h-[600px] overflow-y-auto divide-y"
          style={{ borderColor: "#2a2d3e" }}
        >
          {query.isLoading && (
            <div
              data-ocid="security_feed.loading_state"
              className="flex items-center justify-center py-10"
            >
              <span className="text-sm text-muted-foreground">
                Loading events…
              </span>
            </div>
          )}

          {!query.isLoading && filtered.length === 0 && (
            <div
              data-ocid="security_feed.empty_state"
              className="flex flex-col items-center justify-center py-10 gap-2"
            >
              <span className="text-sm text-muted-foreground">
                No events match your filters.
              </span>
            </div>
          )}

          {filtered.map((alert, i) => {
            const isNew = newIds.has(alert.id);
            return (
              <button
                key={alert.id}
                type="button"
                data-ocid={`security_feed.item.${i + 1}`}
                onClick={() => setSelectedAlert(alert)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedAlert(alert)}
                className={`w-full text-left flex items-center gap-3 border-l-4 py-3 px-4 hover:bg-white/5 transition cursor-pointer ${
                  SEVERITY_BORDER[alert.severity] ?? "border-l-border"
                } feed-entry-new`}
                style={
                  isNew
                    ? { animation: "feedFlash 2s ease-out forwards" }
                    : undefined
                }
              >
                {/* severity badge */}
                <SeverityBadge severity={alert.severity} />

                {/* title + asset */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-xs truncate">
                    {alert.title}
                  </p>
                  {alert.assetId && (
                    <p className="font-mono text-xs text-muted-foreground truncate mt-0.5">
                      {alert.assetId}
                    </p>
                  )}
                </div>

                {/* provider */}
                <ProviderIcon provider={alert.provider} showLabel={false} />

                {/* region */}
                {alert.region && (
                  <span className="hidden sm:block font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {alert.region}
                  </span>
                )}

                {/* timestamp */}
                <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {relativeTime(alert.timestamp)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <DetailPanel
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </>
  );
}
