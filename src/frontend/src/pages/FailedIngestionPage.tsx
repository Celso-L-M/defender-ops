import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@tanstack/react-router";
import { AlertTriangle, FileText, XCircle } from "lucide-react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { useFailedIngestions } from "../hooks/use-backend";
import type { FailedIngestion } from "../types";

type ProviderFilter = "All" | "AWS" | "Azure" | "GCP";
type ErrorTypeFilter =
  | "All"
  | "extraction_error"
  | "normalization_error"
  | "validation_error";

const PROVIDER_BADGE: Record<string, string> = {
  AWS: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  Azure: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  GCP: "border-green-500/40 bg-green-500/10 text-green-400",
};

const ERROR_TYPE_BADGE: Record<string, string> = {
  extraction_error: "border-destructive/40 bg-destructive/10 text-destructive",
  normalization_error: "border-warning/40 bg-warning/10 text-warning",
  validation_error: "border-chart-5/40 bg-chart-5/10 text-chart-5",
};

const STATUS_BADGE: Record<string, string> = {
  failed: "border-destructive/40 bg-destructive/10 text-destructive",
  "Normalization Failed": "border-warning/40 bg-warning/10 text-warning",
  pending: "border-border text-muted-foreground bg-muted/20",
};

function formatTs(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : `${str.slice(0, max)}…`;
}

function formatJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function PayloadModal({
  finding,
  onClose,
}: {
  finding: FailedIngestion | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!finding} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-3xl bg-card border border-border"
        data-ocid="failed_ingestions.payload.dialog"
      >
        <DialogHeader className="border-b border-border pb-3">
          <DialogTitle className="text-foreground font-mono text-sm">
            Raw Payload — {finding?.provider} /{" "}
            <span className="text-muted-foreground">{finding?.errorType}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto mt-2">
          <pre className="text-[11px] font-mono text-foreground/90 bg-muted/20 border border-border rounded-md p-4 whitespace-pre-wrap break-all leading-relaxed">
            {finding ? formatJson(finding.rawPayload) : ""}
          </pre>
        </div>
        <div className="flex justify-end pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="failed_ingestions.payload.close_button"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FailedIngestionRow({
  item,
  idx,
  onViewPayload,
}: {
  item: FailedIngestion;
  idx: number;
  onViewPayload: (f: FailedIngestion) => void;
}) {
  return (
    <tr
      data-ocid={`failed_ingestions.item.${idx}`}
      className="border-b border-border/50 hover:bg-muted/10 transition-colors"
    >
      <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
        {formatTs(item.timestamp)}
      </td>
      <td className="py-2 px-3">
        <Badge
          variant="outline"
          className={`font-mono text-[10px] px-1.5 py-0 ${
            PROVIDER_BADGE[item.provider] ?? "border-border text-foreground"
          }`}
        >
          {item.provider}
        </Badge>
      </td>
      <td className="py-2 px-3">
        <Badge
          variant="outline"
          className={`font-mono text-[10px] px-1.5 py-0 ${
            ERROR_TYPE_BADGE[item.errorType] ?? "border-border text-foreground"
          }`}
        >
          {item.errorType.replace(/_/g, " ")}
        </Badge>
      </td>
      <td
        className="py-2 px-3 font-mono text-[11px] text-foreground/80 max-w-xs"
        title={item.errorMessage}
      >
        {truncate(item.errorMessage, 80)}
      </td>
      <td className="py-2 px-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onViewPayload(item)}
          data-ocid={`failed_ingestions.view_payload_button.${idx}`}
          className="h-6 px-2 text-[10px] font-mono text-muted-foreground hover:text-foreground gap-1"
        >
          <FileText size={11} />
          JSON
        </Button>
      </td>
      <td className="py-2 px-3">
        <Badge
          variant="outline"
          className={`font-mono text-[10px] px-1.5 py-0 ${
            STATUS_BADGE[item.status] ??
            "border-border text-muted-foreground bg-muted/20"
          }`}
        >
          {item.status}
        </Badge>
      </td>
    </tr>
  );
}

