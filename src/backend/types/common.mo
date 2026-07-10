module {

  /// Which cloud provider a finding originates from
  public type ProviderType = {
    #AWS;
    #Azure;
    #GCP;
  };

  /// Severity classification of a security finding
  public type Severity = {
    #Low;
    #Medium;
    #High;
    #Critical;
    #Unknown;
  };

  /// Raw, un-normalised finding as pulled from a cloud provider
  public type RawFinding = {
    id : Text;
    provider : ProviderType;
    findingId : Text;
    timestamp : Int;
    severity : Severity;
    title : Text;
    description : Text;
    region : ?Text;
    accountId : ?Text;
    rawMetadata : Text;
  };

  /// Configurable polling cadence per provider
  public type PollingInterval = {
    #FiveMin;
    #FifteenMin;
    #ThirtyMin;
    #OneHour;
  };

  /// Current operational status of a provider's polling job
  public type PollingStatus = {
    #Active;
    #Inactive;
    #Error;
    #AuthPaused;
  };

  /// Per-provider polling state tracked in the canister
  public type ProviderPollingState = {
    provider : ProviderType;
    status : PollingStatus;
    lastSuccessfulPoll : ?Int;
    lastPollAttempt : ?Int;
    findingsToday : Nat;
    consecutiveFailures : Nat;
    lastError : ?Text;
    interval : PollingInterval;
  };

  /// AWS credentials stored securely in the canister (Role ARN-based, least-privilege)
  public type AwsCredentials = {
    roleArn : Text;
    externalId : ?Text;
    regions : [Text];
  };

  /// Short-lived AWS STS session token (in-memory only, never stored in stable memory)
  public type AwsSessionToken = {
    accessKeyId : Text;
    secretAccessKey : Text;
    sessionToken : Text;
    expiryNs : Int;
  };

  /// Generic token cache wrapper
  public type TokenCache<T> = ?{ token : T; expiryNs : Int };

  /// Health status of a cloud provider credential
  public type CredentialHealth = {
    #Valid;
    #Authenticating;
    #ExpiringSoon : Text;
    #Expired;
    #Error : Text;
  };

  /// Per-provider credential health status
  public type CredentialHealthStatus = {
    provider : Text;
    health : CredentialHealth;
    expiryNs : ?Int;
  };

  /// Azure credentials stored securely in the canister
  public type AzureCredentials = {
    clientId : Text;
    clientSecret : Text;
    tenantId : Text;
    subscriptionIds : [Text];
  };

  /// GCP credentials stored securely in the canister
  public type GcpCredentials = {
    serviceAccountJson : Text;
    projectIds : [Text];
  };

  /// Result of a provider connection test
  public type ConnectionTestResult = {
    #Success : Text;
    #Failure : Text;
  };

  /// Aggregated ingestion statistics shown on the dashboard
  public type IngestionStats = {
    totalFindingsToday : Nat;
    activeProviders : Nat;
    providerStates : [ProviderPollingState];
  };

  // ── Module 2 — Alert Normalization ────────────────────────────────────────

  /// Lifecycle status of a normalised alert
  public type AlertStatus = {
    #Open;
    #InProgress;
    #Resolved;
  };

  /// MITRE ATT&CK tactic/technique tag attached to an alert where available
  public type MitreTag = {
    tactic : Text;
    technique : Text;
    techniqueId : Text;
  };

  /// Normalised, deduplicated alert record (common schema across all providers)
  public type NormalizedAlert = {
    id : Text;
    provider : ProviderType;
    findingId : Text;
    originalSeverity : Text;
    severity : Severity;
    title : Text;
    description : Text;
    assetId : ?Text;
    assetType : ?Text;
    accountId : ?Text;
    region : ?Text;
    timestamp : Int;
    status : AlertStatus;
    owner : ?Text;
    customer : Text;
    mitre : ?MitreTag;
    rawFindingId : Text;
    recurrenceCount : Nat;
    ingestionSource : ?{ #Poll; #Webhook };
    enrichment : ?AlertEnrichment;
  };

  // ── Module 3 — Asset Inventory ────────────────────────────────────────────

  /// Canonical asset type across all three cloud providers
  public type AssetType = {
    #EC2;
    #S3;
    #RDS;
    #Lambda;
    #AzureVM;
    #AzureStorage;
    #AzureDatabase;
    #GCPCompute;
    #GCPStorage;
    #GCPCloudSQL;
    #Other;
  };

  /// Unified asset record auto-extracted from ingested findings or direct polling
  public type Asset = {
    id : Text;
    name : Text;
    assetType : AssetType;
    provider : ProviderType;
    accountId : Text;
    region : Text;
    tags : [(Text, Text)];
    riskScore : Nat;
    openFindings : Nat;
    lastSeen : Int;
    customer : Text;
  };

  // ── Module 4 — Compliance ─────────────────────────────────────────────────

  /// Supported compliance frameworks
  public type ComplianceFramework = {
    #NISTCSF;
    #CISAws;
    #CISAzure;
    #CISGCP;
    #ISO27001;
    #SOC2;
  };

  /// Pass/fail/no-coverage status for a single compliance control
  public type ControlStatus = {
    #Passing;
    #Failing;
    #NoCoverage;
  };

  /// A single compliance control with its current finding coverage
  public type ComplianceControl = {
    controlId : Text;
    framework : ComplianceFramework;
    title : Text;
    description : Text;
    remediationGuidance : Text;
    status : ControlStatus;
    passingFindings : Nat;
    failingFindings : Nat;
    provider : ?ProviderType;
  };

  /// Weekly compliance score snapshot for trend tracking
  public type ComplianceTrendEntry = {
    framework : ComplianceFramework;
    weekTimestamp : Int;
    score : Nat;
    totalControls : Nat;
    passingControls : Nat;
  };

  // ── Module 5 — Alerting & Notifications ──────────────────────────────────

  /// Delivery channel for an alert notification
  public type NotificationChannel = {
    #InApp;
    #Email;
    #TeamsWebhook;
  };

  /// Delivery status of a notification attempt
  public type NotificationStatus = {
    #Sent;
    #Failed;
    #Acknowledged;
  };

  /// Severity threshold predicate for an alert rule
  public type RuleSeverityThreshold = {
    #AnyCritical;
    #AnyHigh;
    #AnyMedium;
    #AnyLow;
    #CriticalOrHigh;
    #All;
  };

  /// Admin-defined rule controlling when and how notifications are sent
  public type AlertRule = {
    id : Text;
    name : Text;
    enabled : Bool;
    severityThreshold : ?RuleSeverityThreshold;
    findingType : ?Text;
    assetId : ?Text;
    provider : ?ProviderType;
    region : ?Text;
    channels : [NotificationChannel];
    cooldownMinutes : Nat;
    escalationMinutes : ?Nat;
    escalationRecipient : ?Text;
    customer : Text;
  };

  /// Immutable record of every notification attempt
  public type NotificationLog = {
    id : Text;
    alertId : Text;
    ruleId : Text;
    channel : NotificationChannel;
    recipient : Text;
    timestamp : Int;
    status : NotificationStatus;
    acknowledged : Bool;
    acknowledgedAt : ?Int;
    customer : Text;
  };

  // ── Cross-module types ────────────────────────────────────────────────────

  /// Unified timeline event for the main dashboard activity feed
  public type TimelineEvent = {
    id : Text;
    timestamp : Int;
    eventType : Text;
    title : Text;
    description : Text;
    provider : ?ProviderType;
    severity : ?Severity;
    customer : Text;
  };

  /// Immutable audit log entry for compliance and accountability
  public type AuditLogEntry = {
    id : Text;
    timestamp : Int;
    actorId : Text;
    action : Text;
    details : Text;
    customer : Text;
  };

  /// A single result item returned by global cross-module search
  public type SearchResult = {
    id : Text;
    sourceModule : Text;
    title : Text;
    description : Text;
    provider : ?ProviderType;
    severity : ?Severity;
    customer : Text;
    timestamp : Int;
  };

  // ── Phase 2 — Log Ingestion & Normalization Pipeline ──────────────────

  /// Whether a finding arrived via polling or an inbound webhook
  public type IngestionSource = { #Poll; #Webhook };

  /// A record of a failed ingestion attempt for manual review
  public type FailedIngestion = {
    id           : Text;
    provider     : ProviderType;
    errorType    : Text;
    rawPayload   : Text;
    timestamp    : Int;
    errorMessage : Text;
    status       : Text;   // e.g. "FailedParse" | "FailedNormalization"
  };

  /// Per-provider pipeline health snapshot for the dashboard
  public type PipelineHealthStats = {
    provider                 : ProviderType;
    webhookEventsToday       : Nat;
    pollEventsToday          : Nat;
    normalizationSuccessRate : Float;
    failedIngestionCount     : Nat;
    avgLatencyMs             : Float;
  };

  // ── Phase 3 — Cross-Cloud Correlation Engine ─────────────────────────────

  /// Lifecycle status of a correlated incident
  public type IncidentStatus = {
    #Open;
    #Investigating;
    #Resolved;
  };

  /// A correlated incident record produced by the correlation engine
  public type CorrelatedIncident = {
    incidentId               : Text;
    incidentType             : Text;
    severity                 : Severity;   // always #Critical for cross-cloud patterns
    status                   : IncidentStatus;
    sourceAlerts             : [Text];     // IDs of the original NormalizedAlert records
    sourceProviders          : [ProviderType];
    sourceIp                 : ?Text;
    affectedResources        : [Text];
    timeDeltaMinutes         : Float;
    correlationWindowMinutes : Nat;
    detectedAt               : Int;
    assignedOwner            : ?Text;
    notes                    : ?Text;
    customer                 : Text;
  };

  /// Aggregated correlation statistics for the dashboard panel
  public type CorrelationStats = {
    totalToday    : Nat;
    totalThisWeek : Nat;
    totalAllTime  : Nat;
    byType        : [(Text, Nat)];
  };

  // ── Phase 5 — Remediation Playbooks ──────────────────────────────────────

  /// Result of executing (or dry-running) a remediation playbook
  public type PlaybookResult = {
    success      : Bool;
    message      : Text;
    dryRunPreview : ?Text;
    rawApiError  : ?Text;
    provider     : ?ProviderType;
  };

  // ── Phase 6 — Threat Intelligence Enrichment ─────────────────────────────

  /// MITRE ATT&CK tactic/technique detail fetched from the TAXII server
  public type MitreDetail = {
    tacticName    : Text;
    techniqueName : Text;
    description   : Text;
    mitigations   : Text;
  };

  /// IP reputation data from AbuseIPDB
  public type IpReputation = {
    abuseScore   : Nat;
    country      : Text;
    isp          : Text;
    totalReports : Nat;
    lastReported : Text;
  };

  /// Domain/URL reputation data from VirusTotal
  public type DomainRep = {
    maliciousVotes  : Nat;
    suspiciousVotes : Nat;
    cleanVotes      : Nat;
    lastAnalysisDate : Text;
  };

  /// All enrichment results stored on a normalized alert
  public type AlertEnrichment = {
    mitreDetail      : ?MitreDetail;
    ipReputation     : ?IpReputation;
    domainRep        : ?DomainRep;
    knownMaliciousIp : Bool;
    enrichedAt       : ?Text;
  };

  // ── Phase 7 — Reporting ───────────────────────────────────────────────────

  /// A generated report record stored in the canister
  public type GeneratedReport = {
    reportId       : Text;
    reportType     : Text;
    dateRangeStart : Text;
    dateRangeEnd   : Text;
    providerScope  : [Text];
    format         : Text;
    generatedAt    : Text;
    generatedBy    : Text;
    customer       : Text;
    csvData        : ?Text;
  };

  /// Email recipient config for a report type
  public type ReportEmailConfig = {
    reportType : Text;
    recipients : [Text];
    customer   : Text;
  };
};

