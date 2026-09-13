import { r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner } from "./index-CmSiIXAi.js";
import { L as Layout } from "./Layout-DSnUumzH.js";
import { P as ProviderIcon } from "./ProviderIcon-DuMT2Dc6.js";
import { S as SeverityBadge } from "./SeverityBadge-D7ODbawO.js";
import { e as useRawFindings } from "./use-backend-qlJEk42r.js";
import "./shield-tKdJ0jHt.js";
import "./shield-check-sUyafmt6.js";
import "./search-DMLdUJq7.js";
const PROVIDERS = ["AWS", "Azure", "GCP"];
function AllFindings() {
  var _a, _b, _c;
  const aws = useRawFindings("AWS", 100);
  const azure = useRawFindings("Azure", 100);
  const gcp = useRawFindings("GCP", 100);
  const isLoading = aws.isLoading || azure.isLoading || gcp.isLoading;
  const merged = [
    ...((_a = aws.data) == null ? void 0 : _a.items) ?? [],
    ...((_b = azure.data) == null ? void 0 : _b.items) ?? [],
    ...((_c = gcp.data) == null ? void 0 : _c.items) ?? []
  ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp)).slice(0, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FindingsTable, { findings: merged, isLoading });
}
function ProviderFindings({ provider }) {
  const { data, isLoading } = useRawFindings(provider, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FindingsTable, { findings: (data == null ? void 0 : data.items) ?? [], isLoading });
}
function FindingsTable({
  findings,
  isLoading
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "findings.loading_state",
        className: "flex items-center justify-center py-20",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: 28 })
      }
    );
  }
  if (findings.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "findings.empty_state",
        className: "flex flex-col items-center justify-center py-20 text-center space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2 opacity-30", children: "📡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-mono text-sm font-medium", children: "No raw findings ingested yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-mono text-xs max-w-xs", children: "Configure a cloud provider to start polling." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs font-mono", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-card z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-36 whitespace-nowrap", children: "Timestamp" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-20", children: "Provider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]", children: "Finding ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-24", children: "Severity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]", children: "Title" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] max-w-[180px]", children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-32", children: "Region / Account" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: findings.map((f, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        "data-ocid": `findings.row.${idx + 1}`,
        className: "border-b border-border/40 hover:bg-muted/20 transition-colors group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-3 text-muted-foreground whitespace-nowrap", children: new Date(Number(f.timestamp) / 1e6).toLocaleString([], {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider: f.provider, showLabel: false }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "finding-id text-foreground/70 group-hover:text-foreground transition-colors truncate block max-w-[140px]", children: f.findingId }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: f.severity }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-3 text-foreground max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: f.title.length > 60 ? `${f.title.slice(0, 60)}…` : f.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-3 text-muted-foreground max-w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: f.description.length > 70 ? `${f.description.slice(0, 70)}…` : f.description }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-3 text-muted-foreground whitespace-nowrap", children: [f.region, f.accountId].filter(Boolean).join(" / ") || "—" })
        ]
      },
      f.id
    )) })
  ] }) });
}
function RawFindingsPage() {
  const [activeTab, setActiveTab] = reactExports.useState("All");
  const tabs = ["All", ...PROVIDERS];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "findings.page", className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground tracking-tight", children: "Raw Findings Log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5 font-mono", children: "Unprocessed security findings ingested from cloud providers" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "findings.debug_notice",
        className: "flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/5 px-4 py-2.5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400 text-sm", children: "⚠" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-amber-400/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-amber-400", children: "DEBUG VIEW" }),
            " — Raw findings before normalization — for debugging purposes only. Use the Alerts page for normalized events."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-md overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border bg-muted/20", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `findings.tab.${tab.toLowerCase()}`,
          onClick: () => setActiveTab(tab),
          className: `flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-medium transition-colors border-r border-border last:border-r-0 ${activeTab === tab ? "text-primary bg-primary/10 border-b-2 border-b-primary -mb-px" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`,
          children: [
            tab !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProviderIcon,
              {
                provider: tab,
                showLabel: false
              }
            ),
            tab
          ]
        },
        tab
      )) }),
      activeTab === "All" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AllFindings, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderFindings, { provider: activeTab })
    ] })
  ] }) });
}
export {
  RawFindingsPage as default
};
