

import Types "../types/common";
import List "mo:core/List";

import Text "mo:core/Text";

module {

  /// Returns all rules that match the given alert
  /// (checks severity, findingType, assetId, provider, region filters).
  public func evaluateRules(
    rules : [(Text, Types.AlertRule)],
    alert : Types.NormalizedAlert
  ) : [Types.AlertRule] {
    let matched = List.empty<Types.AlertRule>();
    for ((_, rule) in rules.vals()) {
      if (rule.enabled) {
        // Multi-tenant: empty customer means global rule
        let custOk = rule.customer == "" or Text.equal(rule.customer, alert.customer);
        // Provider filter
        let provOk = switch (rule.provider) {
          case null { true };
          case (?rp) {
            switch (alert.provider, rp) {
              case (#AWS,   #AWS)   true;
              case (#Azure, #Azure) true;
              case (#GCP,   #GCP)   true;
              case _                false;
            };
          };
        };
        // Region filter
        let regionOk = switch (rule.region) {
          case null  { true };
          case (?rr) {
            switch (alert.region) {
              case null    false;
              case (?ar) Text.equal(ar, rr);
            };
          };
        };
        // Asset filter
        let assetOk = switch (rule.assetId) {
          case null  { true };
          case (?ra) {
            switch (alert.assetId) {
              case null    false;
              case (?aa) Text.equal(aa, ra);
            };
          };
        };
        // Finding type filter (case-insensitive contains)
        let typeOk = switch (rule.findingType) {
          case null  { true };
          case (?rt) {
            let needle = rt.toLower();
            let haystack = alert.title.toLower();
            haystack.contains(#text needle);
          };
        };
        // Severity threshold filter
        let sevOk = switch (rule.severityThreshold) {
          case null    true;
          case (?thr) {
            switch (thr) {
              case (#All)          true;
              case (#AnyLow)       true;
              case (#AnyMedium) {
                switch (alert.severity) {
                  case (#Medium or #High or #Critical) true;
                  case _ false;
                };
              };
              case (#AnyHigh) {
                switch (alert.severity) {
                  case (#High or #Critical) true;
                  case _ false;
                };
              };
              case (#AnyCritical) {
                switch (alert.severity) {
                  case (#Critical) true;
                  case _ false;
                };
              };
              case (#CriticalOrHigh) {
                switch (alert.severity) {
                  case (#Critical or #High) true;
                  case _ false;
                };
              };
            };
          };
        };
        if (custOk and provOk and regionOk and assetOk and typeOk and sevOk) {
          matched.add(rule);
        };
      };
    };
    matched.toArray();
  };

  /// Returns false if a notification for this alertId+ruleId was sent within cooldownMinutes.
  public func shouldSendNotification(
    log             : [(Text, Types.NotificationLog)],
    alertId         : Text,
    ruleId          : Text,
    cooldownMinutes : Nat,
    nowNs           : Int
  ) : Bool {
    var mostRecentTs : ?Int = null;
    for ((_, entry) in log.vals()) {
      if (Text.equal(entry.alertId, alertId) and Text.equal(entry.ruleId, ruleId)) {
        switch (mostRecentTs) {
          case null { mostRecentTs := ?entry.timestamp };
          case (?ts) {
            if (entry.timestamp > ts) {
              mostRecentTs := ?entry.timestamp;
            };
          };
        };
      };
    };
    switch (mostRecentTs) {
      case null  true;
      case (?ts) {
        let cooldownNs : Int = cooldownMinutes * 60 * 1_000_000_000;
        (nowNs - ts) > cooldownNs;
      };
    };
  };

  /// Creates a new NotificationLog entry with #Sent status and current timestamp.
  public func createNotificationLog(
    alertId   : Text,
    ruleId    : Text,
    channel   : Types.NotificationChannel,
    recipient : Text,
    customer  : Text,
    nowNs     : Int
  ) : Types.NotificationLog {
    let id = alertId # "-" # ruleId # "-" # nowNs.toText();
    {
      id;
      alertId;
      ruleId;
      channel;
      recipient;
      timestamp      = nowNs;
      status         = #Sent;
      acknowledged   = false;
      acknowledgedAt = null;
      customer;
    };
  };

  /// Returns (rule, originalLog) pairs where escalationMinutes has elapsed
  /// and alert has not been acknowledged.
  public func getEscalationsDue(
    rules  : [(Text, Types.AlertRule)],
    logs   : [(Text, Types.NotificationLog)],
    nowNs  : Int
  ) : [(Types.AlertRule, Types.NotificationLog)] {
    let result = List.empty<(Types.AlertRule, Types.NotificationLog)>();
    // Build a quick lookup map: ruleId -> AlertRule
    for ((_, entry) in logs.vals()) {
      if (not entry.acknowledged) {
        // Find the matching rule
        for ((_, rule) in rules.vals()) {
          if (Text.equal(rule.id, entry.ruleId)) {
            switch (rule.escalationMinutes) {
              case null {};
              case (?esc) {
                let escalationNs = esc * 60 * 1_000_000_000;
                if (nowNs - entry.timestamp >= escalationNs) {
                  result.add((rule, entry));
                };
              };
            };
          };
        };
      };
    };
    result.toArray();
  };

};
