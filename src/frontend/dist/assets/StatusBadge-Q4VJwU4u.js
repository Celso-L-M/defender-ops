import { j as jsxRuntimeExports } from "./index-UYuukFCx.js";
const labelMap = {
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
  inactive: "Inactive"
};
function StatusBadge({ status }) {
  const cls = status === "connected" ? "badge-status-connected" : status === "error" ? "badge-status-error" : status === "disconnected" ? "badge-status-warning" : "badge-status-inactive";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, children: labelMap[status] });
}
export {
  StatusBadge as S
};
