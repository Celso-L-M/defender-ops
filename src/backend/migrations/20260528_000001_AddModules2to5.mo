import List "mo:core/List";

/// Migration 1: Upgrade from 8-field Module 1 (deployed) to 17-field full system.
/// OldActor matches the deployed .most snapshot (8 fields).
/// NewActor adds 9 new stable fields for Modules 2-5.
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

  type PollingStatus = { #Active; #Inactive; #Error };

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

  type AwsCredentials = {
    accessKeyId : Text;
    secretAccessKey : Text;
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

  // ── Module 2-5 inline types ───────────────────────────────────────────────

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

  /// OldActor: the 8 deployed Module 1 fields (from .old/backend.most actor block).
  /// With check-limit=1, this OldActor is validated against .old/backend.most.
  /// All polling/credential fields are var; rawFindings has no var (as in deployed state).
  type OldActor = {
    var awsCredentials : ?AwsCredentials;
    var azureCredentials : ?AzureCredentials;
    var gcpCredentials : ?GcpCredentials;
    var awsPollingState : ProviderPollingState;
    var azurePollingState : ProviderPollingState;
    var gcpPollingState : ProviderPollingState;
    rawFindings : List.List<RawFinding>;
    var findingsDayBucket : Text;
  };

  /// NewActor: all 17 stable fields for the full system (Modules 1-5).
  type NewActor = {
    var awsCredentials : ?AwsCredentials;
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

  public func migration(old : OldActor) : NewActor {
    {
      var awsCredentials             = old.awsCredentials;
      var azureCredentials           = old.azureCredentials;
      var gcpCredentials             = old.gcpCredentials;
      var awsPollingState            = old.awsPollingState;
      var azurePollingState          = old.azurePollingState;
      var gcpPollingState            = old.gcpPollingState;
      rawFindings                    = old.rawFindings;
      var findingsDayBucket          = old.findingsDayBucket;
      var normalizedAlerts           = List.empty<(Text, NormalizedAlert)>();
      var assets                     = List.empty<(Text, Asset)>();
      complianceControls             = List.empty<(Text, ComplianceControl)>();
      complianceTrend                = List.empty<ComplianceTrendEntry>();
      var alertRules                 = List.empty<(Text, AlertRule)>();
      var notificationLogs           = List.empty<(Text, NotificationLog)>();
      timelineEvents                 = List.empty<TimelineEvent>();
      auditLog                       = List.empty<AuditLogEntry>();
      var lastComplianceSnapshotWeek = "";
    };
  };
};
