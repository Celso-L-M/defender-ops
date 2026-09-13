import { j as jsxRuntimeExports } from "./index-CmSiIXAi.js";
const styleMap = {
  Critical: "bg-destructive/20 border border-destructive text-destructive",
  High: "bg-chart-5/20 border border-chart-5 text-chart-5",
  Medium: "bg-warning/20 border border-warning text-warning",
  Low: "bg-primary/20 border border-primary text-primary",
  Unknown: "bg-muted/30 border border-border text-muted-foreground"
};
function SeverityBadge({ severity }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${styleMap[severity]}`,
      children: severity
    }
  );
}
export {
  SeverityBadge as S
};
