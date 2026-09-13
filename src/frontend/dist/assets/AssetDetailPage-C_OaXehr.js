import { a as useParams, u as useNavigate, j as jsxRuntimeExports } from "./index-UYuukFCx.js";
import { B as Badge } from "./badge-C9lUe8TC.js";
import { B as Button } from "./button-D2D8gyAf.js";
import { S as Skeleton } from "./skeleton-BAUrlSlH.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-LUCA-nvv.js";
import { P as ProviderIcon } from "./ProviderIcon-B7LnSr-K.js";
import { S as SeverityBadge } from "./SeverityBadge-4N8MxJeJ.js";
import { c as createLucideIcon, q as useAssetById, r as useAssetFindings } from "./use-backend-BAJo2v8R.js";
import { T as TriangleAlert } from "./triangle-alert-C1ijdifN.js";
import { S as Server, a as Shield } from "./shield-BzxXQzBz.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
import { C as Clock } from "./clock-CyFNsxAA.js";
import "./utils-CH5NUVML.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
];
const Hash = createLucideIcon("hash", __iconNode$2);
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
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$1);
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
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode);
const ASSET_TYPE_LABELS = {
  EC2: "EC2",
  S3: "S3",
  RDS: "RDS",
  Lambda: "Lambda",
  AzureVM: "Azure VM",
  AzureStorage: "Azure Storage",
  AzureDatabase: "Azure Database",
  GCPCompute: "GCP Compute",
  GCPStorage: "GCP Storage",
  GCPCloudSQL: "GCP Cloud SQL",
  Other: "Other"
};
function statusBadgeClass(status) {
  if (status === "Open")
    return "bg-destructive/20 text-destructive border-destructive/40";
  if (status === "InProgress")
    return "bg-warning/20 text-warning border-warning/40";
  return "bg-success/20 text-success border-success/40";
}
function riskBgClass(score) {
  if (score >= 31) return "border-destructive/40 bg-destructive/10";
  if (score >= 11) return "border-warning/40 bg-warning/10";
  return "border-success/40 bg-success/10";
}
function riskTextClass(score) {
  if (score >= 31) return "text-destructive";
  if (score >= 11) return "text-warning";
  return "text-success";
}
function AssetDetailPage() {
  const { assetId } = useParams({ strict: false });
  const navigate = useNavigate();
  const {
    data: asset,
    isLoading: assetLoading,
    isError
  } = useAssetById(assetId ?? "");
  const { data: findings = [], isLoading: findingsLoading } = useAssetFindings(
    assetId ?? ""
  );
  if (assetLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "asset-detail.loading_state",
        className: "flex flex-col min-h-screen bg-background",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-lg" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-lg" })
            ] })
          ] })
        ]
      }
    );
  }
  if (isError || !assetLoading && !asset) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "asset-detail.error_state",
        className: "flex flex-col min-h-screen bg-background",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "gap-2 text-muted-foreground",
              onClick: () => navigate({ to: "/assets" }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
                " Back to Assets"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center flex-1 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-full bg-destructive/10 border border-destructive/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 32, className: "text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold", children: "Asset Not Found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1", children: [
                "Asset ID ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: assetId }),
                " could not be located."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                className: "border-border",
                onClick: () => navigate({ to: "/assets" }),
                children: "Return to Inventory"
              }
            )
          ] })
        ]
      }
    );
  }
  const score = Number(asset.riskScore);
  const criticalFindings = findings.filter(
    (f) => f.severity === "Critical"
  ).length;
  const highFindings = findings.filter((f) => f.severity === "High").length;
  const mediumFindings = findings.filter((f) => f.severity === "Medium").length;
  const lowFindings = findings.filter((f) => f.severity === "Low").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "data-ocid": "asset-detail.back_link",
          className: "gap-2 text-muted-foreground hover:text-foreground -ml-2 mb-3",
          onClick: () => navigate({ to: "/assets" }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
            " Back to Asset Inventory"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-md bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 20, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold text-foreground tracking-tight", children: asset.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: asset.provider, showLabel: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "font-mono text-xs border-border text-muted-foreground",
                children: ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
              asset.region
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 11 }),
              asset.accountId
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-muted/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 15, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-display text-foreground", children: "Open Findings" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "font-mono text-xs border-border text-muted-foreground",
              children: findingsLoading ? "…" : findings.length
            }
          )
        ] }),
        findingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "asset-detail.findings.loading_state",
            className: "p-6 space-y-2",
            children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i))
          }
        ) : findings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "asset-detail.findings.empty_state",
            className: "flex flex-col items-center justify-center py-12 gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 28, className: "text-success" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No open findings for this asset." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/10 hover:bg-muted/10 border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Timestamp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Severity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "MITRE Tactic" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: findings.map((f, idx) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                "data-ocid": `asset-detail.findings.item.${idx + 1}`,
                className: "border-border hover:bg-muted/10 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-[11px] font-mono text-muted-foreground whitespace-nowrap", children: formatDistanceToNow(
                    new Date(Number(f.timestamp) / 1e6),
                    { addSuffix: true }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: f.severity }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[240px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: "/alerts",
                      "data-ocid": `asset-detail.findings.alert_link.${idx + 1}`,
                      className: "text-primary hover:underline text-xs truncate block",
                      title: f.title,
                      children: f.title
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `font-mono text-[10px] ${statusBadgeClass(f.status)}`,
                      children: f.status
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-mono text-muted-foreground", children: ((_a = f.mitre) == null ? void 0 : _a.tactic) ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) })
                ]
              },
              f.id
            );
          }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg border ${riskBgClass(score)} p-5`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 15, className: riskTextClass(score) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-display text-foreground", children: "Risk Score" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `text-5xl font-display font-bold tabular-nums mb-4 ${riskTextClass(score)}`,
              children: score
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-xs font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Critical × 4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-semibold", children: criticalFindings * 4 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "High × 3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-chart-5 font-semibold", children: highFindings * 3 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Medium × 2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-warning font-semibold", children: mediumFindings * 2 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Low × 1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: lowFindings })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-1.5 flex justify-between font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: riskTextClass(score), children: score })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-display text-foreground", children: "Metadata" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Last Seen" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground text-right", children: formatDistanceToNow(
                new Date(Number(asset.lastSeen) / 1e6),
                { addSuffix: true }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Asset ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-foreground text-right truncate max-w-[140px]",
                  title: asset.id,
                  children: [
                    asset.id.slice(0, 20),
                    "…"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: asset.customer || "—" })
            ] })
          ] })
        ] }),
        asset.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 14, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-display text-foreground", children: "Tags / Labels" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: asset.tags.map(([k, v], _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-2 text-xs font-mono",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: k }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px] border-border text-foreground max-w-[120px] truncate",
                    children: v
                  }
                )
              ]
            },
            `tag-${k}`
          )) })
        ] })
      ] })
    ] })
  ] });
}
export {
  AssetDetailPage as default
};
