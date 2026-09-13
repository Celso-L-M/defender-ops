import { j as jsxRuntimeExports } from "./index-CmSiIXAi.js";
import { S as Server, a as Shield } from "./shield-tKdJ0jHt.js";
import { c as createLucideIcon } from "./use-backend-qlJEk42r.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
];
const Cloud = createLucideIcon("cloud", __iconNode);
const iconMap = {
  AWS: Shield,
  Azure: Cloud,
  GCP: Server
};
const colorMap = {
  AWS: "text-amber-400",
  Azure: "text-blue-400",
  GCP: "text-green-400"
};
function ProviderIcon({
  provider,
  className = "",
  showLabel = true
}) {
  const Icon = iconMap[provider];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, className: colorMap[provider] }),
    showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold tracking-wide", children: provider })
  ] });
}
export {
  Cloud as C,
  ProviderIcon as P
};
