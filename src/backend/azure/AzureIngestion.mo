/// Azure ingestion engine — polls Microsoft Defender for Cloud and Azure Security
/// Center per subscription, acquiring a fresh OAuth 2.0 bearer token before each cycle.
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/common";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Char "mo:core/Char";

module {

  // ────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────

  /// Build a fresh ProviderPollingState for Azure without struct-spread.
  public func makeState() : Types.ProviderPollingState {
    {
      provider           = #Azure;
      status             = #Inactive;
      lastSuccessfulPoll = null;
      lastPollAttempt    = null;
      findingsToday      = 0;
      consecutiveFailures = 0;
      lastError          = null;
      interval           = #FifteenMin;
    };
  };

  // ────────────────────────────────────────────────────────────────────────
  // Token acquisition
  // ────────────────────────────────────────────────────────────────────────

  /// Acquire an OAuth 2.0 client-credentials bearer token from Azure AD.
  /// Returns the access_token string on success, or an error message.
  public func acquireToken(
    creds     : Types.AzureCredentials,
    transform : OutCall.Transform,
    currentCache : ?{ token : Text; expiryNs : Int },
    refreshInProgress : Bool
  ) : async { #ok : Text; #err : Text } {
    if (refreshInProgress) {
      switch (currentCache) {
        case (?cached) { return #ok(cached.token) };
        case null { return #err("Azure token refresh already in progress") };
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
    // Need a fresh token — attempt up to 5 times
    let url = "https://login.microsoftonline.com/" # creds.tenantId # "/oauth2/v2.0/token";
    let body =
      "grant_type=client_credentials" #
      "&client_id=" # creds.clientId #
      "&client_secret=" # creds.clientSecret #
      "&scope=https://management.azure.com/.default";
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
    ];
    var lastErr = "Token request failed";
    var attempt = 0;
    while (attempt < 5) {
      attempt += 1;
      try {
        let raw = await OutCall.httpPostRequest(url, headers, body, transform);
        switch (extractJsonField(raw, "error")) {
          case (?errCode) {
            if (errCode == "invalid_client" or errCode == "unauthorized_client") {
              return #err("Invalid Azure credentials — check Client ID, Client Secret, and Tenant ID");
            };
            let errDesc = switch (extractJsonField(raw, "error_description")) {
              case (?d) d; case null errCode
            };
            lastErr := "Azure auth error: " # errDesc;
          };
          case null {
            switch (extractJsonField(raw, "access_token")) {
              case (?token) { return #ok(token) };
              case null     { lastErr := "access_token not found in response: " # raw };
            };
          };
        };
      } catch (_) {
        lastErr := "Token request failed (attempt " # attempt.toText() # ")";
      };
    };
    #err(lastErr);
  };

  // ────────────────────────────────────────────────────────────────────────
  // Per-subscription polling
  // ────────────────────────────────────────────────────────────────────────

  /// Poll Microsoft Defender for Cloud alerts for one subscription.
  func pollAlerts(
    subscriptionId : Text,
    token          : Text,
    sinceIso       : Text,
    transform      : OutCall.Transform,
  ) : async [Types.RawFinding] {
    let url =
      "https://management.azure.com/subscriptions/" # subscriptionId #
      "/providers/Microsoft.Security/alerts" #
      "?api-version=2022-01-01" #
      "&$filter=properties/timeGeneratedUtc%20ge%20" # sinceIso;
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # token },
    ];
    try {
      let raw = await OutCall.httpGetRequest(url, headers, transform);
      parseAlertFindings(raw, subscriptionId);
    } catch (_) {
      [];
    };
  };

  /// Poll Azure Security Center assessments (recommendations) for one subscription.
  func pollAssessments(
    subscriptionId : Text,
    token          : Text,
    _sinceIso      : Text,     // used as a filter hint; server-side filtering is best-effort
    transform      : OutCall.Transform,
  ) : async [Types.RawFinding] {
    let url =
      "https://management.azure.com/subscriptions/" # subscriptionId #
      "/providers/Microsoft.Security/assessments" #
      "?api-version=2021-06-01";
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # token },
    ];
    try {
      let raw = await OutCall.httpGetRequest(url, headers, transform);
      parseAssessmentFindings(raw, subscriptionId);
    } catch (_) {
      [];
    };
  };

  // ────────────────────────────────────────────────────────────────────────
  // Public API
  // ────────────────────────────────────────────────────────────────────────

  /// Test Azure credentials by attempting token acquisition.
  public func testConnection(
    creds     : Types.AzureCredentials,
    transform : OutCall.Transform,
  ) : async Types.ConnectionTestResult {
    switch (await acquireToken(creds, transform, null, false)) {
      case (#ok(_))  { #Success("Azure OAuth 2.0 token acquired successfully") };
      case (#err(e)) { #Failure("Azure connection test failed: " # e) };
    };
  };

  /// Full polling cycle for Azure — tokens, then alerts + assessments across all subscriptions.
  /// Returns the updated ProviderPollingState and all new RawFindings collected.
  public func pollAzure(
    state     : Types.ProviderPollingState,
    creds     : Types.AzureCredentials,
    transform : OutCall.Transform,
    currentCache : ?{ token : Text; expiryNs : Int },
    refreshInProgress : Bool
  ) : async (Types.ProviderPollingState, [Types.RawFinding]) {
    let now = Time.now();
    let sinceIso = isoFromLastPoll(state.lastSuccessfulPoll);

    switch (await acquireToken(creds, transform, currentCache, refreshInProgress)) {
      case (#err(e)) {
        let newState : Types.ProviderPollingState = {
          provider            = state.provider;
          status              = #Error;
          lastSuccessfulPoll  = state.lastSuccessfulPoll;
          lastPollAttempt     = ?now;
          findingsToday       = state.findingsToday;
          consecutiveFailures = state.consecutiveFailures + 1;
          lastError           = ?e;
          interval            = state.interval;
        };
        return (newState, []);
      };
      case (#ok(token)) {
        let allFindingsList = List.empty<Types.RawFinding>();
        for (subId in creds.subscriptionIds.vals()) {
          let alerts = await pollAlerts(subId, token, sinceIso, transform);
          let assessments = await pollAssessments(subId, token, sinceIso, transform);
          for (f in alerts.vals())      { allFindingsList.add(f) };
          for (f in assessments.vals()) { allFindingsList.add(f) };
        };
        let allFindings = allFindingsList.toArray();
        let newCount = allFindings.size();
        let newState : Types.ProviderPollingState = {
          provider            = state.provider;
          status              = #Active;
          lastSuccessfulPoll  = ?now;
          lastPollAttempt     = ?now;
          findingsToday       = state.findingsToday + newCount;
          consecutiveFailures = 0;
          lastError           = null;
          interval            = state.interval;
        };
        (newState, allFindings);
      };
    };
  };

  // ────────────────────────────────────────────────────────────────────────
  // JSON helpers (naive text parsing suitable for a Motoko canister)
  // ────────────────────────────────────────────────────────────────────────

  /// Extract a plain string value for `key` from a flat JSON object.
  /// Handles: `"key":"value"` and `"key": "value"` with no nesting concern.
  public func extractJsonField(json : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\"";
    let chars  = json.toIter();
    var buf    = "";
    var found  = false;
    for (ch in chars) {
      buf := buf # Text.fromChar(ch);
      if (not found and buf.endsWith(#text needle)) {
        found := true;
        buf := "";
      };
    };
    if (not found) return null;
    // buf now holds everything after the key — skip whitespace, ':', whitespace, '"'
    let afterKey = buf.trim(#predicate(func c = c == ' ' or c == ':' or c == '\t'));
    if (not afterKey.startsWith(#text "\"")) return null;
    let inner = afterKey.trimStart(#text "\"");
    // Take chars until the next unescaped '"'
    var value = "";
    var escaped = false;
    var done = false;
    for (c in inner.toIter()) {
      if (done) () else if (escaped) {
        value := value # Text.fromChar(c);
        escaped := false;
      } else if (c == '\\') {
        escaped := true;
      } else if (Char.equal(c, '\"')) {
        done := true;
      } else {
        value := value # Text.fromChar(c);
      };
    };
    if (done) ?value else null;
  };

  /// Extract an array of JSON objects as raw text chunks (naive, single-level).
  func extractJsonArray(json : Text, key : Text) : [Text] {
    let needle = "\"" # key # "\"";
    switch (json.split(#text needle).next()) {
      case null { return [] };
      case (?_)  {};
    };
    // Find the opening '[' after the key
    let parts = json.split(#text (needle # ":"));
    var rest = "";
    var first = true;
    for (p in parts) {
      if (first) { first := false } else { rest := p };
    };
    rest := rest.trimStart(#predicate(func c = c == ' ' or c == '\t'));
    if (not rest.startsWith(#text "[")) return [];
    // Collect each top-level '{...}' object
    var objects : [Text] = [];
    var depth = 0;
    var inObj = false;
    var current = "";
    var inString = false;
    var esc = false;
    for (ch in rest.toIter()) {
      if (esc) { esc := false; current := current # Text.fromChar(ch) }
      else if (inString) {
        current := current # Text.fromChar(ch);
        if (ch == '\\') { esc := true }
        else if (Char.equal(ch, '\"')) { inString := false };
      } else {
        if (Char.equal(ch, '\"')) { inString := true; current := current # Text.fromChar(ch) }
        else if (ch == '{') {
          depth += 1;
          inObj := true;
          current := current # "{";
        } else if (ch == '}') {
          depth -= 1;
          current := current # "}";
          if (depth == 0 and inObj) {
            objects := objects.concat([current]);
            current := "";
            inObj := false;
          };
        } else if (inObj) {
          current := current # Text.fromChar(ch);
        };
      };
    };
    objects;
  };

  /// Map a raw JSON severity string to a Severity variant.
  func parseSeverity(s : Text) : Types.Severity {
    let lower = s.toLower();
    if (lower == "low")      { #Low }
    else if (lower == "medium") { #Medium }
    else if (lower == "high")   { #High }
    else if (lower == "critical") { #Critical }
    else { #Unknown };
  };

  /// Parse a Microsoft.Security/alerts response body into RawFindings.
  func parseAlertFindings(json : Text, subscriptionId : Text) : [Types.RawFinding] {
    let objs = extractJsonArray(json, "value");
    objs.map(
      func(obj : Text) : Types.RawFinding {
        let findingId   = switch (extractJsonField(obj, "name"))         { case (?v) v; case null "" };
        let title       = switch (extractJsonField(obj, "alertDisplayName")) { case (?v) v; case null "unknown" };
        let description = switch (extractJsonField(obj, "description"))  { case (?v) v; case null "" };
        let severity    = switch (extractJsonField(obj, "severity"))      { case (?v) parseSeverity(v); case null #Unknown };
        {
          id          = "azure-alert-" # subscriptionId # "-" # findingId;
          provider    = #Azure;
          findingId;
          timestamp   = Time.now();
          severity;
          title;
          description;
          region      = null;
          accountId   = ?subscriptionId;
          rawMetadata = obj;
        };
      },
    );
  };

  /// Parse a Microsoft.Security/assessments response body into RawFindings.
  func parseAssessmentFindings(json : Text, subscriptionId : Text) : [Types.RawFinding] {
    let objs = extractJsonArray(json, "value");
    objs.map(
      func(obj : Text) : Types.RawFinding {
        let findingId   = switch (extractJsonField(obj, "name")) { case (?v) v; case null "" };
        let title       = switch (extractJsonField(obj, "displayName")) { case (?v) v; case null "unknown" };
        let description = switch (extractJsonField(obj, "description")) { case (?v) v; case null "" };
        {
          id          = "azure-assessment-" # subscriptionId # "-" # findingId;
          provider    = #Azure;
          findingId;
          timestamp   = Time.now();
          severity    = #Unknown;   // assessments don't carry a severity field
          title;
          description;
          region      = null;
          accountId   = ?subscriptionId;
          rawMetadata = obj;
        };
      },
    );
  };

  // ────────────────────────────────────────────────────────────────────────
  // Time helpers
  // ────────────────────────────────────────────────────────────────────────

  /// Convert an optional nanosecond timestamp to an ISO-8601 date-time string.
  /// Falls back to a 24-hour window when no prior poll is recorded.
  public func isoFromLastPoll(ts : ?Int) : Text {
    let nanos = switch (ts) {
      case (?t) { t };
      case null  { Time.now() - 86_400_000_000_000 };  // 24 h ago
    };
    let secs = nanos / 1_000_000_000;
    // Build a naive ISO-8601 string: YYYY-MM-DDTHH:MM:SSZ
    let secondsPerMin  = 60;
    let secondsPerHour = 3600;
    let secondsPerDay  = 86400;
    let days    = secs / secondsPerDay;
    let remSec  = secs - days * secondsPerDay;
    let hours   = remSec / secondsPerHour;
    let minutes = (remSec - hours * secondsPerHour) / secondsPerMin;
    let seconds = remSec - hours * secondsPerHour - minutes * secondsPerMin;
    // Epoch = 1970-01-01; compute calendar date
    let (year, month, day) = epochDaysToCal(days);
    pad4(year) # "-" # pad2(month) # "-" # pad2(day) # "T" #
    pad2(hours) # ":" # pad2(minutes) # ":" # pad2(seconds) # "Z";
  };

  func pad2(n : Int) : Text {
    if (n < 0) "00"
    else if (n < 10) "0" # n.toText()
    else n.toText();
  };

  func pad4(n : Int) : Text {
    if      (n < 0)    "0000"
    else if (n < 10)   "000" # n.toText()
    else if (n < 100)  "00"  # n.toText()
    else if (n < 1000) "0"   # n.toText()
    else n.toText();
  };

  /// Very small Gregorian calendar computation.
  func epochDaysToCal(days : Int) : (Int, Int, Int) {
    var y = 1970;
    var d = days;
    label outer loop {
      let diy = if (isLeap(y)) 366 else 365;
      if (d < diy) break outer;
      d -= diy;
      y += 1;
    };
    let months = if (isLeap(y))
      [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    else
      [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var m = 1;
    for (dm in months.vals()) {
      if (d < dm) return (y, m, d + 1);
      d -= dm;
      m += 1;
    };
    (y, 12, d + 1);
  };

  func isLeap(y : Int) : Bool {
    (y % 4 == 0 and y % 100 != 0) or (y % 400 == 0);
  };

  /// Sentinel passthrough — main.mo manages the azure cache variable directly.
  public func getUpdatedTokenCache(
    cache : ?{ token : Text; expiryNs : Int },
    _state : Types.ProviderPollingState
  ) : ?{ token : Text; expiryNs : Int } {
    cache;
  };
};
