import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { W as useRawFindings } from "./use-backend-C00QWIg7.js";
import { t as LoadingSpinner } from "./index-B84IBi73.js";
import { t as Layout } from "./Layout-9d6smJ4x.js";
import { t as ProviderIcon } from "./ProviderIcon-9RfPlHNs.js";
import { t as SeverityBadge } from "./SeverityBadge-BO3qZC-M.js";
// src/pages/RawFindingsPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PROVIDERS = [
	"AWS",
	"Azure",
	"GCP"
];
function AllFindings() {
	const aws = useRawFindings("AWS", 100);
	const azure = useRawFindings("Azure", 100);
	const gcp = useRawFindings("GCP", 100);
	const isLoading = aws.isLoading || azure.isLoading || gcp.isLoading;
	const merged = [
		...aws.data?.items ?? [],
		...azure.data?.items ?? [],
		...gcp.data?.items ?? []
	].sort((a, b) => Number(b.timestamp) - Number(a.timestamp)).slice(0, 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingsTable, {
		findings: merged,
		isLoading
	});
}
function ProviderFindings({ provider }) {
	const { data, isLoading } = useRawFindings(provider, 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingsTable, {
		findings: data?.items ?? [],
		isLoading
	});
}
function FindingsTable({ findings, isLoading }) {
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "findings.loading_state",
		className: "flex items-center justify-center py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSpinner, { size: 28 })
	});
	if (findings.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "findings.empty_state",
		className: "flex flex-col items-center justify-center py-20 text-center space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-4xl mb-2 opacity-30",
				children: "📡"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-foreground font-mono text-sm font-medium",
				children: "No raw findings ingested yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground font-mono text-xs max-w-xs",
				children: "Configure a cloud provider to start polling."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-xs font-mono",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "sticky top-0 bg-card z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-36 whitespace-nowrap",
							children: "Timestamp"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-20",
							children: "Provider"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]",
							children: "Finding ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-24",
							children: "Severity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]",
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] max-w-[180px]",
							children: "Description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-32",
							children: "Region / Account"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: findings.map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				"data-ocid": `findings.row.${idx + 1}`,
				className: "border-b border-border/40 hover:bg-muted/20 transition-colors group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 px-3 text-muted-foreground whitespace-nowrap",
						children: (/* @__PURE__ */ new Date(Number(f.timestamp) / 1e6)).toLocaleString([], {
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, {
							provider: f.provider,
							showLabel: false
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "finding-id text-foreground/70 group-hover:text-foreground transition-colors truncate block max-w-[140px]",
							children: f.findingId
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: f.severity })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 px-3 text-foreground max-w-[200px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate block",
							children: f.title.length > 60 ? `${f.title.slice(0, 60)}…` : f.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 px-3 text-muted-foreground max-w-[180px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate block",
							children: f.description.length > 70 ? `${f.description.slice(0, 70)}…` : f.description
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-1.5 px-3 text-muted-foreground whitespace-nowrap",
						children: [f.region, f.accountId].filter(Boolean).join(" / ") || "—"
					})
				]
			}, f.id)) })]
		})
	});
}
function RawFindingsPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("All");
	const tabs = ["All", ...PROVIDERS];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "findings.page",
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-xl font-bold text-foreground tracking-tight",
				children: "Raw Findings Log"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-xs mt-0.5 font-mono",
				children: "Unprocessed security findings ingested from cloud providers"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "findings.debug_notice",
				className: "flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/5 px-4 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-amber-400 text-sm",
					children: "⚠"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-amber-400/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-amber-400",
						children: "DEBUG VIEW"
					}), " — Raw findings before normalization — for debugging purposes only. Use the Alerts page for normalized events."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-md overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex border-b border-border bg-muted/20",
					children: tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-ocid": `findings.tab.${tab.toLowerCase()}`,
						onClick: () => setActiveTab(tab),
						className: `flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-medium transition-colors border-r border-border last:border-r-0 ${activeTab === tab ? "text-primary bg-primary/10 border-b-2 border-b-primary -mb-px" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`,
						children: [tab !== "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, {
							provider: tab,
							showLabel: false
						}), tab]
					}, tab))
				}), activeTab === "All" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllFindings, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderFindings, { provider: activeTab })]
			})
		]
	}) });
}
export { RawFindingsPage as default };
