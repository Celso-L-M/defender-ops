import Text "mo:core/Text";
import Types "../types/common";

module {

  public type RawFinding      = Types.RawFinding;
  public type ProviderType    = Types.ProviderType;
  public type NormalizedAlert = Types.NormalizedAlert;
  public type MitreTag        = Types.MitreTag;

  // ── Private helpers ────────────────────────────────────────────────────────

  /// Severity variant → its label text
  private func _severityText(s : Types.Severity) : Text {
    switch s {
      case (#Low)      "Low";
      case (#Medium)   "Medium";
      case (#High)     "High";
      case (#Critical) "Critical";
      case (#Unknown)  "Unknown";
    };
  };

  /// Provider variant → provider label text (for building the composite alert id)
  private func _providerText(p : Types.ProviderType) : Text {
    switch p {
      case (#AWS)   "AWS";
      case (#Azure) "Azure";
      case (#GCP)   "GCP";
    };
  };

  /// Naive JSON-field extractor: looks for `"key":"value"` or `"key": "value"`
  /// and returns the first value found, or null.
  private func extractJsonField(json : Text, key : Text) : ?Text {
    let needle1 = "\"" # key # "\":\"";
    let needle2 = "\"" # key # "\": \"";
    func findIn(src : Text, needle : Text) : ?Text {
      let iter = src.split(#text needle);
      var count = 0;
      var after = "";
      for (p in iter) {
        if (count == 1) { after := p };
        count += 1;
      };
      if (count < 2) return null;
      // after starts right after the opening quote of the value
      let valIter = after.split(#text "\"");
      var idx = 0;
      var result : ?Text = null;
      for (vp in valIter) {
        if (idx == 0) { result := ?vp };
        idx += 1;
      };
      result;
    };
    switch (findIn(json, needle1)) {
      case (?v) ?v;
      case null  findIn(json, needle2);
    };
  };

  /// Try to extract assetId and assetType from rawMetadata.
  /// Falls back to (accountId, null) if nothing is found.
  private func _extractAssetInfo(meta : Text, accountId : ?Text) : (?Text, ?Text) {
    let idOpt =
      switch (extractJsonField(meta, "resourceId")) {
        case (?v) ?v;
        case null {
          switch (extractJsonField(meta, "instanceId")) {
            case (?v) ?v;
            case null  accountId;
          };
        };
      };
    let typeOpt = extractJsonField(meta, "resourceType");
    (idOpt, typeOpt);
  };

  /// Title-based MITRE lookup shared by GCP SCC and Security Hub.


  // ── Public API ─────────────────────────────────────────────────────────────

  /// Map provider-native severities to the unified Severity variant,
  /// extract asset fields from rawMetadata, and attach a MITRE tag when available.
  /// ingestionSource: ?{ #Poll; #Webhook } — how the finding arrived.
  public func normalizeRawFinding(rawFinding : RawFinding, ingestionSource : ?{ #Poll; #Webhook }) : NormalizedAlert {
    // Derive a stable composite ID from provider + findingId
    let provText = switch (rawFinding.provider) {
      case (#AWS)   "AWS";
      case (#Azure) "Azure";
      case (#GCP)   "GCP";
    };
    let id = provText # "-" # rawFinding.findingId;

    // Capture raw severity text before mapping
    let originalSeverity = switch (rawFinding.severity) {
      case (#Low)      "LOW";
      case (#Medium)   "MEDIUM";
      case (#High)     "HIGH";
      case (#Critical) "CRITICAL";
      case (#Unknown)  "UNKNOWN";
    };

    // Extract asset fields from rawMetadata using simple key=value scanning.
    // rawMetadata is a JSON-like flat string; we look for common keys.
    let assetId   = extractField(rawFinding.rawMetadata, "assetId");
    let assetType = extractField(rawFinding.rawMetadata, "assetType");

    // Derive MITRE tag from provider + finding type
    let mitre = getMitreTag(rawFinding.provider, rawFinding.title, rawFinding.rawMetadata);

    // Extract customer field (default to accountId or "default")
    let customer = switch (rawFinding.accountId) {
      case (?acct) acct;
      case null    "default";
    };

    {
      id;
      provider         = rawFinding.provider;
      findingId        = rawFinding.findingId;
      originalSeverity;
      severity         = rawFinding.severity;
      title            = rawFinding.title;
      description      = rawFinding.description;
      assetId;
      assetType;
      accountId        = rawFinding.accountId;
      region           = rawFinding.region;
      timestamp        = rawFinding.timestamp;
      status           = #Open;
      owner            = null;
      customer;
      mitre;
      rawFindingId     = rawFinding.id;
      recurrenceCount  = 0;
      ingestionSource;
      enrichment       = null;
    };
  };

  /// Deduplicate an incoming alert against an existing (alertId → NormalizedAlert) list.
  /// Matches on provider + assetId + title (Open status).
  /// Returns (isNew, alertToStore):
  ///   - If match found: increment recurrenceCount, refresh timestamp, preserve id/status/owner.
  ///   - Otherwise: mark as new.
  public func deduplicateAlert(
    alerts   : [(Text, NormalizedAlert)],
    newAlert : NormalizedAlert,
  ) : (Bool, NormalizedAlert) {
    // Phase 2 dedup: provider + assetId + title for Open alerts
    for ((_, existing) in alerts.vals()) {
      let sameProvider = switch (existing.provider, newAlert.provider) {
        case (#AWS,   #AWS)   true;
        case (#Azure, #Azure) true;
        case (#GCP,   #GCP)   true;
        case _                false;
      };
      let sameTitle = Text.equal(existing.title, newAlert.title);
      let sameAsset = switch (existing.assetId, newAlert.assetId) {
        case (null, null) true;
        case (?a, ?b)     Text.equal(a, b);
        case _            false;
      };
      let isOpen = switch (existing.status) { case (#Open) true; case _ false };
      if (sameProvider and sameTitle and sameAsset and isOpen) {
        let updated : NormalizedAlert = {
          newAlert with
          id              = existing.id;
          status          = existing.status;
          owner           = existing.owner;
          timestamp       = newAlert.timestamp; // refresh to latest
          recurrenceCount = existing.recurrenceCount + 1;
        };
        return (false, updated);
      };
    };
    // Legacy dedup fallback: same findingId + provider
    for ((_, existing) in alerts.vals()) {
      let sameProvider = switch (existing.provider, newAlert.provider) {
        case (#AWS,   #AWS)   true;
        case (#Azure, #Azure) true;
        case (#GCP,   #GCP)   true;
        case _                false;
      };
      if (sameProvider and Text.equal(existing.findingId, newAlert.findingId)) {
        let updated : NormalizedAlert = {
          newAlert with
          id              = existing.id;
          status          = existing.status;
          owner           = existing.owner;
          timestamp       = newAlert.timestamp;
          recurrenceCount = existing.recurrenceCount + 1;
        };
        return (false, updated);
      };
    };
    (true, newAlert);
  };

  /// Return the MITRE ATT&CK tactic + technique for a finding using native
  /// provider data (GuardDuty / Defender) or a rules-based lookup table.
  public func getMitreTag(
    provider     : ProviderType,
    findingType  : Text,
    rawMetadata  : Text,
  ) : ?MitreTag {
    // 1. Try to extract pre-populated MITRE fields from rawMetadata (Defender / GuardDuty embed them)
    let tactic    = extractField(rawMetadata, "mitreTactic");
    let technique = extractField(rawMetadata, "mitreTechnique");
    let techId    = extractField(rawMetadata, "mitreTechniqueId");

    switch (tactic, technique, techId) {
      case (?t, ?te, ?tid) {
        return ?{ tactic = t; technique = te; techniqueId = tid };
      };
      case _ {};
    };

    // 2. Rules-based fallback lookup table keyed on provider + keyword in findingType
    let lower = findingType.toLower();
    let provText = switch provider { case (#AWS) "aws"; case (#Azure) "azure"; case (#GCP) "gcp" };
    ignore provText; // used implicitly via lower keyword matching

    // GuardDuty-style mapping
    if (lower.contains(#text "trojan") or lower.contains(#text "malware")) {
      return ?{ tactic = "Execution"; technique = "User Execution"; techniqueId = "T1204" };
    };
    if (lower.contains(#text "recon") or lower.contains(#text "discovery")) {
      return ?{ tactic = "Discovery"; technique = "Cloud Service Discovery"; techniqueId = "T1526" };
    };
    if (lower.contains(#text "exfil") or lower.contains(#text "dns")) {
      return ?{ tactic = "Exfiltration"; technique = "Exfiltration Over Alternative Protocol"; techniqueId = "T1048" };
    };
    if (lower.contains(#text "credential") or lower.contains(#text "iam") or lower.contains(#text "privilege")) {
      return ?{ tactic = "Privilege Escalation"; technique = "Valid Accounts"; techniqueId = "T1078" };
    };
    if (lower.contains(#text "persist") or lower.contains(#text "backdoor")) {
      return ?{ tactic = "Persistence"; technique = "Create Account"; techniqueId = "T1136" };
    };
    if (lower.contains(#text "lateral") or lower.contains(#text "movement")) {
      return ?{ tactic = "Lateral Movement"; technique = "Remote Services"; techniqueId = "T1021" };
    };
    if (lower.contains(#text "impact") or lower.contains(#text "ransom") or lower.contains(#text "crypto")) {
      return ?{ tactic = "Impact"; technique = "Data Encrypted for Impact"; techniqueId = "T1486" };
    };
    if (lower.contains(#text "command") or lower.contains(#text "c2") or lower.contains(#text "beacon")) {
      return ?{ tactic = "Command and Control"; technique = "Application Layer Protocol"; techniqueId = "T1071" };
    };
    // Defender / Azure-specific keywords
    if (lower.contains(#text "brute") or lower.contains(#text "spray") or lower.contains(#text "password")) {
      return ?{ tactic = "Credential Access"; technique = "Brute Force"; techniqueId = "T1110" };
    };
    if (lower.contains(#text "phish") or lower.contains(#text "spear")) {
      return ?{ tactic = "Initial Access"; technique = "Phishing"; techniqueId = "T1566" };
    };
    null;
  };

  // ── Private helpers ───────────────────────────────────────────────────────

  /// Extract a value from a flat key=value or key":"value metadata string.
  func extractField(metadata : Text, key : Text) : ?Text {
    // Try JSON-style: "key":"value" or "key": "value"
    let jsonKey = "\"" # key # "\"";
    if (metadata.contains(#text jsonKey)) {
      let parts = metadata.split(#text jsonKey);
      var afterKey = "";
      var found = false;
      for (part in parts) {
        if (found and afterKey == "") {
          afterKey := part;
        };
        if (not found) found := true;
      };
      if (afterKey != "") {
        // Strip leading ":" or ": ", then extract up to next quote or comma
        let stripped = afterKey.trimStart(#char ' ');
        let stripped2 = stripped.trimStart(#char ':');
        let stripped3 = stripped2.trimStart(#char ' ');
        if (stripped3.startsWith(#text "\"")) {
          let inner = stripped3.trimStart(#text "\"");
          let endParts = inner.split(#text "\"");
          var first = true;
          for (seg in endParts) {
            if (first) { return ?seg };
            first := false;
          };
        };
      };
    };
    null;
  };
};
