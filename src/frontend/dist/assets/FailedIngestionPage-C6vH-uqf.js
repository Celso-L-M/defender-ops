import { j as jsxRuntimeExports, b as useSearch, r as reactExports } from "./index-UYuukFCx.js";
import { B as Badge } from "./badge-C9lUe8TC.js";
import { B as Button } from "./button-D2D8gyAf.js";
import { R as Root, C as Content, a as Close, T as Title, P as Portal, O as Overlay } from "./index-KfH_3UAm.js";
import { c as cn } from "./utils-CH5NUVML.js";
import { X } from "./x-BGu0unbn.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CPRn4Oz3.js";
import { S as Skeleton } from "./skeleton-BAUrlSlH.js";
import { L as Layout, C as CircleX } from "./Layout-BvE-Qw_4.js";
import { D as useFailedIngestions } from "./use-backend-BAJo2v8R.js";
import { T as TriangleAlert } from "./triangle-alert-C1ijdifN.js";
import { F as FileText } from "./file-text-6Zd4AEnD.js";
import "./index-CKmjsssG.js";
import "./index-D7q7u3Sa.js";
import "./chevron-up-D7i0WWxc.js";
import "./shield-BzxXQzBz.js";
import "./shield-check-BrQcTxD_.js";
import "./search-Scg-sHEq.js";
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
const PROVIDER_BADGE = {
  AWS: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  Azure: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  GCP: "border-green-500/40 bg-green-500/10 text-green-400"
};
const ERROR_TYPE_BADGE = {
  extraction_error: "border-destructive/40 bg-destructive/10 text-destructive",
  normalization_error: "border-warning/40 bg-warning/10 text-warning",
  validation_error: "border-chart-5/40 bg-chart-5/10 text-chart-5"
};
const STATUS_BADGE = {
  failed: "border-destructive/40 bg-destructive/10 text-destructive",
  "Normalization Failed": "border-warning/40 bg-warning/10 text-warning",
  pending: "border-border text-muted-foreground bg-muted/20"
};
function formatTs(ns) {
  const ms = Number(ns) / 1e6;
  return new Date(ms).toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function truncate(str, max) {
  return str.length <= max ? str : `${str.slice(0, max)}…`;
}
function formatJson(raw) {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}
function PayloadModal({
  finding,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!finding, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-3xl bg-card border border-border",
      "data-ocid": "failed_ingestions.payload.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-foreground font-mono text-sm", children: [
          "Raw Payload — ",
          finding == null ? void 0 : finding.provider,
          " /",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: finding == null ? void 0 : finding.errorType })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[11px] font-mono text-foreground/90 bg-muted/20 border border-border rounded-md p-4 whitespace-pre-wrap break-all leading-relaxed", children: finding ? formatJson(finding.rawPayload) : "" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: onClose,
            "data-ocid": "failed_ingestions.payload.close_button",
            children: "Close"
          }
        ) })
      ]
    }
  ) });
}
function FailedIngestionRow({
  item,
  idx,
  onViewPayload
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      "data-ocid": `failed_ingestions.item.${idx}`,
      className: "border-b border-border/50 hover:bg-muted/10 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap", children: formatTs(item.timestamp) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `font-mono text-[10px] px-1.5 py-0 ${PROVIDER_BADGE[item.provider] ?? "border-border text-foreground"}`,
            children: item.provider
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `font-mono text-[10px] px-1.5 py-0 ${ERROR_TYPE_BADGE[item.errorType] ?? "border-border text-foreground"}`,
            children: item.errorType.replace(/_/g, " ")
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: "py-2 px-3 font-mono text-[11px] text-foreground/80 max-w-xs",
            title: item.errorMessage,
            children: truncate(item.errorMessage, 80)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: () => onViewPayload(item),
            "data-ocid": `failed_ingestions.view_payload_button.${idx}`,
            className: "h-6 px-2 text-[10px] font-mono text-muted-foreground hover:text-foreground gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 11 }),
              "JSON"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `font-mono text-[10px] px-1.5 py-0 ${STATUS_BADGE[item.status] ?? "border-border text-muted-foreground bg-muted/20"}`,
            children: item.status
          }
        ) })
      ]
    }
  );
}
function FailedIngestionPage() {
  const searchParams = useSearch({ strict: false });
  const initialProvider = searchParams.provider ?? "All";
  const [providerFilter, setProviderFilter] = reactExports.useState(initialProvider);
  const [errorTypeFilter, setErrorTypeFilter] = reactExports.useState("All");
  const [selectedFinding, setSelectedFinding] = reactExports.useState(null);
  const queryProvider = providerFilter === "All" ? void 0 : providerFilter;
  const { data, isLoading } = useFailedIngestions(queryProvider, 100);
  const filtered = (data ?? []).filter(
    (item) => errorTypeFilter === "All" ? true : item.errorType === errorTypeFilter
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "failed_ingestions.page", className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 18, className: "text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground tracking-tight", children: "Failed Ingestions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs font-mono", children: "Review extraction, normalization, and validation failures from all cloud providers" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "failed_ingestions.filters",
          className: "flex flex-wrap items-center gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Provider" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: providerFilter,
                  onValueChange: (v) => setProviderFilter(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "w-[120px] h-8 bg-card border-border text-xs font-mono",
                        "data-ocid": "failed_ingestions.provider.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
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
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Error Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: errorTypeFilter,
                  onValueChange: (v) => setErrorTypeFilter(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "w-[180px] h-8 bg-card border-border text-xs font-mono",
                        "data-ocid": "failed_ingestions.error_type.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Error Types" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "extraction_error", children: "Extraction Error" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "normalization_error", children: "Normalization Error" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "validation_error", children: "Validation Error" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
              filtered.length,
              " record",
              filtered.length !== 1 ? "s" : ""
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-md overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/10", children: [
          "Timestamp",
          "Provider",
          "Error Type",
          "Error Message",
          "Payload",
          "Status"
        ].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left py-2.5 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-medium",
            children: col
          },
          col
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7"].map(
          (rowKey) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "tr",
            {
              className: "border-b border-border/50",
              "data-ocid": "failed_ingestions.loading_state",
              children: [0, 1, 2, 3, 4, 5].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full rounded" }) }, j))
            },
            rowKey
          )
        ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "failed_ingestions.empty_state",
            className: "py-16 text-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  size: 32,
                  className: "text-muted-foreground/40"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No failed ingestions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground mt-1", children: providerFilter !== "All" || errorTypeFilter !== "All" ? "Try adjusting the filters above" : "All ingestion pipelines are healthy" })
              ] })
            ] })
          }
        ) }) }) : filtered.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          FailedIngestionRow,
          {
            item,
            idx: idx + 1,
            onViewPayload: setSelectedFinding
          },
          item.id
        )) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PayloadModal,
      {
        finding: selectedFinding,
        onClose: () => setSelectedFinding(null)
      }
    )
  ] });
}
export {
  FailedIngestionPage as default
};
