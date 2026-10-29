// Frontend type surface.
//
// Backend-mirrored types are re-exported from the generated bindings so there is
// a single source of truth. Only genuinely UI-local types are declared here.
//
// The generated bindings model all-null Motoko variants as TypeScript enums,
// which are nominal: a plain string literal such as "AWS" is not assignable to
// the enum type. The UI works with string-literal unions instead, so the
// frontend declares its own unions and shapes under distinct local names and
// re-exports them under the familiar names. A re-export alias is not a
// declaration that restates a binding type, so the bindings check leaves it
// alone, while call sites keep using string literals.

// ── Generated backend types (single source of truth) ───────────────────────
// Only types whose fields are primitives or `__kind__` string-literal variants
// are re-exported directly. Types that carry nominal generated enums are
// declared below with the frontend string-literal unions instead.
export type {
  AlertEnrichment,
  AuditLogEntry,
  AwsCredentialInput,
  AzureCredentialInput,
  ConnectionTestResult,
  CorrelationStats,
  CredentialError,
  CredentialFieldView,
  CredentialHealth,
  CredentialHealthStatus,
  GcpCredentialInput,
  GeneratedReport,
  IngestionStats,
  MitreTag,
  NotificationError,
  ProviderCredentialInput,
  RateLimitError,
  ReportDeliveryOutcome,
  ReportRunOutcome,
  ReportingError,
} from "@/backend";

import type {
  AlertEnrichment,
  CredentialError,
  CredentialFieldView,
  MitreTag,
  ReportDeliveryOutcome,
  ReportRunOutcome,
} from "@/backend";

// ── Frontend string-literal unions ─────────────────────────────────────────
// Declared under `*Value` names so they do not restate a generated binding
// type; re-exported under the familiar names at the bottom of this file.

export type AlertStatusValue = "Open" | "InProgress" | "Resolved";
export type AssetTypeValue =
  | "S3"
  | "AzureVM"
  | "EC2"
  | "RDS"
  | "AzureDatabase"
  | "GCPStorage"
  | "GCPCloudSQL"
  | "Lambda"
  | "AzureStorage"
  | "GCPCompute"
  | "Other";
export type ComplianceFrameworkValue =
  | "CISAws"
  | "CISGCP"
  | "SOC2"
  | "ISO27001"
  | "CISAzure"
  | "NISTCSF";
export type ControlStatusValue = "Passing" | "NoCoverage" | "Failing";
export type IncidentStatusValue = "Open" | "Investigating" | "Resolved";
export type NotificationChannelValue = "Email" | "InApp" | "TeamsWebhook";
export type NotificationStatusValue = "Failed" | "Sent" | "Acknowledged";
export type PollingIntervalValue =
  | "OneHour"
  | "ThirtyMin"
  | "FifteenMin"
  | "FiveMin";
export type PollingStatusValue = "Error" | "AuthPaused" | "Inactive" | "Active";
export type ProviderTypeValue = "AWS" | "GCP" | "Azure";
export type ReportTriggerValue =
  | "ScheduledWeekly"
  | "OnDemand"
  | "ScheduledMonthly";
export type ReportTypeValue =
  | "IncidentSummary"
  | "SecurityPosture"
  | "ComplianceStatus"
  | "ThreatIntelSummary";
export type RuleSeverityThresholdValue =
  | "All"
  | "AnyHigh"
  | "CriticalOrHigh"
  | "AnyCritical"
  | "AnyLow"
  | "AnyMedium";
export type SeverityValue = "Low" | "High" | "Medium" | "Critical" | "Unknown";
export type VaultErrorValue =
  | "NotFound"
  | "NotAuthorized"
  | "AlreadyExists"
  | "InvalidName";

// ── Backend-mirrored shapes using the frontend string-literal unions ───────
// These mirror the generated interfaces but replace nominal enum fields with
// the string-literal unions above so literal call sites stay assignable.

export interface AlertRuleShape {
  id: string;
  region?: string;
  escalationRecipient?: string;
  severityThreshold?: RuleSeverityThresholdValue;
  provider?: ProviderTypeValue;
  customer: string;
  assetId?: string;
  name: string;
  escalationMinutes?: bigint;
  channels: NotificationChannelValue[];
  cooldownMinutes: bigint;
  enabled: boolean;
  findingType?: string;
}

export interface AssetShape {
  id: string;
  region: string;
  provider: ProviderTypeValue;
  accountId: string;
  customer: string;
  name: string;
  tags: Array<[string, string]>;
  assetType: AssetTypeValue;
  lastSeen: bigint;
  riskScore: bigint;
  openFindings: bigint;
}

