import List "mo:core/List";
import Text "mo:core/Text";
import Types "../types/common";
import NotificationTypes "../types/notifications";

/// NotificationRouter.mo
/// Pure routing logic for the notification domain: matching alert rules against
/// a normalised alert, duplicate suppression within a cooldown window, and
/// escalation of unacknowledged notifications. No actor state and no network
/// calls live here — the composition root injects state and performs delivery.
module {

  /// Default duplicate-suppression cooldown, in minutes (1 hour).
  public let defaultCooldownMinutes : Nat = 60;

  /// Return the effective cooldown for a rule: the rule's own value when it is
  /// non-zero, otherwise the default (1 hour).
  public func effectiveCooldown(rule : NotificationTypes.AlertRule) : Nat {
    if (rule.cooldownMinutes == 0) defaultCooldownMinutes else rule.cooldownMinutes;
  };

  /// Return true when `rule` matches `alert` on every criterion the rule sets.
  /// Each criterion is optional; an unset criterion matches anything. A rule
  /// with an empty `customer` is a global rule and matches every customer.
  public func ruleMatches(
    rule : NotificationTypes.AlertRule,
    alert : Types.NormalizedAlert
  ) : Bool {
    if (not rule.enabled) return false;
    let custOk = rule.customer == "" or Text.equal(rule.customer, alert.customer);
    let provOk = switch (rule.provider) {
      case null true;
      case (?rp) {
        switch (alert.provider, rp) {
          case (#AWS, #AWS) true;
          case (#Azure, #Azure) true;
          case (#GCP, #GCP) true;
          case _ false;
        };
      };
    };
    let regionOk = switch (rule.region) {
      case null true;
      case (?rr) {
        switch (alert.region) {
          case null false;
          case (?ar) Text.equal(ar, rr);
        };
      };
    };
    let assetOk = switch (rule.assetId) {
      case null true;
      case (?ra) {
        switch (alert.assetId) {
          case null false;
          case (?aa) Text.equal(aa, ra);
        };
      };
    };
    let typeOk = switch (rule.findingType) {
      case null true;
      case (?rt) alert.title.toLower().contains(#text (rt.toLower()));
    };
    let sevOk = switch (rule.severityThreshold) {
      case null true;
      case (?thr) {
        switch (thr) {
          case (#All) true;
          case (#AnyLow) true;
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
    custOk and provOk and regionOk and assetOk and typeOk and sevOk;
  };

  /// Return every enabled rule that matches `alert`, in list order.
  public func matchRules(
    rules : List.List<NotificationTypes.AlertRule>,
    alert : Types.NormalizedAlert
  ) : [NotificationTypes.AlertRule] {
    rules.toArray().filter(func(rule) { ruleMatches(rule, alert) });
  };

  /// Return true when no notification for this alert and rule was recorded
  /// within the cooldown window, so a fresh notification should be sent.
  public func shouldSend(
    logs : List.List<NotificationTypes.NotificationLog>,
    alertId : Text,
    ruleId : Text,
    cooldownMinutes : Nat,
    nowNs : Types.Timestamp
  ) : Bool {
    var mostRecent : ?Types.Timestamp = null;
    for (entry in logs.values()) {
      if (Text.equal(entry.alertId, alertId) and Text.equal(entry.ruleId, ruleId)) {
        switch (mostRecent) {
          case null { mostRecent := ?entry.timestamp };
          case (?ts) { if (entry.timestamp > ts) { mostRecent := ?entry.timestamp } };
        };
      };
    };
    switch (mostRecent) {
      case null true;
      case (?ts) {
        let cooldownNs : Int = cooldownMinutes * 60 * 1_000_000_000;
        (nowNs - ts) > cooldownNs;
      };
    };
  };

  /// A single planned delivery: which channel, to whom, for which rule.
  public type PlannedDelivery = {
    ruleId : Text;
    channel : NotificationTypes.NotificationChannel;
    recipient : Text;
  };

  /// Build the delivery plan for one alert: for every matching rule that is not
  /// suppressed by its cooldown, one delivery per configured channel. In-app
  /// deliveries use the customer as recipient; email deliveries fan out to each
  /// configured recipient; the Teams webhook uses the customer's webhook URL.
  /// Returns an empty plan when the customer has no routing configured.
  public func planDeliveries(
    rules : List.List<NotificationTypes.AlertRule>,
    logs : List.List<NotificationTypes.NotificationLog>,
    routing : NotificationTypes.NotificationRouting,
    alert : Types.NormalizedAlert,
    nowNs : Types.Timestamp
  ) : [PlannedDelivery] {
    let plan = List.empty<PlannedDelivery>();
    for (rule in matchRules(rules, alert).values()) {
      let cooldown = effectiveCooldown(rule);
      if (shouldSend(logs, alert.id, rule.id, cooldown, nowNs)) {
        for (channel in rule.channels.values()) {
          switch (channel) {
            case (#InApp) {
              plan.add({ ruleId = rule.id; channel = #InApp; recipient = alert.customer });
            };
            case (#Email) {
              for (recipient in routing.emailRecipients.values()) {
                plan.add({ ruleId = rule.id; channel = #Email; recipient });
              };
            };
            case (#TeamsWebhook) {
              switch (routing.teamsWebhookUrl) {
                case null {};
                case (?url) {
                  plan.add({ ruleId = rule.id; channel = #TeamsWebhook; recipient = url });
                };
              };
            };
          };
        };
      };
    };
    plan.toArray();
  };

  /// Build a notification log entry for a delivery attempt.
  public func makeLog(
    alertId : Text,
    ruleId : Text,
    channel : NotificationTypes.NotificationChannel,
    recipient : Text,
    status : NotificationTypes.NotificationStatus,
    customer : Types.CustomerId,
    nowNs : Types.Timestamp
  ) : NotificationTypes.NotificationLog {
    {
      id = alertId # "-" # ruleId # "-" # nowNs.toText();
      alertId;
      ruleId;
      channel;
      recipient;
      timestamp = nowNs;
      status;
      acknowledged = false;
      acknowledgedAt = null;
      customer;
    };
  };

  /// Return (rule, originalLog) pairs whose escalation window has elapsed and
  /// whose notification is still unacknowledged.
  public func escalationsDue(
    rules : List.List<NotificationTypes.AlertRule>,
    logs : List.List<NotificationTypes.NotificationLog>,
    nowNs : Types.Timestamp
  ) : [(NotificationTypes.AlertRule, NotificationTypes.NotificationLog)] {
    let result = List.empty<(NotificationTypes.AlertRule, NotificationTypes.NotificationLog)>();
    for (entry in logs.values()) {
      if (not entry.acknowledged) {
        for (rule in rules.values()) {
          if (Text.equal(rule.id, entry.ruleId)) {
            switch (rule.escalationMinutes) {
              case null {};
              case (?esc) {
                let escalationNs : Int = esc * 60 * 1_000_000_000;
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
