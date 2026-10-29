import List "mo:core/List";
import Text "mo:core/Text";
import Types "../types/common";
import NotificationTypes "../types/notifications";
import Router "../notifications/NotificationRouter";
import TeamsWebhook "../notifications/TeamsWebhook";

/// notifications.mo
/// Domain logic for alert rules, per-customer notification routing, and the
/// notification log. Pure functions over injected state; no actor state here.
module {

  /// Default duplicate-suppression cooldown, in minutes (1 hour).
  public let defaultCooldownMinutes : Nat = 60;

  /// Return alert rules for a customer, newest first, capped at `limit`.
  public func listAlertRules(
    rules : List.List<NotificationTypes.AlertRule>,
    customer : Types.CustomerId,
    limit : Nat
  ) : [NotificationTypes.AlertRule] {
    let filtered = rules.toArray().filter(func(rule) {
      customer == "" or Text.equal(rule.customer, customer);
    });
    let total = filtered.size();
    let capped = if (limit == 0 or limit >= total) total else limit;
    filtered.sliceToArray(0, capped.toInt());
  };

  /// Insert or update an alert rule keyed by `rule.id`. Applies the default
  /// cooldown when the rule carries none.
  public func saveAlertRule(
    rules : List.List<NotificationTypes.AlertRule>,
    rule : NotificationTypes.AlertRule
  ) : () {
    let normalized : NotificationTypes.AlertRule = {
      rule with cooldownMinutes = Router.effectiveCooldown(rule);
    };
    let arr = rules.toArray();
    let exists = arr.find(func(r) { Text.equal(r.id, normalized.id) }) != null;
    if (exists) {
      let updated = arr.map(func(r) {
        if (Text.equal(r.id, normalized.id)) normalized else r;
      });
      rules.clear();
      for (r in updated.values()) { rules.add(r) };
    } else {
      rules.add(normalized);
    };
  };

  /// Delete an alert rule by ID. Returns true when a rule was removed.
  public func deleteAlertRule(
    rules : List.List<NotificationTypes.AlertRule>,
    id : Text
  ) : Bool {
    let arr = rules.toArray();
    let kept = arr.filter(func(r) { not Text.equal(r.id, id) });
    let removed = kept.size() < arr.size();
    if (removed) {
      rules.clear();
      for (r in kept.values()) { rules.add(r) };
    };
    removed;
  };

  /// Return the notification routing for a customer, if configured.
  public func getRouting(
    routings : List.List<NotificationTypes.NotificationRouting>,
    customer : Types.CustomerId
  ) : ?NotificationTypes.NotificationRouting {
    routings.toArray().find(func(r) { Text.equal(r.customer, customer) });
  };

  /// Upsert the notification routing for a customer.
  public func saveRouting(
    routings : List.List<NotificationTypes.NotificationRouting>,
    routing : NotificationTypes.NotificationRouting
  ) : () {
    let arr = routings.toArray();
    let exists = arr.find(func(r) { Text.equal(r.customer, routing.customer) }) != null;
    if (exists) {
      let updated = arr.map(func(r) {
        if (Text.equal(r.customer, routing.customer)) routing else r;
      });
      routings.clear();
      for (r in updated.values()) { routings.add(r) };
    } else {
      routings.add(routing);
    };
  };

  /// Return notification log entries for a customer, newest first, capped.
  public func listNotificationLogs(
    logs : List.List<NotificationTypes.NotificationLog>,
    customer : Types.CustomerId,
    limit : Nat
  ) : [NotificationTypes.NotificationLog] {
    let filtered = logs.toArray().filter(func(entry) {
      customer == "" or Text.equal(entry.customer, customer);
    });
    let sorted = filtered.sort(func(a, b) {
      if (a.timestamp > b.timestamp) #less
      else if (a.timestamp < b.timestamp) #greater
      else #equal;
    });
    let total = sorted.size();
    let capped = if (limit == 0 or limit >= total) total else limit;
    sorted.sliceToArray(0, capped.toInt());
  };

  /// Mark a notification log entry acknowledged. Returns true when found.
  public func acknowledgeNotification(
    logs : List.List<NotificationTypes.NotificationLog>,
    logId : Text,
    nowNs : Types.Timestamp
  ) : Bool {
    let arr = logs.toArray();
    var found = false;
    let updated = arr.map(func(entry) {
      if (Text.equal(entry.id, logId)) {
        found := true;
        { entry with acknowledged = true; acknowledgedAt = ?nowNs };
      } else {
        entry;
      };
    });
    if (found) {
      logs.clear();
      for (entry in updated.values()) { logs.add(entry) };
    };
    found;
  };

  /// Validate a Microsoft Teams webhook URL. Returns null when valid, or a
  /// reason when the URL is malformed or not an https endpoint.
  public func validateTeamsWebhookUrl(url : Text) : ?Text {
    TeamsWebhook.validateUrl(url);
  };
};
