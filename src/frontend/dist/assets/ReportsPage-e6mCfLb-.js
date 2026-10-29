import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { A as useGetReports, K as useReportRuns, O as useGetReportCsv, S as useExportReportPdf, T as useGenerateReport, et as useSaveReportRecipients, h as useDeleteReport, k as useGetReportEmailConfig, ut as createLucideIcon } from "./use-backend-C00QWIg7.js";
import { t as Badge } from "./badge-LsDsWI7w.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Label } from "./label-DKpYm3Db.js";
import { t as Skeleton } from "./skeleton-Co_kaRlX.js";
import { d as CircleX, t as Layout, u as FileChartColumn } from "./Layout-9d6smJ4x.js";
import { n as ChevronDown, t as ChevronUp } from "./chevron-up-DNVVEtcL.js";
import { t as CircleCheck } from "./circle-check-oM7foquT.js";
import { t as Clock } from "./clock-DWZROSAr.js";
import { t as Download } from "./download-Bcsi1uMb.js";
import { t as FileText } from "./file-text-B90nLL4B.js";
import { t as Mail } from "./mail-B9upj0k0.js";
import { t as Plus } from "./plus-D4c1gqpK.js";
import { t as Save } from "./save-B5hEQrai.js";
import { t as Trash2 } from "./trash-2-Df6HVUZV.js";
import { t as X } from "./x-BfIWc_q5.js";
import { t as ue } from "./dist-muuRpw8y.js";
import { t as formatDistanceToNow } from "./formatDistanceToNow-C-lSiC7M.js";
import { t as Checkbox } from "./checkbox-BgEW2MjN.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleAlert = createLucideIcon("circle-alert", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "8",
		y2: "12",
		key: "1pkeuh"
	}],
	["line", {
		x1: "12",
		x2: "12.01",
		y1: "16",
		y2: "16",
		key: "4dfq90"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var History = createLucideIcon("history", [
	["path", {
		d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
		key: "1357e3"
	}],
	["path", {
		d: "M3 3v5h5",
		key: "1xhq8a"
	}],
	["path", {
		d: "M12 7v5l4 2",
		key: "1fdv2h"
	}]
]);
// src/pages/ReportsPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var REPORT_TYPE_LABELS = {
	SecurityPosture: "Security Posture Summary",
	ComplianceStatus: "Compliance Status Report",
	IncidentSummary: "Incident Summary",
	ThreatIntelSummary: "Threat Intelligence Summary"
};
var REPORT_TYPE_OPTIONS = [
	{
		value: "SecurityPosture",
		label: "Security Posture Summary"
	},
	{
		value: "ComplianceStatus",
		label: "Compliance Status Report"
	},
	{
		value: "IncidentSummary",
		label: "Incident Summary"
	},
	{
		value: "ThreatIntelSummary",
		label: "Threat Intelligence Summary"
	}
];
var PROVIDER_OPTIONS = [
	"AWS",
	"Azure",
	"GCP"
];
var TRIGGER_LABELS = {
	ScheduledWeekly: "Weekly",
	ScheduledMonthly: "Monthly",
	OnDemand: "On-Demand"
};
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function downloadCsv(csv, filename) {
	const blob = new Blob([csv], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function downloadPdf(bytes, filename) {
	const blob = new Blob([bytes], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function timestampToDate(timestamp) {
	const date = new Date(Number(timestamp / 1000000n));
	return Number.isNaN(date.getTime()) ? null : date;
}
function formatTimestamp(timestamp) {
	const date = timestampToDate(timestamp);
	if (!date) return "—";
	return date.toLocaleString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function toSafeDate(value) {
	if (value === null || value === void 0) return null;
	let ms;
	if (typeof value === "bigint") ms = Number(value / 1000000n);
	else if (typeof value === "number") ms = value;
	else if (typeof value === "string") {
		if (value.trim() === "") return null;
		ms = Date.parse(value);
	} else return null;
	if (!Number.isFinite(ms)) return null;
	const date = new Date(ms);
	return Number.isNaN(date.getTime()) ? null : date;
}
function formatRelativeTimestamp(value) {
	const date = toSafeDate(value);
	if (!date) return "—";
	try {
		return formatDistanceToNow(date, { addSuffix: true });
	} catch {
		return "—";
	}
}
function formatPeriod(start, end) {
	const s = timestampToDate(start);
	const e = timestampToDate(end);
	if (!s || !e) return "—";
	const fmt = (d) => d.toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
	return `${fmt(s)} → ${fmt(e)}`;
}
function dateInputToNs(value) {
	if (!value) return null;
	const ms = Date.parse(`${value}T00:00:00Z`);
	if (Number.isNaN(ms)) return null;
	return BigInt(ms) * 1000000n;
}
function GenerateReportForm({ onClose }) {
	const [reportType, setReportType] = import_react.useState("SecurityPosture");
	const [startDate, setStartDate] = import_react.useState("");
	const [endDate, setEndDate] = import_react.useState("");
	const [allProviders, setAllProviders] = import_react.useState(true);
	const [selectedProviders, setSelectedProviders] = import_react.useState([]);
	const { mutateAsync: generate, isPending } = useGenerateReport();
	const toggleProvider = (p) => {
		setSelectedProviders((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!startDate || !endDate) {
			ue.error("Please enter both start and end dates");
			return;
		}
		if (startDate > endDate) {
			ue.error("Start date must be on or before the end date");
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
			downloadCsv(result.csvData, `${reportType}-${startDate}-to-${endDate}.csv`);
			onClose();
		} catch {
			ue.error("Failed to generate report");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dialog", {
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]",
			onClick: onClose,
			onKeyDown: (e) => {
				if (e.key === "Escape") onClose();
			},
			role: "presentation"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative bg-card border border-border rounded-xl shadow-2xl p-6 w-full",
			"data-ocid": "reports.generate_dialog",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-bold text-lg text-foreground",
					children: "Generate Report"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ocid": "reports.generate_dialog.close_button",
					onClick: onClose,
					className: "rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
							children: "Report Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							"data-ocid": "reports.type_select",
							value: reportType,
							onChange: (e) => setReportType(e.target.value),
							className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors",
							children: REPORT_TYPE_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: opt.value,
								children: opt.label
							}, opt.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
								children: "Start Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								"data-ocid": "reports.start_date_input",
								value: startDate,
								onChange: (e) => setStartDate(e.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
								children: "End Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								"data-ocid": "reports.end_date_input",
								value: endDate,
								onChange: (e) => setEndDate(e.target.value),
								className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
							children: "Provider Scope"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									id: "scope-all",
									"data-ocid": "reports.scope_all_checkbox",
									checked: allProviders,
									onCheckedChange: (v) => {
										setAllProviders(!!v);
										if (v) setSelectedProviders([]);
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "scope-all",
									className: "text-sm text-foreground cursor-pointer",
									children: "All Providers"
								})]
							}), PROVIDER_OPTIONS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									id: `scope-${p}`,
									"data-ocid": `reports.scope_${p.toLowerCase()}_checkbox`,
									checked: !allProviders && selectedProviders.includes(p),
									disabled: allProviders,
									onCheckedChange: () => {
										setAllProviders(false);
										toggleProvider(p);
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: `scope-${p}`,
									className: `text-sm cursor-pointer ${allProviders ? "text-muted-foreground" : "text-foreground"}`,
									children: p
								})]
							}, p))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: onClose,
							"data-ocid": "reports.generate_dialog.cancel_button",
							className: "flex-1",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							"data-ocid": "reports.generate_dialog.submit_button",
							disabled: isPending,
							className: "flex-1 bg-primary hover:bg-primary/90",
							children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }), "Generating…"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumn, { size: 14 }), "Generate & Download"]
							})
						})]
					})
				]
			})]
		})]
	});
}
function ReportRow({ report }) {
	const { mutateAsync: deleteReport, isPending: isDeleting } = useDeleteReport();
	const { mutateAsync: fetchCsv, isPending: isFetchingCsv } = useGetReportCsv();
	const { mutateAsync: exportPdf, isPending: isExportingPdf } = useExportReportPdf();
	const handleDownload = async () => {
		const csv = await fetchCsv({
			reportId: report.reportId,
			customer: report.customer
		});
		if (!csv) {
			ue.error("CSV data not available");
			return;
		}
		downloadCsv(csv, `${report.reportType}-${report.dateRangeStart}-${report.dateRangeEnd}.csv`);
		ue.success("CSV downloaded");
	};
	const handleExportPdf = async () => {
		const periodStart = dateInputToNs(report.dateRangeStart);
		const periodEnd = dateInputToNs(report.dateRangeEnd);
		if (periodStart === null || periodEnd === null) {
			ue.error("Report period is not a valid date range");
			return;
		}
		const scope = report.providerScope.filter((p) => p === "AWS" || p === "Azure" || p === "GCP");
		try {
			downloadPdf(await exportPdf({
				reportType: report.reportType,
				periodStart,
				periodEnd,
				customer: report.customer,
				providerScope: scope.length > 0 ? scope : [
					"AWS",
					"Azure",
					"GCP"
				]
			}), `${report.reportType}-${report.dateRangeStart}-to-${report.dateRangeEnd}.pdf`);
			ue.success("PDF downloaded");
		} catch {
			ue.error("Failed to export PDF");
		}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		"data-ocid": "reports.table_row",
		className: "border-b border-border/60 hover:bg-muted/10 transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 text-sm text-muted-foreground font-mono text-xs",
				children: formatRelativeTimestamp(report.generatedAt)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-foreground",
					children: REPORT_TYPE_LABELS[report.reportType] ?? report.reportType
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: report.providerScope.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: `text-[10px] font-mono px-1.5 py-0 ${p === "AWS" ? "border-orange-500/40 text-orange-400" : p === "Azure" ? "border-blue-500/40 text-blue-400" : p === "GCP" ? "border-green-500/40 text-green-400" : "border-border text-muted-foreground"}`,
						children: p
					}, p))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "text-[10px] font-mono border-border text-muted-foreground",
					children: report.format
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 text-xs font-mono text-muted-foreground truncate max-w-[160px]",
				children: report.generatedBy
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 justify-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							"data-ocid": "reports.download_button",
							onClick: handleDownload,
							disabled: isFetchingCsv,
							className: "h-7 gap-1.5 text-xs",
							children: [isFetchingCsv ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full border border-muted-foreground border-t-transparent animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 11 }), "CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							"data-ocid": "reports.pdf_button",
							onClick: handleExportPdf,
							disabled: isExportingPdf,
							className: "h-7 gap-1.5 text-xs",
							children: [isExportingPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full border border-muted-foreground border-t-transparent animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 11 }), "PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							"data-ocid": "reports.delete_button",
							onClick: handleDelete,
							disabled: isDeleting,
							className: "h-7 gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10",
							children: [isDeleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full border border-destructive border-t-transparent animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 11 }), "Delete"]
						})
					]
				})
			})
		]
	});
}
function DeliveryOutcomes({ run }) {
	if (run.deliveries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-mono text-[10px] text-muted-foreground",
		children: "No deliveries"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1",
		children: run.deliveries.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			"data-ocid": "reports.delivery_outcome",
			title: d.error ?? (d.success ? "Delivered" : "Failed"),
			className: `inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] ${d.success ? "border-green-500/40 text-green-400" : "border-destructive/40 text-destructive"}`,
			children: [d.success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 9 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 9 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "max-w-[140px] truncate",
				children: d.recipient
			})]
		}, `${run.runId}-${d.recipient}`))
	});
}
function ReportHistorySection() {
	const { data: runs, isLoading } = useReportRuns("", 25);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "reports.history_section",
		className: "rounded-xl border border-border bg-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 px-5 py-4 border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {
					size: 16,
					className: "text-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-semibold text-sm text-foreground",
					children: "Report Run History"
				}),
				runs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "ml-1 font-mono text-[10px] text-muted-foreground border-border",
					children: runs.length
				})
			]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-5 space-y-3",
			children: Array.from({ length: 3 }, (_, i) => `history-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }, id))
		}) : !runs || runs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "reports.history_empty_state",
			className: "flex flex-col items-center justify-center gap-3 py-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
					size: 30,
					className: "text-muted-foreground/30"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: "No report runs recorded yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground/60",
					children: "Weekly and monthly runs appear here automatically once scheduled"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b border-border/60",
					children: [
						"Generated",
						"Report Type",
						"Trigger",
						"Period Covered",
						"Outcome",
						"Deliveries"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
						children: h
					}, h))
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: runs.map((run, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					"data-ocid": `reports.history.item.${idx + 1}`,
					className: "border-b border-border/60 hover:bg-muted/10 transition-colors align-top",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap",
							children: formatTimestamp(run.generatedAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-sm text-foreground",
							children: REPORT_TYPE_LABELS[run.reportType] ?? run.reportType
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] font-mono border-border text-muted-foreground",
								children: TRIGGER_LABELS[run.trigger] ?? run.trigger
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap",
							children: formatPeriod(run.periodStart, run.periodEnd)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: run.outcome.__kind__ === "Succeeded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 text-xs font-medium text-green-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 12 }), "Succeeded"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 text-xs font-medium text-destructive",
								title: run.outcome.Failed,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 12 }), "Failed"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryOutcomes, { run })
						})
					]
				}, run.runId)) })]
			})
		})]
	});
}
function EmailRecipientsSection() {
	const CUSTOMER = "";
	const { data: emailConfig, isLoading } = useGetReportEmailConfig(CUSTOMER);
	const { mutateAsync: saveRecipients } = useSaveReportRecipients();
	const [configs, setConfigs] = import_react.useState({});
	const [errors, setErrors] = import_react.useState({});
	const [savingType, setSavingType] = import_react.useState(null);
	const [expanded, setExpanded] = import_react.useState(false);
	import_react.useEffect(() => {
		if (emailConfig) {
			const map = {};
			for (const c of emailConfig) map[c.reportType] = c.recipients.join(", ");
			setConfigs(map);
		}
	}, [emailConfig]);
	const handleSave = async (reportType) => {
		const recipients = (configs[reportType] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
		const invalid = recipients.filter((r) => !EMAIL_PATTERN.test(r));
		if (invalid.length > 0) {
			setErrors((prev) => ({
				...prev,
				[reportType]: `Invalid email address: ${invalid.join(", ")}`
			}));
			return;
		}
		setErrors((prev) => ({
			...prev,
			[reportType]: ""
		}));
		setSavingType(reportType);
		try {
			await saveRecipients({
				reportType,
				recipients,
				customer: CUSTOMER
			});
			ue.success("Email recipients saved");
		} catch (err) {
			if ((err instanceof Error ? err.message : "") === "InvalidRecipient") setErrors((prev) => ({
				...prev,
				[reportType]: "One or more email addresses are invalid"
			}));
			else ue.error("Failed to save email recipients");
		} finally {
			setSavingType(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "reports.email_section",
		className: "rounded-xl border border-border bg-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"data-ocid": "reports.email_section.toggle",
			onClick: () => setExpanded((v) => !v),
			className: "w-full flex items-center justify-between px-5 py-4 hover:bg-muted/10 transition-colors",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
						size: 16,
						className: "text-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-semibold text-sm text-foreground",
						children: "Email Recipients"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-muted-foreground",
						children: "per report type"
					})
				]
			}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, {
				size: 14,
				className: "text-muted-foreground"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
				size: 14,
				className: "text-muted-foreground"
			})]
		}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border px-5 py-4 space-y-4",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: Array.from({ length: 4 }, (_, i) => `email-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }, id))
			}) : REPORT_TYPE_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-48 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-foreground",
								children: opt.label
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							"data-ocid": `reports.email_input.${opt.value.toLowerCase()}`,
							placeholder: "comma-separated email addresses",
							value: configs[opt.value] ?? "",
							onChange: (e) => {
								setConfigs((prev) => ({
									...prev,
									[opt.value]: e.target.value
								}));
								setErrors((prev) => ({
									...prev,
									[opt.value]: ""
								}));
							},
							"aria-invalid": !!errors[opt.value],
							className: `flex-1 rounded-md border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${errors[opt.value] ? "border-destructive focus:ring-destructive/60" : "border-border focus:ring-primary/60"}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							"data-ocid": `reports.email_save_button.${opt.value.toLowerCase()}`,
							onClick: () => handleSave(opt.value),
							disabled: savingType === opt.value,
							className: "h-8 gap-1.5 text-xs shrink-0",
							children: [savingType === opt.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full border border-muted-foreground border-t-transparent animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 11 }), "Save"]
						})
					]
				}), errors[opt.value] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					"data-ocid": `reports.email_error.${opt.value.toLowerCase()}`,
					className: "flex items-center gap-1.5 pl-[12.5rem] text-xs text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 11 }), errors[opt.value]]
				})]
			}, opt.value))
		})]
	});
}
function ReportsPage() {
	const [showGenerateForm, setShowGenerateForm] = import_react.useState(false);
	const { data: reports, isLoading } = useGetReports("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "reports.page",
		className: "max-w-6xl mx-auto space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display font-bold text-2xl text-foreground tracking-tight",
					children: "Security Reports"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: "Generate, download, and manage security compliance reports"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					"data-ocid": "reports.generate_button",
					onClick: () => setShowGenerateForm(true),
					className: "gap-2 bg-primary hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 }), "Generate Report"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 px-5 py-4 border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumn, {
							size: 16,
							className: "text-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-semibold text-sm text-foreground",
							children: "Reports Library"
						}),
						reports && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "ml-1 font-mono text-[10px] text-muted-foreground border-border",
							children: reports.length
						})
					]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5 space-y-3",
					children: Array.from({ length: 3 }, (_, i) => `library-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }, id))
				}) : !reports || reports.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "reports.empty_state",
					className: "flex flex-col items-center justify-center gap-3 py-14 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumn, {
							size: 32,
							className: "text-muted-foreground/30"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-muted-foreground",
							children: "No reports generated yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground/60",
							children: [
								"Click",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary font-medium",
									children: "Generate Report"
								}),
								" ",
								"to create your first security report"
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-b border-border/60",
							children: [
								"Date Generated",
								"Report Type",
								"Provider Scope",
								"Format",
								"Generated By",
								""
							].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
								children: h
							}, h))
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: reports.map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportRow, { report }, report.reportId)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportHistorySection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailRecipientsSection, {})
		]
	}), showGenerateForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateReportForm, { onClose: () => setShowGenerateForm(false) })] });
}
export { ReportsPage as default };
