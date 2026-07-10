import List "mo:core/List";

/// Migration 2: Upgrade from 17-field full system (Modules 1-5) to 20-field auth state.
/// OldActor matches the NewActor from 20260528_000001_AddModules2to5.mo exactly.
/// NewActor adds 3 auth error fields and updates AwsCredentials from
/// {accessKeyId, secretAccessKey, regions} to {roleArn, externalId, regions}.
module {

  // ── Inline types (no project imports allowed in migrations) ────────────────

  type ProviderType = { #AWS; #Azure; #GCP };

  type Severity = { #Low; #Medium; #High; #Critical; #Unknown };

  type RawFinding = {
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

  type PollingInterval = { #FiveMin; #FifteenMin; #ThirtyMin; #OneHour };

  type PollingStatus = { #Active; #Inactive; #Error; #AuthPaused };

  type ProviderPollingState = {
    provider : ProviderType;
    status : PollingStatus;
    lastSuccessfulPoll : ?Int;
    lastPollAttempt : ?Int;
    findingsToday : Nat;
    consecutiveFailures : Nat;
    lastError : ?Text;
    interval : PollingInterval;
  };

  // Old AwsCredentials type (accessKeyId/secretAccessKey style)
  type OldAwsCredentials = {
    accessKeyId : Text;
    secretAccessKey : Text;
    regions : [Text];
  };

  // New AwsCredentials type (role ARN style, least-privilege)
  type NewAwsCredentials = {
    roleArn : Text;
    externalId : ?Text;
    regions : [Text];
  };

  type AzureCredentials = {
    clientId : Text;
    clientSecret : Text;
    tenantId : Text;
    subscriptionIds : [Text];
  };

  type GcpCredentials = {
    serviceAccountJson : Text;
    projectIds : [Text];
  };

  type AlertStatus = { #Open; #InProgress; #Resolved };

  type MitreTag = { tactic : Text; technique : Text; techniqueId : Text };

  type NormalizedAlert = {
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
  };

  type AssetType = {
    #EC2; #S3; #RDS; #Lambda;
    #AzureVM; #AzureStorage; #AzureDatabase;
    #GCPCompute; #GCPStorage; #GCPCloudSQL;
    #Other;
  };

  type Asset = {
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

  type ComplianceFramework = {
    #NISTCSF; #CISAws; #CISAzure; #CISGCP; #ISO27001; #SOC2;
  };

  type ControlStatus = { #Passing; #Failing; #NoCoverage };

  type ComplianceControl = {
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

  type ComplianceTrendEntry = {
    framework : ComplianceFramework;
    weekTimestamp : Int;
    score : Nat;
    totalControls : Nat;
    passingControls : Nat;
  };

  type NotificationChannel = { #InApp; #Email; #TeamsWebhook };

  type NotificationStatus = { #Sent; #Failed; #Acknowledged };

  type RuleSeverityThreshold = {
    #AnyCritical; #AnyHigh; #AnyMedium; #AnyLow; #CriticalOrHigh; #All;
  };

  type AlertRule = {
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

  type NotificationLog = {
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

  type TimelineEvent = {
    id : Text;
    timestamp : Int;
    eventType : Text;
    title : Text;
    description : Text;
    provider : ?ProviderType;
    severity : ?Severity;
    customer : Text;
  };

  type AuditLogEntry = {
    id : Text;
    timestamp : Int;
    actorId : Text;
    action : Text;
    details : Text;
    customer : Text;
  };

  // ── Migration types ──────────────────────────────────────────────────────────

  /// OldActor: exactly matches the NewActor from 20260528_000001_AddModules2to5.mo.
  /// 17 fields; awsCredentials uses old type with accessKeyId/secretAccessKey.
  type OldActor = {
    var awsCredentials : ?OldAwsCredentials;
    var azureCredentials : ?AzureCredentials;
    var gcpCredentials : ?GcpCredentials;
    var awsPollingState : ProviderPollingState;
    var azurePollingState : ProviderPollingState;
    var gcpPollingState : ProviderPollingState;
    rawFindings : List.List<RawFinding>;
    var findingsDayBucket : Text;
    var normalizedAlerts : List.List<(Text, NormalizedAlert)>;
    var assets : List.List<(Text, Asset)>;
    complianceControls : List.List<(Text, ComplianceControl)>;
    complianceTrend : List.List<ComplianceTrendEntry>;
    var alertRules : List.List<(Text, AlertRule)>;
    var notificationLogs : List.List<(Text, NotificationLog)>;
    timelineEvents : List.List<TimelineEvent>;
    auditLog : List.List<AuditLogEntry>;
    var lastComplianceSnapshotWeek : Text;
  };

  /// NewActor: adds 3 auth error fields and upgrades awsCredentials to new type.
  /// All 20 fields use var to match actor declarations.
  type NewActor = {
    var awsCredentials : ?NewAwsCredentials;
    var azureCredentials : ?AzureCredentials;
    var gcpCredentials : ?GcpCredentials;
    var awsPollingState : ProviderPollingState;
    var azurePollingState : ProviderPollingState;
    var gcpPollingState : ProviderPollingState;
    rawFindings : List.List<RawFinding>;
    var findingsDayBucket : Text;
    var normalizedAlerts : List.List<(Text, NormalizedAlert)>;
    var assets : List.List<(Text, Asset)>;
    complianceControls : List.List<(Text, ComplianceControl)>;
    complianceTrend : List.List<ComplianceTrendEntry>;
    var alertRules : List.List<(Text, AlertRule)>;
    var notificationLogs : List.List<(Text, NotificationLog)>;
    timelineEvents : List.List<TimelineEvent>;
    auditLog : List.List<AuditLogEntry>;
    var lastComplianceSnapshotWeek : Text;
    var awsAuthError : ?Text;
    var azureAuthError : ?Text;
    var gcpAuthError : ?Text;
  };

  public func migration(old : OldActor) : NewActor {
    // Convert awsCredentials: old type had accessKeyId/secretAccessKey;
    // new type uses roleArn/externalId. Admin must re-enter ARN after upgrade.
    let newAwsCreds : ?NewAwsCredentials = switch (old.awsCredentials) {
      case null null;
      case (?c) ?{
        roleArn    = "";
        externalId = null;
        regions    = c.regions;
      };
    };
    {
      var awsCredentials             = newAwsCreds;
      var azureCredentials           = old.azureCredentials;
      var gcpCredentials             = old.gcpCredentials;
      var awsPollingState            = old.awsPollingState;
      var azurePollingState          = old.azurePollingState;
      var gcpPollingState            = old.gcpPollingState;
      rawFindings                    = old.rawFindings;
      var findingsDayBucket          = old.findingsDayBucket;
      var normalizedAlerts           = old.normalizedAlerts;
      var assets                     = old.assets;
      complianceControls             = old.complianceControls;
      complianceTrend                = old.complianceTrend;
      var alertRules                 = old.alertRules;
      var notificationLogs           = old.notificationLogs;
      timelineEvents                 = old.timelineEvents;
      auditLog                       = old.auditLog;
      var lastComplianceSnapshotWeek = old.lastComplianceSnapshotWeek;
      var awsAuthError               = null;
      var azureAuthError             = null;
      var gcpAuthError               = null;
    };
  };
};
