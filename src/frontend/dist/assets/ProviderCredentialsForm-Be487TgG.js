import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { $ as useSaveProviderCredential, V as useProviderCredentialStatus, ct as useUpdateProviderCredential, rt as useTestProviderConnection, u as useClearProviderCredential, ut as createLucideIcon } from "./use-backend-C00QWIg7.js";
import { t as cn } from "./utils-Dt9zQ6gD.js";
import { t as Button } from "./button-BzL40mBy.js";
import { t as Input } from "./input-DRmrQsxb.js";
import { t as Label } from "./label-DKpYm3Db.js";
import { t as Skeleton } from "./skeleton-Co_kaRlX.js";
import { t as CircleCheck } from "./circle-check-oM7foquT.js";
import { t as LoaderCircle } from "./loader-circle-CHt_0PLM.js";
import { t as Save } from "./save-B5hEQrai.js";
import { t as ShieldCheck } from "./shield-check-qpZrj14a.js";
import { t as Trash2 } from "./trash-2-Df6HVUZV.js";
import { t as TriangleAlert } from "./triangle-alert-BkFNXZBH.js";
import { t as ue } from "./dist-muuRpw8y.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var KeyRound = createLucideIcon("key-round", [["path", {
	d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
	key: "1s6t7t"
}], ["circle", {
	cx: "16.5",
	cy: "7.5",
	r: ".5",
	fill: "currentColor",
	key: "w0ekpg"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var PlugZap = createLucideIcon("plug-zap", [
	["path", {
		d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
		key: "goz73y"
	}],
	["path", {
		d: "m2 22 3-3",
		key: "19mgm9"
	}],
	["path", {
		d: "M7.5 13.5 10 11",
		key: "7xgeeb"
	}],
	["path", {
		d: "M10.5 16.5 13 14",
		key: "10btkg"
	}],
	["path", {
		d: "m18 3-4 4h6l-4 4",
		key: "16psg9"
	}]
]);
// src/components/ui/textarea.tsx
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
// src/components/ProviderCredentialsForm.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var FIELD_SCHEMA = {
	AWS: [
		{
			key: "roleArn",
			label: "Role ARN",
			placeholder: "arn:aws:iam::123456789012:role/SecurityAudit",
			required: true
		},
		{
			key: "externalId",
			label: "External ID",
			placeholder: "optional external ID",
			required: false
		},
		{
			key: "regions",
			label: "Regions",
			placeholder: "us-east-1, eu-west-1",
			required: true,
			list: true
		}
	],
	Azure: [
		{
			key: "clientId",
			label: "Client ID",
			placeholder: "00000000-0000-0000-0000-000000000000",
			required: true
		},
		{
			key: "clientSecret",
			label: "Client Secret",
			placeholder: "Enter the client secret",
			required: true,
			secret: true
		},
		{
			key: "tenantId",
			label: "Tenant ID",
			placeholder: "00000000-0000-0000-0000-000000000000",
			required: true
		},
		{
			key: "subscriptionIds",
			label: "Subscription IDs",
			placeholder: "sub-abc, sub-def",
			required: true,
			list: true
		}
	],
	GCP: [{
		key: "serviceAccountJson",
		label: "Service Account JSON",
		placeholder: "{ \"type\": \"service_account\", \"project_id\": \"…\" }",
		required: true,
		secret: true,
		multiline: true
	}, {
		key: "projectIds",
		label: "Project IDs",
		placeholder: "my-project-1, my-project-2",
		required: true,
		list: true
	}]
};
function emptyDraft(provider) {
	const draft = {};
	for (const field of FIELD_SCHEMA[provider]) draft[field.key] = "";
	return draft;
}
function splitList(value) {
	return value.split(",").map((part) => part.trim()).filter((part) => part.length > 0);
}
function buildInput(provider, draft) {
	if (provider === "AWS") {
		const externalId = draft.externalId.trim();
		return {
			__kind__: "AWS",
			AWS: {
				roleArn: draft.roleArn.trim(),
				...externalId ? { externalId } : {},
				regions: splitList(draft.regions)
			}
		};
	}
	if (provider === "Azure") return {
		__kind__: "Azure",
		Azure: {
			clientId: draft.clientId.trim(),
			clientSecret: draft.clientSecret.trim(),
			tenantId: draft.tenantId.trim(),
			subscriptionIds: splitList(draft.subscriptionIds)
		}
	};
	return {
		__kind__: "GCP",
		GCP: {
			serviceAccountJson: draft.serviceAccountJson.trim(),
			projectIds: splitList(draft.projectIds)
		}
	};
}
/** Returns the first invalid field's message, or null when the draft is valid. */
function validate(provider, draft) {
	for (const field of FIELD_SCHEMA[provider]) {
		const raw = draft[field.key] ?? "";
		if (field.required && raw.trim().length === 0) return `${field.label} is required`;
		if (field.list && raw.trim().length > 0 && splitList(raw).length === 0) return `${field.label} must contain at least one value`;
	}
	if (provider === "GCP" && draft.serviceAccountJson.trim().length > 0) try {
		JSON.parse(draft.serviceAccountJson);
	} catch {
		return "Service Account JSON is not valid JSON";
	}
	return null;
}
function credentialErrorMessage(err) {
	switch (err.__kind__) {
		case "NotAuthorized": return "You do not have access to this provider's credentials";
		case "NotFound": return "No credential is configured for this provider";
		case "InvalidCredential": return err.InvalidCredential;
		case "VaultError": return err.VaultError;
		default: return "The credential could not be saved";
	}
}
function formatUpdatedAt(ts) {
	if (ts === void 0) return "—";
	const date = new Date(Number(ts / 1000000n));
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString([], {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function ProviderCredentialsForm({ provider }) {
	const { data: status, isLoading } = useProviderCredentialStatus(provider);
	const save = useSaveProviderCredential();
	const update = useUpdateProviderCredential();
	const clear = useClearProviderCredential();
	const test = useTestProviderConnection(provider);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(() => emptyDraft(provider));
	const [fieldError, setFieldError] = (0, import_react.useState)(null);
	const [formMessage, setFormMessage] = (0, import_react.useState)(null);
	const configured = status?.configured ?? false;
	const pending = save.isPending || update.isPending || clear.isPending;
	const setField = (key, value) => {
		setDraft((prev) => ({
			...prev,
			[key]: value
		}));
		setFieldError(null);
	};
	const startEditing = () => {
		setDraft(emptyDraft(provider));
		setFieldError(null);
		setFormMessage(null);
		setEditing(true);
	};
	const cancelEditing = () => {
		setEditing(false);
		setFieldError(null);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const invalid = validate(provider, draft);
		if (invalid) {
			setFieldError(invalid);
			setFormMessage({
				kind: "error",
				text: invalid
			});
			return;
		}
		const input = buildInput(provider, draft);
		try {
			const result = configured ? await update.mutateAsync(input) : await save.mutateAsync(input);
			if (result.__kind__ === "err") {
				const message = credentialErrorMessage(result.err);
				setFormMessage({
					kind: "error",
					text: message
				});
				ue.error(message);
				return;
			}
			setFormMessage({
				kind: "success",
				text: configured ? `${provider} credential updated` : `${provider} credential saved`
			});
			ue.success(configured ? `${provider} credential updated` : `${provider} credential saved`);
			setEditing(false);
			setDraft(emptyDraft(provider));
		} catch {
			const message = "The credential could not be saved";
			setFormMessage({
				kind: "error",
				text: message
			});
			ue.error(message);
		}
	};
	const handleClear = async () => {
		try {
			const result = await clear.mutateAsync(provider);
			if (result.__kind__ === "err") {
				const message = credentialErrorMessage(result.err);
				setFormMessage({
					kind: "error",
					text: message
				});
				ue.error(message);
				return;
			}
			setFormMessage({
				kind: "success",
				text: `${provider} credential cleared`
			});
			ue.success(`${provider} credential cleared`);
			setEditing(false);
			setDraft(emptyDraft(provider));
		} catch {
			const message = "The credential could not be cleared";
			setFormMessage({
				kind: "error",
				text: message
			});
			ue.error(message);
		}
	};
	const handleTest = () => {
		test.mutate(void 0, {
			onSuccess: (result) => {
				if (result.success) ue.success(`${provider} connection succeeded`, { description: result.message });
				else ue.error(`${provider} connection failed`, { description: result.message });
			},
			onError: () => {
				ue.error(`${provider} connection test failed`, { description: "The connection could not be tested." });
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": `provider_credentials.${provider.toLowerCase()}.section`,
		className: "vault-shell",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 px-5 py-4 border-b border-border/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
						size: 16,
						className: "vault-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-base font-bold text-foreground",
						children: [provider, " Credentials"]
					}),
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-20" }) : configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"data-ocid": `provider_credentials.${provider.toLowerCase()}.configured_badge`,
						className: "badge-vault",
						children: "Configured"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"data-ocid": `provider_credentials.${provider.toLowerCase()}.unconfigured_badge`,
						className: "badge-vault",
						children: "Not configured"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					"data-ocid": `provider_credentials.${provider.toLowerCase()}.test_button`,
					onClick: handleTest,
					disabled: test.isPending,
					children: [test.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						size: 13,
						className: "mr-1.5 animate-spin"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlugZap, {
						size: 13,
						className: "mr-1.5"
					}), "Test Connection"]
				}), !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					"data-ocid": `provider_credentials.${provider.toLowerCase()}.edit_button`,
					onClick: startEditing,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
						size: 13,
						className: "mr-1.5"
					}), configured ? "Edit" : "Configure"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 py-4 space-y-4",
			children: [
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: Array.from({ length: 3 }, (_, i) => `cred-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-full" }, id))
				}) : configured && status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2",
					children: status.fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-ocid": `provider_credentials.${provider.toLowerCase()}.field.${field.name}`,
						className: "flex items-center justify-between gap-3 border-b border-border/30 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
							children: field.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "min-w-0 text-right",
							children: field.isSet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "secret-masked text-xs",
								children: field.maskedValue || "••••••••••••"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Not set"
							})
						})]
					}, field.name))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					"data-ocid": `provider_credentials.${provider.toLowerCase()}.empty_state`,
					className: "text-xs text-muted-foreground",
					children: [
						"No ",
						provider,
						" credential is configured. Configure the typed fields below to enable ingestion and connection tests for this provider."
					]
				}),
				configured && status?.updatedAt !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[11px] text-muted-foreground",
					children: ["Last updated ", formatUpdatedAt(status.updatedAt)]
				}),
				formMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": `provider_credentials.${provider.toLowerCase()}.${formMessage.kind === "success" ? "success_state" : "error_state"}`,
					className: `flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${formMessage.kind === "success" ? "border-success/40 bg-success/10 text-success" : "border-destructive/40 bg-destructive/10 text-destructive"}`,
					children: [formMessage.kind === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
						size: 13,
						className: "mt-0.5 shrink-0"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						size: 13,
						className: "mt-0.5 shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formMessage.text })]
				}),
				editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					"data-ocid": `provider_credentials.${provider.toLowerCase()}.form`,
					className: "space-y-4",
					children: [
						FIELD_SCHEMA[provider].map((field) => {
							const inputId = `cred-${provider}-${field.key}`;
							const value = draft[field.key] ?? "";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: inputId,
										className: "text-xs text-muted-foreground uppercase tracking-wider",
										children: [field.label, field.required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive ml-1",
											children: "*"
										})]
									}),
									field.multiline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: inputId,
										"data-ocid": `provider_credentials.${provider.toLowerCase()}.${field.key}_input`,
										className: "font-mono text-xs min-h-24",
										placeholder: field.placeholder,
										value,
										onChange: (e) => setField(field.key, e.target.value)
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: inputId,
										"data-ocid": `provider_credentials.${provider.toLowerCase()}.${field.key}_input`,
										className: "font-mono",
										type: field.secret ? "password" : "text",
										placeholder: field.placeholder,
										value,
										onChange: (e) => setField(field.key, e.target.value)
									}),
									field.list && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Comma-separated values."
									})
								]
							}, field.key);
						}),
						fieldError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"data-ocid": `provider_credentials.${provider.toLowerCase()}.field_error`,
							className: "text-xs text-destructive",
							children: fieldError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "sm",
								"data-ocid": `provider_credentials.${provider.toLowerCase()}.save_button`,
								disabled: pending,
								children: [pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									size: 13,
									className: "mr-1.5 animate-spin"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
									size: 13,
									className: "mr-1.5"
								}), configured ? "Save Changes" : "Save Credential"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								"data-ocid": `provider_credentials.${provider.toLowerCase()}.cancel_button`,
								onClick: cancelEditing,
								disabled: pending,
								children: "Cancel"
							})]
						})
					]
				}),
				configured && !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-t border-border/40 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground",
						children: [
							"Clearing removes the stored credential for ",
							provider,
							". This is recorded in the audit log."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						"data-ocid": `provider_credentials.${provider.toLowerCase()}.clear_button`,
						onClick: handleClear,
						disabled: pending,
						className: "text-destructive hover:bg-destructive/10 shrink-0",
						children: [clear.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 13,
							className: "mr-1.5 animate-spin"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
							size: 13,
							className: "mr-1.5"
						}), "Clear"]
					})]
				}),
				test.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": `provider_credentials.${provider.toLowerCase()}.test_result`,
					className: `flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${test.data.success ? "border-success/40 bg-success/10 text-success" : "border-destructive/40 bg-destructive/10 text-destructive"}`,
					children: [test.data.success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						size: 13,
						className: "mt-0.5 shrink-0"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						size: 13,
						className: "mt-0.5 shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: test.data.message })]
				})
			]
		})]
	});
}
export { KeyRound as n, ProviderCredentialsForm as t };
