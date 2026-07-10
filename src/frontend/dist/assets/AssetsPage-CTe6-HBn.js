import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-gvVWhVUu.js";
import { B as Badge } from "./badge-pakehWRD.js";
import { B as Button } from "./button-C09HiWh_.js";
import { I as Input } from "./input-ZWwvwxl4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1PEip1P-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-ZOY45ZOf.js";
import { P as ProviderIcon } from "./ProviderIcon-8s0B4Bhh.js";
import { c as createLucideIcon, k as useAssets } from "./use-backend--xAfAcuU.js";
import { a as Server } from "./shield-SgbJ0st7.js";
import { S as Search } from "./search-BO8TdYa9.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
import { C as ChevronUp, a as ChevronDown } from "./index-VrD3_g-G.js";
import "./utils-B38ds5J5.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
];
const ArrowUpDown = createLucideIcon("arrow-up-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode);
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
function riskColor(score) {
  if (score >= 31) return "text-destructive font-bold tabular-nums";
  if (score >= 11) return "text-warning font-semibold tabular-nums";
  return "text-success font-semibold tabular-nums";
}
function SortIcon({
  col,
  active,
  dir
}) {
  if (active !== col)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { size: 12, className: "ml-1 text-muted-foreground" });
  return dir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 12, className: "ml-1 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 12, className: "ml-1 text-primary" });
}
function AssetsPage() {
  const navigate = useNavigate();
  const { data: assets = [], isLoading } = useAssets("", 500);
  const [search, setSearch] = reactExports.useState("");
  const [filterProvider, setFilterProvider] = reactExports.useState(
    "All"
  );
  const [filterType, setFilterType] = reactExports.useState("All");
  const [filterRegion, setFilterRegion] = reactExports.useState("");
  const [filterRisk, setFilterRisk] = reactExports.useState("All");
  const [sortKey, setSortKey] = reactExports.useState("riskScore");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return assets.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q))
        return false;
      if (filterProvider !== "All" && a.provider !== filterProvider)
        return false;
      if (filterType !== "All" && a.assetType !== filterType) return false;
      if (filterRegion && !a.region.toLowerCase().includes(filterRegion.toLowerCase()))
        return false;
      const score = Number(a.riskScore);
      if (filterRisk === "Low" && score > 10) return false;
      if (filterRisk === "Medium" && (score < 11 || score > 30)) return false;
      if (filterRisk === "High" && score < 31) return false;
      return true;
    }).sort((a, b) => {
      let av = 0;
      let bv = 0;
      if (sortKey === "riskScore" || sortKey === "openFindings" || sortKey === "lastSeen") {
        av = Number(a[sortKey]);
        bv = Number(b[sortKey]);
      } else {
        av = String(a[sortKey]).toLowerCase();
        bv = String(b[sortKey]).toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [
    assets,
    search,
    filterProvider,
    filterType,
    filterRegion,
    filterRisk,
    sortKey,
    sortDir
  ]);
  function SortTh({ label, col }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TableHead,
      {
        className: "cursor-pointer select-none hover:text-foreground whitespace-nowrap",
        onClick: () => handleSort(col),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center", children: [
          label,
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col, active: sortKey, dir: sortDir })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-md bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 18, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold text-foreground tracking-tight", children: "Asset Inventory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: isLoading ? "Loading…" : `${filtered.length} of ${assets.length} assets` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "font-mono text-xs border-border text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 11, className: "mr-1" }),
            assets.length,
            " total"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card/50 border-b border-border px-6 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[200px] flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            size: 14,
            className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "assets.search_input",
            placeholder: "Search by name or ID…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9 h-8 text-sm bg-background border-border"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterProvider,
          onValueChange: (v) => setFilterProvider(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                "data-ocid": "assets.provider.select",
                className: "h-8 w-[120px] text-sm bg-background border-border",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Provider" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
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
          value: filterType,
          onValueChange: (v) => setFilterType(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                "data-ocid": "assets.type.select",
                className: "h-8 w-[150px] text-sm bg-background border-border",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Asset Type" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Types" }),
              Object.keys(ASSET_TYPE_LABELS).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: ASSET_TYPE_LABELS[t] }, t))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "assets.region_input",
          placeholder: "Region filter…",
          value: filterRegion,
          onChange: (e) => setFilterRegion(e.target.value),
          className: "h-8 w-[150px] text-sm bg-background border-border"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterRisk,
          onValueChange: (v) => setFilterRisk(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                "data-ocid": "assets.risk.select",
                className: "h-8 w-[130px] text-sm bg-background border-border",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Risk Score" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Risk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Low", children: "Low (0–10)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Medium", children: "Medium (11–30)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "High", children: "High (31+)" })
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 px-6 py-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "assets.loading_state",
        className: "flex items-center justify-center h-64",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono", children: "Loading assets…" })
        ] })
      }
    ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "assets.empty_state",
        className: "flex flex-col items-center justify-center h-64 gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-full bg-muted/30 border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 32, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold", children: "No assets found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: assets.length === 0 ? "No assets have been ingested yet. Configure cloud provider credentials to begin discovery." : "No assets match your current filters." })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/20 hover:bg-muted/20 border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortTh, { label: "Asset Name", col: "name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortTh, { label: "Provider", col: "provider" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortTh, { label: "Type", col: "assetType" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortTh, { label: "Region", col: "region" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortTh, { label: "Risk Score", col: "riskScore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortTh, { label: "Open Findings", col: "openFindings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortTh, { label: "Last Seen", col: "lastSeen" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((asset, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          "data-ocid": `assets.item.${idx + 1}`,
          className: "border-border hover:bg-muted/10 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs font-medium text-foreground max-w-[200px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", title: asset.name, children: asset.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-[10px]", children: [
                asset.id.slice(0, 16),
                "…"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: asset.provider, showLabel: true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "font-mono text-xs border-border text-muted-foreground",
                children: ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: asset.region }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-mono text-sm ${riskColor(Number(asset.riskScore))}`,
                children: Number(asset.riskScore)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: Number(asset.openFindings) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "font-mono text-xs bg-destructive/20 text-destructive border-destructive/40", children: Number(asset.openFindings) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono text-xs", children: "0" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground font-mono whitespace-nowrap", children: formatDistanceToNow(
              new Date(Number(asset.lastSeen) / 1e6),
              { addSuffix: true }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                "data-ocid": `assets.details_button.${idx + 1}`,
                className: "h-7 text-xs border-border hover:bg-muted/20 font-mono",
                onClick: () => navigate({ to: `/assets/${asset.id}` }),
                children: "Details"
              }
            ) })
          ]
        },
        asset.id
      )) })
    ] }) }) })
  ] });
}
export {
  AssetsPage as default
};
