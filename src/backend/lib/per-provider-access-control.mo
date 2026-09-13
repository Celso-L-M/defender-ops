import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/common";
import DomainTypes "../types/per-provider-access-control";

module {

  /// Returns true if the caller is assigned to the given provider.
  /// Composes with the existing requireAuth guard: callers are first checked
  /// for a signed (non-anonymous) identity, then scoped by this membership test.
  public func isAssignedToProvider(
    assignments : Map.Map<Principal, [Types.ProviderType]>,
    caller : Principal,
    provider : Types.ProviderType
  ) : Bool {
    switch (assignments.get(caller)) {
      case null false;
      case (?providers) {
        providers.any(func(p) {
          switch (p, provider) {
            case (#AWS, #AWS) true;
            case (#Azure, #Azure) true;
            case (#GCP, #GCP) true;
            case _ false;
          };
        });
      };
    };
  };

  /// Returns the providers the caller is assigned to (empty when unassigned).
  public func assignedProviders(
    assignments : Map.Map<Principal, [Types.ProviderType]>,
    caller : Principal
  ) : [Types.ProviderType] {
    switch (assignments.get(caller)) {
      case null [];
      case (?providers) providers;
    };
  };

  /// Assigns (replaces) the full set of providers a principal may access.
  /// ProviderType is a closed variant (#AWS/#Azure/#GCP), so the type system
  /// already guarantees every element is a known provider.
  public func assignProviders(
    assignments : Map.Map<Principal, [Types.ProviderType]>,
    principal : Principal,
    providers : [Types.ProviderType]
  ) : () {
    assignments.add(principal, providers);
  };

  /// Removes a single provider from a principal's assignment.
  /// When the last provider is removed, the principal's assignment is dropped.
  public func removeProvider(
    assignments : Map.Map<Principal, [Types.ProviderType]>,
    principal : Principal,
    provider : Types.ProviderType
  ) : () {
    switch (assignments.get(principal)) {
      case null {};
      case (?providers) {
        let remaining = providers.filter(func(p) {
          switch (p, provider) {
            case (#AWS, #AWS) false;
            case (#Azure, #Azure) false;
            case (#GCP, #GCP) false;
            case _ true;
          };
        });
        if (remaining.size() == 0) {
          assignments.remove(principal);
        } else {
          assignments.add(principal, remaining);
        };
      };
    };
  };

  /// Lists all principals and their provider assignments.
  public func listAssignments(
    assignments : Map.Map<Principal, [Types.ProviderType]>
  ) : [DomainTypes.UserAssignmentView] {
    let views = List.empty<DomainTypes.UserAssignmentView>();
    for ((p, providers) in assignments.entries()) {
      views.add({ principal = p.toText(); providers });
    };
    views.toArray();
  };
};
