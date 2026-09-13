import { r as reactExports, j as jsxRuntimeExports, L as LoadingSpinner } from "./index-UYuukFCx.js";
import { u as useProviderFilter, L as Layout, S as ShieldAlert } from "./Layout-BvE-Qw_4.js";
import { P as useGetMyProviders, s as useNormalizedAlerts, p as useAssets, m as useComplianceStatus, Q as useBlockIp, R as useIsolateResource, T as useDisableAzureAdAccount } from "./use-backend-BAJo2v8R.js";
import { u as ue } from "./index-YNBEh2fO.js";
import { S as SquareCheckBig, a as SecurityEventFeed, C as CorrelatedIncidentsPanel } from "./SecurityEventFeed-B54ASwUz.js";
import { S as SeverityBadge } from "./SeverityBadge-4N8MxJeJ.js";
import { S as StatusBadge } from "./StatusBadge-Q4VJwU4u.js";
import { C as Cloud } from "./ProviderIcon-B7LnSr-K.js";
import { S as Server, a as Shield } from "./shield-BzxXQzBz.js";
import { T as TriangleAlert } from "./triangle-alert-C1ijdifN.js";
import { U as UserX } from "./user-x-BHoPG2NP.js";
import { L as LoaderCircle } from "./loader-circle-BMuv87qJ.js";
import "./shield-check-BrQcTxD_.js";
import "./search-Scg-sHEq.js";
import "./badge-C9lUe8TC.js";
import "./utils-CH5NUVML.js";
import "./skeleton-BAUrlSlH.js";
import "./clock-CyFNsxAA.js";
import "./x-BGu0unbn.js";
const AZURE = "Azure";
function computeWeight(severity) {
  switch (severity) {
    case "Critical":
      return 4;
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
    default:
      return 0;
  }
}
function getRiskZone(score) {
  if (score <= 30) return { label: "Low Risk", color: "#22c55e" };
  if (score <= 60) return { label: "Moderate", color: "#eab308" };
  if (score <= 85) return { label: "High", color: "#f97316" };
  return { label: "Critical", color: "#ef4444" };
}
function StatCard({
  label,
  value,
  isLoading,
  color,
  icon,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": ocid,
      className: "provider-shell provider-tint rounded-lg p-4 flex items-center gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `shrink-0 ${color}`, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate", children: label }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-5 w-16 rounded bg-muted/30 animate-pulse" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-display text-xl font-bold ${color} tabular-nums`, children: value })
        ] })
      ]
    }
  );
}
function AzureRiskScore() {
  const { data: alerts = [], isLoading } = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: AZURE
  });
  const totalWeighted = alerts.reduce(
    (sum, a) => sum + computeWeight(a.severity),
    0
  );
  const maxPossible = alerts.length * 4;
  const rawScore = maxPossible > 0 ? totalWeighted / maxPossible * 100 : 0;
  const score = Math.min(100, Math.round(rawScore));
  const { label, color } = getRiskZone(score);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "azure_dashboard.risk_score.card",
      className: "provider-shell provider-tint rounded-lg p-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground mb-4 tracking-wide", children: "Azure Risk Score" }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: 28 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center rounded-full border-4",
              style: {
                width: 120,
                height: 120,
                borderColor: color,
                boxShadow: score >= 86 ? `0 0 16px ${color}80` : void 0
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-display text-3xl font-bold tabular-nums",
                  style: { color },
                  children: score
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-sm font-bold tracking-wide",
              style: { color, fontFamily: "'Space Grotesk', sans-serif" },
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: alerts.length === 0 ? "No active Azure alerts" : `${alerts.length} active Azure alert${alerts.length !== 1 ? "s" : ""}` })
        ] })
      ]
    }
  );
}
function showPlaybookToast(result, label) {
  if (result.success) {
    ue.success(result.dryRunPreview ? `[Dry Run] ${label}` : label, {
      description: result.message,
      duration: 5e3
    });
  } else {
    ue.error(`${label} failed`, {
      description: "The action could not be completed. Check the audit log for details.",
      duration: 6e3
    });
  }
}
function AzureActionModal({
  title,
  icon,
  accentClass,
  onClose,
  children
}) {
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  const Icon = icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { backgroundColor: "rgba(0,0,0,0.75)" },
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "provider-shell provider-azure relative w-full max-w-md rounded-xl border p-0 shadow-2xl text-left",
          style: { backgroundColor: "#1a1d27" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#2a2d3e]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: accentClass, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-white font-display", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "data-ocid": "azure_quick_action.close_button",
                  "aria-label": "Close dialog",
                  className: "ml-auto opacity-50 hover:opacity-100 transition-opacity text-white",
                  children: "X"
                }
              )
            ] }),
            children
          ]
        }
      )
    }
  );
}
function BlockIpAzureModal({ onClose }) {
  const [ip, setIp] = reactExports.useState("");
  const [dryRun, setDryRun] = reactExports.useState(false);
  const mutation = useBlockIp();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const req = {
      ip: ip.trim(),
      providers: [AZURE],
      dryRun,
      customer: "default"
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Block IP ${ip.trim()} on Azure`);
      if (!dryRun) onClose();
    } catch {
      ue.error("Block IP failed", {
        description: "The action could not be completed. Check the audit log."
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AzureActionModal,
    {
      title: "Block IP (Azure)",
      icon: Shield,
      accentClass: "text-blue-400",
      onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "px-6 pt-4 pb-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Add the IP to Azure network security group deny rules. Takes immediate effect on Azure resources only." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "IP Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: ip,
              onChange: (e) => setIp(e.target.value),
              placeholder: "e.g. 185.234.219.10",
              "data-ocid": "azure_quick_action.ip_input",
              className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500",
              style: {
                backgroundColor: "#0f1117",
                border: "1px solid #2a2d3e",
                color: "white"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: dryRun,
              onChange: (e) => setDryRun(e.target.checked),
              "data-ocid": "azure_quick_action.dryrun_toggle",
              className: "accent-blue-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Dry Run (preview only)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "data-ocid": "azure_quick_action.cancel_button",
              className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
              style: { borderColor: "#2a2d3e", color: "#94a3b8" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: !ip.trim() || mutation.isPending,
              "data-ocid": "azure_quick_action.confirm_button",
              className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 border border-blue-400/40 hover:bg-blue-400/10 flex items-center justify-center gap-1.5",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                " Executing"
              ] }) : "Execute"
            }
          )
        ] })
      ] })
    }
  );
}
function IsolateAzureModal({ onClose }) {
  const [resourceId, setResourceId] = reactExports.useState("");
  const [dryRun, setDryRun] = reactExports.useState(false);
  const mutation = useIsolateResource();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const req = {
      resourceId: resourceId.trim(),
      provider: AZURE,
      dryRun,
      customer: "default"
    };
    try {
      const result = await mutation.mutateAsync(req);
      showPlaybookToast(result, `Isolate ${resourceId.trim()} on Azure`);
      if (!dryRun) onClose();
    } catch {
      ue.error("Isolate Resource failed", {
        description: "The action could not be completed. Check the audit log."
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AzureActionModal,
    {
      title: "Isolate Azure Resource",
      icon: Server,
      accentClass: "text-orange-400",
      onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "px-6 pt-4 pb-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Quarantine the Azure resource from all network access until reviewed." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Resource ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: resourceId,
              onChange: (e) => setResourceId(e.target.value),
              placeholder: "e.g. /subscriptions/.../resourceGroups/.../providers/Microsoft.Compute/virtualMachines/vm-prod-01",
              "data-ocid": "azure_quick_action.resource_input",
              className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500",
              style: {
                backgroundColor: "#0f1117",
                border: "1px solid #2a2d3e",
                color: "white"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: dryRun,
              onChange: (e) => setDryRun(e.target.checked),
              "data-ocid": "azure_quick_action.dryrun_toggle",
              className: "accent-blue-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Dry Run (preview only)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "data-ocid": "azure_quick_action.cancel_button",
              className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
              style: { borderColor: "#2a2d3e", color: "#94a3b8" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: !resourceId.trim() || mutation.isPending,
              "data-ocid": "azure_quick_action.confirm_button",
              className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-orange-400 border border-orange-400/40 hover:bg-orange-400/10 flex items-center justify-center gap-1.5",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                " Executing"
              ] }) : "Execute"
            }
          )
        ] })
      ] })
    }
  );
}
function DisableAzureAdModal({ onClose }) {
  const [upn, setUpn] = reactExports.useState("");
  const [dryRun, setDryRun] = reactExports.useState(false);
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
      if (!dryRun) onClose();
    } catch {
      ue.error("Disable Azure AD failed", {
        description: "The action could not be completed. Check the audit log."
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AzureActionModal,
    {
      title: "Disable Azure AD Account",
      icon: UserX,
      accentClass: "text-blue-400",
      onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "px-6 pt-4 pb-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Disable the Azure AD account immediately. The user will be signed out of all sessions." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "User Principal Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              value: upn,
              onChange: (e) => setUpn(e.target.value),
              placeholder: "user@company.onmicrosoft.com",
              "data-ocid": "azure_quick_action.upn_input",
              className: "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500",
              style: {
                backgroundColor: "#0f1117",
                border: "1px solid #2a2d3e",
                color: "white"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: dryRun,
              onChange: (e) => setDryRun(e.target.checked),
              "data-ocid": "azure_quick_action.dryrun_toggle",
              className: "accent-blue-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Dry Run (preview only)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "data-ocid": "azure_quick_action.cancel_button",
              className: "flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5",
              style: { borderColor: "#2a2d3e", color: "#94a3b8" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: !upn.trim() || mutation.isPending,
              "data-ocid": "azure_quick_action.confirm_button",
              className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 border border-blue-400/40 hover:bg-blue-400/10 flex items-center justify-center gap-1.5",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                " Executing"
              ] }) : "Execute"
            }
          )
        ] })
      ] })
    }
  );
}
const AZURE_ACTIONS = [
  {
    id: "blockIp",
    label: "Block IP",
    icon: Shield,
    accent: "text-red-400",
    hoverBorder: "hover:border-red-400"
  },
  {
    id: "isolate",
    label: "Isolate Resource",
    icon: Server,
    accent: "text-orange-400",
    hoverBorder: "hover:border-orange-400"
  },
  {
    id: "disableAD",
    label: "Disable Azure AD Account",
    icon: UserX,
    accent: "text-blue-400",
    hoverBorder: "hover:border-blue-400"
  }
];
function AzureQuickActions() {
  const [active, setActive] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "azure_dashboard.quick_actions.panel",
        className: "provider-shell provider-tint rounded-lg p-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground mb-3 tracking-wide", children: "Azure Quick Actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Remediation actions scoped to Azure resources only." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap", children: AZURE_ACTIONS.map((action) => {
            const Icon = action.icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActive(action.id),
                "data-ocid": `azure_quick_action.${action.id}_button`,
                className: `flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-all ${action.accent} ${action.hoverBorder} hover:bg-white/5 active:scale-95`,
                style: { backgroundColor: "#1a1d27", borderColor: "#2a2d3e" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, "aria-hidden": "true" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: action.label })
                ]
              },
              action.id
            );
          }) })
        ]
      }
    ),
    active === "blockIp" && /* @__PURE__ */ jsxRuntimeExports.jsx(BlockIpAzureModal, { onClose: () => setActive(null) }),
    active === "isolate" && /* @__PURE__ */ jsxRuntimeExports.jsx(IsolateAzureModal, { onClose: () => setActive(null) }),
    active === "disableAD" && /* @__PURE__ */ jsxRuntimeExports.jsx(DisableAzureAdModal, { onClose: () => setActive(null) })
  ] });
}
function AzureDashboardPage() {
  const { setSelectedProvider } = useProviderFilter();
  const { data: myProviders = [], isLoading: loadingProviders } = useGetMyProviders();
  reactExports.useEffect(() => {
    setSelectedProvider(AZURE);
    return () => setSelectedProvider(null);
  }, [setSelectedProvider]);
  const isAssigned = myProviders.includes(AZURE);
  const { data: alerts = [], isLoading: loadingAlerts } = useNormalizedAlerts({
    customer: "",
    limit: 1e3,
    provider: AZURE,
    status: "Open"
  });
  const { data: assets = [], isLoading: loadingAssets } = useAssets("", 1e3);
  const { data: complianceData, isLoading: loadingCompliance } = useComplianceStatus("CISAzure", AZURE);
  const azureAssets = reactExports.useMemo(
    () => assets.filter((a) => a.provider === AZURE),
    [assets]
  );
  const assetsAtRisk = reactExports.useMemo(
    () => azureAssets.filter((a) => Number(a.riskScore ?? 0) > 0).length,
    [azureAssets]
  );
  const complianceScore = reactExports.useMemo(
    () => complianceData ? Number(complianceData.score ?? 0n) : 0,
    [complianceData]
  );
  if (loadingProviders) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "azure.loading_state",
        className: "provider-azure flex min-h-[60vh] items-center justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: 32 })
      }
    ) });
  }
  if (!isAssigned) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "azure.access_denied",
        className: "provider-azure flex min-h-[60vh] items-center justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "provider-shell provider-tint flex max-w-md flex-col items-center gap-3 p-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 32, className: "provider-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-semibold text-foreground", children: "Azure access not assigned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You are not assigned to the Azure provider. Contact an administrator to request access. Azure data and remediation actions are blocked." })
        ] })
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "azure_dashboard.page",
      className: "provider-azure min-h-screen space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "azure_dashboard.header",
            className: "provider-shell provider-tint rounded-lg px-6 py-5",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-lg provider-accent-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 20, className: "text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Azure Dashboard" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-provider", children: "Azure" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Azure Security Center posture — alerts, assets, compliance, and risk scoped to Azure only." })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "azure_dashboard.stats_bar",
            className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Azure Active Alerts",
                  value: alerts.length,
                  isLoading: loadingAlerts,
                  color: "text-destructive",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 16 }),
                  ocid: "azure_dashboard.stat.active_alerts"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Azure Assets",
                  value: azureAssets.length,
                  isLoading: loadingAssets,
                  color: "text-blue-400",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 16 }),
                  ocid: "azure_dashboard.stat.assets"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Azure Assets at Risk",
                  value: assetsAtRisk,
                  isLoading: loadingAssets,
                  color: "text-yellow-400",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16 }),
                  ocid: "azure_dashboard.stat.assets_at_risk"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Azure Compliance (CIS)",
                  value: `${complianceScore}%`,
                  isLoading: loadingCompliance,
                  color: "text-green-400",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { size: 16 }),
                  ocid: "azure_dashboard.stat.compliance"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "azure_dashboard.risk_score.section",
              className: "lg:col-span-1",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(AzureRiskScore, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "azure_dashboard.event_feed.section",
              className: "lg:col-span-2",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityEventFeed, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "azure_dashboard.incidents.section",
              className: "lg:col-span-2",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CorrelatedIncidentsPanel, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "azure_dashboard.connection.section",
              className: "lg:col-span-1 provider-shell provider-tint rounded-lg p-5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground mb-3 tracking-wide", children: "Azure Connection" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: "connected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Azure Security Center" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Severity mix" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground", children: [
                      alerts.length,
                      " open"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ["Critical", "High", "Medium", "Low"].map((sev) => {
                    const count = alerts.filter((a) => a.severity === sev).length;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: sev }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: count })
                    ] }, sev);
                  }) })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AzureQuickActions, {})
      ]
    }
  ) });
}
export {
  AzureDashboardPage as default
};
