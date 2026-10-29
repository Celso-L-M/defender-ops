import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { C as useFailedIngestions } from "./use-backend-C00QWIg7.js";
import { i as useSearch } from "./index-B84IBi73.js";
import { t as Badge } from "./badge-LsDsWI7w.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Skeleton } from "./skeleton-Co_kaRlX.js";
import { d as CircleX, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as FileText } from "./file-text-B90nLL4B.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-4ii6VlPg.js";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-yevwC5Fk.js";
// src/pages/FailedIngestionPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PROVIDER_BADGE = {
	AWS: "border-orange-500/40 bg-orange-500/10 text-orange-400",
	Azure: "border-blue-500/40 bg-blue-500/10 text-blue-400",
	GCP: "border-green-500/40 bg-green-500/10 text-green-400"
};
var ERROR_TYPE_BADGE = {
	extraction_error: "border-destructive/40 bg-destructive/10 text-destructive",
	normalization_error: "border-warning/40 bg-warning/10 text-warning",
	validation_error: "border-chart-5/40 bg-chart-5/10 text-chart-5"
};
var STATUS_BADGE = {
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
function PayloadModal({ finding, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!finding,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl bg-card border border-border",
			"data-ocid": "failed_ingestions.payload.dialog",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "border-b border-border pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-foreground font-mono text-sm",
						children: [
							"Raw Payload — ",
							finding?.provider,
							" /",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: finding?.errorType
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[60vh] overflow-y-auto mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "text-[11px] font-mono text-foreground/90 bg-muted/20 border border-border rounded-md p-4 whitespace-pre-wrap break-all leading-relaxed",
						children: finding ? formatJson(finding.rawPayload) : ""
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end pt-2 border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: onClose,
						"data-ocid": "failed_ingestions.payload.close_button",
						children: "Close"
					})
				})
			]
		})
	});
}
function FailedIngestionRow({ item, idx, onViewPayload }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		"data-ocid": `failed_ingestions.item.${idx}`,
		className: "border-b border-border/50 hover:bg-muted/10 transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap",
				children: formatTs(item.timestamp)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: `font-mono text-[10px] px-1.5 py-0 ${PROVIDER_BADGE[item.provider] ?? "border-border text-foreground"}`,
					children: item.provider
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: `font-mono text-[10px] px-1.5 py-0 ${ERROR_TYPE_BADGE[item.errorType] ?? "border-border text-foreground"}`,
					children: item.errorType.replace(/_/g, " ")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 px-3 font-mono text-[11px] text-foreground/80 max-w-xs",
				title: item.errorMessage,
				children: truncate(item.errorMessage, 80)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => onViewPayload(item),
					"data-ocid": `failed_ingestions.view_payload_button.${idx}`,
					className: "h-6 px-2 text-[10px] font-mono text-muted-foreground hover:text-foreground gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 11 }), "JSON"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2 px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: `font-mono text-[10px] px-1.5 py-0 ${STATUS_BADGE[item.status] ?? "border-border text-muted-foreground bg-muted/20"}`,
					children: item.status
				})
			})
		]
	});
}
function FailedIngestionPage() {
	const initialProvider = useSearch({ strict: false }).provider ?? "All";
	const [providerFilter, setProviderFilter] = (0, import_react.useState)(initialProvider);
	const [errorTypeFilter, setErrorTypeFilter] = (0, import_react.useState)("All");
	const [selectedFinding, setSelectedFinding] = (0, import_react.useState)(null);
	const { data, isLoading } = useFailedIngestions(providerFilter === "All" ? void 0 : providerFilter, 100);
	const filtered = (data ?? []).filter((item) => errorTypeFilter === "All" ? true : item.errorType === errorTypeFilter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "failed_ingestions.page",
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 mb-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, {
					size: 18,
					className: "text-destructive"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl font-bold text-foreground tracking-tight",
					children: "Failed Ingestions"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-xs font-mono",
				children: "Review extraction, normalization, and validation failures from all cloud providers"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "failed_ingestions.filters",
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Provider"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: providerFilter,
							onValueChange: (v) => setProviderFilter(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[120px] h-8 bg-card border-border text-xs font-mono",
								"data-ocid": "failed_ingestions.provider.select",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "bg-popover border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "All",
										children: "All Providers"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "AWS",
										children: "AWS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Azure",
										children: "Azure"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "GCP",
										children: "GCP"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Error Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: errorTypeFilter,
							onValueChange: (v) => setErrorTypeFilter(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[180px] h-8 bg-card border-border text-xs font-mono",
								"data-ocid": "failed_ingestions.error_type.select",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "bg-popover border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "All",
										children: "All Error Types"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "extraction_error",
										children: "Extraction Error"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "normalization_error",
										children: "Normalization Error"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "validation_error",
										children: "Validation Error"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] text-muted-foreground",
							children: [
								filtered.length,
								" record",
								filtered.length !== 1 ? "s" : ""
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border border-border rounded-md overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-b border-border bg-muted/10",
							children: [
								"Timestamp",
								"Provider",
								"Error Type",
								"Error Message",
								"Payload",
								"Status"
							].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left py-2.5 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-medium",
								children: col
							}, col))
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? [
							"r0",
							"r1",
							"r2",
							"r3",
							"r4",
							"r5",
							"r6",
							"r7"
						].map((rowKey) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-b border-border/50",
							"data-ocid": "failed_ingestions.loading_state",
							children: [
								0,
								1,
								2,
								3,
								4,
								5
							].map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 px-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-full rounded" })
							}, j))
						}, rowKey)) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-ocid": "failed_ingestions.empty_state",
								className: "py-16 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
										size: 32,
										className: "text-muted-foreground/40"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-foreground",
										children: "No failed ingestions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-mono text-muted-foreground mt-1",
										children: providerFilter !== "All" || errorTypeFilter !== "All" ? "Try adjusting the filters above" : "All ingestion pipelines are healthy"
									})] })]
								})
							})
						}) }) : filtered.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FailedIngestionRow, {
							item,
							idx: idx + 1,
							onViewPayload: setSelectedFinding
						}, item.id)) })]
					})
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayloadModal, {
		finding: selectedFinding,
		onClose: () => setSelectedFinding(null)
	})] });
}
export { FailedIngestionPage as default };
