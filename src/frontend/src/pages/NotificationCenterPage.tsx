import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  Circle,
  Inbox,
  Mail,
  MessageSquare,
  MonitorSmartphone,
} from "lucide-react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import {
  useAcknowledgeNotification,
  useNotificationLogs,
} from "../hooks/use-backend";
import type { NotificationChannel, NotificationStatus } from "../types";

const CUSTOMER = "default";
const HISTORY_LIMIT = 200;

const CHANNEL_META: Record<
  NotificationChannel,
  { label: string; icon: typeof Mail; className: string }
> = {
  InApp: {
    label: "In-App",
    icon: MonitorSmartphone,
    className: "bg-primary/15 text-primary border border-primary/40",
  },
  Email: {
    label: "Email",
    icon: Mail,
    className: "bg-chart-2/15 text-chart-2 border border-chart-2/40",
  },
  TeamsWebhook: {
    label: "Teams",
    icon: MessageSquare,
    className: "bg-accent/15 text-accent-foreground border border-accent/40",
  },
};

const STATUS_META: Record<NotificationStatus, string> = {
  Sent: "bg-muted/30 text-muted-foreground border border-border",
  Failed: "bg-destructive/15 text-destructive border border-destructive/40",
  Acknowledged: "bg-chart-2/15 text-chart-2 border border-chart-2/40",
};

function relativeTime(ts: bigint): string {
  try {
    return formatDistanceToNow(new Date(Number(ts / 1_000_000n)), {
      addSuffix: true,
    });
  } catch {
    return "Unknown";
  }
}

function absoluteTime(ts: bigint): string {
  try {
    return new Date(Number(ts / 1_000_000n)).toLocaleString();
  } catch {
    return "Unknown";
  }
}

function ChannelBadge({ channel }: { channel: NotificationChannel }) {
  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${meta.className}`}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  );
}

function StatusBadge({ status }: { status: NotificationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide ${STATUS_META[status]}`}
    >
      {status}
    </span>
  );
}

function AckBadge({ acknowledged }: { acknowledged: boolean }) {
  return acknowledged ? (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide bg-chart-2/15 text-chart-2 border border-chart-2/40">
      <CheckCircle2 size={11} />
      Acknowledged
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide bg-warning/15 text-warning border border-warning/40">
      <Circle size={9} className="fill-warning" />
      Pending
    </span>
  );
}

