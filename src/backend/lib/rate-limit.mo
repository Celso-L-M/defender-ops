import List "mo:core/List";
import Nat "mo:core/Nat";
import Types "../types/common";
import RateLimitTypes "../types/rate-limit";

/// rate-limit.mo
/// Domain logic for per-provider rate-limit backoff state and recent
/// throttling events. Pure functions over injected state; no actor state here.
module {

  /// Maximum backoff delay, in seconds (15 minutes).
  public let maxBackoffSeconds : Nat = 900;

  /// Base backoff delay, in seconds, applied on the first throttle.
  public let baseBackoffSeconds : Nat = 30;

  /// Maximum number of recent throttling events retained.
  public let maxThrottleEvents : Nat = 200;

  /// Nanoseconds per second, for converting a retry-after hint to a timestamp.
  let nsPerSecond : Int = 1_000_000_000;

  /// Compare two providers for equality (closed variant).
  func sameProvider(a : Types.ProviderType, b : Types.ProviderType) : Bool {
    switch (a, b) {
      case (#AWS, #AWS) true;
      case (#Azure, #Azure) true;
      case (#GCP, #GCP) true;
      case _ false;
    };
  };

  /// Return the backoff state for a provider, if tracked.
  public func getBackoffState(
    states : List.List<RateLimitTypes.RateLimitBackoffState>,
    provider : Types.ProviderType
  ) : ?RateLimitTypes.RateLimitBackoffState {
    states.find(func(s) = sameProvider(s.provider, provider));
  };

  /// Compute the next exponential backoff delay from the consecutive throttle
  /// count, capped at `maxBackoffSeconds`. A `retryAfterSec` hint from the
  /// provider takes precedence when it is larger than the computed delay.
  func nextBackoffSeconds(consecutiveThrottles : Nat, retryAfterSec : ?Nat) : Nat {
    // 30 * 2^(n-1), capped. Shift is bounded so the exponent cannot overflow.
    let exponent = if (consecutiveThrottles == 0) 0 else consecutiveThrottles - 1;
    let shift = if (exponent > 5) 5 else exponent;
    let computed = baseBackoffSeconds * Nat.pow(2, shift);
    let capped = if (computed > maxBackoffSeconds) maxBackoffSeconds else computed;
    switch (retryAfterSec) {
      case (?hint) {
        let bounded = if (hint > maxBackoffSeconds) maxBackoffSeconds else hint;
        if (bounded > capped) bounded else capped;
      };
      case null capped;
    };
  };

  /// Record a throttling event and advance the provider's exponential backoff.
  /// Returns the updated backoff state.
  public func recordThrottle(
    states : List.List<RateLimitTypes.RateLimitBackoffState>,
    events : List.List<RateLimitTypes.ThrottleEvent>,
    provider : Types.ProviderType,
    retryAfterSec : ?Nat,
    statusCode : ?Nat,
    message : Text,
    nowNs : Types.Timestamp
  ) : RateLimitTypes.RateLimitBackoffState {
    let previous = getBackoffState(states, provider);
    let consecutive = switch (previous) {
      case (?s) s.consecutiveThrottles + 1;
      case null 1;
    };
    let backoff = nextBackoffSeconds(consecutive, retryAfterSec);
    let nextAttemptAt = nowNs + (backoff.toInt() * nsPerSecond);

    let updated : RateLimitTypes.RateLimitBackoffState = {
      provider;
      backoffSeconds = backoff;
      consecutiveThrottles = consecutive;
      nextAttemptAt = ?nextAttemptAt;
      lastThrottledAt = ?nowNs;
      lastResetAt = switch (previous) { case (?s) s.lastResetAt; case null null };
    };

    // Upsert the per-provider state.
    switch (previous) {
      case null { states.add(updated) };
      case (?_) {
        let snapshot = states.toArray();
        states.clear();
        for (s in snapshot.values()) {
          if (sameProvider(s.provider, provider)) {
            states.add(updated);
          } else {
            states.add(s);
          };
        };
      };
    };

    // Prepend the throttling event, then trim to the retention cap.
    let event : RateLimitTypes.ThrottleEvent = {
      id = nowNs.toText() # "-" # providerLabel(provider);
      provider;
      timestamp = nowNs;
      retryAfterSec;
      statusCode;
      message;
    };
    let existing = events.toArray();
    events.clear();
    events.add(event);
    for (e in existing.values()) {
      events.add(e);
    };
    if (events.size() > maxThrottleEvents) {
      let trimmed = events.toArray().sliceToArray(0, maxThrottleEvents.toInt());
      events.clear();
      for (e in trimmed.values()) {
        events.add(e);
      };
    };

    updated;
  };

  /// Clear a provider's backoff after a successful poll.
  public func resetBackoff(
    states : List.List<RateLimitTypes.RateLimitBackoffState>,
    provider : Types.ProviderType,
    nowNs : Types.Timestamp
  ) : () {
    switch (getBackoffState(states, provider)) {
      case null {};
      case (?existing) {
        let cleared : RateLimitTypes.RateLimitBackoffState = {
          provider;
          backoffSeconds = 0;
          consecutiveThrottles = 0;
          nextAttemptAt = null;
          lastThrottledAt = existing.lastThrottledAt;
          lastResetAt = ?nowNs;
        };
        let snapshot = states.toArray();
        states.clear();
        for (s in snapshot.values()) {
          if (sameProvider(s.provider, provider)) {
            states.add(cleared);
          } else {
            states.add(s);
          };
        };
      };
    };
  };

  /// Return recent throttling events for a provider, newest first, capped.
  public func listThrottleEvents(
    events : List.List<RateLimitTypes.ThrottleEvent>,
    provider : ?Types.ProviderType,
    limit : Nat
  ) : [RateLimitTypes.ThrottleEvent] {
    let effectiveLimit = if (limit == 0) 50 else if (limit > maxThrottleEvents) maxThrottleEvents else limit;
    let filtered = events.toArray().filter(func(e) {
      switch (provider) {
        case null true;
        case (?p) sameProvider(e.provider, p);
      };
    });
    // Events are stored newest-first; take the leading slice.
    let count = filtered.size();
    let end_ = if (effectiveLimit < count) effectiveLimit else count;
    filtered.sliceToArray(0, end_.toInt());
  };

  /// Human-readable provider label for event identifiers.
  func providerLabel(provider : Types.ProviderType) : Text {
    switch (provider) {
      case (#AWS) "AWS";
      case (#Azure) "Azure";
      case (#GCP) "GCP";
    };
  };
};
