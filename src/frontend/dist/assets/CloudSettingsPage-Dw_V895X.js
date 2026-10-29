import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { E as useGetEnrichmentKeys, Z as useSaveEnrichmentKeys, j as useGetWebhookSecretStatus, nt as useSaveWebhookSecret } from "./use-backend-C00QWIg7.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Input } from "./input-DRmrQsxb.js";
import { t as Label } from "./label-DKpYm3Db.js";
import { t as Layout } from "./Layout-9d6smJ4x.js";
import { t as CircleCheck } from "./circle-check-oM7foquT.js";
import { t as EyeOff } from "./eye-off-D54Syrvw.js";
import { t as Eye } from "./eye-YXkjTxEs.js";
import { t as LoaderCircle } from "./loader-circle-CHt_0PLM.js";
import { t as ShieldOff } from "./shield-off-B4nPNtds.js";
import { t as ue } from "./dist-muuRpw8y.js";
// src/pages/CloudSettingsPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function PasswordInput({ id, placeholder, ...rest }) {
	const [show, setShow] = import_react.useState(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			type: show ? "text" : "password",
			placeholder,
			className: "font-mono pr-9",
			...rest
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": show ? "Hide" : "Show",
			onClick: () => setShow((s) => !s),
			className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
			children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 14 })
		})]
	});
}
function ThreatIntelSection() {
	const { data: keyStatus, isLoading: keysLoading } = useGetEnrichmentKeys();
	const saveKeys = useSaveEnrichmentKeys();
	const [abuseKey, setAbuseKey] = (0, import_react.useState)("");
	const [vtKey, setVtKey] = (0, import_react.useState)("");
	const handleSave = async () => {
		try {
			await saveKeys.mutateAsync({
				abuseIpdbKey: abuseKey.trim() || null,
				virusTotalKey: vtKey.trim() || null
			});
			ue.success("API keys saved");
			setAbuseKey("");
			setVtKey("");
		} catch {
			ue.error("Failed to save API keys");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"data-ocid": "settings.threat_intel.section",
		className: "rounded-xl border border-border bg-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 py-4 border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-sm font-semibold text-foreground",
				children: "Threat Intelligence"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground mt-0.5",
				children: "API keys for AbuseIPDB and VirusTotal enrichment. Keys are stored securely and never returned to the frontend."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pb-6 pt-4 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "abuse-ipdb-key",
							className: "text-xs text-muted-foreground uppercase tracking-wider",
							children: "AbuseIPDB API Key"
						}), keysLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 11,
							className: "animate-spin text-muted-foreground"
						}) : keyStatus?.abuseIpdbKeySet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 11 }), "Key configured"]
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						id: "abuse-ipdb-key",
						placeholder: "Enter AbuseIPDB API key",
						value: abuseKey,
						onChange: (e) => setAbuseKey(e.target.value),
						"data-ocid": "settings.threat_intel.abuseipdb_input"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "virus-total-key",
							className: "text-xs text-muted-foreground uppercase tracking-wider",
							children: "VirusTotal API Key"
						}), keysLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 11,
							className: "animate-spin text-muted-foreground"
						}) : keyStatus?.virusTotalKeySet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 11 }), "Key configured"]
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						id: "virus-total-key",
						placeholder: "Enter VirusTotal API key",
						value: vtKey,
						onChange: (e) => setVtKey(e.target.value),
						"data-ocid": "settings.threat_intel.virustotal_input"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					"data-ocid": "settings.threat_intel.save_button",
					disabled: saveKeys.isPending || !abuseKey.trim() && !vtKey.trim(),
					onClick: handleSave,
					className: "min-w-[140px]",
					children: [saveKeys.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						size: 13,
						className: "animate-spin mr-1.5"
					}), "Save API Keys"]
				})
			]
		})]
	});
}
var WEBHOOK_PROVIDERS = [
	{
		provider: "AWS",
		label: "AWS"
	},
	{
		provider: "Azure",
		label: "Azure"
	},
	{
		provider: "GCP",
		label: "GCP"
	}
];
function WebhookSecretSection() {
	const { data: status, isLoading: statusLoading } = useGetWebhookSecretStatus();
	const saveSecret = useSaveWebhookSecret();
	const [secrets, setSecrets] = (0, import_react.useState)({
		AWS: "",
		Azure: "",
		GCP: ""
	});
	const isConfigured = (p) => p === "AWS" ? status?.awsSet : p === "Azure" ? status?.azureSet : status?.gcpSet;
	const handleSave = async (provider) => {
		const secret = secrets[provider].trim();
		if (!secret) return;
		try {
			await saveSecret.mutateAsync({
				provider,
				secret
			});
			ue.success(`${provider} webhook secret saved`);
			setSecrets((prev) => ({
				...prev,
				[provider]: ""
			}));
		} catch {
			ue.error(`Failed to save ${provider} webhook secret`);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"data-ocid": "settings.webhook_secrets.section",
		className: "rounded-xl border border-border bg-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 py-4 border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-sm font-semibold text-foreground",
				children: "Webhook Signature Secrets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground mt-0.5",
				children: "Per-provider secrets used to verify incoming webhook signatures. Secrets are stored securely and never returned to the frontend."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-5 pb-6 pt-4 space-y-5",
			children: WEBHOOK_PROVIDERS.map(({ provider, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						htmlFor: `webhook-secret-${provider.toLowerCase()}`,
						className: "text-xs text-muted-foreground uppercase tracking-wider",
						children: [label, " Webhook Secret"]
					}), statusLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						size: 11,
						className: "animate-spin text-muted-foreground"
					}) : isConfigured(provider) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 11 }), "Secret configured"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { size: 11 }), "Not configured"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
							id: `webhook-secret-${provider.toLowerCase()}`,
							placeholder: `Enter ${label} webhook secret`,
							value: secrets[provider],
							onChange: (e) => setSecrets((prev) => ({
								...prev,
								[provider]: e.target.value
							})),
							"data-ocid": `settings.webhook_secrets.${provider.toLowerCase()}_input`
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						"data-ocid": `settings.webhook_secrets.${provider.toLowerCase()}_save_button`,
						disabled: saveSecret.isPending || !secrets[provider].trim(),
						onClick: () => handleSave(provider),
						className: "min-w-[120px]",
						children: [saveSecret.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 13,
							className: "animate-spin mr-1.5"
						}), "Save Secret"]
					})]
				})]
			}, provider))
		})]
	});
}
function CloudSettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "settings.page",
		className: "space-y-6 max-w-4xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-start justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold text-foreground tracking-tight",
				children: "Cloud Provider Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm mt-1",
				children: "Threat intelligence and webhook security configuration"
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreatIntelSection, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebhookSecretSection, {})]
		})]
	}) });
}
export { CloudSettingsPage as default };
