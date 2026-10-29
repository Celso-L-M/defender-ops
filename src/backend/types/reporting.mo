import Types "../types/common";

/// reporting.mo
/// Stored records and public interfaces for scheduled report runs and
/// per-report-type email recipient configuration.
module {

  /// The kind of report a scheduled run produces. Mirrors the reportType
  /// strings already accepted by generateReport.
  public type ReportType = {
    #SecurityPosture;
    #ComplianceStatus;
    #IncidentSummary;
    #ThreatIntelSummary;
  };

  /// How a scheduled report run was triggered.
  public type ReportTrigger = {
    #ScheduledWeekly;
    #ScheduledMonthly;
    #OnDemand;
  };

  /// Outcome of a scheduled report run.
  public type ReportRunOutcome = {
    #Succeeded;
    #Failed : Text;
  };

  /// Delivery outcome for one recipient of a report run.
  public type ReportDeliveryOutcome = {
    recipient : Text;
    success   : Bool;
    error     : ?Text;
    sentAt    : ?Types.Timestamp;
  };

  /// A single scheduled (or on-demand) report run record.
  public type ReportRun = {
    runId          : Text;
    reportType     : ReportType;
    trigger        : ReportTrigger;
    periodStart    : Types.Timestamp;
    periodEnd      : Types.Timestamp;
    generatedAt    : Types.Timestamp;
    outcome        : ReportRunOutcome;
    recipients     : [Text];
    providerScope  : [Types.ProviderType];
    deliveries     : [ReportDeliveryOutcome];
    customer       : Types.CustomerId;
  };

  /// Per-report-type email recipient configuration.
  public type ReportRecipientConfig = {
    reportType : ReportType;
    recipients : [Text];
    customer   : Types.CustomerId;
  };

  /// Error returned by report-run and recipient-config mutations.
  public type ReportingError = {
    #NotAuthorized;
    #NotFound;
    #InvalidRecipient : Text;
    #InvalidPeriod;
  };
};
