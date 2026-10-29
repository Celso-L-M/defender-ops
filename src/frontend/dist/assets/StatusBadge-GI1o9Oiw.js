import { s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
// src/components/StatusBadge.tsx
var import_jsx_runtime = require_jsx_runtime();
var labelMap = {
	connected: "Connected",
	disconnected: "Disconnected",
	error: "Error",
	inactive: "Inactive"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: status === "connected" ? "badge-status-connected" : status === "error" ? "badge-status-error" : status === "disconnected" ? "badge-status-warning" : "badge-status-inactive",
		children: labelMap[status]
	});
}
export { StatusBadge as t };