export default function NotificationCenterPage() {
  const { data: logs = [], isLoading } = useNotificationLogs(
    CUSTOMER,
    HISTORY_LIMIT,
  );
  const ackMutation = useAcknowledgeNotification();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const unacknowledged = logs.filter((l) => !l.acknowledged);
  const acknowledgedCount = logs.length - unacknowledged.length;

  function acknowledge(id: string) {
    setPendingId(id);
    ackMutation.mutate(id, { onSettled: () => setPendingId(null) });
  }

  function acknowledgeAll() {
    for (const log of unacknowledged) {
      ackMutation.mutate(log.id);
    }
  }

  return (
    <Layout>
      <div data-ocid="notification_center.page" className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
              <Inbox size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                Notification Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Acknowledge alerts · Full delivery history
              </p>
            </div>
          </div>
          {unacknowledged.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={acknowledgeAll}
              disabled={ackMutation.isPending}
              data-ocid="notification_center.acknowledge_all_button"
              className="gap-1.5 text-xs"
            >
              <CheckCheck size={13} /> Acknowledge All
            </Button>
          )}
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            data-ocid="notification_center.pending_card"
            className="rounded-lg border border-warning/40 bg-warning/5 p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Awaiting Acknowledgement
            </p>
            <p className="font-display text-2xl font-bold text-warning mt-1">
              {unacknowledged.length}
            </p>
          </div>
          <div
            data-ocid="notification_center.acknowledged_card"
            className="rounded-lg border border-border bg-card p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Acknowledged
            </p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {acknowledgedCount}
            </p>
          </div>
          <div
            data-ocid="notification_center.total_card"
            className="rounded-lg border border-border bg-card p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Total Delivered
            </p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {logs.length}
            </p>
          </div>
        </div>

        {/* Unacknowledged queue */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-primary" />
            <h2 className="font-display font-semibold text-sm text-foreground">
              Needs Attention
            </h2>
          </div>

          {isLoading ? (
            <div
              data-ocid="notification_center.pending_loading_state"
              className="space-y-2"
            >
              {Array.from({ length: 3 }, (_, i) => `pending-skeleton-${i}`).map(
                (id) => (
                  <div
                    key={id}
                    className="h-20 rounded-lg bg-muted/20 animate-pulse"
                  />
                ),
              )}
            </div>
          ) : unacknowledged.length === 0 ? (
            <div
              data-ocid="notification_center.pending_empty_state"
              className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-12 text-center"
            >
              <BellOff size={30} className="text-muted-foreground/40" />
              <p className="font-display font-semibold text-foreground">
                Nothing needs your attention
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Every notification has been acknowledged.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {unacknowledged.map((log, idx) => (
                <div
                  key={log.id}
                  data-ocid={`notification_center.pending.item.${idx + 1}`}
                  className="rounded-lg border border-warning/40 bg-warning/5 p-4 flex items-start gap-3 transition-smooth"
                >
                  <div className="mt-1 shrink-0">
                    <Circle size={9} className="fill-warning text-warning" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href="/alerts"
                        className="text-sm font-medium text-foreground hover:text-primary transition-smooth truncate"
                      >
                        Alert #{log.alertId.slice(0, 8)}
                      </a>
                      <ChannelBadge channel={log.channel} />
                      <StatusBadge status={log.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Rule:{" "}
                        <span className="font-mono text-foreground">
                          {log.ruleId.slice(0, 12)}
                        </span>
                      </span>
                      <span>
                        Recipient:{" "}
                        <span className="text-foreground">{log.recipient}</span>
                      </span>
                      <span title={absoluteTime(log.timestamp)}>
                        {relativeTime(log.timestamp)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-7 gap-1.5"
                    onClick={() => acknowledge(log.id)}
                    disabled={ackMutation.isPending && pendingId === log.id}
                    data-ocid={`notification_center.acknowledge_button.${idx + 1}`}
                  >
                    <CheckCheck size={13} />
                    {ackMutation.isPending && pendingId === log.id
                      ? "Acknowledging…"
                      : "Acknowledge"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Full history */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-muted-foreground" />
            <h2 className="font-display font-semibold text-sm text-foreground">
              Notification History
            </h2>
          </div>

          {isLoading ? (
            <div
              data-ocid="notification_center.history_loading_state"
              className="space-y-1"
            >
              {Array.from({ length: 5 }, (_, i) => `history-skeleton-${i}`).map(
                (id) => (
                  <div
                    key={id}
                    className="h-10 rounded bg-muted/20 animate-pulse"
                  />
                ),
              )}
            </div>
          ) : logs.length === 0 ? (
            <div
              data-ocid="notification_center.history_empty_state"
              className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-12 text-center"
            >
              <Bell size={30} className="text-muted-foreground/40" />
              <p className="font-display font-semibold text-foreground">
                No notification history
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Notifications appear here once an alert rule routes a finding.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/20">
                    <TableHead className="text-xs text-muted-foreground w-32">
                      Timestamp
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground w-32">
                      Alert
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground w-32">
                      Rule
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground w-28">
                      Channel
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      Recipient
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground w-28">
                      Delivery
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground w-36">
                      Acknowledgement
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log, idx) => (
                    <TableRow
                      key={log.id}
                      data-ocid={`notification_center.history.item.${idx + 1}`}
                      className="border-border hover:bg-muted/10 transition-smooth"
                    >
                      <TableCell
                        className="text-xs text-muted-foreground font-mono"
                        title={absoluteTime(log.timestamp)}
                      >
                        {relativeTime(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <a
                          href="/alerts"
                          className="text-xs font-mono text-primary hover:underline"
                        >
                          {log.alertId.slice(0, 10)}…
                        </a>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {log.ruleId.slice(0, 10)}…
                      </TableCell>
                      <TableCell>
                        <ChannelBadge channel={log.channel} />
                      </TableCell>
                      <TableCell className="text-xs text-foreground max-w-[180px] truncate">
                        {log.recipient}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={log.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AckBadge acknowledged={log.acknowledged} />
                          {!log.acknowledged && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[11px]"
                              onClick={() => acknowledge(log.id)}
                              disabled={
                                ackMutation.isPending && pendingId === log.id
                              }
                              data-ocid={`notification_center.history_acknowledge_button.${idx + 1}`}
                            >
                              Ack
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
