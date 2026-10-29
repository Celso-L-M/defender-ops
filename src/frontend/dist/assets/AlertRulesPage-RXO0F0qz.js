import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { I as useNormalizedAlerts, X as useSaveAlertRule, m as useDeleteAlertRule, n as useAlertRules } from "./use-backend-C00QWIg7.js";
import { t as Badge } from "./badge-LsDsWI7w.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Input } from "./input-DRmrQsxb.js";
import { t as Label } from "./label-DKpYm3Db.js";
import { t as Skeleton } from "./skeleton-Co_kaRlX.js";
import { t as Switch } from "./switch-XM5b6x2f.js";
import { m as BellRing, r as SlidersHorizontal, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as Mail } from "./mail-B9upj0k0.js";
import { t as MessageSquare } from "./message-square-cQdaFrtW.js";
import { t as Pencil } from "./pencil-ylhzApE_.js";
import { t as Plus } from "./plus-D4c1gqpK.js";
import { t as Trash2 } from "./trash-2-Df6HVUZV.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
import { t as X } from "./x-BfIWc_q5.js";
import { t as ue } from "./dist-muuRpw8y.js";
// src/pages/AlertRulesPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_CUSTOMER = "default";
var SEVERITY_OPTIONS = [
	{
		label: "Any Critical",
		value: "AnyCritical"
	},
	{
		label: "Any High or above",
		value: "AnyHigh"
	},
	{
		label: "Any Medium or above",
		value: "AnyMedium"
	},
	{
		label: "Any Low",
		value: "AnyLow"
	},
	{
		label: "Critical or High",
		value: "CriticalOrHigh"
	},
	{
		label: "All findings",
		value: "All"
	}
];
var PROVIDER_OPTIONS = [
	"AWS",
	"Azure",
	"GCP"
];
var CHANNEL_OPTIONS = [
	{
		value: "InApp",
		label: "In-app",
		description: "Notification center",
		icon: BellRing
	},
	{
		value: "Email",
		label: "Email",
		description: "Routed recipients",
		icon: Mail
	},
	{
		value: "TeamsWebhook",
		label: "Teams",
		description: "Microsoft Teams webhook",
		icon: MessageSquare
	}
];
var CHANNEL_LABELS = {
	InApp: "In-app",
	Email: "Email",
	TeamsWebhook: "Teams"
};
var CHANNEL_BADGE = {
	InApp: "border-primary/40 text-primary",
	Email: "border-chart-2/40 text-chart-2",
	TeamsWebhook: "border-accent/40 text-accent-foreground"
};
var DEFAULT_FORM = {
	name: "",
	enabled: true,
	severityThreshold: "",
	findingType: "",
	assetId: "",
	provider: "",
	region: "",
	channels: ["InApp"],
	cooldownMinutes: "60",
	escalationMinutes: "",
	escalationRecipient: ""
};
function ruleToForm(rule) {
	return {
		name: rule.name,
		enabled: rule.enabled,
		severityThreshold: rule.severityThreshold ?? "",
		findingType: rule.findingType ?? "",
		assetId: rule.assetId ?? "",
		provider: rule.provider ?? "",
		region: rule.region ?? "",
		channels: rule.channels,
		cooldownMinutes: String(Number(rule.cooldownMinutes)),
		escalationMinutes: rule.escalationMinutes ? String(Number(rule.escalationMinutes)) : "",
		escalationRecipient: rule.escalationRecipient ?? ""
	};
}
function validate(form) {
	if (!form.name.trim()) return "A rule name is required.";
	if (form.channels.length === 0) return "Select at least one notification channel.";
	const cooldown = Number(form.cooldownMinutes);
	if (!Number.isFinite(cooldown) || cooldown < 0) return "Cooldown must be zero or more minutes.";
	if (form.escalationMinutes !== "") {
		const escalation = Number(form.escalationMinutes);
		if (!Number.isFinite(escalation) || escalation <= 0) return "Escalation window must be a positive number of minutes.";
		if (!form.escalationRecipient.trim()) return "An escalation recipient is required when an escalation window is set.";
	}
	return null;
}
function RuleForm({ editing, customer, onClose }) {
	const [form, setForm] = import_react.useState(() => editing ? ruleToForm(editing) : DEFAULT_FORM);
	const [error, setError] = import_react.useState(null);
	const saveRule = useSaveAlertRule();
	function toggleChannel(channel) {
		setForm((f) => ({
			...f,
			channels: f.channels.includes(channel) ? f.channels.filter((c) => c !== channel) : [...f.channels, channel]
		}));
	}
	function handleSubmit(e) {
		e.preventDefault();
		const validationError = validate(form);
		if (validationError) {
			setError(validationError);
			return;
		}
		setError(null);
		const rule = {
			id: editing?.id ?? `rule-${Date.now()}`,
			name: form.name.trim(),
			customer,
			enabled: form.enabled,
			severityThreshold: form.severityThreshold || void 0,
			findingType: form.findingType.trim() || void 0,
			assetId: form.assetId.trim() || void 0,
			provider: form.provider || void 0,
			region: form.region.trim() || void 0,
			channels: form.channels,
			cooldownMinutes: BigInt(Number(form.cooldownMinutes)),
			escalationMinutes: form.escalationMinutes !== "" ? BigInt(Number(form.escalationMinutes)) : void 0,
			escalationRecipient: form.escalationRecipient.trim() || void 0
		};
		saveRule.mutate(rule, {
			onSuccess: () => {
				ue.success(editing ? "Alert rule updated" : "Alert rule created");
				onClose();
			},
			onError: () => {
				setError("Could not save the rule. Please try again.");
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		"data-ocid": "alert_rules.form",
		className: "rounded-lg border border-border bg-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-5 py-3.5 border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display font-semibold text-sm text-foreground",
				children: editing ? "Edit Alert Rule" : "New Alert Rule"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-ocid": "alert_rules.form.close_button",
				onClick: onClose,
				className: "rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors",
				"aria-label": "Close rule form",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 15 })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rule-name",
							className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
							children: "Rule Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rule-name",
							"data-ocid": "alert_rules.name_input",
							placeholder: "e.g. Critical AWS production alerts",
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							})),
							className: "bg-background h-9 text-sm"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-3 pb-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							"data-ocid": "alert_rules.enabled_switch",
							checked: form.enabled,
							onCheckedChange: (v) => setForm((f) => ({
								...f,
								enabled: v
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground leading-tight",
							children: form.enabled ? "Enabled" : "Disabled"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: form.enabled ? "Rule is actively matching findings" : "Rule is saved but will not fire"
						})] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2",
						children: "Match Criteria"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rule-severity",
									className: "text-xs font-medium text-muted-foreground",
									children: "Severity threshold"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "rule-severity",
									"data-ocid": "alert_rules.severity_select",
									value: form.severityThreshold,
									onChange: (e) => setForm((f) => ({
										...f,
										severityThreshold: e.target.value
									})),
									className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Any severity"
									}), SEVERITY_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: o.value,
										children: o.label
									}, o.value))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rule-provider",
									className: "text-xs font-medium text-muted-foreground",
									children: "Provider"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "rule-provider",
									"data-ocid": "alert_rules.provider_select",
									value: form.provider,
									onChange: (e) => setForm((f) => ({
										...f,
										provider: e.target.value
									})),
									className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Any provider"
									}), PROVIDER_OPTIONS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p,
										children: p
									}, p))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rule-finding-type",
									className: "text-xs font-medium text-muted-foreground",
									children: "Finding type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rule-finding-type",
									"data-ocid": "alert_rules.finding_type_input",
									placeholder: "e.g. UnauthorizedAccess",
									value: form.findingType,
									onChange: (e) => setForm((f) => ({
										...f,
										findingType: e.target.value
									})),
									className: "bg-background h-9 text-sm font-mono"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rule-asset",
									className: "text-xs font-medium text-muted-foreground",
									children: "Asset ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rule-asset",
									"data-ocid": "alert_rules.asset_input",
									placeholder: "e.g. i-0abc123def",
									value: form.assetId,
									onChange: (e) => setForm((f) => ({
										...f,
										assetId: e.target.value
									})),
									className: "bg-background h-9 text-sm font-mono"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rule-region",
									className: "text-xs font-medium text-muted-foreground",
									children: "Region"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rule-region",
									"data-ocid": "alert_rules.region_input",
									placeholder: "e.g. us-east-1",
									value: form.region,
									onChange: (e) => setForm((f) => ({
										...f,
										region: e.target.value
									})),
									className: "bg-background h-9 text-sm font-mono"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-2",
						children: "Leave a criterion blank to match any value."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2",
					children: "Notification Channels"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5",
					children: CHANNEL_OPTIONS.map(({ value, label, description, icon: Icon }) => {
						const active = form.channels.includes(value);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-ocid": `alert_rules.channel_${value.toLowerCase()}_toggle`,
							"aria-pressed": active,
							onClick: () => toggleChannel(value),
							className: `flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors ${active ? "border-primary/60 bg-primary/10" : "border-border bg-background hover:bg-muted/30"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								size: 15,
								className: `mt-0.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium text-foreground",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground truncate",
									children: description
								})]
							})]
						}, value);
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2",
					children: "Deduplication & Escalation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rule-cooldown",
									className: "text-xs font-medium text-muted-foreground",
									children: "Cooldown (minutes)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rule-cooldown",
									type: "number",
									min: 0,
									"data-ocid": "alert_rules.cooldown_input",
									value: form.cooldownMinutes,
									onChange: (e) => setForm((f) => ({
										...f,
										cooldownMinutes: e.target.value
									})),
									className: "bg-background h-9 text-sm font-mono"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Suppress duplicate alerts for this window."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rule-escalation",
									className: "text-xs font-medium text-muted-foreground",
									children: "Escalation window (minutes)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rule-escalation",
									type: "number",
									min: 1,
									"data-ocid": "alert_rules.escalation_minutes_input",
									placeholder: "Optional",
									value: form.escalationMinutes,
									onChange: (e) => setForm((f) => ({
										...f,
										escalationMinutes: e.target.value
									})),
									className: "bg-background h-9 text-sm font-mono"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Escalate if unacknowledged within this window."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "rule-escalation-recipient",
									className: "text-xs font-medium text-muted-foreground",
									children: "Escalation recipient"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "rule-escalation-recipient",
									"data-ocid": "alert_rules.escalation_recipient_input",
									placeholder: "e.g. oncall@example.com",
									value: form.escalationRecipient,
									onChange: (e) => setForm((f) => ({
										...f,
										escalationRecipient: e.target.value
									})),
									className: "bg-background h-9 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Required when an escalation window is set."
								})
							]
						})
					]
				})] }),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "alert_rules.form.error_state",
					role: "alert",
					className: "flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						size: 15,
						className: "mt-0.5 shrink-0 text-destructive"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						"data-ocid": "alert_rules.form.cancel_button",
						onClick: onClose,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						"data-ocid": "alert_rules.form.submit_button",
						disabled: saveRule.isPending,
						className: "gap-2 bg-primary hover:bg-primary/90",
						children: saveRule.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }), "Saving…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { size: 14 }), editing ? "Save Changes" : "Create Rule"] })
					})]
				})
			]
		})]
	});
}
function RuleCard({ rule, index, onEdit }) {
	const saveRule = useSaveAlertRule();
	const deleteRule = useDeleteAlertRule();
	const criteria = [];
	if (rule.severityThreshold) {
		const label = SEVERITY_OPTIONS.find((o) => o.value === rule.severityThreshold)?.label ?? rule.severityThreshold;
		criteria.push(label);
	}
	if (rule.provider) criteria.push(rule.provider);
	if (rule.findingType) criteria.push(rule.findingType);
	if (rule.region) criteria.push(rule.region);
	if (rule.assetId) criteria.push(rule.assetId);
	function handleToggle(enabled) {
		saveRule.mutate({
			...rule,
			enabled
		}, {
			onSuccess: () => ue.success(enabled ? "Rule enabled" : "Rule disabled"),
			onError: () => ue.error("Could not update the rule")
		});
	}
	function handleDelete() {
		deleteRule.mutate(rule.id, {
			onSuccess: () => ue.success("Alert rule deleted"),
			onError: () => ue.error("Could not delete the rule")
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": `alert_rules.item.${index}`,
		className: `rounded-lg border bg-card p-4 transition-colors ${rule.enabled ? "border-border" : "border-border/60 opacity-70"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-semibold text-sm text-foreground truncate",
							children: rule.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: rule.enabled ? "badge-status-connected" : "badge-status-inactive",
							children: rule.enabled ? "Enabled" : "Disabled"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-1.5 mt-2",
						children: criteria.length > 0 ? criteria.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px] font-mono border-border text-muted-foreground",
							children: c
						}, c)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Matches all findings"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5 mt-2.5",
						children: [
							rule.channels.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `text-[10px] font-mono ${CHANNEL_BADGE[channel]}`,
								children: CHANNEL_LABELS[channel]
							}, channel)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] text-muted-foreground ml-1",
								children: [Number(rule.cooldownMinutes), " min cooldown"]
							}),
							rule.escalationMinutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] text-muted-foreground",
								children: [
									"· escalates after ",
									Number(rule.escalationMinutes),
									" min",
									rule.escalationRecipient ? ` to ${rule.escalationRecipient}` : ""
								]
							}) : null
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						"data-ocid": `alert_rules.toggle.${index}`,
						checked: rule.enabled,
						disabled: saveRule.isPending,
						onCheckedChange: handleToggle,
						"aria-label": rule.enabled ? "Disable rule" : "Enable rule"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						"data-ocid": `alert_rules.edit_button.${index}`,
						onClick: () => onEdit(rule),
						className: "h-7 gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 11 }), "Edit"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						"data-ocid": `alert_rules.delete_button.${index}`,
						onClick: handleDelete,
						disabled: deleteRule.isPending,
						className: "h-7 gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 11 }), "Delete"]
					})
				]
			})]
		})
	});
}
function AlertRulesPage() {
	const { data: alerts, isLoading: isLoadingAlerts } = useNormalizedAlerts({
		customer: "",
		limit: 1
	});
	const customerKey = alerts?.[0]?.customer ?? DEFAULT_CUSTOMER;
	const { data: rules = [], isLoading } = useAlertRules(customerKey);
	const [formOpen, setFormOpen] = import_react.useState(false);
	const [editing, setEditing] = import_react.useState(null);
	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}
	function openEdit(rule) {
		setEditing(rule);
		setFormOpen(true);
	}
	function closeForm() {
		setFormOpen(false);
		setEditing(null);
	}
	const enabledCount = rules.filter((r) => r.enabled).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "alert_rules.page",
		className: "max-w-5xl mx-auto space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
						size: 20,
						className: "text-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold text-foreground tracking-tight",
						children: "Alert Rules"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm mt-1",
						children: "Define which findings raise alerts and how they are routed."
					})] })]
				}), !formOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					"data-ocid": "alert_rules.create_button",
					onClick: openCreate,
					className: "gap-2 bg-primary hover:bg-primary/90 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 }), "New Rule"]
				})]
			}),
			!isLoading && rules.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-bold text-foreground",
							children: rules.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: ["rule", rules.length !== 1 ? "s" : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-6 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-bold text-primary",
							children: enabledCount
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "active"
						})]
					})
				]
			}),
			formOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleForm, {
				editing,
				customer: customerKey,
				onClose: closeForm
			}),
			isLoading || isLoadingAlerts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: Array.from({ length: 3 }, (_, i) => `rule-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-lg" }, id))
			}) : rules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "alert_rules.empty_state",
				className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
						size: 32,
						className: "text-muted-foreground/30"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-foreground",
						children: "No alert rules yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground max-w-sm",
						children: "Create a rule to decide which findings raise alerts and which channels notify your team."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						"data-ocid": "alert_rules.empty_create_button",
						onClick: openCreate,
						className: "gap-2 mt-1 bg-primary hover:bg-primary/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 }), "Create your first rule"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "alert_rules.list",
				className: "space-y-3",
				children: rules.map((rule, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
					rule,
					index: idx + 1,
					onEdit: openEdit
				}, rule.id))
			})
		]
	}) });
}
export { AlertRulesPage as default };
