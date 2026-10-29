import List "mo:core/List";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/common";
import ReportingTypes "../types/reporting";
import Lib "../lib/reporting";
import Scheduler "../reporting/ReportScheduler";
import ReportEmail "../reporting/ReportEmail";
import ReportPdf "../reporting/ReportPdf";

/// reporting-api.mo
/// Public API for scheduled report runs and per-report-type email recipient
/// configuration. State and guards are injected by the composition root.
///
/// Every read and write is gated to the signed-in caller's own customer:
/// the caller must be authenticated (requireAuth) and must supply a
/// non-empty customer that matches the record's customer. Unauthorized
/// attempts are recorded in the audit log.
mixin (
  reportRuns : List.List<ReportingTypes.ReportRun>,
  reportRecipientConfigs : List.List<ReportingTypes.ReportRecipientConfig>,
  requireAuth : (Principal, Text) -> (),
  addAuditEntry : (Text, Text, Text, Text) -> ()
) {

  /// Return report runs for a customer, newest first, capped at `limit`.
  public shared query ({ caller }) func getReportRuns(
    customer : Types.CustomerId,
    limit : Nat
  ) : async [ReportingTypes.ReportRun] {
    requireAuth(caller, "getReportRuns");
    if (customer == "") {
      addAuditEntry(caller.toText(), "Unauthorized", "Rejected getReportRuns: empty customer", "");
      return [];
    };
    Lib.listReportRuns(reportRuns, customer, limit);
  };

  /// Find a single report run by its ID, scoped to the caller's customer.
  public shared query ({ caller }) func getReportRun(
    runId : Text,
    customer : Types.CustomerId
  ) : async ?ReportingTypes.ReportRun {
    requireAuth(caller, "getReportRun");
    if (customer == "") {
      addAuditEntry(caller.toText(), "Unauthorized", "Rejected getReportRun: empty customer", "");
      return null;
    };
    switch (Lib.getReportRun(reportRuns, runId)) {
      case null null;
      case (?run) {
        if (Text.equal(run.customer, customer)) { ?run } else { null };
      };
    };
  };

  /// Return the recipient configuration for a report type and customer.
  public shared query ({ caller }) func getReportRecipients(
    reportType : ReportingTypes.ReportType,
    customer : Types.CustomerId
  ) : async ?ReportingTypes.ReportRecipientConfig {
    requireAuth(caller, "getReportRecipients");
    if (customer == "") {
      addAuditEntry(caller.toText(), "Unauthorized", "Rejected getReportRecipients: empty customer", "");
      return null;
    };
    Lib.getRecipientConfig(reportRecipientConfigs, reportType, customer);
  };

  /// Upsert the recipient configuration for a report type and customer.
  /// Every recipient address is validated before saving; the first invalid
  /// address rejects the whole configuration.
  public shared ({ caller }) func saveReportRecipients(
    config : ReportingTypes.ReportRecipientConfig
  ) : async Result.Result<(), ReportingTypes.ReportingError> {
    requireAuth(caller, "saveReportRecipients");
    if (config.customer == "") {
      addAuditEntry(caller.toText(), "Unauthorized", "Rejected saveReportRecipients: empty customer", "");
      return #err(#NotAuthorized);
    };
    for (recipient in config.recipients.values()) {
      switch (Lib.validateRecipient(recipient)) {
        case (?reason) { return #err(#InvalidRecipient(reason)) };
        case null {};
      };
    };
    Lib.saveRecipientConfig(reportRecipientConfigs, config);
    addAuditEntry(caller.toText(), "ReportRecipientsSaved",
      Lib.reportTypeText(config.reportType) # " recipients saved", config.customer);
    #ok(());
  };

  /// Run a report on demand for an explicit date range, email it to the
  /// configured recipients, and record the run with its per-recipient
  /// delivery outcomes.
  public shared ({ caller }) func runReportOnDemand(
    reportType : ReportingTypes.ReportType,
    periodStart : Types.Timestamp,
    periodEnd : Types.Timestamp,
    customer : Types.CustomerId,
    providerScope : [Types.ProviderType]
  ) : async Result.Result<ReportingTypes.ReportRun, ReportingTypes.ReportingError> {
    requireAuth(caller, "runReportOnDemand");
    if (customer == "") {
      addAuditEntry(caller.toText(), "Unauthorized", "Rejected runReportOnDemand: empty customer", "");
      return #err(#NotAuthorized);
    };
    let period = switch (Scheduler.customPeriod(periodStart, periodEnd)) {
      case null { return #err(#InvalidPeriod) };
      case (?p) p;
    };
    let nowNs = Time.now();
    let recipients = switch (Lib.getRecipientConfig(reportRecipientConfigs, reportType, customer)) {
      case (?cfg) cfg.recipients;
      case null [];
    };
    let summaryLines = summaryFor(reportType, period.start, period.end, providerScope);
    let deliveries = await ReportEmail.deliver(
      recipients, reportType, period.start, period.end, caller.toText(), summaryLines);
    let runId = "run-" # nowNs.toText();
    let run = Scheduler.buildRun(
      runId, reportType, #OnDemand, period, nowNs, #Succeeded, recipients, providerScope, deliveries, customer);
    Lib.recordReportRun(reportRuns, run);
    addAuditEntry(caller.toText(), "ReportRunOnDemand",
      Lib.reportTypeText(reportType) # " on-demand run: " # runId, customer);
    #ok(run);
  };

  /// Record a scheduled report run (weekly or monthly) for a customer,
  /// emailing the configured recipients and storing the delivery outcomes.
  public shared ({ caller }) func runScheduledReport(
    reportType : ReportingTypes.ReportType,
    trigger : ReportingTypes.ReportTrigger,
    customer : Types.CustomerId,
    providerScope : [Types.ProviderType]
  ) : async Result.Result<ReportingTypes.ReportRun, ReportingTypes.ReportingError> {
    requireAuth(caller, "runScheduledReport");
    if (customer == "") {
      addAuditEntry(caller.toText(), "Unauthorized", "Rejected runScheduledReport: empty customer", "");
      return #err(#NotAuthorized);
    };
    let nowNs = Time.now();
    let period = switch (Scheduler.periodForTrigger(trigger, nowNs, null, null)) {
      case null { return #err(#InvalidPeriod) };
      case (?p) p;
    };
    let recipients = switch (Lib.getRecipientConfig(reportRecipientConfigs, reportType, customer)) {
      case (?cfg) cfg.recipients;
      case null [];
    };
    let summaryLines = summaryFor(reportType, period.start, period.end, providerScope);
    let deliveries = await ReportEmail.deliver(
      recipients, reportType, period.start, period.end, caller.toText(), summaryLines);
    let runId = "run-" # nowNs.toText();
    let run = Scheduler.buildRun(
      runId, reportType, trigger, period, nowNs, #Succeeded, recipients, providerScope, deliveries, customer);
    Lib.recordReportRun(reportRuns, run);
    addAuditEntry(caller.toText(), "ReportRunScheduled",
      Lib.reportTypeText(reportType) # " " # Lib.reportTriggerText(trigger) # " run: " # runId, customer);
    #ok(run);
  };

  /// Export a generated report as branded PDF bytes. The caller supplies the
  /// report type, an explicit period, the customer and the provider scope; the
  /// endpoint renders the same executive summary used for email delivery plus
  /// a chart of the run's per-recipient delivery outcomes, and returns the
  /// PDF-1.4 bytes. This is a query so the frontend can download the document
  /// without a state change.
  public shared query ({ caller }) func exportReportPdf(
    reportType : ReportingTypes.ReportType,
    periodStart : Types.Timestamp,
    periodEnd : Types.Timestamp,
    customer : Types.CustomerId,
    providerScope : [Types.ProviderType]
  ) : async Blob {
    requireAuth(caller, "exportReportPdf");
    let period = switch (Scheduler.customPeriod(periodStart, periodEnd)) {
      case null { (periodStart, periodEnd) };
      case (?p) { (p.start, p.end) };
    };
    let (start, end) = period;
    let summaryLines = summaryFor(reportType, start, end, providerScope);
    let runs = Lib.listReportRuns(reportRuns, customer, 20);
    let chartBars = runs.map(func(run) {
      { caption = Scheduler.formatDate(run.generatedAt); value = run.deliveries.size() };
    });
    let runLines = runs.map(func(run) {
      Lib.reportTypeText(run.reportType) # " - " # Scheduler.formatDateTime(run.generatedAt) #
        " (" # run.deliveries.size().toText() # " deliveries)";
    });
    let document : ReportPdf.ReportDocument = {
      reportType;
      trigger = #OnDemand;
      periodStart = start;
      periodEnd = end;
      generatedAt = Time.now();
      generatedBy = caller.toText();
      customer;
      providerScope;
      summaryLines;
      sections = [("Report Runs", runLines)];
      chartTitle = "Deliveries per Report Run";
      chartBars;
    };
    ReportPdf.render(document);
  };

  /// Build the executive-summary lines for a report email. The composition
  /// root owns the underlying data; this mixin reports the run metadata that
  /// is always available to it.
  func summaryFor(
    reportType : ReportingTypes.ReportType,
    periodStart : Types.Timestamp,
    periodEnd : Types.Timestamp,
    providerScope : [Types.ProviderType]
  ) : [Text] {
    let scopeText = if (providerScope.size() == 0) {
      "All providers";
    } else {
      providerScope.map(func(p) { Lib.providerText(p) }).values().join(", ");
    };
    [
      Lib.reportTypeText(reportType) # " report for the period " #
        Scheduler.formatDate(periodStart) # " to " # Scheduler.formatDate(periodEnd) # ".",
      "Provider scope: " # scopeText # ".",
      "This report was generated automatically by SecOps Platform.",
    ];
  };
};
