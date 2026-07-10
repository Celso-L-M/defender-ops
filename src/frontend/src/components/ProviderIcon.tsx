import { Cloud, Server, Shield } from "lucide-react";
import type { ProviderType } from "../types";

interface Props {
  provider: ProviderType;
  className?: string;
  showLabel?: boolean;
}

const iconMap: Record<ProviderType, React.ElementType> = {
  AWS: Shield,
  Azure: Cloud,
  GCP: Server,
};

const colorMap: Record<ProviderType, string> = {
  AWS: "text-amber-400",
  Azure: "text-blue-400",
  GCP: "text-green-400",
};

export function ProviderIcon({
  provider,
  className = "",
  showLabel = true,
}: Props) {
  const Icon = iconMap[provider];
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Icon size={14} className={colorMap[provider]} />
      {showLabel && (
        <span className="font-mono text-xs font-semibold tracking-wide">
          {provider}
        </span>
      )}
    </span>
  );
}
