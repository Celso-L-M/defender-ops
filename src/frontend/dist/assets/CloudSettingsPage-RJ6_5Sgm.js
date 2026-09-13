import { j as jsxRuntimeExports, r as reactExports, R as React } from "./index-CmSiIXAi.js";
import { B as Button } from "./button-DxXmQYy1.js";
import { I as Input } from "./input-COH4aQv5.js";
import { L as Label } from "./label-CsaknDBr.js";
import { u as ue } from "./index-nahJUUdu.js";
import { L as Layout } from "./Layout-DSnUumzH.js";
import { c as createLucideIcon, u as useGetEnrichmentKeys, a as useSaveEnrichmentKeys, b as useGetWebhookSecretStatus, d as useSaveWebhookSecret } from "./use-backend-qlJEk42r.js";
import { L as LoaderCircle } from "./loader-circle-CrazMaUV.js";
import { E as EyeOff } from "./eye-off-CCxrdn7b.js";
import { E as Eye } from "./eye-0jIgAMYJ.js";
import "./utils-BQL5tKpt.js";
import "./shield-tKdJ0jHt.js";
import "./shield-check-sUyafmt6.js";
import "./search-DMLdUJq7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      key: "1jlk70"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      key: "18rp1v"
    }
  ]
];
const ShieldOff = createLucideIcon("shield-off", __iconNode);
function PasswordInput({
  id,
  placeholder,
  ...rest
}) {
  const [show, setShow] = React.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        id,
        type: show ? "text" : "password",
        placeholder,
        className: "font-mono pr-9",
        ...rest
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "aria-label": show ? "Hide" : "Show",
        onClick: () => setShow((s) => !s),
        className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
        children: show ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 })
      }
    )
  ] });
}
function ThreatIntelSection() {
  const { data: keyStatus, isLoading: keysLoading } = useGetEnrichmentKeys();
  const saveKeys = useSaveEnrichmentKeys();
  const [abuseKey, setAbuseKey] = reactExports.useState("");
  const [vtKey, setVtKey] = reactExports.useState("");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "data-ocid": "settings.threat_intel.section",
      className: "rounded-xl border border-border bg-card overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "Threat Intelligence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "API keys for AbuseIPDB and VirusTotal enrichment. Keys are stored securely and never returned to the frontend." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-6 pt-4 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "abuse-ipdb-key",
                  className: "text-xs text-muted-foreground uppercase tracking-wider",
                  children: "AbuseIPDB API Key"
                }
              ),
              keysLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                LoaderCircle,
                {
                  size: 11,
                  className: "animate-spin text-muted-foreground"
                }
              ) : (keyStatus == null ? void 0 : keyStatus.abuseIpdbKeySet) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }),
                "Key configured"
              ] }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PasswordInput,
              {
                id: "abuse-ipdb-key",
                placeholder: "Enter AbuseIPDB API key",
                value: abuseKey,
                onChange: (e) => setAbuseKey(e.target.value),
                "data-ocid": "settings.threat_intel.abuseipdb_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "virus-total-key",
                  className: "text-xs text-muted-foreground uppercase tracking-wider",
                  children: "VirusTotal API Key"
                }
              ),
              keysLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                LoaderCircle,
                {
                  size: 11,
                  className: "animate-spin text-muted-foreground"
                }
              ) : (keyStatus == null ? void 0 : keyStatus.virusTotalKeySet) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }),
                "Key configured"
              ] }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PasswordInput,
              {
                id: "virus-total-key",
                placeholder: "Enter VirusTotal API key",
                value: vtKey,
                onChange: (e) => setVtKey(e.target.value),
                "data-ocid": "settings.threat_intel.virustotal_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              "data-ocid": "settings.threat_intel.save_button",
              disabled: saveKeys.isPending || !abuseKey.trim() && !vtKey.trim(),
              onClick: handleSave,
              className: "min-w-[140px]",
              children: [
                saveKeys.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin mr-1.5" }),
                "Save API Keys"
              ]
            }
          )
        ] })
      ]
    }
  );
}
const WEBHOOK_PROVIDERS = [
  { provider: "AWS", label: "AWS" },
  { provider: "Azure", label: "Azure" },
  { provider: "GCP", label: "GCP" }
];
function WebhookSecretSection() {
  const { data: status, isLoading: statusLoading } = useGetWebhookSecretStatus();
  const saveSecret = useSaveWebhookSecret();
  const [secrets, setSecrets] = reactExports.useState({
    AWS: "",
    Azure: "",
    GCP: ""
  });
  const isConfigured = (p) => p === "AWS" ? status == null ? void 0 : status.awsSet : p === "Azure" ? status == null ? void 0 : status.azureSet : status == null ? void 0 : status.gcpSet;
  const handleSave = async (provider) => {
    const secret = secrets[provider].trim();
    if (!secret) return;
    try {
      await saveSecret.mutateAsync({ provider, secret });
      ue.success(`${provider} webhook secret saved`);
      setSecrets((prev) => ({ ...prev, [provider]: "" }));
    } catch {
      ue.error(`Failed to save ${provider} webhook secret`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "data-ocid": "settings.webhook_secrets.section",
      className: "rounded-xl border border-border bg-card overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "Webhook Signature Secrets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Per-provider secrets used to verify incoming webhook signatures. Secrets are stored securely and never returned to the frontend." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-6 pt-4 space-y-5", children: WEBHOOK_PROVIDERS.map(({ provider, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: `webhook-secret-${provider.toLowerCase()}`,
                className: "text-xs text-muted-foreground uppercase tracking-wider",
                children: [
                  label,
                  " Webhook Secret"
                ]
              }
            ),
            statusLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              LoaderCircle,
              {
                size: 11,
                className: "animate-spin text-muted-foreground"
              }
            ) : isConfigured(provider) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }),
              "Secret configured"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { size: 11 }),
              "Not configured"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              PasswordInput,
              {
                id: `webhook-secret-${provider.toLowerCase()}`,
                placeholder: `Enter ${label} webhook secret`,
                value: secrets[provider],
                onChange: (e) => setSecrets((prev) => ({
                  ...prev,
                  [provider]: e.target.value
                })),
                "data-ocid": `settings.webhook_secrets.${provider.toLowerCase()}_input`
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                "data-ocid": `settings.webhook_secrets.${provider.toLowerCase()}_save_button`,
                disabled: saveSecret.isPending || !secrets[provider].trim(),
                onClick: () => handleSave(provider),
                className: "min-w-[120px]",
                children: [
                  saveSecret.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin mr-1.5" }),
                  "Save Secret"
                ]
              }
            )
          ] })
        ] }, provider)) })
      ]
    }
  );
}
function CloudSettingsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "settings.page", className: "space-y-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: "Cloud Provider Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Threat intelligence and webhook security configuration" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThreatIntelSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WebhookSecretSection, {})
    ] })
  ] }) });
}
export {
  CloudSettingsPage as default
};
