import { c as require_react, et as __toESM, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { D as useGetMyProviders, F as useListVaultSecrets, J as useRevealVaultSecret, c as useAuditLog, g as useDeleteVaultSecret, lt as useUpdateVaultSecret, tt as useSaveVaultSecret } from "./use-backend-C00QWIg7.js";
import { o as useComposedRefs, t as cn } from "./utils-Dt9zQ6gD.js";
import { n as buttonVariants, t as Button } from "./button-BzL40mBy.js";
import { t as Input } from "./input-DRmrQsxb.js";
import { t as Label } from "./label-DKpYm3Db.js";
import { t as Skeleton } from "./skeleton-Co_kaRlX.js";
import { c as createContextScope, i as createSlottable, l as composeEventHandlers } from "./dist-wg4nkkUd.js";
import { a as ScrollText, i as ShieldAlert, s as Lock, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as ProviderIcon } from "./ProviderIcon-9RfPlHNs.js";
import { t as EyeOff } from "./eye-off-D54Syrvw.js";
import { t as Eye } from "./eye-YXkjTxEs.js";
import { n as KeyRound, t as ProviderCredentialsForm } from "./ProviderCredentialsForm-Be487TgG.js";
import { t as LoaderCircle } from "./loader-circle-CHt_0PLM.js";
import { t as Pencil } from "./pencil-ylhzApE_.js";
import { t as Plus } from "./plus-D4c1gqpK.js";
import { t as Trash2 } from "./trash-2-Df6HVUZV.js";
import { t as ue } from "./dist-muuRpw8y.js";
import { a as Portal, c as Trigger, i as Overlay, l as WarningProvider, n as Content, o as Root, r as Description, s as Title, t as Close, u as createDialogScope } from "./dist-BdKlpRFE.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-yevwC5Fk.js";
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@radix-ui+react-alert-dialog@1.1.15_@types+react-dom@19.1.11_@types+react@19.1.17__@typ_3c56a406df72e8770bda4f7e201f7394/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext, createAlertDialogScope] = createContextScope(ROOT_NAME, [createDialogScope]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
	const { __scopeAlertDialog, ...alertDialogProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		...dialogScope,
		...alertDialogProps,
		modal: true
	});
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAlertDialog, ...triggerProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		...dialogScope,
		...triggerProps,
		ref: forwardedRef
	});
});
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
	const { __scopeAlertDialog, ...portalProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, {
		...dialogScope,
		...portalProps
	});
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAlertDialog, ...overlayProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
		...dialogScope,
		...overlayProps,
		ref: forwardedRef
	});
});
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAlertDialog, children, ...contentProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef);
	const cancelRef = import_react.useRef(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WarningProvider, {
		contentName: CONTENT_NAME,
		titleName: TITLE_NAME,
		docsSlug: "alert-dialog",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContentProvider, {
			scope: __scopeAlertDialog,
			cancelRef,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
				role: "alertdialog",
				...dialogScope,
				...contentProps,
				ref: composedRefs,
				onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
					event.preventDefault();
					cancelRef.current?.focus({ preventScroll: true });
				}),
				onPointerDownOutside: (event) => event.preventDefault(),
				onInteractOutside: (event) => event.preventDefault(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slottable, { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DescriptionWarning, { contentRef })]
			})
		})
	});
});
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAlertDialog, ...titleProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
		...dialogScope,
		...titleProps,
		ref: forwardedRef
	});
});
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAlertDialog, ...descriptionProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
		...dialogScope,
		...descriptionProps,
		ref: forwardedRef
	});
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAlertDialog, ...actionProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
		...dialogScope,
		...actionProps,
		ref: forwardedRef
	});
});
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAlertDialog, ...cancelProps } = props;
	const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
	const dialogScope = useDialogScope(__scopeAlertDialog);
	const ref = useComposedRefs(forwardedRef, cancelRef);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
		...dialogScope,
		...cancelProps,
		ref
	});
});
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
	const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
	import_react.useEffect(() => {
		if (!document.getElementById(contentRef.current?.getAttribute("aria-describedby"))) console.warn(MESSAGE);
	}, [MESSAGE, contentRef]);
	return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