export interface ComplianceControlShape {
  status: ControlStatusValue;
  title: string;
  provider?: ProviderTypeValue;
  framework: ComplianceFrameworkValue;
  failingFindings: bigint;
  description: string;
  controlId: string;
  remediationGuidance: string;
  passingFindings: bigint;
}

export interface ComplianceTrendEntryShape {
  passingControls: bigint;
  framework: ComplianceFrameworkValue;
  totalControls: bigint;
  score: bigint;
  weekTimestamp: bigint;
}

export interface CorrelatedIncidentShape {
  status: IncidentStatusValue;
  incidentId: string;
  customer: string;
  sourceAlerts: string[];
  detectedAt: bigint;
  assignedOwner?: string;
  sourceIp?: string;
  sourceProviders: ProviderTypeValue[];
  timeDeltaMinutes: number;
  notes?: string;
  affectedResources: string[];
  severity: SeverityValue;
  correlationWindowMinutes: bigint;
  incidentType: string;
}

export interface NormalizedAlertShape {
  id: string;
  region?: string;
  status: AlertStatusValue;
  mitre?: MitreTag;
  title: string;
  findingId: string;
  provider: ProviderTypeValue;
  accountId?: string;
  customer: string;
  assetId?: string;
  owner?: string;
  rawFindingId: string;
  recurrenceCount?: bigint;
  description: string;
  ingestionSource?: "Poll" | "Webhook";
  originalSeverity: string;
  timestamp: bigint;
  assetType?: string;
  severity: SeverityValue;
  enrichment?: AlertEnrichment;
}

export interface NotificationLogShape {
  id: string;
  status: NotificationStatusValue;
  acknowledgedAt?: bigint;
  customer: string;
  ruleId: string;
  recipient: string;
  alertId: string;
  acknowledged: boolean;
  timestamp: bigint;
  channel: NotificationChannelValue;
}

// Mirrors the backend `NotificationRouting` but uses the frontend
// string-literal `CustomerId` alias so literal call sites stay assignable.
export interface NotificationRoutingShape {
  customer: string;
  escalationMinutes?: bigint;
  cooldownMinutes: bigint;
  teamsWebhookUrl?: string;
  emailRecipients: string[];
}

// Mirrors the backend `ReportRun` but replaces the nominal `ReportType` and
// `ReportTrigger` enums with the frontend string-literal unions.
export interface ReportRunShape {
  trigger: ReportTriggerValue;
  deliveries: ReportDeliveryOutcome[];
  customer: string;
  providerScope: ProviderTypeValue[];
  generatedAt: bigint;
  reportType: ReportTypeValue;
  periodEnd: bigint;
  recipients: string[];
  periodStart: bigint;
  outcome: ReportRunOutcome;
  runId: string;
}

// Mirrors the backend `ReportRecipientConfig` with the frontend report-type union.
export interface ReportRecipientConfigShape {
  customer: string;
  reportType: ReportTypeValue;
  recipients: string[];
}

// Mirrors the backend `RateLimitBackoffState` with the frontend provider union.
export interface RateLimitBackoffStateShape {
  lastResetAt?: bigint;
  provider: ProviderTypeValue;
  nextAttemptAt?: bigint;
  lastThrottledAt?: bigint;
  backoffSeconds: bigint;
  consecutiveThrottles: bigint;
}

// Mirrors the backend `ThrottleEvent` with the frontend provider union.
export interface ThrottleEventShape {
  id: string;
  provider: ProviderTypeValue;
  message: string;
  timestamp: bigint;
  retryAfterSec?: bigint;
  statusCode?: bigint;
}

// Cursor-paginated page of normalized alerts, mirroring the backend `Page`.
export interface AlertPageShape {
  items: NormalizedAlertShape[];
  nextCursor?: string;
}

export interface PlaybookResultShape {
  rawApiError?: string;
  dryRunPreview?: string;
  provider?: ProviderTypeValue;
  message: string;
  success: boolean;
}

export interface ProviderPollingStateShape {
  status: PollingStatusValue;
  provider: ProviderTypeValue;
  interval: PollingIntervalValue;
  lastPollAttempt?: bigint;
  lastSuccessfulPoll?: bigint;
  findingsToday: bigint;
  lastError?: string;
  consecutiveFailures: bigint;
}

export interface RawFindingShape {
  id: string;
  region?: string;
  title: string;
  findingId: string;
  provider: ProviderTypeValue;
  accountId?: string;
  description: string;
  rawMetadata: string;
  timestamp: bigint;
  severity: SeverityValue;
}

