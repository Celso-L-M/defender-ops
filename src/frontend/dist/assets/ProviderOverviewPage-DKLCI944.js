import { r as reactExports, j as jsxRuntimeExports, d as Link } from "./index-CmSiIXAi.js";
import { L as Layout } from "./Layout-DSnUumzH.js";
import { P as ProviderIcon } from "./ProviderIcon-DuMT2Dc6.js";
import { c as createLucideIcon, H as useGetMyProviders, I as useProviderStates, l as useNormalizedAlerts } from "./use-backend-qlJEk42r.js";
import { S as ShieldCheck } from "./shield-check-sUyafmt6.js";
import { T as TriangleAlert } from "./triangle-alert-DRRWC2_-.js";
import { A as ArrowRight } from "./arrow-right-BpR7Cy42.js";
import "./shield-tKdJ0jHt.js";
import "./search-DMLdUJq7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69", key: "1dl1wf" }],
  ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523", key: "4k23kn" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643", key: "1grhjp" }],
  ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764", key: "z3jwby" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const WifiOff = createLucideIcon("wifi-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
const PROVIDERS = ["AWS", "Azure", "GCP"];
const SEVERITIES = ["Critical", "High", "Medium", "Low"];
const PROVIDER_META = {
  AWS: {
    accentClass: "provider-aws",
    to: "/providers/aws",
    ocid: "overview.provider_aws"
  },
  Azure: {
    accentClass: "provider-azure",
    to: "/providers/azure",
    ocid: "overview.provider_azure"
  },
  GCP: {
    accentClass: "provider-gcp",
    to: "/providers/gcp",
    ocid: "overview.provider_gcp"
  }
};
const SEVERITY_STYLES = {
  Critical: "bg-destructive/20 text-destructive border border-destructive/40",
  High: "bg-chart-5/20 text-chart-5 border border-chart-5/40",
  Medium: "bg-warning/20 text-warning border border-warning/40",
  Low: "bg-primary/20 text-primary border border-primary/40",
  Unknown: "bg-muted/30 text-muted-foreground border border-border"
};
function ProviderCard({
  provider,
  alerts,
  isConnected,
  hasError
}) {
  const meta = PROVIDER_META[provider];
  const activeAlerts = alerts.filter((a) => a.status !== "Resolved");
  const total = activeAlerts.length;
  const severityCounts = SEVERITIES.reduce(
    (acc, sev) => {
      acc[sev] = activeAlerts.filter((a) => a.severity === sev).length;
      return acc;
    },
    { Critical: 0, High: 0, Medium: 0, Low: 0, Unknown: 0 }
  );
  const connectionLabel = isConnected ? "Connected" : hasError ? "Error" : "Disconnected";
  const ConnectionIcon = isConnected ? Wifi : hasError ? TriangleAlert : WifiOff;
  const connectionClass = isConnected ? "badge-status-connected" : hasError ? "badge-status-error" : "badge-status-inactive";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `${meta.ocid}.card`,
      className: `${meta.accentClass} provider-shell flex flex-col p-5 transition-smooth hover:border-opacity-80`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderIcon, { provider, className: "text-base" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 ${connectionClass}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectionIcon, { size: 10 }),
            connectionLabel
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "provider-accent font-display text-4xl font-bold tabular-nums leading-none", children: total }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1.5 font-mono uppercase tracking-widest", children: "Active Alerts" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5 mb-5", children: SEVERITIES.map((sev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center justify-between rounded px-2 py-1 text-xs font-mono ${SEVERITY_STYLES[sev]}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate pr-1", children: sev }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold tabular-nums", children: severityCounts[sev] })
            ]
          },
          sev
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: meta.to,
            "data-ocid": `${meta.ocid}.dashboard_link`,
            className: "mt-auto inline-flex items-center justify-between gap-2 rounded-md border border-border bg-background/40 px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/40 transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open Dashboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14, className: "provider-accent" })
            ]
          }
        )
      ]
    }
  );
}
function ProviderOverviewPage() {
  const { data: myProviders = [], isLoading: loadingProviders } = useGetMyProviders();
  const { data: providerStates = [] } = useProviderStates();
  const assigned = reactExports.useMemo(() => new Set(myProviders), [myProviders]);
  const visibleProviders = PROVIDERS.filter((p) => assigned.has(p));
  const awsAlerts = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: "AWS"
  });
  const azureAlerts = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: "Azure"
  });
  const gcpAlerts = useNormalizedAlerts({
    customer: "",
    limit: 500,
    provider: "GCP"
  });
  const alertsByProvider = {
    AWS: awsAlerts.data ?? [],
    Azure: azureAlerts.data ?? [],
    GCP: gcpAlerts.data ?? []
  };
  const loadingAlerts = awsAlerts.isLoading || azureAlerts.isLoading || gcpAlerts.isLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "overview.page", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: "Provider Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Select a cloud provider to open its isolated security dashboard. You only see providers you are assigned to." })
    ] }),
    loadingProviders || loadingAlerts ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "overview.loading_state",
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        children: Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "provider-shell h-64 animate-pulse bg-muted/20"
          },
          id
        ))
      }
    ) : visibleProviders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "overview.empty_state",
        className: "provider-shell flex flex-col items-center justify-center gap-3 p-10 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 32, className: "text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "No providers assigned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm", children: "You are not currently assigned to any cloud provider. Contact an administrator to grant you access to AWS, Azure, or GCP." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "overview.provider_grid",
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        children: visibleProviders.map((provider) => {
          const state = providerStates.find((s) => s.provider === provider);
          const isConnected = (state == null ? void 0 : state.status) === "Active";
          const hasError = (state == null ? void 0 : state.status) === "Error" || (state == null ? void 0 : state.status) === "AuthPaused";
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProviderCard,
            {
              provider,
              alerts: alertsByProvider[provider],
              isConnected,
              hasError
            },
            provider
          );
        })
      }
    )
  ] }) });
}
export {
  ProviderOverviewPage as default
};
