import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { D as useGetMyProviders, I as useNormalizedAlerts, N as useIsolateResource, d as useComplianceStatus, l as useBlockIp, o as useAssets, w as useForceGcpIamReview } from "./use-backend-C00QWIg7.js";
import { t as LoadingSpinner } from "./index-B84IBi73.js";
import { i as ShieldAlert, n as useProviderFilter, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as ProviderIcon } from "./ProviderIcon-9RfPlHNs.js";
import { t as Eye } from "./eye-YXkjTxEs.js";
import { t as ProviderCredentialsForm } from "./ProviderCredentialsForm-Be487TgG.js";
import { t as LoaderCircle } from "./loader-circle-CHt_0PLM.js";
import { n as Server, t as Shield } from "./shield-CbiefNtr.js";
import { t as ShieldCheck } from "./shield-check-qpZrj14a.js";
import { n as CorrelatedIncidentsPanel, r as SquareCheckBig, t as SecurityEventFeed } from "./SecurityEventFeed-DCiiGvXq.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
import { t as ue } from "./dist-muuRpw8y.js";
import { t as StatusBadge } from "./StatusBadge-GI1o9Oiw.js";
// src/pages/GcpDashboardPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var GCP = "GCP";
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
function StatCard({ label, value, isLoading, icon, ocid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": ocid,
		className: "provider-shell provider-tint flex items-center gap-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "provider-accent shrink-0",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate",
				children: label
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 h-5 w-16 rounded bg-muted/30 animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "provider-accent font-display text-xl font-bold tabular-nums",
				children: value
			})]
		})]
	});
}
function GcpRiskScoreCard({ alerts, isLoading }) {
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
		"data-ocid": "gcp.risk_score.card",
		className: "provider-shell provider-tint flex flex-col p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-sm font-semibold text-foreground tracking-wide",
				children: "GCP Risk Score"
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
						children: alerts.length === 0 ? "No active GCP alerts" : `${alerts.length} active GCP alert${alerts.length !== 1 ? "s" : ""}`
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
function GcpComplianceCard({ score, passing, failing, isLoading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "gcp.compliance.card",
		className: "provider-shell provider-tint flex flex-col p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-sm font-semibold text-foreground tracking-wide",
				children: "GCP Compliance"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, {
				size: 16,
				className: "provider-accent"
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-20 rounded bg-muted/30 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-32 rounded bg-muted/30 animate-pulse" })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "provider-accent font-display text-3xl font-bold tabular-nums",
				children: [score, "%"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1",
				children: "NIST CSF"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-success/30 bg-success/10 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider",
						children: "Passing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-bold text-success tabular-nums",
						children: passing
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-destructive/30 bg-destructive/10 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider",
						children: "Failing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-bold text-destructive tabular-nums",
						children: failing
					})]
				})]
			})
		] })]
	});
}
function GcpAssetsTable({ assets, isLoading }) {
	const atRisk = assets.filter((a) => Number(a.riskScore) > 0).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "gcp.assets.panel",
		className: "provider-shell flex flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between px-5 py-4 border-b border-border/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "provider-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { size: 16 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-sm font-semibold text-foreground tracking-wide",
					children: "GCP Assets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: isLoading ? "Loading…" : `${assets.length} assets · ${atRisk} at risk`
				})] })]
			})
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ocid": "gcp.assets.loading_state",
			className: "flex items-center justify-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSpinner, { size: 24 })
		}) : assets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "gcp.assets.empty_state",
			className: "flex flex-col items-center justify-center py-12 gap-3 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, {
				size: 28,
				className: "text-muted-foreground"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No GCP assets discovered yet."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left data-dense",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2",
							children: "Type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2",
							children: "Region"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2 text-right",
							children: "Risk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2 text-right",
							children: "Findings"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: assets.map((asset, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					"data-ocid": `gcp.assets.item.${idx + 1}`,
					className: "border-b border-border/20 hover:bg-muted/10 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-mono text-xs text-foreground max-w-[220px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate block",
								title: asset.name,
								children: asset.name
							})
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
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-mono text-xs tabular-nums ${Number(asset.riskScore) > 30 ? "text-destructive font-bold" : Number(asset.riskScore) > 10 ? "text-warning font-semibold" : "text-success font-semibold"}`,
								children: Number(asset.riskScore)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right",
							children: Number(asset.openFindings) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-bold text-destructive tabular-nums",
								children: Number(asset.openFindings)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted-foreground",
								children: "0"
							})
						})
					]
				}, asset.id)) })]
			})
		})]
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
			"aria-labelledby": "gcp-modal-title",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-6 pt-6 pb-4 border-b",
				style: { borderColor: "#2a2d3e" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: accentClass,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconEl, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "gcp-modal-title",
						className: "text-base font-semibold text-white font-display",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"data-ocid": "gcp_quick_action.close_button",
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
		"data-ocid": "gcp_quick_action.dryrun_toggle",
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
			className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? "bg-emerald-500" : "bg-white/10"}`,
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
			backgroundColor: "rgba(16,185,129,0.07)",
			borderColor: "rgba(16,185,129,0.3)",
			color: "#6ee7b7"
		},
		"data-ocid": "gcp_quick_action.dryrun_preview",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold uppercase tracking-wide text-emerald-400 mr-1.5",
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
function TextInput({ id, value, onChange, placeholder, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		type,
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder,
		required: true,
		"data-ocid": `gcp_quick_action.${id}_input`,
		className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-500 transition",
		style: inputStyle
	});
}
function BlockIpModal({ onClose }) {
	const [ip, setIp] = (0, import_react.useState)("");
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const mutation = useBlockIp();
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await mutation.mutateAsync({
				ip: ip.trim(),
				providers: [GCP],
				dryRun,
				customer: "default"
			});
			showPlaybookToast(result, `Block IP ${ip.trim()} on GCP`);
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
		title: "Block IP (GCP)",
		accentClass: "text-emerald-400",
		IconEl: Shield,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: "#94a3b8" },
					children: "Add the IP to GCP firewall deny rules. Takes immediate effect on GCP resources only."
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
						"data-ocid": "gcp_quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !ip.trim() || mutation.isPending,
						"data-ocid": "gcp_quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-400/40 hover:bg-emerald-400/10 flex items-center justify-center gap-1.5",
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
	const [dryRun, setDryRun] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const mutation = useIsolateResource();
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await mutation.mutateAsync({
				resourceId: resourceId.trim(),
				provider: GCP,
				dryRun,
				customer: "default"
			});
			showPlaybookToast(result, `Isolate ${resourceId.trim()} on GCP`);
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
		title: "Isolate Resource (GCP)",
		accentClass: "text-emerald-400",
		IconEl: Server,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "px-6 pt-4 pb-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: "#94a3b8" },
					children: "Quarantine the GCP resource from all network access until reviewed."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Resource ID",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						id: "resource",
						value: resourceId,
						onChange: setResourceId,
						placeholder: "e.g. projects/my-project/zones/us-central1-a/instances/..."
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
						"data-ocid": "gcp_quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !resourceId.trim() || mutation.isPending,
						"data-ocid": "gcp_quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-400/40 hover:bg-emerald-400/10 flex items-center justify-center gap-1.5",
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
		try {
			const result = await mutation.mutateAsync({
				projectId: projectId.trim(),
				dryRun,
				customer: "default"
			});
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
		accentClass: "text-emerald-400",
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
						"data-ocid": "gcp_quick_action.cancel_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
						style: {
							borderColor: "#2a2d3e",
							color: "#94a3b8"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !projectId.trim() || mutation.isPending,
						"data-ocid": "gcp_quick_action.confirm_button",
						className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 border border-emerald-400/40 hover:bg-emerald-400/10 flex items-center justify-center gap-1.5",
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
var GCP_ACTIONS = [
	{
		id: "blockIp",
		label: "Block IP",
		icon: Shield
	},
	{
		id: "isolateResource",
		label: "Isolate Resource",
		icon: Server
	},
	{
		id: "gcpIamReview",
		label: "Force GCP IAM Review",
		icon: Eye
	}
];
function GcpQuickActions() {
	const [activeAction, setActiveAction] = (0, import_react.useState)(null);
	const closeModal = () => setActiveAction(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "gcp.quick_actions.panel",
			className: "provider-shell provider-tint p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						size: 16,
						className: "provider-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-sm font-semibold text-foreground tracking-wide",
						children: "GCP Quick Actions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "badge-provider ml-1",
						children: "GCP"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 flex-wrap",
				children: GCP_ACTIONS.map((action) => {
					const Icon = action.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveAction(action.id),
						"data-ocid": `gcp_quick_action.${action.id}_button`,
						className: "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10 transition-all active:scale-95",
						style: { backgroundColor: "#1a1d27" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							size: 14,
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: action.label })]
					}, action.id);
				})
			})]
		}),
		activeAction === "blockIp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockIpModal, { onClose: closeModal }),
		activeAction === "isolateResource" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IsolateResourceModal, { onClose: closeModal }),
		activeAction === "gcpIamReview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GcpIamReviewModal, { onClose: closeModal })
	] });
}
function GcpDashboardPage() {
	const { setSelectedProvider } = useProviderFilter();
	const { data: myProviders = [], isLoading: loadingProviders } = useGetMyProviders();
	(0, import_react.useEffect)(() => {
		setSelectedProvider(GCP);
		return () => setSelectedProvider(null);
	}, [setSelectedProvider]);
	const isAssigned = myProviders.includes(GCP);
	const alerts = useNormalizedAlerts({
		customer: "",
		limit: 500,
		provider: GCP
	});
	const assets = useAssets("", 500);
	const compliance = useComplianceStatus("NISTCSF", GCP);
	const gcpAssets = (0, import_react.useMemo)(() => (assets.data ?? []).filter((a) => a.provider === GCP), [assets.data]);
	const activeAlerts = (0, import_react.useMemo)(() => (alerts.data ?? []).filter((a) => a.status !== "Resolved"), [alerts.data]);
	const assetsAtRisk = (0, import_react.useMemo)(() => gcpAssets.filter((a) => Number(a.riskScore) > 0).length, [gcpAssets]);
	const complianceScore = Number(compliance.data?.score ?? 0n);
	const compliancePassing = Number(compliance.data?.passing ?? 0n);
	const complianceFailing = Number(compliance.data?.failing ?? 0n);
	if (loadingProviders) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "gcp.loading_state",
		className: "provider-gcp flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSpinner, { size: 32 })
	}) });
	if (!isAssigned) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "gcp.access_denied",
		className: "provider-gcp flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "provider-shell provider-tint flex max-w-md flex-col items-center gap-3 p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					size: 32,
					className: "provider-accent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-lg font-semibold text-foreground",
					children: "GCP access not assigned"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "You are not assigned to the GCP provider. Contact an administrator to request access. GCP data and remediation actions are blocked."
				})
			]
		})
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "gcp.page",
		className: "provider-gcp space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "provider-shell provider-tint flex flex-wrap items-center justify-between gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, {
						provider: GCP,
						className: "text-base"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold text-foreground tracking-tight",
						children: "GCP Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: "Isolated security view for Google Cloud Platform"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "badge-provider",
						children: "GCP"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: "connected" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active Alerts",
						value: activeAlerts.length,
						isLoading: alerts.isLoading,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 16 }),
						ocid: "gcp.stat.active_alerts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Assets at Risk",
						value: assetsAtRisk,
						isLoading: assets.isLoading,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { size: 16 }),
						ocid: "gcp.stat.assets_at_risk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Compliance Score",
						value: `${complianceScore}%`,
						isLoading: compliance.isLoading,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { size: 16 }),
						ocid: "gcp.stat.compliance_score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Risk Score",
						value: (() => {
							const totalWeighted = activeAlerts.reduce((sum, a) => sum + severityWeight(a.severity), 0);
							const maxPossible = activeAlerts.length * 4;
							const raw = maxPossible > 0 ? totalWeighted / maxPossible * 100 : 0;
							return Math.min(100, Math.round(raw));
						})(),
						isLoading: alerts.isLoading,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 16 }),
						ocid: "gcp.stat.risk_score"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "gcp.event_feed.section",
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityEventFeed, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "gcp.incidents.section",
					className: "lg:col-span-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorrelatedIncidentsPanel, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ocid": "gcp.assets.section",
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GcpAssetsTable, {
						assets: gcpAssets,
						isLoading: assets.isLoading
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-1 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GcpRiskScoreCard, {
						alerts: activeAlerts,
						isLoading: alerts.isLoading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GcpComplianceCard, {
						score: complianceScore,
						passing: compliancePassing,
						failing: complianceFailing,
						isLoading: compliance.isLoading
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GcpQuickActions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "gcp.credentials.section",
				className: "provider-shell provider-tint",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCredentialsForm, { provider: GCP })
			})
		]
	}) });
}
export { GcpDashboardPage as default };
