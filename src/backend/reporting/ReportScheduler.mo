import Int "mo:core/Int";
import Types "../types/common";
import ReportingTypes "../types/reporting";

/// ReportScheduler.mo
/// Pure period arithmetic for scheduled and on-demand report runs.
///
/// All timestamps are signed nanoseconds since the Unix epoch (Time.now()).
/// Weekly runs cover the previous 7 days ending at the run instant. Monthly
/// runs cover the previous calendar month. On-demand runs cover an explicit
/// caller-supplied range.
module {

  let nsPerSecond : Int = 1_000_000_000;
  let nsPerDay : Int = 86_400_000_000_000;

  /// The period a report run covers, as [start, end) in nanoseconds.
  public type ReportPeriod = {
    start : Types.Timestamp;
    end   : Types.Timestamp;
  };

  /// Weekly period: the previous 7 days ending at `nowNs`.
  public func weeklyPeriod(nowNs : Types.Timestamp) : ReportPeriod {
    { start = nowNs - (7 * nsPerDay); end = nowNs };
  };

  /// Monthly period: the previous calendar month, computed in UTC.
  /// `nowNs` is the run instant; the period ends at the first instant of the
  /// current month and starts at the first instant of the previous month.
  public func monthlyPeriod(nowNs : Types.Timestamp) : ReportPeriod {
    let (year, month, _) = civilFromDays(floorDiv(nowNs, nsPerDay));
    let (prevYear, prevMonth) = if (month == 1) { (year - 1, 12) } else { (year, month - 1) };
    let startDays = daysFromCivil(prevYear, prevMonth, 1);
    let endDays = daysFromCivil(year, month, 1);
    { start = startDays * nsPerDay; end = endDays * nsPerDay };
  };

  /// On-demand period from an explicit start/end. Returns null when the range
  /// is inverted or empty.
  public func customPeriod(startNs : Types.Timestamp, endNs : Types.Timestamp) : ?ReportPeriod {
    if (endNs <= startNs) {
      null;
    } else {
      ?{ start = startNs; end = endNs };
    };
  };

  /// Compute the period for a trigger. On-demand requires an explicit range.
  public func periodForTrigger(
    trigger : ReportingTypes.ReportTrigger,
    nowNs : Types.Timestamp,
    customStart : ?Types.Timestamp,
    customEnd : ?Types.Timestamp
  ) : ?ReportPeriod {
    switch (trigger) {
      case (#ScheduledWeekly) { ?weeklyPeriod(nowNs) };
      case (#ScheduledMonthly) { ?monthlyPeriod(nowNs) };
      case (#OnDemand) {
        switch (customStart, customEnd) {
          case (?s, ?e) { customPeriod(s, e) };
          case _ { null };
        };
      };
    };
  };

  /// Build a report run record for a completed generation.
  public func buildRun(
    runId : Text,
    reportType : ReportingTypes.ReportType,
    trigger : ReportingTypes.ReportTrigger,
    period : ReportPeriod,
    generatedAt : Types.Timestamp,
    outcome : ReportingTypes.ReportRunOutcome,
    recipients : [Text],
    providerScope : [Types.ProviderType],
    deliveries : [ReportingTypes.ReportDeliveryOutcome],
    customer : Types.CustomerId
  ) : ReportingTypes.ReportRun {
    {
      runId;
      reportType;
      trigger;
      periodStart   = period.start;
      periodEnd     = period.end;
      generatedAt;
      outcome;
      recipients;
      providerScope;
      deliveries;
      customer;
    };
  };

  // ── Civil-date helpers (UTC, proleptic Gregorian) ─────────────────────────

  /// Floor division for signed integers (rounds toward negative infinity).
  func floorDiv(a : Int, b : Int) : Int {
    let q = a / b;
    let r = a % b;
    if (r != 0 and ((r < 0) != (b < 0))) { q - 1 } else { q };
  };

  /// Days since 1970-01-01 for a civil date (Howard Hinnant's algorithm).
  func daysFromCivil(y : Int, m : Int, d : Int) : Int {
    let yy = if (m <= 2) { y - 1 } else { y };
    let era = floorDiv(yy, 400);
    let yoe = yy - era * 400;
    let mp = (m + 9) % 12;
    let doy = (153 * mp + 2) / 5 + d - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    era * 146097 + doe - 719468;
  };

  /// Civil date (year, month, day) from days since 1970-01-01.
  func civilFromDays(z : Int) : (Int, Int, Int) {
    let zz = z + 719468;
    let era = floorDiv(zz, 146097);
    let doe = zz - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if (mp < 10) { mp + 3 } else { mp - 9 };
    let year = if (m <= 2) { y + 1 } else { y };
    (year, m, d);
  };

  /// Format a nanosecond timestamp as an ISO-8601 UTC date (YYYY-MM-DD).
  public func formatDate(ns : Types.Timestamp) : Text {
    let (year, month, day) = civilFromDays(floorDiv(ns, nsPerDay));
    pad4(year) # "-" # pad2(month) # "-" # pad2(day);
  };

  /// Format a nanosecond timestamp as an ISO-8601 UTC date-time.
  public func formatDateTime(ns : Types.Timestamp) : Text {
    let days = floorDiv(ns, nsPerDay);
    let rem = ns - days * nsPerDay;
    let (year, month, day) = civilFromDays(days);
    let secsOfDay = rem / nsPerSecond;
    let hour = secsOfDay / 3600;
    let minute = (secsOfDay % 3600) / 60;
    let second = secsOfDay % 60;
    pad4(year) # "-" # pad2(month) # "-" # pad2(day) # " " #
      pad2(hour) # ":" # pad2(minute) # ":" # pad2(second) # " UTC";
  };

  func pad2(n : Int) : Text {
    if (n < 10) { "0" # n.toText() } else { n.toText() };
  };

  func pad4(n : Int) : Text {
    if (n < 10) { "000" # n.toText() }
    else if (n < 100) { "00" # n.toText() }
    else if (n < 1000) { "0" # n.toText() }
    else { n.toText() };
  };
};
