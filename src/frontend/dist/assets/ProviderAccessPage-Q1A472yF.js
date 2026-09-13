import { j as jsxRuntimeExports } from "./index-CmSiIXAi.js";
import { B as Button } from "./button-DxXmQYy1.js";
import { C as Checkbox } from "./checkbox-BaGVZDEY.js";
import { u as ue } from "./index-nahJUUdu.js";
import { L as Layout } from "./Layout-DSnUumzH.js";
import { O as useListUserAssignments, P as useAssignProviderAccess, Q as useRemoveProviderAccess } from "./use-backend-qlJEk42r.js";
import { S as ShieldCheck } from "./shield-check-sUyafmt6.js";
import { L as LoaderCircle } from "./loader-circle-CrazMaUV.js";
import { U as UserX } from "./user-x-DcsgGTz_.js";
import "./utils-BQL5tKpt.js";
import "./index-CziiyC1b.js";
import "./index-BqELoqVO.js";
import "./index-AUpSpOMS.js";
import "./shield-tKdJ0jHt.js";
import "./search-DMLdUJq7.js";
const PROVIDERS = [
  { provider: "AWS", accentClass: "provider-aws" },
  { provider: "Azure", accentClass: "provider-azure" },
  { provider: "GCP", accentClass: "provider-gcp" }
];
function shortPrincipal(principal) {
  if (principal.length <= 20) return principal;
  return `${principal.slice(0, 10)}…${principal.slice(-8)}`;
}
function ProviderToggle({
  provider,
  accentClass,
  checked,
  disabled,
  onCheckedChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `${accentClass} flex items-center justify-center gap-2`,
      "data-ocid": `provider_access.toggle.${provider.toLowerCase()}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            id: `provider-${provider.toLowerCase()}`,
            checked,
            disabled,
            onCheckedChange: (v) => onCheckedChange(v === true),
            className: "data-[state=checked]:bg-[var(--provider-accent)] data-[state=checked]:border-[var(--provider-accent)] data-[state=checked]:text-[var(--provider-accent-foreground)]",
            "aria-label": `${provider} access`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--provider-accent)]", children: provider })
      ]
    }
  );
}
function UserRow({
  principal,
  providers,
  index
}) {
  const assign = useAssignProviderAccess();
  const remove = useRemoveProviderAccess();
  const assigned = new Set(providers);
  const busy = assign.isPending || remove.isPending;
  const handleToggle = (provider, checked) => {
    if (checked) {
      assign.mutate(
        { principal, providers: [...assigned, provider] },
        {
          onSuccess: () => ue.success(`${provider} access granted`),
          onError: () => ue.error(`Failed to grant ${provider} access`)
        }
      );
    } else {
      remove.mutate(
        { principal, provider },
        {
          onSuccess: () => ue.success(`${provider} access revoked`),
          onError: () => ue.error(`Failed to revoke ${provider} access`)
        }
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      "data-ocid": `provider_access.row.${index}`,
      className: "border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground truncate", children: shortPrincipal(principal) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground truncate", children: principal })
          ] })
        ] }) }),
        PROVIDERS.map(({ provider, accentClass }) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProviderToggle,
          {
            provider,
            accentClass,
            checked: assigned.has(provider),
            disabled: busy,
            onCheckedChange: (checked) => handleToggle(provider, checked)
          }
        ) }, provider)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground", children: providers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { size: 12 }),
          "No access"
        ] }) : `${providers.length} provider${providers.length > 1 ? "s" : ""}` }) })
      ]
    }
  );
}
function ProviderAccessPage() {
  const {
    data: assignments,
    isLoading,
    isError,
    refetch
  } = useListUserAssignments();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "provider_access.page",
      className: "space-y-6 max-w-5xl mx-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: "Provider Access" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Assign each user to one or more cloud providers. Users can only view and act on the providers they are assigned to." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "User Assignments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Toggle provider access for each user. Changes apply immediately." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2.5 py-1 font-mono text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 12, className: "text-primary" }),
              isLoading ? "…" : `${(assignments == null ? void 0 : assignments.length) ?? 0} users`
            ] })
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "provider_access.loading_state",
              className: "flex items-center justify-center gap-2 py-16 text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: "Loading assignments…" })
              ]
            }
          ) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "provider_access.error_state",
              className: "flex flex-col items-center justify-center gap-3 py-16 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-destructive", children: "Failed to load user assignments." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "provider_access.retry_button",
                    onClick: () => refetch(),
                    children: "Retry"
                  }
                )
              ]
            }
          ) : assignments && assignments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "provider_access.empty_state",
              className: "flex flex-col items-center justify-center gap-2 py-16 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 28, className: "text-muted-foreground/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-foreground", children: "No users yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-sm", children: "User assignments will appear here once users are registered with the platform." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Principal" }),
              PROVIDERS.map(({ provider, accentClass }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: `${accentClass} px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--provider-accent)]`,
                  children: provider
                },
                provider
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Access" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: assignments == null ? void 0 : assignments.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              UserRow,
              {
                principal: a.principal,
                providers: a.providers,
                index: i
              },
              a.principal
            )) })
          ] }) })
        ] })
      ]
    }
  ) });
}
export {
  ProviderAccessPage as default
};
