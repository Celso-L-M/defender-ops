import List "mo:core/List";

/// Initial migration: no previous state, provision all stable fields for the
/// multi-cloud ingestion engine (Module 1 — 8 fields).
/// Module 2-5 fields are added by migration 20260528_000001_AddModules2to5.
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

  /// OldActor: empty — this is the initial migration (fresh install, no prior state).
  type OldActor = {};

  /// NewActor: 8 stable fields for Module 1 (multi-cloud ingestion engine).
  /// Module 2-5 fields are added by migration 20260528_000001_AddModules2to5.
  type NewActor = {
    var awsCredentials : ?AwsCredentials;
    var azureCredentials : ?AzureCredentials;
    var gcpCredentials : ?GcpCredentials;
    var awsPollingState : ProviderPollingState;
    var azurePollingState : ProviderPollingState;
    var gcpPollingState : ProviderPollingState;
    rawFindings : List.List<RawFinding>;
    var findingsDayBucket : Text;
  };

  func makePollingState(provider : ProviderType) : ProviderPollingState = {
    provider;
    status = #Inactive;
    lastSuccessfulPoll = null;
    lastPollAttempt = null;
    findingsToday = 0;
    consecutiveFailures = 0;
    lastError = null;
    interval = #FifteenMin;
  };

  public func migration(_ : OldActor) : NewActor {
    {
      var awsCredentials    = null : ?AwsCredentials;
      var azureCredentials  = null : ?AzureCredentials;
      var gcpCredentials    = null : ?GcpCredentials;
      var awsPollingState   = makePollingState(#AWS);
      var azurePollingState = makePollingState(#Azure);
      var gcpPollingState   = makePollingState(#GCP);
      rawFindings           = List.empty<RawFinding>();
      var findingsDayBucket = "";
    };
  };
};
