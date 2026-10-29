import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { o as useAssets, ut as createLucideIcon } from "./use-backend-C00QWIg7.js";
import { r as useNavigate } from "./index-B84IBi73.js";
import { t as Badge } from "./badge-LsDsWI7w.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Input } from "./input-DRmrQsxb.js";
import { n as ChevronDown, t as ChevronUp } from "./chevron-up-DNVVEtcL.js";
import { t as ProviderIcon } from "./ProviderIcon-9RfPlHNs.js";
import { t as Search } from "./search-DOVxPRW0.js";
import { n as Server } from "./shield-CbiefNtr.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-4ii6VlPg.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BD1RpDgK.js";
import { t as formatDistanceToNow } from "./formatDistanceToNow-C-lSiC7M.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowUpDown = createLucideIcon("arrow-up-down", [
	["path", {
		d: "m21 16-4 4-4-4",
		key: "f6ql7i"
	}],
	["path", {
		d: "M17 20V4",
		key: "1ejh1v"
	}],
	["path", {
		d: "m3 8 4-4 4 4",
		key: "11wl7u"
	}],
	["path", {
		d: "M7 4v16",
		key: "1glfcx"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Database = createLucideIcon("database", [
	["ellipse", {
		cx: "12",
		cy: "5",
		rx: "9",
		ry: "3",
		key: "msslwz"
	}],
	["path", {
		d: "M3 5V19A9 3 0 0 0 21 19V5",
		key: "1wlel7"
	}],
	["path", {
		d: "M3 12A9 3 0 0 0 21 12",
		key: "mv7ke4"
	}]
]);
// src/pages/AssetsPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ASSET_TYPE_LABELS = {
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
function SortIcon({ col, active, dir }) {
	if (active !== col) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, {
		size: 12,
		className: "ml-1 text-muted-foreground"
	});
	return dir === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, {
		size: 12,
		className: "ml-1 text-primary"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
		size: 12,
		className: "ml-1 text-primary"
	});
}
function AssetsPage() {
	const navigate = useNavigate();
	const { data: assets = [], isLoading } = useAssets("", 500);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterProvider, setFilterProvider] = (0, import_react.useState)("All");
	const [filterType, setFilterType] = (0, import_react.useState)("All");
	const [filterRegion, setFilterRegion] = (0, import_react.useState)("");
	const [filterRisk, setFilterRisk] = (0, import_react.useState)("All");
	const [sortKey, setSortKey] = (0, import_react.useState)("riskScore");
	const [sortDir, setSortDir] = (0, import_react.useState)("desc");
	function handleSort(key) {
		if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
		else {
			setSortKey(key);
			setSortDir("desc");
		}
	}
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase();
		return assets.filter((a) => {
			if (q && !a.name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q)) return false;
			if (filterProvider !== "All" && a.provider !== filterProvider) return false;
			if (filterType !== "All" && a.assetType !== filterType) return false;
			if (filterRegion && !a.region.toLowerCase().includes(filterRegion.toLowerCase())) return false;
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
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "cursor-pointer select-none hover:text-foreground whitespace-nowrap",
			onClick: () => handleSort(col),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center",
				children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortIcon, {
					col,
					active: sortKey,
					dir: sortDir
				})]
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border-b border-border px-6 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2 rounded-md bg-primary/10 border border-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, {
								size: 18,
								className: "text-primary"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-display font-semibold text-foreground tracking-tight",
							children: "Asset Inventory"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground font-mono",
							children: isLoading ? "Loading…" : `${filtered.length} of ${assets.length} assets`
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "font-mono text-xs border-border text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, {
								size: 11,
								className: "mr-1"
							}),
							assets.length,
							" total"
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card/50 border-b border-border px-6 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3 items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[200px] flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								size: 14,
								className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								"data-ocid": "assets.search_input",
								placeholder: "Search by name or ID…",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "pl-9 h-8 text-sm bg-background border-border"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterProvider,
							onValueChange: (v) => setFilterProvider(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								"data-ocid": "assets.provider.select",
								className: "h-8 w-[120px] text-sm bg-background border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Provider" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterType,
							onValueChange: (v) => setFilterType(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								"data-ocid": "assets.type.select",
								className: "h-8 w-[150px] text-sm bg-background border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Asset Type" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "All",
								children: "All Types"
							}), Object.keys(ASSET_TYPE_LABELS).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: ASSET_TYPE_LABELS[t]
							}, t))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							"data-ocid": "assets.region_input",
							placeholder: "Region filter…",
							value: filterRegion,
							onChange: (e) => setFilterRegion(e.target.value),
							className: "h-8 w-[150px] text-sm bg-background border-border"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterRisk,
							onValueChange: (v) => setFilterRisk(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								"data-ocid": "assets.risk.select",
								className: "h-8 w-[130px] text-sm bg-background border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Risk Score" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "All",
									children: "All Risk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Low",
									children: "Low (0–10)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Medium",
									children: "Medium (11–30)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "High",
									children: "High (31+)"
								})
							] })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 px-6 py-4",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "assets.loading_state",
					className: "flex items-center justify-center h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-3 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-mono",
							children: "Loading assets…"
						})]
					})
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "assets.empty_state",
					className: "flex flex-col items-center justify-center h-64 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 rounded-full bg-muted/30 border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, {
							size: 32,
							className: "text-muted-foreground"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-foreground font-semibold",
							children: "No assets found"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm mt-1",
							children: assets.length === 0 ? "No assets have been ingested yet. Configure cloud provider credentials to begin discovery." : "No assets match your current filters."
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "bg-muted/20 hover:bg-muted/20 border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
								label: "Asset Name",
								col: "name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
								label: "Provider",
								col: "provider"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
								label: "Type",
								col: "assetType"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
								label: "Region",
								col: "region"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
								label: "Risk Score",
								col: "riskScore"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
								label: "Open Findings",
								col: "openFindings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
								label: "Last Seen",
								col: "lastSeen"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((asset, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						"data-ocid": `assets.item.${idx + 1}`,
						className: "border-border hover:bg-muted/10 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "font-mono text-xs font-medium text-foreground max-w-[200px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate block",
									title: asset.name,
									children: asset.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground text-[10px]",
									children: [asset.id.slice(0, 16), "…"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, {
								provider: asset.provider,
								showLabel: true
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "font-mono text-xs border-border text-muted-foreground",
								children: ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono text-xs text-muted-foreground",
								children: asset.region
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-mono text-sm ${riskColor(Number(asset.riskScore))}`,
								children: Number(asset.riskScore)
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: Number(asset.openFindings) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "font-mono text-xs bg-destructive/20 text-destructive border-destructive/40",
								children: Number(asset.openFindings)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-mono text-xs",
								children: "0"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground font-mono whitespace-nowrap",
								children: formatDistanceToNow(/* @__PURE__ */ new Date(Number(asset.lastSeen) / 1e6), { addSuffix: true })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									"data-ocid": `assets.details_button.${idx + 1}`,
									className: "h-7 text-xs border-border hover:bg-muted/20 font-mono",
									onClick: () => navigate({ to: `/assets/${asset.id}` }),
									children: "Details"
								})
							})
						]
					}, asset.id)) })] })
				})
			})
		]
	});
}
export { AssetsPage as default };
