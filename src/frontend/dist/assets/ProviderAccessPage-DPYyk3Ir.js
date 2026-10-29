import { c as require_react, et as __toESM, r as useInternetIdentity, s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { D as useGetMyProviders, G as useRemoveProviderAccess, P as useListUserAssignments, s as useAssignProviderAccess } from "./use-backend-C00QWIg7.js";
import { t as Button } from "./button-BzL40mBy.js";
import { s as Lock, t as Layout } from "./Layout-9d6smJ4x.js";
import { t as CircleCheck } from "./circle-check-oM7foquT.js";
import { t as LoaderCircle } from "./loader-circle-CHt_0PLM.js";
import { t as ShieldCheck } from "./shield-check-qpZrj14a.js";
import { t as ShieldOff } from "./shield-off-B4nPNtds.js";
import { t as UserX } from "./user-x-DKWb52Qw.js";
import { t as ue } from "./dist-muuRpw8y.js";
import { t as Checkbox } from "./checkbox-BgEW2MjN.js";
// src/pages/ProviderAccessPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PROVIDERS = [
	{
		provider: "AWS",
		accentClass: "provider-aws"
	},
	{
		provider: "Azure",
		accentClass: "provider-azure"
	},
	{
		provider: "GCP",
		accentClass: "provider-gcp"
	}
];
var ALL_PROVIDERS = PROVIDERS.map((p) => p.provider);
function shortPrincipal(principal) {
	if (principal.length <= 20) return principal;
	return `${principal.slice(0, 10)}…${principal.slice(-8)}`;
}
function ProviderChip({ provider, accentClass, granted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		"data-ocid": `provider_access.my_provider.${provider.toLowerCase()}`,
		className: `${accentClass} inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${granted ? "border-[var(--provider-accent)] bg-[var(--provider-soft)] text-[var(--provider-accent)]" : "border-border bg-muted/20 text-muted-foreground"}`,
		children: [granted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 11 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { size: 11 }), provider]
	});
}
function ProviderToggle({ provider, accentClass, checked, disabled, disabledReason, onCheckedChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${accentClass} flex items-center justify-center gap-2`,
		"data-ocid": `provider_access.toggle.${provider.toLowerCase()}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
			id: `provider-${provider.toLowerCase()}`,
			checked,
			disabled,
			onCheckedChange: (v) => onCheckedChange(v === true),
			className: "data-[state=checked]:bg-[var(--provider-accent)] data-[state=checked]:border-[var(--provider-accent)] data-[state=checked]:text-[var(--provider-accent-foreground)]",
			"aria-label": `${provider} access`,
			title: disabled && disabledReason ? disabledReason : void 0
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--provider-accent)]",
			children: provider
		})]
	});
}
function UserRow({ principal, providers, index, manageableProviders, canManage }) {
	const assign = useAssignProviderAccess();
	const remove = useRemoveProviderAccess();
	const assigned = new Set(providers);
	const busy = assign.isPending || remove.isPending;
	const handleToggle = (provider, checked) => {
		if (checked) assign.mutate({
			principal,
			providers: [...assigned, provider]
		}, {
			onSuccess: () => ue.success(`${provider} access granted`),
			onError: () => ue.error(`Failed to grant ${provider} access`)
		});
		else remove.mutate({
			principal,
			provider
		}, {
			onSuccess: () => ue.success(`${provider} access revoked`),
			onError: () => ue.error(`Failed to revoke ${provider} access`)
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		"data-ocid": `provider_access.row.${index}`,
		className: "border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 14 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-foreground truncate",
							children: shortPrincipal(principal)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] text-muted-foreground truncate",
							children: principal
						})]
					})]
				})
			}),
			PROVIDERS.map(({ provider, accentClass }) => {
				const providerManageable = canManage && manageableProviders.has(provider);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-4 py-3 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderToggle, {
						provider,
						accentClass,
						checked: assigned.has(provider),
						disabled: busy || !providerManageable,
						disabledReason: !canManage ? "Sign in to manage provider access" : `You are not assigned to ${provider}, so you cannot change its access`,
						onCheckedChange: (checked) => handleToggle(provider, checked)
					})
				}, provider);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground",
					children: providers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { size: 12 }), "No access"] }) : `${providers.length} provider${providers.length > 1 ? "s" : ""}`
				})
			})
		]
	});
}
function MyAccessPanel({ principal, assignedProviders, isLoading }) {
	const assigned = new Set(assignedProviders);
	const denied = ALL_PROVIDERS.filter((p) => !assigned.has(p));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "provider_access.my_access_panel",
		className: "rounded-xl border border-border bg-card overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-4 border-b border-border flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
					size: 16,
					className: "text-primary shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-sm font-semibold text-foreground",
					children: "Your Access"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground mt-0.5",
					children: "Your tenant identity and the cloud providers you are assigned to."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 p-5 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Your Customer"
					}), principal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-2.5 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 15 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-foreground truncate",
								children: shortPrincipal(principal)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] text-muted-foreground truncate",
								children: principal
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-ocid": "provider_access.signed_out_state",
						className: "mt-2 flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
							size: 14,
							className: "shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px]",
							children: "Sign in to view your customer identity"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Providers You Can Access"
					}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-2 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 13,
							className: "animate-spin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px]",
							children: "Loading…"
						})]
					}) : assignedProviders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "provider_access.my_access_empty",
						className: "mt-2 font-mono text-[11px] text-muted-foreground",
						children: "No providers assigned to your account."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1.5",
						children: PROVIDERS.filter(({ provider }) => assigned.has(provider)).map(({ provider, accentClass }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderChip, {
							provider,
							accentClass,
							granted: true
						}, provider))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Providers You Cannot Access"
					}),
					denied.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						"data-ocid": "provider_access.denied_empty",
						className: "mt-2 font-mono text-[11px] text-muted-foreground",
						children: "You have access to every provider."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1.5",
						children: PROVIDERS.filter(({ provider }) => denied.includes(provider)).map(({ provider, accentClass }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderChip, {
							provider,
							accentClass,
							granted: false
						}, provider))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[11px] text-muted-foreground",
						children: "Data and actions for these providers are hidden across the app until an administrator assigns them to you."
					})
				]
			})
		]
	});
}
function ProviderAccessPage() {
	const { identity } = useInternetIdentity();
	const { data: assignments, isLoading, isError, refetch } = useListUserAssignments();
	const { data: myProviders = [], isLoading: loadingMyProviders } = useGetMyProviders();
	const principal = import_react.useMemo(() => {
		if (!identity) return null;
		try {
			return identity.getPrincipal().toText();
		} catch {
			return null;
		}
	}, [identity]);
	const manageableProviders = import_react.useMemo(() => new Set(myProviders), [myProviders]);
	const canManage = manageableProviders.size > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ocid": "provider_access.page",
		className: "space-y-6 max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold text-foreground tracking-tight",
				children: "Provider Access"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm mt-1",
				children: "Assign each user to one or more cloud providers. Users can only view and act on the providers they are assigned to."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyAccessPanel, {
				principal,
				assignedProviders: myProviders,
				isLoading: loadingMyProviders
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 border-b border-border flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-sm font-semibold text-foreground",
						children: "User Assignments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground mt-0.5",
						children: "Toggle provider access for each user. Changes apply immediately."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2.5 py-1 font-mono text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							size: 12,
							className: "text-primary"
						}), isLoading ? "…" : `${assignments?.length ?? 0} users`]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "provider_access.loading_state",
					className: "flex items-center justify-center gap-2 py-16 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						size: 16,
						className: "animate-spin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs",
						children: "Loading assignments…"
					})]
				}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "provider_access.error_state",
					className: "flex flex-col items-center justify-center gap-3 py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-destructive",
						children: "Failed to load user assignments."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						"data-ocid": "provider_access.retry_button",
						onClick: () => refetch(),
						children: "Retry"
					})]
				}) : assignments && assignments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-ocid": "provider_access.empty_state",
					className: "flex flex-col items-center justify-center gap-2 py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							size: 28,
							className: "text-muted-foreground/50"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm font-semibold text-foreground",
							children: "No users yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground max-w-sm",
							children: "User assignments will appear here once users are registered with the platform."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border bg-muted/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Principal"
								}),
								PROVIDERS.map(({ provider, accentClass }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: `${accentClass} px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--provider-accent)]`,
									children: provider
								}, provider)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Access"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: assignments?.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRow, {
							principal: a.principal,
							providers: a.providers,
							index: i,
							manageableProviders,
							canManage
						}, a.principal)) })]
					})
				})]
			})
		]
	}) });
}
export { ProviderAccessPage as default };
