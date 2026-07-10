import { useProviderFilter } from "@/contexts/provider-filter";
import { useNormalizedAlerts, useProviderStates } from "@/hooks/use-backend";
import {
  AlertTriangle,
  Minus,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import { memo, useRef } from "react";
import type { ProviderType, Severity } from "../types";
import { ProviderIcon } from "./ProviderIcon";

const PROVIDERS: ProviderType[] = ["AWS", "Azure", "GCP"];

const PROVIDER_COLORS: Record<
  ProviderType,
  { border: string; glow: string; badge: string; text: string }
> = {
  AWS: {
    border: "border-orange-500",
    glow: "shadow-[0_0_12px_2px_rgba(249,115,22,0.4)]",
    badge: "bg-orange-500/20 text-orange-400 border border-orange-500/40",
    text: "text-orange-400",
  },
  Azure: {
    border: "border-blue-500",
    glow: "shadow-[0_0_12px_2px_rgba(59,130,246,0.4)]",
    badge: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
    text: "text-blue-400",
  },
  GCP: {
    border: "border-green-500",
    glow: "shadow-[0_0_12px_2px_rgba(34,197,94,0.4)]",
    badge: "bg-green-500/20 text-green-400 border border-green-500/40",
    text: "text-green-400",
  },
};

const SEVERITY_STYLES: Record<Severity, string> = {
  Critical: "bg-destructive/20 text-red-400 border border-destructive/50",
  High: "bg-orange-500/20 text-orange-400 border border-orange-500/50",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
  Low: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
  Unknown: "bg-muted/30 text-muted-foreground border border-border",
};

const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];

interface ProviderCardProps {
  provider: ProviderType;
  isSelected: boolean;
  onSelect: () => void;
}

const ProviderCard = memo(function ProviderCard({
  provider,
  isSelected,
  onSelect,
}: ProviderCardProps) {
  const colors = PROVIDER_COLORS[provider];

  const { data: alerts = [] } = useNormalizedAlerts({
    customer: "default",
    limit: 500,
    provider,
  });

  const { data: providerStates = [] } = useProviderStates();

  const prevTotalRef = useRef<number | null>(null);

  const activeAlerts = alerts.filter((a) => a.status !== "Resolved");
  const total = activeAlerts.length;

  const prevTotal = prevTotalRef.current;
  prevTotalRef.current = total;

  const trend: "up" | "down" | "flat" =
    prevTotal === null || prevTotal === total
      ? "flat"
      : total > prevTotal
        ? "up"
        : "down";

  const severityCounts = SEVERITIES.reduce<Record<Severity, number>>(
    (acc, sev) => {
      acc[sev] = activeAlerts.filter((a) => a.severity === sev).length;
      return acc;
    },
    { Critical: 0, High: 0, Medium: 0, Low: 0, Unknown: 0 },
  );

  const state = providerStates.find((s) => s.provider === provider);
  const isConnected = state?.status === "Active";
  const hasError = state?.status === "Error" || state?.status === "AuthPaused";

  const connectionLabel = isConnected
    ? "Connected"
    : hasError
      ? "Error"
      : "Disconnected";
  const connectionClass = isConnected
    ? "text-green-400 bg-green-500/10 border border-green-500/30"
    : hasError
      ? "text-red-400 bg-destructive/10 border border-destructive/30"
      : "text-muted-foreground bg-muted/20 border border-border";
  const ConnectionIcon = isConnected
    ? Wifi
    : hasError
      ? AlertTriangle
      : WifiOff;

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendClass =
    trend === "up"
      ? "text-red-400"
      : trend === "down"
        ? "text-green-400"
        : "text-muted-foreground";

  return (
    <button
      type="button"
      data-ocid={`provider_cards.${provider.toLowerCase()}_card`}
      onClick={onSelect}
      className={[
        "w-full text-left rounded-xl p-5 border transition-all duration-200 cursor-pointer",
        "bg-[#1a1d27] hover:border-opacity-80 focus-visible:outline-none focus-visible:ring-2",
        isSelected
          ? `${colors.border} ${colors.glow}`
          : `border-[#2a2d3e] hover:${colors.border}`,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <ProviderIcon provider={provider} className="text-base" />
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${connectionClass}`}
        >
          <ConnectionIcon size={10} />
          {connectionLabel}
        </span>
      </div>

      {/* Total count */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className={`text-3xl font-bold font-display ${colors.text}`}>
            {total}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            active alerts
          </div>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${trendClass}`}
        >
          <TrendIcon size={16} />
          <span className="text-xs">
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
            {prevTotal !== null && prevTotal !== total
              ? Math.abs(total - prevTotal)
              : ""}
          </span>
        </div>
      </div>

      {/* Severity breakdown */}
      <div className="grid grid-cols-2 gap-1.5">
        {SEVERITIES.map((sev) => (
          <div
            key={sev}
            className={`flex items-center justify-between rounded px-2 py-1 text-xs font-mono ${SEVERITY_STYLES[sev]}`}
          >
            <span className="truncate pr-1">{sev}</span>
            <span className="font-bold tabular-nums">
              {severityCounts[sev]}
            </span>
          </div>
        ))}
      </div>
    </button>
  );
});

export function ProviderCards() {
  const { selectedProvider, setSelectedProvider } = useProviderFilter();

  return (
    <div className="space-y-3">
      {/* All Providers toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-ocid="provider_cards.all_providers_toggle"
          onClick={() => setSelectedProvider(null)}
          className={[
            "rounded-lg px-4 py-1.5 text-sm font-semibold border transition-all duration-200 cursor-pointer",
            selectedProvider === null
              ? "bg-primary/20 border-primary text-primary"
              : "bg-transparent border-[#2a2d3e] text-muted-foreground hover:border-primary/60 hover:text-foreground",
          ].join(" ")}
        >
          All Providers
        </button>
        {PROVIDERS.map((p) => (
          <button
            key={p}
            type="button"
            data-ocid={`provider_cards.filter_${p.toLowerCase()}`}
            onClick={() => setSelectedProvider(p)}
            className={[
              "rounded-lg px-4 py-1.5 text-sm font-semibold border transition-all duration-200 cursor-pointer",
              selectedProvider === p
                ? `${PROVIDER_COLORS[p].badge} ${PROVIDER_COLORS[p].border}`
                : "bg-transparent border-[#2a2d3e] text-muted-foreground hover:border-opacity-60",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Provider cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PROVIDERS.map((p) => (
          <ProviderCard
            key={p}
            provider={p}
            isSelected={selectedProvider === p}
            onSelect={() =>
              setSelectedProvider(selectedProvider === p ? null : p)
            }
          />
        ))}
      </div>
    </div>
  );
}
