import Types "../types/common";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Time "mo:core/Time";

/// Cross-Cloud Correlation Engine
/// Analyses normalised alerts and identifies cross-cloud attack patterns.
module {

  // ── Helpers ────────────────────────────────────────────────────────────────

  /// Returns true if `t` (lowercased) contains any of the given keywords.
  public func textContainsAny(t : Text, keywords : [Text]) : Bool {
    let lower = t.toLower();
    for (kw in keywords.vals()) {
      if (lower.contains(#text (kw.toLower()))) return true;
    };
    false;
  };

  /// True if an incident with the given type already references both alert IDs.
  func isDuplicateIncident(
    existingIncidents : [(Text, Types.CorrelatedIncident)],
    incidentType      : Text,
    alertId1          : Text,
    alertId2          : Text,
  ) : Bool {
    for ((_, inc) in existingIncidents.vals()) {
      if (inc.incidentType == incidentType) {
        var seenA1 = false;
        var seenA2 = false;
        for (id in inc.sourceAlerts.vals()) {
          if (id == alertId1) seenA1 := true;
          if (id == alertId2) seenA2 := true;
        };
        if (seenA1 and seenA2) return true;
      };
    };
    false;
  };

  /// Convert nanosecond delta to Float minutes.
  func nsToMinutes(deltaNs : Int) : Float {
    deltaNs.toFloat() / 60_000_000_000.0;
  };

  // ── Pattern 1 — Brute-Force to IAM Pivot ───────────────────────────────────

  public func checkBruteForceToIAMPivot(
    existingIncidents : [(Text, Types.CorrelatedIncident)],
    alerts            : [(Text, Types.NormalizedAlert)],
  ) : [Types.CorrelatedIncident] {
    let windowNs : Int = 1_800_000_000_000; // 30 minutes in ns
    var results : [Types.CorrelatedIncident] = [];

    // Collect Azure brute-force / password-spray alerts
    for ((azureId, azureAlert) in alerts.vals()) {
      switch (azureAlert.provider) {
        case (#Azure) {
          let isAzureBrute = textContainsAny(
            azureAlert.title # " " # azureAlert.description,
            ["bruteforce", "brute-force", "brute force", "passwordspray", "password spray", "password-spray"],
          );
          if (isAzureBrute) {
            // Look for matching AWS IAM pivot within 30 min after
            for ((awsId, awsAlert) in alerts.vals()) {
              switch (awsAlert.provider) {
                case (#AWS) {
                  let isAwsIam = textContainsAny(
                    awsAlert.title # " " # awsAlert.description,
                    ["assumerole", "assume role", "assume-role", "unauthorizedaccess", "unauthorized access"],
                  );
                  if (isAwsIam) {
                    let delta = awsAlert.timestamp - azureAlert.timestamp;
                    let sourceIpMatch = switch (azureAlert.assetId, awsAlert.assetId) {
                      case (?ip1, ?ip2) { ip1 == ip2 and ip1 != "" };
                      case _ { false };
                    };
                    if (delta >= 0 and delta <= windowNs and sourceIpMatch) {
                      if (not isDuplicateIncident(existingIncidents, "Brute-Force to IAM Pivot", azureId, awsId)) {
                        let sourceIp : ?Text = azureAlert.assetId;
                        let incident : Types.CorrelatedIncident = {
                          incidentId               = "corr-" # azureId # "-" # awsId;
                          incidentType             = "Brute-Force to IAM Pivot";
                          severity                 = #Critical;
                          status                   = #Open;
                          sourceAlerts             = [azureId, awsId];
                          sourceProviders          = [#Azure, #AWS];
                          sourceIp                 = sourceIp;
                          affectedResources        = [
                            switch (azureAlert.assetId) { case (?id) id; case null "" },
                            switch (awsAlert.assetId) { case (?id) id; case null "" },
                          ];
                          timeDeltaMinutes         = nsToMinutes(delta);
                          correlationWindowMinutes = 30;
                          detectedAt               = Time.now();
                          assignedOwner            = null;
                          notes                    = null;
                          customer                 = azureAlert.customer;
                        };
                        results := results.concat([incident]);
                      };
                    };
                  };
                };
                case (_) {};
              };
            };
          };
        };
        case (_) {};
      };
    };
    results;
  };

  // ── Pattern 2 — Simultaneous Multi-Cloud Data Exfiltration ─────────────────

  public func checkMultiCloudDataExfiltration(
    existingIncidents : [(Text, Types.CorrelatedIncident)],
    alerts            : [(Text, Types.NormalizedAlert)],
  ) : [Types.CorrelatedIncident] {
    let windowNs : Int = 900_000_000_000; // 15 minutes in ns
    var results : [Types.CorrelatedIncident] = [];

    // Find AWS S3 download / GetObject anomalies
    for ((awsId, awsAlert) in alerts.vals()) {
      switch (awsAlert.provider) {
        case (#AWS) {
          let haystack = awsAlert.title # " " # awsAlert.description;
          let hasS3       = textContainsAny(haystack, ["s3"]);
          let hasDownload = textContainsAny(haystack, ["download", "getobject", "get object", "objectread"]);
          if (hasS3 and hasDownload) {
            // Look for matching Azure blob storage download anomaly within 15 min
            for ((azureId, azureAlert) in alerts.vals()) {
              switch (azureAlert.provider) {
                case (#Azure) {
                  let azureHaystack = azureAlert.title # " " # azureAlert.description;
                  let hasBlobOrStorage = textContainsAny(azureHaystack, ["blobstorage", "blob storage", "storageaccount", "storage account"]);
                  let hasAzureDownload = textContainsAny(azureHaystack, ["download"]);
                  if (hasBlobOrStorage and hasAzureDownload) {
                    let delta    = awsAlert.timestamp - azureAlert.timestamp;
                    let absDelta = if (delta >= 0) delta else -delta;
                    if (absDelta <= windowNs) {
                      if (not isDuplicateIncident(existingIncidents, "Multi-Cloud Data Exfiltration", awsId, azureId)) {
                        let incident : Types.CorrelatedIncident = {
                          incidentId               = "corr-" # awsId # "-" # azureId;
                          incidentType             = "Multi-Cloud Data Exfiltration";
                          severity                 = #Critical;
                          status                   = #Open;
                          sourceAlerts             = [awsId, azureId];
                          sourceProviders          = [#AWS, #Azure];
                          sourceIp                 = null;
                          affectedResources        = [
                            switch (awsAlert.assetId) { case (?id) id; case null "" },
                            switch (azureAlert.assetId) { case (?id) id; case null "" },
                          ];
                          timeDeltaMinutes         = nsToMinutes(if (delta >= 0) delta else -delta);
                          correlationWindowMinutes = 15;
                          detectedAt               = Time.now();
                          assignedOwner            = null;
                          notes                    = null;
                          customer                 = awsAlert.customer;
                        };
                        results := results.concat([incident]);
                      };
                    };
                  };
                };
                case (_) {};
              };
            };
          };
        };
        case (_) {};
      };
    };
    results;
  };

  // ── Engine entry point ─────────────────────────────────────────────────────

  /// Run all registered correlation patterns and return the combined new incidents.
  /// Extend by adding new pattern functions to the `patterns` list below.
  public func runAllPatterns(
    existingIncidents : [(Text, Types.CorrelatedIncident)],
    alerts            : [(Text, Types.NormalizedAlert)],
  ) : [Types.CorrelatedIncident] {
    let patterns : [([(Text, Types.CorrelatedIncident)], [(Text, Types.NormalizedAlert)]) -> [Types.CorrelatedIncident]] = [
      checkBruteForceToIAMPivot,
      checkMultiCloudDataExfiltration,
    ];
    var all : [Types.CorrelatedIncident] = [];
    for (pattern in patterns.vals()) {
      all := all.concat(pattern(existingIncidents, alerts));
    };
    all;
  };

  // ── Statistics ─────────────────────────────────────────────────────────────

  /// Compute dashboard statistics from the incident store.
  /// `nowNs` should be `Time.now()` (nanoseconds since epoch).
  public func computeStats(
    incidents : [(Text, Types.CorrelatedIncident)],
    nowNs     : Int,
  ) : Types.CorrelationStats {
    let dayNs  : Int = 86_400_000_000_000;     // 24 h in ns
    let weekNs : Int = 604_800_000_000_000;    // 7 d in ns

    var totalToday    : Nat = 0;
    var totalThisWeek : Nat = 0;
    var totalAllTime  : Nat = 0;

    // Accumulate per-type counts using a simple association list
    var typeCounts : [(Text, Nat)] = [];

    for ((_, inc) in incidents.vals()) {
      totalAllTime += 1;
      let age = nowNs - inc.detectedAt;
      if (age <= dayNs)  totalToday    += 1;
      if (age <= weekNs) totalThisWeek += 1;

      // Update per-type count
      var found = false;
      typeCounts := typeCounts.map(
        func((t, c)) {
          if (t == inc.incidentType) { found := true; (t, c + 1) } else (t, c);
        },
      );
      if (not found) {
        typeCounts := typeCounts.concat([(inc.incidentType, 1)]);
      };
    };

    {
      totalToday;
      totalThisWeek;
      totalAllTime;
      byType = typeCounts;
    };
  };
};
