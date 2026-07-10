import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Hash,
  MapPin,
  Server,
  Shield,
  Tag,
} from "lucide-react";
import { ProviderIcon } from "../components/ProviderIcon";
import { SeverityBadge } from "../components/SeverityBadge";
import { useAssetById, useAssetFindings } from "../hooks/use-backend";
import type { NormalizedAlert } from "../types";

const ASSET_TYPE_LABELS: Record<string, string> = {
  EC2: "EC2",
  S3: "S3",
  RDS: "RDS",
  Lambda: "Lambda",
  AzureVM: "Azure VM",
  AzureStorage: "Azure Storage",
  AzureDatabase: "Azure Database",
  GCPCompute: "GCP Compute",
  GCPStorage: "GCP Storage",
  GCPCloudSQL: "GCP Cloud SQL",
  Other: "Other",
};

function statusBadgeClass(status: NormalizedAlert["status"]): string {
  if (status === "Open")
    return "bg-destructive/20 text-destructive border-destructive/40";
  if (status === "InProgress")
    return "bg-warning/20 text-warning border-warning/40";
  return "bg-success/20 text-success border-success/40";
}

function riskBgClass(score: number): string {
  if (score >= 31) return "border-destructive/40 bg-destructive/10";
  if (score >= 11) return "border-warning/40 bg-warning/10";
  return "border-success/40 bg-success/10";
}

function riskTextClass(score: number): string {
  if (score >= 31) return "text-destructive";
  if (score >= 11) return "text-warning";
  return "text-success";
}

