import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Types "../types/common";
import RateLimitTypes "../types/rate-limit";
import Lib "../lib/rate-limit";
import AccessControl "../lib/per-provider-access-control";

/// rate-limit-api.mo
/// Public API for per-provider rate-limit backoff state and recent throttling
/// events. State and guards are injected by the composition root.
///
/// Authorization: every endpoint requires a signed (non-anonymous) caller via
/// `requireAuth`, which also records the rejected attempt in the audit log.
/// Provider-scoped operations additionally pass through `requireProviderAccess`,
/// which traps "Not authorized for provider" when the caller is not assigned to
/// that provider. The list reads are scoped to the caller's assigned providers
/// via the injected `providerAssignments` map; the canister controller (owner)
/// keeps full access to every provider.
mixin (
  rateLimitStates : List.List<RateLimitTypes.RateLimitBackoffState>,
  throttleEvents : List.List<RateLimitTypes.ThrottleEvent>,
  providerAssignments : Map.Map<Principal, [Types.ProviderType]>,
  requireAuth : (Principal, Text) -> (),
  requireProviderAccess : (Principal, Types.ProviderType, Text) -> (),
  isOwner : Principal -> Bool
) {

  /// Return the rate-limit backoff state for the providers the caller is
  /// assigned to. The canister controller (owner) sees every tracked provider.
  public shared query ({ caller }) func getRateLimitStates() : async [RateLimitTypes.RateLimitBackoffState] {
    requireAuth(caller, "getRateLimitStates");
    if (isOwner(caller)) {
      return rateLimitStates.toArray();
    };
    rateLimitStates.toArray().filter(func(s) {
      AccessControl.isAssignedToProvider(providerAssignments, caller, s.provider);
    });
  };

  /// Return recent throttling events, optionally filtered to one provider,
  /// newest first, capped at `limit`. An explicit provider filter is
  /// access-checked against the caller's provider assignment. Without an
  /// explicit filter the result is scoped to the caller's assigned providers;
  /// the canister controller (owner) sees every provider.
  public shared query ({ caller }) func getThrottleEvents(
    provider : ?Types.ProviderType,
    limit : Nat
  ) : async [RateLimitTypes.ThrottleEvent] {
    requireAuth(caller, "getThrottleEvents");
    switch (provider) {
      case (?p) { requireProviderAccess(caller, p, "getThrottleEvents") };
      case null {};
    };
    let events = Lib.listThrottleEvents(throttleEvents, provider, limit);
    if (isOwner(caller)) {
      return events;
    };
    events.filter(func(e) {
      AccessControl.isAssignedToProvider(providerAssignments, caller, e.provider);
    });
  };

  /// Clear a provider's backoff state after a successful poll.
  public shared ({ caller }) func resetProviderBackoff(
    provider : Types.ProviderType
  ) : async Result.Result<(), RateLimitTypes.RateLimitError> {
    requireAuth(caller, "resetProviderBackoff");
    requireProviderAccess(caller, provider, "resetProviderBackoff");
    Lib.resetBackoff(rateLimitStates, provider, Time.now());
    #ok(());
  };
};
