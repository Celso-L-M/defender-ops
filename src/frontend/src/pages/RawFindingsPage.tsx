import { useState } from "react";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProviderIcon } from "../components/ProviderIcon";
import { SeverityBadge } from "../components/SeverityBadge";
import { useRawFindings } from "../hooks/use-backend";
import type { ProviderType, RawFinding } from "../types";

const PROVIDERS: ProviderType[] = ["AWS", "Azure", "GCP"];
type TabFilter = "All" | ProviderType;

function AllFindings() {
  const aws = useRawFindings("AWS", 100);
  const azure = useRawFindings("Azure", 100);
  const gcp = useRawFindings("GCP", 100);
  const isLoading = aws.isLoading || azure.isLoading || gcp.isLoading;
  const merged: RawFinding[] = [
    ...(aws.data?.items ?? []),
    ...(azure.data?.items ?? []),
    ...(gcp.data?.items ?? []),
  ]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 100);
  return <FindingsTable findings={merged} isLoading={isLoading} />;
}

function ProviderFindings({ provider }: { provider: ProviderType }) {
  const { data, isLoading } = useRawFindings(provider, 100);
  return <FindingsTable findings={data?.items ?? []} isLoading={isLoading} />;
}

function FindingsTable({
  findings,
  isLoading,
}: {
  findings: RawFinding[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div
        data-ocid="findings.loading_state"
        className="flex items-center justify-center py-20"
      >
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (findings.length === 0) {
    return (
      <div
        data-ocid="findings.empty_state"
        className="flex flex-col items-center justify-center py-20 text-center space-y-2"
      >
        <div className="text-4xl mb-2 opacity-30">📡</div>
        <p className="text-foreground font-mono text-sm font-medium">
          No raw findings ingested yet
        </p>
        <p className="text-muted-foreground font-mono text-xs max-w-xs">
          Configure a cloud provider to start polling.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead className="sticky top-0 bg-card z-10">
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-36 whitespace-nowrap">
              Timestamp
            </th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-20">
              Provider
            </th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
              Finding ID
            </th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-24">
              Severity
            </th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
              Title
            </th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] max-w-[180px]">
              Description
            </th>
            <th className="text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-32">
              Region / Account
            </th>
          </tr>
        </thead>
        <tbody>
          {findings.map((f, idx) => (
            <tr
              key={f.id}
              data-ocid={`findings.row.${idx + 1}`}
              className="border-b border-border/40 hover:bg-muted/20 transition-colors group"
            >
              <td className="py-1.5 px-3 text-muted-foreground whitespace-nowrap">
                {new Date(Number(f.timestamp) / 1_000_000).toLocaleString([], {
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="py-1.5 px-3">
                <ProviderIcon provider={f.provider} showLabel={false} />
              </td>
              <td className="py-1.5 px-3">
                <span className="finding-id text-foreground/70 group-hover:text-foreground transition-colors truncate block max-w-[140px]">
                  {f.findingId}
                </span>
              </td>
              <td className="py-1.5 px-3">
                <SeverityBadge severity={f.severity} />
              </td>
              <td className="py-1.5 px-3 text-foreground max-w-[200px]">
                <span className="truncate block">
                  {f.title.length > 60 ? `${f.title.slice(0, 60)}…` : f.title}
                </span>
              </td>
              <td className="py-1.5 px-3 text-muted-foreground max-w-[180px]">
                <span className="truncate block">
                  {f.description.length > 70
                    ? `${f.description.slice(0, 70)}…`
                    : f.description}
                </span>
              </td>
              <td className="py-1.5 px-3 text-muted-foreground whitespace-nowrap">
                {[f.region, f.accountId].filter(Boolean).join(" / ") || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RawFindingsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("All");
  const tabs: TabFilter[] = ["All", ...PROVIDERS];

  return (
    <Layout>
      <div data-ocid="findings.page" className="space-y-5">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
            Raw Findings Log
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5 font-mono">
            Unprocessed security findings ingested from cloud providers
          </p>
        </div>

        <div
          data-ocid="findings.debug_notice"
          className="flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/5 px-4 py-2.5"
        >
          <span className="text-amber-400 text-sm">⚠</span>
          <p className="font-mono text-xs text-amber-400/80">
            <span className="font-semibold text-amber-400">DEBUG VIEW</span> —
            Raw findings before normalization — for debugging purposes only. Use
            the Alerts page for normalized events.
          </p>
        </div>

        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="flex border-b border-border bg-muted/20">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                data-ocid={`findings.tab.${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-medium transition-colors border-r border-border last:border-r-0 ${
                  activeTab === tab
                    ? "text-primary bg-primary/10 border-b-2 border-b-primary -mb-px"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {tab !== "All" && (
                  <ProviderIcon
                    provider={tab as ProviderType}
                    showLabel={false}
                  />
                )}
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "All" ? (
            <AllFindings />
          ) : (
            <ProviderFindings provider={activeTab as ProviderType} />
          )}
        </div>
      </div>
    </Layout>
  );
}
