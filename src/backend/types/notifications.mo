import Types "../types/common";

/// notifications.mo
/// Stored records and public interfaces for alert rules, per-customer
/// notification routing, and the notification log.
module {

  /// Delivery channel for an alert notification.
  public type NotificationChannel = {
    #InApp;
    #Email;
    #TeamsWebhook;
  };

  /// Delivery status of a notification attempt.
  public type NotificationStatus = {
    #Sent;
    #Failed;
    #Acknowledged;
  };

  /// Severity threshold predicate for an alert rule.
  public type RuleSeverityThreshold = {
    #AnyCritical;
    #AnyHigh;
    #AnyMedium;
    #AnyLow;
    #CriticalOrHigh;
    #All;
  };

  /// Admin-defined rule controlling when and how notifications are sent.
  /// `cooldownMinutes` defaults to 60 (1 hour) when a rule is created without
  /// an explicit value.
  public type AlertRule = {
    id                  : Text;
    name                : Text;
    enabled             : Bool;
    severityThreshold   : ?RuleSeverityThreshold;
    findingType         : ?Text;
    assetId             : ?Text;
    provider            : ?Types.ProviderType;
    region              : ?Text;
    channels            : [NotificationChannel];
    cooldownMinutes     : Nat;
    escalationMinutes   : ?Nat;
    escalationRecipient : ?Text;
    customer            : Types.CustomerId;
  };

  /// Per-customer notification routing configuration: the customer's own
  /// Microsoft Teams webhook URL, email recipients, cooldown and escalation
  /// window.
  public type NotificationRouting = {
    customer          : Types.CustomerId;
    teamsWebhookUrl   : ?Text;
    emailRecipients   : [Text];
    cooldownMinutes   : Nat;
    escalationMinutes : ?Nat;
  };

  /// Immutable record of every notification attempt.
  public type NotificationLog = {
    id             : Text;
    alertId        : Text;
    ruleId         : Text;
    channel        : NotificationChannel;
    recipient      : Text;
    timestamp      : Types.Timestamp;
    status         : NotificationStatus;
    acknowledged   : Bool;
    acknowledgedAt : ?Types.Timestamp;
    customer       : Types.CustomerId;
  };

  /// Error returned by alert-rule and routing mutations.
  public type NotificationError = {
    #NotAuthorized;
    #NotFound;
    #InvalidRule : Text;
    #InvalidWebhookUrl : Text;
  };
};
