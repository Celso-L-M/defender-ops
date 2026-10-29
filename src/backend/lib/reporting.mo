import List "mo:core/List";
import Text "mo:core/Text";
import Types "../types/common";
import ReportingTypes "../types/reporting";

/// reporting.mo
/// Domain logic for scheduled report runs and per-report-type email recipient
/// configuration. Pure functions over injected state; no actor state here.
module {

  /// Return report runs for a customer, newest first, capped at `limit`.
  public func listReportRuns(
    runs : List.List<ReportingTypes.ReportRun>,
    customer : Types.CustomerId,
    limit : Nat
  ) : [ReportingTypes.ReportRun] {
    let matched = List.empty<ReportingTypes.ReportRun>();
    for (run in runs.values()) {
      if (customer == "" or Text.equal(run.customer, customer)) {
        matched.add(run);
      };
    };
    let sorted = matched.toArray().sort(func(a, b) {
      if (a.generatedAt > b.generatedAt) { #less }
      else if (a.generatedAt < b.generatedAt) { #greater }
      else { #equal };
    });
    if (limit == 0 or sorted.size() <= limit) {
      sorted;
    } else {
      sorted.sliceToArray(0, limit.toInt());
    };
  };

  /// Find a single report run by its ID.
  public func getReportRun(
    runs : List.List<ReportingTypes.ReportRun>,
    runId : Text
  ) : ?ReportingTypes.ReportRun {
    runs.find(func(run) = Text.equal(run.runId, runId));
  };

  /// Append a completed report run to the store.
  public func recordReportRun(
    runs : List.List<ReportingTypes.ReportRun>,
    run : ReportingTypes.ReportRun
  ) : () {
    runs.add(run);
  };

  /// Return the recipient configuration for a report type and customer.
  public func getRecipientConfig(
    configs : List.List<ReportingTypes.ReportRecipientConfig>,
    reportType : ReportingTypes.ReportType,
    customer : Types.CustomerId
  ) : ?ReportingTypes.ReportRecipientConfig {
    configs.find(func(c) {
      reportTypeEqual(c.reportType, reportType) and Text.equal(c.customer, customer);
    });
  };

  /// Upsert the recipient configuration for a report type and customer.
  public func saveRecipientConfig(
    configs : List.List<ReportingTypes.ReportRecipientConfig>,
    config : ReportingTypes.ReportRecipientConfig
  ) : () {
    let existing = configs.find(func(c) {
      reportTypeEqual(c.reportType, config.reportType) and Text.equal(c.customer, config.customer);
    });
    switch (existing) {
      case null { configs.add(config) };
      case (?_) {
        configs.mapInPlace(func(c) {
          if (reportTypeEqual(c.reportType, config.reportType) and Text.equal(c.customer, config.customer)) {
            config;
          } else {
            c;
          };
        });
      };
    };
  };

  /// Validate an email recipient string. Returns null when valid, or a reason.
  public func validateRecipient(recipient : Text) : ?Text {
    let trimmed = recipient.trim(#char ' ');
    if (trimmed.size() == 0) {
      return ?"Recipient address is empty";
    };
    if (trimmed.size() > 254) {
      return ?"Recipient address is too long";
    };
    if (trimmed.contains(#char ' ')) {
      return ?"Recipient address must not contain spaces";
    };
    let parts = trimmed.split(#char '@').toArray();
    if (parts.size() != 2) {
      return ?"Recipient address must contain exactly one '@'";
    };
    let localPart = parts[0];
    let domainPart = parts[1];
    if (localPart.size() == 0) {
      return ?"Recipient address is missing a local part";
    };
    if (domainPart.size() == 0) {
      return ?"Recipient address is missing a domain";
    };
    if (not domainPart.contains(#char '.')) {
      return ?"Recipient domain is missing a dot";
    };
    if (domainPart.startsWith(#char '.')) {
      return ?"Recipient domain starts with a dot";
    };
    if (domainPart.endsWith(#char '.')) {
      return ?"Recipient domain ends with a dot";
    };
    null;
  };

  /// Structural equality for report types.
  public func reportTypeEqual(a : ReportingTypes.ReportType, b : ReportingTypes.ReportType) : Bool {
    switch (a, b) {
      case (#SecurityPosture, #SecurityPosture) true;
      case (#ComplianceStatus, #ComplianceStatus) true;
      case (#IncidentSummary, #IncidentSummary) true;
      case (#ThreatIntelSummary, #ThreatIntelSummary) true;
      case _ false;
    };
  };

  /// Human-readable label for a report type.
  public func reportTypeText(reportType : ReportingTypes.ReportType) : Text {
    switch (reportType) {
      case (#SecurityPosture) "SecurityPosture";
      case (#ComplianceStatus) "ComplianceStatus";
      case (#IncidentSummary) "IncidentSummary";
      case (#ThreatIntelSummary) "ThreatIntelSummary";
    };
  };

  /// Human-readable label for a report trigger.
  public func reportTriggerText(trigger : ReportingTypes.ReportTrigger) : Text {
    switch (trigger) {
      case (#ScheduledWeekly) "ScheduledWeekly";
      case (#ScheduledMonthly) "ScheduledMonthly";
      case (#OnDemand) "OnDemand";
    };
  };

  /// Human-readable label for a provider type.
  public func providerText(provider : Types.ProviderType) : Text {
    switch (provider) {
      case (#AWS) "AWS";
      case (#Azure) "Azure";
      case (#GCP) "GCP";
    };
  };
};
