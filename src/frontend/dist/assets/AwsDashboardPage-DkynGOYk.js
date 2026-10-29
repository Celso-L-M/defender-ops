import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { D as useGetMyProviders, H as useProviderStates, I as useNormalizedAlerts, N as useIsolateResource, Y as useRevokeIamCredentials, d as useComplianceStatus, f as useCorrelatedIncidents, l as useBlockIp, o as useAssets, ut as createLucideIcon } from "./use-backend-C00QWIg7.js";
import { t as LoadingSpinner } from "./index-B84IBi73.js";
import { i as ShieldAlert, l as GitMerge, n as useProviderFilter, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as ProviderCredentialsForm } from "./ProviderCredentialsForm-Be487TgG.js";
import { t as LoaderCircle } from "./loader-circle-CHt_0PLM.js";
import { n as Server, t as Shield } from "./shield-CbiefNtr.js";
import { t as ShieldCheck } from "./shield-check-qpZrj14a.js";
import { n as CorrelatedIncidentsPanel, r as SquareCheckBig, t as SecurityEventFeed } from "./SecurityEventFeed-DCiiGvXq.js";
import { t as ue } from "./dist-muuRpw8y.js";
import { t as StatusBadge } from "./StatusBadge-GI1o9Oiw.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Boxes = createLucideIcon("boxes", [
	["path", {
		d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
		key: "lc1i9w"
	}],
	["path", {
		d: "m7 16.5-4.74-2.85",
		key: "1o9zyk"
	}],
	["path", {
		d: "m7 16.5 5-3",
		key: "va8pkn"
	}],
	["path", {
		d: "M7 16.5v5.17",
		key: "jnp8gn"
	}],
	["path", {
		d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
		key: "8zsnat"
	}],
	["path", {
		d: "m17 16.5-5-3",
		key: "8arw3v"
	}],
	["path", {
		d: "m17 16.5 4.74-2.85",
		key: "8rfmw"
	}],
	["path", {
		d: "M17 16.5v5.17",
		key: "k6z78m"
	}],
	["path", {
		d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
		key: "1xygjf"
	}],
	["path", {
		d: "M12 8 7.26 5.15",
		key: "1vbdud"
	}],
	["path", {
		d: "m12 8 4.74-2.85",
		key: "3rx089"
	}],
	["path", {
		d: "M12 13.5V8",
		key: "1io7kd"
	}]
]);
// src/pages/AwsDashboardPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AWS = "AWS";
var SEVERITIES = [
	"Critical",
	"High",
	"Medium",
	"Low"
];
var SEVERITY_STYLES = {
	Critical: "bg-destructive/20 text-destructive border border-destructive/40",
	High: "bg-chart-5/20 text-chart-5 border border-chart-5/40",
	Medium: "bg-warning/20 text-warning border border-warning/40",
	Low: "bg-primary/20 text-primary border border-primary/40",
	Unknown: "bg-muted/30 text-muted-foreground border border-border"
};
function severityWeight(severity) {
	switch (severity) {
		case "Critical": return 4;
		case "High": return 3;
		case "Medium": return 2;
		case "Low": return 1;
		default: return 0;
	}
}
function riskZone(score) {
	if (score <= 30) return {
		label: "Low Risk",
		cls: "text-success"
	};
	if (score <= 60) return {
		label: "Moderate",
		cls: "text-warning"
	};
	if (score <= 85) return {
		label: "High",
		cls: "text-chart-5"
	};
	return {
		label: "Critical",
		cls: "text-destructive"
	};
}
function formatLastSeen(ns) {
	const ms = Number(ns / 1000000n);
	const diff = Date.now() - ms;
	const mins = Math.floor(diff / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	return new Date(ms).toLocaleDateString();
}
function riskTone(score) {
	if (score > 60) return "text-destructive";
	if (score > 0) return "text-warning";
	return "text-muted-foreground";
}
function StatCard({ label, value, isLoading, tone, icon, ocid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": ocid,
		className: "provider-shell provider-tint flex items-center gap-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `shrink-0 ${tone}`,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate",
				children: label
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 h-5 w-16 rounded bg-muted/30 animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `font-display text-xl font-bold ${tone} tabular-nums`,
				children: value
			})]
		})]
	});
}
function AwsRiskScoreCard({ alerts, isLoading }) {
	const totalWeighted = alerts.reduce((sum, a) => sum + severityWeight(a.severity), 0);
	const maxPossible = alerts.length * 4;
	const rawScore = maxPossible > 0 ? totalWeighted / maxPossible * 100 : 0;
	const score = Math.min(100, Math.round(rawScore));
	const zone = riskZone(score);
	const counts = SEVERITIES.reduce((acc, sev) => {
		acc[sev] = alerts.filter((a) => a.severity === sev).length;
		return acc;
	}, {
		Critical: 0,
		High: 0,
		Medium: 0,
		Low: 0,
		Unknown: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "aws_dashboard.risk_score.card",
		className: "provider-shell provider-tint flex flex-col p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-sm font-semibold text-foreground tracking-wide",
				children: "AWS Risk Score"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
				size: 16,
				className: "provider-accent"
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 w-16 rounded-full bg-muted/30 animate-pulse mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-24 rounded bg-muted/30 animate-pulse mx-auto" })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "provider-accent font-display text-4xl font-bold tabular-nums leading-none",
						children: score
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest",
						children: "/ 100"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-sm font-bold mt-1 ${zone.cls}`,
						children: zone.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: alerts.length === 0 ? "No active AWS alerts" : `${alerts.length} active AWS alert${alerts.length !== 1 ? "s" : ""}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 border-t border-border/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1.5",
				children: SEVERITIES.map((sev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center justify-between rounded px-2 py-1 text-xs font-mono ${SEVERITY_STYLES[sev]}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate pr-1",
						children: sev
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold tabular-nums",
						children: counts[sev]
					})]
				}, sev))
			})
		] })]
	});
}
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
function AwsActionModal({ title, icon, accentClass, onClose, children }) {
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
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "provider-shell provider-aws relative w-full max-w-md rounded-xl border p-0 shadow-2xl text-left",
			style: { backgroundColor: "#1a1d27" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#2a2d3e]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: accentClass,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(icon, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold text-white font-display",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "aws_quick_action.close_button",
						"aria-label": "Close dialog",
						className: "ml-auto opacity-50 hover:opacity-100 transition-opacity text-white",
						children: "X"
					})
				]
			}), children]
		})
	});
}
function BlockIpAwsModal({ onClose }) {
	const [ip, setIp] = (0, import_react.useState)("");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const mutation = useBlockIp();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const req = {
			ip: ip.trim(),
			providers: [AWS],
			dryRun,
			customer: "default"
		};
		try {
			showPlaybookToast(await mutation.mutateAsync(req), `Block IP ${ip.trim()} on AWS`);
			if (!dryRun) onClose();
		} catch {
			ue.error("Block IP failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AwsActionModal, {
		title: "Block IP (AWS)",
		icon: Shield,
		accentClass: "text-orange-400",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Add the IP to AWS network ACL deny rules. Takes immediate effect on AWS resources only."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: "IP Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: ip,
						onChange: (e) => setIp(e.target.value),
						placeholder: "e.g. 185.234.219.10",
						"data-ocid": "aws_quick_action.ip_input",
						className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500",
						style: {
							backgroundColor: "#0f1117",
							border: "1px solid #2a2d3e",
							color: "white"
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 cursor-pointer select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: dryRun,
						onChange: (e) => setDryRun(e.target.checked),
						"data-ocid": "aws_quick_action.dryrun_toggle",
						className: "accent-orange-500"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Dry Run (preview only)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "aws_quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !ip.trim() || mutation.isPending,
						"data-ocid": "aws_quick_action.confirm_button",
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
function IsolateAwsModal({ onClose }) {
	const [resourceId, setResourceId] = (0, import_react.useState)("");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const mutation = useIsolateResource();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const req = {
			resourceId: resourceId.trim(),
			provider: AWS,
			dryRun,
			customer: "default"
		};
		try {
			showPlaybookToast(await mutation.mutateAsync(req), `Isolate ${resourceId.trim()} on AWS`);
			if (!dryRun) onClose();
		} catch {
			ue.error("Isolate Resource failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AwsActionModal, {
		title: "Isolate AWS Resource",
		icon: Server,
		accentClass: "text-orange-400",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Quarantine the AWS resource from all network access until reviewed."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: "Resource ID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: resourceId,
						onChange: (e) => setResourceId(e.target.value),
						placeholder: "e.g. arn:aws:ec2:us-east-1:123456789012:instance/i-0abcd1234efgh5678",
						"data-ocid": "aws_quick_action.resource_input",
						className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500",
						style: {
							backgroundColor: "#0f1117",
							border: "1px solid #2a2d3e",
							color: "white"
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 cursor-pointer select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: dryRun,
						onChange: (e) => setDryRun(e.target.checked),
						"data-ocid": "aws_quick_action.dryrun_toggle",
						className: "accent-orange-500"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Dry Run (preview only)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "aws_quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !resourceId.trim() || mutation.isPending,
						"data-ocid": "aws_quick_action.confirm_button",
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
function RevokeIamAwsModal({ onClose }) {
	const [userId, setUserId] = (0, import_react.useState)("");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const mutation = useRevokeIamCredentials();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const req = {
			userId: userId.trim(),
			provider: AWS,
			dryRun,
			customer: "default"
		};
		try {
			showPlaybookToast(await mutation.mutateAsync(req), `Revoke IAM credentials for ${userId.trim()}`);
			if (!dryRun) onClose();
		} catch {
			ue.error("Revoke IAM Credentials failed", { description: "The action could not be completed. Check the audit log." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AwsActionModal, {
		title: "Revoke AWS IAM Credentials",
		icon: ShieldCheck,
		accentClass: "text-orange-400",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Revoke the AWS IAM user's access keys and credentials immediately. Scoped to AWS only."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: "IAM User ID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: userId,
						onChange: (e) => setUserId(e.target.value),
						placeholder: "e.g. AIDAEXAMPLEUSERID",
						"data-ocid": "aws_quick_action.user_input",
						className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500",
						style: {
							backgroundColor: "#0f1117",
							border: "1px solid #2a2d3e",
							color: "white"
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 cursor-pointer select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: dryRun,
						onChange: (e) => setDryRun(e.target.checked),
						"data-ocid": "aws_quick_action.dryrun_toggle",
						className: "accent-orange-500"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Dry Run (preview only)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "aws_quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !userId.trim() || mutation.isPending,
						"data-ocid": "aws_quick_action.confirm_button",
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
var AWS_ACTIONS = [
	{
		id: "blockIp",
		label: "Block IP",
		icon: Shield
	},
	{
		id: "isolate",
		label: "Isolate Resource",
		icon: Server
	},
	{
		id: "revokeIam",
		label: "Revoke IAM Credentials",
		icon: ShieldCheck
	}
];
function AwsQuickActions() {
	const [active, setActive] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "aws_dashboard.quick_actions.panel",
			className: "provider-shell provider-tint p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							size: 16,
							className: "provider-accent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-sm font-semibold text-foreground tracking-wide",
							children: "AWS Quick Actions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge-provider ml-1",
							children: "AWS"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mb-4",
					children: "Remediation actions scoped to AWS resources only."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: AWS_ACTIONS.map((action) => {
						const Icon = action.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActive(action.id),
							"data-ocid": `aws_quick_action.${action.id}_button`,
							className: "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-orange-400/40 text-orange-400 hover:bg-orange-400/10 transition-all active:scale-95",
							style: { backgroundColor: "#1a1d27" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								size: 14,
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: action.label })]
						}, action.id);
					})
				})
			]
		}),
		active === "blockIp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockIpAwsModal, { onClose: () => setActive(null) }),
		active === "isolate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IsolateAwsModal, { onClose: () => setActive(null) }),
		active === "revokeIam" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevokeIamAwsModal, { onClose: () => setActive(null) })
	] });
}
function AwsDashboardPage() {
	const { setSelectedProvider } = useProviderFilter();
	const { data: myProviders = [], isLoading: loadingProviders } = useGetMyProviders();
	(0, import_react.useEffect)(() => {
		setSelectedProvider("AWS");
		return () => setSelectedProvider(null);
	}, [setSelectedProvider]);
	const isAssigned = myProviders.includes(AWS);
	const { data: awsAlerts, isLoading: loadingAlerts } = useNormalizedAlerts({
		customer: "",
		limit: 1e3,
		provider: "AWS",
		status: "Open"
	});
	const { data: allAssets, isLoading: loadingAssets } = useAssets("", 1e3);
	const awsAssets = (0, import_react.useMemo)(() => (allAssets ?? []).filter((a) => a.provider === "AWS"), [allAssets]);
	const assetsAtRisk = (0, import_react.useMemo)(() => awsAssets.filter((a) => Number(a.riskScore ?? 0) > 0).length, [awsAssets]);
	const { data: complianceData, isLoading: loadingCompliance } = useComplianceStatus("NISTCSF", "AWS");
	const complianceScore = (0, import_react.useMemo)(() => complianceData ? Number(complianceData.score ?? 0n) : 0, [complianceData]);
	const { data: incidents, isLoading: loadingIncidents } = useCorrelatedIncidents(200);
	const awsIncidents = (0, import_react.useMemo)(() => (incidents ?? []).filter(([, inc]) => inc.sourceProviders.includes("AWS")), [incidents]);
	const openIncidents = (0, import_react.useMemo)(() => awsIncidents.filter(([, inc]) => inc.status === "Open").length, [awsIncidents]);
	const { data: providerStates } = useProviderStates();
	const awsState = providerStates?.find((s) => s.provider === "AWS");
	const connectionStatus = awsState?.status === "Active" ? "connected" : awsState?.status === "Error" || awsState?.status === "AuthPaused" ? "error" : "disconnected";
	const totalActiveAlerts = awsAlerts?.length ?? 0;
	if (loadingProviders) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "aws.loading_state",
		className: "provider-aws flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSpinner, { size: 32 })
	}) });
	if (!isAssigned) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "aws.access_denied",
		className: "provider-aws flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "provider-shell provider-tint flex max-w-md flex-col items-center gap-3 p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					size: 32,
					className: "provider-accent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-lg font-semibold text-foreground",
					children: "AWS access not assigned"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "You are not assigned to the AWS provider. Contact an administrator to request access. AWS data and remediation actions are blocked."
				})
			]
		})
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "aws_dashboard.page",
		className: "provider-aws min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "provider-shell provider-tint mb-6 p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "provider-accent-bar h-12 w-1 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold text-foreground",
								children: "AWS Dashboard"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge-provider",
								children: "AWS"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "Amazon Web Services security posture — alerts, assets, compliance, and incidents scoped to AWS only."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: connectionStatus })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active Alerts",
						value: totalActiveAlerts,
						isLoading: loadingAlerts,
						tone: "text-destructive",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 16 }),
						ocid: "aws_dashboard.stat.active_alerts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Assets at Risk",
						value: assetsAtRisk,
						isLoading: loadingAssets,
						tone: "text-warning",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { size: 16 }),
						ocid: "aws_dashboard.stat.assets_at_risk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Compliance Score",
						value: `${complianceScore}%`,
						isLoading: loadingCompliance,
						tone: "text-success",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { size: 16 }),
						ocid: "aws_dashboard.stat.compliance_score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Open Incidents",
						value: openIncidents,
						isLoading: loadingIncidents,
						tone: "provider-accent",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitMerge, { size: 16 }),
						ocid: "aws_dashboard.stat.open_incidents"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-ocid": "aws_dashboard.risk_score.section",
						className: "provider-shell provider-tint p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AwsRiskScoreCard, {
							alerts: awsAlerts ?? [],
							isLoading: loadingAlerts
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-ocid": "aws_dashboard.event_feed.section",
						className: "md:col-span-2 lg:col-span-2 provider-shell",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityEventFeed, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-ocid": "aws_dashboard.assets.section",
						className: "md:col-span-2 lg:col-span-2 provider-shell",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, {
										size: 16,
										className: "provider-accent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display font-semibold text-foreground text-sm tracking-wide",
										children: "AWS Assets"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-muted-foreground",
									children: [awsAssets.length, " assets"]
								})]
							}), loadingAssets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-ocid": "aws_dashboard.assets.loading_state",
								className: "flex items-center justify-center py-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSpinner, { size: 24 })
							}) : awsAssets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-ocid": "aws_dashboard.assets.empty_state",
								className: "flex flex-col items-center justify-center py-10 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, {
									size: 24,
									className: "text-muted-foreground"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "No AWS assets discovered."
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "data-dense w-full text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2",
												children: "Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2",
												children: "Type"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2",
												children: "Region"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 text-right",
												children: "Risk"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 text-right",
												children: "Findings"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2",
												children: "Last Seen"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: awsAssets.map((asset, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										"data-ocid": `aws_dashboard.assets.row.${i + 1}`,
										className: "border-t border-border/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "font-medium text-foreground",
												children: asset.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "font-mono text-xs text-muted-foreground",
												children: asset.assetType
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "font-mono text-xs text-muted-foreground",
												children: asset.region
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: `text-right font-mono text-xs ${riskTone(Number(asset.riskScore))}`,
												children: Number(asset.riskScore)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "text-right font-mono text-xs text-foreground",
												children: Number(asset.openFindings)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "font-mono text-xs text-muted-foreground",
												children: formatLastSeen(asset.lastSeen)
											})
										]
									}, asset.id)) })]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-ocid": "aws_dashboard.correlated_incidents.section",
						className: "md:col-span-2 lg:col-span-1 provider-shell",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorrelatedIncidentsPanel, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "aws_dashboard.quick_actions.section",
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AwsQuickActions, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "aws_dashboard.credentials.section",
				className: "mt-6 provider-shell provider-tint",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCredentialsForm, { provider: AWS })
			})
		]
	}) });
}
export { AwsDashboardPage as default };