export default function FailedIngestionPage() {
  const searchParams = useSearch({ strict: false }) as { provider?: string };
  const initialProvider: ProviderFilter =
    (searchParams.provider as ProviderFilter) ?? "All";

  const [providerFilter, setProviderFilter] =
    useState<ProviderFilter>(initialProvider);
  const [errorTypeFilter, setErrorTypeFilter] =
    useState<ErrorTypeFilter>("All");
  const [selectedFinding, setSelectedFinding] =
    useState<FailedIngestion | null>(null);

  const queryProvider = providerFilter === "All" ? undefined : providerFilter;
  const { data, isLoading } = useFailedIngestions(queryProvider, 100);

  const filtered = (data ?? []).filter((item) =>
    errorTypeFilter === "All" ? true : item.errorType === errorTypeFilter,
  );

  return (
    <Layout>
      <div data-ocid="failed_ingestions.page" className="space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <XCircle size={18} className="text-destructive" />
            <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
              Failed Ingestions
            </h1>
          </div>
          <p className="text-muted-foreground text-xs font-mono">
            Review extraction, normalization, and validation failures from all
            cloud providers
          </p>
        </div>

        {/* Filters */}
        <div
          data-ocid="failed_ingestions.filters"
          className="flex flex-wrap items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Provider
            </span>
            <Select
              value={providerFilter}
              onValueChange={(v) => setProviderFilter(v as ProviderFilter)}
            >
              <SelectTrigger
                className="w-[120px] h-8 bg-card border-border text-xs font-mono"
                data-ocid="failed_ingestions.provider.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="All">All Providers</SelectItem>
                <SelectItem value="AWS">AWS</SelectItem>
                <SelectItem value="Azure">Azure</SelectItem>
                <SelectItem value="GCP">GCP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Error Type
            </span>
            <Select
              value={errorTypeFilter}
              onValueChange={(v) => setErrorTypeFilter(v as ErrorTypeFilter)}
            >
              <SelectTrigger
                className="w-[180px] h-8 bg-card border-border text-xs font-mono"
                data-ocid="failed_ingestions.error_type.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="All">All Error Types</SelectItem>
                <SelectItem value="extraction_error">
                  Extraction Error
                </SelectItem>
                <SelectItem value="normalization_error">
                  Normalization Error
                </SelectItem>
                <SelectItem value="validation_error">
                  Validation Error
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto">
            <span className="font-mono text-[10px] text-muted-foreground">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  {[
                    "Timestamp",
                    "Provider",
                    "Error Type",
                    "Error Message",
                    "Payload",
                    "Status",
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left py-2.5 px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-medium"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7"].map(
                    (rowKey) => (
                      <tr
                        key={rowKey}
                        className="border-b border-border/50"
                        data-ocid="failed_ingestions.loading_state"
                      >
                        {[0, 1, 2, 3, 4, 5].map((j) => (
                          <td key={j} className="py-2.5 px-3">
                            <Skeleton className="h-3 w-full rounded" />
                          </td>
                        ))}
                      </tr>
                    ),
                  )
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div
                        data-ocid="failed_ingestions.empty_state"
                        className="py-16 text-center"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <AlertTriangle
                            size={32}
                            className="text-muted-foreground/40"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              No failed ingestions
                            </p>
                            <p className="text-xs font-mono text-muted-foreground mt-1">
                              {providerFilter !== "All" ||
                              errorTypeFilter !== "All"
                                ? "Try adjusting the filters above"
                                : "All ingestion pipelines are healthy"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => (
                    <FailedIngestionRow
                      key={item.id}
                      item={item}
                      idx={idx + 1}
                      onViewPayload={setSelectedFinding}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PayloadModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </Layout>
  );
}
