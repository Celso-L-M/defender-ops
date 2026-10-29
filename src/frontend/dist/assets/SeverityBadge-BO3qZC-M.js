import { s as require_jsx_runtime } from "./dist-B87Aq9lc.js";
// src/components/SeverityBadge.tsx
var import_jsx_runtime = require_jsx_runtime();
var styleMap = {
	Critical: "bg-destructive/20 border border-destructive text-destructive",
	High: "bg-chart-5/20 border border-chart-5 text-chart-5",
	Medium: "bg-warning/20 border border-warning text-warning",
	Low: "bg-primary/20 border border-primary text-primary",
	Unknown: "bg-muted/30 border border-border text-muted-foreground"
};
function SeverityBadge({ severity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${styleMap[severity]}`,
		children: severity
	});
}
export { SeverityBadge as t };
