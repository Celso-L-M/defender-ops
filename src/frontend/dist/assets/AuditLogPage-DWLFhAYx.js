import { r as reactExports, j as jsxRuntimeExports } from "./index-CmSiIXAi.js";
import { B as Button } from "./button-DxXmQYy1.js";
import { I as Input } from "./input-COH4aQv5.js";
import { S as Skeleton } from "./skeleton-BifbNGmV.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B-TgXAcV.js";
import { L as Layout, S as ShieldAlert } from "./Layout-DSnUumzH.js";
import { c as createLucideIcon, v as useAuditLog } from "./use-backend-qlJEk42r.js";
import { D as Download } from "./download-DdHAf45P.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
import "./utils-BQL5tKpt.js";
import "./shield-tKdJ0jHt.js";
import "./shield-check-sUyafmt6.js";
import "./search-DMLdUJq7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode);
const CUSTOMER = "default";
function relativeTime(ts) {
  try {
    return formatDistanceToNow(new Date(Number(ts / 1000000n)), {
      addSuffix: true
    });
  } catch {
    return "Unknown";
  }
}
function exportCsv(entries) {
  const header = ["Timestamp", "Actor", "Action", "Details", "Customer"];
  const rows = entries.map((e) => [
    new Date(Number(e.timestamp / 1000000n)).toISOString(),
    e.actorId,
    e.action,
    `"${e.details.replace(/"/g, '""')}"`,
    e.customer
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-log-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
function AuditLogPage() {
  const [limit, setLimit] = reactExports.useState(100);
  const [search, setSearch] = reactExports.useState("");
  const { data: entries = [], isLoading } = useAuditLog(CUSTOMER, limit);
  const filtered = search.trim() ? entries.filter(
    (e) => e.action.toLowerCase().includes(search.toLowerCase()) || e.actorId.toLowerCase().includes(search.toLowerCase()) || e.details.toLowerCase().includes(search.toLowerCase())
  ) : entries;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 18, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground", children: "Audit Log" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono uppercase tracking-wider", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24 inline-block" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            filtered.length,
            " entr",
            filtered.length !== 1 ? "ies" : "y"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "audit.search_input",
            placeholder: "Filter by actor, action, details…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "bg-background h-8 text-sm w-64"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => exportCsv(filtered),
            disabled: filtered.length === 0,
            "data-ocid": "audit.export_csv_button",
            className: "gap-1.5 text-xs shrink-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
              " Export CSV"
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "audit.loading_state", className: "space-y-1.5", children: Array.from({ length: 8 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded" }, i)
    )) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "audit.empty_state",
        className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 36, className: "text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: search.trim() ? "No matching entries" : "No audit log entries" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: search.trim() ? "Try adjusting your filter." : "All administrative actions will appear here once they occur." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-36", children: "Timestamp" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-44", children: "Actor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-40", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground", children: "Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground w-28", children: "Customer" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `audit.log.item.${idx + 1}`,
            className: "border-border hover:bg-muted/10 transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground font-mono whitespace-nowrap", children: relativeTime(entry.timestamp) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-mono text-foreground max-w-[160px] truncate", children: entry.actorId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold font-mono bg-primary/10 text-primary border border-primary/25", children: entry.action }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground max-w-[300px] truncate", children: entry.details }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground font-mono", children: entry.customer })
            ]
          },
          entry.id
        )) })
      ] }) }),
      entries.length === limit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => setLimit((l) => l + 100),
          "data-ocid": "audit.load_more_button",
          className: "text-xs",
          children: "Load more"
        }
      ) })
    ] })
  ] }) });
}
export {
  AuditLogPage as default
};
