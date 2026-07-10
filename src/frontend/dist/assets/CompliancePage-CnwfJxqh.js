import { r as reactExports, j as jsxRuntimeExports } from "./index-gvVWhVUu.js";
import { B as Badge } from "./badge-pakehWRD.js";
import { B as Button } from "./button-C09HiWh_.js";
import { S as Skeleton } from "./skeleton-DunZpd7G.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-ZOY45ZOf.js";
import { l as useComplianceStatus, w as useExportComplianceCsv, x as useExportCompliancePdf } from "./use-backend--xAfAcuU.js";
import { S as ShieldCheck } from "./shield-check-cTw__7cm.js";
import { D as Download } from "./download-BM-auB6t.js";
import { F as FileText } from "./file-text-DBih9m7S.js";
import "./utils-B38ds5J5.js";
const FRAMEWORKS = [
  { id: "NISTCSF", label: "NIST CSF" },
  { id: "CISAws", label: "CIS AWS" },
  { id: "CISAzure", label: "CIS Azure" },
  { id: "CISGCP", label: "CIS GCP" },
  { id: "ISO27001", label: "ISO 27001" },
  { id: "SOC2", label: "SOC 2" }
];
function controlStatusClass(status) {
  if (status === "Passing")
    return "bg-success/20 text-success border-success/40";
  if (status === "Failing")
    return "bg-destructive/20 text-destructive border-destructive/40";
  return "bg-muted/40 text-muted-foreground border-border";
}
function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = reactExports.useState("NISTCSF");
  const { data, isLoading } = useComplianceStatus(selectedFramework);
  const controls = (data == null ? void 0 : data.controls) ?? [];
  const score = Number((data == null ? void 0 : data.score) ?? 0n);
  const total = Number((data == null ? void 0 : data.total) ?? 0n);
  const passing = Number((data == null ? void 0 : data.passing) ?? 0n);
  const failing = Number((data == null ? void 0 : data.failing) ?? 0n);
  const exportCsv = useExportComplianceCsv();
  const exportPdf = useExportCompliancePdf();
  function handleExportCsv() {
    exportCsv.mutate(selectedFramework, {
      onSuccess: (csv) => {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compliance-${selectedFramework}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }
  function handleExportPdf() {
    exportPdf.mutate(selectedFramework, {
      onSuccess: (bytes) => {
        const blob = new Blob([bytes.buffer], {
          type: "application/pdf"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compliance-${selectedFramework}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "compliance.page", className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-md bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 20, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold text-foreground tracking-tight", children: "Compliance Mapping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Framework coverage and control gap analysis" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            "data-ocid": "compliance.export_csv_button",
            className: "gap-1.5 border-border text-foreground hover:bg-muted/40",
            onClick: handleExportCsv,
            disabled: exportCsv.isPending,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
              exportCsv.isPending ? "Exporting…" : "Export CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            "data-ocid": "compliance.export_pdf_button",
            className: "gap-1.5 border-border text-foreground hover:bg-muted/40",
            onClick: handleExportPdf,
            disabled: exportPdf.isPending,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }),
              exportPdf.isPending ? "Exporting…" : "Export PDF"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "compliance.framework_tabs",
        className: "flex flex-wrap gap-1.5 p-1 bg-muted/20 rounded-lg border border-border w-fit",
        children: FRAMEWORKS.map(({ id, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `compliance.framework_tab.${id.toLowerCase()}`,
            onClick: () => setSelectedFramework(id),
            className: `px-3 py-1.5 rounded-md text-xs font-medium transition-smooth ${selectedFramework === id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
            children: label
          },
          id
        ))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/30 bg-primary/8 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1", children: "Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-display font-bold text-primary tabular-nums", children: [
          score,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1", children: "Total Controls" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-foreground tabular-nums", children: total })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-success/30 bg-success/8 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1", children: "Passing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-success tabular-nums", children: passing })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-destructive/30 bg-destructive/8 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1", children: "Failing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-destructive tabular-nums", children: failing })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-muted/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-display text-foreground", children: "Controls" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "font-mono text-xs border-border text-muted-foreground",
            children: isLoading ? "…" : controls.length
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "compliance.controls.loading_state",
          className: "p-6 space-y-2",
          children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i))
        }
      ) : controls.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "compliance.controls.empty_state",
          className: "flex flex-col items-center justify-center py-12 gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 28, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No controls found for this framework." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/10 hover:bg-muted/10 border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs w-32", children: "Control ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs w-28", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Remediation" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: controls.map((ctrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `compliance.controls.item.${idx + 1}`,
            className: "border-border hover:bg-muted/10 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: ctrl.controlId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium text-foreground max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2", children: ctrl.title }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `font-mono text-[10px] ${controlStatusClass(ctrl.status)}`,
                  children: ctrl.status
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground max-w-[320px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "line-clamp-2",
                  title: ctrl.remediationGuidance,
                  children: [
                    ctrl.remediationGuidance.slice(0, 80),
                    ctrl.remediationGuidance.length > 80 ? "…" : ""
                  ]
                }
              ) })
            ]
          },
          ctrl.controlId
        )) })
      ] })
    ] })
  ] });
}
export {
  CompliancePage as default
};
