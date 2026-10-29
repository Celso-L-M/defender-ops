import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { D as useGetMyProviders, H as useProviderStates, I as useNormalizedAlerts } from "./use-backend-C00QWIg7.js";
import { n as Link } from "./index-B84IBi73.js";
import { t as ArrowRight } from "./arrow-right-qB7g-Bm9.js";
import { t as Layout } from "./Layout-9d6smJ4x.js";
import { t as ProviderIcon } from "./ProviderIcon-9RfPlHNs.js";
import { t as ShieldCheck } from "./shield-check-qpZrj14a.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
import { n as WifiOff, t as Wifi } from "./wifi-CCu9-96-.js";
// src/pages/ProviderOverviewPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PROVIDERS = [
	"AWS",
	"Azure",
	"GCP"
];
var SEVERITIES = [
	"Critical",
	"High",
	"Medium",
	"Low"
];
var PROVIDER_META = {
	AWS: {
		accentClass: "provider-aws",
		to: "/providers/aws",
		ocid: "overview.provider_aws"
	},
	Azure: {
		accentClass: "provider-azure",
		to: "/providers/azure",
		ocid: "overview.provider_azure"
	},
	GCP: {
		accentClass: "provider-gcp",
		to: "/providers/gcp",
		ocid: "overview.provider_gcp"
	}
};
var SEVERITY_STYLES = {
	Critical: "bg-destructive/20 text-destructive border border-destructive/40",
	High: "bg-chart-5/20 text-chart-5 border border-chart-5/40",
	Medium: "bg-warning/20 text-warning border border-warning/40",
	Low: "bg-primary/20 text-primary border border-primary/40",
	Unknown: "bg-muted/30 text-muted-foreground border border-border"
};
function ProviderCard({ provider, alerts, isConnected, hasError }) {
	const meta = PROVIDER_META[provider];
	const activeAlerts = alerts.filter((a) => a.status !== "Resolved");
	const total = activeAlerts.length;
	const severityCounts = SEVERITIES.reduce((acc, sev) => {
		acc[sev] = activeAlerts.filter((a) => a.severity === sev).length;
		return acc;
	}, {
		Critical: 0,
		High: 0,
		Medium: 0,
		Low: 0,
		Unknown: 0
	});
	const connectionLabel = isConnected ? "Connected" : hasError ? "Error" : "Disconnected";
	const ConnectionIcon = isConnected ? Wifi : hasError ? TriangleAlert : WifiOff;
	const connectionClass = isConnected ? "badge-status-connected" : hasError ? "badge-status-error" : "badge-status-inactive";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": `${meta.ocid}.card`,
		className: `${meta.accentClass} provider-shell flex flex-col p-5 transition-smooth hover:border-opacity-80`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, {
					provider,
					className: "text-base"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-1.5 ${connectionClass}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionIcon, { size: 10 }), connectionLabel]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "provider-accent font-display text-4xl font-bold tabular-nums leading-none",
					children: total
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground mt-1.5 font-mono uppercase tracking-widest",
					children: "Active Alerts"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1.5 mb-5",
				children: SEVERITIES.map((sev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center justify-between rounded px-2 py-1 text-xs font-mono ${SEVERITY_STYLES[sev]}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate pr-1",
						children: sev
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold tabular-nums",
						children: severityCounts[sev]
					})]
				}, sev))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: meta.to,
				"data-ocid": `${meta.ocid}.dashboard_link`,
				className: "mt-auto inline-flex items-center justify-between gap-2 rounded-md border border-border bg-background/40 px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/40 transition-smooth",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
					size: 14,
					className: "provider-accent"
				})]
			})
		]
	});
}
function ProviderOverviewPage() {
	const { data: myProviders = [], isLoading: loadingProviders } = useGetMyProviders();
	const { data: providerStates = [] } = useProviderStates();
	const assigned = (0, import_react.useMemo)(() => new Set(myProviders), [myProviders]);
	const visibleProviders = PROVIDERS.filter((p) => assigned.has(p));
	const awsAlerts = useNormalizedAlerts({
		customer: "",
		limit: 500,
		provider: "AWS"
	});
	const azureAlerts = useNormalizedAlerts({
		customer: "",
		limit: 500,
		provider: "Azure"
	});
	const gcpAlerts = useNormalizedAlerts({
		customer: "",
		limit: 500,
		provider: "GCP"
	});
	const alertsByProvider = {
		AWS: awsAlerts.data ?? [],
		Azure: azureAlerts.data ?? [],
		GCP: gcpAlerts.data ?? []
	};
	const loadingAlerts = awsAlerts.isLoading || azureAlerts.isLoading || gcpAlerts.isLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "overview.page",
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-bold text-foreground tracking-tight",
			children: "Provider Overview"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm mt-1",
			children: "Select a cloud provider to open its isolated security dashboard. You only see providers you are assigned to."
		})] }), loadingProviders || loadingAlerts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ocid": "overview.loading_state",
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "provider-shell h-64 animate-pulse bg-muted/20" }, id))
		}) : visibleProviders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "overview.empty_state",
			className: "provider-shell flex flex-col items-center justify-center gap-3 p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
					size: 32,
					className: "text-muted-foreground"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-foreground",
					children: "No providers assigned"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm max-w-sm",
					children: "You are not currently assigned to any cloud provider. Contact an administrator to grant you access to AWS, Azure, or GCP."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ocid": "overview.provider_grid",
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: visibleProviders.map((provider) => {
				const state = providerStates.find((s) => s.provider === provider);
				const isConnected = state?.status === "Active";
				const hasError = state?.status === "Error" || state?.status === "AuthPaused";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCard, {
					provider,
					alerts: alertsByProvider[provider],
					isConnected,
					hasError
				}, provider);
			})
		})]
	}) });
}
export { ProviderOverviewPage as default };
