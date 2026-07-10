import type { Severity } from "../types";

interface Props {
  severity: Severity;
}

const styleMap: Record<Severity, string> = {
  Critical: "bg-destructive/20 border border-destructive text-destructive",
  High: "bg-chart-5/20 border border-chart-5 text-chart-5",
  Medium: "bg-warning/20 border border-warning text-warning",
  Low: "bg-primary/20 border border-primary text-primary",
  Unknown: "bg-muted/30 border border-border text-muted-foreground",
};

export function SeverityBadge({ severity }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${styleMap[severity]}`}
    >
      {severity}
    </span>
  );
}
