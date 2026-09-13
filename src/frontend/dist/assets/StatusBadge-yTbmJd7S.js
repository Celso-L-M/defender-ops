import { c as createLucideIcon, y as useCorrelatedIncidents, z as useAlertsForCorrelation, l as useNormalizedAlerts } from "./use-backend-qlJEk42r.js";
import { r as reactExports, j as jsxRuntimeExports } from "./index-CmSiIXAi.js";
import { P as ProviderIcon } from "./ProviderIcon-DuMT2Dc6.js";
import { S as SeverityBadge } from "./SeverityBadge-D7ODbawO.js";
import { B as Badge } from "./badge-Bo6CR9TA.js";
import { S as Skeleton } from "./skeleton-BifbNGmV.js";
import { u as useProviderFilter, a as ChevronRight } from "./Layout-DSnUumzH.js";
import { T as TriangleAlert } from "./triangle-alert-DRRWC2_-.js";
import { a as Shield } from "./shield-tKdJ0jHt.js";
import { C as Clock } from "./clock-BLG7MSKO.js";
import { X } from "./x-BfFmw1gQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5", key: "1uzm8b" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const SquareCheckBig = createLucideIcon("square-check-big", __iconNode);
function relativeTime$1(ns) {
  const ms = Number(ns / 1000000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function formatDate(ns) {
  return new Date(Number(ns / 1000000n)).toLocaleString();
}
function incidentTypeBadge(type) {
  const isBruteForce = type.toLowerCase().includes("brute") || type.toLowerCase().includes("iam");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide border ${isBruteForce ? "bg-destructive/20 border-destructive text-destructive" : "bg-orange-500/20 border-orange-500 text-orange-400"}`,
      children: type
    }
  );
}
function IncidentDetailDialog({
  incident,
  onClose
}) {
  const dialogRef = reactExports.useRef(null);
  const { data: alerts = [], isLoading } = useAlertsForCorrelation(
    incident.sourceAlerts
  );
  reactExports.useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    dlg.showModal();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (dlg.open) dlg.close();
    };
  }, [onClose]);
  const sorted = [...alerts].sort((a, b) => Number(a.timestamp - b.timestamp));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      ref: dialogRef,
      "data-ocid": "incident.dialog",
      className: "fixed inset-0 z-50 m-auto w-full max-w-4xl max-h-[90vh] rounded-xl border border-[#2a2d3e] bg-[#1a1d27] p-0 shadow-2xl overflow-hidden backdrop:bg-black/60 open:flex open:flex-col",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between border-b border-[#2a2d3e] px-6 py-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              incidentTypeBadge(incident.incidentType),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: incident.severity }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
                "#",
                incident.incidentId.slice(0, 8)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "Detected ",
              relativeTime$1(incident.detectedAt),
              " ·",
              " ",
              formatDate(incident.detectedAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "incident.close_button",
              onClick: onClose,
              className: "rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors",
              "aria-label": "Close dialog",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-y-auto flex-1 px-6 py-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetaField, { label: "Status", value: incident.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MetaField,
              {
                label: "Providers",
                value: incident.sourceProviders.join(", ")
              }
            ),
            incident.sourceIp && /* @__PURE__ */ jsxRuntimeExports.jsx(MetaField, { label: "Source IP", value: incident.sourceIp, mono: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MetaField,
              {
                label: "Time Delta",
                value: `${incident.timeDeltaMinutes} min apart`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MetaField,
              {
                label: "Correlation Window",
                value: `${incident.correlationWindowMinutes} min`
              }
            ),
            incident.assignedOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(MetaField, { label: "Owner", value: incident.assignedOwner }),
            incident.affectedResources.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Affected Resources" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: incident.affectedResources.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-mono bg-muted/20 border border-[#2a2d3e] rounded px-1.5 py-0.5",
                  children: r
                },
                r
              )) })
            ] }),
            incident.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: incident.notes })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3 text-foreground", children: "Event Timeline" }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EventTimeline, { alerts: sorted, incident })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3 text-foreground", children: "Source Alerts" }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" })
            ] }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No alert records found" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: sorted.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDetailCard, { alert }, alert.id)) })
          ] })
        ] })
      ]
    }
  );
}
function MetaField({
  label,
  value,
  mono = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium ${mono ? "font-mono" : ""}`, children: value })
  ] });
}
function EventTimeline({
  alerts,
  incident
}) {
  if (alerts.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0", children: incident.sourceProviders.map((prov, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-destructive mt-1 shrink-0" }),
        idx < incident.sourceProviders.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-px flex-1 bg-destructive/30 my-1",
            style: { minHeight: "28px" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
          prov,
          " Event"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Provider: ",
          prov
        ] })
      ] })
    ] }, prov)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", children: alerts.map((alert, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-destructive mt-1 shrink-0" }),
      idx < alerts.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-px flex-1 bg-destructive/30 my-1",
            style: { minHeight: "28px" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center my-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono bg-[#0f1117] px-1.5 rounded", children: [
          "+",
          incident.timeDeltaMinutes,
          "m"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-px flex-1 bg-destructive/30 my-1",
            style: { minHeight: "8px" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: alert.provider, showLabel: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: alert.severity })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mt-1 line-clamp-1", children: alert.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: relativeTime$1(alert.timestamp) })
    ] })
  ] }, alert.id)) });
}
function AlertDetailCard({ alert }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[#2a2d3e] bg-[#0f1117] p-4 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: alert.provider, showLabel: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: alert.severity })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground line-clamp-2", children: alert.title }),
    alert.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-3", children: alert.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 pt-1", children: [
      alert.assetId && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertRow, { label: "Resource", value: alert.assetId, mono: true }),
      alert.region && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertRow, { label: "Region", value: alert.region }),
      alert.accountId && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertRow, { label: "Account", value: alert.accountId, mono: true }),
      alert.mitre && /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertRow,
        {
          label: "MITRE",
          value: `${alert.mitre.tactic} · ${alert.mitre.technique}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertRow, { label: "Time", value: relativeTime$1(alert.timestamp) })
    ] })
  ] });
}
function AlertRow({
  label,
  value,
  mono = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `text-xs font-medium truncate max-w-[60%] text-right ${mono ? "font-mono" : ""}`,
        children: value
      }
    )
  ] });
}
const IncidentCard = reactExports.memo(function IncidentCard2({
  incident,
  index,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      "data-ocid": `incidents.item.${index + 1}`,
      onClick,
      className: "w-full text-left bg-[#1a1d27] border border-[#2a2d3e] rounded-xl p-4 cursor-pointer hover:border-red-500/50 transition-all duration-200",
      style: incident.severity === "Critical" ? { animation: "criticalPulse 2.5s ease-in-out infinite" } : {},
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            incidentTypeBadge(incident.incidentType),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: incident.severity })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 flex-wrap", children: incident.sourceProviders.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProviderIcon,
            {
              provider: p,
              showLabel: true
            },
            p
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
            incident.sourceIp && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground bg-muted/10 rounded px-1.5 py-0.5", children: incident.sourceIp }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
              incident.timeDeltaMinutes,
              " min apart"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: relativeTime$1(incident.detectedAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-muted-foreground" })
        ] })
      ] })
    }
  );
});
function CorrelatedIncidentsPanel() {
  const [selectedIncident, setSelectedIncident] = reactExports.useState(null);
  const { selectedProvider } = useProviderFilter();
  const { data: rawIncidents = [], isLoading } = useCorrelatedIncidents(20);
  const incidents = rawIncidents.map(([, inc]) => inc);
  const filtered = selectedProvider ? incidents.filter((inc) => inc.sourceProviders.includes(selectedProvider)) : incidents;
  const todayCount = filtered.filter((inc) => {
    const ms = Number(inc.detectedAt / 1000000n);
    const now = Date.now();
    return now - ms < 864e5;
  }).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "data-ocid": "incidents.section",
      className: "rounded-xl border border-[#2a2d3e] bg-[#1a1d27] overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-[#2a2d3e]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16, className: "text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Correlated Incidents" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                todayCount,
                " active today"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-xs font-mono border-[#2a2d3e] text-muted-foreground",
              children: filtered.length
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" })
        ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "incidents.empty_state",
            className: "flex flex-col items-center justify-center py-12 gap-3 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted/20 border border-[#2a2d3e] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24, className: "text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No correlated incidents detected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: selectedProvider ? `No incidents involving ${selectedProvider}` : "Cross-cloud attack patterns will appear here" })
            ]
          }
        ) : filtered.map((incident, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          IncidentCard,
          {
            incident,
            index: idx,
            onClick: () => setSelectedIncident(incident)
          },
          incident.incidentId
        )) }),
        selectedIncident && /* @__PURE__ */ jsxRuntimeExports.jsx(
          IncidentDetailDialog,
          {
            incident: selectedIncident,
            onClose: () => setSelectedIncident(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes criticalPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          50% { box-shadow: 0 0 14px 4px rgba(239,68,68,0.4); }
        }
      ` })
      ]
    }
  );
}
function relativeTime(tsNs) {
  const tsMs = Number(tsNs / 1000000n);
  const diffS = Math.floor((Date.now() - tsMs) / 1e3);
  if (diffS < 60) return "just now";
  if (diffS < 3600) return `${Math.floor(diffS / 60)} minutes ago`;
  if (diffS < 86400) return `${Math.floor(diffS / 3600)} hours ago`;
  return new Date(tsMs).toLocaleDateString();
}
const SEVERITY_BORDER = {
  Critical: "border-l-red-500",
  High: "border-l-orange-500",
  Medium: "border-l-yellow-500",
  Low: "border-l-blue-500",
  Unknown: "border-l-border"
};
function DetailPanel({ alert, onClose }) {
  const dialogRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (alert) {
      dlg.show();
    } else {
      dlg.close();
    }
  }, [alert]);
  reactExports.useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    dlg.addEventListener("keydown", handleKey);
    return () => dlg.removeEventListener("keydown", handleKey);
  }, [onClose]);
  const tsMs = alert ? Number(alert.timestamp / 1000000n) : 0;
  const isoTimestamp = alert ? new Date(tsMs).toISOString() : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "dialog",
    {
      ref: dialogRef,
      "data-ocid": "security_feed.dialog",
      style: {
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
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex h-full w-full flex-col overflow-hidden border-l bg-[#1a1d27]",
          style: { borderColor: "#2a2d3e" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between border-b px-5 py-4",
                style: { borderColor: "#2a2d3e" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Alert Detail" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "security_feed.close_button",
                      "aria-label": "Close detail panel",
                      onClick: onClose,
                      className: "rounded p-1 text-muted-foreground transition hover:bg-white/10 hover:text-foreground",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                    }
                  )
                ]
              }
            ),
            alert && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-4 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground leading-snug", children: alert.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Severity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: alert.severity })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Provider" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: alert.provider, showLabel: true })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: alert.status })
                ] })
              ] }),
              alert.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed text-xs", children: alert.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Alert ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground break-all", children: alert.id })
                ] }),
                alert.assetId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Asset ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground break-all", children: alert.assetId })
                ] }),
                alert.accountId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Account" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground", children: alert.accountId })
                ] }),
                alert.region && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Region" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground", children: alert.region })
                ] })
              ] }),
              alert.mitre && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg border p-3 space-y-1",
                  style: { borderColor: "#2a2d3e", background: "#0f1117" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-2", children: "MITRE ATT&CK" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tactic:" }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: alert.mitre.tactic })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Technique:" }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: alert.mitre.technique }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground", children: [
                        "(",
                        alert.mitre.techniqueId,
                        ")"
                      ] })
                    ] })
                  ]
                }
              ),
              alert.ingestionSource && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Ingestion Source" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground capitalize", children: alert.ingestionSource })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Timestamp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground", children: isoTimestamp })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function SecurityEventFeed() {
  var _a;
  const { selectedProvider } = useProviderFilter();
  const [severityFilter, setSeverityFilter] = reactExports.useState("All");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [search, setSearch] = reactExports.useState("");
  const [selectedAlert, setSelectedAlert] = reactExports.useState(
    null
  );
  const prevIdsRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const [newIds, setNewIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const query = useNormalizedAlerts({
    customer: "",
    limit: 50,
    ...selectedProvider ? { provider: selectedProvider } : {}
  });
  const fetchingRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const id = setInterval(async () => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        await query.refetch();
      } finally {
        fetchingRef.current = false;
      }
    }, 15e3);
    return () => clearInterval(id);
  }, [query.refetch]);
  reactExports.useEffect(() => {
    const alerts = query.data ?? [];
    const currentIds = new Set(alerts.map((a) => a.id));
    const incoming = /* @__PURE__ */ new Set();
    for (const id of currentIds) {
      if (!prevIdsRef.current.has(id)) incoming.add(id);
    }
    if (incoming.size > 0) {
      setNewIds(incoming);
      const timer = setTimeout(() => setNewIds(/* @__PURE__ */ new Set()), 2500);
      prevIdsRef.current = currentIds;
      return () => clearTimeout(timer);
    }
    prevIdsRef.current = currentIds;
  }, [query.data]);
  const filtered = reactExports.useMemo(() => {
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
          a.description
        ].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query.data, severityFilter, statusFilter, search]);
  const severityOptions = [
    "All",
    "Critical",
    "High",
    "Medium",
    "Low"
  ];
  const statusOptions = [
    "All",
    "Open",
    "InProgress",
    "Resolved"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "security_feed.panel",
        className: "bg-[#1a1d27] border border-[#2a2d3e] rounded-xl overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-4 py-3 border-b",
              style: { borderColor: "#2a2d3e" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm tracking-wide", children: "Security Event Feed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                  filtered.length,
                  " of ",
                  ((_a = query.data) == null ? void 0 : _a.length) ?? 0,
                  " events"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-wrap gap-2 px-4 py-3 border-b",
              style: { borderColor: "#2a2d3e" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "search",
                    "data-ocid": "security_feed.search_input",
                    placeholder: "Search alerts…",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    className: "h-7 min-w-0 flex-1 rounded border bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary",
                    style: { borderColor: "#2a2d3e" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: severityOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `security_feed.severity_filter.${s.toLowerCase()}`,
                    onClick: () => setSeverityFilter(s),
                    className: `rounded px-2 py-1 text-xs font-medium transition ${severityFilter === s ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"}`,
                    children: s
                  },
                  s
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: statusOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `security_feed.status_filter.${s.toLowerCase()}`,
                    onClick: () => setStatusFilter(s),
                    className: `rounded px-2 py-1 text-xs font-medium transition ${statusFilter === s ? "bg-secondary text-secondary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"}`,
                    children: s === "InProgress" ? "In Progress" : s
                  },
                  s
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "security_feed.list",
              className: "max-h-[600px] overflow-y-auto divide-y",
              style: { borderColor: "#2a2d3e" },
              children: [
                query.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "security_feed.loading_state",
                    className: "flex items-center justify-center py-10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Loading events…" })
                  }
                ),
                !query.isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "security_feed.empty_state",
                    className: "flex flex-col items-center justify-center py-10 gap-2",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "No events match your filters." })
                  }
                ),
                filtered.map((alert, i) => {
                  const isNew = newIds.has(alert.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `security_feed.item.${i + 1}`,
                      onClick: () => setSelectedAlert(alert),
                      onKeyDown: (e) => e.key === "Enter" && setSelectedAlert(alert),
                      className: `w-full text-left flex items-center gap-3 border-l-4 py-3 px-4 hover:bg-white/5 transition cursor-pointer ${SEVERITY_BORDER[alert.severity] ?? "border-l-border"} feed-entry-new`,
                      style: isNew ? { animation: "feedFlash 2s ease-out forwards" } : void 0,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: alert.severity }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-xs truncate", children: alert.title }),
                          alert.assetId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground truncate mt-0.5", children: alert.assetId })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: alert.provider, showLabel: false }),
                        alert.region && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:block font-mono text-xs text-muted-foreground whitespace-nowrap", children: alert.region }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground whitespace-nowrap", children: relativeTime(alert.timestamp) })
                      ]
                    },
                    alert.id
                  );
                })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DetailPanel,
      {
        alert: selectedAlert,
        onClose: () => setSelectedAlert(null)
      }
    )
  ] });
}
const labelMap = {
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
  inactive: "Inactive"
};
function StatusBadge({ status }) {
  const cls = status === "connected" ? "badge-status-connected" : status === "error" ? "badge-status-error" : status === "disconnected" ? "badge-status-warning" : "badge-status-inactive";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, children: labelMap[status] });
}
export {
  CorrelatedIncidentsPanel as C,
  StatusBadge as S,
  SquareCheckBig as a,
  SecurityEventFeed as b
};
