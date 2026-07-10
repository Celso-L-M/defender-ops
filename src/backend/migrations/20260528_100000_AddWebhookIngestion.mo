import List "mo:core/List";

/// Migration: AddWebhookIngestion
/// OldActor: exactly matches the NewActor from 20260528_000002_AddAuthState.mo (20 fields).
/// NewActor: adds 2 new stable fields:
///   - failedIngestions : List<FailedIngestion>  (empty on init)
///   - pipelineEvents   : List<IngestionEvent>   (empty on init)
/// Also migrates normalizedAlerts to add recurrenceCount=0 and ingestionSource=null
/// on any records that may not yet have these fields (safe no-op if already present,
/// since the record type already includes them — this migration carries forward the list as-is).
module {

  // ── Inline types (no project imports allowed in migrations) ────────────────

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

  // OldNormalizedAlert: matches the deployed shape from 20260528_000002_AddAuthState.mo
  // (no recurrenceCount or ingestionSource — those are new Phase 2 fields).
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
  };

  // NewNormalizedAlert: Phase 2 shape with recurrenceCount and ingestionSource added.
  type NewNormalizedAlert = {
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

  // ── Phase 2 new types ──────────────────────────────────────────────────────

  type FailedIngestion = {
    id           : Text;
    provider     : ProviderType;
    errorType    : Text;
    rawPayload   : Text;
    timestamp    : Int;
    errorMessage : Text;
    status       : Text;
  };

  // Matches PipelineMetrics.IngestionEvent exactly
  type IngestionEvent = {
    provider     : ProviderType;
    source       : { #Poll; #Webhook };
    normalizedOk : Bool;
    latencyMs    : Float;
    timestamp    : Int;
  };

  // ── Migration actor types ──────────────────────────────────────────────────

  /// OldActor: exactly matches NewActor from 20260528_000002_AddAuthState.mo (20 fields).
  /// normalizedAlerts uses OldNormalizedAlert (no recurrenceCount or ingestionSource).
  type OldActor = {
    var awsCredentials             : ?AwsCredentials;
    var azureCredentials           : ?AzureCredentials;
    var gcpCredentials             : ?GcpCredentials;
    var awsPollingState            : ProviderPollingState;
    var azurePollingState          : ProviderPollingState;
    var gcpPollingState            : ProviderPollingState;
    rawFindings                    : List.List<RawFinding>;
    var findingsDayBucket          : Text;
    var normalizedAlerts           : List.List<(Text, OldNormalizedAlert)>;
    var assets                     : List.List<(Text, Asset)>;
    complianceControls             : List.List<(Text, ComplianceControl)>;
    complianceTrend                : List.List<ComplianceTrendEntry>;
    var alertRules                 : List.List<(Text, AlertRule)>;
    var notificationLogs           : List.List<(Text, NotificationLog)>;
    timelineEvents                 : List.List<TimelineEvent>;
    auditLog                       : List.List<AuditLogEntry>;
    var lastComplianceSnapshotWeek : Text;
    var awsAuthError               : ?Text;
    var azureAuthError             : ?Text;
    var gcpAuthError               : ?Text;
  };

  /// NewActor: adds failedIngestions and pipelineEvents stable fields.
  /// normalizedAlerts upgraded to NewNormalizedAlert (adds recurrenceCount and ingestionSource).
  type NewActor = {
    var awsCredentials             : ?AwsCredentials;
    var azureCredentials           : ?AzureCredentials;
    var gcpCredentials             : ?GcpCredentials;
    var awsPollingState            : ProviderPollingState;
    var azurePollingState          : ProviderPollingState;
    var gcpPollingState            : ProviderPollingState;
    rawFindings                    : List.List<RawFinding>;
    var findingsDayBucket          : Text;
    var normalizedAlerts           : List.List<(Text, NewNormalizedAlert)>;
    var assets                     : List.List<(Text, Asset)>;
    complianceControls             : List.List<(Text, ComplianceControl)>;
    complianceTrend                : List.List<ComplianceTrendEntry>;
    var alertRules                 : List.List<(Text, AlertRule)>;
    var notificationLogs           : List.List<(Text, NotificationLog)>;
    timelineEvents                 : List.List<TimelineEvent>;
    auditLog                       : List.List<AuditLogEntry>;
    var lastComplianceSnapshotWeek : Text;
    var awsAuthError               : ?Text;
    var azureAuthError             : ?Text;
    var gcpAuthError               : ?Text;
    failedIngestions               : List.List<FailedIngestion>;
    pipelineEvents                 : List.List<IngestionEvent>;
  };

  public func migration(old : OldActor) : NewActor {
    // Migrate normalizedAlerts: add recurrenceCount=0 and ingestionSource=null to each record.
    let migratedAlerts = old.normalizedAlerts.map<(Text, OldNormalizedAlert), (Text, NewNormalizedAlert)>(
      func((k, a)) {
        (k, { a with recurrenceCount = 0; ingestionSource = null });
      }
    );
    {
      var awsCredentials             = old.awsCredentials;
      var azureCredentials           = old.azureCredentials;
      var gcpCredentials             = old.gcpCredentials;
      var awsPollingState            = old.awsPollingState;
      var azurePollingState          = old.azurePollingState;
      var gcpPollingState            = old.gcpPollingState;
      rawFindings                    = old.rawFindings;
      var findingsDayBucket          = old.findingsDayBucket;
      var normalizedAlerts           = migratedAlerts;
      var assets                     = old.assets;
      complianceControls             = old.complianceControls;
      complianceTrend                = old.complianceTrend;
      var alertRules                 = old.alertRules;
      var notificationLogs           = old.notificationLogs;
      timelineEvents                 = old.timelineEvents;
      auditLog                       = old.auditLog;
      var lastComplianceSnapshotWeek = old.lastComplianceSnapshotWeek;
      var awsAuthError               = old.awsAuthError;
      var azureAuthError             = old.azureAuthError;
      var gcpAuthError               = old.gcpAuthError;
      failedIngestions               = List.empty<FailedIngestion>();
      pipelineEvents                 = List.empty<IngestionEvent>();
    };
  };
};
