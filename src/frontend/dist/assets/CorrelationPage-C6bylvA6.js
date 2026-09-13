import { r as reactExports, j as jsxRuntimeExports, f as Link, L as LoadingSpinner } from "./index-UYuukFCx.js";
import { L as Layout, a as ChevronRight, G as GitMerge } from "./Layout-BvE-Qw_4.js";
import { S as SeverityBadge } from "./SeverityBadge-4N8MxJeJ.js";
import { E as useSeedAndTestCorrelation, F as useCorrelationStats, G as useCorrelatedIncidents, H as useAlertsForCorrelation, I as useUpdateCorrelatedIncidentStatus } from "./use-backend-BAJo2v8R.js";
import { X } from "./x-BGu0unbn.js";
import { T as TriangleAlert } from "./triangle-alert-C1ijdifN.js";
import { A as ArrowRight } from "./arrow-right-CJrI5ete.js";
import "./shield-BzxXQzBz.js";
import "./shield-check-BrQcTxD_.js";
import "./search-Scg-sHEq.js";
function formatTs(ns) {
  if (!ns) return "—";
  return new Date(Number(ns) / 1e6).toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function StatusPill({ status }) {
  const map = {
    Open: "bg-destructive/15 border border-destructive/60 text-destructive",
    Investigating: "bg-warning/15 border border-warning/60 text-warning",
    Resolved: "bg-primary/15 border border-primary/60 text-primary"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${map[status] ?? "bg-muted/30 border border-border text-muted-foreground"}`,
      children: status
    }
  );
}
function ProviderPills({ providers }) {
  const colors = {
    AWS: "text-orange-400 border-orange-400/40 bg-orange-400/10",
    Azure: "text-blue-400 border-blue-400/40 bg-blue-400/10",
    GCP: "text-green-400 border-green-400/40 bg-green-400/10"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-wrap", children: providers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold border ${colors[p] ?? "text-muted-foreground border-border bg-muted/20"}`,
      children: p
    },
    p
  )) });
}
function CorrelationTimeline({
  incident,
  alerts
}) {
  if (alerts.length < 2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground py-4 text-center", children: "Awaiting alert data to render timeline…" });
  }
  const sorted = [...alerts].sort((a, b) => Number(a.timestamp - b.timestamp));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const deltaMin = incident.timeDeltaMinutes;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "correlation.detail.timeline",
      className: "mt-4 flex items-center gap-0",
      "aria-label": "Correlation timeline",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 bg-muted/20 border border-border rounded-md p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: first.provider }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate", children: first.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-1", children: formatTs(first.timestamp) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5 px-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-8 bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12, className: "text-muted-foreground shrink-0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-primary whitespace-nowrap", children: [
            deltaMin,
            " min"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 bg-muted/20 border border-border rounded-md p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: last.provider }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate", children: last.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-1", children: formatTs(last.timestamp) })
        ] })
      ]
    }
  );
}
function AlertDetailCard({ alert }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border rounded-md p-3 space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: alert.severity }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: alert.provider })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: alert.title }),
    alert.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground line-clamp-2", children: alert.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-3 gap-y-0.5 font-mono text-[10px]", children: [
      alert.assetId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Resource" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground truncate", children: alert.assetId })
      ] }),
      alert.region && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Region" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: alert.region })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Time" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatTs(alert.timestamp) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: alert.status })
    ] })
  ] });
}
function IncidentDetailModal({
  incident,
  onClose
}) {
  const { data: sourceAlerts, isLoading: alertsLoading } = useAlertsForCorrelation(incident.sourceAlerts);
  const updateStatus = useUpdateCorrelatedIncidentStatus();
  const [selectedStatus, setSelectedStatus] = reactExports.useState(
    incident.status
  );
  const [owner, setOwner] = reactExports.useState(incident.assignedOwner ?? "");
  const [notes, setNotes] = reactExports.useState(incident.notes ?? "");
  const [saving, setSaving] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStatus.mutateAsync({
        id: incident.incidentId,
        status: selectedStatus,
        owner: owner || void 0,
        notes: notes || void 0
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "dialog",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 m-0 max-w-none max-h-none w-full h-full border-0 p-0",
      "data-ocid": "correlation.detail.dialog",
      "aria-labelledby": "incident-detail-title",
      open: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-auto",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 flex items-center justify-between bg-card border-b border-border px-5 py-3.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(GitMerge, { size: 16, className: "text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      id: "incident-detail-title",
                      className: "font-display font-bold text-sm text-foreground",
                      children: incident.incidentType
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground", children: incident.incidentId })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "correlation.detail.close_button",
                  onClick: onClose,
                  "aria-label": "Close",
                  className: "rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Incident Details" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border rounded-md p-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Severity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: incident.severity }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: incident.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Providers" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderPills, { providers: incident.sourceProviders }) }),
                  incident.sourceIp && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Source IP" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: incident.sourceIp })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Time Delta" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                    incident.timeDeltaMinutes,
                    " min"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Window" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                    Number(incident.correlationWindowMinutes),
                    " min"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Detected At" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatTs(incident.detectedAt) }),
                  incident.affectedResources.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground col-span-2 mt-1", children: "Affected Resources" }),
                    incident.affectedResources.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "col-span-2 text-foreground truncate",
                        children: [
                          "• ",
                          r
                        ]
                      },
                      r
                    ))
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Update" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        "data-ocid": "correlation.detail.status_select",
                        value: selectedStatus,
                        onChange: (e) => setSelectedStatus(e.target.value),
                        className: "w-full rounded-md border border-border bg-background text-foreground text-xs font-mono px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/60",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Open", children: "Open" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Investigating", children: "Investigating" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Resolved", children: "Resolved" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        "data-ocid": "correlation.detail.owner_input",
                        value: owner,
                        onChange: (e) => setOwner(e.target.value),
                        placeholder: "Assigned owner (optional)",
                        className: "w-full rounded-md border border-border bg-background text-foreground text-xs font-mono px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/60 placeholder:text-muted-foreground"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        "data-ocid": "correlation.detail.notes_textarea",
                        value: notes,
                        onChange: (e) => setNotes(e.target.value),
                        placeholder: "Notes (optional)",
                        rows: 2,
                        className: "w-full rounded-md border border-border bg-background text-foreground text-xs font-mono px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/60 placeholder:text-muted-foreground resize-none"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "correlation.detail.save_button",
                        disabled: saving,
                        onClick: handleSave,
                        className: "w-full flex items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-40",
                        children: saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Source Alerts" }),
                alertsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "correlation.detail.alerts_loading_state",
                    className: "flex justify-center py-8",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: 20 })
                  }
                ) : !sourceAlerts || sourceAlerts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "correlation.detail.alerts_empty_state",
                    className: "py-8 text-center",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No alert details found" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: sourceAlerts.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDetailCard, { alert }, alert.id)) }),
                !alertsLoading && sourceAlerts && sourceAlerts.length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: "Event Timeline" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CorrelationTimeline,
                    {
                      incident,
                      alerts: sourceAlerts
                    }
                  )
                ] })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function StatsRow() {
  const { data: stats, isLoading } = useCorrelationStats();
  const items = [
    {
      label: "Today",
      value: Number((stats == null ? void 0 : stats.totalToday) ?? 0n),
      ocid: "correlation.stats.today_card"
    },
    {
      label: "This Week",
      value: Number((stats == null ? void 0 : stats.totalThisWeek) ?? 0n),
      ocid: "correlation.stats.week_card"
    },
    {
      label: "All Time",
      value: Number((stats == null ? void 0 : stats.totalAllTime) ?? 0n),
      ocid: "correlation.stats.alltime_card"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "correlation.stats_row", className: "grid grid-cols-3 gap-3", children: items.map(({ label, value, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": ocid,
      className: "bg-card border border-border rounded-md p-3.5 flex items-start gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded bg-primary/15 p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GitMerge, { size: 14, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-10 bg-muted/40 rounded animate-pulse mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground leading-tight", children: value.toLocaleString() })
        ] })
      ]
    },
    label
  )) });
}
function BreakdownSection() {
  const { data: stats, isLoading } = useCorrelationStats();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "correlation.breakdown.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3", children: "Incident Type Breakdown" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-md overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "correlation.breakdown.loading_state",
        className: "p-4 space-y-2",
        children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 flex-1 bg-muted/40 rounded animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-8 bg-muted/30 rounded animate-pulse" })
        ] }, i))
      }
    ) : !stats || stats.byType.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "correlation.breakdown.empty_state",
        className: "py-8 text-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No incidents detected yet — run Test Correlation to seed data" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: stats.byType.map(([type, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-4 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: type })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-foreground bg-primary/10 border border-primary/30 rounded px-2 py-0.5", children: Number(count).toLocaleString() })
        ]
      },
      type
    )) }) })
  ] });
}
function IncidentFeedTable({
  onSelect
}) {
  const { data: rows, isLoading } = useCorrelatedIncidents(20);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "correlation.feed.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3", children: "Live Incident Feed (Latest 20)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-md overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "correlation.feed.loading_state",
        className: "p-4 space-y-2",
        children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-32 bg-muted/40 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-16 bg-muted/30 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 flex-1 bg-muted/20 rounded" })
        ] }, i))
      }
    ) : !rows || rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "correlation.feed.empty_state",
        className: "py-12 text-center space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GitMerge, { size: 28, className: "mx-auto text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No correlated incidents yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground/60", children: "Use the Test Correlation button to seed mock data and run the engine" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs font-mono", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]", children: "Incident Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-24", children: "Severity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-28", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-28", children: "Providers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-32", children: "Source IP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-24", children: "Delta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2.5 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-32", children: "Detected At" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map(([, incident], idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `correlation.feed.item.${idx + 1}`,
          onClick: () => onSelect(incident),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ")
              onSelect(incident);
          },
          tabIndex: 0,
          className: "border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium group-hover:text-primary transition-colors", children: incident.incidentType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronRight,
                {
                  size: 10,
                  className: "text-muted-foreground group-hover:text-primary transition-colors"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: incident.severity }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: incident.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderPills, { providers: incident.sourceProviders }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-muted-foreground", children: incident.sourceIp ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
              incident.timeDeltaMinutes,
              " min"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-right text-muted-foreground", children: formatTs(incident.detectedAt) })
          ]
        },
        incident.incidentId
      )) })
    ] }) }) })
  ] });
}
function TestResultBanner({
  incidents,
  onDismiss
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "correlation.test_result.success_state",
      className: "rounded-md border border-primary/50 bg-primary/10 px-4 py-3 flex items-start gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GitMerge, { size: 15, className: "text-primary shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-primary", children: [
            "Test complete — ",
            incidents.length,
            " correlated incident",
            incidents.length !== 1 ? "s" : "",
            " detected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1 space-y-0.5", children: incidents.map((inc, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "font-mono text-[11px] text-foreground",
              children: [
                "• ",
                inc.incidentType,
                " ",
                inc.sourceIp ? `(IP: ${inc.sourceIp})` : ""
              ]
            },
            inc.incidentId ?? i
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "correlation.test_result.close_button",
            onClick: onDismiss,
            "aria-label": "Dismiss",
            className: "text-muted-foreground hover:text-foreground transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
          }
        )
      ]
    }
  );
}
function TestErrorBanner({
  message,
  onDismiss
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "correlation.test_result.error_state",
      className: "rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 flex items-start gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 15, className: "text-destructive shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-sm text-destructive font-mono", children: message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "correlation.test_error.close_button",
            onClick: onDismiss,
            "aria-label": "Dismiss",
            className: "text-destructive/70 hover:text-destructive transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
          }
        )
      ]
    }
  );
}
function CorrelationPage() {
  const seedAndTest = useSeedAndTestCorrelation();
  const [selectedIncident, setSelectedIncident] = reactExports.useState(null);
  const [testResult, setTestResult] = reactExports.useState(
    null
  );
  const [testError, setTestError] = reactExports.useState(null);
  const handleTest = async () => {
    setTestResult(null);
    setTestError(null);
    try {
      const incidents = await seedAndTest.mutateAsync();
      setTestResult(incidents);
    } catch (err) {
      setTestError(
        err instanceof Error ? err.message : "Correlation test failed"
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "correlation.page", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/",
              className: "font-mono text-xs text-muted-foreground hover:text-foreground transition-colors",
              children: "Dashboard"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 10, className: "text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: "Correlation Engine" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground tracking-tight", children: "Correlation Engine" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5 font-mono", children: "Cross-cloud attack pattern detection and incident correlation" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "correlation.test_button",
          disabled: seedAndTest.isPending,
          onClick: handleTest,
          className: "flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GitMerge,
              {
                size: 14,
                className: seedAndTest.isPending ? "animate-spin" : ""
              }
            ),
            seedAndTest.isPending ? "Running…" : "Test Correlation"
          ]
        }
      )
    ] }),
    testResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TestResultBanner,
      {
        incidents: testResult,
        onDismiss: () => setTestResult(null)
      }
    ),
    testError && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TestErrorBanner,
      {
        message: testError,
        onDismiss: () => setTestError(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsRow, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IncidentFeedTable, { onSelect: setSelectedIncident }),
    selectedIncident && /* @__PURE__ */ jsxRuntimeExports.jsx(
      IncidentDetailModal,
      {
        incident: selectedIncident,
        onClose: () => setSelectedIncident(null)
      }
    )
  ] }) });
}
export {
  CorrelationPage as default
};
