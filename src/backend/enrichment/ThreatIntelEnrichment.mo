/// Threat Intelligence Enrichment Module
/// Enriches normalized alerts with MITRE ATT&CK, AbuseIPDB, VirusTotal, and
/// a local known-malicious-IP feed from Emerging Threats.
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/common";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {

  // ── Helpers ────────────────────────────────────────────────────────────────

  /// Minimal JSON string field extractor.
  func extractJsonStr(json : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\":\"";
    let parts = json.split(#text needle);
    var idx = 0;
    var after = "";
    for (p in parts) {
      if (idx == 1) { after := p };
      idx := idx + 1;
    };
    if (idx < 2) return null;
    let valParts = after.split(#text "\"");
    var first = true;
    for (vp in valParts) {
      if (first) { return ?vp };
      first := false;
    };
    null;
  };

  /// Extract a JSON integer field as Nat (first occurrence).
  func extractJsonNat(json : Text, key : Text) : Nat {
    let needle1 = "\"" # key # "\":";
    let needle2 = "\"" # key # "\": ";
    func findIn(src : Text, needle : Text) : Nat {
      let parts = src.split(#text needle);
      var idx = 0;
      var after = "";
      for (p in parts) {
        if (idx == 1) { after := p };
        idx := idx + 1;
      };
      if (idx < 2) return 0;
      var result : Nat = 0;
      for (c in after.chars()) {
        if (c >= '0' and c <= '9') {
          result := result * 10 + (if (c == '0') 0 else if (c == '1') 1 else if (c == '2') 2
            else if (c == '3') 3 else if (c == '4') 4 else if (c == '5') 5
            else if (c == '6') 6 else if (c == '7') 7 else if (c == '8') 8 else 9);
        } else {
          return result;
        };
      };
      result;
    };
    let v1 = findIn(json, needle1);
    if (v1 > 0) return v1;
    findIn(json, needle2);
  };

  /// Validate that a URL starts with https:// (A05 security check).
  func isHttps(url : Text) : Bool {
    url.startsWith(#text "https://");
  };

  /// Try to extract a source IP from alert description or assetId.
  /// Returns null if nothing looks like an IPv4 address.
  public func extractIpFromAlert(alert : Types.NormalizedAlert) : ?Text {
    // Check assetId first
    switch (alert.assetId) {
      case (?aid) {
        if (looksLikeIp(aid)) return ?aid;
      };
      case null {};
    };
    // Scan description for an IPv4-like pattern
    extractIpFromText(alert.description);
  };

  /// Extract first IPv4-looking string from text (naive scan).
  func extractIpFromText(t : Text) : ?Text {
    var word = "";
    var result : ?Text = null;
    for (c in t.chars()) {
      if ((c >= '0' and c <= '9') or c == '.') {
        word := word # Text.fromChar(c);
      } else {
        if (looksLikeIp(word)) {
          result := ?word;
        };
        word := "";
      };
    };
    if (looksLikeIp(word)) { result := ?word };
    result;
  };

  /// Returns true if the string looks like an IPv4 address (has 3 dots, all numeric).
  public func looksLikeIp(s : Text) : Bool {
    var dots = 0;
    var allNumericOrDot = true;
    for (c in s.chars()) {
      if (c == '.') { dots := dots + 1 } else if (c < '0' or c > '9') { allNumericOrDot := false };
    };
    allNumericOrDot and dots == 3 and s.size() >= 7;
  };

  /// Extract first domain/URL from alert description (looks for http:// or https:// or *.tld).
  public func extractDomainFromAlert(alert : Types.NormalizedAlert) : ?Text {
    let desc = alert.description;
    if (desc.contains(#text "https://") or desc.contains(#text "http://")) {
      // Extract the URL token
      let marker = if (desc.contains(#text "https://")) "https://" else "http://";
      let parts = desc.split(#text marker);
      var idx = 0;
      var after = "";
      for (p in parts) {
        if (idx == 1) { after := p };
        idx := idx + 1;
      };
      if (after == "") return null;
      // URL ends at first space or quote
      var url = "";
      for (c in after.chars()) {
        if (c == ' ' or Text.fromChar(c) == "\"" or Text.fromChar(c) == "'" or c == '>' or c == ')') {
          return ?(marker # url);
        };
        url := url # Text.fromChar(c);
      };
      return ?(marker # url);
    };
    null;
  };

  // ── MITRE ATT&CK Enrichment ────────────────────────────────────────────────

  /// Query the MITRE ATT&CK TAXII server for a technique ID.
  /// Returns MitreDetail or null if not found / API error.
  public func enrichMitre(
    techniqueId : Text,
    transform   : OutCall.Transform,
  ) : async ?Types.MitreDetail {
    if (techniqueId == "") return null;
    let url = "https://cti-taxii.mitre.org/taxii/";
    if (not isHttps(url)) return null;
    let headers : [OutCall.Header] = [
      { name = "Accept"; value = "application/taxii+json;version=2.1" },
    ];
    try {
      let raw = await OutCall.httpGetRequest(url, headers, transform);
      // Extract relevant fields — TAXII response is complex; extract what we can
      let tacticName    = switch (extractJsonStr(raw, "tactic_refs")) { case (?v) v; case null "" };
      let techniqueName = switch (extractJsonStr(raw, "name")) { case (?v) v; case null techniqueId };
      let description   = switch (extractJsonStr(raw, "description")) { case (?v) v; case null "" };
      let mitigations   = switch (extractJsonStr(raw, "x_mitre_detection")) { case (?v) v; case null "" };
      ?{
        tacticName;
        techniqueName;
        description;
        mitigations;
      };
    } catch (_) {
      null;
    };
  };

  // ── AbuseIPDB Enrichment ───────────────────────────────────────────────────

  /// Query AbuseIPDB for IP reputation data.
  public func enrichIpReputation(
    ip        : Text,
    apiKey    : Text,
    transform : OutCall.Transform,
  ) : async ?Types.IpReputation {
    if (ip == "" or apiKey == "") return null;
    let url = "https://api.abuseipdb.com/api/v2/check?ipAddress=" # ip # "&maxAgeInDays=90";
    if (not isHttps(url)) return null;
    // A03: validate IP looks reasonable before use in URL
    if (not looksLikeIp(ip)) return null;
    let headers : [OutCall.Header] = [
      { name = "Key"; value = apiKey },
      { name = "Accept"; value = "application/json" },
    ];
    try {
      let raw = await OutCall.httpGetRequest(url, headers, transform);
      // Parse the data wrapper
      let abuseScore   = extractJsonNat(raw, "abuseConfidenceScore");
      let country      = switch (extractJsonStr(raw, "countryCode")) { case (?v) v; case null "" };
      let isp          = switch (extractJsonStr(raw, "isp")) { case (?v) v; case null "" };
      let totalReports = extractJsonNat(raw, "totalReports");
      let lastReported = switch (extractJsonStr(raw, "lastReportedAt")) { case (?v) v; case null "" };
      ?{ abuseScore; country; isp; totalReports; lastReported };
    } catch (_) {
      null;
    };
  };

  // ── VirusTotal Domain/URL Enrichment ──────────────────────────────────────

  /// Query VirusTotal for domain/URL reputation.
  public func enrichDomainRep(
    url_      : Text,
    apiKey    : Text,
    transform : OutCall.Transform,
  ) : async ?Types.DomainRep {
    if (url_ == "" or apiKey == "") return null;
    // Use the URL analysis endpoint
    let vtUrl = "https://www.virustotal.com/api/v3/urls";
    if (not isHttps(vtUrl)) return null;
    let headers : [OutCall.Header] = [
      { name = "x-apikey"; value = apiKey },
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
    ];
    let body = "url=" # url_;
    try {
      let raw = await OutCall.httpPostRequest(vtUrl, headers, body, transform);
      let maliciousVotes   = extractJsonNat(raw, "malicious");
      let suspiciousVotes  = extractJsonNat(raw, "suspicious");
      let cleanVotes       = extractJsonNat(raw, "undetected");
      let lastAnalysisDate = switch (extractJsonStr(raw, "last_analysis_date")) { case (?v) v; case null "" };
      ?{ maliciousVotes; suspiciousVotes; cleanVotes; lastAnalysisDate };
    } catch (_) {
      null;
    };
  };

  // ── Known Malicious IP Feed ────────────────────────────────────────────────

  /// Fetch the Emerging Threats IP blocklist and return parsed IP entries.
  public func fetchMaliciousIpFeed(
    transform : OutCall.Transform,
  ) : async [Text] {
    let url = "https://rules.emergingthreats.net/fwrules/emerging-Block-IPs.txt";
    if (not isHttps(url)) return [];
    try {
      let raw = await OutCall.httpGetRequest(url, [], transform);
      parseMaliciousIpLines(raw);
    } catch (_) {
      [];
    };
  };

  /// Parse newline-separated IP list, skipping comment lines (#).
  public func parseMaliciousIpLines(text : Text) : [Text] {
    var result : [Text] = [];
    let lines = text.split(#char '\n');
    for (line in lines) {
      let trimmed = line.trimStart(#char ' ').trimEnd(#char ' ').trimEnd(#char '\r');
      if (trimmed.size() > 0 and not trimmed.startsWith(#text "#")) {
        result := result.concat([trimmed]);
      };
    };
    result;
  };

  /// Check if an IP is in the malicious feed.
  public func isKnownMalicious(ip : Text, feed : [Text]) : Bool {
    feed.find(func(entry) { Text.equal(entry, ip) }) != null;
  };

  // ── Main enrichment function ───────────────────────────────────────────────

  /// Run all enrichment sources for an alert and return the combined result.
  /// Keys may be empty strings if not configured — that check is the caller's responsibility.
  public func enrichAlert(
    alert         : Types.NormalizedAlert,
    abuseIpdbKey  : Text,
    virusTotalKey : Text,
    maliciousFeed : [Text],
    transform     : OutCall.Transform,
  ) : async Types.AlertEnrichment {
    // 1. MITRE detail
    let mitreDetail : ?Types.MitreDetail = switch (alert.mitre) {
      case (?m) {
        if (m.techniqueId != "") {
          await enrichMitre(m.techniqueId, transform);
        } else null;
      };
      case null null;
    };

    // 2. IP reputation
    let sourceIp = extractIpFromAlert(alert);
    let ipReputation : ?Types.IpReputation = switch (sourceIp) {
      case (?ip) {
        if (abuseIpdbKey != "") {
          await enrichIpReputation(ip, abuseIpdbKey, transform);
        } else null;
      };
      case null null;
    };

    // 3. Domain/URL reputation
    let domainUrl = extractDomainFromAlert(alert);
    let domainRep : ?Types.DomainRep = switch (domainUrl) {
      case (?url_) {
        if (virusTotalKey != "") {
          await enrichDomainRep(url_, virusTotalKey, transform);
        } else null;
      };
      case null null;
    };

    // 4. Known malicious IP check
    let knownMaliciousIp : Bool = switch (sourceIp) {
      case (?ip) isKnownMalicious(ip, maliciousFeed);
      case null false;
    };

    let enrichedAt : ?Text = ?(Time.now().toText());

    {
      mitreDetail;
      ipReputation;
      domainRep;
      knownMaliciousIp;
      enrichedAt;
    };
  };

};
