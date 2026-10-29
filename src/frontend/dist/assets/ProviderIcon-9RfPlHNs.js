import { s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
import { ut as createLucideIcon } from "./use-backend-C00QWIg7.js";
import { n as Server, t as Shield } from "./shield-CbiefNtr.js";
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Cloud = createLucideIcon("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]);
// src/components/ProviderIcon.tsx
var import_jsx_runtime = require_jsx_runtime();
var iconMap = {
	AWS: Shield,
	Azure: Cloud,
	GCP: Server
};
var colorMap = {
	AWS: "text-amber-400",
	Azure: "text-blue-400",
	GCP: "text-green-400"
};
function ProviderIcon({ provider, className = "", showLabel = true }) {
	const Icon = iconMap[provider];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			size: 14,
			className: colorMap[provider]
		}), showLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-xs font-semibold tracking-wide",
			children: provider
		})]
	});
}
export { Cloud as n, ProviderIcon as t };
