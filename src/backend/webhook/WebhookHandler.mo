import Text "mo:core/Text";
import Int "mo:core/Int";
import Types "../types/common";

module {

  public type Severity = Types.Severity;

  /// Intermediate extracted finding before normalization
  public type ExtractedFinding = {
    resourceId     : Text;
    cloudProvider  : Text;
    attackVector   : Text;
    timestamp      : Text;   // ISO 8601 Text
    severity       : Severity;
    accountId      : Text;
    region         : Text;
  };

  // ── Private helpers ────────────────────────────────────────────────────────

  /// Extract the first JSON string value for a key from a flat JSON body.
  /// Handles both `"key":"value"` and `"key": "value"` forms.
  func extractStr(json : Text, key : Text) : ?Text {
    let needle1 = "\"" # key # "\":\"";
    let needle2 = "\"" # key # "\": \"";
    func findIn(src : Text, needle : Text) : ?Text {
      let parts = src.split(#text needle);
      var idx = 0;
      var after = "";
      for (p in parts) {
        if (idx == 1) { after := p };
        idx += 1;
      };
      if (idx < 2) return null;
      let valueParts = after.split(#text "\"");
      var first = true;
      for (vp in valueParts) {
        if (first) { return ?vp };
        first := false;
      };
      null;
    };
    switch (findIn(json, needle1)) {
      case (?v) ?v;
      case null  findIn(json, needle2);
    };
  };

  /// Extract the first JSON number value (as Text) for a key.
  func extractNum(json : Text, key : Text) : ?Text {
    let needle1 = "\"" # key # "\":";
    let needle2 = "\"" # key # "\": ";
    func findIn(src : Text, needle : Text) : ?Text {
      let parts = src.split(#text needle);
      var idx = 0;
      var after = "";
      for (p in parts) {
        if (idx == 1) { after := p };
        idx += 1;
      };
      if (idx < 2) return null;
      // Skip leading whitespace
      let trimmed = after.trimStart(#char ' ');
      // Read digits until non-digit (comma, space, closing brace, dot)
      var result = "";
      for (c in trimmed.chars()) {
        if ((c >= '0' and c <= '9') or c == '.') {
          result := result # Text.fromChar(c);
        };
      };
      if (result == "") null else ?result;
    };
    switch (findIn(json, needle1)) {
      case (?v) ?v;
      case null  findIn(json, needle2);
    };
  };

  /// Extract a value from a path like "a.b.c" by progressive substring search.
  /// Each segment narrows the search context to the substring after the key.
  func extractPath(json : Text, path : [Text]) : ?Text {
    if (path.size() == 0) return null;
    var ctx = json;
    var i = 0;
    while (i < path.size()) {
      let key = path[i];
      if (i + 1 == path.size()) {
        // Last segment — extract string value
        switch (extractStr(ctx, key)) {
          case (?v) { return ?v };
          case null { return null };
        };
      } else {
        // Intermediate segment — narrow context to after the key
        let needle = "\"" # key # "\"";
        let parts = ctx.split(#text needle);
        var found = false;
        var rest = "";
        for (p in parts) {
          if (found and rest == "") { rest := p };
          if (not found) found := true;
        };
        if (rest == "") return null;
        ctx := rest;
      };
      i += 1;
    };
    null;
  };

  /// Map a GuardDuty numeric severity (1-10) to our Severity variant.
  func mapGuardDutySeverity(numText : Text) : Severity {
    // Parse integer part only
    var num = 0;
    for (c in numText.chars()) {
      if (c >= '0' and c <= '9') {
        num := num * 10 + (Int.abs(Text.fromChar(c).size()) - 1);
      };
    };
    // Simpler: compare text prefix
    let t = numText.trimStart(#char ' ');
    if (t.startsWith(#text "10") or t.startsWith(#text "9")) #Critical
    else if (t.startsWith(#text "8") or t.startsWith(#text "7")) #High
    else if (t.startsWith(#text "6") or t.startsWith(#text "5") or t.startsWith(#text "4")) #Medium
    else #Low;
  };

  /// Map Azure Defender severity string to our Severity variant.
  func mapAzureSeverity(s : Text) : Severity {
    let lower = s.toLower();
    if (lower == "high")          #High
    else if (lower == "medium")   #Medium
    else if (lower == "low")      #Low
    else                          #Low; // Informational → Low
  };

  /// Map GCP SCC severity string to our Severity variant.
  func mapGcpSeverity(s : Text) : Severity {
    let upper = s.toUpper();
    if (upper == "CRITICAL")      #Critical
    else if (upper == "HIGH")     #High
    else if (upper == "MEDIUM")   #Medium
    else                          #Low; // MINIMAL/LOW → Low
  };

  /// Extract subscription ID from an Azure resource ID.
  /// Format: /subscriptions/{subId}/...
  func extractAzureSubscriptionId(resourceId : Text) : Text {
    let marker = "/subscriptions/";
    let parts = resourceId.split(#text marker);
    var idx = 0;
    var result = "";
    for (p in parts) {
      if (idx == 1) {
        // Now split on next slash to isolate the subscription ID
        let subParts = p.split(#text "/");
        var first = true;
        for (sp in subParts) {
          if (first) { result := sp };
          first := false;
        };
      };
      idx += 1;
    };
    result;
  };

  /// Extract project ID from a GCP resource name.
  /// Format: //cloudresourcemanager.googleapis.com/projects/{projectId}/...
  /// or: projects/{projectId}/...
  func extractGcpProjectId(resourceName : Text) : Text {
    let marker1 = "/projects/";
    let parts = resourceName.split(#text marker1);
    var idx = 0;
    var result = "";
    for (p in parts) {
      if (idx == 1) {
        let subParts = p.split(#text "/");
        var first = true;
        for (sp in subParts) {
          if (first) { result := sp };
          first := false;
        };
      };
      idx += 1;
    };
    result;
  };

  // ── Public parse functions ─────────────────────────────────────────────────

  /// Parse a native AWS GuardDuty webhook payload (EventBridge format).
  /// Returns ExtractedFinding or an error message.
  public func parseGuardDutyPayload(body : Text) : { #ok : ExtractedFinding; #err : Text } {
    // Try instanceId first, then S3 bucket name
    let resourceId : Text = switch (extractPath(body, ["detail", "resource", "instanceDetails", "instanceId"])) {
      case (?v) v;
      case null {
        switch (extractPath(body, ["detail", "resource", "s3BucketDetails", "name"])) {
          case (?v) v;
          case null {
            // Fall back to accountId as resource identifier
            switch (extractPath(body, ["detail", "accountId"])) {
              case (?v) v;
              case null { return #err("GuardDuty: missing resource identifier") };
            };
          };
        };
      };
    };

    let attackVector : Text = switch (extractPath(body, ["detail", "type"])) {
      case (?v) v;
      case null { return #err("GuardDuty: missing detail.type") };
    };

    let timestamp : Text = switch (extractPath(body, ["detail", "updatedAt"])) {
      case (?v) v;
      case null { return #err("GuardDuty: missing detail.updatedAt") };
    };

    let severityNum : Text = switch (extractPath(body, ["detail", "severity"])) {
      case (?v) v;
      case null {
        // Try numeric field
        switch (extractNum(body, "severity")) {
          case (?v) v;
          case null { return #err("GuardDuty: missing detail.severity") };
        };
      };
    };

    let accountId : Text = switch (extractPath(body, ["detail", "accountId"])) {
      case (?v) v;
      case null "";
    };

    let region : Text = switch (extractPath(body, ["detail", "region"])) {
      case (?v) v;
      case null "";
    };

    #ok({
      resourceId;
      cloudProvider = "AWS";
      attackVector;
      timestamp;
      severity = mapGuardDutySeverity(severityNum);
      accountId;
      region;
    });
  };

  /// Parse a native Azure Defender webhook payload (Event Grid format).
  public func parseAzureDefenderPayload(body : Text) : { #ok : ExtractedFinding; #err : Text } {
    let resourceId : Text = switch (extractPath(body, ["properties", "compromisedEntity"])) {
      case (?v) v;
      case null { return #err("Azure: missing properties.compromisedEntity") };
    };

    let attackVector : Text = switch (extractPath(body, ["properties", "alertType"])) {
      case (?v) v;
      case null { return #err("Azure: missing properties.alertType") };
    };

    let timestamp : Text = switch (extractPath(body, ["properties", "timeGeneratedUtc"])) {
      case (?v) v;
      case null { return #err("Azure: missing properties.timeGeneratedUtc") };
    };

    let severityStr : Text = switch (extractPath(body, ["properties", "severity"])) {
      case (?v) v;
      case null { return #err("Azure: missing properties.severity") };
    };

    // Extract subscription ID from the top-level "id" field
    let subscriptionId : Text = switch (extractStr(body, "id")) {
      case (?v) extractAzureSubscriptionId(v);
      case null "";
    };

    let region : Text = switch (extractPath(body, ["properties", "resourceIdentifiers", "location"])) {
      case (?v) v;
      case null "";
    };

    #ok({
      resourceId;
      cloudProvider = "Azure";
      attackVector;
      timestamp;
      severity = mapAzureSeverity(severityStr);
      accountId = subscriptionId;
      region;
    });
  };

  /// Parse a native GCP Security Command Center webhook payload (Pub/Sub format).
  public func parseGcpSccPayload(body : Text) : { #ok : ExtractedFinding; #err : Text } {
    let resourceName : Text = switch (extractPath(body, ["finding", "resourceName"])) {
      case (?v) v;
      case null { return #err("GCP SCC: missing finding.resourceName") };
    };

    let attackVector : Text = switch (extractPath(body, ["finding", "category"])) {
      case (?v) v;
      case null { return #err("GCP SCC: missing finding.category") };
    };

    let timestamp : Text = switch (extractPath(body, ["finding", "eventTime"])) {
      case (?v) v;
      case null { return #err("GCP SCC: missing finding.eventTime") };
    };

    let severityStr : Text = switch (extractPath(body, ["finding", "severity"])) {
      case (?v) v;
      case null "LOW";
    };

    let projectId : Text = extractGcpProjectId(resourceName);

    let region : Text = switch (extractPath(body, ["finding", "sourceProperties", "location"])) {
      case (?v) v;
      case null "";
    };

    #ok({
      resourceId    = resourceName;
      cloudProvider = "GCP";
      attackVector;
      timestamp;
      severity = mapGcpSeverity(severityStr);
      accountId = projectId;
      region;
    });
  };

};
