import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Database,
  Search,
  Server,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ProviderIcon } from "../components/ProviderIcon";
import { useAssets } from "../hooks/use-backend";
import type { Asset, AssetType, ProviderType } from "../types";

type SortKey = keyof Pick<
  Asset,
  | "name"
  | "provider"
  | "assetType"
  | "region"
  | "riskScore"
  | "openFindings"
  | "lastSeen"
>;
type SortDir = "asc" | "desc";
type RiskBand = "All" | "Low" | "Medium" | "High";

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
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

function riskColor(score: number): string {
  if (score >= 31) return "text-destructive font-bold tabular-nums";
  if (score >= 11) return "text-warning font-semibold tabular-nums";
  return "text-success font-semibold tabular-nums";
}

function SortIcon({
  col,
  active,
  dir,
}: { col: string; active: string; dir: SortDir }) {
  if (active !== col)
    return <ArrowUpDown size={12} className="ml-1 text-muted-foreground" />;
  return dir === "asc" ? (
    <ChevronUp size={12} className="ml-1 text-primary" />
  ) : (
    <ChevronDown size={12} className="ml-1 text-primary" />
  );
}

export default function AssetsPage() {
  const navigate = useNavigate();
  const { data: assets = [], isLoading } = useAssets("", 500);

  const [search, setSearch] = useState("");
  const [filterProvider, setFilterProvider] = useState<ProviderType | "All">(
    "All",
  );
  const [filterType, setFilterType] = useState<AssetType | "All">("All");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterRisk, setFilterRisk] = useState<RiskBand>("All");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return assets
      .filter((a) => {
        if (
          q &&
          !a.name.toLowerCase().includes(q) &&
          !a.id.toLowerCase().includes(q)
        )
          return false;
        if (filterProvider !== "All" && a.provider !== filterProvider)
          return false;
        if (filterType !== "All" && a.assetType !== filterType) return false;
        if (
          filterRegion &&
          !a.region.toLowerCase().includes(filterRegion.toLowerCase())
        )
          return false;
        const score = Number(a.riskScore);
        if (filterRisk === "Low" && score > 10) return false;
        if (filterRisk === "Medium" && (score < 11 || score > 30)) return false;
        if (filterRisk === "High" && score < 31) return false;
        return true;
      })
      .sort((a, b) => {
        let av: string | number = 0;
        let bv: string | number = 0;
        if (
          sortKey === "riskScore" ||
          sortKey === "openFindings" ||
          sortKey === "lastSeen"
        ) {
          av = Number(a[sortKey]);
          bv = Number(b[sortKey]);
        } else {
          av = String(a[sortKey]).toLowerCase();
          bv = String(b[sortKey]).toLowerCase();
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    assets,
    search,
    filterProvider,
    filterType,
    filterRegion,
    filterRisk,
    sortKey,
    sortDir,
  ]);

  function SortTh({ label, col }: { label: string; col: SortKey }) {
    return (
      <TableHead
        className="cursor-pointer select-none hover:text-foreground whitespace-nowrap"
        onClick={() => handleSort(col)}
      >
        <span className="inline-flex items-center">
          {label}
          <SortIcon col={col} active={sortKey} dir={sortDir} />
        </span>
      </TableHead>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
              <Server size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-foreground tracking-tight">
                Asset Inventory
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                {isLoading
                  ? "Loading…"
                  : `${filtered.length} of ${assets.length} assets`}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="font-mono text-xs border-border text-muted-foreground"
          >
            <Database size={11} className="mr-1" />
            {assets.length} total
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card/50 border-b border-border px-6 py-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              data-ocid="assets.search_input"
              placeholder="Search by name or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm bg-background border-border"
            />
          </div>
          <Select
            value={filterProvider}
            onValueChange={(v) => setFilterProvider(v as ProviderType | "All")}
          >
            <SelectTrigger
              data-ocid="assets.provider.select"
              className="h-8 w-[120px] text-sm bg-background border-border"
            >
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Providers</SelectItem>
              <SelectItem value="AWS">AWS</SelectItem>
              <SelectItem value="Azure">Azure</SelectItem>
              <SelectItem value="GCP">GCP</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as AssetType | "All")}
          >
            <SelectTrigger
              data-ocid="assets.type.select"
              className="h-8 w-[150px] text-sm bg-background border-border"
            >
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {(Object.keys(ASSET_TYPE_LABELS) as AssetType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {ASSET_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            data-ocid="assets.region_input"
            placeholder="Region filter…"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="h-8 w-[150px] text-sm bg-background border-border"
          />
          <Select
            value={filterRisk}
            onValueChange={(v) => setFilterRisk(v as RiskBand)}
          >
            <SelectTrigger
              data-ocid="assets.risk.select"
              className="h-8 w-[130px] text-sm bg-background border-border"
            >
              <SelectValue placeholder="Risk Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Risk</SelectItem>
              <SelectItem value="Low">Low (0–10)</SelectItem>
              <SelectItem value="Medium">Medium (11–30)</SelectItem>
              <SelectItem value="High">High (31+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 px-6 py-4">
        {isLoading ? (
          <div
            data-ocid="assets.loading_state"
            className="flex items-center justify-center h-64"
          >
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm font-mono">Loading assets…</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="assets.empty_state"
            className="flex flex-col items-center justify-center h-64 gap-4"
          >
            <div className="p-4 rounded-full bg-muted/30 border border-border">
              <Server size={32} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-semibold">No assets found</p>
              <p className="text-muted-foreground text-sm mt-1">
                {assets.length === 0
                  ? "No assets have been ingested yet. Configure cloud provider credentials to begin discovery."
                  : "No assets match your current filters."}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 hover:bg-muted/20 border-border">
                  <SortTh label="Asset Name" col="name" />
                  <SortTh label="Provider" col="provider" />
                  <SortTh label="Type" col="assetType" />
                  <SortTh label="Region" col="region" />
                  <SortTh label="Risk Score" col="riskScore" />
                  <SortTh label="Open Findings" col="openFindings" />
                  <SortTh label="Last Seen" col="lastSeen" />
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((asset, idx) => (
                  <TableRow
                    key={asset.id}
                    data-ocid={`assets.item.${idx + 1}`}
                    className="border-border hover:bg-muted/10 transition-colors"
                  >
                    <TableCell className="font-mono text-xs font-medium text-foreground max-w-[200px]">
                      <span className="truncate block" title={asset.name}>
                        {asset.name}
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        {asset.id.slice(0, 16)}…
                      </span>
                    </TableCell>
                    <TableCell>
                      <ProviderIcon provider={asset.provider} showLabel />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono text-xs border-border text-muted-foreground"
                      >
                        {ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {asset.region}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-mono text-sm ${riskColor(Number(asset.riskScore))}`}
                      >
                        {Number(asset.riskScore)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {Number(asset.openFindings) > 0 ? (
                        <Badge className="font-mono text-xs bg-destructive/20 text-destructive border-destructive/40">
                          {Number(asset.openFindings)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">
                          0
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {formatDistanceToNow(
                        new Date(Number(asset.lastSeen) / 1_000_000),
                        { addSuffix: true },
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        data-ocid={`assets.details_button.${idx + 1}`}
                        className="h-7 text-xs border-border hover:bg-muted/20 font-mono"
                        onClick={() => navigate({ to: `/assets/${asset.id}` })}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
