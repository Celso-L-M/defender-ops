import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileBarChart2,
  Mail,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useDeleteReport,
  useGenerateReport,
  useGetReportCsv,
  useGetReportEmailConfig,
  useGetReports,
  useSaveReportEmailConfig,
} from "../hooks/use-backend";
import type { GeneratedReport } from "../types";

const REPORT_TYPE_LABELS: Record<string, string> = {
  SecurityPosture: "Security Posture Summary",
  ComplianceStatus: "Compliance Status Report",
  IncidentSummary: "Incident Summary",
  ThreatIntelSummary: "Threat Intelligence Summary",
};

const REPORT_TYPE_OPTIONS = [
  { value: "SecurityPosture", label: "Security Posture Summary" },
  { value: "ComplianceStatus", label: "Compliance Status Report" },
  { value: "IncidentSummary", label: "Incident Summary" },
  { value: "ThreatIntelSummary", label: "Threat Intelligence Summary" },
];

const PROVIDER_OPTIONS = ["AWS", "Azure", "GCP"];

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function GenerateReportForm({ onClose }: { onClose: () => void }) {
  const [reportType, setReportType] = React.useState("SecurityPosture");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [allProviders, setAllProviders] = React.useState(true);
  const [selectedProviders, setSelectedProviders] = React.useState<string[]>(
    [],
  );

  const { mutateAsync: generate, isPending } = useGenerateReport();

  const toggleProvider = (p: string) => {
    setSelectedProviders((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please enter both start and end dates");
      return;
    }
    const providerScope = allProviders
      ? ["All"]
      : selectedProviders.length > 0
        ? selectedProviders
        : ["All"];
    try {
      const result = await generate({
        reportType,
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
        providerScope,
        customer: "",
      });
      toast.success("Report generated — downloading CSV");
      downloadCsv(
        result.csvData,
        `${reportType}-${startDate}-to-${endDate}.csv`,
      );
      onClose();
    } catch {
      toast.error("Failed to generate report");
    }
  };

  return (
    <dialog
      open
      style={{
        position: "fixed",
        inset: 0,
        margin: "auto",
        width: "100%",
        maxWidth: "480px",
        height: "fit-content",
        zIndex: 50,
        background: "transparent",
        border: "none",
        padding: 0,
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="presentation"
      />
      <div
        className="relative bg-card border border-border rounded-xl shadow-2xl p-6 w-full"
        data-ocid="reports.generate_dialog"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-foreground">
            Generate Report
          </h2>
          <button
            type="button"
            data-ocid="reports.generate_dialog.close_button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Report Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Report Type
            </Label>
            <select
              data-ocid="reports.type_select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
            >
              {REPORT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Start Date
              </Label>
              <input
                type="date"
                data-ocid="reports.start_date_input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                End Date
              </Label>
              <input
                type="date"
                data-ocid="reports.end_date_input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
              />
            </div>
          </div>

          {/* Provider Scope */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Provider Scope
            </Label>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="scope-all"
                  data-ocid="reports.scope_all_checkbox"
                  checked={allProviders}
                  onCheckedChange={(v) => {
                    setAllProviders(!!v);
                    if (v) setSelectedProviders([]);
                  }}
                />
                <Label
                  htmlFor="scope-all"
                  className="text-sm text-foreground cursor-pointer"
                >
                  All Providers
                </Label>
              </div>
              {PROVIDER_OPTIONS.map((p) => (
                <div key={p} className="flex items-center gap-1.5">
                  <Checkbox
                    id={`scope-${p}`}
                    data-ocid={`reports.scope_${p.toLowerCase()}_checkbox`}
                    checked={!allProviders && selectedProviders.includes(p)}
                    disabled={allProviders}
                    onCheckedChange={() => {
                      setAllProviders(false);
                      toggleProvider(p);
                    }}
                  />
                  <Label
                    htmlFor={`scope-${p}`}
                    className={`text-sm cursor-pointer ${
                      allProviders ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {p}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="reports.generate_dialog.cancel_button"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="reports.generate_dialog.submit_button"
              disabled={isPending}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Generating…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FileBarChart2 size={14} />
                  Generate & Download
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

function ReportRow({ report }: { report: GeneratedReport }) {
  const { mutateAsync: deleteReport, isPending: isDeleting } =
    useDeleteReport();
  const { mutateAsync: fetchCsv, isPending: isFetchingCsv } = useGetReportCsv();

  const handleDownload = async () => {
    const csv = await fetchCsv({
      reportId: report.reportId,
      customer: report.customer,
    });
    if (!csv) {
      toast.error("CSV data not available");
      return;
    }
    downloadCsv(
      csv,
      `${report.reportType}-${report.dateRangeStart}-${report.dateRangeEnd}.csv`,
    );
    toast.success("CSV downloaded");
  };

  const handleDelete = async () => {
    try {
      await deleteReport({
        reportId: report.reportId,
        customer: report.customer,
      });
      toast.success("Report deleted");
    } catch {
      toast.error("Failed to delete report");
    }
  };

  return (
    <tr
      data-ocid="reports.table_row"
      className="border-b border-border/60 hover:bg-muted/10 transition-colors"
    >
      <td className="px-4 py-3 text-sm text-muted-foreground font-mono text-xs">
        {formatDistanceToNow(new Date(report.generatedAt), { addSuffix: true })}
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-foreground">
          {REPORT_TYPE_LABELS[report.reportType] ?? report.reportType}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {report.providerScope.map((p) => (
            <Badge
              key={p}
              variant="outline"
              className={`text-[10px] font-mono px-1.5 py-0 ${
                p === "AWS"
                  ? "border-orange-500/40 text-orange-400"
                  : p === "Azure"
                    ? "border-blue-500/40 text-blue-400"
                    : p === "GCP"
                      ? "border-green-500/40 text-green-400"
                      : "border-border text-muted-foreground"
              }`}
            >
              {p}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-border text-muted-foreground"
        >
          {report.format}
        </Badge>
      </td>
      <td className="px-4 py-3 text-xs font-mono text-muted-foreground truncate max-w-[160px]">
        {report.generatedBy}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="reports.download_button"
            onClick={handleDownload}
            disabled={isFetchingCsv}
            className="h-7 gap-1.5 text-xs"
          >
            {isFetchingCsv ? (
              <span className="h-3 w-3 rounded-full border border-muted-foreground border-t-transparent animate-spin" />
            ) : (
              <Download size={11} />
            )}
            Download
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="reports.delete_button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10"
          >
            {isDeleting ? (
              <span className="h-3 w-3 rounded-full border border-destructive border-t-transparent animate-spin" />
            ) : (
              <Trash2 size={11} />
            )}
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

function EmailRecipientsSection() {
  const CUSTOMER = "";
  const { data: emailConfig, isLoading } = useGetReportEmailConfig(CUSTOMER);
  const { mutateAsync: saveConfig } = useSaveReportEmailConfig();
  const [configs, setConfigs] = React.useState<Record<string, string>>({});
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (emailConfig) {
      const map: Record<string, string> = {};
      for (const c of emailConfig) {
        map[c.reportType] = c.recipients.join(", ");
      }
      setConfigs(map);
    }
  }, [emailConfig]);

  const handleSave = async (reportType: string) => {
    const raw = configs[reportType] ?? "";
    const recipients = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await saveConfig({ reportType, recipients, customer: CUSTOMER });
      toast.success("Email recipients saved");
    } catch {
      toast.error("Failed to save email recipients");
    }
  };

  return (
    <div
      data-ocid="reports.email_section"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        type="button"
        data-ocid="reports.email_section.toggle"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/10 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Mail size={16} className="text-primary" />
          <span className="font-display font-semibold text-sm text-foreground">
            Email Recipients
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            per report type
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            REPORT_TYPE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <div className="w-48 shrink-0">
                  <p className="text-xs font-medium text-foreground">
                    {opt.label}
                  </p>
                </div>
                <input
                  type="text"
                  data-ocid={`reports.email_input.${opt.value.toLowerCase()}`}
                  placeholder="comma-separated email addresses"
                  value={configs[opt.value] ?? ""}
                  onChange={(e) =>
                    setConfigs((prev) => ({
                      ...prev,
                      [opt.value]: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid={`reports.email_save_button.${opt.value.toLowerCase()}`}
                  onClick={() => handleSave(opt.value)}
                  className="h-8 gap-1.5 text-xs shrink-0"
                >
                  <Save size={11} />
                  Save
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [showGenerateForm, setShowGenerateForm] = React.useState(false);
  const { data: reports, isLoading } = useGetReports("");

  return (
    <Layout>
      <div data-ocid="reports.page" className="max-w-6xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              Security Reports
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Generate, download, and manage security compliance reports
            </p>
          </div>
          <Button
            type="button"
            data-ocid="reports.generate_button"
            onClick={() => setShowGenerateForm(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus size={15} />
            Generate Report
          </Button>
        </div>

        {/* Reports Library */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
            <FileBarChart2 size={16} className="text-primary" />
            <h2 className="font-display font-semibold text-sm text-foreground">
              Reports Library
            </h2>
            {reports && (
              <Badge
                variant="outline"
                className="ml-1 font-mono text-[10px] text-muted-foreground border-border"
              >
                {reports.length}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !reports || reports.length === 0 ? (
            <div
              data-ocid="reports.empty_state"
              className="flex flex-col items-center justify-center gap-3 py-14 text-center"
            >
              <FileBarChart2 size={32} className="text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">
                No reports generated yet
              </p>
              <p className="text-xs text-muted-foreground/60">
                Click{" "}
                <span className="text-primary font-medium">
                  Generate Report
                </span>{" "}
                to create your first security report
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60">
                    {[
                      "Date Generated",
                      "Report Type",
                      "Provider Scope",
                      "Format",
                      "Generated By",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => (
                    <ReportRow
                      key={report.reportId}
                      report={report}
                      data-ocid={`reports.table.item.${idx + 1}`}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Email Recipients */}
        <EmailRecipientsSection />
      </div>

      {showGenerateForm && (
        <GenerateReportForm onClose={() => setShowGenerateForm(false)} />
      )}
    </Layout>
  );
}
