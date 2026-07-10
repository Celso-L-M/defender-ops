import List "mo:core/List";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Types "../types/common";

module {

  public type ProviderType       = Types.ProviderType;
  public type IngestionSource    = Types.IngestionSource;
  public type PipelineHealthStats = Types.PipelineHealthStats;

  /// Internal event record for latency/success tracking.
  public type IngestionEvent = {
    provider      : ProviderType;
    source        : IngestionSource;
    normalizedOk  : Bool;
    latencyMs     : Float;
    timestamp     : Int;
  };

  let oneDayNs : Int = 86_400_000_000_000;

  /// Record an ingestion event in the stable event list.
  public func recordIngestionEvent(
    events       : List.List<IngestionEvent>,
    provider     : ProviderType,
    source       : IngestionSource,
    normalizedOk : Bool,
    latencyMs    : Float,
    timestamp    : Int,
  ) : () {
    events.add({ provider; source; normalizedOk; latencyMs; timestamp });
  };

  /// Compute pipeline health stats from recent events (last 24 h).
  public func getPipelineHealth(
    events           : List.List<IngestionEvent>,
    failedIngestions : List.List<Types.FailedIngestion>,
    nowNs            : Int,
  ) : [PipelineHealthStats] {
    let cutoff = nowNs - oneDayNs;
    let arr    = events.toArray();
    let failArr = failedIngestions.toArray();

    func statsFor(p : ProviderType) : PipelineHealthStats {
      var webhookTotal   = 0;
      var pollTotal      = 0;
      var normSuccess    = 0;
      var normTotal      = 0;
      var latencySum : Float = 0.0;
      var latencyCount   = 0;

      for (ev in arr.vals()) {
        let sameProvider = switch (ev.provider, p) {
          case (#AWS,   #AWS)   true;
          case (#Azure, #Azure) true;
          case (#GCP,   #GCP)   true;
          case _                false;
        };
        if (sameProvider and ev.timestamp >= cutoff) {
          switch (ev.source) {
            case (#Webhook) { webhookTotal += 1 };
            case (#Poll)    { pollTotal    += 1 };
          };
          normTotal += 1;
          if (ev.normalizedOk) {
            normSuccess  += 1;
            latencySum   += ev.latencyMs;
            latencyCount += 1;
          };
        };
      };

      var failedCount = 0;
      for (fi in failArr.vals()) {
        let sameProvider = switch (fi.provider, p) {
          case (#AWS,   #AWS)   true;
          case (#Azure, #Azure) true;
          case (#GCP,   #GCP)   true;
          case _                false;
        };
        if (sameProvider and fi.timestamp >= cutoff) {
          failedCount += 1;
        };
      };

      let successRate : Float =
        if (normTotal == 0) 1.0
        else normSuccess.toFloat() / normTotal.toFloat();

      let avgLatency : Float =
        if (latencyCount == 0) 0.0
        else latencySum / latencyCount.toFloat();

      {
        provider                 = p;
        webhookEventsToday       = webhookTotal;
        pollEventsToday          = pollTotal;
        normalizationSuccessRate = successRate;
        failedIngestionCount     = failedCount;
        avgLatencyMs             = avgLatency;
      };
    };

    [statsFor(#AWS), statsFor(#Azure), statsFor(#GCP)];
  };

};
