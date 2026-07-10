import { R as React, j as jsxRuntimeExports } from "./index-gvVWhVUu.js";
import { B as Badge } from "./badge-pakehWRD.js";
import { B as Button } from "./button-C09HiWh_.js";
import { P as Plus, T as Trash2, C as Checkbox } from "./checkbox-BVpN4Nu3.js";
import { L as Label } from "./label-DNWCQ9op.js";
import { S as Skeleton } from "./skeleton-DunZpd7G.js";
import { u as ue } from "./index-BCn3K2pV.js";
import { L as Layout, F as FileChartColumn } from "./Layout-BwhpjFll.js";
import { c as createLucideIcon, N as useGetReports, O as useDeleteReport, P as useGetReportCsv, Q as useGetReportEmailConfig, R as useSaveReportEmailConfig, S as useGenerateReport } from "./use-backend--xAfAcuU.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
import { D as Download } from "./download-BM-auB6t.js";
import { C as ChevronUp, a as ChevronDown } from "./index-VrD3_g-G.js";
import { X } from "./x-CWdpokfn.js";
import "./utils-B38ds5J5.js";
import "./index-BBxfRztn.js";
import "./shield-SgbJ0st7.js";
import "./search-BO8TdYa9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
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
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
const REPORT_TYPE_LABELS = {
  SecurityPosture: "Security Posture Summary",
  ComplianceStatus: "Compliance Status Report",
  IncidentSummary: "Incident Summary",
  ThreatIntelSummary: "Threat Intelligence Summary"
};
const REPORT_TYPE_OPTIONS = [
  { value: "SecurityPosture", label: "Security Posture Summary" },
  { value: "ComplianceStatus", label: "Compliance Status Report" },
  { value: "IncidentSummary", label: "Incident Summary" },
  { value: "ThreatIntelSummary", label: "Threat Intelligence Summary" }
];
const PROVIDER_OPTIONS = ["AWS", "Azure", "GCP"];
function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function GenerateReportForm({ onClose }) {
  const [reportType, setReportType] = React.useState("SecurityPosture");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [allProviders, setAllProviders] = React.useState(true);
  const [selectedProviders, setSelectedProviders] = React.useState(
    []
  );
  const { mutateAsync: generate, isPending } = useGenerateReport();
  const toggleProvider = (p) => {
    setSelectedProviders(
      (prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      ue.error("Please enter both start and end dates");
      return;
    }
    const providerScope = allProviders ? ["All"] : selectedProviders.length > 0 ? selectedProviders : ["All"];
    try {
      const result = await generate({
        reportType,
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
        providerScope,
        customer: ""
      });
      ue.success("Report generated — downloading CSV");
      downloadCsv(
        result.csvData,
        `${reportType}-${startDate}-to-${endDate}.csv`
      );
      onClose();
    } catch {
      ue.error("Failed to generate report");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      open: true,
      style: {
        position: "fixed",
        inset: 0,
        margin: "auto",
        width: "100%",
        maxWidth: "480px",
        height: "fit-content",
        zIndex: 50,
        background: "transparent",
        border: "none",
        padding: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]",
            onClick: onClose,
            onKeyDown: (e) => {
              if (e.key === "Escape") onClose();
            },
            role: "presentation"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative bg-card border border-border rounded-xl shadow-2xl p-6 w-full",
            "data-ocid": "reports.generate_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Generate Report" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "reports.generate_dialog.close_button",
                    onClick: onClose,
                    className: "rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors",
                    "aria-label": "Close",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Report Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      "data-ocid": "reports.type_select",
                      value: reportType,
                      onChange: (e) => setReportType(e.target.value),
                      className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors",
                      children: REPORT_TYPE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Start Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "date",
                        "data-ocid": "reports.start_date_input",
                        value: startDate,
                        onChange: (e) => setStartDate(e.target.value),
                        className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "End Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "date",
                        "data-ocid": "reports.end_date_input",
                        value: endDate,
                        onChange: (e) => setEndDate(e.target.value),
                        className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Provider Scope" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Checkbox,
                        {
                          id: "scope-all",
                          "data-ocid": "reports.scope_all_checkbox",
                          checked: allProviders,
                          onCheckedChange: (v) => {
                            setAllProviders(!!v);
                            if (v) setSelectedProviders([]);
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "scope-all",
                          className: "text-sm text-foreground cursor-pointer",
                          children: "All Providers"
                        }
                      )
                    ] }),
                    PROVIDER_OPTIONS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Checkbox,
                        {
                          id: `scope-${p}`,
                          "data-ocid": `reports.scope_${p.toLowerCase()}_checkbox`,
                          checked: !allProviders && selectedProviders.includes(p),
                          disabled: allProviders,
                          onCheckedChange: () => {
                            setAllProviders(false);
                            toggleProvider(p);
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: `scope-${p}`,
                          className: `text-sm cursor-pointer ${allProviders ? "text-muted-foreground" : "text-foreground"}`,
                          children: p
                        }
                      )
                    ] }, p))
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: onClose,
                      "data-ocid": "reports.generate_dialog.cancel_button",
                      className: "flex-1",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      "data-ocid": "reports.generate_dialog.submit_button",
                      disabled: isPending,
                      className: "flex-1 bg-primary hover:bg-primary/90",
                      children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
                        "Generating…"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumn, { size: 14 }),
                        "Generate & Download"
                      ] })
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function ReportRow({ report }) {
  const { mutateAsync: deleteReport, isPending: isDeleting } = useDeleteReport();
  const { mutateAsync: fetchCsv, isPending: isFetchingCsv } = useGetReportCsv();
  const handleDownload = async () => {
    const csv = await fetchCsv({
      reportId: report.reportId,
      customer: report.customer
    });
    if (!csv) {
      ue.error("CSV data not available");
      return;
    }
    downloadCsv(
      csv,
      `${report.reportType}-${report.dateRangeStart}-${report.dateRangeEnd}.csv`
    );
    ue.success("CSV downloaded");
  };
  const handleDelete = async () => {
    try {
      await deleteReport({
        reportId: report.reportId,
        customer: report.customer
      });
      ue.success("Report deleted");
    } catch {
      ue.error("Failed to delete report");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      "data-ocid": "reports.table_row",
      className: "border-b border-border/60 hover:bg-muted/10 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground font-mono text-xs", children: formatDistanceToNow(new Date(report.generatedAt), { addSuffix: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: REPORT_TYPE_LABELS[report.reportType] ?? report.reportType }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: report.providerScope.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `text-[10px] font-mono px-1.5 py-0 ${p === "AWS" ? "border-orange-500/40 text-orange-400" : p === "Azure" ? "border-blue-500/40 text-blue-400" : p === "GCP" ? "border-green-500/40 text-green-400" : "border-border text-muted-foreground"}`,
            children: p
          },
          p
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "text-[10px] font-mono border-border text-muted-foreground",
            children: report.format
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-muted-foreground truncate max-w-[160px]", children: report.generatedBy }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              "data-ocid": "reports.download_button",
              onClick: handleDownload,
              disabled: isFetchingCsv,
              className: "h-7 gap-1.5 text-xs",
              children: [
                isFetchingCsv ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full border border-muted-foreground border-t-transparent animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 11 }),
                "Download"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              "data-ocid": "reports.delete_button",
              onClick: handleDelete,
              disabled: isDeleting,
              className: "h-7 gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10",
              children: [
                isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full border border-destructive border-t-transparent animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 }),
                "Delete"
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
function EmailRecipientsSection() {
  const CUSTOMER = "";
  const { data: emailConfig, isLoading } = useGetReportEmailConfig(CUSTOMER);
  const { mutateAsync: saveConfig } = useSaveReportEmailConfig();
  const [configs, setConfigs] = React.useState({});
  const [expanded, setExpanded] = React.useState(false);
  React.useEffect(() => {
    if (emailConfig) {
      const map = {};
      for (const c of emailConfig) {
        map[c.reportType] = c.recipients.join(", ");
      }
      setConfigs(map);
    }
  }, [emailConfig]);
  const handleSave = async (reportType) => {
    const raw = configs[reportType] ?? "";
    const recipients = raw.split(",").map((s) => s.trim()).filter(Boolean);
    try {
      await saveConfig({ reportType, recipients, customer: CUSTOMER });
      ue.success("Email recipients saved");
    } catch {
      ue.error("Failed to save email recipients");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "reports.email_section",
      className: "rounded-xl border border-border bg-card overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "reports.email_section.toggle",
            onClick: () => setExpanded((v) => !v),
            className: "w-full flex items-center justify-between px-5 py-4 hover:bg-muted/10 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground", children: "Email Recipients" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: "per report type" })
              ] }),
              expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14, className: "text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14, className: "text-muted-foreground" })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-5 py-4 space-y-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) }) : REPORT_TYPE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: opt.label }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              "data-ocid": `reports.email_input.${opt.value.toLowerCase()}`,
              placeholder: "comma-separated email addresses",
              value: configs[opt.value] ?? "",
              onChange: (e) => setConfigs((prev) => ({
                ...prev,
                [opt.value]: e.target.value
              })),
              className: "flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              "data-ocid": `reports.email_save_button.${opt.value.toLowerCase()}`,
              onClick: () => handleSave(opt.value),
              className: "h-8 gap-1.5 text-xs shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 11 }),
                "Save"
              ]
            }
          )
        ] }, opt.value)) })
      ]
    }
  );
}
function ReportsPage() {
  const [showGenerateForm, setShowGenerateForm] = React.useState(false);
  const { data: reports, isLoading } = useGetReports("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "reports.page", className: "max-w-6xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-tight", children: "Security Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Generate, download, and manage security compliance reports" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            "data-ocid": "reports.generate_button",
            onClick: () => setShowGenerateForm(true),
            className: "gap-2 bg-primary hover:bg-primary/90",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
              "Generate Report"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumn, { size: 16, className: "text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-foreground", children: "Reports Library" }),
          reports && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "ml-1 font-mono text-[10px] text-muted-foreground border-border",
              children: reports.length
            }
          )
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : !reports || reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "reports.empty_state",
            className: "flex flex-col items-center justify-center gap-3 py-14 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumn, { size: 32, className: "text-muted-foreground/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No reports generated yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/60", children: [
                "Click",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "Generate Report" }),
                " ",
                "to create your first security report"
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/60", children: [
            "Date Generated",
            "Report Type",
            "Provider Scope",
            "Format",
            "Generated By",
            ""
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: reports.map((report, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportRow,
            {
              report,
              "data-ocid": `reports.table.item.${idx + 1}`
            },
            report.reportId
          )) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EmailRecipientsSection, {})
    ] }),
    showGenerateForm && /* @__PURE__ */ jsxRuntimeExports.jsx(GenerateReportForm, { onClose: () => setShowGenerateForm(false) })
  ] });
}
export {
  ReportsPage as default
};
