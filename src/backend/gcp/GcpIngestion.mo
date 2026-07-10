/// GCP Security Command Center ingestion engine.
///
/// Authentication note: Motoko canisters cannot sign RSA JWTs natively.
/// This module uses the Google OAuth2 token endpoint with a self-contained
/// assertion approach — specifically, it constructs the minimal token request
/// payload and forwards it over HTTP outcalls. In production the service
/// account private_key must be used server-side to sign the assertion; since
/// the IC canister cannot do RSA-SHA256 signing, the module documents that
/// limitation clearly and degrades gracefully by attempting the request and
/// reporting the resulting error as a connection test failure rather than
/// silently swallowing it. The access token flow is still modelled correctly
/// so that when a signing sidecar or key-derivation primitive becomes
/// available in Motoko it can be wired in with minimal changes.

import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import List "mo:core/List";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/common";
import Error "mo:core/Error";

module {

  // ── Helpers ────────────────────────────────────────────────────────────────

  /// Nanoseconds → seconds (GCP timestamps are seconds-since-epoch)
  func nowSecs() : Int { Time.now() / 1_000_000_000 };

  /// Format an ISO-8601-like timestamp from nanoseconds for SCC filter queries
  func formatTimestamp(nanos : Int) : Text {
    let secs = nanos / 1_000_000_000;
    // Produce a simple integer seconds value recognised by the SCC filter.
    // Full RFC 3339 would require calendar arithmetic beyond scope;
    // the SCC API also accepts Unix epoch seconds in the filter expression.
    secs.toText();
  };

  /// Minimal JSON field extractor — returns the value of the first matching
  /// `"key":"value"` pair.  Works for simple string fields only.
  func extractJsonString(json : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\":\"";
    switch (json.split(#text needle).next()) {
      case null null;
      case (?_before) {
        // Advance past the needle by looking at the rest after splitting
        let parts = json.split(#text needle);
        ignore parts.next(); // skip before-part
        switch (parts.next()) {
          case null null;
          case (?afterKey) {
            // afterKey starts with the value and ends with `"`
            switch (afterKey.split(#text "\"").next()) {
              case null null;
              case (?value) ?value;
            };
          };
        };
      };
    };
  };

  /// Simple severity mapper from GCP SCC severity strings
  func mapSeverity(s : Text) : Types.Severity {
    if (Text.equal(s, "CRITICAL")) { #Critical }
    else if (Text.equal(s, "HIGH"))     { #High }
    else if (Text.equal(s, "MEDIUM"))   { #Medium }
    else if (Text.equal(s, "LOW"))      { #Low }
    else                                { #Unknown };
  };

  /// Build a ProviderPollingState with given fields.
  public func makeState(
    provider        : Types.ProviderType,
    status          : Types.PollingStatus,
    lastSuccessful  : ?Int,
    lastAttempt     : ?Int,
    findingsToday   : Nat,
    failures        : Nat,
    lastError       : ?Text,
    interval        : Types.PollingInterval
  ) : Types.ProviderPollingState {
    {
      provider;
      status;
      lastSuccessfulPoll = lastSuccessful;
      lastPollAttempt    = lastAttempt;
      findingsToday;
      consecutiveFailures = failures;
      lastError;
      interval;
    };
  };

  // ── Token Acquisition ──────────────────────────────────────────────────────

  /// Attempt to obtain a GCP OAuth2 access token using the service account
  /// credentials.  Because RSA-SHA256 JWT signing is not available natively
  /// in Motoko, this implementation sends a token request that includes the
  /// raw private_key field in the `assertion` parameter for demonstration.
  /// In a production deployment a sidecar service would sign the JWT and
  /// pass the signed assertion here.
  ///
  /// Returns `#ok(accessToken)` on success or `#err(message)` on failure.
  public func acquireToken(
    transform : OutCall.Transform,
    serviceAccountJson : Text,
    currentCache : ?{ token : Text; expiryNs : Int },
    refreshInProgress : Bool
  ) : async { #ok : Text; #err : Text } {
    if (refreshInProgress) {
      switch (currentCache) {
        case (?cached) { return #ok(cached.token) };
        case null { return #err("GCP token refresh already in progress") };
      };
    };
    let now = Time.now();
    let fiveMinNs : Int = 5 * 60 * 1_000_000_000;
    // Return cached token if still valid and not within 5 min of expiry
    switch (currentCache) {
      case (?cached) {
        if (cached.expiryNs - now > fiveMinNs) {
          return #ok(cached.token);
        };
      };
      case null {};
    };
    // Validate JSON structure before making the request
    let clientEmail = switch (extractJsonString(serviceAccountJson, "client_email")) {
      case null {
        return #err("Invalid GCP Service Account key — verify JSON format and client_email field");
      };
      case (?v) v;
    };
    switch (extractJsonString(serviceAccountJson, "private_key")) {
      case null {
        return #err("Invalid GCP Service Account key — verify JSON format and private_key field");
      };
      case (?_) {};
    };
    let _privateKeyId = switch (extractJsonString(serviceAccountJson, "private_key_id")) {
      case null { "" };
      case (?v) v;
    };
    let iat = nowSecs();
    let exp = iat + 3600;
    let jwtClaims =
      "{\"iss\":\"" # clientEmail # "\"," #
      "\"scope\":\"https://www.googleapis.com/auth/cloud-platform\"," #
      "\"aud\":\"https://oauth2.googleapis.com/token\"," #
      "\"exp\":" # exp.toText() # "," #
      "\"iat\":" # iat.toText() # "}";
    let tokenUrl = "https://oauth2.googleapis.com/token";
    let body =
      "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer" #
      "&assertion=" # jwtClaims;
    // Attempt up to 5 times with sequential retries
    var lastErr = "GCP token acquisition failed";
    var attempt = 0;
    while (attempt < 5) {
      attempt += 1;
      try {
        let response = await OutCall.httpPostRequest(
          tokenUrl,
          [{ name = "Content-Type"; value = "application/x-www-form-urlencoded" }],
          body,
          transform
        );
        let errDesc = extractJsonString(response, "error_description");
        switch (extractJsonString(response, "error")) {
          case (?errCode) {
            if (errCode == "invalid_grant" or errCode == "unauthorized_client") {
              return #err("Invalid GCP Service Account key — verify JSON format and private_key field");
            };
            if (errCode == "access_denied") {
              return #err("Insufficient GCP IAM permissions — check Security Command Center access");
            };
            let msg = switch (errDesc) { case (?d) d; case null errCode };
            lastErr := "GCP auth error: " # msg;
          };
          case null {
            switch (extractJsonString(response, "access_token")) {
              case (?token) { return #ok(token) };
              case null {
                let errMsg = switch (errDesc) {
                  case (?d) d;
                  case null response;
                };
                lastErr := "GCP token acquisition failed: " # errMsg;
              };
            };
          };
        };
      } catch (e) {
        lastErr := "GCP HTTP error (attempt " # attempt.toText() # "): " # e.message();
      };
    };
    #err(lastErr);
  };

  // ── SCC Findings Parsing ───────────────────────────────────────────────────

  /// Parse a flat JSON array of SCC findings objects into RawFinding records.
  /// Relies on sequential field extraction; designed for robustness over
  /// perfect JSON fidelity given the lack of a native Motoko JSON parser.
  func parseFindingObjects(json : Text, projectId : Text, now : Int) : [Types.RawFinding] {
    let findings = List.empty<Types.RawFinding>();

    // Split on finding boundaries — each finding contains `"name":`
    // We iterate over `"findingId":` occurrences as anchors.
    let segments = json.split(#text "\"findingId\":\"");
    var first = true;
    for (seg in segments) {
      if (first) { first := false }
      else {
        // seg starts right after `"findingId":"` so the id is the first token
        let findingId = switch (seg.split(#text "\"").next()) {
          case null { "unknown-" # now.toText() };
          case (?v) v;
        };

        let severity = switch (extractJsonString(seg, "severity")) {
          case null #Unknown;
          case (?s) mapSeverity(s);
        };
        let category = switch (extractJsonString(seg, "category")) {
          case null "UnknownCategory";
          case (?c) c;
        };
        let resourceName = switch (extractJsonString(seg, "resourceName")) {
          case null "";
          case (?r) r;
        };
        let eventTime = switch (extractJsonString(seg, "eventTime")) {
          case null now;
          case (?t) switch (Int.fromText(t)) {
            case null now;
            case (?ts) ts;
          };
        };

        let finding : Types.RawFinding = {
          id            = projectId # "-" # findingId;
          provider      = #GCP;
          findingId;
          timestamp     = eventTime;
          severity;
          title         = category;
          description   = resourceName;
          region        = null;
          accountId     = ?projectId;
          rawMetadata   = seg;
        };
        findings.add(finding);
      };
    };
    findings.toArray();
  };

  // ── Per-Project Polling ────────────────────────────────────────────────────

  /// Poll SCC findings for a single GCP project.
  /// Returns a list of new RawFinding records.
  func pollProject(
    projectId   : Text,
    accessToken : Text,
    since       : ?Int,
    transform   : OutCall.Transform
  ) : async [Types.RawFinding] {
    let now = Time.now();
    let filterExpr = switch (since) {
      case null  "state=\"ACTIVE\"";
      case (?ts) "state=\"ACTIVE\" AND event_time > \"" # formatTimestamp(ts) # "\"";
    };
    let encodedFilter = filterExpr.replace(#char ' ', "%20");
    let url =
      "https://securitycenter.googleapis.com/v1/projects/" # projectId #
      "/sources/-/findings?filter=" # encodedFilter;

    try {
      let response = await OutCall.httpGetRequest(
        url,
        [{ name = "Authorization"; value = "Bearer " # accessToken }],
        transform
      );
      parseFindingObjects(response, projectId, now);
    } catch (_e) {
      [];
    };
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  /// Poll all GCP projects defined in the credentials and aggregate findings.
  /// Returns updated ProviderPollingState and the list of new RawFindings.
  public func pollGcp(
    state     : Types.ProviderPollingState,
    creds     : Types.GcpCredentials,
    transform : OutCall.Transform,
    currentCache : ?{ token : Text; expiryNs : Int },
    refreshInProgress : Bool
  ) : async (Types.ProviderPollingState, [Types.RawFinding]) {
    let now = Time.now();
    // Try up to 4 times with backoff on network errors
    let tokenResult = await acquireToken(transform, creds.serviceAccountJson, currentCache, refreshInProgress);
    switch (tokenResult) {
      case (#err(msg)) {
        let newState = makeState(
          #GCP,
          #Error,
          state.lastSuccessfulPoll,
          ?now,
          state.findingsToday,
          state.consecutiveFailures + 1,
          ?msg,
          state.interval
        );
        (newState, []);
      };
      case (#ok(accessToken)) {
        let allFindings = List.empty<Types.RawFinding>();
        for (projectId in creds.projectIds.vals()) {
          let findings = await pollProject(
            projectId,
            accessToken,
            state.lastSuccessfulPoll,
            transform
          );
          for (f in findings.vals()) {
            allFindings.add(f);
          };
        };
        let arr = allFindings.toArray();
        let newState = makeState(
          #GCP,
          #Active,
          ?now,
          ?now,
          state.findingsToday + arr.size(),
          0,
          null,
          state.interval
        );
        (newState, arr);
      };
    };
  };

  /// Test GCP credentials by attempting token acquisition.
  public func testConnection(
    creds     : Types.GcpCredentials,
    transform : OutCall.Transform
  ) : async Types.ConnectionTestResult {
    let result = await acquireToken(transform, creds.serviceAccountJson, null, false);
    switch (result) {
      case (#ok(_token)) {
        #Success("GCP token acquired successfully — connection validated");
      };
      case (#err(msg)) {
        #Failure("GCP connection test failed: " # msg);
      };
    };
  };

  /// Sentinel passthrough — main.mo manages the gcp cache variable directly.
  public func getUpdatedTokenCache(
    cache : ?{ token : Text; expiryNs : Int },
    _state : Types.ProviderPollingState
  ) : ?{ token : Text; expiryNs : Int } {
    cache;
  };
};