// src/components/ui/alert-dialog.tsx
function AlertDialog({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		"data-slot": "alert-dialog",
		...props
	});
}
function AlertDialogPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, {
		"data-slot": "alert-dialog-portal",
		...props
	});
}
function AlertDialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
		"data-slot": "alert-dialog-overlay",
		className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
		...props
	});
}
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		"data-slot": "alert-dialog-content",
		className: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
		...props
	})] });
}
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "alert-dialog-header",
		className: cn("flex flex-col gap-2 text-center sm:text-left", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "alert-dialog-footer",
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		"data-slot": "alert-dialog-title",
		className: cn("text-lg font-semibold", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		"data-slot": "alert-dialog-description",
		className: cn("text-muted-foreground text-sm", className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
		className: cn(buttonVariants(), className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
		className: cn(buttonVariants({ variant: "outline" }), className),
		...props
	});
}
// src/pages/VaultPage.tsx
var PROVIDERS = [
	"AWS",
	"Azure",
	"GCP"
];
var providerAccent = {
	AWS: "provider-aws",
	Azure: "provider-azure",
	GCP: "provider-gcp"
};
function timestampToDate(ts) {
	const date = new Date(Number(ts / 1000000n));
	return Number.isNaN(date.getTime()) ? null : date;
}
function formatTimestamp(ts) {
	const d = timestampToDate(ts);
	if (!d) return "—";
	return d.toLocaleString([], {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatAuditTime(ts) {
	const d = timestampToDate(ts);
	if (!d) return "—";
	return d.toLocaleString([], {
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
}
function maskValue() {
	return "••••••••••••";
}
function SecretValueCell({ entry, revealed, onReveal, isRevealing }) {
	if (revealed !== null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "secret-revealed text-xs",
		"data-ocid": "vault.secret_revealed",
		children: revealed
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "secret-masked text-xs",
			"data-ocid": "vault.secret_masked",
			children: maskValue()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"data-ocid": "vault.reveal_button",
			onClick: onReveal,
			disabled: isRevealing,
			className: "secret-reveal-toggle inline-flex items-center gap-1",
			"aria-label": `Reveal secret ${entry.name}`,
			children: [isRevealing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
				size: 10,
				className: "animate-spin"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 10 }), "Reveal"]
		})]
	});
}
function SecretFormDialog({ open, onOpenChange, editing, defaultProvider }) {
	const save = useSaveVaultSecret();
	const update = useUpdateVaultSecret();
	const [provider, setProvider] = (0, import_react.useState)(defaultProvider);
	const [name, setName] = (0, import_react.useState)("");
	const [value, setValue] = (0, import_react.useState)("");
	import_react.useEffect(() => {
		if (open) {
			setProvider(editing?.provider ?? defaultProvider);
			setName(editing?.name ?? "");
			setValue("");
		}
	}, [
		open,
		editing,
		defaultProvider
	]);
	const isEditing = editing !== null;
	const pending = save.isPending || update.isPending;
	const canSubmit = name.trim().length > 0 && value.trim().length > 0;
	const handleSubmit = async (e) => {
		e.preventDefault();
		const trimmedName = name.trim();
		const trimmedValue = value.trim();
		if (!trimmedName || !trimmedValue) return;
		try {
			if (isEditing) {
				await update.mutateAsync({
					provider: editing.provider,
					name: trimmedName,
					value: trimmedValue
				});
				ue.success(`Secret "${trimmedName}" updated`);
			} else {
				await save.mutateAsync({
					provider,
					name: trimmedName,
					value: trimmedValue
				});
				ue.success(`Secret "${trimmedName}" saved`);
			}
			onOpenChange(false);
		} catch (err) {
			const kind = typeof err === "object" && err !== null && "err" in err ? err.err.__kind__ ?? "" : "";
			if (kind === "AlreadyExists") ue.error(`A secret named "${trimmedName}" already exists`);
			else if (kind === "InvalidName") ue.error("That secret name is not valid");
			else if (kind === "NotAuthorized") ue.error("You do not have access to this provider's vault");
			else ue.error(isEditing ? "Failed to update secret" : "Failed to save secret");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			"data-ocid": "vault.secret_dialog",
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display",
				children: isEditing ? "Edit Secret" : "Add Secret"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: isEditing ? `Update the value of "${editing.name}". The new value is encrypted at rest.` : "Store an arbitrary named secret (API key, token, password, service account JSON) for a provider." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "vault-provider",
							className: "text-xs text-muted-foreground uppercase tracking-wider",
							children: "Provider"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							children: PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-ocid": `vault.provider_option.${p.toLowerCase()}`,
								disabled: isEditing,
								onClick: () => setProvider(p),
								className: `${providerAccent[p]} flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-mono font-semibold transition-colors ${provider === p ? "nav-provider-active border-border" : "border-border text-muted-foreground hover:bg-muted/40"} ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, {
									provider: p,
									showLabel: false
								}), p]
							}, p))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "vault-name",
							className: "text-xs text-muted-foreground uppercase tracking-wider",
							children: "Secret Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "vault-name",
							"data-ocid": "vault.name_input",
							placeholder: "e.g. prod-stripe-api-key",
							className: "font-mono",
							value: name,
							disabled: isEditing,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "vault-value",
								className: "text-xs text-muted-foreground uppercase tracking-wider",
								children: "Secret Value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "vault-value",
								"data-ocid": "vault.value_input",
								placeholder: "Enter the secret value",
								className: "font-mono",
								type: "password",
								value,
								onChange: (e) => setValue(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Encrypted at rest. Never shown in list views."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						"data-ocid": "vault.cancel_button",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "sm",
						"data-ocid": "vault.save_button",
						disabled: pending || !canSubmit,
						children: [pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 13,
							className: "animate-spin mr-1.5"
						}), isEditing ? "Save Changes" : "Add Secret"]
					})] })
				]
			})]
		})
	});
}
function ProviderVaultPanel({ provider }) {
	const { data: secrets, isLoading } = useListVaultSecrets(provider);
	const reveal = useRevealVaultSecret();
	const deleteSecret = useDeleteVaultSecret();
	const [revealed, setRevealed] = (0, import_react.useState)({});
	const [revealing, setRevealing] = (0, import_react.useState)({});
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const key = (name) => `${provider}:${name}`;
	const handleReveal = async (entry) => {
		const k = key(entry.name);
		setRevealing((prev) => ({
			...prev,
			[k]: true
		}));
		try {
			const value = await reveal.mutateAsync({
				provider: entry.provider,
				name: entry.name
			});
			setRevealed((prev) => ({
				...prev,
				[k]: value
			}));
		} catch {
			ue.error("Unable to reveal secret — check your provider access");
		} finally {
			setRevealing((prev) => ({
				...prev,
				[k]: false
			}));
		}
	};
	const handleHide = (entry) => {
		const k = key(entry.name);
		setRevealed((prev) => {
			const next = { ...prev };
			delete next[k];
			return next;
		});
	};
	const handleDelete = async () => {
		if (!deleting) return;
		try {
			await deleteSecret.mutateAsync({
				provider: deleting.provider,
				name: deleting.name
			});
			ue.success(`Secret "${deleting.name}" deleted`);
			setDeleting(null);
		} catch {
			ue.error("Failed to delete secret");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": `vault.panel.${provider.toLowerCase()}`,
		className: "vault-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 px-5 py-4 border-b border-border/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
							size: 16,
							className: "vault-accent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-base font-bold text-foreground",
							children: [provider, " Vault"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge-vault",
							children: "Encrypted"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					"data-ocid": "vault.add_button",
					onClick: () => {
						setEditing(null);
						setDialogOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 14,
						className: "mr-1.5"
					}), "Add Secret"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left data-dense",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Secret Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Provider"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Last Updated"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Secret Value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-40" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-28" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-32" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-20 ml-auto" })
							})
						]
					}, id)) : secrets && secrets.length > 0 ? secrets.map((entry, idx) => {
						const k = key(entry.name);
						const isRevealed = revealed[k] !== void 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							"data-ocid": `vault.row.${idx + 1}`,
							className: "border-b border-border/30 hover:bg-muted/10 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 font-mono text-xs font-medium text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
											size: 12,
											className: "vault-accent"
										}), entry.name]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `${providerAccent[entry.provider]} inline-flex`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, { provider: entry.provider })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-2.5 font-mono text-[11px] text-muted-foreground",
									children: formatTimestamp(entry.updatedAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecretValueCell, {
										entry,
										revealed: isRevealed ? revealed[k] : null,
										onReveal: () => handleReveal(entry),
										isRevealing: !!revealing[k]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-1",
										children: [
											isRevealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-ocid": "vault.hide_button",
												onClick: () => handleHide(entry),
												className: "secret-reveal-toggle inline-flex items-center gap-1",
												"aria-label": `Hide secret ${entry.name}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 10 }), "Hide"]
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-ocid": "vault.edit_button",
												onClick: () => {
													setEditing(entry);
													setDialogOpen(true);
												},
												className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-mono text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors",
												"aria-label": `Edit secret ${entry.name}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 11 }), "Edit"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-ocid": "vault.delete_button",
												onClick: () => setDeleting(entry),
												className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-mono text-destructive hover:bg-destructive/10 transition-colors",
												"aria-label": `Delete secret ${entry.name}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 11 }), "Delete"]
											})
										]
									})
								})
							]
						}, k);
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-5 py-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-ocid": "vault.empty_state",
							className: "flex flex-col items-center justify-center text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
									size: 28,
									className: "vault-accent mb-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-sm font-semibold text-foreground",
									children: ["No secrets stored for ", provider]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1 max-w-sm",
									children: "Add API keys, tokens, passwords, or service account JSON. Values are encrypted at rest and masked by default."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									"data-ocid": "vault.empty_add_button",
									className: "mt-4",
									onClick: () => {
										setEditing(null);
										setDialogOpen(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										size: 14,
										className: "mr-1.5"
									}), "Add Secret"]
								})
							]
						})
					}) }) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecretFormDialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				editing,
				defaultProvider: provider
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: deleting !== null,
				onOpenChange: (o) => !o && setDeleting(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					"data-ocid": "vault.delete_dialog",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "font-display",
						children: "Delete secret?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						"This permanently deletes \"",
						deleting?.name,
						"\" from the",
						" ",
						deleting?.provider,
						" vault. This action is recorded in the audit log and cannot be undone."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						"data-ocid": "vault.delete_cancel_button",
						onClick: () => setDeleting(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
						"data-ocid": "vault.delete_confirm_button",
						onClick: handleDelete,
						className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
						children: [deleteSecret.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 13,
							className: "animate-spin mr-1.5"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
							size: 13,
							className: "mr-1.5"
						}), "Delete"]
					})] })]
				})
			})
		]
	});
}
function AuditLogSection() {
	const { data: entries, isLoading } = useAuditLog("", 50);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "vault.audit_log",
		className: "vault-shell",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 px-5 py-4 border-b border-border/60",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, {
					size: 16,
					className: "vault-accent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-base font-bold text-foreground",
					children: "Audit Log"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "badge-vault",
					children: "Read-only"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-5 py-4",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: Array.from({ length: 4 }, (_, i) => `audit-skeleton-${i}`).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-full" }, id))
			}) : entries && entries.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2.5",
				children: entries.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					"data-ocid": `vault.audit_item.${idx + 1}`,
					className: "flex items-start gap-3 rounded-md border border-border/40 bg-card/40 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
							size: 13,
							className: "vault-accent mt-0.5 shrink-0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: entry.actorId
									}),
									" ",
									entry.action
								]
							}), entry.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] text-muted-foreground truncate",
								children: entry.details
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted-foreground shrink-0",
							children: formatAuditTime(entry.timestamp)
						})
					]
				}, entry.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground text-center py-4",
				children: "No vault activity recorded yet."
			})
		})]
	});
}
function VaultPage() {
	const [activeProvider, setActiveProvider] = (0, import_react.useState)("AWS");
	const { data: myProviders = [], isLoading: loadingProviders } = useGetMyProviders();
	const hasAccess = myProviders.includes(activeProvider);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "vault.page",
		className: "space-y-6 max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-bold text-foreground tracking-tight",
					children: "Cloud Vault"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm mt-1",
					children: "Centralized per-provider secret storage. Values are masked by default and revealed only on demand."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "badge-vault mt-1",
					children: "Encrypted at rest"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "vault.provider_tabs",
				className: "grid grid-cols-3 gap-2",
				children: PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-ocid": `vault.provider_tab.${p.toLowerCase()}`,
					onClick: () => setActiveProvider(p),
					className: `${providerAccent[p]} flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-mono text-sm font-semibold transition-smooth ${activeProvider === p ? "nav-provider-active border-border" : "border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderIcon, {
						provider: p,
						showLabel: false
					}), p]
				}, p))
			}),
			loadingProviders ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ocid": "vault.credentials.loading_state",
				className: "vault-shell px-5 py-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-48" })
			}) : hasAccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCredentialsForm, { provider: activeProvider }, `credentials-${activeProvider}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ocid": "vault.credentials.access_denied",
				className: "vault-shell flex items-center gap-3 px-5 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					size: 18,
					className: "vault-accent shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-sm font-semibold text-foreground",
					children: [activeProvider, " credentials unavailable"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: [
						"You are not assigned to the ",
						activeProvider,
						" provider. Contact an administrator to request access."
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderVaultPanel, { provider: activeProvider }, activeProvider),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditLogSection, {})
		]
	}) });
}
export { VaultPage as default };
