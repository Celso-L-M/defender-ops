import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ClipboardList, Download, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { useAuditLog } from "../hooks/use-backend";
import type { AuditLogEntry } from "../types";

const CUSTOMER = "default";

function relativeTime(ts: bigint): string {
  try {
    return formatDistanceToNow(new Date(Number(ts / 1_000_000n)), {
      addSuffix: true,
    });
  } catch {
    return "Unknown";
  }
}

function exportCsv(entries: AuditLogEntry[]) {
  const header = ["Timestamp", "Actor", "Action", "Details", "Customer"];
  const rows = entries.map((e) => [
    new Date(Number(e.timestamp / 1_000_000n)).toISOString(),
    e.actorId,
    e.action,
    `"${e.details.replace(/"/g, '""')}"`,
    e.customer,
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-log-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AuditLogPage() {
  const [limit, setLimit] = useState(100);
  const [search, setSearch] = useState("");
  const { data: entries = [], isLoading } = useAuditLog(CUSTOMER, limit);

  const filtered = search.trim()
    ? entries.filter(
        (e) =>
          e.action.toLowerCase().includes(search.toLowerCase()) ||
          e.actorId.toLowerCase().includes(search.toLowerCase()) ||
          e.details.toLowerCase().includes(search.toLowerCase()),
      )
    : entries;

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
              <ClipboardList size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                Audit Log
              </h1>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {isLoading ? (
                  <Skeleton className="h-3 w-24 inline-block" />
                ) : (
                  <>
                    {filtered.length} entr{filtered.length !== 1 ? "ies" : "y"}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              data-ocid="audit.search_input"
              placeholder="Filter by actor, action, details…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background h-8 text-sm w-64"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportCsv(filtered)}
              disabled={filtered.length === 0}
              data-ocid="audit.export_csv_button"
              className="gap-1.5 text-xs shrink-0"
            >
              <Download size={13} /> Export CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div data-ocid="audit.loading_state" className="space-y-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="audit.empty_state"
            className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/10 py-16 text-center"
          >
            <ShieldAlert size={36} className="text-muted-foreground/40" />
            <p className="font-display font-semibold text-foreground">
              {search.trim() ? "No matching entries" : "No audit log entries"}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {search.trim()
                ? "Try adjusting your filter."
                : "All administrative actions will appear here once they occur."}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/20">
                    <TableHead className="text-xs text-muted-foreground w-36">
                      Timestamp
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground w-44">
                      Actor
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground w-40">
                      Action
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      Details
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground w-28">
                      Customer
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((entry, idx) => (
                    <TableRow
                      key={entry.id}
                      data-ocid={`audit.log.item.${idx + 1}`}
                      className="border-border hover:bg-muted/10 transition-smooth"
                    >
                      <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {relativeTime(entry.timestamp)}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-foreground max-w-[160px] truncate">
                        {entry.actorId}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold font-mono bg-primary/10 text-primary border border-primary/25">
                          {entry.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">
                        {entry.details}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {entry.customer}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {entries.length === limit && (
              <div className="flex justify-center pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setLimit((l) => l + 100)}
                  data-ocid="audit.load_more_button"
                  className="text-xs"
                >
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
