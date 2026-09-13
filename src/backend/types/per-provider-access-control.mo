import Principal "mo:core/Principal";
import Types "../types/common";

module {

  /// The set of cloud providers a principal is assigned to.
  /// A user may only view and act on providers present in this list;
  /// unassigned providers are hidden and their data/remediation blocked.
  public type ProviderAssignment = {
    principal : Principal;
    providers : [Types.ProviderType];
  };

  /// Admin-facing view of a user's provider assignment (principal as text).
  public type UserAssignmentView = {
    principal : Text;
    providers : [Types.ProviderType];
  };

  /// Error returned by admin assignment operations.
  public type AssignmentError = {
    #NotAuthorized;
    #UnknownProvider;
  };
};