export default function AssetDetailPage() {
  const { assetId } = useParams({ strict: false }) as { assetId: string };
  const navigate = useNavigate();
  const {
    data: asset,
    isLoading: assetLoading,
    isError,
  } = useAssetById(assetId ?? "");
  const { data: findings = [], isLoading: findingsLoading } = useAssetFindings(
    assetId ?? "",
  );

  if (assetLoading) {
    return (
      <div
        data-ocid="asset-detail.loading_state"
        className="flex flex-col min-h-screen bg-background"
      >
        <div className="bg-card border-b border-border px-6 py-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || (!assetLoading && !asset)) {
    return (
      <div
        data-ocid="asset-detail.error_state"
        className="flex flex-col min-h-screen bg-background"
      >
        <div className="bg-card border-b border-border px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => navigate({ to: "/assets" })}
          >
            <ArrowLeft size={14} /> Back to Assets
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <div className="p-4 rounded-full bg-destructive/10 border border-destructive/30">
            <AlertTriangle size={32} className="text-destructive" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-semibold">Asset Not Found</p>
            <p className="text-muted-foreground text-sm mt-1">
              Asset ID <span className="font-mono">{assetId}</span> could not be
              located.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border"
            onClick={() => navigate({ to: "/assets" })}
          >
            Return to Inventory
          </Button>
        </div>
      </div>
    );
  }

  const score = Number(asset!.riskScore);
  const criticalFindings = findings.filter(
    (f) => f.severity === "Critical",
  ).length;
  const highFindings = findings.filter((f) => f.severity === "High").length;
  const mediumFindings = findings.filter((f) => f.severity === "Medium").length;
  const lowFindings = findings.filter((f) => f.severity === "Low").length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-ocid="asset-detail.back_link"
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2 mb-3"
          onClick={() => navigate({ to: "/assets" })}
        >
          <ArrowLeft size={14} /> Back to Asset Inventory
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-primary/10 border border-primary/20">
              <Server size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-foreground tracking-tight">
                {asset!.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <ProviderIcon provider={asset!.provider} showLabel />
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-border text-muted-foreground"
                >
                  {ASSET_TYPE_LABELS[asset!.assetType] ?? asset!.assetType}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <MapPin size={11} />
                  {asset!.region}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Hash size={11} />
                  {asset!.accountId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: findings table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Open Findings */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/10">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-primary" />
                <span className="text-sm font-semibold font-display text-foreground">
                  Open Findings
                </span>
              </div>
              <Badge
                variant="outline"
                className="font-mono text-xs border-border text-muted-foreground"
              >
                {findingsLoading ? "…" : findings.length}
              </Badge>
            </div>
            {findingsLoading ? (
              <div
                data-ocid="asset-detail.findings.loading_state"
                className="p-6 space-y-2"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : findings.length === 0 ? (
              <div
                data-ocid="asset-detail.findings.empty_state"
                className="flex flex-col items-center justify-center py-12 gap-3"
              >
                <Shield size={28} className="text-success" />
                <p className="text-sm text-muted-foreground">
                  No open findings for this asset.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/10 hover:bg-muted/10 border-border">
                    <TableHead className="text-xs">Timestamp</TableHead>
                    <TableHead className="text-xs">Severity</TableHead>
                    <TableHead className="text-xs">Title</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">MITRE Tactic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {findings.map((f, idx) => (
                    <TableRow
                      key={f.id}
                      data-ocid={`asset-detail.findings.item.${idx + 1}`}
                      className="border-border hover:bg-muted/10 transition-colors"
                    >
                      <TableCell className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(
                          new Date(Number(f.timestamp) / 1_000_000),
                          { addSuffix: true },
                        )}
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={f.severity} />
                      </TableCell>
                      <TableCell className="max-w-[240px]">
                        <a
                          href={"/alerts"}
                          data-ocid={`asset-detail.findings.alert_link.${idx + 1}`}
                          className="text-primary hover:underline text-xs truncate block"
                          title={f.title}
                        >
                          {f.title}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] ${statusBadgeClass(f.status)}`}
                        >
                          {f.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {f.mitre?.tactic ?? (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Right: risk score + metadata */}
        <div className="space-y-5">
          {/* Risk Score Card */}
          <div className={`rounded-lg border ${riskBgClass(score)} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={15} className={riskTextClass(score)} />
              <span className="text-sm font-semibold font-display text-foreground">
                Risk Score
              </span>
            </div>
            <div
              className={`text-5xl font-display font-bold tabular-nums mb-4 ${riskTextClass(score)}`}
            >
              {score}
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Critical × 4</span>
                <span className="text-destructive font-semibold">
                  {criticalFindings * 4}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High × 3</span>
                <span className="text-chart-5 font-semibold">
                  {highFindings * 3}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medium × 2</span>
                <span className="text-warning font-semibold">
                  {mediumFindings * 2}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Low × 1</span>
                <span className="text-primary font-semibold">
                  {lowFindings}
                </span>
              </div>
              <div className="border-t border-border pt-1.5 flex justify-between font-bold">
                <span className="text-foreground">Total</span>
                <span className={riskTextClass(score)}>{score}</span>
              </div>
            </div>
          </div>

          {/* Asset Metadata */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-muted-foreground" />
              <span className="text-sm font-semibold font-display text-foreground">
                Metadata
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Last Seen</span>
                <span className="text-foreground text-right">
                  {formatDistanceToNow(
                    new Date(Number(asset!.lastSeen) / 1_000_000),
                    { addSuffix: true },
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Asset ID</span>
                <span
                  className="text-foreground text-right truncate max-w-[140px]"
                  title={asset!.id}
                >
                  {asset!.id.slice(0, 20)}…
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Customer</span>
                <span className="text-foreground">
                  {asset!.customer || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {asset!.tags.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold font-display text-foreground">
                  Tags / Labels
                </span>
              </div>
              <div className="space-y-1.5">
                {asset!.tags.map(([k, v], _i) => (
                  <div
                    key={`tag-${k}`}
                    className="flex items-center justify-between gap-2 text-xs font-mono"
                  >
                    <span className="text-muted-foreground truncate">{k}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-border text-foreground max-w-[120px] truncate"
                    >
                      {v}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
