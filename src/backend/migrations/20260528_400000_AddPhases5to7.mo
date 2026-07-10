import List "mo:core/List";

/// Migration: AddPhases5to7
/// OldActor: exactly matches NewActor from 20260528_300000_AddSecurityRefactor.mo (27 fields).
/// NewActor: adds 5 new stable fields:
///   - enrichmentApiKeys         : {abuseIpdbKey : ?Text; virusTotalKey : ?Text}
///   - maliciousIpFeed           : [Text]
///   - lastMaliciousIpFeedPoll   : ?Int
///   - generatedReports          : [GeneratedReport]
///   - reportEmailConfigs        : [ReportEmailConfig]
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

  type AwsCredentials = {
    roleArn    : Text;
    externalId : ?Text;
    regions    : [Text];
  };

  type AzureCredentials = {
    clientId        : Text;
    clientSecret    : Text;
    tenantId        : Text;
    subscriptionIds : [Text];
  };

  type GcpCredentials = {
    serviceAccountJson : Text;
    projectIds         : [Text];
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

  // OldNormalizedAlert: shape as deployed BEFORE Phase 6 (no enrichment field)
  type OldNormalizedAlert = {
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
  };

  // NormalizedAlert: new shape WITH enrichment field (Phase 6)
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

  // ── Migration actor types ──────────────────────────────────────────────────────

  /// OldActor: exactly matches NewActor from 20260528_300000_AddSecurityRefactor.mo (27 fields).
  /// Uses OldNormalizedAlert (without enrichment) to match the .old/ snapshot.
  type OldActor = {
    var awsCredentials               : ?AwsCredentials;
    var azureCredentials             : ?AzureCredentials;
    var gcpCredentials               : ?GcpCredentials;
    var awsPollingState              : ProviderPollingState;
    var azurePollingState            : ProviderPollingState;
    var gcpPollingState              : ProviderPollingState;
    rawFindings                      : List.List<RawFinding>;
    var findingsDayBucket            : Text;
    var normalizedAlerts             : List.List<(Text, OldNormalizedAlert)>;
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
  };

  /// NewActor: adds 5 new stable fields for Phases 5-7.
  type NewActor = {
    var awsCredentials               : ?AwsCredentials;
    var azureCredentials             : ?AzureCredentials;
    var gcpCredentials               : ?GcpCredentials;
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
  };

  public func migration(old : OldActor) : NewActor {
    // Migrate normalizedAlerts: add enrichment = null to every existing alert
    let migratedAlerts = old.normalizedAlerts.map<(Text, OldNormalizedAlert), (Text, NormalizedAlert)>(
      func(key, alert) {
        (key, {
          id               = alert.id;
          provider         = alert.provider;
          findingId        = alert.findingId;
          originalSeverity = alert.originalSeverity;
          severity         = alert.severity;
          title            = alert.title;
          description      = alert.description;
          assetId          = alert.assetId;
          assetType        = alert.assetType;
          accountId        = alert.accountId;
          region           = alert.region;
          timestamp        = alert.timestamp;
          status           = alert.status;
          owner            = alert.owner;
          customer         = alert.customer;
          mitre            = alert.mitre;
          rawFindingId     = alert.rawFindingId;
          recurrenceCount  = alert.recurrenceCount;
          ingestionSource  = alert.ingestionSource;
          enrichment       = null;
        });
      }
    );
    {
      var awsCredentials               = old.awsCredentials;
      var azureCredentials             = old.azureCredentials;
      var gcpCredentials               = old.gcpCredentials;
      var awsPollingState              = old.awsPollingState;
      var azurePollingState            = old.azurePollingState;
      var gcpPollingState              = old.gcpPollingState;
      rawFindings                      = old.rawFindings;
      var findingsDayBucket            = old.findingsDayBucket;
      var normalizedAlerts             = migratedAlerts;
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
      var enrichmentApiKeys            = { abuseIpdbKey = null; virusTotalKey = null };
      var maliciousIpFeed              = [];
      var lastMaliciousIpFeedPoll      = null;
      var generatedReports             = [];
      var reportEmailConfigs           = [];
    };
  };
};
