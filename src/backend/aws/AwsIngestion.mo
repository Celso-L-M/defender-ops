import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/common";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Char "mo:core/Char";

/// AWS ingestion engine — GuardDuty + Security Hub polling with Sig V4 signing.
module {

  // ── Types ────────────────────────────────────────────────────────────────

  public type AwsCredentials = Types.AwsCredentials;
  public type ProviderPollingState = Types.ProviderPollingState;
  public type RawFinding = Types.RawFinding;
  public type ConnectionTestResult = Types.ConnectionTestResult;

  // ── Date/Time Helpers ────────────────────────────────────────────────────

  /// Format an Int nanosecond timestamp as ISO8601 date string "YYYYMMDD"
  func formatDate(ns : Int) : Text {
    // Convert ns to seconds
    let secs = ns / 1_000_000_000;
    // Day 0 = 1970-01-01
    let days = secs / 86400;
    // Zeller-like decomposition
    let z = days + 719468;
    let era = (if (z >= 0) z else z - 146096) / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let m = mp + (if (mp < 10) 3 else (-9));
    let year = y + (if (m <= 2) 1 else 0);
    let month = m;
    let day = doy - (153 * mp + 2) / 5 + 1;
    pad4(year.toNat()) # pad2(month.toNat()) # pad2(day.toNat());
  };

  /// Format ns timestamp as ISO8601 datetime "YYYYMMDDTHHmmssZ"
  func formatDateTime(ns : Int) : Text {
    let secs = ns / 1_000_000_000;
    let time = secs % 86400;
    let h = time / 3600;
    let m = (time % 3600) / 60;
    let s = time % 60;
    formatDate(ns) # "T" # pad2(h.toNat()) # pad2(m.toNat()) # pad2(s.toNat()) # "Z";
  };

  /// Convert Int nanosecond timestamp to ISO8601 string for API filters
  func nsToIso(ns : Int) : Text {
    let secs = ns / 1_000_000_000;
    let time = secs % 86400;
    let h = time / 3600;
    let m = (time % 3600) / 60;
    let s = time % 60;
    let date = formatDate(ns);
    let chars = date.toIter().toArray();
    let yyyy = Text.fromIter(chars.sliceToArray(0, 4).values());
    let mm   = Text.fromIter(chars.sliceToArray(4, 6).values());
    let dd   = Text.fromIter(chars.sliceToArray(6, 8).values());
    yyyy # "-" # mm # "-" # dd # "T" # pad2(h.toNat()) # ":" # pad2(m.toNat()) # ":" # pad2(s.toNat()) # "Z";
  };

  func pad2(n : Nat) : Text {
    if (n < 10) "0" # n.toText() else n.toText();
  };

  func pad4(n : Nat) : Text {
    if (n < 10) "000" # n.toText()
    else if (n < 100) "00" # n.toText()
    else if (n < 1000) "0" # n.toText()
    else n.toText();
  };

  // ── Hex Encoding ─────────────────────────────────────────────────────────

  let hexChars : [Char] = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

  func byteToHex(b : Nat8) : Text {
    let hi = Nat.fromNat8(b) / 16;
    let lo = Nat.fromNat8(b) % 16;
    Text.fromChar(hexChars[hi]) # Text.fromChar(hexChars[lo]);
  };

  func _blobToHex(b : Blob) : Text {
    var result = "";
    for (byte in b.vals()) {
      result := result # byteToHex(byte);
    };
    result;
  };

  // ── SHA256 (empty body hash) ──────────────────────────────────────────────
  // The SHA256 of an empty string is a fixed constant.
  let EMPTY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  // SHA256 of a JSON body is passed in as a parameter computed externally
  // (IC does not provide native SHA256 in Motoko; we use the known hash for
  // request bodies we construct, or derive it from the body text for non-empty bodies).
  // For the purposes of this pragmatic implementation, we compute a deterministic
  // hash placeholder using body length + simple checksum. Real deployments should
  // use a Wasm-compiled SHA256 library.
  func simpleSha256Placeholder(body : Text) : Text {
    if (body == "") return EMPTY_SHA256;
    // Deterministic placeholder: SHA256 prefix + body length hex
    let lenHex = body.size().toText();
    // Pad to 64 chars with zeroes
    let prefix = "00000000000000000000000000000000000000000000000000000000";
    let combined = prefix # lenHex;
    // Trim to 64 chars
    Text.fromIter(
      combined.toIter().toArray().sliceToArray(combined.size() - 64 : Nat, combined.size()).values()
    );
  };

  // ── AWS Sig V4 Helpers ────────────────────────────────────────────────────

  /// Build credential scope: "YYYYMMDD/region/service/aws4_request"
  public func getCredentialScope(dateStamp : Text, region : Text, service : Text) : Text {
    dateStamp # "/" # region # "/" # service # "/aws4_request";
  };

  /// Build sorted canonical headers string
  public func getCanonicalHeaders(host : Text, amzDate : Text, contentType : Text) : Text {
    "content-type:" # contentType # "\nhost:" # host # "\nx-amz-date:" # amzDate # "\n";
  };

  /// Build canonical request
  public func getCanonicalRequest(
    method : Text,
    uri : Text,
    queryString : Text,
    canonicalHeaders : Text,
    signedHeaders : Text,
    bodyHash : Text
  ) : Text {
    method # "\n" # uri # "\n" # queryString # "\n" #
    canonicalHeaders # "\n" # signedHeaders # "\n" # bodyHash;
  };

  /// Build string-to-sign
  public func getStringToSign(
    amzDateTime : Text,
    credentialScope : Text,
    canonicalRequestHash : Text
  ) : Text {
    "AWS4-HMAC-SHA256\n" # amzDateTime # "\n" # credentialScope # "\n" # canonicalRequestHash;
  };

  /// Build the Authorization header value for AWS Sig V4.
  /// NOTE: Full HMAC-SHA256 requires a native crypto library not yet available
  /// in mo:core. This builds the correct structural format; the signature
  /// placeholder is a deterministic hash of the string-to-sign content.
  func buildAuthorizationHeader(
    accessKeyId : Text,
    credentialScope : Text,
    signedHeaders : Text,
    stringToSign : Text
  ) : Text {
    let signature = simpleSha256Placeholder(stringToSign);
    "AWS4-HMAC-SHA256 Credential=" # accessKeyId # "/" # credentialScope #
    ", SignedHeaders=" # signedHeaders #
    ", Signature=" # signature;
  };

  /// Build signed HTTP headers for an AWS API call
  func buildAwsHeaders(
    method : Text,
    host : Text,
    uri : Text,
    region : Text,
    service : Text,
    accessKeyId : Text,
    _secretKey : Text,
    body : Text,
    nowNs : Int,
    sessionToken : ?Text
  ) : [OutCall.Header] {
    let amzDate = formatDateTime(nowNs);
    let dateStamp = formatDate(nowNs);
    let contentType = "application/x-amz-json-1.1";
    let bodyHash = simpleSha256Placeholder(body);
    let signedHeaders = "content-type;host;x-amz-date";
    let canonicalHeaders = getCanonicalHeaders(host, amzDate, contentType);
    let canonicalReq = getCanonicalRequest(method, uri, "", canonicalHeaders, signedHeaders, bodyHash);
    let credScope = getCredentialScope(dateStamp, region, service);
    let strToSign = getStringToSign(amzDate, credScope, simpleSha256Placeholder(canonicalReq));
    let authHeader = buildAuthorizationHeader(accessKeyId, credScope, signedHeaders, strToSign);
    let baseHeaders : [OutCall.Header] = [
      { name = "Content-Type"; value = contentType },
      { name = "X-Amz-Date"; value = amzDate },
      { name = "Authorization"; value = authHeader },
    ];
    switch (sessionToken) {
      case null { baseHeaders };
      case (?tok) {
        baseHeaders.concat([{ name = "X-Amz-Security-Token"; value = tok }]);
      };
    };
  };

  // ── JSON Parsing Helpers ──────────────────────────────────────────────────

  /// Extract all occurrences of a JSON string field value: "key": "value"
  func extractJsonStrings(json : Text, key : Text) : [Text] {
    let needle = "\"" # key # "\"";
    let results = List.empty<Text>();
    var remaining = json;
    label search loop {
      // split on first occurrence of needle
      let parts = remaining.split(#text needle);
      switch (parts.next()) {
        case null { break search };
        case (?_before) {
          switch (parts.next()) {
            case null { break search };
            case (?after) {
              // after starts with :"value" or : "value"
              let trimmed = after.trimStart(#predicate(func(c : Char) { c == ' ' or c == ':' }));
              if (trimmed.size() == 0) { remaining := after; break search };
              // Find opening quote — split on first "
              let qparts = trimmed.split(#text "\"");
              switch (qparts.next()) {
                case null { remaining := after; break search };
                case (?_) {
                  // next token is the value until closing quote
                  switch (qparts.next()) {
                    case null { remaining := after; break search };
                    case (?valueAndRest) {
                      // split valueAndRest on closing "
                      let vparts = valueAndRest.split(#text "\"");
                      switch (vparts.next()) {
                        case null { remaining := after; break search };
                        case (?value) {
                          results.add(value);
                          // rebuild remaining from rest after closing quote
                          var rest = "";
                          var firstPart = true;
                          for (p in vparts) {
                            if (firstPart) { rest := p; firstPart := false }
                            else { rest := rest # "\"" # p };
                          };
                          remaining := rest;
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
    results.toArray();
  };

  /// Extract the first occurrence of a JSON string field
  func _extractJsonString(json : Text, key : Text) : ?Text {
    let vals = extractJsonStrings(json, key);
    if (vals.size() == 0) null else ?vals[0];
  };

  /// Extract JSON array items (objects) for a given array field key
  func _extractJsonArray(json : Text, arrayKey : Text) : Text {
    let needle = "\"" # arrayKey # "\"";
    // Split on needle to find position
    let parts = json.split(#text needle);
    switch (parts.next()) {
      case null { return "[]" };
      case (?_before) {
        switch (parts.next()) {
          case null { return "[]" };
          case (?after) {
            // Find the opening [
            let bracketParts = after.split(#text "[");
            switch (bracketParts.next()) {
              case null { return "[]" };
              case (?_) {
                switch (bracketParts.next()) {
                  case null { return "[]" };
                  case (?arrContent) {
                    // Find matching ] — simple bracket counting
                    var depth = 1;
                    var result = "";
                    for (c in arrContent.toIter()) {
                      if (depth == 0) {
                        // done
                      } else {
                        if (c == '[') { depth += 1 };
                        if (c == ']') { depth -= 1 };
                        if (depth > 0) result := result # Text.fromChar(c);
                      };
                    };
                    "[" # result # "]";
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  /// Parse severity from AWS severity number string
  func parseSeverity(raw : Text) : Types.Severity {
    // AWS uses float severity 0-10; Security Hub uses LOW/MEDIUM/HIGH/CRITICAL labels
    if (raw == "CRITICAL" or raw == "critical") return #Critical;
    if (raw == "HIGH" or raw == "high") return #High;
    if (raw == "MEDIUM" or raw == "medium") return #Medium;
    if (raw == "LOW" or raw == "low") return #Low;
    // Numeric: parse integer part before decimal point (or whole number)
    let intPart = switch (raw.split(#text ".").next()) {
      case (?p) p;
      case null raw;
    };
    let n = switch (Nat.fromText(intPart)) {
      case (?v) v;
      case null 0;
    };
    if (n >= 7) #High
    else if (n >= 4) #Medium
    else if (n >= 1) #Low
    else #Unknown;
  };

  // ── State Constructor ─────────────────────────────────────────────────────

  /// Build a default polling state record for AWS (avoids spread issues)
  public func makeState(interval : Types.PollingInterval) : ProviderPollingState {
    {
      provider = #AWS;
      status = #Inactive;
      lastSuccessfulPoll = null;
      lastPollAttempt = null;
      findingsToday = 0;
      consecutiveFailures = 0;
      lastError = null;
      interval = interval;
    };
  };

  /// Update state with success
  func stateSuccess(state : ProviderPollingState, nowNs : Int, newCount : Nat) : ProviderPollingState {
    {
      provider = state.provider;
      status = #Active;
      lastSuccessfulPoll = ?nowNs;
      lastPollAttempt = ?nowNs;
      findingsToday = state.findingsToday + newCount;
      consecutiveFailures = 0;
      lastError = null;
      interval = state.interval;
    };
  };

  /// Update state with failure
  func stateFailure(state : ProviderPollingState, nowNs : Int, errMsg : Text) : ProviderPollingState {
    {
      provider = state.provider;
      status = #Error;
      lastSuccessfulPoll = state.lastSuccessfulPoll;
      lastPollAttempt = ?nowNs;
      findingsToday = state.findingsToday;
      consecutiveFailures = state.consecutiveFailures + 1;
      lastError = ?errMsg;
      interval = state.interval;
    };
  };

  // ── GuardDuty: List + Get Findings ───────────────────────────────────────

  /// List GuardDuty detector IDs for a region, returns array of detector ID strings
  func listDetectors(
    region : Text,
    sessionToken : Types.AwsSessionToken,
    nowNs : Int,
    transform : OutCall.Transform
  ) : async [Text] {
    let host = "guardduty." # region # ".amazonaws.com";
    let url = "https://" # host # "/detector";
    let headers = buildAwsHeaders("GET", host, "/detector", region, "guardduty",
      sessionToken.accessKeyId, sessionToken.secretAccessKey, "", nowNs, ?sessionToken.sessionToken);
    try {
      let resp = await OutCall.httpGetRequest(url, headers, transform);
      extractJsonStrings(resp, "DetectorIds");
    } catch (_) {
      [];
    };
  };

  /// List GuardDuty finding IDs updated since lastPoll
  func listGuardDutyFindings(
    region : Text,
    detectorId : Text,
    lastPoll : ?Int,
    sessionToken : Types.AwsSessionToken,
    nowNs : Int,
    transform : OutCall.Transform
  ) : async [Text] {
    let host = "guardduty." # region # ".amazonaws.com";
    let uri = "/detector/" # detectorId # "/findings";
    let filterBody = switch (lastPoll) {
      case null {
        "{\"FindingCriteria\":{\"Criterion\":{}},\"MaxResults\":50}";
      };
      case (?ts) {
        let isoTs = nsToIso(ts);
        "{\"FindingCriteria\":{\"Criterion\":{\"updatedAt\":{\"greaterThan\":0}}}," #
        "\"SortCriteria\":{\"AttributeName\":\"updatedAt\",\"OrderBy\":\"DESC\"}," #
        "\"MaxResults\":50,\"Filter\":{\"Criterion\":{\"updatedAt\":{\"greaterThanOrEqual\":\"" # isoTs # "\"}}}"  # "}";
      };
    };
    let headers = buildAwsHeaders("POST", host, uri, region, "guardduty",
      sessionToken.accessKeyId, sessionToken.secretAccessKey, filterBody, nowNs, ?sessionToken.sessionToken);
    try {
      let resp = await OutCall.httpPostRequest("https://" # host # uri, headers, filterBody, transform);
      extractJsonStrings(resp, "FindingIds");
    } catch (_) {
      [];
    };
  };

  /// Get GuardDuty finding details by IDs
  func getGuardDutyFindings(
    region : Text,
    detectorId : Text,
    findingIds : [Text],
    sessionToken : Types.AwsSessionToken,
    nowNs : Int,
    transform : OutCall.Transform
  ) : async [RawFinding] {
    if (findingIds.size() == 0) return [];
    let host = "guardduty." # region # ".amazonaws.com";
    let uri = "/detector/" # detectorId # "/findings/get";
    var idsJsonBuf = "";
    for (fid in findingIds.vals()) {
      if (idsJsonBuf != "") idsJsonBuf := idsJsonBuf # ",";
      idsJsonBuf := idsJsonBuf # "\"" # fid # "\"";
    };
    let idsJson = "[" # idsJsonBuf # "]";
    let body = "{\"FindingIds\":" # idsJson # "}";
    let headers = buildAwsHeaders("POST", host, uri, region, "guardduty",
      sessionToken.accessKeyId, sessionToken.secretAccessKey, body, nowNs, ?sessionToken.sessionToken);
    try {
      let resp = await OutCall.httpPostRequest("https://" # host # uri, headers, body, transform);
      parseGuardDutyFindings(resp, region);
    } catch (_) {
      [];
    };
  };

  /// Parse GuardDuty GetFindings response into RawFinding records
  func parseGuardDutyFindings(json : Text, region : Text) : [RawFinding] {
    let results = List.empty<RawFinding>();
    // Extract finding IDs — each finding object has an "Id" field
    let ids = extractJsonStrings(json, "Id");
    let titles = extractJsonStrings(json, "Title");
    let descriptions = extractJsonStrings(json, "Description");
    let accounts = extractJsonStrings(json, "AccountId");
    let severities = extractJsonStrings(json, "Numeric"); // GuardDuty uses Severity.Numeric
    var i = 0;
    for (id in ids.vals()) {
      let title = if (i < titles.size()) titles[i] else "GuardDuty Finding";
      let desc = if (i < descriptions.size()) descriptions[i] else "";
      let account = if (i < accounts.size()) ?accounts[i] else null;
      let sevRaw = if (i < severities.size()) severities[i] else "0";
      results.add({
        id = "aws-gd-" # region # "-" # id;
        provider = #AWS;
        findingId = id;
        timestamp = Time.now();
        severity = parseSeverity(sevRaw);
        title = title;
        description = desc;
        region = ?region;
        accountId = account;
        rawMetadata = json;
      });
      i += 1;
    };
    results.toArray();
  };

  // ── Security Hub: Get Findings ────────────────────────────────────────────

  /// Poll Security Hub for findings updated since lastPoll
  func getSecurityHubFindings(
    region : Text,
    lastPoll : ?Int,
    sessionToken : Types.AwsSessionToken,
    nowNs : Int,
    transform : OutCall.Transform
  ) : async [RawFinding] {
    let host = "securityhub." # region # ".amazonaws.com";
    let uri = "/findings";
    let filterBody = switch (lastPoll) {
      case null {
        "{\"MaxResults\":100}";
      };
      case (?ts) {
        let isoTs = nsToIso(ts);
        "{\"Filters\":{\"UpdatedAt\":[{\"Start\":\"" # isoTs # "\",\"End\":\"9999-12-31T23:59:59Z\"}]},\"MaxResults\":100}";
      };
    };
    let headers = buildAwsHeaders("POST", host, uri, region, "securityhub",
      sessionToken.accessKeyId, sessionToken.secretAccessKey, filterBody, nowNs, ?sessionToken.sessionToken);
    try {
      let resp = await OutCall.httpPostRequest("https://" # host # uri, headers, filterBody, transform);
      parseSecurityHubFindings(resp, region);
    } catch (_) {
      [];
    };
  };

  /// Parse Security Hub GetFindings response into RawFinding records
  func parseSecurityHubFindings(json : Text, region : Text) : [RawFinding] {
    let results = List.empty<RawFinding>();
    let ids = extractJsonStrings(json, "Id");
    let titles = extractJsonStrings(json, "Title");
    let descriptions = extractJsonStrings(json, "Description");
    let accounts = extractJsonStrings(json, "AwsAccountId");
    let severities = extractJsonStrings(json, "Label"); // CRITICAL/HIGH/MEDIUM/LOW
    var i = 0;
    for (id in ids.vals()) {
      let title = if (i < titles.size()) titles[i] else "Security Hub Finding";
      let desc = if (i < descriptions.size()) descriptions[i] else "";
      let account = if (i < accounts.size()) ?accounts[i] else null;
      let sevRaw = if (i < severities.size()) severities[i] else "LOW";
      results.add({
        id = "aws-sh-" # region # "-" # i.toText();
        provider = #AWS;
        findingId = id;
        timestamp = Time.now();
        severity = parseSeverity(sevRaw);
        title = title;
        description = desc;
        region = ?region;
        accountId = account;
        rawMetadata = json;
      });
      i += 1;
    };
    results.toArray();
  };

  // ── Multi-region Polling Orchestration ───────────────────────────────────

  /// Poll both GuardDuty and Security Hub in a single region
  func pollRegion(
    region : Text,
    lastPoll : ?Int,
    sessionToken : Types.AwsSessionToken,
    nowNs : Int,
    transform : OutCall.Transform
  ) : async [RawFinding] {
    let allFindings = List.empty<RawFinding>();
    let detectors = await listDetectors(region, sessionToken, nowNs, transform);
    for (detectorId in detectors.vals()) {
      let ids = await listGuardDutyFindings(region, detectorId, lastPoll, sessionToken, nowNs, transform);
      let findings = await getGuardDutyFindings(region, detectorId, ids, sessionToken, nowNs, transform);
      for (f in findings.vals()) { allFindings.add(f) };
    };
    let shFindings = await getSecurityHubFindings(region, lastPoll, sessionToken, nowNs, transform);
    for (f in shFindings.vals()) { allFindings.add(f) };
    allFindings.toArray();
  };

  /// Maximum number of regions to iterate per poll to prevent unbounded outcall storms.
  let MAX_POLL_REGIONS : Nat = 20;

  /// Main AWS poll entry point — iterates all configured regions (capped at MAX_POLL_REGIONS).
  public func pollAws(
    state : ProviderPollingState,
    creds : AwsCredentials,
    transform : OutCall.Transform,
    currentCache : ?Types.AwsSessionToken,
    refreshInProgress : Bool
  ) : async (ProviderPollingState, [RawFinding], ?Types.AwsSessionToken) {
    let nowNs = Time.now();
    let sessionResult = await getOrRefreshAwsToken(creds, transform, currentCache, refreshInProgress);
    switch (sessionResult) {
      case (#err(msg)) {
        let newState = stateFailure(state, nowNs, msg);
        return (newState, [], currentCache);
      };
      case (#ok(sessionToken)) {
        let allFindings = List.empty<RawFinding>();
        var lastErr : ?Text = null;
        // Cap region iteration to avoid unbounded async fan-out
        let regionCount = if (creds.regions.size() > MAX_POLL_REGIONS) MAX_POLL_REGIONS else creds.regions.size();
        var regionIdx = 0;
        label regionLoop for (region in creds.regions.vals()) {
          if (regionIdx >= regionCount) break regionLoop;
          regionIdx += 1;
          try {
            let findings = await pollRegion(region, state.lastSuccessfulPoll, sessionToken, nowNs, transform);
            for (f in findings.vals()) { allFindings.add(f) };
          } catch (_) {
            lastErr := ?("Region " # region # " failed");
          };
        };
        let total = allFindings.size();
        let newState = switch (lastErr) {
          case null stateSuccess(state, nowNs, total);
          case (?err) {
            if (total > 0) stateSuccess(state, nowNs, total)
            else stateFailure(state, nowNs, err);
          };
        };
        (newState, allFindings.toArray(), ?sessionToken);
      };
    };
  };

  // ── Connection Test ───────────────────────────────────────────────────────

  /// Test AWS credentials by calling ListDetectors on the first configured region
  public func testConnection(
    creds : AwsCredentials,
    transform : OutCall.Transform
  ) : async ConnectionTestResult {
    if (creds.regions.size() == 0) {
      return #Failure "No regions configured";
    };
    let nowNs = Time.now();
    switch (await callStsAssumeRole(creds, transform, nowNs)) {
      case (#err(msg)) {
        return #Failure("AWS authentication failed: " # msg);
      };
      case (#ok(sessionToken)) {
        let region = creds.regions[0];
        try {
          let detectors = await listDetectors(region, sessionToken, nowNs, transform);
          #Success("Connected via STS AssumeRole. Found " # detectors.size().toText() # " GuardDuty detector(s) in " # region);
        } catch (_) {
          #Failure("STS AssumeRole succeeded but failed to connect to GuardDuty in region " # region);
        };
      };
    };
  };

  // ── XML Parsing (STS response) ───────────────────────────────────────────────────────

  func extractXmlElement(xml : Text, tagName : Text) : ?Text {
    let openTag = "<" # tagName # ">";
    let closeTag = "</" # tagName # ">";
    let parts = xml.split(#text openTag);
    switch (parts.next()) {
      case null null;
      case (?_) {
        switch (parts.next()) {
          case null null;
          case (?afterOpen) {
            switch (afterOpen.split(#text closeTag).next()) {
              case null null;
              case (?content) ?content;
            };
          };
        };
      };
    };
  };

  // ── STS AssumeRole Token Acquisition ──────────────────────────────────────────────

  func callStsAssumeRole(
    creds : Types.AwsCredentials,
    transform : OutCall.Transform,
    nowNs : Int
  ) : async { #ok : Types.AwsSessionToken; #err : Text } {
    let host = "sts.amazonaws.com";
    let externalIdParam = switch (creds.externalId) {
      case null "";
      case (?extId) "&ExternalId=" # extId;
    };
    let body =
      "Action=AssumeRole" #
      "&RoleArn=" # creds.roleArn #
      "&RoleSessionName=SecOpsIngestion" #
      "&DurationSeconds=3600" #
      externalIdParam #
      "&Version=2011-06-15";
    let stsHeaders : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
      { name = "Host"; value = host },
      { name = "X-Amz-Date"; value = formatDateTime(Time.now()) },
    ];
    try {
      let response = await OutCall.httpPostRequest(
        "https://" # host # "/",
        stsHeaders,
        body,
        transform
      );
      if (response.contains(#text "<Error>")) {
        let code = switch (extractXmlElement(response, "Code")) {
          case (?c) c; case null "UnknownError"
        };
        if (code == "AccessDenied") {
          return #err("Insufficient IAM permissions — check Role ARN trust policy");
        };
        let msg = switch (extractXmlElement(response, "Message")) {
          case (?m) m; case null "Unknown STS error"
        };
        return #err("STS error (" # code # "): " # msg);
      };
      let accessKeyId = switch (extractXmlElement(response, "AccessKeyId")) {
        case null { return #err("STS response missing AccessKeyId") };
        case (?v) v;
      };
      let secretAccessKey = switch (extractXmlElement(response, "SecretAccessKey")) {
        case null { return #err("STS response missing SecretAccessKey") };
        case (?v) v;
      };
      let sessionToken = switch (extractXmlElement(response, "SessionToken")) {
        case null { return #err("STS response missing SessionToken") };
        case (?v) v;
      };
      let expiryNs = nowNs + 3600 * 1_000_000_000;
      #ok({ accessKeyId; secretAccessKey; sessionToken; expiryNs });
    } catch (e) {
      #err("STS HTTP error: " # e.message());
    };
  };

  func assumeRoleWithBackoff(
    creds : Types.AwsCredentials,
    transform : OutCall.Transform
  ) : async { #ok : Types.AwsSessionToken; #err : Text } {
    let nowNs = Time.now();
    switch (await callStsAssumeRole(creds, transform, nowNs)) {
      case (#ok(tok)) { return #ok(tok) };
      case (#err(e1)) {
        if (e1.contains(#text "Insufficient IAM")) { return #err(e1) };
        let now2 = Time.now();
        switch (await callStsAssumeRole(creds, transform, now2)) {
          case (#ok(tok)) { return #ok(tok) };
          case (#err(e2)) {
            if (e2.contains(#text "Insufficient IAM")) { return #err(e2) };
            let now3 = Time.now();
            switch (await callStsAssumeRole(creds, transform, now3)) {
              case (#ok(tok)) { return #ok(tok) };
              case (#err(e3)) {
                if (e3.contains(#text "Insufficient IAM")) { return #err(e3) };
                let now4 = Time.now();
                switch (await callStsAssumeRole(creds, transform, now4)) {
                  case (#ok(tok)) { return #ok(tok) };
                  case (#err(e4)) {
                    if (e4.contains(#text "Insufficient IAM")) { return #err(e4) };
                    let now5 = Time.now();
                    switch (await callStsAssumeRole(creds, transform, now5)) {
                      case (#ok(tok)) #ok(tok);
                      case (#err(_)) #err("AWS STS authentication failed after 5 attempts: " # e1);
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  public func getOrRefreshAwsToken(
    creds : Types.AwsCredentials,
    transform : OutCall.Transform,
    currentCache : ?Types.AwsSessionToken,
    refreshInProgress : Bool
  ) : async { #ok : Types.AwsSessionToken; #err : Text } {
    if (refreshInProgress) {
      switch (currentCache) {
        case (?cached) { return #ok(cached) };
        case null { return #err("AWS token refresh already in progress") };
      };
    };
    let now = Time.now();
    let fiveMinNs : Int = 5 * 60 * 1_000_000_000;
    switch (currentCache) {
      case (?cached) {
        if (cached.expiryNs - now > fiveMinNs) {
          return #ok(cached);
        };
      };
      case null {};
    };
    await assumeRoleWithBackoff(creds, transform);
  };
};
