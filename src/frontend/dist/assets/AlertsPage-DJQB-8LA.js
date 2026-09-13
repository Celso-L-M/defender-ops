import { j as jsxRuntimeExports, r as reactExports } from "./index-UYuukFCx.js";
import { B as Badge } from "./badge-C9lUe8TC.js";
import { B as Button } from "./button-D2D8gyAf.js";
import { I as Input } from "./input-jLaFAQlF.js";
import { L as Label } from "./label-Dvz7D0Cb.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CPRn4Oz3.js";
import { R as Root, C as Content, a as Close, T as Title, P as Portal, O as Overlay } from "./index-KfH_3UAm.js";
import { c as cn } from "./utils-CH5NUVML.js";
import { X } from "./x-BGu0unbn.js";
import { S as Skeleton } from "./skeleton-BAUrlSlH.js";
import { L as Layout, S as ShieldAlert } from "./Layout-BvE-Qw_4.js";
import { P as ProviderIcon } from "./ProviderIcon-B7LnSr-K.js";
import { S as SeverityBadge } from "./SeverityBadge-4N8MxJeJ.js";
import { c as createLucideIcon, s as useNormalizedAlerts, t as useUpdateAlertStatus, v as useUpdateAlertOwner, w as useEnrichAlert } from "./use-backend-BAJo2v8R.js";
import { S as Search } from "./search-Scg-sHEq.js";
import { C as Clock } from "./clock-CyFNsxAA.js";
import { S as Server } from "./shield-BzxXQzBz.js";
import { T as TriangleAlert } from "./triangle-alert-C1ijdifN.js";
import "./index-CKmjsssG.js";
import "./chevron-up-D7i0WWxc.js";
import "./index-D7q7u3Sa.js";
import "./shield-check-BrQcTxD_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "l9bcsi" }],
  ["line", { x1: "6", x2: "2", y1: "12", y2: "12", key: "13hhkx" }],
  ["line", { x1: "12", x2: "12", y1: "6", y2: "2", key: "10w3f3" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "18", key: "15g9kq" }]
];
const Crosshair = createLucideIcon("crosshair", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
const STATUS_STYLES = {
  Open: "border-destructive text-destructive bg-destructive/10",
  InProgress: "border-warning text-warning bg-warning/10",
  Resolved: "border-border text-muted-foreground bg-muted/20"
};
function relativeTime(ts) {
  const diffMs = Date.now() - Number(ts / 1000000n);
  const mins = Math.floor(diffMs / 6e4);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function truncate(str, max) {
  return str.length <= max ? str : `${str.slice(0, max)}…`;
}
function EnrichmentSection({
  alert
}) {
  var _a;
  const enrich = useEnrichAlert();
  const enrichment = alert.enrichment;
  const statusBadge = (enrichment == null ? void 0 : enrichment.enrichedAt) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-700/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 10 }),
    "Enriched"
  ] }) : enrich.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono bg-muted/40 text-muted-foreground border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 10, className: "animate-pulse" }),
    "Enriching…"
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono bg-muted/30 text-muted-foreground border border-border", children: "Not Configured" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 13, className: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest font-semibold text-primary", children: "Threat Intelligence" })
      ] }),
      statusBadge
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        disabled: enrich.isPending,
        onClick: () => enrich.mutate({ alertId: alert.id, customer: alert.customer }),
        "data-ocid": "alert.enrich_now_button",
        className: "w-full h-8 text-xs border-primary/40 text-primary hover:bg-primary/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 11, className: "mr-1.5" }),
          enrich.isPending ? "Enriching…" : "Enrich Now"
        ]
      }
    ),
    enrich.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-xs text-destructive",
        "data-ocid": "alert.enrich.error_state",
        children: ((_a = enrich.error) == null ? void 0 : _a.message) ?? "Enrichment failed"
      }
    ),
    (enrichment == null ? void 0 : enrichment.knownMaliciousIp) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2.5",
        "data-ocid": "alert.known_malicious_ip_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 13, className: "text-destructive shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-destructive", children: "Known Malicious IP — flagged by Emerging Threats blocklist" })
        ]
      }
    ),
    !enrichment && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-xs text-muted-foreground italic py-2",
        "data-ocid": "alert.enrichment.empty_state",
        children: "No enrichment data yet. Click Enrich Now to fetch threat intelligence."
      }
    ),
    enrichment && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      enrichment.ipReputation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/10 p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-muted-foreground", children: "IP Reputation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Abuse Score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `text-xs font-mono font-bold ${enrichment.ipReputation.abuseScore >= 80 ? "text-destructive" : enrichment.ipReputation.abuseScore >= 40 ? "text-warning" : "text-emerald-400"}`,
                children: [
                  enrichment.ipReputation.abuseScore,
                  "%"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full transition-all ${enrichment.ipReputation.abuseScore >= 80 ? "bg-destructive" : enrichment.ipReputation.abuseScore >= 40 ? "bg-warning" : "bg-emerald-500"}`,
              style: { width: `${enrichment.ipReputation.abuseScore}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1.5", children: [
          ["Country", enrichment.ipReputation.country],
          ["ISP", enrichment.ipReputation.isp],
          [
            "Total Reports",
            String(enrichment.ipReputation.totalReports)
          ],
          ["Last Reported", enrichment.ipReputation.lastReported]
        ].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground/90 break-all", children: value || "—" })
        ] }, label)) })
      ] }),
      enrichment.domainRep && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/10 p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-muted-foreground", children: "Domain / URL Reputation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-destructive/15 text-destructive border border-destructive/30", children: [
            enrichment.domainRep.maliciousVotes,
            " Malicious"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-warning/15 text-warning border border-warning/30", children: [
            enrichment.domainRep.suspiciousVotes,
            " Suspicious"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-700/30", children: [
            enrichment.domainRep.cleanVotes,
            " Clean"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5", children: "Last Analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground/80", children: enrichment.domainRep.lastAnalysisDate })
        ] })
      ] }),
      enrichment.mitreDetail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-chart-5/40 bg-chart-5/5 p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-chart-5", children: "MITRE Detail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5", children: "Tactic" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground/90", children: enrichment.mitreDetail.tacticName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5", children: "Technique" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground/90", children: enrichment.mitreDetail.techniqueName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 leading-relaxed", children: enrichment.mitreDetail.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5", children: "Mitigations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-28 overflow-y-auto rounded bg-muted/20 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 leading-relaxed", children: enrichment.mitreDetail.mitigations }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function AlertDetailPanel({
  alert,
  onClose
}) {
  var _a, _b, _c;
  const updateStatus = useUpdateAlertStatus();
  const updateOwner = useUpdateAlertOwner();
  const [status, setStatus] = reactExports.useState((alert == null ? void 0 : alert.status) ?? "Open");
  const [owner, setOwner] = reactExports.useState((alert == null ? void 0 : alert.owner) ?? "");
  const [saving, setSaving] = reactExports.useState(null);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!alert, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      side: "right",
      className: "w-full sm:max-w-lg bg-card border-l border-border overflow-y-auto",
      "data-ocid": "alert.detail.sheet",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "pb-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: alert.provider, showLabel: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: alert.severity })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-foreground text-base font-semibold leading-snug", children: alert.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-5", children: [
          alert.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-1.5", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 leading-relaxed", children: alert.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-3", children: [
            ["Alert ID", truncate(alert.id, 24)],
            ["Source", alert.provider],
            ["Original Severity", alert.originalSeverity],
            ["Normalized Severity", alert.severity],
            ["Asset ID", alert.assetId ? truncate(alert.assetId, 24) : "—"],
            ["Asset Type", alert.assetType ?? "—"],
            ["Region", alert.region ?? "—"],
            [
              "Account ID",
              alert.accountId ? truncate(alert.accountId, 20) : "—"
            ],
            ["Timestamp", relativeTime(alert.timestamp)]
          ].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground/90 break-all", children: value })
          ] }, label)) }),
          hasMitre && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-chart-5/40 bg-chart-5/5 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { size: 13, className: "text-chart-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest font-semibold text-chart-5", children: "MITRE ATT&CK" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              ((_a = alert.mitre) == null ? void 0 : _a.techniqueId) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5", children: "Technique ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono font-semibold text-chart-5", children: alert.mitre.techniqueId })
              ] }),
              ((_b = alert.mitre) == null ? void 0 : _b.tactic) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5", children: "Tactic" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground/90", children: alert.mitre.tactic })
              ] }),
              ((_c = alert.mitre) == null ? void 0 : _c.technique) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5", children: "Technique" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground/90", children: alert.mitre.technique })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-lg border border-primary/20 bg-primary/5 p-3",
              "data-ocid": "alert.enrichment.section",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(EnrichmentSection, { alert })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: status,
                  onValueChange: (v) => setStatus(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "flex-1 bg-background border-input text-sm",
                        "data-ocid": "alert.status.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Open", children: "Open" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "InProgress", children: "In Progress" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Resolved", children: "Resolved" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: handleSaveStatus,
                  disabled: saving === "status",
                  "data-ocid": "alert.status.save_button",
                  children: saving === "status" ? "Saving…" : "Save"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Assigned Owner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: owner,
                  onChange: (e) => setOwner(e.target.value),
                  placeholder: "email or username",
                  className: "flex-1 bg-background border-input text-sm font-mono",
                  "data-ocid": "alert.owner.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  onClick: handleSaveOwner,
                  disabled: saving === "owner",
                  "data-ocid": "alert.owner.save_button",
                  children: saving === "owner" ? "Saving…" : "Save"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function AlertsPage() {
  const { data: alerts = [], isLoading } = useNormalizedAlerts({
    customer: "",
    limit: 200
  });
  const [provider, setProvider] = reactExports.useState("All");
  const [severity, setSeverity] = reactExports.useState("All");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => {
    return alerts.filter((a) => {
      if (provider !== "All" && a.provider !== provider) return false;
      if (severity !== "All" && a.severity !== severity) return false;
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (search.trim() && !a.title.toLowerCase().includes(search.trim().toLowerCase()))
        return false;
      return true;
    });
  }, [alerts, provider, severity, statusFilter, search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 20, className: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold text-foreground", children: "Alert Center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: "ml-1 bg-primary/20 text-primary border border-primary/30 font-mono text-xs",
            "data-ocid": "alerts.total_badge",
            children: isLoading ? "…" : filtered.length
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/20 border-b border-border px-6 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px] max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              size: 13,
              className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Search alerts…",
              className: "pl-7 h-8 bg-background border-input text-sm",
              "data-ocid": "alerts.search_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: provider,
            onValueChange: (v) => setProvider(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 w-32 bg-background border-input text-sm",
                  "data-ocid": "alerts.provider.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Provider" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Providers" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AWS", children: "AWS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Azure", children: "Azure" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "GCP", children: "GCP" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: severity,
            onValueChange: (v) => setSeverity(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 w-32 bg-background border-input text-sm",
                  "data-ocid": "alerts.severity.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Severity" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Severities" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Critical", children: "Critical" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "High", children: "High" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Medium", children: "Medium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Low", children: "Low" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: statusFilter,
            onValueChange: (v) => setStatusFilter(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 w-36 bg-background border-input text-sm",
                  "data-ocid": "alerts.status.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Statuses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Open", children: "Open" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "InProgress", children: "In Progress" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Resolved", children: "Resolved" })
              ] })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(AlertsTableSkeleton, {}) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertsEmptyState,
        {
          hasFilters: !!search || provider !== "All" || severity !== "All" || statusFilter !== "All"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-card/60 sticky top-0 z-10", children: [
          "Time",
          "Provider",
          "Severity",
          "Title",
          "Status",
          "MITRE",
          "Asset",
          ""
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-2.5 text-left text-[10px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((alert, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertRow,
          {
            alert,
            index: i + 1,
            onView: () => setSelected(alert)
          },
          alert.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDetailPanel, { alert: selected, onClose: () => setSelected(null) })
  ] });
}
function AlertRow({
  alert,
  index,
  onView
}) {
  var _a;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border/60 hover:bg-muted/20 transition-colors cursor-pointer group",
      "data-ocid": `alerts.item.${index}`,
      onClick: onView,
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") onView();
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-mono text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11, className: "shrink-0" }),
          relativeTime(alert.timestamp)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: alert.provider, showLabel: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: alert.severity }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90 font-medium text-xs leading-snug", children: truncate(alert.title, 60) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold border ${STATUS_STYLES[alert.status]}`,
            children: alert.status
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: ((_a = alert.mitre) == null ? void 0 : _a.tactic) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium bg-chart-5/10 border border-chart-5/30 text-chart-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { size: 9, className: "shrink-0" }),
          truncate(alert.mitre.tactic, 18)
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground", children: alert.assetId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 10, className: "shrink-0" }),
          truncate(alert.assetId, 20)
        ] }) : "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "ghost",
            className: "h-7 px-2.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity",
            "data-ocid": `alerts.view_button.${index}`,
            onClick: (e) => {
              e.stopPropagation();
              onView();
            },
            children: "View"
          }
        ) })
      ]
    }
  );
}
function AlertsTableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-2", "data-ocid": "alerts.loading_state", children: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-11 w-full rounded bg-muted/30" }, `sk-${i}`)) });
}
function AlertsEmptyState({ hasFilters }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-24 px-6 text-center",
      "data-ocid": "alerts.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 40, className: "text-muted-foreground/30 mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/70 font-semibold text-base mb-1", children: hasFilters ? "No alerts match your filters" : "No alerts found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: hasFilters ? "Try adjusting your filters or search query." : "Alerts will appear here once ingestion begins and findings are normalized." })
      ]
    }
  );
}
export {
  AlertsPage as default
};
