import type { ConnectionStatus } from "../types";

interface Props {
  status: ConnectionStatus;
}

const labelMap: Record<ConnectionStatus, string> = {
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
  inactive: "Inactive",
};

export function StatusBadge({ status }: Props) {
  const cls =
    status === "connected"
      ? "badge-status-connected"
      : status === "error"
        ? "badge-status-error"
        : status === "disconnected"
          ? "badge-status-warning"
          : "badge-status-inactive";
  return <span className={cls}>{labelMap[status]}</span>;
}
