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
import { Download, FileText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  useComplianceStatus,
  useExportComplianceCsv,
  useExportCompliancePdf,
} from "../hooks/use-backend";
import type { ComplianceFramework } from "../types";

const FRAMEWORKS: { id: ComplianceFramework; label: string }[] = [
  { id: "NISTCSF", label: "NIST CSF" },
  { id: "CISAws", label: "CIS AWS" },
  { id: "CISAzure", label: "CIS Azure" },
  { id: "CISGCP", label: "CIS GCP" },
  { id: "ISO27001", label: "ISO 27001" },
  { id: "SOC2", label: "SOC 2" },
];

function controlStatusClass(status: string): string {
  if (status === "Passing")
    return "bg-success/20 text-success border-success/40";
  if (status === "Failing")
    return "bg-destructive/20 text-destructive border-destructive/40";
  return "bg-muted/40 text-muted-foreground border-border";
}

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] =
    useState<ComplianceFramework>("NISTCSF");

  const { data, isLoading } = useComplianceStatus(selectedFramework);
  const controls = (data?.controls ?? []) as Array<{
    controlId: string;
    title: string;
    status: string;
    remediationGuidance: string;
  }>;
  const score = Number(data?.score ?? 0n);
  const total = Number(data?.total ?? 0n);
  const passing = Number(data?.passing ?? 0n);
  const failing = Number(data?.failing ?? 0n);

  const exportCsv = useExportComplianceCsv();
  const exportPdf = useExportCompliancePdf();

  function handleExportCsv() {
    exportCsv.mutate(selectedFramework, {
      onSuccess: (csv: string) => {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compliance-${selectedFramework}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  function handleExportPdf() {
    exportPdf.mutate(selectedFramework, {
      onSuccess: (bytes: Uint8Array) => {
        const blob = new Blob([bytes.buffer as ArrayBuffer], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compliance-${selectedFramework}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  return (
    <div data-ocid="compliance.page" className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
            <ShieldCheck size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-foreground tracking-tight">
              Compliance Mapping
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Framework coverage and control gap analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="compliance.export_csv_button"
            className="gap-1.5 border-border text-foreground hover:bg-muted/40"
            onClick={handleExportCsv}
            disabled={exportCsv.isPending}
          >
            <Download size={13} />
            {exportCsv.isPending ? "Exporting…" : "Export CSV"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="compliance.export_pdf_button"
            className="gap-1.5 border-border text-foreground hover:bg-muted/40"
            onClick={handleExportPdf}
            disabled={exportPdf.isPending}
          >
            <FileText size={13} />
            {exportPdf.isPending ? "Exporting…" : "Export PDF"}
          </Button>
        </div>
      </div>

      {/* Framework tabs */}
      <div
        data-ocid="compliance.framework_tabs"
        className="flex flex-wrap gap-1.5 p-1 bg-muted/20 rounded-lg border border-border w-fit"
      >
        {FRAMEWORKS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            data-ocid={`compliance.framework_tab.${id.toLowerCase()}`}
            onClick={() => setSelectedFramework(id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-smooth ${
              selectedFramework === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-primary/30 bg-primary/8 p-4">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
              Score
            </p>
            <p className="text-3xl font-display font-bold text-primary tabular-nums">
              {score}%
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
              Total Controls
            </p>
            <p className="text-3xl font-display font-bold text-foreground tabular-nums">
              {total}
            </p>
          </div>
          <div className="rounded-lg border border-success/30 bg-success/8 p-4">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
              Passing
            </p>
            <p className="text-3xl font-display font-bold text-success tabular-nums">
              {passing}
            </p>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/8 p-4">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
              Failing
            </p>
            <p className="text-3xl font-display font-bold text-destructive tabular-nums">
              {failing}
            </p>
          </div>
        </div>
      )}

      {/* Controls table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/10">
          <span className="text-sm font-semibold font-display text-foreground">
            Controls
          </span>
          <Badge
            variant="outline"
            className="font-mono text-xs border-border text-muted-foreground"
          >
            {isLoading ? "…" : controls.length}
          </Badge>
        </div>
        {isLoading ? (
          <div
            data-ocid="compliance.controls.loading_state"
            className="p-6 space-y-2"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : controls.length === 0 ? (
          <div
            data-ocid="compliance.controls.empty_state"
            className="flex flex-col items-center justify-center py-12 gap-3"
          >
            <ShieldCheck size={28} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No controls found for this framework.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 hover:bg-muted/10 border-border">
                <TableHead className="text-xs w-32">Control ID</TableHead>
                <TableHead className="text-xs">Title</TableHead>
                <TableHead className="text-xs w-28">Status</TableHead>
                <TableHead className="text-xs">Remediation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.map((ctrl, idx) => (
                <TableRow
                  key={ctrl.controlId}
                  data-ocid={`compliance.controls.item.${idx + 1}`}
                  className="border-border hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {ctrl.controlId}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground max-w-[200px]">
                    <span className="line-clamp-2">{ctrl.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-mono text-[10px] ${controlStatusClass(ctrl.status)}`}
                    >
                      {ctrl.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[320px]">
                    <span
                      className="line-clamp-2"
                      title={ctrl.remediationGuidance}
                    >
                      {ctrl.remediationGuidance.slice(0, 80)}
                      {ctrl.remediationGuidance.length > 80 ? "…" : ""}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
