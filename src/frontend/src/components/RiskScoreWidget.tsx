import { Skeleton } from "@/components/ui/skeleton";
import { useNormalizedAlerts } from "@/hooks/use-backend";
import type { NormalizedAlert, ProviderType } from "../types";

const PROVIDER_COLORS: Record<ProviderType, string> = {
  AWS: "#f97316",
  Azure: "#3b82f6",
  GCP: "#22c55e",
};

function computeWeight(severity: NormalizedAlert["severity"]): number {
  switch (severity) {
    case "Critical":
      return 4;
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
    default:
      return 0;
  }
}

function getRiskZone(score: number): { label: string; color: string } {
  if (score <= 30) return { label: "Low Risk", color: "#22c55e" };
  if (score <= 60) return { label: "Moderate", color: "#eab308" };
  if (score <= 85) return { label: "High", color: "#f97316" };
  return { label: "Critical", color: "#ef4444" };
}

function RiskGauge({ score, color }: { score: number; color: string }) {
  const radius = 72;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  // Only fill the top 270° arc (start at bottom-left, sweep to bottom-right)
  const arcLength = circumference * 0.75;
  const filled = arcLength * (score / 100);
  // Rotate so arc starts at ~135° (bottom-left)
  const rotation = 135;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      role="img"
      aria-label={`Risk score: ${score}`}
    >
      {/* Track */}
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        fill="none"
        stroke="#2a2d3e"
        strokeWidth={stroke}
        strokeDasharray={`${arcLength} ${circumference}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(${rotation} ${radius} ${radius})`}
      />
      {/* Filled arc */}
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${filled} ${circumference}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(${rotation} ${radius} ${radius})`}
        style={{
          transition:
            "stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease",
          filter: score >= 86 ? `drop-shadow(0 0 6px ${color}80)` : undefined,
        }}
      />
      {/* Score text */}
      <text
        x={radius}
        y={radius - 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#f1f5f9"
        fontSize="28"
        fontWeight="700"
        fontFamily="'Space Grotesk', sans-serif"
      >
        {score}
      </text>
      <text
        x={radius}
        y={radius + 22}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="10"
        fontFamily="'DM Sans', sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}

function ProviderBar({
  provider,
  percentage,
}: {
  provider: ProviderType;
  percentage: number;
}) {
  const color = PROVIDER_COLORS[provider];
  return (
    <div className="flex items-center gap-2 w-full">
      <span
        className="text-xs font-semibold w-10 shrink-0"
        style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {provider}
      </span>
      <div
        className="flex-1 h-1.5 rounded-full"
        style={{ backgroundColor: "#2a2d3e" }}
      >
        <div
          className="h-1.5 rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: `0 0 4px ${color}60`,
          }}
        />
      </div>
      <span
        className="text-xs tabular-nums w-10 text-right"
        style={{ color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}
      >
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}

const PROVIDERS: ProviderType[] = ["AWS", "Azure", "GCP"];

export function RiskScoreWidget() {
  const { data: alerts = [], isLoading } = useNormalizedAlerts({
    customer: "default",
    limit: 500,
    // no provider filter — we want all alerts for the global score
  });

  if (isLoading) {
    return (
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "#1a1d27",
          border: "1px solid #2a2d3e",
        }}
        data-ocid="risk_score.card"
      >
        <div className="flex flex-col items-center gap-4">
          <Skeleton
            className="w-36 h-36 rounded-full"
            style={{ background: "#2a2d3e" }}
          />
          <Skeleton
            className="w-28 h-4 rounded"
            style={{ background: "#2a2d3e" }}
          />
          <div className="w-full space-y-2">
            {PROVIDERS.map((p) => (
              <Skeleton
                key={p}
                className="w-full h-3 rounded"
                style={{ background: "#2a2d3e" }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalAlerts = alerts.length;
  const totalWeightedPoints = alerts.reduce(
    (sum, a) => sum + computeWeight(a.severity),
    0,
  );
  const maxPossiblePoints = totalAlerts * 4;
  const rawScore =
    maxPossiblePoints > 0 ? (totalWeightedPoints / maxPossiblePoints) * 100 : 0;
  const score = Math.min(100, Math.round(rawScore));

  const providerWeights: Record<ProviderType, number> = {
    AWS: 0,
    Azure: 0,
    GCP: 0,
  };
  for (const alert of alerts) {
    if (alert.provider in providerWeights) {
      providerWeights[alert.provider] += computeWeight(alert.severity);
    }
  }

  const providerContributions: Record<ProviderType, number> = {
    AWS:
      totalWeightedPoints > 0
        ? (providerWeights.AWS / totalWeightedPoints) * 100
        : 0,
    Azure:
      totalWeightedPoints > 0
        ? (providerWeights.Azure / totalWeightedPoints) * 100
        : 0,
    GCP:
      totalWeightedPoints > 0
        ? (providerWeights.GCP / totalWeightedPoints) * 100
        : 0,
  };

  const { label, color } = getRiskZone(score);

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "#1a1d27",
        border: "1px solid #2a2d3e",
      }}
      data-ocid="risk_score.card"
    >
      {/* Header */}
      <h2
        className="text-sm font-semibold mb-4 tracking-wide uppercase"
        style={{ color: "#94a3b8", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Global Risk Score
      </h2>

      {/* Gauge */}
      <div
        className="flex flex-col items-center gap-1"
        data-ocid="risk_score.gauge"
      >
        <RiskGauge score={score} color={color} />
        {/* Zone label */}
        <span
          className="text-sm font-bold mt-1 tracking-wide"
          style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {label}
        </span>
        <span className="text-xs mt-0.5" style={{ color: "#64748b" }}>
          {totalAlerts === 0
            ? "No active alerts"
            : `${totalAlerts} active alert${totalAlerts !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Divider */}
      <div className="my-4" style={{ borderTop: "1px solid #2a2d3e" }} />

      {/* Per-provider breakdown */}
      <div className="space-y-3" data-ocid="risk_score.provider_breakdown">
        <p
          className="text-xs uppercase tracking-wider font-medium mb-2"
          style={{
            color: "#64748b",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Provider Contribution
        </p>
        {PROVIDERS.map((p) => (
          <ProviderBar
            key={p}
            provider={p}
            percentage={providerContributions[p]}
          />
        ))}
      </div>
    </div>
  );
}
