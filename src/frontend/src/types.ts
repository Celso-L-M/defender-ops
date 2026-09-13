// Mirror of backend types for frontend use
// Playbook types
export interface PlaybookResult {
  success: boolean;
  message: string;
  dryRunPreview: string | null;
  rawApiError: string | null;
  provider: string | null;
}

export interface BlockIpRequest {
  ip: string;
  providers: ProviderType[];
  dryRun: boolean;
  customer: string;
}

export interface IsolateResourceRequest {
  resourceId: string;
  provider: ProviderType;
  dryRun: boolean;
  customer: string;
}

export interface RevokeIamRequest {
  userId: string;
  provider: ProviderType;
  dryRun: boolean;
  customer: string;
}

export interface DisableAzureAdRequest {
  userPrincipalName: string;
  dryRun: boolean;
  customer: string;
}

export interface ForceGcpIamReviewRequest {
  projectId: string;
  dryRun: boolean;
  customer: string;
}

export interface EscalateToIncidentRequest {
  alertId: string;
  severity: Severity;
  assignedOwner: string;
  notes: string;
  customer: string;
  dryRun: boolean;
}

// Enrichment types
export interface AlertEnrichment {
  mitreDetail?: {
    tacticName: string;
    techniqueName: string;
    description: string;
    mitigations: string;
  } | null;
  ipReputation?: {
    abuseScore: number;
    country: string;
    isp: string;
    totalReports: number;
    lastReported: string;
  } | null;
  domainRep?: {
    maliciousVotes: number;
    suspiciousVotes: number;
    cleanVotes: number;
    lastAnalysisDate: string;
  } | null;
  knownMaliciousIp: boolean;
  enrichedAt?: string | null;
}

// Report types
export interface GeneratedReport {
  reportId: string;
  reportType: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  providerScope: string[];
  format: string;
  generatedAt: string;
  generatedBy: string;
  customer: string;
  csvData?: string;
}

export interface GenerateReportRequest {
  customer: string;
  providerScope: string[];
  dateRangeStart: string;
  dateRangeEnd: string;
  reportType: string;
}

export interface ReportEmailConfig {
  reportType: string;
  recipients: string[];
}

export type ProviderType = "AWS" | "Azure" | "GCP";

// Per-provider access control — mirrors backend UserAssignmentView
export interface UserAssignmentView {
  principal: string;
  providers: ProviderType[];
}

// Webhook secret status — booleans only, never the secret value
export interface WebhookSecretStatus {
  awsSet: boolean;
  azureSet: boolean;
  gcpSet: boolean;
}
export type Severity = "Low" | "Medium" | "High" | "Critical" | "Unknown";
export type PollingInterval =
  | "FiveMin"
  | "FifteenMin"
  | "ThirtyMin"
  | "OneHour";
export type PollingStatus = "Active" | "Inactive" | "Error" | "AuthPaused";

export type CredentialHealth =
  | { __kind__: "Valid" }
  | { __kind__: "Authenticating" }
  | { __kind__: "ExpiringSoon"; _0: string }
  | { __kind__: "Expired" }
  | { __kind__: "Error"; _0: string };

export interface CredentialHealthStatus {
  provider: string;
  health: CredentialHealth;
  expiryNs: bigint | null;
}

export interface ProviderPollingState {
  provider: ProviderType;
  status: PollingStatus;
  interval: PollingInterval;
  lastSuccessfulPoll?: bigint;
  lastPollAttempt?: bigint;
  findingsToday: bigint;
  lastError?: string;
  consecutiveFailures: bigint;
}

export interface RawFinding {
  id: string;
  findingId: string;
  provider: ProviderType;
  title: string;
  description: string;
  severity: Severity;
  timestamp: bigint;
  region?: string;
  accountId?: string;
  rawMetadata: string;
}

export interface IngestionStats {
  providerStates: ProviderPollingState[];
  activeProviders: bigint;
  totalFindingsToday: bigint;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
}

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "inactive";

export type AssetType =
  | "EC2"
  | "S3"
  | "RDS"
  | "Lambda"
  | "AzureVM"
  | "AzureStorage"
  | "AzureDatabase"
  | "GCPCompute"
  | "GCPStorage"
  | "GCPCloudSQL"
  | "Other";

