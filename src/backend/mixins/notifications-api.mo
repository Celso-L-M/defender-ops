import List "mo:core/List";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Types "../types/common";
import NotificationTypes "../types/notifications";
import Lib "../lib/notifications";

/// notifications-api.mo
/// Public API for per-customer notification routing and unacknowledged-
/// notification escalation. Alert-rule CRUD and the notification log are
/// already exposed by the composition root; this mixin adds the routing
/// surface and the escalation runner. State and guards are injected by the
/// composition root.
mixin (
  notificationRoutings : List.List<NotificationTypes.NotificationRouting>,
  requireAuth : (Principal, Text) -> (),
  addAuditEntry : (Text, Text, Text, Text) -> (),
  runEscalationCheckInternal : () -> async Nat
) {

  /// Return the notification routing for a customer, if configured.
  public shared query ({ caller }) func getNotificationRouting(
    customer : Types.CustomerId
  ) : async ?NotificationTypes.NotificationRouting {
    requireAuth(caller, "getNotificationRouting");
    Lib.getRouting(notificationRoutings, customer);
  };

  /// Upsert the notification routing for a customer.
  public shared ({ caller }) func saveNotificationRouting(
    routing : NotificationTypes.NotificationRouting
  ) : async Result.Result<(), NotificationTypes.NotificationError> {
    requireAuth(caller, "saveNotificationRouting");
    // Validate the Teams webhook URL when one is supplied.
    switch (routing.teamsWebhookUrl) {
      case null {};
      case (?url) {
        switch (Lib.validateTeamsWebhookUrl(url)) {
          case (?reason) {
            addAuditEntry(
              caller.toText(),
              "NotificationRoutingRejected",
              "Invalid Teams webhook URL for customer " # routing.customer # ": " # reason,
              routing.customer
            );
            return #err(#InvalidWebhookUrl(reason));
          };
          case null {};
        };
      };
    };
    Lib.saveRouting(notificationRoutings, routing);
    addAuditEntry(
      caller.toText(),
      "NotificationRoutingSaved",
      "Notification routing saved for customer " # routing.customer,
      routing.customer
    );
    #ok(());
  };

  /// Run the unacknowledged-notification escalation check. For every
  /// notification whose rule defines an escalation window that has elapsed and
  /// that is still unacknowledged, deliver the escalation to the configured
  /// escalation recipient through the configured channel and record it in the
  /// notification log. Returns the number of escalations delivered.
  ///
  /// This is the public entry point that drives `NotificationRouter.escalationsDue`;
  /// the same internal runner is also invoked from the system heartbeat so
  /// escalation runs without a manual call.
  public shared ({ caller }) func runEscalationCheck() : async Nat {
    requireAuth(caller, "runEscalationCheck");
    let count = await runEscalationCheckInternal();
    if (count > 0) {
      addAuditEntry(
        caller.toText(),
        "NotificationEscalated",
        "Escalated " # count.toText() # " unacknowledged notification(s)",
        ""
      );
    };
    count;
  };
};
