import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { D as useGetMyProviders, H as useProviderStates, I as useNormalizedAlerts, N as useIsolateResource, U as useRateLimitStates, Y as useRevokeIamCredentials, _ as useDisableAzureAdAccount, d as useComplianceStatus, f as useCorrelatedIncidents, it as useThrottleEvents, l as useBlockIp, o as useAssets, q as useResetProviderBackoff, ut as createLucideIcon, w as useForceGcpIamReview, y as useEscalateToIncident } from "./use-backend-C00QWIg7.js";
import { t as Skeleton } from "./skeleton-Co_kaRlX.js";
import { i as ShieldAlert, l as GitMerge, n as useProviderFilter, o as RefreshCw, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as ProviderIcon } from "./ProviderIcon-9RfPlHNs.js";
import { t as Eye } from "./eye-YXkjTxEs.js";
import { t as LoaderCircle } from "./loader-circle-CHt_0PLM.js";
import { n as Server, t as Shield } from "./shield-CbiefNtr.js";
import { n as CorrelatedIncidentsPanel, r as SquareCheckBig, t as SecurityEventFeed } from "./SecurityEventFeed-DCiiGvXq.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
import { t as UserX } from "./user-x-DKWb52Qw.js";
import { n as WifiOff, t as Wifi } from "./wifi-CCu9-96-.js";
import { t as ue } from "./dist-muuRpw8y.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Activity = createLucideIcon("activity", [["path", {
	d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
	key: "169zse"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Key = createLucideIcon("key", [
	["path", {
		d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",
		key: "g0fldk"
	}],
	["path", {
		d: "m21 2-9.6 9.6",
		key: "1j0ho8"
	}],
	["circle", {
		cx: "7.5",
		cy: "15.5",
		r: "5.5",
		key: "yqb3hr"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Minus = createLucideIcon("minus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RotateCcw = createLucideIcon("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Timer = createLucideIcon("timer", [
	["line", {
		x1: "10",
		x2: "14",
		y1: "2",
		y2: "2",
		key: "14vaq8"
	}],
	["line", {
		x1: "12",
		x2: "15",
		y1: "14",
		y2: "11",
		key: "17fdiu"
	}],
	["circle", {
		cx: "12",
		cy: "14",
		r: "8",
		key: "1e1u0o"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TrendingDown = createLucideIcon("trending-down", [["path", {
	d: "M16 17h6v-6",
	key: "t6n2it"
}], ["path", {
	d: "m22 17-8.5-8.5-5 5L2 7",
	key: "x473p"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TrendingUp = createLucideIcon("trending-up", [["path", {
	d: "M16 7h6v6",
	key: "box55l"
}], ["path", {
	d: "m22 7-8.5 8.5-5-5L2 17",
	key: "1t1m79"
}]]);
// src/components/ProviderCards.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PROVIDERS$2 = [
	"AWS",
	"Azure",
	"GCP"
];
var PROVIDER_COLORS$1 = {
	AWS: {
		border: "border-orange-500",
		glow: "shadow-[0_0_12px_2px_rgba(249,115,22,0.4)]",
		badge: "bg-orange-500/20 text-orange-400 border border-orange-500/40",
		text: "text-orange-400"
	},
	Azure: {
		border: "border-blue-500",
		glow: "shadow-[0_0_12px_2px_rgba(59,130,246,0.4)]",
		badge: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
		text: "text-blue-400"
	},
	GCP: {
		border: "border-green-500",
		glow: "shadow-[0_0_12px_2px_rgba(34,197,94,0.4)]",
		badge: "bg-green-500/20 text-green-400 border border-green-500/40",
		text: "text-green-400"
	}
};
var SEVERITY_STYLES = {
	Critical: "bg-destructive/20 text-red-400 border border-destructive/50",
	High: "bg-orange-500/20 text-orange-400 border border-orange-500/50",
	Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
	Low: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
	Unknown: "bg-muted/30 text-muted-foreground border border-border"
};
var SEVERITIES$1 = [
	"Critical",
	"High",
	"Medium",
	"Low"
];
var ProviderCard = (0, import_react.memo)(function ProviderCard({ provider, isSelected, onSelect }) {
	const colors = PROVIDER_COLORS$1[provider];
	const { data: alerts = [] } = useNormalizedAlerts({
		customer: "default",
		limit: 500,
		provider
	});
	const { data: providerStates = [] } = useProviderStates();
	const prevTotalRef = (0, import_react.useRef)(null);
	const activeAlerts = alerts.filter((a) => a.status !== "Resolved");
	const total = activeAlerts.length;
	const prevTotal = prevTotalRef.current;
	prevTotalRef.current = total;
	const trend = prevTotal === null || prevTotal === total ? "flat" : total > prevTotal ? "up" : "down";
	const severityCounts = SEVERITIES$1.reduce((acc, sev) => {
		acc[sev] = activeAlerts.filter((a) => a.severity === sev).length;
		return acc;
	}, {
		Critical: 0,
		High: 0,
		Medium: 0,
		Low: 0,
		Unknown: 0
	});
	const state = providerStates.find((s) => s.provider === provider);
	const isConnected = state?.status === "Active";
	const hasError = state?.status === "Error" || state?.status === "AuthPaused";
	const connectionLabel = isConnected ? "Connected" : hasError ? "Error" : "Disconnected";
	const connectionClass = isConnected ? "text-green-400 bg-green-500/10 border border-green-500/30" : hasError ? "text-red-400 bg-destructive/10 border border-destructive/30" : "text-muted-foreground bg-muted/20 border border-border";
	const ConnectionIcon = isConnected ? Wifi : hasError ? TriangleAlert : WifiOff;
	const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
	const trendClass = trend === "up" ? "text-red-400" : trend === "down" ? "text-green-400" : "text-muted-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-ocid": `provider_cards.${provider.toLowerCase()}_card`,
		onClick: onSelect,
		className: [
			"w-full text-left rounded-xl p-5 border transition-all duration-200 cursor-pointer",
			"bg-[#1a1d27] hover:border-opacity-80 focus-visible:outline-none focus-visible:ring-2",
			isSelected ? `${colors.border} ${colors.glow}` : `border-[#2a2d3e] hover:${colors.border}`
		].join(" "),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, {
					provider,
					className: "text-base"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${connectionClass}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionIcon, { size: 10 }), connectionLabel]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `text-3xl font-bold font-display ${colors.text}`,
					children: total
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "active alerts"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-1 text-sm font-medium ${trendClass}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendIcon, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs",
						children: [trend === "up" ? "+" : trend === "down" ? "-" : "", prevTotal !== null && prevTotal !== total ? Math.abs(total - prevTotal) : ""]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1.5",
				children: SEVERITIES$1.map((sev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center justify-between rounded px-2 py-1 text-xs font-mono ${SEVERITY_STYLES[sev]}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate pr-1",
						children: sev
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold tabular-nums",
						children: severityCounts[sev]
					})]
				}, sev))
			})
		]
	});
});
function ProviderCards() {
	const { selectedProvider, setSelectedProvider } = useProviderFilter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-ocid": "provider_cards.all_providers_toggle",
				onClick: () => setSelectedProvider(null),
				className: ["rounded-lg px-4 py-1.5 text-sm font-semibold border transition-all duration-200 cursor-pointer", selectedProvider === null ? "bg-primary/20 border-primary text-primary" : "bg-transparent border-[#2a2d3e] text-muted-foreground hover:border-primary/60 hover:text-foreground"].join(" "),
				children: "All Providers"
			}), PROVIDERS$2.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-ocid": `provider_cards.filter_${p.toLowerCase()}`,
				onClick: () => setSelectedProvider(p),
				className: ["rounded-lg px-4 py-1.5 text-sm font-semibold border transition-all duration-200 cursor-pointer", selectedProvider === p ? `${PROVIDER_COLORS$1[p].badge} ${PROVIDER_COLORS$1[p].border}` : "bg-transparent border-[#2a2d3e] text-muted-foreground hover:border-opacity-60"].join(" "),
				children: p
			}, p))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
			children: PROVIDERS$2.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCard, {
				provider: p,
				isSelected: selectedProvider === p,
				onSelect: () => setSelectedProvider(selectedProvider === p ? null : p)
			}, p))
		})]
	});
}
// src/components/QuickActionsToolbar.tsx
var SEVERITIES = [
	"Critical",
	"High",
	"Medium",
	"Low"
];
var PROVIDERS$1 = [
	"AWS",
	"Azure",
	"GCP"
];
function showPlaybookToast(result, label) {
	if (result.success) ue.success(result.dryRunPreview ? `[Dry Run] ${label}` : label, {
		description: result.message,
		duration: 5e3
	});
	else ue.error(`${label} failed`, {
		description: "The action could not be completed. Check the audit log for details.",
		duration: 6e3
	});
}
function ModalShell({ title, accentClass, IconEl, onClose, children }) {
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		style: { backgroundColor: "rgba(0,0,0,0.75)" },
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		onKeyDown: (e) => {
			if (e.key === "Escape") onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dialog", {
			open: true,
			className: "relative w-full max-w-md rounded-xl border p-0 shadow-2xl text-left",
			style: {
				backgroundColor: "#1a1d27",
				borderColor: "#2a2d3e"
			},
			"aria-labelledby": "modal-title",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-6 pt-6 pb-4 border-b",
				style: { borderColor: "#2a2d3e" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: accentClass,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconEl, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "modal-title",
						className: "text-base font-semibold text-white font-display",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "quick_action.close_button",
						"aria-label": "Close dialog",
						className: "ml-auto opacity-50 hover:opacity-100 transition-opacity text-white",
						children: "X"
					})
				]
			}), children]
		})
	});
}
function DryRunToggle({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 cursor-pointer select-none",
		"data-ocid": "quick_action.dryrun_toggle",
		onClick: () => onChange(!value),
		onKeyDown: (e) => {
			if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				onChange(!value);
			}
		},
		role: "switch",
		"aria-checked": value,
		tabIndex: 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? "bg-blue-500" : "bg-white/10"}`,
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}` })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs",
			style: { color: "#94a3b8" },
			children: "Dry Run (preview only)"
		})]
	});
}
function DryRunPreview({ preview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg px-3 py-2.5 text-xs border",
		style: {
			backgroundColor: "rgba(59,130,246,0.07)",
			borderColor: "rgba(59,130,246,0.3)",
			color: "#93c5fd"
		},
		"data-ocid": "quick_action.dryrun_preview",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold uppercase tracking-wide text-blue-400 mr-1.5",
			children: "Preview:"
		}), preview]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs font-medium uppercase tracking-wide",
			style: { color: "#64748b" },
			children: label
		}), children]
	});
}
var inputStyle = {
	backgroundColor: "#0f1117",
	border: "1px solid #2a2d3e",
	color: "white"
};
function TextInput({ id, value, onChange, placeholder, type = "text", required = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		type,
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder,
		required,
		"data-ocid": `quick_action.${id}_input`,
		className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition",
		style: inputStyle
	});
}
function SelectInput({ id, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		id,
		value,
		onChange: (e) => onChange(e.target.value),
		"data-ocid": `quick_action.${id}_select`,
		className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition",
		style: inputStyle,
		children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: o,
			children: o
		}, o))
	});
}
function BlockIpModal({ onClose }) {
	const [ip, setIp] = (0, import_react.useState)("");
	const [providers, setProviders] = (0, import_react.useState)(["AWS"]);
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const mutation = useBlockIp();
	const toggleProvider = (p) => setProviders((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (providers.length === 0) {
			ue.error("Select at least one provider");
			return;
		}
		try {
			const result = await mutation.mutateAsync({
				ip: ip.trim(),
				providers,
				dryRun,
				customer: "default"
			});
			showPlaybookToast(result, `Block IP ${ip.trim()}`);
			if (dryRun && result.dryRunPreview) {
				setPreview(result.dryRunPreview);
				return;
			}
			onClose();
		} catch {
			ue.error("Block IP failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
		title: "Block IP",
		accentClass: "text-red-400",
		IconEl: Shield,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: "#94a3b8" },
					children: "Add the IP to network deny rules across selected providers. Takes immediate effect."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "IP Address",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						id: "ip",
						value: ip,
						onChange: setIp,
						placeholder: "e.g. 185.234.219.10"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Providers",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3",
						children: PROVIDERS$1.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-1.5 text-sm cursor-pointer",
							style: { color: "#94a3b8" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: providers.includes(p),
								onChange: () => toggleProvider(p),
								"data-ocid": `quick_action.provider_${p.toLowerCase()}_checkbox`,
								className: "accent-blue-500"
							}), p]
						}, p))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunToggle, {
					value: dryRun,
					onChange: (v) => {
						setDryRun(v);
						setPreview("");
					}
				}),
				preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunPreview, { preview }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !ip.trim() || providers.length === 0 || mutation.isPending,
						"data-ocid": "quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-red-400 border border-red-400/40 hover:bg-red-400/10 flex items-center justify-center gap-1.5",
						children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 14,
							className: "animate-spin"
						}), " Executing"] }) : "Execute"
					})]
				})
			]
		})
	});
}
function IsolateResourceModal({ onClose }) {
	const [resourceId, setResourceId] = (0, import_react.useState)("");
	const [provider, setProvider] = (0, import_react.useState)("AWS");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const mutation = useIsolateResource();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const req = {
			resourceId: resourceId.trim(),
			provider,
			dryRun,
			customer: "default"
		};
		try {
			const result = await mutation.mutateAsync(req);
			showPlaybookToast(result, `Isolate ${resourceId.trim()}`);
			if (dryRun && result.dryRunPreview) {
				setPreview(result.dryRunPreview);
				return;
			}
			onClose();
		} catch {
			ue.error("Isolate Resource failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
		title: "Isolate Resource",
		accentClass: "text-orange-400",
		IconEl: Server,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: "#94a3b8" },
					children: "Quarantine the resource from all network access. The resource will be isolated until reviewed."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Resource ID",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						id: "resource",
						value: resourceId,
						onChange: setResourceId,
						placeholder: "e.g. i-0a1b2c3d4e5f67890"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Provider",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectInput, {
						id: "isolate_provider",
						value: provider,
						onChange: (v) => setProvider(v),
						options: PROVIDERS$1
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunToggle, {
					value: dryRun,
					onChange: (v) => {
						setDryRun(v);
						setPreview("");
					}
				}),
				preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunPreview, { preview }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !resourceId.trim() || mutation.isPending,
						"data-ocid": "quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-orange-400 border border-orange-400/40 hover:bg-orange-400/10 flex items-center justify-center gap-1.5",
						children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 14,
							className: "animate-spin"
						}), " Executing"] }) : "Execute"
					})]
				})
			]
		})
	});
}
function RevokeIamModal({ onClose }) {
	const [userId, setUserId] = (0, import_react.useState)("");
	const [provider, setProvider] = (0, import_react.useState)("AWS");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const mutation = useRevokeIamCredentials();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const req = {
			userId: userId.trim(),
			provider,
			dryRun,
			customer: "default"
		};
		try {
			const result = await mutation.mutateAsync(req);
			showPlaybookToast(result, `Revoke credentials for ${userId.trim()}`);
			if (dryRun && result.dryRunPreview) {
				setPreview(result.dryRunPreview);
				return;
			}
			onClose();
		} catch {
			ue.error("Revoke IAM failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
		title: "Revoke IAM Credentials",
		accentClass: "text-yellow-400",
		IconEl: Key,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: "#94a3b8" },
					children: "Revoke all active sessions and credentials for the specified user. The user will need to re-authenticate."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "User / Role ID",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						id: "iam_user",
						value: userId,
						onChange: setUserId,
						placeholder: "arn:aws:iam::123456789:user/username"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Provider",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectInput, {
						id: "iam_provider",
						value: provider,
						onChange: (v) => setProvider(v),
						options: PROVIDERS$1
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunToggle, {
					value: dryRun,
					onChange: (v) => {
						setDryRun(v);
						setPreview("");
					}
				}),
				preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunPreview, { preview }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !userId.trim() || mutation.isPending,
						"data-ocid": "quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-yellow-400 border border-yellow-400/40 hover:bg-yellow-400/10 flex items-center justify-center gap-1.5",
						children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 14,
							className: "animate-spin"
						}), " Executing"] }) : "Execute"
					})]
				})
			]
		})
	});
}
function DisableAzureAdModal({ onClose }) {
	const [upn, setUpn] = (0, import_react.useState)("");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const mutation = useDisableAzureAdAccount();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const req = {
			userPrincipalName: upn.trim(),
			dryRun,
			customer: "default"
		};
		try {
			const result = await mutation.mutateAsync(req);
			showPlaybookToast(result, `Disable Azure AD account ${upn.trim()}`);
			if (dryRun && result.dryRunPreview) {
				setPreview(result.dryRunPreview);
				return;
			}
			onClose();
		} catch {
			ue.error("Disable Azure AD failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
		title: "Disable Azure AD Account",
		accentClass: "text-blue-400",
		IconEl: UserX,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: "#94a3b8" },
					children: "Disable the Azure AD account immediately. The user will be signed out of all sessions."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "User Principal Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						id: "azure_upn",
						value: upn,
						onChange: setUpn,
						placeholder: "user@company.onmicrosoft.com",
						type: "email"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunToggle, {
					value: dryRun,
					onChange: (v) => {
						setDryRun(v);
						setPreview("");
					}
				}),
				preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunPreview, { preview }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !upn.trim() || mutation.isPending,
						"data-ocid": "quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 border border-blue-400/40 hover:bg-blue-400/10 flex items-center justify-center gap-1.5",
						children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 14,
							className: "animate-spin"
						}), " Executing"] }) : "Execute"
					})]
				})
			]
		})
	});
}
function GcpIamReviewModal({ onClose }) {
	const [projectId, setProjectId] = (0, import_react.useState)("");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const mutation = useForceGcpIamReview();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const req = {
			projectId: projectId.trim(),
			dryRun,
			customer: "default"
		};
		try {
			const result = await mutation.mutateAsync(req);
			showPlaybookToast(result, `GCP IAM Review for ${projectId.trim()}`);
			if (dryRun && result.dryRunPreview) {
				setPreview(result.dryRunPreview);
				return;
			}
			onClose();
		} catch {
			ue.error("GCP IAM Review failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
		title: "Force GCP IAM Review",
		accentClass: "text-green-400",
		IconEl: Eye,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: "#94a3b8" },
					children: "Generate an IAM review report for the GCP project. All overprivileged bindings will be flagged and posted to the incident record."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "GCP Project ID",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						id: "gcp_project",
						value: projectId,
						onChange: setProjectId,
						placeholder: "e.g. my-project-123456"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunToggle, {
					value: dryRun,
					onChange: (v) => {
						setDryRun(v);
						setPreview("");
					}
				}),
				preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunPreview, { preview }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !projectId.trim() || mutation.isPending,
						"data-ocid": "quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-green-400 border border-green-400/40 hover:bg-green-400/10 flex items-center justify-center gap-1.5",
						children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 14,
							className: "animate-spin"
						}), " Executing"] }) : "Execute"
					})]
				})
			]
		})
	});
}
function EscalateModal({ onClose }) {
	const [alertId, setAlertId] = (0, import_react.useState)("");
	const [severity, setSeverity] = (0, import_react.useState)("High");
	const [owner, setOwner] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const mutation = useEscalateToIncident();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const req = {
			alertId: alertId.trim(),
			severity,
			assignedOwner: owner.trim(),
			notes: notes.trim(),
			customer: "default",
			dryRun
		};
		try {
			const result = await mutation.mutateAsync(req);
			showPlaybookToast(result, `Escalate alert ${alertId.trim()} to incident`);
			if (dryRun && result.dryRunPreview) {
				setPreview(result.dryRunPreview);
				return;
			}
			onClose();
		} catch {
			ue.error("Escalate to Incident failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalShell, {
		title: "Escalate to Incident",
		accentClass: "text-purple-400",
		IconEl: TriangleAlert,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: "#94a3b8" },
					children: "Promote the alert to a full incident response case. The security team will be notified immediately."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Alert ID",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						id: "alert_id",
						value: alertId,
						onChange: setAlertId,
						placeholder: "e.g. alert-uuid or 'UnauthorizedAccess:EC2'"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Severity",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectInput, {
						id: "escalate_severity",
						value: severity,
						onChange: (v) => setSeverity(v),
						options: SEVERITIES
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Assigned Owner",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						id: "owner",
						value: owner,
						onChange: setOwner,
						placeholder: "e.g. john.doe@company.com",
						required: false
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "notes",
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Additional context for the incident...",
						rows: 3,
						"data-ocid": "quick_action.notes_textarea",
						className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition resize-none",
						style: inputStyle
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunToggle, {
					value: dryRun,
					onChange: (v) => {
						setDryRun(v);
						setPreview("");
					}
				}),
				preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryRunPreview, { preview }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !alertId.trim() || mutation.isPending,
						"data-ocid": "quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-purple-400 border border-purple-400/40 hover:bg-purple-400/10 flex items-center justify-center gap-1.5",
						children: mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 14,
							className: "animate-spin"
						}), " Executing"] }) : "Execute"
					})]
				})
			]
		})
	});
}
var ACTION_BUTTONS = [
	{
		id: "blockIp",
		label: "Block IP",
		icon: Shield,
		accent: "text-red-400",
		hoverBorder: "hover:border-red-400"
	},
	{
		id: "isolateResource",
		label: "Isolate Resource",
		icon: Server,
		accent: "text-orange-400",
		hoverBorder: "hover:border-orange-400"
	},
	{
		id: "revokeIam",
		label: "Revoke IAM Credentials",
		icon: Key,
		accent: "text-yellow-400",
		hoverBorder: "hover:border-yellow-400"
	},
	{
		id: "disableAD",
		label: "Disable Azure AD Account",
		icon: UserX,
		accent: "text-blue-400",
		hoverBorder: "hover:border-blue-400"
	},
	{
		id: "gcpIamReview",
		label: "Force GCP IAM Review",
		icon: Eye,
		accent: "text-green-400",
		hoverBorder: "hover:border-green-400"
	},
	{
		id: "escalate",
		label: "Escalate to Incident",
		icon: TriangleAlert,
		accent: "text-purple-400",
		hoverBorder: "hover:border-purple-400"
	}
];
function QuickActionsToolbar() {
	const [activeAction, setActiveAction] = (0, import_react.useState)(null);
	const closeModal = (0, import_react.useCallback)(() => setActiveAction(null), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ocid": "quick_actions.panel",
			className: "sticky bottom-0 border-t py-3 px-6 z-40",
			style: {
				backgroundColor: "#0f1117",
				borderColor: "#2a2d3e"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-widest mr-2",
					style: { color: "#4a5568" },
					children: "Quick Actions"
				}), ACTION_BUTTONS.map((action) => {
					const Icon = action.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveAction(action.id),
						"data-ocid": `quick_action.${action.id}_button`,
						className: `flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-all ${action.accent} ${action.hoverBorder} hover:bg-white/5 active:scale-95`,
						style: {
							backgroundColor: "#1a1d27",
							borderColor: "#2a2d3e"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							size: 14,
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: action.label })]
					}, action.id);
				})]
			})
		}),
		activeAction === "blockIp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockIpModal, { onClose: closeModal }),
		activeAction === "isolateResource" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IsolateResourceModal, { onClose: closeModal }),
		activeAction === "revokeIam" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevokeIamModal, { onClose: closeModal }),
		activeAction === "disableAD" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DisableAzureAdModal, { onClose: closeModal }),
		activeAction === "gcpIamReview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GcpIamReviewModal, { onClose: closeModal }),
		activeAction === "escalate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscalateModal, { onClose: closeModal })
	] });
}
// src/components/RiskScoreWidget.tsx
var PROVIDER_COLORS = {
	AWS: "#f97316",
	Azure: "#3b82f6",
	GCP: "#22c55e"
};
function computeWeight(severity) {
	switch (severity) {
		case "Critical": return 4;
		case "High": return 3;
		case "Medium": return 2;
		case "Low": return 1;
		default: return 0;
	}
}
function getRiskZone(score) {
	if (score <= 30) return {
		label: "Low Risk",
		color: "#22c55e"
	};
	if (score <= 60) return {
		label: "Moderate",
		color: "#eab308"
	};
	if (score <= 85) return {
		label: "High",
		color: "#f97316"
	};
	return {
		label: "Critical",
		color: "#ef4444"
	};
}
function RiskGauge({ score, color }) {
	const radius = 72;
	const stroke = 10;
	const normalizedRadius = radius - stroke / 2;
	const circumference = 2 * Math.PI * normalizedRadius;
	const arcLength = circumference * .75;
	const filled = arcLength * (score / 100);
	const rotation = 135;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: 144,
		height: 144,
		viewBox: `0 0 144 144`,
		role: "img",
		"aria-label": `Risk score: ${score}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: radius,
				cy: radius,
				r: normalizedRadius,
				fill: "none",
				stroke: "#2a2d3e",
				strokeWidth: stroke,
				strokeDasharray: `${arcLength} ${circumference}`,
				strokeDashoffset: 0,
				strokeLinecap: "round",
				transform: `rotate(${rotation} ${radius} ${radius})`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: radius,
				cy: radius,
				r: normalizedRadius,
				fill: "none",
				stroke: color,
				strokeWidth: stroke,
				strokeDasharray: `${filled} ${circumference}`,
				strokeDashoffset: 0,
				strokeLinecap: "round",
				transform: `rotate(${rotation} ${radius} ${radius})`,
				style: {
					transition: "stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease",
					filter: score >= 86 ? `drop-shadow(0 0 6px ${color}80)` : void 0
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: radius,
				y: 68,
				textAnchor: "middle",
				dominantBaseline: "middle",
				fill: "#f1f5f9",
				fontSize: "28",
				fontWeight: "700",
				fontFamily: "'Space Grotesk', sans-serif",
				children: score
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: radius,
				y: 94,
				textAnchor: "middle",
				fill: "#94a3b8",
				fontSize: "10",
				fontFamily: "'DM Sans', sans-serif",
				children: "/ 100"
			})
		]
	});
}
function ProviderBar({ provider, percentage }) {
	const color = PROVIDER_COLORS[provider];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-semibold w-10 shrink-0",
				style: {
					color,
					fontFamily: "'Space Grotesk', sans-serif"
				},
				children: provider
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 h-1.5 rounded-full",
				style: { backgroundColor: "#2a2d3e" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 rounded-full",
					style: {
						width: `${percentage}%`,
						backgroundColor: color,
						transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
						boxShadow: `0 0 4px ${color}60`
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs tabular-nums w-10 text-right",
				style: {
					color: "#94a3b8",
					fontFamily: "'JetBrains Mono', monospace"
				},
				children: [percentage.toFixed(0), "%"]
			})
		]
	});
}
var PROVIDERS = [
	"AWS",
	"Azure",
	"GCP"
];
function RiskScoreWidget() {
	const { data: alerts = [], isLoading } = useNormalizedAlerts({
		customer: "default",
		limit: 500
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl p-6",
		style: {
			backgroundColor: "#1a1d27",
			border: "1px solid #2a2d3e"
		},
		"data-ocid": "risk_score.card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
					className: "w-36 h-36 rounded-full",
					style: { background: "#2a2d3e" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
					className: "w-28 h-4 rounded",
					style: { background: "#2a2d3e" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full space-y-2",
					children: PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
						className: "w-full h-3 rounded",
						style: { background: "#2a2d3e" }
					}, p))
				})
			]
		})
	});
	const totalAlerts = alerts.length;
	const totalWeightedPoints = alerts.reduce((sum, a) => sum + computeWeight(a.severity), 0);
	const maxPossiblePoints = totalAlerts * 4;
	const rawScore = maxPossiblePoints > 0 ? totalWeightedPoints / maxPossiblePoints * 100 : 0;
	const score = Math.min(100, Math.round(rawScore));
	const providerWeights = {
		AWS: 0,
		Azure: 0,
		GCP: 0
	};
	for (const alert of alerts) if (alert.provider in providerWeights) providerWeights[alert.provider] += computeWeight(alert.severity);
	const providerContributions = {
		AWS: totalWeightedPoints > 0 ? providerWeights.AWS / totalWeightedPoints * 100 : 0,
		Azure: totalWeightedPoints > 0 ? providerWeights.Azure / totalWeightedPoints * 100 : 0,
		GCP: totalWeightedPoints > 0 ? providerWeights.GCP / totalWeightedPoints * 100 : 0
	};
	const { label, color } = getRiskZone(score);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl p-6",
		style: {
			backgroundColor: "#1a1d27",
			border: "1px solid #2a2d3e"
		},
		"data-ocid": "risk_score.card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold mb-4 tracking-wide uppercase",
				style: {
					color: "#94a3b8",
					fontFamily: "'Space Grotesk', sans-serif"
				},
				children: "Global Risk Score"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-1",
				"data-ocid": "risk_score.gauge",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskGauge, {
						score,
						color
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold mt-1 tracking-wide",
						style: {
							color,
							fontFamily: "'Space Grotesk', sans-serif"
						},
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs mt-0.5",
						style: { color: "#64748b" },
						children: totalAlerts === 0 ? "No active alerts" : `${totalAlerts} active alert${totalAlerts !== 1 ? "s" : ""}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-4",
				style: { borderTop: "1px solid #2a2d3e" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				"data-ocid": "risk_score.provider_breakdown",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wider font-medium mb-2",
					style: {
						color: "#64748b",
						fontFamily: "'Space Grotesk', sans-serif"
					},
					children: "Provider Contribution"
				}), PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderBar, {
					provider: p,
					percentage: providerContributions[p]
				}, p))]
			})
		]
	});
}
// src/pages/DashboardPage.tsx
function timestampToDate(ts) {
	const date = new Date(Number(ts / 1000000n));
	return Number.isNaN(date.getTime()) ? null : date;
}
function formatTimestamp(ts) {
	const d = timestampToDate(ts);
	if (!d) return "—";
	return d.toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatCountdown(seconds) {
	if (seconds <= 0) return "ready";
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
	return `${s}s`;
}
var StatCard = (0, import_react.memo)(function StatCard({ label, value, isLoading, color, icon, ocid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": ocid,
		className: "rounded-lg border p-4 flex items-center gap-3",
		style: {
			background: "#1a1d27",
			borderColor: "#2a2d3e"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `shrink-0 ${color}`,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate",
				children: label
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 h-5 w-16 rounded bg-muted/30 animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `font-display text-xl font-bold ${color} tabular-nums`,
				children: value
			})]
		})]
	});
});
var ProviderFilterBar = (0, import_react.memo)(function ProviderFilterBar() {
	const { selectedProvider, setSelectedProvider } = useProviderFilter();
	const options = [
		null,
		"AWS",
		"Azure",
		"GCP"
	];
	const labels = {
		all: "All Providers",
		AWS: "AWS",
		Azure: "Azure",
		GCP: "GCP"
	};
	const providerColors = {
		AWS: "text-orange-400 border-orange-400/50 bg-orange-400/10",
		Azure: "text-blue-400 border-blue-400/50 bg-blue-400/10",
		GCP: "text-green-400 border-green-400/50 bg-green-400/10"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "dashboard.provider_filter",
		className: "flex items-center gap-2 flex-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-1",
			children: "Filter:"
		}), options.map((p) => {
			const key = p ?? "all";
			const isActive = selectedProvider === p;
			const colorCls = p ? providerColors[p] : "";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-ocid": `dashboard.provider_filter.${key}`,
				onClick: () => setSelectedProvider(p),
				className: ["rounded border px-3 py-1 font-mono text-xs transition-all", isActive ? p ? colorCls : "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"].join(" "),
				children: labels[key]
			}, key);
		})]
	});
});
var PROVIDER_ACCENT = {
	AWS: "text-orange-400",
	Azure: "text-blue-400",
	GCP: "text-green-400"
};
var PROVIDER_BADGE = {
	AWS: "bg-orange-500/15 text-orange-400 border border-orange-500/40",
	Azure: "bg-blue-500/15 text-blue-400 border border-blue-500/40",
	GCP: "bg-green-500/15 text-green-400 border border-green-500/40"
};
function backoffTone(state) {
	if (Number(state.backoffSeconds) > 0) return {
		label: "Backing off",
		className: "bg-destructive/15 text-red-400 border border-destructive/40"
	};
	if (Number(state.consecutiveThrottles) > 0) return {
		label: "Recovered",
		className: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/40"
	};
	return {
		label: "Healthy",
		className: "bg-green-500/15 text-green-400 border border-green-500/40"
	};
}
var BackoffCard = (0, import_react.memo)(function BackoffCard({ state, now, onReset, isResetting }) {
	const provider = state.provider;
	const backoffSeconds = Number(state.backoffSeconds);
	const throttles = Number(state.consecutiveThrottles);
	const nextAttempt = state.nextAttemptAt ? timestampToDate(state.nextAttemptAt) : null;
	const secondsUntilNext = nextAttempt ? Math.max(0, Math.round((nextAttempt.getTime() - now) / 1e3)) : 0;
	const tone = backoffTone(state);
	const isActive = backoffSeconds > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": `dashboard.backoff.card.${provider.toLowerCase()}`,
		className: "rounded-lg border p-4 space-y-3",
		style: {
			background: "#12141c",
			borderColor: "#2a2d3e"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `font-display text-sm font-bold ${PROVIDER_ACCENT[provider]}`,
					children: provider
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"data-ocid": `dashboard.backoff.status.${provider.toLowerCase()}`,
					className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone.className}`,
					children: tone.label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-3 gap-2 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border border-border/60 bg-muted/10 px-2 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
							children: "Backoff"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							"data-ocid": `dashboard.backoff.seconds.${provider.toLowerCase()}`,
							className: "font-display text-base font-bold text-foreground tabular-nums",
							children: [backoffSeconds, "s"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border border-border/60 bg-muted/10 px-2 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
							children: "Throttles"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							"data-ocid": `dashboard.backoff.throttles.${provider.toLowerCase()}`,
							className: "font-display text-base font-bold text-foreground tabular-nums",
							children: throttles
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border border-border/60 bg-muted/10 px-2 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
							children: "Next Try"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							"data-ocid": `dashboard.backoff.next_attempt.${provider.toLowerCase()}`,
							className: "font-display text-base font-bold text-foreground tabular-nums",
							children: isActive ? formatCountdown(secondsUntilNext) : "—"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] text-muted-foreground truncate",
					children: state.lastThrottledAt ? `Last throttled ${formatTimestamp(state.lastThrottledAt)}` : "No throttling recorded"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-ocid": `dashboard.backoff.reset_button.${provider.toLowerCase()}`,
					onClick: () => onReset(provider),
					disabled: isResetting || !isActive && throttles === 0,
					className: "inline-flex shrink-0 items-center gap-1 rounded border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 11 }), "Reset"]
				})]
			})
		]
	});
});
var ThrottleEventRow = (0, import_react.memo)(function ThrottleEventRow({ event, index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-ocid": `dashboard.throttle_events.item.${index + 1}`,
		className: "flex items-start gap-3 border-b border-border/50 px-3 py-2 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${PROVIDER_BADGE[event.provider]}`,
			children: event.provider
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs text-foreground",
				children: event.message
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 font-mono text-[10px] text-muted-foreground",
				children: [
					formatTimestamp(event.timestamp),
					event.statusCode !== void 0 ? ` · HTTP ${Number(event.statusCode)}` : "",
					event.retryAfterSec !== void 0 ? ` · retry after ${Number(event.retryAfterSec)}s` : ""
				]
			})]
		})]
	});
});
var RateLimitBackoffPanel = (0, import_react.memo)(function RateLimitBackoffPanel() {
	const { selectedProvider } = useProviderFilter();
	const { data: myProviders } = useGetMyProviders();
	const { data: states, isLoading: loadingStates } = useRateLimitStates();
	const { data: events, isLoading: loadingEvents } = useThrottleEvents(selectedProvider, 25);
	const resetBackoff = useResetProviderBackoff();
	const assigned = (0, import_react.useMemo)(() => myProviders ?? [], [myProviders]);
	const visibleStates = (0, import_react.useMemo)(() => (states ?? []).filter((s) => assigned.includes(s.provider) && (!selectedProvider || s.provider === selectedProvider)), [
		states,
		assigned,
		selectedProvider
	]);
	const visibleEvents = (0, import_react.useMemo)(() => (events ?? []).filter((e) => assigned.includes(e.provider)), [events, assigned]);
	const now = Date.now();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"data-ocid": "dashboard.rate_limit.section",
		className: "rounded-lg border",
		style: {
			background: "#1a1d27",
			borderColor: "#2a2d3e"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-3 border-b px-5 py-3",
			style: { borderColor: "#2a2d3e" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {
					size: 16,
					className: "text-primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-sm font-bold uppercase tracking-wider text-foreground",
					children: "Rate-Limit Backoff"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
				children: "Auto-refreshing"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-5 p-5 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "dashboard.backoff.panel",
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "Provider Backoff State"
				}), loadingStates ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "dashboard.backoff.loading_state",
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: Array.from({ length: 2 }, (_, i) => `backoff-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 animate-pulse rounded-lg border border-border/60 bg-muted/20" }, id))
				}) : visibleStates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "dashboard.backoff.empty_state",
					className: "rounded-lg border border-dashed border-border px-4 py-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
							size: 20,
							className: "mx-auto mb-2 text-muted-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground",
							children: "No backoff activity for your providers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Counters appear here when ingestion retries after a provider throttles a request."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: visibleStates.map((state) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackoffCard, {
						state,
						now,
						onReset: (p) => resetBackoff.mutate(p),
						isResetting: resetBackoff.isPending
					}, state.provider))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "dashboard.throttle_events.panel",
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "Recent Throttling Events"
				}), loadingEvents ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "dashboard.throttle_events.loading_state",
					className: "space-y-2",
					children: Array.from({ length: 4 }, (_, i) => `event-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 animate-pulse rounded border border-border/60 bg-muted/20" }, id))
				}) : visibleEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "dashboard.throttle_events.empty_state",
					className: "rounded-lg border border-dashed border-border px-4 py-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
							size: 20,
							className: "mx-auto mb-2 text-muted-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground",
							children: "No throttling events"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Provider rate-limit responses will be logged here as ingestion retries."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"data-ocid": "dashboard.throttle_events.list",
					className: "max-h-72 overflow-y-auto rounded-lg border border-border/60",
					children: visibleEvents.map((event, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThrottleEventRow, {
						event,
						index: i
					}, event.id))
				})]
			})]
		})]
	});
});
function DashboardPage() {
	const { selectedProvider } = useProviderFilter();
	const { data: allAlerts, isLoading: loadingAlerts } = useNormalizedAlerts({
		customer: "",
		limit: 1e3,
		...selectedProvider ? { provider: selectedProvider } : {},
		status: "Open"
	});
	const { data: incidents, isLoading: loadingIncidents } = useCorrelatedIncidents(200);
	const { data: assets, isLoading: loadingAssets } = useAssets("", 1e3);
	const { data: complianceData, isLoading: loadingCompliance } = useComplianceStatus("NISTCSF");
	const totalActiveAlerts = allAlerts?.length ?? 0;
	const openIncidents = (0, import_react.useMemo)(() => (incidents ?? []).filter(([, inc]) => inc.status === "Open").length, [incidents]);
	const assetsAtRisk = (0, import_react.useMemo)(() => (assets ?? []).filter((a) => Number(a.riskScore ?? 0) > 0).length, [assets]);
	const complianceScore = (0, import_react.useMemo)(() => complianceData ? Number(complianceData.score ?? 0n) : 0, [complianceData]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "dashboard.page",
		className: "min-h-screen",
		style: { background: "#0f1117" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ocid": "dashboard.stats_bar",
			className: "border-b px-6 py-4",
			style: {
				borderColor: "#2a2d3e",
				background: "#1a1d27"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Active Alerts",
						value: totalActiveAlerts,
						isLoading: loadingAlerts,
						color: "text-destructive",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 16 }),
						ocid: "dashboard.stat.total_alerts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Open Incidents",
						value: openIncidents,
						isLoading: loadingIncidents,
						color: "text-orange-400",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitMerge, { size: 16 }),
						ocid: "dashboard.stat.open_incidents"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Assets at Risk",
						value: assetsAtRisk,
						isLoading: loadingAssets,
						color: "text-yellow-400",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { size: 16 }),
						ocid: "dashboard.stat.assets_at_risk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Compliance Score",
						value: `${complianceScore}%`,
						isLoading: loadingCompliance,
						color: "text-green-400",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { size: 16 }),
						ocid: "dashboard.stat.compliance_score"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-6 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderFilterBar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateLimitBackoffPanel, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-ocid": "dashboard.risk_score.section",
							className: "lg:col-span-1 rounded-lg border p-5",
							style: {
								background: "#1a1d27",
								borderColor: "#2a2d3e"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskScoreWidget, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-ocid": "dashboard.provider_cards.section",
							className: "md:col-span-1 lg:col-span-2 rounded-lg border p-5",
							style: {
								background: "#1a1d27",
								borderColor: "#2a2d3e"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCards, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-ocid": "dashboard.event_feed.section",
							className: "md:col-span-2 lg:col-span-2 rounded-lg border",
							style: {
								background: "#1a1d27",
								borderColor: "#2a2d3e"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityEventFeed, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-ocid": "dashboard.correlated_incidents.section",
							className: "md:col-span-2 lg:col-span-1 rounded-lg border",
							style: {
								background: "#1a1d27",
								borderColor: "#2a2d3e"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorrelatedIncidentsPanel, {})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "dashboard.quick_actions.section",
					className: "rounded-lg border p-5",
					style: {
						background: "#1a1d27",
						borderColor: "#2a2d3e"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickActionsToolbar, {})
				})
			]
		})]
	}) });
}
export { DashboardPage as default };