export interface Asset {
  id: string;
  name: string;
  provider: ProviderType;
  assetType: AssetType;
  region: string;
  accountId: string;
  customer: string;
  tags: [string, string][];
  riskScore: bigint;
  openFindings: bigint;
  lastSeen: bigint;
}

export type AlertStatus = "Open" | "InProgress" | "Resolved";
export type IncidentStatus = "Open" | "Investigating" | "Resolved";

export interface CorrelatedIncident {
  incidentId: string;
  incidentType: string;
  severity: Severity;
  status: IncidentStatus;
  sourceAlerts: string[];
  sourceProviders: string[];
  sourceIp?: string;
  affectedResources: string[];
  timeDeltaMinutes: number;
  correlationWindowMinutes: bigint;
  detectedAt: bigint;
  assignedOwner?: string;
  notes?: string;
  customer: string;
}

export interface CorrelationStats {
  totalToday: bigint;
  totalThisWeek: bigint;
  totalAllTime: bigint;
  byType: [string, bigint][];
}

export type NotificationChannel = "InApp" | "Email" | "TeamsWebhook";
export type NotificationStatus = "Sent" | "Failed" | "Acknowledged";
export type RuleSeverityThreshold =
  | "AnyCritical"
  | "AnyHigh"
  | "AnyMedium"
  | "AnyLow"
  | "CriticalOrHigh"
  | "All";

export interface AlertRule {
  id: string;
  name: string;
  customer: string;
  enabled: boolean;
  severityThreshold?: RuleSeverityThreshold;
  findingType?: string;
  assetId?: string;
  provider?: ProviderType;
  region?: string;
  channels: NotificationChannel[];
  cooldownMinutes: bigint;
  escalationMinutes?: bigint;
  escalationRecipient?: string;
}

export interface NotificationLog {
  id: string;
  ruleId: string;
  alertId: string;
  customer: string;
  channel: NotificationChannel;
  recipient: string;
  status: NotificationStatus;
  acknowledged: boolean;
  acknowledgedAt?: bigint;
  timestamp: bigint;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  details: string;
  customer: string;
  timestamp: bigint;
}

export interface MitreTag {
  tactic: string;
  technique: string;
  techniqueId: string;
}

export interface NormalizedAlert {
  id: string;
  findingId: string;
  provider: ProviderType;
  title: string;
  description: string;
  severity: Severity;
  originalSeverity: string;
  status: AlertStatus;
  assetId?: string;
  assetType?: string;
  accountId?: string;
  region?: string;
  customer: string;
  owner?: string;
  rawFindingId: string;
  mitre?: MitreTag;
  timestamp: bigint;
  recurrenceCount?: bigint;
  ingestionSource?: string;
  enrichment?: AlertEnrichment | null;
}

export interface PipelineHealthStats {
  provider: string;
  webhookEventsToday: bigint;
  pollEventsToday: bigint;
  normalizationSuccessRate: number;
  failedIngestionCount: bigint;
  avgLatencyMs: number;
}

export interface FailedIngestion {
  id: string;
  provider: string;
  errorType: string;
  rawPayload: string;
  timestamp: bigint;
  errorMessage: string;
  status: string;
}

export type ComplianceFramework =
  | "NISTCSF"
  | "CISAws"
  | "CISAzure"
  | "CISGCP"
  | "ISO27001"
  | "SOC2";

export type ControlStatus = "Passing" | "Failing" | "NoCoverage";

export interface ComplianceControl {
  controlId: string;
  framework: ComplianceFramework;
  title: string;
  description: string;
  remediationGuidance: string;
  status: ControlStatus;
  passingFindings: bigint;
  failingFindings: bigint;
  provider?: ProviderType;
}

export type TimelineEventType =
  | "alert"
  | "asset"
  | "compliance"
  | "notification";

export interface TimelineEvent {
  id: string;
  eventType: string;
  title: string;
  description: string;
  timestamp: bigint;
  provider?: ProviderType;
  severity?: Severity;
  customer?: string;
}

export type SearchSourceModule = string;

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  sourceModule: string;
  provider?: ProviderType;
  severity?: Severity;
  timestamp?: bigint;
  customer?: string;
}

export interface ComplianceTrendEntry {
  framework: ComplianceFramework;
  weekTimestamp: bigint;
  score: bigint;
  totalControls: bigint;
  passingControls: bigint;
}

export interface ComplianceScore {
  controls: ComplianceControl[];
  score: bigint;
  total: bigint;
  passing: bigint;
  failing: bigint;
}