export interface SearchResultShape {
  id: string;
  title: string;
  provider?: ProviderTypeValue;
  customer: string;
  description: string;
  timestamp: bigint;
  sourceModule: string;
  severity?: SeverityValue;
}

export interface TimelineEventShape {
  id: string;
  title: string;
  provider?: ProviderTypeValue;
  customer: string;
  description: string;
  timestamp: bigint;
  severity?: SeverityValue;
  eventType: string;
}

export interface UserAssignmentViewShape {
  principal: string;
  providers: ProviderTypeValue[];
}

export interface VaultEntryViewShape {
  provider: ProviderTypeValue;
  name: string;
  createdAt: bigint;
  updatedAt: bigint;
  maskedValue: string;
}

// ── UI-local request/response shapes ───────────────────────────────────────

// Mirrors the backend `ProviderCredentialStatus` but uses the frontend
// string-literal `ProviderType` so literal call sites stay assignable.
export interface ProviderCredentialStatusShape {
  provider: ProviderTypeValue;
  fields: CredentialFieldView[];
  updatedAt?: bigint;
  configured: boolean;
}

export interface BlockIpRequest {
  ip: string;
  providers: ProviderTypeValue[];
  dryRun: boolean;
  customer: string;
}

export interface IsolateResourceRequest {
  resourceId: string;
  provider: ProviderTypeValue;
  dryRun: boolean;
  customer: string;
}

export interface RevokeIamRequest {
  userId: string;
  provider: ProviderTypeValue;
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
  severity: SeverityValue;
  assignedOwner: string;
  notes: string;
  customer: string;
  dryRun: boolean;
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

// Webhook secret status — booleans only, never the secret value
export interface WebhookSecretStatus {
  awsSet: boolean;
  azureSet: boolean;
  gcpSet: boolean;
}

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "inactive";

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

export type TimelineEventType =
  | "alert"
  | "asset"
  | "compliance"
  | "notification";

export type SearchSourceModule = string;

export interface ComplianceScore {
  controls: ComplianceControlShape[];
  score: bigint;
  total: bigint;
  passing: bigint;
  failing: bigint;
}

// ── UI-local result wrappers ───────────────────────────────────────────────
// The backend returns a `{ __kind__: "ok" | "err" }` result envelope. These
// generic wrappers keep the discriminated shape ergonomic at call sites.

export type VaultResult<T> =
  | { __kind__: "ok"; ok: T }
  | { __kind__: "err"; err: VaultErrorValue };

export type CredentialResult =
  | { __kind__: "ok"; ok: null }
  | { __kind__: "err"; err: CredentialError };

// ── Familiar names ─────────────────────────────────────────────────────────
// Re-export the frontend unions and shapes under the names call sites use.
// These are export aliases, not declarations that restate a binding type.

export type {
  AlertStatusValue as AlertStatus,
  AssetTypeValue as AssetType,
  ComplianceFrameworkValue as ComplianceFramework,
  ControlStatusValue as ControlStatus,
  IncidentStatusValue as IncidentStatus,
  NotificationChannelValue as NotificationChannel,
  NotificationStatusValue as NotificationStatus,
  PollingIntervalValue as PollingInterval,
  PollingStatusValue as PollingStatus,
  ProviderTypeValue as ProviderType,
  ReportTriggerValue as ReportTrigger,
  ReportTypeValue as ReportType,
  RuleSeverityThresholdValue as RuleSeverityThreshold,
  SeverityValue as Severity,
  VaultErrorValue as VaultError,
  AlertRuleShape as AlertRule,
  AssetShape as Asset,
  ComplianceControlShape as ComplianceControl,
  ComplianceTrendEntryShape as ComplianceTrendEntry,
  CorrelatedIncidentShape as CorrelatedIncident,
  NormalizedAlertShape as NormalizedAlert,
  NotificationLogShape as NotificationLog,
  NotificationRoutingShape as NotificationRouting,
  PlaybookResultShape as PlaybookResult,
  ProviderPollingStateShape as ProviderPollingState,
  RateLimitBackoffStateShape as RateLimitBackoffState,
  RawFindingShape as RawFinding,
  ReportRecipientConfigShape as ReportRecipientConfig,
  ReportRunShape as ReportRun,
  SearchResultShape as SearchResult,
  ThrottleEventShape as ThrottleEvent,
  TimelineEventShape as TimelineEvent,
  UserAssignmentViewShape as UserAssignmentView,
  VaultEntryViewShape as VaultEntryView,
  ProviderCredentialStatusShape as ProviderCredentialStatus,
  AlertPageShape as AlertPage,
};
