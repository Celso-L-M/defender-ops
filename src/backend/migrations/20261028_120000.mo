import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

/// Migration: AddReportingNotificationsRateLimit
/// OldActor: exactly matches NewActor from 20261028_000000.mo (32 fields).
/// NewActor: adds the stable fields for the reporting, notification-routing and
///   rate-limit domains:
///     - reportRuns              : scheduled/on-demand report run records
///     - reportRecipientConfigs  : per-report-type email recipient config
///     - notificationRoutings    : per-customer Teams webhook / email routing
///     - rateLimitStates         : per-provider backoff state
///     - throttleEvents          : recent per-provider throttling events
///   Every pre-existing stored field is preserved unchanged.
module {

  // ── Inline types (no project imports in migrations) ──────────────────────────

  type ProviderType = { #AWS; #Azure; #GCP };

  type Severity = { #Low; #Medium; #High; #Critical; #Unknown };

  type RawFinding = {
    id          : Text;
    provider    : ProviderType;
    findingId   : Text;
    timestamp   : Int;
    severity    : Severity;
    title       : Text;
    description : Text;
    region      : ?Text;
    accountId   : ?Text;
    rawMetadata : Text;
  };

  type PollingInterval = { #FiveMin; #FifteenMin; #ThirtyMin; #OneHour };

  type PollingStatus = { #Active; #Inactive; #Error; #AuthPaused };

  type ProviderPollingState = {
    provider            : ProviderType;
    status              : PollingStatus;
    lastSuccessfulPoll  : ?Int;
    lastPollAttempt     : ?Int;
    findingsToday       : Nat;
    consecutiveFailures : Nat;
    lastError           : ?Text;
    interval            : PollingInterval;
  };

  type AlertStatus = { #Open; #InProgress; #Resolved };

  type MitreTag = { tactic : Text; technique : Text; techniqueId : Text };

  type AlertEnrichment = {
    mitreDetail      : ?{ tacticName : Text; techniqueName : Text; description : Text; mitigations : Text };
    ipReputation     : ?{ abuseScore : Nat; country : Text; isp : Text; totalReports : Nat; lastReported : Text };
    domainRep        : ?{ maliciousVotes : Nat; suspiciousVotes : Nat; cleanVotes : Nat; lastAnalysisDate : Text };
    knownMaliciousIp : Bool;
    enrichedAt       : ?Text;
  };

  type NormalizedAlert = {
    id               : Text;
    provider         : ProviderType;
    findingId        : Text;
    originalSeverity : Text;
    severity         : Severity;
    title            : Text;
    description      : Text;
    assetId          : ?Text;
    assetType        : ?Text;
    accountId        : ?Text;
    region           : ?Text;
    timestamp        : Int;
    status           : AlertStatus;
    owner            : ?Text;
    customer         : Text;
    mitre            : ?MitreTag;
    rawFindingId     : Text;
    recurrenceCount  : Nat;
    ingestionSource  : ?{ #Poll; #Webhook };
    enrichment       : ?AlertEnrichment;
  };

  type AssetType = {
    #EC2; #S3; #RDS; #Lambda;
    #AzureVM; #AzureStorage; #AzureDatabase;
    #GCPCompute; #GCPStorage; #GCPCloudSQL;
    #Other;
  };

  type Asset = {
    id           : Text;
    name         : Text;
    assetType    : AssetType;
    provider     : ProviderType;
    accountId    : Text;
    region       : Text;
    tags         : [(Text, Text)];
    riskScore    : Nat;
    openFindings : Nat;
    lastSeen     : Int;
    customer     : Text;
  };

  type ComplianceFramework = {
    #NISTCSF; #CISAws; #CISAzure; #CISGCP; #ISO27001; #SOC2;
  };

  type ControlStatus = { #Passing; #Failing; #NoCoverage };

  type ComplianceControl = {
    controlId           : Text;
    framework           : ComplianceFramework;
    title               : Text;
    description         : Text;
    remediationGuidance : Text;
    status              : ControlStatus;
    passingFindings     : Nat;
    failingFindings     : Nat;
    provider            : ?ProviderType;
  };

  type ComplianceTrendEntry = {
    framework       : ComplianceFramework;
    weekTimestamp   : Int;
    score           : Nat;
    totalControls   : Nat;
    passingControls : Nat;
  };

  type NotificationChannel = { #InApp; #Email; #TeamsWebhook };

  type NotificationStatus = { #Sent; #Failed; #Acknowledged };

  type RuleSeverityThreshold = {
    #AnyCritical; #AnyHigh; #AnyMedium; #AnyLow; #CriticalOrHigh; #All;
  };

  type AlertRule = {
    id                  : Text;
    name                : Text;
    enabled             : Bool;
    severityThreshold   : ?RuleSeverityThreshold;
    findingType         : ?Text;
    assetId             : ?Text;
    provider            : ?ProviderType;
    region              : ?Text;
    channels            : [NotificationChannel];
    cooldownMinutes     : Nat;
    escalationMinutes   : ?Nat;
    escalationRecipient : ?Text;
    customer            : Text;
  };

  type NotificationLog = {
    id             : Text;
    alertId        : Text;
    ruleId         : Text;
    channel        : NotificationChannel;
    recipient      : Text;
    timestamp      : Int;
    status         : NotificationStatus;
    acknowledged   : Bool;
    acknowledgedAt : ?Int;
    customer       : Text;
  };

  type TimelineEvent = {
    id          : Text;
    timestamp   : Int;
    eventType   : Text;
    title       : Text;
    description : Text;
    provider    : ?ProviderType;
    severity    : ?Severity;
    customer    : Text;
  };

  type AuditLogEntry = {
    id        : Text;
    timestamp : Int;
    actorId   : Text;
    action    : Text;
    details   : Text;
    customer  : Text;
  };

  type FailedIngestion = {
    id           : Text;
    provider     : ProviderType;
    errorType    : Text;
    rawPayload   : Text;
    timestamp    : Int;
    errorMessage : Text;
    status       : Text;
  };

  type IngestionEvent = {
    provider     : ProviderType;
    source       : { #Poll; #Webhook };
    normalizedOk : Bool;
    latencyMs    : Float;
    timestamp    : Int;
  };

  type IncidentStatus = { #Open; #Investigating; #Resolved };

  type CorrelatedIncident = {
    incidentId               : Text;
    incidentType             : Text;
    severity                 : Severity;
    status                   : IncidentStatus;
    sourceAlerts             : [Text];
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

  type GeneratedReport = {
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

  type ReportEmailConfig = {
    reportType : Text;
    recipients : [Text];
    customer   : Text;
  };

  type VaultEntry = {
    provider    : ProviderType;
    name        : Text;
    ciphertext  : Blob;
    nonce       : Blob;
    createdAt   : Int;
    updatedAt   : Int;
  };

  type VaultState = {
    var entries : Map.Map<(ProviderType, Text), VaultEntry>;
    var key     : ?Blob;
  };

  // ── New domain types (inlined) ───────────────────────────────────────────────

  type ReportType = {
    #SecurityPosture;
    #ComplianceStatus;
    #IncidentSummary;
    #ThreatIntelSummary;
  };

  type ReportTrigger = {
    #ScheduledWeekly;
    #ScheduledMonthly;
    #OnDemand;
  };

  type ReportRunOutcome = {
    #Succeeded;
    #Failed : Text;
  };

  type ReportDeliveryOutcome = {
    recipient : Text;
    success   : Bool;
    error     : ?Text;
    sentAt    : ?Int;
  };

  type ReportRun = {
    runId         : Text;
    reportType    : ReportType;
    trigger       : ReportTrigger;
    periodStart   : Int;
    periodEnd     : Int;
    generatedAt   : Int;
    outcome       : ReportRunOutcome;
    recipients    : [Text];
    providerScope : [ProviderType];
    deliveries    : [ReportDeliveryOutcome];
    customer      : Text;
  };

  type ReportRecipientConfig = {
    reportType : ReportType;
    recipients : [Text];
    customer   : Text;
  };

  type NotificationRouting = {
    customer          : Text;
    teamsWebhookUrl   : ?Text;
    emailRecipients   : [Text];
    cooldownMinutes   : Nat;
    escalationMinutes : ?Nat;
  };

  type RateLimitBackoffState = {
    provider             : ProviderType;
    backoffSeconds       : Nat;
    consecutiveThrottles : Nat;
    nextAttemptAt        : ?Int;
    lastThrottledAt      : ?Int;
    lastResetAt          : ?Int;
  };

  type ThrottleEvent = {
    id            : Text;
    provider      : ProviderType;
    timestamp     : Int;
    retryAfterSec : ?Nat;
    statusCode    : ?Nat;
    message       : Text;
  };

  // ── Migration actor types ──────────────────────────────────────────────────────

  /// OldActor: exactly matches NewActor from 20261028_000000.mo (32 fields).
  type OldActor = {
    var awsPollingState              : ProviderPollingState;
    var azurePollingState            : ProviderPollingState;
    var gcpPollingState              : ProviderPollingState;
    rawFindings                      : List.List<RawFinding>;
    var findingsDayBucket            : Text;
    var normalizedAlerts             : List.List<(Text, NormalizedAlert)>;
    var assets                       : List.List<(Text, Asset)>;
    complianceControls               : List.List<(Text, ComplianceControl)>;
    complianceTrend                  : List.List<ComplianceTrendEntry>;
    var alertRules                   : List.List<(Text, AlertRule)>;
    var notificationLogs             : List.List<(Text, NotificationLog)>;
    timelineEvents                   : List.List<TimelineEvent>;
    auditLog                         : List.List<AuditLogEntry>;
    var lastComplianceSnapshotWeek   : Text;
    var awsAuthError                 : ?Text;
    var azureAuthError               : ?Text;
    var gcpAuthError                 : ?Text;
    failedIngestions                 : List.List<FailedIngestion>;
    pipelineEvents                   : List.List<IngestionEvent>;
    var correlatedIncidents          : [(Text, CorrelatedIncident)];
    var correlationIntervalMinutes   : Nat;
    var lastCorrelationRunNs         : Int;
    var processingOffset             : Nat;
    var dirtyAssets                  : [Text];
    var enrichmentApiKeys            : { abuseIpdbKey : ?Text; virusTotalKey : ?Text };
    var maliciousIpFeed              : [Text];
    var lastMaliciousIpFeedPoll      : ?Int;
    var generatedReports             : [GeneratedReport];
    var reportEmailConfigs           : [ReportEmailConfig];
    var webhookSecrets               : { aws : ?Text; azure : ?Text; gcp : ?Text };
    var providerAssignments          : Map.Map<Principal, [ProviderType]>;
    var vaultState                   : VaultState;
  };

  /// NewActor: adds the reporting, notification-routing and rate-limit stable
  /// fields. Every pre-existing field is preserved unchanged.
  type NewActor = {
    var awsPollingState              : ProviderPollingState;
    var azurePollingState            : ProviderPollingState;
    var gcpPollingState              : ProviderPollingState;
    rawFindings                      : List.List<RawFinding>;
    var findingsDayBucket            : Text;
    var normalizedAlerts             : List.List<(Text, NormalizedAlert)>;
    var assets                       : List.List<(Text, Asset)>;
    complianceControls               : List.List<(Text, ComplianceControl)>;
    complianceTrend                  : List.List<ComplianceTrendEntry>;
    var alertRules                   : List.List<(Text, AlertRule)>;
    var notificationLogs             : List.List<(Text, NotificationLog)>;
    timelineEvents                   : List.List<TimelineEvent>;
    auditLog                         : List.List<AuditLogEntry>;
    var lastComplianceSnapshotWeek   : Text;
    var awsAuthError                 : ?Text;
    var azureAuthError               : ?Text;
    var gcpAuthError                 : ?Text;
    failedIngestions                 : List.List<FailedIngestion>;
    pipelineEvents                   : List.List<IngestionEvent>;
    var correlatedIncidents          : [(Text, CorrelatedIncident)];
    var correlationIntervalMinutes   : Nat;
    var lastCorrelationRunNs         : Int;
    var processingOffset             : Nat;
    var dirtyAssets                  : [Text];
    var enrichmentApiKeys            : { abuseIpdbKey : ?Text; virusTotalKey : ?Text };
    var maliciousIpFeed              : [Text];
    var lastMaliciousIpFeedPoll      : ?Int;
    var generatedReports             : [GeneratedReport];
    var reportEmailConfigs           : [ReportEmailConfig];
    var webhookSecrets               : { aws : ?Text; azure : ?Text; gcp : ?Text };
    var providerAssignments          : Map.Map<Principal, [ProviderType]>;
    var vaultState                   : VaultState;
    // ── New stable fields ──────────────────────────────────────────────────────
    var reportRuns                   : List.List<ReportRun>;
    var reportRecipientConfigs       : List.List<ReportRecipientConfig>;
    var notificationRoutings         : List.List<NotificationRouting>;
    var rateLimitStates              : List.List<RateLimitBackoffState>;
    var throttleEvents               : List.List<ThrottleEvent>;
    // ownerPrincipal: the SYS_ADMIN principal, recorded on the first signed-in
    // caller. The owner is authorized for every provider regardless of
    // per-provider assignment. Null until the first authenticated call.
    var ownerPrincipal               : ?Principal;
  };

  public func migration(old : OldActor) : NewActor {
    {
      var awsPollingState              = old.awsPollingState;
      var azurePollingState            = old.azurePollingState;
      var gcpPollingState              = old.gcpPollingState;
      rawFindings                      = old.rawFindings;
      var findingsDayBucket            = old.findingsDayBucket;
      var normalizedAlerts             = old.normalizedAlerts;
      var assets                       = old.assets;
      complianceControls               = old.complianceControls;
      complianceTrend                  = old.complianceTrend;
      var alertRules                   = old.alertRules;
      var notificationLogs             = old.notificationLogs;
      timelineEvents                   = old.timelineEvents;
      auditLog                         = old.auditLog;
      var lastComplianceSnapshotWeek   = old.lastComplianceSnapshotWeek;
      var awsAuthError                 = old.awsAuthError;
      var azureAuthError               = old.azureAuthError;
      var gcpAuthError                 = old.gcpAuthError;
      failedIngestions                 = old.failedIngestions;
      pipelineEvents                   = old.pipelineEvents;
      var correlatedIncidents          = old.correlatedIncidents;
      var correlationIntervalMinutes   = old.correlationIntervalMinutes;
      var lastCorrelationRunNs         = old.lastCorrelationRunNs;
      var processingOffset             = old.processingOffset;
      var dirtyAssets                  = old.dirtyAssets;
      var enrichmentApiKeys            = old.enrichmentApiKeys;
      var maliciousIpFeed              = old.maliciousIpFeed;
      var lastMaliciousIpFeedPoll      = old.lastMaliciousIpFeedPoll;
      var generatedReports             = old.generatedReports;
      var reportEmailConfigs           = old.reportEmailConfigs;
      var webhookSecrets               = old.webhookSecrets;
      var providerAssignments          = old.providerAssignments;
      var vaultState                   = old.vaultState;
      // New fields start empty; they are populated by the new API surface.
      var reportRuns                   = List.empty();
      var reportRecipientConfigs       = List.empty();
      var notificationRoutings         = List.empty();
      var rateLimitStates              = List.empty();
      var throttleEvents               = List.empty();
      // No owner recorded yet; the first signed-in caller claims ownership.
      var ownerPrincipal               = null;
    };
  };
};
