import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/common";
import DomainTypes "../types/per-provider-access-control";
import Lib "../lib/per-provider-access-control";

mixin (
  providerAssignments : Map.Map<Principal, [Types.ProviderType]>,
  requireAuth : (Principal, Text) -> ()
) {

  /// Admin: assign (replace) the full set of providers a principal may access.
  /// Composes with the existing requireAuth guard (rejects anonymous callers).
  /// ProviderType is a closed variant, so every element is a known provider.
  public shared ({ caller }) func assignProviderAccess(
    principal : Principal,
    providers : [Types.ProviderType]
  ) : async () {
    requireAuth(caller, "assignProviderAccess");
    Lib.assignProviders(providerAssignments, principal, providers);
  };

  /// Admin: remove a single provider from a principal's access.
  public shared ({ caller }) func removeProviderAccess(
    principal : Principal,
    provider : Types.ProviderType
  ) : async () {
    requireAuth(caller, "removeProviderAccess");
    Lib.removeProvider(providerAssignments, principal, provider);
  };

  /// Admin: list all users and their provider assignments.
  public shared query ({ caller }) func listUserAssignments() : async [DomainTypes.UserAssignmentView] {
    requireAuth(caller, "listUserAssignments");
    Lib.listAssignments(providerAssignments);
  };

  /// Frontend: read the current caller's assigned providers.
  public shared query ({ caller }) func getMyProviders() : async [Types.ProviderType] {
    Lib.assignedProviders(providerAssignments, caller);
  };
};
