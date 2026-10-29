import Types "../types/common";

/// rate-limit.mo
/// Stored records and public interfaces for per-provider rate-limit backoff
/// state and recent throttling events.
module {

  /// Per-provider rate-limit backoff state. `backoffSeconds` is the current
  /// exponential backoff delay applied before the next poll attempt;
  /// `nextAttemptAt` is the earliest timestamp at which polling may resume.
  public type RateLimitBackoffState = {
    provider          : Types.ProviderType;
    backoffSeconds    : Nat;
    consecutiveThrottles : Nat;
    nextAttemptAt     : ?Types.Timestamp;
    lastThrottledAt   : ?Types.Timestamp;
    lastResetAt       : ?Types.Timestamp;
  };

  /// A single recent throttling event recorded when a provider returns a
  /// rate-limit response.
  public type ThrottleEvent = {
    id            : Text;
    provider      : Types.ProviderType;
    timestamp     : Types.Timestamp;
    retryAfterSec : ?Nat;
    statusCode    : ?Nat;
    message       : Text;
  };

  /// Error returned by rate-limit mutations.
  public type RateLimitError = {
    #NotAuthorized;
    #UnknownProvider;
  };
};
