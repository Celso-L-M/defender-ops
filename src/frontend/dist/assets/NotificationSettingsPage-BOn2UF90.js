import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { I as useNormalizedAlerts, Q as useSaveNotificationRouting, ut as createLucideIcon, z as useNotificationRouting } from "./use-backend-C00QWIg7.js";
import { t as Badge } from "./badge-LsDsWI7w.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Label } from "./label-DKpYm3Db.js";
import { t as Skeleton } from "./skeleton-Co_kaRlX.js";
import { i as ShieldAlert, m as BellRing, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as CircleCheck } from "./circle-check-oM7foquT.js";
import { t as Clock } from "./clock-DWZROSAr.js";
import { t as Mail } from "./mail-B9upj0k0.js";
import { t as Plus } from "./plus-D4c1gqpK.js";
import { t as Save } from "./save-B5hEQrai.js";
import { t as Trash2 } from "./trash-2-Df6HVUZV.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Webhook = createLucideIcon("webhook", [
	["path", {
		d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",
		key: "q3hayz"
	}],
	["path", {
		d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06",
		key: "1go1hn"
	}],
	["path", {
		d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",
		key: "qlwsc0"
	}]
]);
// src/pages/NotificationSettingsPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_CUSTOMER = "default";
var DEFAULT_COOLDOWN_MINUTES = 60;
function validateWebhookUrl(raw) {
	const trimmed = raw.trim();
	if (trimmed.length === 0) return null;
	if (trimmed.length > 2048) return "Webhook URL exceeds maximum length";
	if (!trimmed.startsWith("https://")) return "Webhook URL must use https";
	if (/\s/.test(trimmed)) return "Webhook URL must not contain whitespace";
	return null;
}
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(raw) {
	const trimmed = raw.trim();
	if (trimmed.length === 0) return "Email address is required";
	if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address";
	return null;
}
function parseMinutes(raw) {
	const trimmed = raw.trim();
	if (trimmed.length === 0) return null;
	const n = Number(trimmed);
	if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) return null;
	return n;
}
function SavedSummary({ routing }) {
	if (!routing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ocid": "notification_settings.saved_state",
		className: "rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "No routing saved yet. Configure the channels below and save to start delivering notifications for this customer."
		})
	});
	const cooldown = Number(routing.cooldownMinutes);
	const escalation = routing.escalationMinutes !== void 0 ? Number(routing.escalationMinutes) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "notification_settings.saved_state",
		className: "rounded-lg border border-border bg-muted/20 px-4 py-3 space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: "Currently saved"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-x-5 gap-y-2 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Webhook, {
						size: 12,
						className: "text-muted-foreground"
					}), routing.teamsWebhookUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono truncate max-w-[240px]",
						children: routing.teamsWebhookUrl
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "No Teams webhook"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
						size: 12,
						className: "text-muted-foreground"
					}), routing.emailRecipients.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						children: [
							routing.emailRecipients.length,
							" recipient",
							routing.emailRecipients.length === 1 ? "" : "s"
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "No email recipients"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
						size: 12,
						className: "text-muted-foreground"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						children: [cooldown, " min cooldown"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
						size: 12,
						className: "text-muted-foreground"
					}), escalation !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						children: [escalation, " min escalation"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "No escalation window"
					})]
				})
			]
		})]
	});
}
function NotificationSettingsPage() {
	const { data: alerts, isLoading: isLoadingAlerts } = useNormalizedAlerts({
		customer: "",
		limit: 1
	});
	const customerKey = alerts?.[0]?.customer ?? DEFAULT_CUSTOMER;
	const { data: routing, isLoading, isError } = useNotificationRouting(customerKey);
	const { mutateAsync: saveRouting, isPending } = useSaveNotificationRouting();
	const [webhookUrl, setWebhookUrl] = import_react.useState("");
	const [recipients, setRecipients] = import_react.useState([]);
	const [recipientDraft, setRecipientDraft] = import_react.useState("");
	const [cooldown, setCooldown] = import_react.useState(String(DEFAULT_COOLDOWN_MINUTES));
	const [escalation, setEscalation] = import_react.useState("");
	const [initialized, setInitialized] = import_react.useState(false);
	const [errors, setErrors] = import_react.useState({});
	const [savedAt, setSavedAt] = import_react.useState(null);
	const [saveError, setSaveError] = import_react.useState(null);
	import_react.useEffect(() => {
		if (initialized || isLoading || isLoadingAlerts) return;
		if (routing) {
			setWebhookUrl(routing.teamsWebhookUrl ?? "");
			setRecipients(routing.emailRecipients);
			setCooldown(String(Number(routing.cooldownMinutes)));
			setEscalation(routing.escalationMinutes !== void 0 ? String(Number(routing.escalationMinutes)) : "");
		}
		setInitialized(true);
	}, [
		initialized,
		isLoading,
		isLoadingAlerts,
		routing
	]);
	const addRecipient = () => {
		const trimmed = recipientDraft.trim();
		const err = validateEmail(trimmed);
		if (err) {
			setErrors((prev) => ({
				...prev,
				recipientDraft: err
			}));
			return;
		}
		if (recipients.includes(trimmed)) {
			setErrors((prev) => ({
				...prev,
				recipientDraft: "That address is already in the list"
			}));
			return;
		}
		setRecipients((prev) => [...prev, trimmed]);
		setRecipientDraft("");
		setErrors((prev) => {
			const { recipientDraft: _drop, ...rest } = prev;
			return rest;
		});
	};
	const removeRecipient = (address) => {
		setRecipients((prev) => prev.filter((r) => r !== address));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaveError(null);
		const nextErrors = {};
		const webhookErr = validateWebhookUrl(webhookUrl);
		if (webhookErr) nextErrors.webhookUrl = webhookErr;
		const cooldownValue = parseMinutes(cooldown);
		if (cooldownValue === null) nextErrors.cooldown = "Enter a whole number of minutes (0 or greater)";
		const escalationValue = parseMinutes(escalation);
		if (escalation.trim().length > 0 && escalationValue === null) nextErrors.escalation = "Enter a whole number of minutes (0 or greater)";
		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			return;
		}
		setErrors({});
		const payload = {
			customer: customerKey,
			cooldownMinutes: BigInt(cooldownValue ?? DEFAULT_COOLDOWN_MINUTES),
			emailRecipients: recipients,
			...webhookUrl.trim().length > 0 ? { teamsWebhookUrl: webhookUrl.trim() } : {},
			...escalationValue !== null ? { escalationMinutes: BigInt(escalationValue) } : {}
		};
		try {
			await saveRouting(payload);
			setSavedAt(/* @__PURE__ */ new Date());
		} catch (err) {
			const kind = err instanceof Error ? err.message : "Unknown";
			setSaveError(kind === "InvalidWebhookUrl" ? "The Teams webhook URL was rejected. Check that it is a valid https URL." : kind === "NotAuthorized" ? "You are not authorized to change notification routing." : kind === "InvalidRule" ? "The routing configuration was rejected as invalid." : "Failed to save notification routing. Please try again.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "notification_settings.page",
		className: "max-w-3xl mx-auto space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, {
				size: 20,
				className: "text-primary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold text-foreground tracking-tight",
				children: "Notification Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm mt-1",
				children: "Configure Microsoft Teams and email routing, duplicate suppression, and escalation for this customer."
			})] })]
		}), isLoading || isLoadingAlerts ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "notification_settings.loading_state",
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })]
		}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ocid": "notification_settings.error_state",
			className: "flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				size: 16,
				className: "text-destructive mt-0.5"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground",
				children: "Could not load notification routing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: "Refresh the page to try again."
			})] })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavedSummary, { routing: routing ?? null }),
			savedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "notification_settings.success_state",
				className: "flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
					size: 15,
					className: "text-primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-foreground",
					children: [
						"Notification routing saved at",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: savedAt.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})
						}),
						"."
					]
				})]
			}),
			saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "notification_settings.save_error",
				className: "flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					size: 15,
					className: "text-destructive mt-0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foreground",
					children: saveError
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"data-ocid": "notification_settings.teams_section",
						className: "rounded-xl border border-border bg-card p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Webhook, {
									size: 15,
									className: "text-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display font-semibold text-sm text-foreground",
									children: "Microsoft Teams Webhook"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Alerts routed to Teams are posted to this incoming webhook URL. Leave blank to disable the Teams channel."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "teams-webhook",
										className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
										children: "Webhook URL"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "teams-webhook",
										type: "url",
										"data-ocid": "notification_settings.webhook_input",
										value: webhookUrl,
										onChange: (e) => {
											setWebhookUrl(e.target.value);
											if (errors.webhookUrl) setErrors((prev) => {
												const { webhookUrl: _drop, ...rest } = prev;
												return rest;
											});
										},
										placeholder: "https://outlook.office.com/webhook/...",
										"aria-invalid": !!errors.webhookUrl,
										className: `w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${errors.webhookUrl ? "border-destructive focus:ring-destructive/60" : "border-border focus:ring-primary/60"}`
									}),
									errors.webhookUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										"data-ocid": "notification_settings.webhook_error",
										className: "text-xs text-destructive",
										children: errors.webhookUrl
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"data-ocid": "notification_settings.email_section",
						className: "rounded-xl border border-border bg-card p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
										size: 15,
										className: "text-primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display font-semibold text-sm text-foreground",
										children: "Email Recipients"
									}),
									recipients.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "font-mono text-[10px] text-muted-foreground border-border",
										children: recipients.length
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Each address receives an email for every notification that is not suppressed by the cooldown."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "recipient-input",
										className: "sr-only",
										children: "Email address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "recipient-input",
										type: "email",
										"data-ocid": "notification_settings.recipient_input",
										value: recipientDraft,
										onChange: (e) => {
											setRecipientDraft(e.target.value);
											if (errors.recipientDraft) setErrors((prev) => {
												const { recipientDraft: _drop, ...rest } = prev;
												return rest;
											});
										},
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addRecipient();
											}
										},
										placeholder: "security-team@example.com",
										"aria-invalid": !!errors.recipientDraft,
										className: `w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${errors.recipientDraft ? "border-destructive focus:ring-destructive/60" : "border-border focus:ring-primary/60"}`
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									"data-ocid": "notification_settings.add_recipient_button",
									onClick: addRecipient,
									className: "gap-1.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), "Add"]
								})]
							}),
							errors.recipientDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								"data-ocid": "notification_settings.recipient_error",
								className: "text-xs text-destructive",
								children: errors.recipientDraft
							}),
							recipients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-ocid": "notification_settings.recipients_empty_state",
								className: "rounded-md border border-dashed border-border px-4 py-5 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "No email recipients yet. Add at least one address to deliver notifications by email."
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								"data-ocid": "notification_settings.recipients_list",
								className: "space-y-1.5",
								children: recipients.map((address, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									"data-ocid": `notification_settings.recipient_item.${idx + 1}`,
									className: "flex items-center justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-foreground truncate",
										children: address
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-ocid": `notification_settings.remove_recipient_button.${idx + 1}`,
										onClick: () => removeRecipient(address),
										className: "shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
										"aria-label": `Remove ${address}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
									})]
								}, address))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"data-ocid": "notification_settings.timing_section",
						className: "rounded-xl border border-border bg-card p-5 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
								size: 15,
								className: "text-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display font-semibold text-sm text-foreground",
								children: "Suppression & Escalation"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "cooldown-input",
										className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
										children: "Duplicate-suppression cooldown"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "cooldown-input",
											type: "number",
											min: 0,
											step: 1,
											"data-ocid": "notification_settings.cooldown_input",
											value: cooldown,
											onChange: (e) => {
												setCooldown(e.target.value);
												if (errors.cooldown) setErrors((prev) => {
													const { cooldown: _drop, ...rest } = prev;
													return rest;
												});
											},
											"aria-invalid": !!errors.cooldown,
											className: `w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 transition-colors ${errors.cooldown ? "border-destructive focus:ring-destructive/60" : "border-border focus:ring-primary/60"}`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground shrink-0",
											children: "minutes"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Repeated alerts for the same finding are suppressed within this window. Defaults to 60 minutes."
									}),
									errors.cooldown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										"data-ocid": "notification_settings.cooldown_error",
										className: "text-xs text-destructive",
										children: errors.cooldown
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "escalation-input",
										className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
										children: "Escalation window"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "escalation-input",
											type: "number",
											min: 0,
											step: 1,
											"data-ocid": "notification_settings.escalation_input",
											value: escalation,
											onChange: (e) => {
												setEscalation(e.target.value);
												if (errors.escalation) setErrors((prev) => {
													const { escalation: _drop, ...rest } = prev;
													return rest;
												});
											},
											placeholder: "e.g. 30",
											"aria-invalid": !!errors.escalation,
											className: `w-full rounded-md border bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${errors.escalation ? "border-destructive focus:ring-destructive/60" : "border-border focus:ring-primary/60"}`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground shrink-0",
											children: "minutes"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "If a notification is not acknowledged within this window, it is escalated. Leave blank to disable escalation."
									}),
									errors.escalation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										"data-ocid": "notification_settings.escalation_error",
										className: "text-xs text-destructive",
										children: errors.escalation
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-end gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							"data-ocid": "notification_settings.save_button",
							disabled: isPending,
							className: "gap-2 bg-primary hover:bg-primary/90",
							children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }), "Saving…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 14 }), "Save routing"] })
						})
					})
				]
			})
		] })]
	}) });
}
export { NotificationSettingsPage as default };
