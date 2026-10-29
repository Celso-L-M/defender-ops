import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { b as useExportComplianceCsv, d as useComplianceStatus, x as useExportCompliancePdf } from "./use-backend-C00QWIg7.js";
import { t as Badge } from "./badge-LsDsWI7w.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Skeleton } from "./skeleton-Co_kaRlX.js";
import { t as Download } from "./download-Bcsi1uMb.js";
import { t as FileText } from "./file-text-B90nLL4B.js";
import { t as ShieldCheck } from "./shield-check-qpZrj14a.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BD1RpDgK.js";
// src/pages/CompliancePage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FRAMEWORKS = [
	{
		id: "NISTCSF",
		label: "NIST CSF"
	},
	{
		id: "CISAws",
		label: "CIS AWS"
	},
	{
		id: "CISAzure",
		label: "CIS Azure"
	},
	{
		id: "CISGCP",
		label: "CIS GCP"
	},
	{
		id: "ISO27001",
		label: "ISO 27001"
	},
	{
		id: "SOC2",
		label: "SOC 2"
	}
];
function controlStatusClass(status) {
	if (status === "Passing") return "bg-success/20 text-success border-success/40";
	if (status === "Failing") return "bg-destructive/20 text-destructive border-destructive/40";
	return "bg-muted/40 text-muted-foreground border-border";
}
function CompliancePage() {
	const [selectedFramework, setSelectedFramework] = (0, import_react.useState)("NISTCSF");
	const { data, isLoading } = useComplianceStatus(selectedFramework);
	const controls = data?.controls ?? [];
	const score = Number(data?.score ?? 0n);
	const total = Number(data?.total ?? 0n);
	const passing = Number(data?.passing ?? 0n);
	const failing = Number(data?.failing ?? 0n);
	const exportCsv = useExportComplianceCsv();
	const exportPdf = useExportCompliancePdf();
	function handleExportCsv() {
		exportCsv.mutate(selectedFramework, { onSuccess: (csv) => {
			const blob = new Blob([csv], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `compliance-${selectedFramework}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		} });
	}
	function handleExportPdf() {
		exportPdf.mutate(selectedFramework, { onSuccess: (bytes) => {
			const blob = new Blob([bytes.buffer], { type: "application/pdf" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `compliance-${selectedFramework}.pdf`;
			a.click();
			URL.revokeObjectURL(url);
		} });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "compliance.page",
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2 rounded-md bg-primary/10 border border-primary/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							size: 20,
							className: "text-primary"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-display font-semibold text-foreground tracking-tight",
						children: "Compliance Mapping"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Framework coverage and control gap analysis"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						"data-ocid": "compliance.export_csv_button",
						className: "gap-1.5 border-border text-foreground hover:bg-muted/40",
						onClick: handleExportCsv,
						disabled: exportCsv.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 13 }), exportCsv.isPending ? "Exporting…" : "Export CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						"data-ocid": "compliance.export_pdf_button",
						className: "gap-1.5 border-border text-foreground hover:bg-muted/40",
						onClick: handleExportPdf,
						disabled: exportPdf.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 13 }), exportPdf.isPending ? "Exporting…" : "Export PDF"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "compliance.framework_tabs",
				className: "flex flex-wrap gap-1.5 p-1 bg-muted/20 rounded-lg border border-border w-fit",
				children: FRAMEWORKS.map(({ id, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ocid": `compliance.framework_tab.${id.toLowerCase()}`,
					onClick: () => setSelectedFramework(id),
					className: `px-3 py-1.5 rounded-md text-xs font-medium transition-smooth ${selectedFramework === id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
					children: label
				}, id))
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-lg" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-primary/30 bg-primary/8 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1",
							children: "Score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-3xl font-display font-bold text-primary tabular-nums",
							children: [score, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1",
							children: "Total Controls"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-display font-bold text-foreground tabular-nums",
							children: total
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-success/30 bg-success/8 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1",
							children: "Passing"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-display font-bold text-success tabular-nums",
							children: passing
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-destructive/30 bg-destructive/8 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1",
							children: "Failing"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-display font-bold text-destructive tabular-nums",
							children: failing
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-3 border-b border-border bg-muted/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold font-display text-foreground",
						children: "Controls"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "font-mono text-xs border-border text-muted-foreground",
						children: isLoading ? "…" : controls.length
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "compliance.controls.loading_state",
					className: "p-6 space-y-2",
					children: [
						1,
						2,
						3,
						4
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }, i))
				}) : controls.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "compliance.controls.empty_state",
					className: "flex flex-col items-center justify-center py-12 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						size: 28,
						className: "text-muted-foreground"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No controls found for this framework."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "bg-muted/10 hover:bg-muted/10 border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs w-32",
							children: "Control ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs w-28",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Remediation"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: controls.map((ctrl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					"data-ocid": `compliance.controls.item.${idx + 1}`,
					className: "border-border hover:bg-muted/10 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs text-muted-foreground",
							children: ctrl.controlId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm font-medium text-foreground max-w-[200px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-2",
								children: ctrl.title
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `font-mono text-[10px] ${controlStatusClass(ctrl.status)}`,
							children: ctrl.status
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground max-w-[320px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "line-clamp-2",
								title: ctrl.remediationGuidance,
								children: [ctrl.remediationGuidance.slice(0, 80), ctrl.remediationGuidance.length > 80 ? "…" : ""]
							})
						})
					]
				}, ctrl.controlId)) })] })]
			})
		]
	});
}
export { CompliancePage as default };
